import { describe, expect, it } from "vitest";
import { applySecurityHeaders, escapeHtmlNullBytes } from "@/server";

describe("răspunsurile HTML pentru WebKit", () => {
  it("înlocuiește octeții NUL din stream cu o secvență JavaScript validă", async () => {
    const response = new Response('<script>const id="root\0child"</script>', {
      headers: { "content-type": "text/html; charset=utf-8", "content-length": "42" },
    });

    const sanitized = escapeHtmlNullBytes(response);

    expect(await sanitized.text()).toBe('<script>const id="root\\u0000child"</script>');
    expect(sanitized.headers.has("content-length")).toBe(false);
  });

  it("nu modifică răspunsurile care nu sunt HTML", async () => {
    const response = new Response("a\0b", {
      headers: { "content-type": "application/octet-stream" },
    });
    const untouched = escapeHtmlNullBytes(response);

    expect(await untouched.arrayBuffer()).toEqual(await new Response("a\0b").arrayBuffer());
  });
});

describe("headerele de securitate SSR", () => {
  it("protejează răspunsurile publice împotriva încadrării și tipurilor interpretate", () => {
    const response = applySecurityHeaders(
      new Response("ok", { headers: { "cache-control": "public, max-age=60" } }),
      "https://blank-atelier-canvas.lovable.app/",
    );

    expect(response.headers.get("content-security-policy")).toContain("frame-ancestors 'none'");
    expect(response.headers.get("content-security-policy")).not.toContain("'unsafe-eval'");
    expect(response.headers.get("x-frame-options")).toBe("DENY");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(response.headers.get("permissions-policy")).toContain("camera=()");
    expect(response.headers.get("cache-control")).toBe("public, max-age=60");
  });

  it("permite doar editorului Lovable să încadreze domeniul de preview", () => {
    const response = applySecurityHeaders(
      new Response("preview"),
      "https://id-preview--project-id.lovable.app/",
    );
    const policy = response.headers.get("content-security-policy");

    expect(policy).toContain("frame-ancestors https://lovable.dev https://*.lovable.dev");
    expect(policy).not.toContain("frame-ancestors 'none'");
    expect(response.headers.has("x-frame-options")).toBe(false);
  });

  it("nu forțează HTTPS pentru resursele din mediul local", () => {
    const response = applySecurityHeaders(new Response("local"), "http://localhost:4175/");
    const policy = response.headers.get("content-security-policy");

    expect(policy).not.toContain("upgrade-insecure-requests");
    expect(response.headers.has("strict-transport-security")).toBe(false);
    expect(response.headers.get("x-frame-options")).toBe("DENY");
  });
});
