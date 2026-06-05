import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, ShoppingBag } from "lucide-react";
import * as React from "react";
import { useCart } from "@/lib/cart-context";
import { useSite } from "@/lib/site-context";
import logoFull from "@/assets/trei-linii-logo-full-cropped.png";

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
  { to: "/about", label: "Concept" },
  { to: "/shop", label: "SHOP" },
  { to: "/size-guide", label: "Marimi" },
  { to: "/#newsletter", label: "Inscriere" },
] as const;

const liveShopNav = [
  { to: "/shop", label: "SHOP" },
  { to: "/collections", label: "Modele" },
  { to: "/size-guide", label: "Ghid marimi" },
  { to: "/lookbook", label: "Lookbook" },
  { to: "/contact", label: "Contact" },
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

export function Announcement() {
  const { announcement, announcementVisible, launchDate } = useSite();
  const remaining = useCountdown(launchDate);

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
          <a href="/#newsletter" className="underline underline-offset-4 hover:opacity-70">
            Acces early
          </a>
        </div>
      </div>
    );
  }

  if (!announcement.trim()) return null;

  return (
    <div className="bg-charcoal text-cream overflow-hidden border-b border-charcoal">
      <div className="marquee-track py-2 font-mono-xs">
        {Array.from({ length: 3 }).map((_, i) => (
          <span key={i} className="px-8 inline-block">
            {announcement} <span className="opacity-50 mx-3">/</span>
          </span>
        ))}
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
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10 h-16 flex items-center justify-between gap-6">
        <Link to="/" className="inline-flex items-center" aria-label={logoText}>
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
              className="font-mono-xs flex items-center gap-1.5 hover:opacity-60 transition-opacity"
              aria-label="Deschide cosul"
            >
              <ShoppingBag className="h-4 w-4" strokeWidth={1.25} />
              <span>Cos ({count})</span>
            </button>
          ) : (
            <a href="/#newsletter" className="font-mono-xs hover:opacity-60 transition-opacity">
              Lista lansare
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
