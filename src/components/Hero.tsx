import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import heroImg from "@/assets/hero.jpg";
import { useCart } from "@/lib/cart-context";
import { formatRON } from "@/lib/format";
import type { Product, Size } from "@/lib/mock-data";
import { getStockForColor } from "@/lib/shopify";
import { useSite } from "@/lib/site-context";

function CtaLink({
  href,
  children,
  variant,
}: {
  href: string;
  children: React.ReactNode;
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

function firstAvailableSelection(product: Product): { color: string; size: Size } | null {
  for (const color of product.colors) {
    const stock = getStockForColor(product, color.name);
    const size = product.sizes.find((item) => stock[item] > 0);
    if (size) return { color: color.name, size };
  }

  return null;
}

export function Hero({ products = [] }: { products?: Product[] }) {
  const {
    heroEyebrow,
    heroHeadline,
    heroSubcopy,
    heroPrimaryCtaText,
    heroPrimaryCtaLink,
    heroSecondaryCtaText,
    heroSecondaryCtaLink,
    heroBadges,
  } = useSite();
  const { addItem } = useCart();
  const slides = products.slice(0, 3);
  const [active, setActive] = useState(0);
  const activeProduct = slides[active];
  const activeSelection = useMemo(
    () => (activeProduct ? firstAvailableSelection(activeProduct) : null),
    [activeProduct],
  );
  const activeImage = activeProduct?.images[1] ?? activeProduct?.images[0] ?? heroImg;
  const canAdd = Boolean(activeProduct && activeSelection);

  const moveSlide = (direction: -1 | 1) => {
    if (!slides.length) return;
    setActive((current) => (current + direction + slides.length) % slides.length);
  };

  const handleAddHeroProduct = () => {
    if (!activeProduct || !activeSelection) return;
    addItem(activeProduct, activeSelection.size, activeSelection.color);
  };

  return (
    <section className="relative">
      <div className="grid md:grid-cols-12 min-h-[80vh] md:min-h-[88vh]">
        <div className="md:col-span-5 px-5 md:px-10 py-12 md:py-20 flex flex-col justify-between">
          <div className="fade-up reveal-delay-1 font-mono-xs opacity-60">{heroEyebrow}</div>
          <div>
            <h1 className="fade-up reveal-delay-2 font-display text-[12vw] md:text-[6.5vw] leading-[0.9] whitespace-pre-line [text-wrap:balance]">
              {heroHeadline}
            </h1>
            <p className="fade-up reveal-delay-3 mt-8 max-w-md text-base md:text-lg leading-relaxed text-muted-foreground">
              {heroSubcopy}
            </p>
            <div className="fade-up reveal-delay-4 mt-10 flex flex-wrap items-center gap-4">
              <CtaLink href={heroPrimaryCtaLink} variant="primary">
                {heroPrimaryCtaText}
              </CtaLink>
              <CtaLink href={heroSecondaryCtaLink} variant="secondary">
                {heroSecondaryCtaText}
              </CtaLink>
            </div>
          </div>
          <div className="fade-up reveal-delay-4 font-mono-xs opacity-50 hidden md:block">
            {heroBadges}
          </div>
        </div>

        <div className="md:col-span-7 relative hero-media min-h-[70vh] md:min-h-full overflow-hidden">
          <img
            src={activeImage}
            alt={
              activeProduct
                ? `${activeProduct.title} - produs Trei Linii`
                : "Model purtand un tricou oversized Trei Linii intr-un cadru urban"
            }
            width={1600}
            height={1200}
            fetchPriority="high"
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          />
          <div className="absolute inset-x-0 bottom-0 p-5 md:p-8 bg-gradient-to-t from-charcoal/80 via-charcoal/35 to-transparent text-cream">
            {activeProduct ? (
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
                <div>
                  <p className="font-mono-xs opacity-70">
                    {slides.length > 1 ? `0${active + 1} / 0${slides.length}` : "Produs recomandat"}
                  </p>
                  <h2 className="mt-2 font-display text-3xl md:text-5xl">{activeProduct.title}</h2>
                  <p className="mt-2 font-mono-xs opacity-80">
                    {activeSelection
                      ? `${activeSelection.color} / ${activeSelection.size} · ${formatRON(activeProduct.price)}`
                      : `Stoc epuizat · ${formatRON(activeProduct.price)}`}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={!canAdd}
                  onClick={handleAddHeroProduct}
                  className="inline-flex w-fit items-center gap-2 bg-cream text-charcoal px-5 py-3 font-mono-xs hover:bg-cream/90 transition-colors disabled:opacity-50"
                >
                  <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
                  {canAdd ? "Adauga in cos" : "Stoc epuizat"}
                </button>
              </div>
            ) : (
              <div className="font-mono-xs">Design pe spate · Croiala oversized</div>
            )}
          </div>

          {slides.length > 1 && (
            <>
              <div className="absolute top-5 right-5 flex border border-cream/40 bg-charcoal/45 backdrop-blur">
                <button
                  type="button"
                  onClick={() => moveSlide(-1)}
                  className="h-10 w-10 grid place-items-center text-cream hover:bg-cream hover:text-charcoal transition-colors"
                  aria-label="Slide anterior"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={() => moveSlide(1)}
                  className="h-10 w-10 grid place-items-center text-cream border-l border-cream/40 hover:bg-cream hover:text-charcoal transition-colors"
                  aria-label="Slide urmator"
                >
                  <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>

              <div className="absolute top-5 left-5 flex gap-2">
                {slides.map((product, index) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => setActive(index)}
                    className={`h-1.5 w-8 transition-colors ${
                      index === active ? "bg-cream" : "bg-cream/35"
                    }`}
                    aria-label={`Deschide slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
