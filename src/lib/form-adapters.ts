import { z } from "zod";
import { LEGAL, externalConfig } from "./site";

export const contactPayloadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().max(150).default("Mesaj client Trei Linii"),
  message: z.string().trim().min(10).max(5_000),
});

export type ContactPayload = z.infer<typeof contactPayloadSchema>;

function contactEndpoint(value: string) {
  if (!value) return null;

  const parsed = z.string().url().safeParse(value);
  if (!parsed.success) return null;
  const url = new URL(parsed.data);
  return url.protocol === "https:" ? url.toString() : null;
}

export function createContactAdapter({
  endpoint: endpointValue,
  email,
  fetchImpl = fetch,
  timeoutMs = 10_000,
}: {
  endpoint: string;
  email: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}) {
  const endpoint = contactEndpoint(endpointValue);

  return {
    endpointConfigured: Boolean(endpoint),
    channelConfigured: Boolean(endpoint || email),
    async submit(payload: ContactPayload) {
      const validPayload = contactPayloadSchema.parse(payload);
      if (!endpoint) {
        if (!email) throw new Error("Canalul de contact nu este configurat.");
        const body = [
          `Nume: ${validPayload.name}`,
          `Email: ${validPayload.email}`,
          "",
          validPayload.message,
        ].join("\n");
        return {
          kind: "mailto" as const,
          href: `mailto:${email}?subject=${encodeURIComponent(validPayload.subject)}&body=${encodeURIComponent(body)}`,
        };
      }

      const controller = new AbortController();
      const timeout = globalThis.setTimeout(() => controller.abort(), timeoutMs);
      try {
        const response = await fetchImpl(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validPayload),
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Mesajul nu a putut fi trimis.");
        return { kind: "sent" as const };
      } finally {
        globalThis.clearTimeout(timeout);
      }
    },
  };
}

const contactAdapter = createContactAdapter({
  endpoint: externalConfig.forms.contactEndpoint,
  email: LEGAL.email,
});

export function isContactEndpointConfigured() {
  return contactAdapter.endpointConfigured;
}

export function isContactChannelConfigured() {
  return contactAdapter.channelConfigured;
}

export async function submitContact(payload: ContactPayload) {
  return contactAdapter.submit(payload);
}
