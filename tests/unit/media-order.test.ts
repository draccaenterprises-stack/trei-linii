import { describe, expect, it } from "vitest";
import { findVectorImage, getPhotoImages, isVectorMedia, sortMediaPhotosFirst } from "@/lib/shopify";

const media = [
  { url: "https://cdn.shopify.com/design.svg", alt: "vector textile deschise" },
  { url: "https://cdn.shopify.com/purtat-1.webp", alt: "Tricou purtat, față" },
  { url: "https://cdn.shopify.com/design-dark.svg", alt: "vector textile închise" },
  { url: "https://cdn.shopify.com/purtat-2.webp", alt: "Tricou purtat, spate" },
];

describe("ordinea media", () => {
  it("detectează vectorii după extensie sau alt text", () => {
    expect(isVectorMedia({ url: "https://x/a.svg", alt: "" })).toBe(true);
    expect(isVectorMedia({ url: "https://x/a.webp", alt: "Vector izolat" })).toBe(true);
    expect(isVectorMedia({ url: "https://x/a.webp?v=2", alt: "Tricou purtat" })).toBe(false);
  });

  it("pune fotografiile purtate înaintea vectorilor păstrând ordinea relativă", () => {
    expect(sortMediaPhotosFirst(media).map((item) => item.url)).toEqual([
      "https://cdn.shopify.com/purtat-1.webp",
      "https://cdn.shopify.com/purtat-2.webp",
      "https://cdn.shopify.com/design.svg",
      "https://cdn.shopify.com/design-dark.svg",
    ]);
  });

  it("returnează doar fotografii pentru carduri și galerie", () => {
    const product = { media, images: media.map((item) => item.url) };
    expect(getPhotoImages(product)).toEqual([
      "https://cdn.shopify.com/purtat-1.webp",
      "https://cdn.shopify.com/purtat-2.webp",
    ]);
  });

  it("revine la toate imaginile când există doar vectori", () => {
    const onlyVectors = [{ url: "https://cdn.shopify.com/design.svg", alt: "vector" }];
    expect(getPhotoImages({ media: onlyVectors, images: [onlyVectors[0]!.url] })).toEqual([
      "https://cdn.shopify.com/design.svg",
    ]);
  });

  it("alege vectorul potrivit contrastului după alt text, ignorând diacriticele", () => {
    expect(findVectorImage({ media }, "textile deschise")).toBe(
      "https://cdn.shopify.com/design.svg",
    );
    expect(findVectorImage({ media }, "textile inchise")).toBe(
      "https://cdn.shopify.com/design-dark.svg",
    );
  });
});
