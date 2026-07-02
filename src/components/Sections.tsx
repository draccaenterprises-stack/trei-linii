import { Link } from "@tanstack/react-router";
import * as React from "react";
import {
  CreditCard,
  Flame,
  Package,
  RefreshCw,
  RotateCcw,
  Ruler,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { isKlaviyoConfigured, subscribeToKlaviyo } from "@/lib/klaviyo";
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
    <section className="trust-strip border-y border-border bg-background">
      <div className="trust-strip-grid mx-auto grid max-w-[1600px] grid-cols-2 gap-3 px-4 py-4 md:grid-cols-4 md:gap-0 md:divide-x md:divide-border md:px-0 md:py-0">
        {items.map((item, index) => {
          const Icon = trustIcons[index % trustIcons.length];
          return (
            <div
              key={item.id}
              className="trust-card flex min-h-36 flex-col justify-between rounded-xl border border-border bg-card p-4 md:min-h-0 md:flex-row md:justify-start md:gap-4 md:rounded-none md:border-0 md:bg-transparent md:px-10 md:py-6"
            >
              <Icon
                className="h-5 w-5 shrink-0 text-[#ff006f] md:text-current"
                strokeWidth={1.25}
              />
              <div className="pt-5 md:pt-0">
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

export function ThreeLineDivider() {
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const lines = Array.from(root.querySelectorAll("span"));

    const update = () => {
      const rect = root.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const start = viewportHeight * 0.92;
      const end = viewportHeight * 0.3;
      const progress = Math.min(1, Math.max(0, (start - rect.top) / Math.max(1, start - end)));
      root.style.setProperty("--tl-divider-progress", String(progress));
      lines.forEach((line, index) => {
        const offset = index * 0.08;
        const lineProgress = Math.min(1, Math.max(0, (progress - offset) / (1 - offset)));
        line.style.transform = `scaleX(${lineProgress})`;
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("touchmove", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("touchmove", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div ref={rootRef} className="tl-divider" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}

const marqueePhrases = [
  "Editii limitate",
  "Bumbac pieptanat 240gsm",
  "Design pe spate",
  "Croiala oversized",
  "Fara reeditare",
  "Fata curata",
] as const;

export function MarqueeDivider() {
  const strip = (
    <>
      {marqueePhrases.map((phrase) => (
        <span key={phrase} className="flex items-center gap-10">
          <span className="font-mono-xs text-cream">{phrase}</span>
          <span className="h-px w-10 bg-[#ff006f]" aria-hidden="true" />
        </span>
      ))}
    </>
  );

  return (
    <div className="overflow-hidden border-y border-charcoal bg-charcoal py-5 text-cream">
      <div className="marquee-divider-track flex w-max items-center gap-10">
        <div className="flex items-center gap-10">{strip}</div>
        <div className="flex items-center gap-10" aria-hidden="true">
          {strip}
        </div>
        <div className="flex items-center gap-10" aria-hidden="true">
          {strip}
        </div>
      </div>
    </div>
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

const bundleDeals = [
  {
    title: "2 tricouri",
    value: "oferta duo",
    text: "Alege doua modele si construieste rotatia de zi cu zi cu o reducere aplicata in cos.",
    cta: "Alege 2 modele",
  },
  {
    title: "3 tricouri",
    value: "best value",
    text: "Pachetul cel mai bun pentru garderoba minimalista: trei printuri, aceeasi croiala.",
    cta: "Alege 3 modele",
  },
];

export function BundlePreview() {
  return (
    <section className="px-5 md:px-10 py-20 md:py-28 border-y border-border bg-charcoal text-cream">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="font-mono-xs text-[#ff006f]">Oferta pentru 2 si 3 tricouri</p>
            <h2 className="mt-3 font-display text-4xl md:text-6xl leading-tight">
              Pachete simple, vizibile inainte de checkout.
            </h2>
          </div>
          <p className="md:col-span-5 text-cream/68 leading-relaxed">
            Ia doua tricouri pentru o rotatie scurta sau trei pentru un set complet. Fara promotii
            permanente, doar o oferta clara pentru drop.
          </p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {bundleDeals.map((deal) => (
            <article key={deal.title} className="border border-cream/20 p-5 md:p-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-display text-3xl">{deal.title}</h3>
                <span className="border border-[#ff006f] px-2 py-1 font-mono-xs text-[#ff006f]">
                  {deal.value}
                </span>
              </div>
              <p className="mt-6 min-h-16 text-sm leading-relaxed text-cream/68">{deal.text}</p>
              <Link
                to="/shop"
                className="mt-8 inline-flex bg-cream px-4 py-2 font-mono-xs text-charcoal hover:bg-cream/90"
              >
                {deal.cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const competitivePlays = [
  {
    icon: Flame,
    title: "Drop-uri si badge-uri",
    text: "Cardurile arata rapid ce e nou, ce are stoc mic si ce se potriveste la bundle.",
  },
  {
    icon: ShieldCheck,
    title: "Incredere la vedere",
    text: "Retur, schimb marime, plata securizata si materialul apar inainte de decizia de cumparare.",
  },
  {
    icon: Package,
    title: "Cos mai mare",
    text: "Pachetele de 2 sau 3 tricouri dau un motiv real sa nu cumperi un singur model.",
  },
  {
    icon: Sparkles,
    title: "Poveste scurta",
    text: "Despre noi ramane vizual si concret: de ce, proces, look final.",
  },
];

export function CompetitivePlaybook() {
  return (
    <section className="px-5 md:px-10 py-20 md:py-28 bg-cream border-y border-border">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-mono-xs opacity-60">Ce pastram din piata</p>
            <h2 className="mt-3 font-display text-4xl md:text-6xl leading-tight">
              Lucruri care vand, fara sa arate ieftin.
            </h2>
          </div>
          <div className="md:col-span-8 grid gap-4 md:grid-cols-2">
            {competitivePlays.map((play) => {
              const Icon = play.icon;
              return (
                <article key={play.title} className="border border-border p-5 md:p-6 bg-background">
                  <Icon className="h-5 w-5 text-[#ff006f]" strokeWidth={1.5} />
                  <h3 className="mt-6 font-display text-2xl">{play.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{play.text}</p>
                </article>
              );
            })}
          </div>
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
          <div>
            <p className="font-mono-xs opacity-60">Social proof</p>
            <h2 className="font-display text-4xl md:text-6xl mt-3">Feedback clienti.</h2>
          </div>
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
  const [status, setStatus] = React.useState<
    "idle" | "success" | "invalid" | "unconfigured" | "error"
  >("idle");
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
    if (!isKlaviyoConfigured()) {
      setStatus("unconfigured");
      return;
    }

    setLoading(true);
    try {
      await subscribeToKlaviyo(email);
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
      className="px-5 md:px-10 py-20 md:py-32 bg-background border-t border-border"
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
              aria-label="Adresa de email pentru newsletter"
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
          {status === "unconfigured" && (
            <p className="mt-3 font-mono-xs text-red-700">
              Lista de email nu este configurata momentan.
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
