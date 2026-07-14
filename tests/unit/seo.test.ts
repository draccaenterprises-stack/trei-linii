import { describe, expect, it } from "vitest";
import { pageMeta } from "@/lib/seo";

describe("metadata de rută", () => {
  it("creează canonical și Open Graph pentru ruta curentă", () => {
    const result = pageMeta({
      path: "/faq",
      title: "FAQ - Trei Linii",
      description: "Răspunsuri despre produse.",
    });

    expect(result.links).toEqual([
      { rel: "canonical", href: "https://blank-atelier-canvas.lovable.app/faq" },
    ]);
    expect(result.meta).toContainEqual({
      property: "og:url",
      content: "https://blank-atelier-canvas.lovable.app/faq",
    });
  });

  it("marchează rutele private noindex", () => {
    const result = pageMeta({
      path: "/cart",
      title: "Coș",
      description: "Coșul curent.",
      noIndex: true,
    });
    expect(result.meta).toContainEqual({ name: "robots", content: "noindex, nofollow" });
  });
});
