import { Link, useRouterState } from "@tanstack/react-router";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, UserRound, X } from "lucide-react";
import * as React from "react";
import { useCart } from "@/lib/cart-context";
import { useSite } from "@/lib/site-context";
import logoFull from "@/assets/trei-linii-logo-full-cropped.webp";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { primaryNavigation } from "@/lib/routes";

const tickerMessages = [
  "Trei Linii · București",
  "Față curată · design pe spate",
  "Detalii clare · pe fiecare produs",
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

function NavLink({ to, label }: { to: string; label: string }) {
  const isShopLink = to === "/shop";
  const className = isShopLink
    ? "font-mono text-sm font-bold tracking-normal text-accent-text hover:opacity-70 transition-opacity"
    : "font-mono-xs hover:opacity-60 transition-opacity";

  if (to.includes("#")) {
    return (
      <a href={to} className={className}>
        {label}
      </a>
    );
  }

  return (
    <Link
      to={to}
      className={className}
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
  const { announcement, announcementVisible, launchDate } = useSite();
  const [tickerIndex, setTickerIndex] = React.useState(0);
  const remaining = useCountdown(launchDate);

  React.useEffect(() => {
    if (!announcementVisible) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
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
          <span className="opacity-70">Lansare în</span>
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
            className={`absolute text-accent-on-dark transition-[opacity,transform] duration-700 ease-out ${
              index === tickerIndex ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            {message}
          </span>
        ))}
        <span className="sr-only">{announcement}</span>
      </div>
    </div>
  );
}

function useHideOnScroll() {
  const [hidden, setHidden] = React.useState(false);
  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    let lastY = window.scrollY;
    let acc = 0;
    let ticking = false;
    const THRESHOLD = 8;
    const TOP_ZONE = 80;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY;
        lastY = y;
        if (y < TOP_ZONE) {
          acc = 0;
          setHidden(false);
        } else if (delta !== 0) {
          if (Math.sign(delta) !== Math.sign(acc)) {
            acc = 0;
          }
          acc += delta;
          if (acc > THRESHOLD) {
            setHidden(true);
            acc = 0;
          } else if (acc < -THRESHOLD) {
            setHidden(false);
            acc = 0;
          }
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return hidden;
}

export function Header() {
  const hidden = useHideOnScroll();
  const { count, open } = useCart();
  const { accentColor, customerAccountUrl, logoText, siteMode } = useSite();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => setMobileMenuOpen(false), [pathname]);

  return (
    <header
      className="sticky top-0 z-40 border-b border-border bg-background/95 md:bg-background/85 md:backdrop-blur will-change-transform"
      style={{
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 450ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="mx-auto max-w-[1600px] px-5 md:px-10 h-16 flex items-center justify-between gap-6">
        <Link to="/" className="inline-flex items-center gap-3" aria-label={logoText}>
          <ResponsiveImage
            src={logoFull}
            alt={logoText}
            width={320}
            height={179}
            priority
            className="h-8 w-auto object-contain md:h-10"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {primaryNavigation.map((n) => (
            <NavLink key={n.to} to={n.to} label={n.label} />
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {siteMode === "live-shop" && customerAccountUrl ? (
            <a
              href={customerAccountUrl}
              className="inline-flex min-h-11 items-center gap-2 font-mono-xs transition-opacity hover:opacity-65"
              aria-label="Deschide contul meu"
              title="Contul meu"
            >
              <UserRound className="h-4 w-4" strokeWidth={1.25} aria-hidden="true" />
              <span className="hidden lg:inline">Cont</span>
            </a>
          ) : null}
          {siteMode === "live-shop" ? (
            <button
              type="button"
              onClick={open}
              className="font-mono-xs flex items-center gap-2 text-accent-text hover:opacity-70 transition-opacity"
              aria-label={`Deschide coșul, ${count} produse`}
            >
              <ThreeLineMark className="w-7" />
              <span>Coș ({count})</span>
              <span className="sr-only" aria-live="polite">
                {count} produse în coș
              </span>
            </button>
          ) : (
            <Link
              to="/shop"
              className="font-mono-xs border border-charcoal px-4 py-2 text-cream transition-opacity hover:opacity-80"
              style={{ backgroundColor: accentColor }}
            >
              Vezi shop
            </Link>
          )}
          <Dialog.Root open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                className="grid h-11 w-11 place-items-center md:hidden"
                aria-label="Deschide meniul"
              >
                <Menu className="h-5 w-5" strokeWidth={1.25} />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-charcoal/45 md:hidden" />
              <Dialog.Content className="fixed inset-x-0 top-0 z-[51] bg-charcoal px-5 pb-10 pt-5 text-cream shadow-xl outline-none md:hidden">
                <div className="flex items-center justify-between border-b border-cream/15 pb-5">
                  <Dialog.Title className="font-mono-xs">Navigație</Dialog.Title>
                  <Dialog.Description className="sr-only">
                    Meniul principal Trei Linii.
                  </Dialog.Description>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="grid h-11 w-11 place-items-center"
                      aria-label="Închide meniul"
                    >
                      <X className="h-5 w-5" strokeWidth={1.25} />
                    </button>
                  </Dialog.Close>
                </div>
                <nav className="flex flex-col gap-5 pt-8">
                  {primaryNavigation.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={
                        item.to === "/shop" ? "font-display text-5xl" : "font-display text-4xl"
                      }
                      style={item.to === "/shop" ? { color: accentColor } : undefined}
                    >
                      {item.label}
                    </Link>
                  ))}
                  {siteMode === "live-shop" && customerAccountUrl ? (
                    <a
                      href={customerAccountUrl}
                      className="mt-3 inline-flex items-center gap-3 border-t border-cream/15 pt-6 font-mono-xs text-cream"
                    >
                      <UserRound className="h-4 w-4" strokeWidth={1.25} aria-hidden="true" />
                      Contul meu
                    </a>
                  ) : null}
                </nav>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
