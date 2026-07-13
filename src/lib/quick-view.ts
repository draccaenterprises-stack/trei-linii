import type { Product } from "@/lib/mock-data";

const quickViewImageCache = new Set<string>();

export function preloadQuickViewImages(product: Pick<Product, "images">) {
  if (typeof window === "undefined") return;

  const sources = window.matchMedia("(hover: hover)").matches
    ? product.images
    : product.images.slice(0, 1);

  sources.forEach((src) => {
    if (quickViewImageCache.has(src)) return;
    quickViewImageCache.add(src);

    const image = new Image();
    image.decoding = "async";
    image.src = src;
    if (typeof image.decode === "function") {
      void image.decode().catch(() => undefined);
    }
  });
}
