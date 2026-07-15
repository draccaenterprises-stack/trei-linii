import { Link } from "@tanstack/react-router";
import { isKlaviyoConfigured } from "@/lib/klaviyo";
import { useSite } from "@/lib/site-context";
import { footerNavigation, legalNavigation, supportNavigation } from "@/lib/routes";

function publicSocialUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.pathname !== "/" ? url.toString() : null;
  } catch {
    return null;
  }
}

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
      : "";
  const taglineLines = footerTagline.split("\n").filter(Boolean);
  const newsletterAvailable = isKlaviyoConfigured();
  const socialLinks = [
    { label: "Instagram", href: publicSocialUrl(instagram) },
    { label: "TikTok", href: publicSocialUrl(tiktok) },
    { label: "WhatsApp", href: publicSocialUrl(whatsapp) },
  ].filter((item): item is { label: string; href: string } => Boolean(item.href));

  return (
    <footer className="bg-charcoal text-cream mt-32">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10 py-16 md:py-24">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="font-display text-3xl leading-[0.95] md:text-5xl">
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
              <span className="h-px w-[88%] bg-signature" />
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-mono-xs opacity-50 mb-4">Navigație</h4>
            <ul className="space-y-2 text-sm">
              {footerNavigation.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="hover:opacity-60">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-mono-xs opacity-50 mb-4">Suport</h4>
            <ul className="space-y-2 text-sm">
              {supportNavigation.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="hover:opacity-60">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            {newsletterAvailable ? (
              <>
                <h4 className="font-mono-xs opacity-50 mb-4">
                  {siteMode === "pre-launch" ? "Noutăți produs" : "Noutăți"}
                </h4>
                <p className="text-sm opacity-70 mb-3">{footerNewsletterText}</p>
                <a
                  href="/#newsletter"
                  className="font-mono-xs underline underline-offset-4 hover:opacity-60"
                >
                  Mă abonez
                </a>
              </>
            ) : (
              <>
                <h4 className="font-mono-xs opacity-50 mb-4">Din atelier</h4>
                <p className="text-sm opacity-70 mb-3">
                  Povestea, regulile și direcția din spatele fiecărei ediții.
                </p>
                <Link
                  to="/manifest"
                  className="font-mono-xs underline underline-offset-4 hover:opacity-60"
                >
                  Citește manifestul
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="mt-14 grid md:grid-cols-12 gap-10 border-t border-cream/15 pt-10">
          <div className="md:col-span-3">
            <h4 className="font-mono-xs opacity-50 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              {legalNavigation.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="hover:opacity-60">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  className="hover:opacity-60"
                  onClick={() => window.dispatchEvent(new Event("trei-linii:cookie-settings"))}
                >
                  Preferințe cookies
                </button>
              </li>
            </ul>
          </div>

          {socialLinks.length > 0 && (
            <div className="md:col-span-3">
              <h4 className="font-mono-xs opacity-50 mb-4">Social</h4>
              <ul className="space-y-2 text-sm">
                {socialLinks.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="hover:opacity-60"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="md:col-span-3">
            <h4 className="font-mono-xs opacity-50 mb-4">Încredere</h4>
            <ul className="space-y-2 text-sm opacity-80">
              {footerTrustItems.filter(Boolean).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          {(contactEmail || businessLine) && (
            <div className="md:col-span-3">
              <h4 className="font-mono-xs opacity-50 mb-4">Contact</h4>
              <p className="text-sm opacity-70 leading-relaxed">
                {contactEmail && (
                  <a href={`mailto:${contactEmail}`} className="hover:opacity-60">
                    {contactEmail}
                  </a>
                )}
                {contactEmail && businessLine && <br />}
                {businessLine}
              </p>
            </div>
          )}
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
