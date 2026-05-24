import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingBag, Menu } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useSite } from "@/lib/site-context";
import logoFull from "@/assets/trei-linii-logo-full-cropped.png";

const nav = [
  { to: "/shop", label: "Magazin" },
  { to: "/collections", label: "Lansări" },
  { to: "/lookbook", label: "Pe stradă" },
  { to: "/about", label: "Despre" },
  { to: "/contact", label: "Contact" },
] as const;

export function Announcement() {
  const { announcement } = useSite();
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
  const { logoText } = useSite();
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10 h-16 flex items-center justify-between gap-6">
        <Link to="/" className="inline-flex items-center" aria-label={logoText}>
          <img src={logoFull} alt={logoText} className="h-8 md:h-10 w-auto object-contain" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="font-mono-xs hover:opacity-60 transition-opacity"
              activeProps={{ className: "font-mono-xs underline underline-offset-4" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={open}
            className="font-mono-xs flex items-center gap-1.5 hover:opacity-60 transition-opacity"
            aria-label="Deschide coșul"
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={1.25} />
            <span>Coș ({count})</span>
          </button>
          <details className="md:hidden">
            <summary
              className="list-none cursor-pointer [&::-webkit-details-marker]:hidden"
              aria-label="Deschide meniul"
            >
              <Menu className="h-5 w-5" strokeWidth={1.25} />
            </summary>
            <div className="fixed left-0 right-0 top-[96px] z-50 bg-background border-b border-border shadow-sm">
              <nav className="flex flex-col px-5 py-6 gap-5">
                {nav.map((n) => (
                  <Link key={n.to} to={n.to} className="font-display text-3xl">
                    {n.label}
                  </Link>
                ))}
              </nav>
            </div>
          </details>
        </div>
      </div>
      {/* hide highlight warning */}
      <span className="sr-only">{pathname}</span>
    </header>
  );
}
