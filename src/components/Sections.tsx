import { Link } from "@tanstack/react-router";
import * as React from "react";
import { CreditCard, RefreshCw, RotateCcw, Ruler, ShieldCheck, Truck } from "lucide-react";
import { isKlaviyoConfigured, subscribeToKlaviyo } from "@/lib/klaviyo";
import { clamp, createFrameLoop, createFrameScheduler } from "@/lib/motion";
import { useSite, type TrustItem } from "@/lib/site-context";
import { FeedbackRegion } from "@/components/FeedbackRegion";

const trustIcons = [Ruler, ShieldCheck, RefreshCw, CreditCard, Truck, RotateCcw];

function visibleTrustItems(items: TrustItem[]) {
  return items.filter((item) => item.enabled).slice(0, 4);
}

export function TrustStrip() {
  const { siteMode, trustItemsPreLaunch, trustItemsLiveShop } = useSite();
  const rootRef = React.useRef<HTMLElement | null>(null);
  const items = visibleTrustItems(
    siteMode === "pre-launch" ? trustItemsPreLaunch : trustItemsLiveShop,
  );

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const cards = Array.from(root.querySelectorAll<HTMLElement>(".trust-card"));
    if (!cards.length) return undefined;

    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      cards.forEach((card) => card.classList.add("is-visible"));
      return undefined;
    }

    const updateMobileDepth = () => {
      if (!mobileQuery.matches) {
        cards.forEach((card) => {
          card.style.removeProperty("--trust-depth");
          card.style.removeProperty("--trust-lift");
          card.style.removeProperty("--trust-scale");
        });
        return;
      }

      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const progress = clamp(
          (window.innerHeight * 0.92 - rect.top) / (window.innerHeight * 0.44),
        );
        const lift = Math.round((1 - progress) * 10);
        card.style.setProperty("--trust-depth", (0.28 + progress * 0.58).toFixed(3));
        card.style.setProperty("--trust-lift", `${lift}px`);
        card.style.setProperty("--trust-scale", (0.985 + progress * 0.015).toFixed(3));
        card.style.transitionDelay = `${index * 55}ms`;
      });
    };

    const scheduler = createFrameScheduler(updateMobileDepth);
    const scheduleUpdate = () => scheduler.schedule();

    cards.forEach((card) => card.classList.add("is-visible"));
    scheduler.runNow();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    mobileQuery.addEventListener("change", scheduleUpdate);

    document.documentElement.classList.add("motion-ready");
    return () => {
      scheduler.cancel();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      mobileQuery.removeEventListener("change", scheduleUpdate);
    };
  }, [items.length]);

  return (
    <section ref={rootRef} className="trust-strip border-y border-border bg-background">
      <div className="trust-strip-grid mx-auto grid max-w-[1600px] grid-cols-2 gap-3 px-4 py-4 md:grid-cols-4 md:gap-0 md:divide-x md:divide-border md:px-0 md:py-0">
        {items.map((item, index) => {
          const Icon = trustIcons[index % trustIcons.length];
          return (
            <div
              key={item.id}
              className="trust-card flex min-h-36 flex-col justify-between border border-border bg-card p-4 md:min-h-0 md:flex-row md:justify-start md:gap-4 md:border-0 md:bg-transparent md:px-10 md:py-6"
            >
              <Icon
                className="h-5 w-5 shrink-0 text-accent-text md:text-current"
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
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const computeTarget = () => {
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const start = vh * 0.92;
      const end = vh * 0.3;
      return clamp((start - rect.top) / Math.max(1, start - end));
    };

    const applyProgress = (progress: number) => {
      root.style.setProperty("--tl-divider-progress", String(progress));
      lines.forEach((line, index) => {
        const offset = index * 0.08;
        const lineProgress = clamp((progress - offset) / (1 - offset));
        line.style.transform = `scaleX(${lineProgress})`;
      });
    };

    if (reduced) {
      applyProgress(1);
      return undefined;
    }

    let inView = false;
    const scheduler = createFrameScheduler(() => applyProgress(computeTarget()));
    const schedule = () => {
      if (inView) scheduler.schedule();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = !!entry?.isIntersecting;
        if (inView) scheduler.runNow();
        else scheduler.cancel();
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(root);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      io.disconnect();
      scheduler.cancel();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
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
  "Specificații clare",
  "Design pe spate",
  "Proporții relaxate",
  "Ghid de mărimi",
  "Politică de retur",
  "Față curată",
] as const;

export function MarqueeDivider() {
  const trackRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      track.style.transform = "none";
      return undefined;
    }

    let offset = 0;
    let loopWidth = 0;
    const viewport = track.parentElement;

    const measure = () => {
      const firstStrip = track.firstElementChild as HTMLElement | null;
      loopWidth = firstStrip ? firstStrip.offsetWidth + 40 : track.scrollWidth / 3;
    };

    const loop = createFrameLoop((_, delta) => {
      if (!loopWidth) measure();
      offset = (offset + delta * 0.055) % Math.max(1, loopWidth);
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
    });

    const syncVisibility = () => {
      if (document.hidden) loop.stop();
      else loop.start();
    };

    const observer =
      viewport && "IntersectionObserver" in window
        ? new IntersectionObserver(
            ([entry]) => {
              if (entry?.isIntersecting && !document.hidden) loop.start();
              else loop.stop();
            },
            { rootMargin: "160px 0px" },
          )
        : null;

    measure();
    if (observer && viewport) observer.observe(viewport);
    else loop.start();
    window.addEventListener("resize", measure);
    document.addEventListener("visibilitychange", syncVisibility);

    return () => {
      observer?.disconnect();
      loop.stop();
      window.removeEventListener("resize", measure);
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, []);

  const strip = (
    <>
      {marqueePhrases.map((phrase) => (
        <span key={phrase} className="flex items-center gap-10">
          <span className="font-mono-xs text-cream">{phrase}</span>
          <span className="h-px w-10 bg-signature" aria-hidden="true" />
        </span>
      ))}
    </>
  );

  return (
    <div className="overflow-hidden border-y border-charcoal bg-charcoal py-5 text-cream">
      <div ref={trackRef} className="marquee-divider-track flex w-max items-center gap-10">
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

const bundleDeals = [
  {
    title: "2 tricouri",
    value: "selecție duo",
    text: "Alege două modele care funcționează împreună, cu direcții grafice diferite.",
    cta: "Alege 2 modele",
  },
  {
    title: "3 tricouri",
    value: "selecție trio",
    text: "Construiește o rotație de trei printuri, păstrând aceeași regulă vizuală.",
    cta: "Alege 3 modele",
  },
];

export function BundlePreview() {
  return (
    <section className="px-5 md:px-10 py-20 md:py-28 border-y border-border bg-charcoal text-cream">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="font-mono-xs text-accent-text">Selecții de 2 și 3 tricouri</p>
            <h2 className="mt-3 font-display text-4xl md:text-6xl leading-tight">
              Mai multe direcții, aceeași bază.
            </h2>
          </div>
          <p className="md:col-span-5 text-cream/68 leading-relaxed">
            Pornește de la două piese sau construiește o selecție de trei. Orice reducere activă
            este afișată transparent în checkout.
          </p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {bundleDeals.map((deal) => (
            <article key={deal.title} className="border border-cream/20 p-5 md:p-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-display text-3xl">{deal.title}</h3>
                <span className="border border-signature px-2 py-1 font-mono-xs text-accent-text">
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
    "idle" | "success" | "invalid" | "consent" | "unconfigured" | "error"
  >("idle");
  const [email, setEmail] = React.useState("");
  const [marketingConsent, setMarketingConsent] = React.useState(false);
  const [trap, setTrap] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const consentRef = React.useRef<HTMLInputElement>(null);
  const newsletterConfigured = isKlaviyoConfigured();

  if (!newsletterConfigured) return null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (trap || loading) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("invalid");
      requestAnimationFrame(() => emailRef.current?.focus());
      return;
    }
    if (!marketingConsent) {
      setStatus("consent");
      requestAnimationFrame(() => consentRef.current?.focus());
      return;
    }
    if (!isKlaviyoConfigured()) {
      setStatus("unconfigured");
      return;
    }

    setLoading(true);
    try {
      await subscribeToKlaviyo(email);
      setStatus("success");
      setEmail("");
      setMarketingConsent(false);
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
        <form onSubmit={submit} noValidate className="mt-10 max-w-md mx-auto">
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
              ref={emailRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplu.ro"
              aria-label="Adresa de email pentru newsletter"
              aria-invalid={status === "invalid"}
              aria-describedby="newsletter-feedback"
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
          <label className="mt-4 flex items-start gap-3 text-left text-xs leading-relaxed text-muted-foreground">
            <input
              ref={consentRef}
              type="checkbox"
              required
              checked={marketingConsent}
              onChange={(event) => {
                setMarketingConsent(event.target.checked);
                if (status === "consent") setStatus("idle");
              }}
              aria-invalid={status === "consent"}
              aria-describedby="newsletter-feedback"
              className="mt-0.5"
            />
            <span>
              Sunt de acord să primesc noutăți Trei Linii. Mă pot dezabona oricând. Vezi{" "}
              <Link to="/confidentialitate" className="underline underline-offset-4">
                politica de confidențialitate
              </Link>
              .
            </span>
          </label>
          <FeedbackRegion
            id="newsletter-feedback"
            className="mt-3"
            message={
              status === "success"
                ? newsletterSuccessText
                : status === "invalid"
                  ? "Introdu o adresă de email validă."
                  : status === "consent"
                    ? "Bifează acordul pentru a te abona."
                    : status === "error"
                      ? "Înscrierea nu a reușit. Încearcă din nou peste câteva momente."
                      : status === "unconfigured"
                        ? "Lista de email nu este configurată momentan."
                        : null
            }
            tone={status === "success" ? "success" : "error"}
          />
        </form>
      </div>
    </section>
  );
}
