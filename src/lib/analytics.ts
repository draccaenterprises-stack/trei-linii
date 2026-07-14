import { externalConfig } from "./site";

const GA_ID = externalConfig.analytics.googleAnalyticsId;
const META_PIXEL_ID = externalConfig.analytics.metaPixelId;
const SAFE_GA_ID = googleAnalyticsId(GA_ID);
const SAFE_META_PIXEL_ID = metaPixelId(META_PIXEL_ID);

let gaLoaded = false;
let metaLoaded = false;
let analyticsAllowed = false;
let marketingAllowed = false;
const emittedPurchases = new Set<string>();

export type AnalyticsEventMap = {
  view_item: { itemId: string; itemName: string; value?: number; currency?: string };
  select_variant: { itemId: string; size?: string; color?: string };
  add_to_cart: { itemId: string; quantity: number; value?: number; currency?: string };
  view_cart: { itemCount: number; value: number; currency: string };
  begin_checkout: { itemCount: number; value: number; currency: string };
  purchase: { orderId: string; value: number; currency: string };
};

type AnalyticsEventName = keyof AnalyticsEventMap;
type DebugSink = <Name extends AnalyticsEventName>(
  name: Name,
  properties: AnalyticsEventMap[Name],
) => void;

let debugSink: DebugSink | null = null;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/** True if at least one analytics ID is configured. */
export function analyticsConfigured(): boolean {
  return Boolean(SAFE_GA_ID || SAFE_META_PIXEL_ID);
}

/** Injects GA4 and/or Meta Pixel. Safe to call multiple times (runs once). */
export function applyTrackingConsent(consent: { analytics: boolean; marketing: boolean }): void {
  analyticsAllowed = consent.analytics;
  marketingAllowed = consent.marketing;
  if (typeof document === "undefined") return;

  if (analyticsAllowed && SAFE_GA_ID && !gaLoaded) {
    gaLoaded = true;
    const lib = document.createElement("script");
    lib.async = true;
    lib.src = `https://www.googletagmanager.com/gtag/js?id=${SAFE_GA_ID}`;
    document.head.appendChild(lib);

    const init = document.createElement("script");
    init.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',{'analytics_storage':'granted','ad_storage':'denied','ad_user_data':'denied','ad_personalization':'denied'});gtag('js',new Date());gtag('config','${SAFE_GA_ID}',{'anonymize_ip':true});`;
    document.head.appendChild(init);
  }

  if (marketingAllowed && SAFE_META_PIXEL_ID && !metaLoaded) {
    metaLoaded = true;
    const px = document.createElement("script");
    px.textContent = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');window.fbq=fbq;fbq('consent','grant');fbq('init','${SAFE_META_PIXEL_ID}');fbq('track','PageView');`;
    document.head.appendChild(px);
  }

  if (!analyticsAllowed && window.gtag) {
    window.gtag("consent", "update", { analytics_storage: "denied" });
  }
  if (!marketingAllowed && window.fbq) window.fbq("consent", "revoke");

  clearTrackingCookies({ analytics: !analyticsAllowed, marketing: !marketingAllowed });
}

/** Backwards-compatible helper used by older callers. */
export function loadAnalytics(): void {
  applyTrackingConsent({ analytics: true, marketing: true });
}

export function trackEvent<Name extends AnalyticsEventName>(
  name: Name,
  properties: AnalyticsEventMap[Name],
) {
  if (typeof window === "undefined" || (!analyticsAllowed && !marketingAllowed)) return;
  if (name === "purchase") {
    const orderId = (properties as AnalyticsEventMap["purchase"]).orderId;
    if (emittedPurchases.has(orderId)) return;
    emittedPurchases.add(orderId);
  }

  if (analyticsAllowed && window.gtag) window.gtag("event", name, properties);
  if (marketingAllowed && window.fbq) window.fbq("trackCustom", name, properties);
  debugSink?.(name, properties);
}

export function setAnalyticsDebugSink(sink: DebugSink | null) {
  debugSink = sink;
}

export function resetAnalyticsForTests() {
  analyticsAllowed = false;
  marketingAllowed = false;
  emittedPurchases.clear();
  debugSink = null;
}

function clearTrackingCookies(categories: { analytics: boolean; marketing: boolean }) {
  const prefixes = [
    ...(categories.analytics ? ["_ga", "_gid", "_gat"] : []),
    ...(categories.marketing ? ["_fbp", "_fbc"] : []),
  ];
  if (!prefixes.length) return;
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0]?.trim();
    if (!name || !prefixes.some((prefix) => name.startsWith(prefix))) return;
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
  });
}

function googleAnalyticsId(value?: string) {
  const trimmed = value?.trim();
  if (!trimmed || !/^G-[A-Z0-9]{4,20}$/i.test(trimmed)) return undefined;

  return trimmed;
}

function metaPixelId(value?: string) {
  const trimmed = value?.trim();
  if (!trimmed || !/^[0-9]{5,30}$/.test(trimmed)) return undefined;

  return trimmed;
}
