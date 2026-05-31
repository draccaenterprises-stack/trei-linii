import { Link } from "@tanstack/react-router";
import * as React from "react";
import { CreditCard, RefreshCw, RotateCcw, Ruler, ShieldCheck, Truck } from "lucide-react";
import { subscribeToKlaviyo } from "@/lib/klaviyo";
import { lookbookImages, reviews } from "@/lib/mock-data";
import { useSite, type TrustItem } from "@/lib/site-context";

const trustIcons = [Ruler, ShieldCheck, RefreshCw, CreditCard, Truck, RotateCcw];

function visibleTrustItems(items: TrustItem[]) {
  return items.filter((item) => item.enabled).slice(0, 4);
}

export function TrustStrip() {
  const { siteMode, trustItemsPreLaunch, trustItemsLiveShop } = useSite();
  const items = visibleTrustItems(
    siteMode === "pre-launch" ? trustItemsPreLaunch : trustItemsLiveShop,
  );

  return (
    <section className="border-y border-border bg-background">
      <div className="mx-auto grid max-w-[1600px] md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
        {items.map((item, index) => {
          const Icon = trustIcons[index % trustIcons.length];
          return (
            <div key={item.id} className="px-5 md:px-10 py-6 flex gap-4">
              <Icon className="h-5 w-5 shrink-0" strokeWidth={1.25} />
              <div>
                <h3 className="font-mono-xs">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function BundleBanner() {
  const {
    siteMode,
    launchBannerEyebrow,
    launchBannerTitle,
    launchBannerCtaText,
    launchBannerCtaLink,
    liveBannerEyebrow,
    liveBannerTitle,
    liveBannerCtaText,
    liveBannerCtaLink,
  } = useSite();
  if (siteMode === "pre-launch") {
    return (
      <section className="px-5 md:px-10 py-12 md:py-16">
        <div className="mx-auto max-w-[1600px] border border-charcoal bg-charcoal text-cream px-5 md:px-10 py-8 md:py-10 grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8">
            <p className="font-mono-xs opacity-60">{launchBannerEyebrow}</p>
            <h2 className="font-display text-3xl md:text-5xl mt-2">{launchBannerTitle}</h2>
          </div>
          <div className="md:col-span-4 md:text-right">
            <a
              href={launchBannerCtaLink}
              className="inline-flex bg-cream text-charcoal px-6 py-3 font-mono-xs hover:bg-cream/90 transition-colors"
            >
              {launchBannerCtaText}
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-5 md:px-10 py-12 md:py-16">
      <div className="mx-auto max-w-[1600px] border border-charcoal bg-charcoal text-cream px-5 md:px-10 py-8 md:py-10 grid md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-8">
          <p className="font-mono-xs opacity-60">{liveBannerEyebrow}</p>
          <h2 className="font-display text-3xl md:text-5xl mt-2">{liveBannerTitle}</h2>
        </div>
        <div className="md:col-span-4 md:text-right">
          <a
            href={liveBannerCtaLink}
            className="inline-flex bg-cream text-charcoal px-6 py-3 font-mono-xs hover:bg-cream/90 transition-colors"
          >
            {liveBannerCtaText}
          </a>
        </div>
      </div>
    </section>
  );
}

export function Reviews() {
  const { reviewsEnabled } = useSite();
  if (!reviewsEnabled || reviews.length === 0) return null;

  return (
    <section className="px-5 md:px-10 py-20 md:py-32">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex items-end justify-between mb-12">
          <h2 className="font-display text-4xl md:text-6xl">Feedback clienti.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {reviews.map((r) => (
            <figure key={r.name} className="border-t border-border pt-6">
              <div className="font-mono-xs mb-4">{"*".repeat(r.rating)}</div>
              <blockquote className="font-display text-xl md:text-2xl leading-snug">
                "{r.text}"
              </blockquote>
              <figcaption className="font-mono-xs opacity-60 mt-6">
                {r.name} - {r.location}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Newsletter() {
  const {
    siteMode,
    newsletterEyebrowPreLaunch,
    newsletterEyebrowLiveShop,
    newsletterTitlePreLaunch,
    newsletterTitleLiveShop,
    newsletterBody,
    newsletterButtonText,
    newsletterSuccessText,
  } = useSite();
  const [status, setStatus] = React.useState<"idle" | "success" | "invalid" | "error">("idle");
  const [email, setEmail] = React.useState("");
  const [trap, setTrap] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (trap || loading) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("invalid");
      return;
    }
    setLoading(true);
    try {
      await subscribeToKlaviyo(email);
      // Local backup so a list is never silently lost if Klaviyo is unreachable.
      try {
        const stored = JSON.parse(
          localStorage.getItem("trei-linii-launch-list") ?? "[]",
        ) as string[];
        localStorage.setItem(
          "trei-linii-launch-list",
          JSON.stringify([...new Set([...stored, email])]),
        );
      } catch {
        /* best-effort backup */
      }
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="newsletter"
      className="px-5 md:px-10 py-20 md:py-32 bg-cream border-t border-border"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-mono-xs opacity-60">
          {siteMode === "pre-launch" ? newsletterEyebrowPreLaunch : newsletterEyebrowLiveShop}
        </p>
        <h2 className="font-display text-4xl md:text-6xl mt-4">
          {siteMode === "pre-launch" ? newsletterTitlePreLaunch : newsletterTitleLiveShop}
        </h2>
        <p className="mt-6 text-muted-foreground max-w-lg mx-auto">{newsletterBody}</p>
        <form onSubmit={submit} className="mt-10 max-w-md mx-auto">
          <input
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            value={trap}
            onChange={(e) => setTrap(e.target.value)}
            aria-hidden="true"
          />
          <div className="flex border-b border-charcoal">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplu.ro"
              className="flex-1 bg-transparent py-3 outline-none placeholder:opacity-40"
            />
            <button
              type="submit"
              disabled={loading}
              className="font-mono-xs px-4 hover:opacity-60 disabled:opacity-40"
            >
              {loading ? "Se trimite..." : newsletterButtonText}
            </button>
          </div>
          {status === "success" && (
            <p className="mt-3 font-mono-xs text-olive">{newsletterSuccessText}</p>
          )}
          {status === "invalid" && (
            <p className="mt-3 font-mono-xs text-red-700">Introdu o adresa de email valida.</p>
          )}
          {status === "error" && (
            <p className="mt-3 font-mono-xs text-red-700">
              Ceva n-a mers. Incearca din nou intr-un moment.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

export function SocialProofGrid() {
  const { socialProofEyebrow, socialProofTitle, socialProofCardTitle, socialProofCardText } =
    useSite();

  return (
    <section className="px-5 md:px-10 py-20 md:py-32 border-t border-border">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <p className="font-mono-xs opacity-60">{socialProofEyebrow}</p>
            <h2 className="font-display text-4xl md:text-6xl mt-3">{socialProofTitle}</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {lookbookImages.map((image) => (
            <Link key={image.src} to="/lookbook" className="img-zoom bg-warm-grey">
              <img
                src={image.src}
                alt={image.caption}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
            </Link>
          ))}
          <div className="border border-border p-5 md:p-6 flex flex-col justify-between min-h-56">
            <p className="font-display text-2xl">{socialProofCardTitle}</p>
            <p className="mt-6 text-sm text-muted-foreground">{socialProofCardText}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
