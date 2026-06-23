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
  returnEmail: "contact@treilinii.ro",
  returnAddress: "",
  domain: SITE_URL,
  brand: SITE_NAME,
  courier: "curierul afisat in checkout",
  paymentProcessor: "procesatorul afisat in checkout",
  shippingCost: "afisat in checkout",
  deliveryTerm: "2-3 zile lucratoare",
  updatedAt: "inainte de lansarea comenzilor",
};

export function hasLegalBusinessDetails(): boolean {
  return Boolean(LEGAL.company && LEGAL.cui && LEGAL.regCom && LEGAL.address);
}

export function legalBusinessFallback(): string {
  return "Datele comerciale vor fi completate inainte de lansarea comenzilor.";
}
