import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useSite } from "@/lib/site-context";

const nav = [
  { to: "/shop", label: "Shop" },
  { to: "/collections", label: "Collections" },
  { to: "/lookbook", label: "Lookbook" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function Announcement() {
  const { announcement } = useSite();
  return (
    <div className="bg-charcoal text-cream overflow-hidden border-b border-charcoal">
      <div className="marquee-track py-2 font-mono-xs">
        {Array.from({ length: 6 }).map((_, i) => (
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
  const [mobile, setMobile] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10 h-16 flex items-center justify-between gap-6">
        <Link to="/" className="font-display text-lg md:text-xl tracking-tight">
          {logoText}
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
          <Link
            to="/admin"
            className="hidden md:inline font-mono-xs hover:opacity-60"
            activeProps={{ className: "font-mono-xs underline underline-offset-4" }}
          >
            Admin
          </Link>
          <button
            onClick={open}
            className="font-mono-xs flex items-center gap-1.5 hover:opacity-60 transition-opacity"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={1.25} />
            <span>Cart ({count})</span>
          </button>
          <button onClick={() => setMobile(true)} className="md:hidden" aria-label="Open menu">
            <Menu className="h-5 w-5" strokeWidth={1.25} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobile && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
          <div className="h-16 px-5 flex items-center justify-between border-b border-border">
            <span className="font-display text-lg">{logoText}</span>
            <button onClick={() => setMobile(false)} aria-label="Close menu">
              <X className="h-5 w-5" strokeWidth={1.25} />
            </button>
          </div>
          <nav className="flex flex-col px-5 py-8 gap-5">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setMobile(false)}
                className="font-display text-3xl"
              >
                {n.label}
              </Link>
            ))}
            <Link to="/admin" onClick={() => setMobile(false)} className="font-mono-xs mt-6">
              Admin Dashboard
            </Link>
          </nav>
        </div>
      )}
      {/* hide highlight warning */}
      <span className="sr-only">{pathname}</span>
    </header>
  );
}
