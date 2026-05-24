import { Link } from "@tanstack/react-router";
import { useSite } from "@/lib/site-context";

export function Footer() {
  const { logoText } = useSite();
  return (
    <footer className="bg-charcoal text-cream mt-32">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10 py-16 md:py-24">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="font-display text-3xl md:text-5xl leading-[0.95]">
              Simplu în față,
              <br />
              puternic pe spate.
            </div>
            <p className="font-mono-xs mt-6 opacity-60">{logoText} · EST. 2026 · BUCUREȘTI</p>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-mono-xs opacity-50 mb-4">Magazin</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/shop" className="hover:opacity-60">
                  Toate produsele
                </Link>
              </li>
              <li>
                <Link to="/collections" className="hover:opacity-60">
                  Lansări
                </Link>
              </li>
              <li>
                <Link to="/lookbook" className="hover:opacity-60">
                  Pe stradă
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-mono-xs opacity-50 mb-4">Brand</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:opacity-60">
                  Despre
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:opacity-60">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:opacity-60">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-mono-xs opacity-50 mb-4">Newsletter</h4>
            <p className="text-sm opacity-70 mb-3">
              -10% la prima comandă și acces cu 24h înainte la următoarea lansare.
            </p>
            <form
              className="flex border-b border-cream/30 pb-1"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="email@exemplu.ro"
                className="flex-1 bg-transparent outline-none text-sm placeholder:opacity-40"
              />
              <button className="font-mono-xs hover:opacity-60">→</button>
            </form>
          </div>
        </div>

        <div className="mt-14 grid md:grid-cols-12 gap-10 border-t border-cream/15 pt-10">
          <div className="md:col-span-3">
            <h4 className="font-mono-xs opacity-50 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="hover:opacity-60">
                  Termeni și condiții
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:opacity-60">
                  Politica de retur
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:opacity-60">
                  Confidențialitate
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:opacity-60">
                  Cookies
                </Link>
              </li>
              <li>
                <a href="https://anpc.ro" className="hover:opacity-60">
                  ANPC
                </a>
              </li>
              <li>
                <a href="https://ec.europa.eu/consumers/odr" className="hover:opacity-60">
                  ANPC-SAL
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-mono-xs opacity-50 mb-4">Social</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://instagram.com" className="hover:opacity-60">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://tiktok.com" className="hover:opacity-60">
                  TikTok
                </a>
              </li>
              <li>
                <a href="https://wa.me/" className="hover:opacity-60">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-mono-xs opacity-50 mb-4">Încredere</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>Retur 14 zile</li>
              <li>Plată securizată Shopify</li>
              <li>Visa · Mastercard · Apple Pay</li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-mono-xs opacity-50 mb-4">Date firmă</h4>
            <p className="text-sm opacity-70 leading-relaxed">
              Se completează înainte de lansarea comercială: nume firmă, CUI, Nr. Reg. Comerțului și
              adresă sediu.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-cream/15 flex flex-col md:flex-row justify-between gap-3 font-mono-xs opacity-50">
          <span>
            © {new Date().getFullYear()} {logoText}. Toate drepturile rezervate.
          </span>
          <span>Demo — finalizarea Shopify se conectează după configurare.</span>
        </div>
      </div>
    </footer>
  );
}
