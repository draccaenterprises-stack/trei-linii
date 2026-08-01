import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { heroTriptych, heroCream, heroNight, heroStairs } from "@/lib/brand-images";

import type { Product } from "@/lib/catalog-types";
import { useCart } from "@/lib/cart-context";
import { canPurchaseProduct, getStockForColor } from "@/lib/shopify";
import { ResponsiveImage } from "@/components/ResponsiveImage";

const ctaBase = "inline-flex items-center justify-center px-6 py-3 font-mono-xs transition-colors";

export function Hero({ products = [] }: { products?: Product[] }) {
  const { addItem } = useCart();
  const mainProduct = products[0];
  const mainColor = mainProduct?.colors[0]?.name ?? "";
  const mainStock = mainProduct ? getStockForColor(mainProduct, mainColor) : null;
  const mainSize = mainProduct?.sizes.find((size) => mainStock && mainStock[size] > 0);
  const mainProductCanBePurchased = canPurchaseProduct(mainProduct);
  const fallbackSlides = useMemo(
    () => [
      {
        src: heroTriptych,
        alt: "Model purtând un tricou oversized Trei Linii într-un cadru urban",
        title: ["Piesa ", "semnătură", " intră direct în coș."],
        text: "Prima piesă Trei Linii: față curată, spate construit pe linii.",
        cta: "Adaugă piesa semnătură",

        action: "cart" as const,
        align: "items-end",
        copy: "max-w-5xl",
      },
      {
        src: heroCream,
        alt: "Tricou oversized crem Trei Linii, design pe spate, cadru arhitectural",
        title: ["Vezi cum cade tricoul în ", "mișcare", "."],
        text: "Cadre editoriale, fit oversized și spatele în prim-plan.",
        cta: "Vezi shop",
        action: "shop" as const,
        align: "items-start pt-[18vh]",
        copy: "max-w-4xl",
      },
      {
        src: heroNight,
        alt: "Tricou negru Trei Linii fotografiat seara în context urban",
        title: ["Alege printul care rămâne în ", "spate", "."],
        text: "Modele compacte și grafică gândită pentru rotația zilnică.",
        cta: "Alege modelul",
        action: "shop" as const,
        align: "items-center",
        copy: "max-w-3xl md:ml-auto md:text-right",
      },
      {
        src: heroStairs,
        alt: "Tricou olive Trei Linii pe scări de beton",
        title: ["Materialul dă ", "formă", ", designul dă ritmul."],
        text: "Fiecare piesă își prezintă materialul, croiala și detaliile înainte de comandă.",
        cta: "Explorează shopul",
        action: "shop" as const,
        align: "items-end",
        copy: "max-w-4xl",
      },
    ],
    [],
  );
  const slides = fallbackSlides;
  const [activeSlide, setActiveSlide] = useState(0);

  const addMainToCart = () => {
    if (!mainProduct || !mainSize || !mainColor) return;
    addItem(mainProduct, mainSize, mainColor);
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const id = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 4600);

    return () => window.clearInterval(id);
  }, [slides.length]);

  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-charcoal text-cream">
      <div className="hero-media absolute inset-0 overflow-hidden">
        <div
          className="flex h-full flex-col transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: `translateY(-${activeSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <ResponsiveImage
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              width={1600}
              height={1200}
              priority={index === 0}
              className={`h-full min-h-full w-full shrink-0 object-cover object-[50%_28%] ${
                index === activeSlide ? "hero-slide-active" : ""
              }`}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-charcoal/50" />
      </div>
      <div className="absolute right-4 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-2.5 md:right-6">
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setActiveSlide(index)}
            className="group flex h-12 w-6 items-center justify-end"
            aria-label={`Schimbă imaginea hero ${index + 1}`}
            aria-current={index === activeSlide ? "true" : undefined}
          >
            <span
              className={`block h-px transition-[width,background-color] duration-500 ${
                index === activeSlide
                  ? "w-6 bg-signature"
                  : "w-3 bg-cream/65 group-hover:w-5 group-hover:bg-cream"
              }`}
            />
          </button>
        ))}
      </div>
      <div className="absolute inset-0 z-[1]">
        {slides.map((slide, index) => {
          const isActive = index === activeSlide;

          return (
            <div
              key={`${slide.src}-copy`}
              aria-hidden={!isActive}
              inert={!isActive}
              className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isActive
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-3 opacity-0"
              }`}
            >
              <div
                className={`mx-auto flex min-h-[90vh] max-w-[1600px] px-5 pb-[8vh] pr-12 md:px-10 ${slide.align}`}
              >
                <div className={`w-full ${slide.copy}`}>
                  {/* Only the first slide is the document heading: a single H1 per page. */}
                  {index === 0 ? (
                    <h1 className="font-display text-6xl font-medium leading-[1.02] whitespace-pre-line [text-wrap:balance] sm:text-7xl md:text-8xl lg:text-9xl">
                      {slide.title[0]}
                      <span className="italic text-accent-text">{slide.title[1]}</span>
                      {slide.title[2]}
                    </h1>
                  ) : (
                    <p className="font-display text-6xl font-medium leading-[1.02] whitespace-pre-line [text-wrap:balance] sm:text-7xl md:text-8xl lg:text-9xl">
                      {slide.title[0]}
                      <span className="italic text-accent-text">{slide.title[1]}</span>
                      {slide.title[2]}
                    </p>
                  )}

                  <p className="mt-5 max-w-xl text-base leading-relaxed text-cream/78 md:text-lg">
                    {slide.text}
                  </p>
                  <div className="mt-8 flex flex-wrap items-center gap-5">
                    {slide.action === "cart" && mainProductCanBePurchased && mainSize ? (
                      <button
                        type="button"
                        onClick={addMainToCart}
                        className={`${ctaBase} bg-cream text-charcoal hover:bg-cream/90`}
                      >
                        {slide.cta}
                      </button>
                    ) : (
                      <Link
                        to="/shop"
                        className={`${ctaBase} bg-cream text-charcoal hover:bg-cream/90`}
                      >
                        {slide.action === "cart" ? "Vezi piesa în shop" : slide.cta}
                      </Link>
                    )}
                    <Link
                      to="/shop"
                      className="font-mono-xs underline underline-offset-4 hover:opacity-70"
                    >
                      Toate produsele →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
