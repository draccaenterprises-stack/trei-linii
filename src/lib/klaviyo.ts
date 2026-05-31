// Klaviyo client-side list subscription.
// Uses the public Client API (company_id is a public site id, safe in the browser).
// No server needed, which keeps the Lovable static frontend simple.

const COMPANY_ID = (import.meta.env.VITE_KLAVIYO_COMPANY_ID as string | undefined) ?? "W7dmRC";
const LIST_ID = (import.meta.env.VITE_KLAVIYO_LIST_ID as string | undefined) ?? "XRJZd4";
const REVISION = "2024-10-15";

/**
 * Subscribes an email to the configured Klaviyo list.
 * Resolves on success (HTTP 202). Throws on any failure so the
 * caller can show an error state.
 */
export async function subscribeToKlaviyo(email: string): Promise<void> {
  if (!COMPANY_ID || !LIST_ID) {
    throw new Error("Klaviyo nu este configurat (lipseste company id sau list id).");
  }

  const res = await fetch(`https://a.klaviyo.com/client/subscriptions/?company_id=${COMPANY_ID}`, {
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
  });

  // The client subscriptions endpoint returns 202 Accepted with no body on success.
  if (res.status !== 202 && !res.ok) {
    throw new Error(`Klaviyo subscribe failed: ${res.status}`);
  }
}
