import { Link, useRouterState } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import * as React from "react";
import { useCart } from "@/lib/cart-context";
import { useSite } from "@/lib/site-context";
import logoFull from "@/assets/trei-linii-logo-full-cropped.png";

const tickerMessages = [
  "8 modele noi · lansare 2026",
  "Locuri limitate pentru drop-ul 2026",
  "Bumbac dens 240gsm · oversized fit",
] as const;

/** Returns ms left until target, null if target is empty/invalid. Updates each minute. */
function useCountdown(target: string): number | null {
  const [remaining, setRemaining] = React.useState<number | null>(null);

  React.useEffect(() => {
    const ts = new Date(target).getTime();
    if (!target || Number.isNaN(ts)) {
      setRemaining(null);
      return;
    }
    const tick = () => setRemaining(ts - Date.now());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [target]);

  return remaining;
}

const preLaunchNav = [
  { to: "/shop", label: "Shop" },
  { to: "/lookbook", label: "Lookbook" },
  { to: "/manifest", label: "Manifest" },
] as const;

const liveShopNav = [
  { to: "/shop", label: "Shop" },
  { to: "/lookbook", label: "Lookbook" },
  { to: "/manifest", label: "Manifest" },
] as const;

function NavLink({ to, label, accentColor }: { to: string; label: string; accentColor: string }) {
  const isShopLink = to === "/shop";
  const className = isShopLink
    ? "font-mono text-sm font-bold tracking-normal hover:opacity-70 transition-opacity"
    : "font-mono-xs hover:opacity-60 transition-opacity";
  const style = isShopLink ? { color: accentColor } : undefined;

  if (to.includes("#")) {
    return (
      <a href={to} className={className} style={style}>
        {label}
      </a>
    );
  }

  return (
    <Link
      to={to}
      className={className}
      style={style}
      activeProps={{ className: `${className} underline underline-offset-4` }}
    >
      {label}
    </Link>
  );
}

function ThreeLineMark({ className = "" }: { className?: string }) {
  return (
    <span className={`tl-line-mark ${className}`} aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

export function Announcement() {
  const { accentColor, announcement, announcementVisible, launchDate } = useSite();
  const [tickerIndex, setTickerIndex] = React.useState(0);
  const remaining = useCountdown(launchDate);

  React.useEffect(() => {
    if (!announcementVisible) return undefined;
    const id = window.setInterval(() => {
      setTickerIndex((index) => (index + 1) % tickerMessages.length);
    }, 3_000);

    return () => window.clearInterval(id);
  }, [announcementVisible]);

  if (!announcementVisible) return null;

  if (remaining !== null && remaining > 0) {
    const days = Math.floor(remaining / 86_400_000);
    const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
    const mins = Math.floor((remaining % 3_600_000) / 60_000);
    return (
      <div className="bg-charcoal text-cream border-b border-charcoal">
        <div className="mx-auto flex max-w-[1600px] items-center justify-center gap-3 px-5 md:px-10 py-2 font-mono-xs">
          <span className="opacity-70">Lansare in</span>
          <span className="tabular-nums">
            {days}z {hours}h {mins}m
          </span>
          <span className="opacity-40">/</span>
          <a href="/shop" className="underline underline-offset-4 hover:opacity-70">
            Vezi shop
          </a>
        </div>
      </div>
    );
  }

  if (!announcement.trim()) return null;

  return (
    <div className="bg-charcoal text-cream overflow-hidden border-b border-charcoal">
      <div className="relative flex h-9 items-center justify-center px-5 md:px-10 font-mono-xs">
        {tickerMessages.map((message, index) => (
          <span
            key={message}
            className={`absolute transition-[opacity,transform] duration-700 ease-out ${
              index === tickerIndex ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
            style={index === tickerIndex ? { color: accentColor } : undefined}
          >
            {message}
          </span>
        ))}
        <span className="sr-only">{announcement}</span>
      </div>
    </div>
  );
}

export function Header() {
  const { count, open } = useCart();
  const { accentColor, logoText, siteMode } = useSite();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const nav = siteMode === "pre-launch" ? preLaunchNav : liveShopNav;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 md:bg-background/85 md:backdrop-blur">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10 h-16 flex items-center justify-between gap-6">
        <Link to="/" className="inline-flex items-center gap-3" aria-label={logoText}>
          <img src={logoFull} alt={logoText} className="h-8 md:h-10 w-auto object-contain" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} label={n.label} accentColor={accentColor} />
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {siteMode === "live-shop" ? (
            <button
              onClick={open}
              className="font-mono-xs flex items-center gap-2 text-[#ff006f] hover:opacity-70 transition-opacity"
              aria-label="Deschide cosul"
            >
              <ThreeLineMark className="w-7" />
              <span>Cos ({count})</span>
            </button>
          ) : (
            <a
              href="/shop"
              className="font-mono-xs rounded-full px-4 py-2 text-charcoal transition-opacity hover:opacity-80"
              style={{ backgroundColor: accentColor }}
            >
              Vezi shop
            </a>
          )}
          <details className="md:hidden">
            <summary
              className="list-none cursor-pointer [&::-webkit-details-marker]:hidden"
              aria-label="Deschide meniul"
            >
              <Menu className="h-5 w-5" strokeWidth={1.25} />
            </summary>
            <div className="fixed left-0 right-0 top-[96px] z-50 bg-background border-b border-border shadow-sm">
              <nav className="flex flex-col px-5 py-6 gap-5">
                {nav.map((n) =>
                  n.to.includes("#") ? (
                    <a key={n.to} href={n.to} className="font-display text-3xl">
                      {n.label}
                    </a>
                  ) : (
                    <Link
                      key={n.to}
                      to={n.to}
                      className={
                        n.to === "/shop" ? "font-display text-4xl" : "font-display text-3xl"
                      }
                      style={n.to === "/shop" ? { color: accentColor } : undefined}
                    >
                      {n.label}
                    </Link>
                  ),
                )}
              </nav>
            </div>
          </details>
        </div>
      </div>
      <span className="sr-only">{pathname}</span>
    </header>
  );
}
