import { Link } from "@tanstack/react-router";
import * as React from "react";
import { loadAnalytics } from "@/lib/analytics";

const CONSENT_KEY = "trei-linii-cookie-consent";

/**
 * GDPR/ANPC cookie banner. Non-essential scripts (analytics, pixel) load only
 * after the visitor accepts. The choice is remembered in localStorage.
 */
export function CookieConsent() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    let choice: string | null = null;
    try {
      choice = localStorage.getItem(CONSENT_KEY);
    } catch {
      /* noop */
    }
    if (choice === "accepted") {
      loadAnalytics();
    } else if (choice !== "rejected") {
      setVisible(true);
    }
  }, []);

  const decide = (accepted: boolean) => {
    try {
      localStorage.setItem(CONSENT_KEY, accepted ? "accepted" : "rejected");
    } catch {
      /* noop */
    }
    if (accepted) loadAnalytics();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Setari cookies"
      className="fixed inset-x-0 bottom-0 z-[60] bg-charcoal text-cream border-t border-cream/15"
    >
      <div className="mx-auto max-w-[1600px] px-5 md:px-10 py-4 md:py-5 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
        <p className="text-sm leading-relaxed opacity-90 md:flex-1">
          Folosim cookies pentru functionarea site-ului si, cu acordul tau, pentru a masura
          traficul. Vezi{" "}
          <Link to="/cookies" className="underline underline-offset-4 hover:opacity-70">
            Politica de cookies
          </Link>
          .
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => decide(false)}
            className="font-mono-xs border border-cream/30 px-5 py-2.5 hover:bg-cream/10 transition-colors"
          >
            Refuz
          </button>
          <button
            onClick={() => decide(true)}
            className="font-mono-xs bg-cream text-charcoal px-5 py-2.5 hover:bg-cream/90 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
