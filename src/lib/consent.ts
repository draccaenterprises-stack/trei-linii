import { z } from "zod";

export const CONSENT_KEY = "trei-linii-cookie-consent-v1";
export const CONSENT_VERSION = 1;

export type ConsentPreferences = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  version: 1;
  updatedAt: string;
};

const consentSchema = z.object({
  essential: z.literal(true),
  analytics: z.boolean(),
  marketing: z.boolean(),
  version: z.literal(CONSENT_VERSION),
  updatedAt: z.string().datetime(),
});

export function createConsent(
  preferences: Pick<ConsentPreferences, "analytics" | "marketing">,
): ConsentPreferences {
  return {
    essential: true,
    analytics: preferences.analytics,
    marketing: preferences.marketing,
    version: CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
  };
}

export function readConsent(storage: Pick<Storage, "getItem"> = localStorage) {
  try {
    const raw = storage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = consentSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function writeConsent(
  consent: ConsentPreferences,
  storage: Pick<Storage, "setItem"> = localStorage,
) {
  storage.setItem(CONSENT_KEY, JSON.stringify(consent));
}
