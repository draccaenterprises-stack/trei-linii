import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  applyTrackingConsent,
  resetAnalyticsForTests,
  setAnalyticsDebugSink,
  trackEvent,
} from "@/lib/analytics";

describe("analytics consent adapter", () => {
  beforeEach(() => resetAnalyticsForTests());
  afterEach(() => {
    resetAnalyticsForTests();
    document.cookie = "_ga=; Max-Age=0; path=/";
    document.cookie = "_fbp=; Max-Age=0; path=/";
  });

  it("nu emite niciun eveniment după refuz", () => {
    const sink = vi.fn();
    setAnalyticsDebugSink(sink);
    applyTrackingConsent({ analytics: false, marketing: false });
    trackEvent("view_item", { itemId: "p1", itemName: "Linie 01" });
    expect(sink).not.toHaveBeenCalled();
  });

  it("emite payloadul stabil după acord și deduplică purchase", () => {
    const sink = vi.fn();
    setAnalyticsDebugSink(sink);
    applyTrackingConsent({ analytics: true, marketing: false });
    trackEvent("add_to_cart", { itemId: "p1", quantity: 1, value: 189, currency: "RON" });
    trackEvent("purchase", { orderId: "order-1", value: 189, currency: "RON" });
    trackEvent("purchase", { orderId: "order-1", value: 189, currency: "RON" });

    expect(sink).toHaveBeenCalledTimes(2);
    expect(sink).toHaveBeenCalledWith("add_to_cart", {
      itemId: "p1",
      quantity: 1,
      value: 189,
      currency: "RON",
    });
  });

  it("revocă numai cookie-urile categoriei refuzate", () => {
    document.cookie = "_ga=analytics; path=/";
    document.cookie = "_fbp=marketing; path=/";

    applyTrackingConsent({ analytics: true, marketing: false });

    expect(document.cookie).toContain("_ga=analytics");
    expect(document.cookie).not.toContain("_fbp=marketing");
  });
});
