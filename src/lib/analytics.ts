// Analytics loader. Scripts are injected ONLY after cookie consent (GDPR/ANPC)
// and ONLY if the corresponding ID is configured via env.
//
// *TREBUIE SCHIMBAT* la lansare: seteaza in Lovable (Environment Variables):
//   VITE_GA_ID         = ID-ul Google Analytics 4 (ex. G-XXXXXXX)
//   VITE_META_PIXEL_ID = ID-ul Meta (Facebook) Pixel (numeric)
// Pana le setezi, codul exista dar nu incarca nimic (inert).

const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;
const SAFE_GA_ID = googleAnalyticsId(GA_ID);
const SAFE_META_PIXEL_ID = metaPixelId(META_PIXEL_ID);

let loaded = false;

/** True if at least one analytics ID is configured. */
export function analyticsConfigured(): boolean {
  return Boolean(SAFE_GA_ID || SAFE_META_PIXEL_ID);
}

/** Injects GA4 and/or Meta Pixel. Safe to call multiple times (runs once). */
export function loadAnalytics(): void {
  if (loaded || typeof document === "undefined") return;
  loaded = true;

  if (SAFE_GA_ID) {
    const lib = document.createElement("script");
    lib.async = true;
    lib.src = `https://www.googletagmanager.com/gtag/js?id=${SAFE_GA_ID}`;
    document.head.appendChild(lib);

    const init = document.createElement("script");
    init.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${SAFE_GA_ID}');`;
    document.head.appendChild(init);
  }

  if (SAFE_META_PIXEL_ID) {
    const px = document.createElement("script");
    px.textContent = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${SAFE_META_PIXEL_ID}');fbq('track','PageView');`;
    document.head.appendChild(px);
  }
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
