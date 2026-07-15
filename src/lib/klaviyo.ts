// Klaviyo client-side list subscription.
// Uses the public Client API (company_id is a public site id, safe in the browser).
// No server needed, which keeps the Lovable static frontend simple.

import { externalConfig } from "./site";

const COMPANY_ID = publicId(externalConfig.forms.klaviyoCompanyId);
const LIST_ID = publicId(externalConfig.forms.klaviyoListId);
const REVISION = "2024-10-15";

export function isKlaviyoConfigured(): boolean {
  return Boolean(COMPANY_ID && LIST_ID);
}

/**
 * Subscribes an email to the configured Klaviyo list.
 * Resolves on success (HTTP 202). Throws on any failure so the
 * caller can show an error state.
 */
export async function subscribeToKlaviyo(email: string): Promise<void> {
  if (!COMPANY_ID || !LIST_ID) {
    throw new Error("Klaviyo nu este configurat (lipseste company id sau list id).");
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(
      `https://a.klaviyo.com/client/subscriptions/?company_id=${COMPANY_ID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          revision: REVISION,
        },
        body: JSON.stringify({
          data: {
            type: "subscription",
            attributes: {
              profile: {
                data: {
                  type: "profile",
                  attributes: { email },
                },
              },
            },
            relationships: {
              list: { data: { type: "list", id: LIST_ID } },
            },
          },
        }),
        signal: controller.signal,
      },
    );

    if (res.status !== 202 && !res.ok) {
      throw new Error("Inscrierea nu a putut fi procesata.");
    }
  } finally {
    window.clearTimeout(timeout);
  }
}

function publicId(value?: string) {
  const trimmed = value?.trim();
  if (!trimmed || !/^[A-Za-z0-9_-]{3,80}$/.test(trimmed)) return undefined;

  return trimmed;
}
