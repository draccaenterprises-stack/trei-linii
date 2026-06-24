import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import heroImg from "@/assets/hero.jpg";
import lookbookOne from "@/assets/lookbook-1.jpg";
import lookbookTwo from "@/assets/lookbook-2.jpg";
import productDetail from "@/assets/product-2b.jpg";
import type { Product } from "@/lib/mock-data";
import { useCart } from "@/lib/cart-context";
import { getStockForColor } from "@/lib/shopify";

const ctaBase = "inline-flex items-center justify-center px-6 py-3 font-mono-xs transition-colors";

export function Hero({ products = [] }: { products?: Product[] }) {
  const { addItem } = useCart();
  const mainProduct = products[0];
  const mainColor = mainProduct?.colors[0]?.name ?? "";
  const mainStock = mainProduct ? getStockForColor(mainProduct, mainColor) : null;
  const mainSize = mainProduct?.sizes.find((size) => mainStock && mainStock[size] > 0);
  const fallbackSlides = useMemo(
    () => [
      {
        src: heroImg,
        alt: "Model purtand un tricou oversized Trei Linii intr-un cadru urban",
        eyebrow: "Drop principal / 240gsm",
        title: "Tricoul main intra direct in cos.",
        text: "Prima piesa Trei Linii: fata curata, spate construit pe linii.",
        cta: "Adauga tricoul main",
        action: "cart" as const,
        align: "items-end",
        copy: "max-w-5xl",
      },
      {
        src: lookbookOne,
        alt: "Cadru lookbook Trei Linii cu tricou oversized",
        eyebrow: "Lookbook / oras",
        title: "Vezi cum cade tricoul in miscare.",
        text: "Cadre editoriale, fit oversized si spatele in prim-plan.",
        cta: "Vezi shop",
        action: "shop" as const,
        align: "items-start pt-[18vh]",
        copy: "max-w-4xl",
      },
      {
        src: lookbookTwo,
        alt: "Styling urban Trei Linii pentru tricou cu design pe spate",
        eyebrow: "Colectie / selectie",
        title: "Alege printul care ramane in spate.",
        text: "Modele compacte, bumbac dens si grafica gandita pentru rotatia zilnica.",
        cta: "Alege modelul",
        action: "shop" as const,
        align: "items-center",
        copy: "max-w-3xl md:ml-auto md:text-right",
      },
      {
        src: productDetail,
        alt: "Detaliu tricou Trei Linii cu print pe spate",
        eyebrow: "Detaliu / material",
        title: "240gsm, contur clar, fara zgomot.",
        text: "Materialul tine forma, iar printul pastreaza ritmul simplu al brandului.",
        cta: "Exploreaza shop",
        action: "shop" as const,
        align: "items-end",
        copy: "max-w-4xl",
      },
    ],
    [],
  );
  const slides = fallbackSlides;
  const [activeSlide, setActiveSlide] = useState(0);
  const active = slides[activeSlide];

  const addMainToCart = () => {
    if (!mainProduct || !mainSize || !mainColor) return;
    addItem(mainProduct, mainSize, mainColor);
  };

  useEffect(() => {
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
            <img
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              width={1600}
              height={1200}
              fetchPriority={index === 0 ? "high" : "auto"}
              loading={index === 0 ? "eager" : "lazy"}
              className="h-full min-h-full w-full shrink-0 object-cover object-[50%_28%]"
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/35 to-transparent" />
      </div>
      <div className="absolute right-4 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-3 md:right-5">
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setActiveSlide(index)}
            className={`h-12 w-1.5 transition-all ${
              index === activeSlide ? "bg-[#ff006f]" : "bg-cream/45 hover:bg-cream"
            }`}
            aria-label={`Schimba imaginea hero ${index + 1}`}
          />
        ))}
      </div>
      <div
        className={`relative mx-auto flex min-h-[90vh] max-w-[1600px] px-5 pb-[8vh] pr-12 md:px-10 ${active.align}`}
      >
        <div className={active.copy}>
          <p className="font-mono-xs text-[#ff006f]">{active.eyebrow}</p>
          <h1 className="mt-4 font-display text-[15vw] font-medium leading-[1.02] md:text-[7vw] whitespace-pre-line [text-wrap:balance]">
            {active.title}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-cream/78 md:text-lg">
            {active.text}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            {active.action === "cart" ? (
              <button
                type="button"
                onClick={addMainToCart}
                disabled={!mainProduct || !mainSize}
                className={`${ctaBase} bg-cream text-charcoal hover:bg-cream/90 disabled:opacity-50`}
              >
                {mainProduct && mainSize ? active.cta : "Stoc indisponibil"}
              </button>
            ) : (
              <Link to="/shop" className={`${ctaBase} bg-cream text-charcoal hover:bg-cream/90`}>
                {active.cta}
              </Link>
            )}
            <Link to="/shop" className="font-mono-xs underline underline-offset-4 hover:opacity-70">
              Toate produsele →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
