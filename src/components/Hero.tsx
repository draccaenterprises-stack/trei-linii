import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import heroImg from "@/assets/hero.jpg";
import lookbookOne from "@/assets/lookbook-1.jpg";
import lookbookTwo from "@/assets/lookbook-2.jpg";
import productDetail from "@/assets/product-2b.jpg";
import type { Product } from "@/lib/mock-data";
import { useSite } from "@/lib/site-context";

function CtaLink({
  href,
  children,
  variant,
}: {
  href: string;
  children: ReactNode;
  variant: "primary" | "secondary";
}) {
  const className =
    variant === "primary"
      ? "inline-flex items-center gap-2 bg-charcoal text-cream px-6 py-3 font-mono-xs hover:bg-charcoal/90 transition-colors"
      : "font-mono-xs hover:opacity-60 underline underline-offset-4";

  if (href.startsWith("#")) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  );
}

export function Hero({ products = [] }: { products?: Product[] }) {
  void products;
  const fallbackSlides = useMemo(
    () => [
      { src: heroImg, alt: "Model purtand un tricou oversized Trei Linii intr-un cadru urban" },
      { src: lookbookOne, alt: "Cadru lookbook Trei Linii cu tricou oversized" },
      { src: lookbookTwo, alt: "Styling urban Trei Linii pentru tricou cu design pe spate" },
      { src: productDetail, alt: "Detaliu tricou Trei Linii cu print pe spate" },
    ],
    [],
  );
  const slides = fallbackSlides;
  const [activeSlide, setActiveSlide] = useState(0);
  const {
    heroEyebrow,
    heroHeadline,
    heroPrimaryCtaText,
    heroPrimaryCtaLink,
    heroSecondaryCtaText,
    heroSecondaryCtaLink,
  } = useSite();

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
      <div className="absolute right-5 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-3 md:flex">
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
      <div className="relative mx-auto flex min-h-[90vh] max-w-[1600px] items-end px-5 pb-[8vh] md:px-10">
        <div className="max-w-5xl">
          <p className="fade-up reveal-delay-1 font-mono-xs text-[#ff006f]">{heroEyebrow}</p>
          <h1 className="fade-up reveal-delay-2 mt-4 font-display text-[18vw] font-medium leading-[1.02] md:text-[8vw] md:max-w-5xl whitespace-pre-line [text-wrap:balance]">
            {heroHeadline}
          </h1>
          <div className="fade-up reveal-delay-3 mt-8 flex flex-wrap items-center gap-5">
            <CtaLink href={heroPrimaryCtaLink} variant="primary">
              {heroPrimaryCtaText}
            </CtaLink>
            <CtaLink href={heroSecondaryCtaLink} variant="secondary">
              {heroSecondaryCtaText} →
            </CtaLink>
          </div>
        </div>
      </div>
    </section>
  );
}
