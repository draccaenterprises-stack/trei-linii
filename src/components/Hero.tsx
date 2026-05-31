import { Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero.jpg";
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

export function Hero() {
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

        <div className="md:col-span-7 relative hero-media min-h-[70vh] md:min-h-full">
          <img
            src={heroImg}
            alt="Model purtand un tricou oversized Trei Linii intr-un cadru urban"
            width={1600}
            height={1200}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute bottom-5 right-5 font-mono-xs text-cream bg-charcoal/70 backdrop-blur px-3 py-1.5">
            Design pe spate · Croiala oversized
          </div>
        </div>
      </div>
    </section>
  );
}
