// Canonical site config used for SEO / social-share tags.
export const SITE_URL = "https://blank-atelier-canvas.lovable.app";

export const SITE_NAME = "Trei Linii";

/** Absolute URL helper for a path like "/og-image.jpg". */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export const LEGAL = {
  company: "",
  cui: "",
  regCom: "",
  address: "",
  phone: "",
  email: "contact@treilinii.ro",
};

export function hasLegalBusinessDetails(): boolean {
  return Boolean(LEGAL.company && LEGAL.cui && LEGAL.regCom && LEGAL.address);
}
