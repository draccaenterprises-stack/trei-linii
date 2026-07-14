import { z } from "zod";

const publicConfigSchema = z.object({
  siteUrl: z.string().url(),
  siteMode: z.enum(["pre-launch", "live-shop"]),
  contactEmail: z.union([z.literal(""), z.string().email()]),
  company: z.string(),
  cui: z.string(),
  regCom: z.string(),
  address: z.string(),
  phone: z.string(),
  returnEmail: z.union([z.literal(""), z.string().email()]),
  returnAddress: z.string(),
  courier: z.string(),
  paymentProcessor: z.string(),
  shippingCost: z.string(),
  deliveryTerm: z.string(),
  legalUpdatedAt: z.string(),
  shopifyStoreDomain: z.string(),
  shopifyStorefrontToken: z.string(),
  shopifyApiVersion: z.string().regex(/^\d{4}-\d{2}$/),
  checkoutHosts: z.array(z.string()),
  previewCatalogEnabled: z.boolean(),
  e2eCommerceFixtureEnabled: z.boolean(),
  contactFormEndpoint: z.union([z.literal(""), z.string().url()]),
  klaviyoCompanyId: z.string(),
  klaviyoListId: z.string(),
  googleAnalyticsId: z.string(),
  metaPixelId: z.string(),
  instagram: z.string(),
  tiktok: z.string(),
  whatsapp: z.string(),
});

function env(name: string) {
  const value = import.meta.env[name] as string | undefined;
  return value?.trim() ?? "";
}

function csvEnv(name: string) {
  return env(name)
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

function booleanEnv(name: string, fallback: boolean) {
  const value = env(name).toLowerCase();
  if (!value) return fallback;
  return value === "true" || value === "1";
}

const parsedConfig = publicConfigSchema.safeParse({
  siteUrl: env("VITE_SITE_URL") || "https://blank-atelier-canvas.lovable.app",
  siteMode: env("VITE_SITE_MODE") || "pre-launch",
  contactEmail: env("VITE_CONTACT_EMAIL"),
  company: env("VITE_LEGAL_COMPANY"),
  cui: env("VITE_LEGAL_CUI"),
  regCom: env("VITE_LEGAL_REG_COM"),
  address: env("VITE_LEGAL_ADDRESS"),
  phone: env("VITE_LEGAL_PHONE"),
  returnEmail: env("VITE_RETURN_EMAIL") || env("VITE_CONTACT_EMAIL"),
  returnAddress: env("VITE_RETURN_ADDRESS"),
  courier: env("VITE_COURIER") || "curierul afișat în checkout",
  paymentProcessor: env("VITE_PAYMENT_PROCESSOR") || "procesatorul afișat în checkout",
  shippingCost: env("VITE_SHIPPING_COST") || "afișat în checkout",
  deliveryTerm: env("VITE_DELIVERY_TERM") || "afișat în checkout",
  legalUpdatedAt: env("VITE_LEGAL_UPDATED_AT"),
  shopifyStoreDomain: env("VITE_SHOPIFY_STORE_DOMAIN"),
  shopifyStorefrontToken: env("VITE_SHOPIFY_STOREFRONT_TOKEN"),
  shopifyApiVersion: env("VITE_SHOPIFY_API_VERSION") || "2026-01",
  checkoutHosts: csvEnv("VITE_CHECKOUT_HOSTS"),
  previewCatalogEnabled: booleanEnv("VITE_ENABLE_PREVIEW_CATALOG", true),
  e2eCommerceFixtureEnabled: booleanEnv("VITE_ENABLE_E2E_COMMERCE_FIXTURE", false),
  contactFormEndpoint: env("VITE_CONTACT_FORM_ENDPOINT"),
  klaviyoCompanyId: env("VITE_KLAVIYO_COMPANY_ID"),
  klaviyoListId: env("VITE_KLAVIYO_LIST_ID"),
  googleAnalyticsId: env("VITE_GA_ID"),
  metaPixelId: env("VITE_META_PIXEL_ID"),
  instagram: env("VITE_INSTAGRAM_URL"),
  tiktok: env("VITE_TIKTOK_URL"),
  whatsapp: env("VITE_WHATSAPP_URL"),
});

if (!parsedConfig.success) {
  throw new Error(`Configuratie publica invalida: ${parsedConfig.error.message}`);
}

export const publicConfig = Object.freeze(parsedConfig.data);
export const SITE_URL = publicConfig.siteUrl.replace(/\/$/, "");
export const SITE_NAME = "Trei Linii";

type SiteModeConfig = Pick<
  typeof publicConfig,
  | "siteMode"
  | "shopifyStoreDomain"
  | "shopifyStorefrontToken"
  | "company"
  | "cui"
  | "regCom"
  | "address"
>;

export function deriveSiteMode(config: SiteModeConfig): "pre-launch" | "live-shop" {
  const commerceReady = Boolean(
    config.shopifyStoreDomain &&
    config.shopifyStorefrontToken &&
    config.company &&
    config.cui &&
    config.regCom &&
    config.address,
  );

  return config.siteMode === "live-shop" && commerceReady ? "live-shop" : "pre-launch";
}

export const SITE_MODE = deriveSiteMode(publicConfig);

export const externalConfig = Object.freeze({
  shopify: {
    domain: publicConfig.shopifyStoreDomain,
    token: publicConfig.shopifyStorefrontToken,
    apiVersion: publicConfig.shopifyApiVersion,
    checkoutHosts: publicConfig.checkoutHosts,
    previewCatalogEnabled: publicConfig.previewCatalogEnabled,
    e2eCommerceFixtureEnabled: publicConfig.e2eCommerceFixtureEnabled,
  },
  forms: {
    contactEndpoint: publicConfig.contactFormEndpoint,
    klaviyoCompanyId: publicConfig.klaviyoCompanyId,
    klaviyoListId: publicConfig.klaviyoListId,
  },
  analytics: {
    googleAnalyticsId: publicConfig.googleAnalyticsId,
    metaPixelId: publicConfig.metaPixelId,
  },
  social: {
    instagram: publicConfig.instagram,
    tiktok: publicConfig.tiktok,
    whatsapp: publicConfig.whatsapp,
  },
});

/** Absolute URL helper for a path like "/og-image.jpg". */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export const LEGAL = {
  company: publicConfig.company,
  cui: publicConfig.cui,
  regCom: publicConfig.regCom,
  address: publicConfig.address,
  phone: publicConfig.phone,
  email: publicConfig.contactEmail,
  returnEmail: publicConfig.returnEmail,
  returnAddress: publicConfig.returnAddress,
  domain: SITE_URL,
  brand: SITE_NAME,
  courier: publicConfig.courier,
  paymentProcessor: publicConfig.paymentProcessor,
  shippingCost: publicConfig.shippingCost,
  deliveryTerm: publicConfig.deliveryTerm,
  updatedAt: publicConfig.legalUpdatedAt,
};

export function hasLegalBusinessDetails(): boolean {
  return Boolean(LEGAL.company && LEGAL.cui && LEGAL.regCom && LEGAL.address);
}

export function legalBusinessFallback(): string {
  return "Datele comerciale vor fi completate înainte de lansarea comenzilor.";
}
