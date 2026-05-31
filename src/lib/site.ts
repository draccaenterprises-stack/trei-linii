// Canonical site config used for SEO / social-share tags (og:url, canonical, sitemap, JSON-LD).
//
// *TREBUIE SCHIMBAT* la lansare: dupa ce cumperi domeniul, inlocuieste SITE_URL
// cu "https://3linii.ro" (fara slash la final). Apoi regenereaza sitemap-ul
// ruland: node scripts/generate-sitemap.mjs
export const SITE_URL = "https://blank-atelier-canvas.lovable.app";

export const SITE_NAME = "Trei Linii";

/** Absolute URL helper for a path like "/og-image.jpg". */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

// Datele firmei pentru paginile legale (ANPC / GDPR).
// *TREBUIE SCHIMBAT*: completeaza cu datele reale ale firmei inainte de lansare.
export const LEGAL = {
  company: "*TREBUIE SCHIMBAT* (denumire firma, ex. Trei Linii SRL / PFA)",
  cui: "*TREBUIE SCHIMBAT* (CUI / CIF)",
  regCom: "*TREBUIE SCHIMBAT* (Nr. Reg. Com., ex. J40/1234/2026)",
  address: "*TREBUIE SCHIMBAT* (sediu social complet)",
  phone: "*TREBUIE SCHIMBAT* (telefon)",
  email: "contact@treilinii.ro",
};
