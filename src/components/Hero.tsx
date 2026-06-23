import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import heroImg from "@/assets/hero.jpg";
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
  const {
    heroEyebrow,
    heroHeadline,
    heroPrimaryCtaText,
    heroPrimaryCtaLink,
    heroSecondaryCtaText,
    heroSecondaryCtaLink,
  } = useSite();

  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-charcoal text-cream">
      <div className="hero-media absolute inset-0">
        <img
          src={heroImg}
          alt="Model purtand un tricou oversized Trei Linii intr-un cadru urban"
          width={1600}
          height={1200}
          fetchPriority="high"
          loading="eager"
          className="h-full w-full object-cover object-[50%_28%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/35 to-transparent" />
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
