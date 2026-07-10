import { Link } from "@tanstack/react-router";
import { useSite } from "@/lib/site-context";
import logoFull from "@/assets/trei-linii-logo-full-cropped.png";

export function Footer() {
  const {
    logoText,
    contactEmail,
    whatsapp,
    instagram,
    tiktok,
    legalBusinessName,
    legalBusinessDetails,
    siteMode,
    footerTagline,
    footerLocation,
    footerNewsletterText,
    footerTrustItems,
  } = useSite();
  const businessLine =
    legalBusinessName && legalBusinessDetails
      ? `${legalBusinessName} · ${legalBusinessDetails}`
      : logoText;
  const taglineLines = footerTagline.split("\n").filter(Boolean);

  return (
    <footer className="bg-charcoal text-cream mt-32">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10 py-16 md:py-24">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <Link to="/" className="inline-flex" aria-label={`${logoText} - pagina principala`}>
              <img
                src={logoFull}
                alt={logoText}
                className="h-12 w-auto max-w-full object-contain brightness-0 invert md:h-16"
                loading="lazy"
                decoding="async"
              />
            </Link>
            <div className="mt-10 font-display text-3xl leading-[0.95] md:text-5xl">
              {taglineLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </div>
            <p className="font-mono-xs mt-6 opacity-60">
              {logoText}
              {footerLocation ? ` · ${footerLocation}` : ""}
            </p>
            <div className="mt-8 grid max-w-44 gap-2" aria-hidden="true">
              <span className="h-px w-full bg-cream/75" />
              <span className="h-px w-[76%] bg-cream/75" />
              <span className="h-px w-[88%] bg-[#ff006f]" />
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-mono-xs opacity-50 mb-4">Navigatie</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/shop" className="hover:opacity-60">
                  Modele
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="hover:opacity-60">
                  Ghid marimi
                </Link>
              </li>
              <li>
                <Link to="/lookbook" className="hover:opacity-60">
                  Lookbook
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:opacity-60">
                  Concept
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-mono-xs opacity-50 mb-4">Suport</h4>
            <ul className="space-y-2 text-sm">
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
              <li>
                <Link to="/livrare" className="hover:opacity-60">
                  Livrare
                </Link>
              </li>
              <li>
                <Link to="/retur" className="hover:opacity-60">
                  Retur
                </Link>
              </li>
              <li>
                <Link to="/schimb-marime" className="hover:opacity-60">
                  Schimb marime
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-mono-xs opacity-50 mb-4">
              {siteMode === "pre-launch" ? "Noutati produs" : "Noutati"}
            </h4>
            <p className="text-sm opacity-70 mb-3">{footerNewsletterText}</p>
            <a
              href="/#newsletter"
              className="font-mono-xs underline underline-offset-4 hover:opacity-60"
            >
              Primesc update
            </a>
          </div>
        </div>

        <div className="mt-14 grid md:grid-cols-12 gap-10 border-t border-cream/15 pt-10">
          <div className="md:col-span-3">
            <h4 className="font-mono-xs opacity-50 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/termeni-si-conditii" className="hover:opacity-60">
                  Termeni si conditii
                </Link>
              </li>
              <li>
                <Link to="/confidentialitate" className="hover:opacity-60">
                  Confidentialitate
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:opacity-60">
                  Cookies
                </Link>
              </li>
              <li>
                <Link to="/anpc" className="hover:opacity-60">
                  ANPC
                </Link>
              </li>
              <li>
                <Link to="/sol" className="hover:opacity-60">
                  SOL/SAL
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-mono-xs opacity-50 mb-4">Social</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href={instagram} className="hover:opacity-60">
                  Instagram
                </a>
              </li>
              <li>
                <a href={tiktok} className="hover:opacity-60">
                  TikTok
                </a>
              </li>
              {whatsapp && (
                <li>
                  <a href={whatsapp} className="hover:opacity-60">
                    WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-mono-xs opacity-50 mb-4">Incredere</h4>
            <ul className="space-y-2 text-sm opacity-80">
              {footerTrustItems.filter(Boolean).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-mono-xs opacity-50 mb-4">Contact</h4>
            <p className="text-sm opacity-70 leading-relaxed">
              <a href={`mailto:${contactEmail}`} className="hover:opacity-60">
                {contactEmail}
              </a>
              <br />
              {businessLine}
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-cream/15 flex flex-col md:flex-row justify-between gap-3 font-mono-xs opacity-50">
          <span>
            © {new Date().getFullYear()} {logoText}. Toate drepturile rezervate.
          </span>
          <span>{siteMode === "pre-launch" ? "Pre-lansare" : "Magazin activ"}</span>
        </div>
      </div>
    </footer>
  );
}
