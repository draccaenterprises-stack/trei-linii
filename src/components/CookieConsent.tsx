import { Link } from "@tanstack/react-router";
import * as React from "react";
import { applyTrackingConsent } from "@/lib/analytics";
import { createConsent, readConsent, writeConsent } from "@/lib/consent";

/**
 * GDPR/ANPC cookie banner. Non-essential scripts (analytics, pixel) load only
 * after the visitor accepts. The choice is remembered in localStorage.
 */
export function CookieConsent() {
  const bannerRef = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(false);
  const [customizing, setCustomizing] = React.useState(false);
  const [analytics, setAnalytics] = React.useState(false);
  const [marketing, setMarketing] = React.useState(false);

  React.useEffect(() => {
    const consent = readConsent();
    if (consent) applyTrackingConsent(consent);
    else setVisible(true);

    const openSettings = () => {
      const current = readConsent();
      setAnalytics(current?.analytics ?? false);
      setMarketing(current?.marketing ?? false);
      setCustomizing(true);
      setVisible(true);
    };
    window.addEventListener("trei-linii:cookie-settings", openSettings);
    return () => window.removeEventListener("trei-linii:cookie-settings", openSettings);
  }, []);

  React.useEffect(() => {
    if (!visible || !bannerRef.current) return undefined;

    const root = document.documentElement;
    const banner = bannerRef.current;
    const updateOffset = () => {
      root.style.setProperty("--cookie-banner-height", `${Math.ceil(banner.offsetHeight)}px`);
    };
    const observer = new ResizeObserver(updateOffset);

    document.body.classList.add("cookie-banner-open");
    observer.observe(banner);
    window.addEventListener("resize", updateOffset, { passive: true });
    updateOffset();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateOffset);
      document.body.classList.remove("cookie-banner-open");
      root.style.removeProperty("--cookie-banner-height");
    };
  }, [visible]);

  const decide = (nextAnalytics: boolean, nextMarketing: boolean) => {
    const consent = createConsent({ analytics: nextAnalytics, marketing: nextMarketing });
    try {
      writeConsent(consent);
    } catch {
      /* noop */
    }
    applyTrackingConsent(consent);
    setAnalytics(nextAnalytics);
    setMarketing(nextMarketing);
    setCustomizing(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      ref={bannerRef}
      role="region"
      aria-label="Setări cookies"
      aria-live="polite"
      data-cookie-consent
      className="cookie-consent fixed inset-x-0 bottom-0 z-[60] border-t border-cream/15 bg-charcoal text-cream"
    >
      <div className="mx-auto max-w-[1600px] px-5 md:px-10 py-4 md:py-5 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
        <div className="text-sm leading-relaxed opacity-90 md:flex-1">
          Folosim cookies pentru funcționarea site-ului și, cu acordul tău, pentru a măsura
          traficul. Vezi{" "}
          <Link to="/cookies" className="underline underline-offset-4 hover:opacity-70">
            Politica de cookies
          </Link>
          .
          {customizing && (
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked disabled /> Esențiale
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(event) => setAnalytics(event.target.checked)}
                />
                Analiza trafic
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(event) => setMarketing(event.target.checked)}
                />
                Marketing
              </label>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => decide(false, false)}
            className="font-mono-xs border border-cream/30 px-5 py-2.5 hover:bg-cream/10 transition-colors"
          >
            Refuz opționale
          </button>
          {!customizing && (
            <button
              type="button"
              onClick={() => setCustomizing(true)}
              className="font-mono-xs border border-cream/30 px-5 py-2.5 hover:bg-cream/10 transition-colors"
            >
              Personalizează
            </button>
          )}
          <button
            type="button"
            onClick={() => (customizing ? decide(analytics, marketing) : decide(true, true))}
            className="font-mono-xs bg-cream text-charcoal px-5 py-2.5 hover:bg-cream/90 transition-colors"
          >
            {customizing ? "Salvează" : "Acceptă toate"}
          </button>
        </div>
      </div>
    </div>
  );
}
