import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self' mailto:",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: blob: https://cdn.shopify.com",
  "connect-src 'self' https://*.myshopify.com https://a.klaviyo.com https://www.google-analytics.com https://region1.google-analytics.com https://connect.facebook.net",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = {
  "Content-Security-Policy": contentSecurityPolicy,
  "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
  "Cross-Origin-Resource-Policy": "same-site",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(self)",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
} as const;

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry),
    );
  }
  return serverEntryPromise;
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

/** WebKit does not commit an HTML navigation containing literal NUL bytes. */
export function escapeHtmlNullBytes(response: Response): Response {
  const contentType = response.headers.get("content-type") ?? "";
  if (!response.body || !contentType.includes("text/html")) return response;

  const replacement = new TextEncoder().encode("\\u0000");
  const stream = response.body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        let nullCount = 0;
        for (const byte of chunk) {
          if (byte === 0) nullCount += 1;
        }

        if (!nullCount) {
          controller.enqueue(chunk);
          return;
        }

        const output = new Uint8Array(chunk.length + nullCount * (replacement.length - 1));
        let cursor = 0;
        for (const byte of chunk) {
          if (byte === 0) {
            output.set(replacement, cursor);
            cursor += replacement.length;
          } else {
            output[cursor] = byte;
            cursor += 1;
          }
        }
        controller.enqueue(output);
      },
    }),
  );
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(stream, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function isLovablePreview(url: string): boolean {
  const hostname = new URL(url).hostname;
  return hostname.startsWith("id-preview--") && hostname.endsWith(".lovable.app");
}

function isInsecureLoopback(url: string): boolean {
  const parsed = new URL(url);
  return (
    parsed.protocol === "http:" &&
    (parsed.hostname === "localhost" ||
      parsed.hostname === "127.0.0.1" ||
      parsed.hostname === "[::1]")
  );
}

export function applySecurityHeaders(response: Response, requestUrl: string): Response {
  const headers = new Headers(response.headers);
  const preview = isLovablePreview(requestUrl);
  const insecureLoopback = isInsecureLoopback(requestUrl);

  for (const [name, value] of Object.entries(securityHeaders)) {
    if (preview && name === "X-Frame-Options") continue;
    if (insecureLoopback && name === "Strict-Transport-Security") continue;

    const localValue =
      insecureLoopback && name === "Content-Security-Policy"
        ? value.replace(/; upgrade-insecure-requests(?:;|$)/, "")
        : value;

    headers.set(
      name,
      preview && name === "Content-Security-Policy"
        ? localValue.replace(
            "frame-ancestors 'none'",
            "frame-ancestors https://lovable.dev https://*.lovable.dev",
          )
        : localValue,
    );
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return applySecurityHeaders(
        escapeHtmlNullBytes(await normalizeCatastrophicSsrResponse(response)),
        request.url,
      );
    } catch (error) {
      console.error(error);
      return applySecurityHeaders(brandedErrorResponse(), request.url);
    }
  },
};
