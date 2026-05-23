import { Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero.jpg";
import { useSite } from "@/lib/site-context";

export function Hero() {
  const { heroEyebrow, heroHeadline, heroSubcopy } = useSite();
  return (
    <section className="relative">
      <div className="grid md:grid-cols-12 min-h-[80vh] md:min-h-[88vh]">
        <div className="md:col-span-5 px-5 md:px-10 py-12 md:py-20 flex flex-col justify-between fade-up">
          <div className="font-mono-xs opacity-60">{heroEyebrow}</div>
          <div>
            <h1 className="font-display text-[12vw] md:text-[6.5vw] leading-[0.9] whitespace-pre-line">
              {heroHeadline}
            </h1>
            <p className="mt-8 max-w-md text-base md:text-lg leading-relaxed text-muted-foreground">
              {heroSubcopy}
            </p>
            <div className="mt-10 flex items-center gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-charcoal text-cream px-6 py-3 font-mono-xs hover:bg-charcoal/90 transition-colors"
              >
                Shop Volume I →
              </Link>
              <Link
                to="/lookbook"
                className="font-mono-xs hover:opacity-60 underline underline-offset-4"
              >
                See lookbook
              </Link>
            </div>
          </div>
          <div className="font-mono-xs opacity-50 hidden md:block">
            01 — Cotton 240gsm · Made in Portugal
          </div>
        </div>

        <div className="md:col-span-7 relative img-zoom min-h-[70vh] md:min-h-full">
          <img
            src={heroImg}
            alt="Model wearing the Atelier 01 Oversized Tee on an urban street"
            width={1600}
            height={1200}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute bottom-5 right-5 font-mono-xs text-cream bg-charcoal/70 backdrop-blur px-3 py-1.5">
            ATL/01 · CREAM
          </div>
        </div>
      </div>
    </section>
  );
}
