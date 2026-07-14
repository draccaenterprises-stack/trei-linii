import { describe, expect, it } from "vitest";
import { CONSENT_KEY, createConsent, readConsent, writeConsent } from "@/lib/consent";

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  };
}

describe("consimtamant cookies", () => {
  it("salveaza preferintele pe categorii si versiune", () => {
    const storage = memoryStorage();
    const consent = createConsent({ analytics: true, marketing: false });
    writeConsent(consent, storage);

    expect(readConsent(storage)).toMatchObject({
      essential: true,
      analytics: true,
      marketing: false,
      version: 1,
    });
    expect(storage.getItem(CONSENT_KEY)).toContain('"version":1');
  });

  it("respinge o versiune veche sau continut corupt", () => {
    const storage = memoryStorage();
    storage.setItem(CONSENT_KEY, JSON.stringify({ version: 0, analytics: true }));
    expect(readConsent(storage)).toBeNull();
  });
});
