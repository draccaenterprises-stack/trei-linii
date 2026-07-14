import { HeadContent, Link, Scripts, createRootRoute, useRouter } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { ErrorState, LoadingState } from "@/components/AsyncState";
import { CartProvider } from "@/lib/cart-context";
import { SiteProvider } from "@/lib/site-context";
import { LEGAL, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";
import { CatalogUnavailableError } from "@/lib/shopify";
import { buildSiteSchema, serializeJsonLd } from "@/lib/schema";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background px-4">
      <title>Pagina nu a fost găsită - Trei Linii</title>
      <meta name="robots" content="noindex, nofollow" />
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl">404</h1>
        <h2 className="mt-4 text-xl">Pagina nu a fost găsită</h2>
        <p className="mt-2 text-sm text-muted-foreground">Pagina pe care o cauți nu există.</p>
        <Link to="/" className="inline-block mt-6 bg-charcoal text-cream px-6 py-3 font-mono-xs">
          Înapoi acasă
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const catalogUnavailable = error instanceof CatalogUnavailableError;
  return (
    <ErrorState
      title={catalogUnavailable ? "Catalogul ia o pauză scurtă." : "A apărut o eroare."}
      message={
        catalogUnavailable
          ? "Nu am putut sincroniza produsele. Încearcă din nou în câteva momente."
          : "Încearcă din nou sau revino la pagina principală."
      }
      onRetry={() => {
        router.invalidate();
        reset();
      }}
    />
  );
}

const seoTitle = "Trei Linii - Tricouri oversized cu design pe spate";
const seoDescription =
  "Trei Linii - tricouri oversized cu fața curată și design construit pe spate. Descoperă colecțiile și detaliile fiecărei piese.";
const ogImage = absoluteUrl("/og-image.jpg");

const structuredData = buildSiteSchema({
  siteUrl: SITE_URL,
  siteName: SITE_NAME,
  logo: absoluteUrl("/apple-touch-icon.png"),
  image: ogImage,
  description: seoDescription,
  email: LEGAL.email || undefined,
});

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#2b2a28" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "ro_RO" },
      { property: "og:image", content: ogImage },
      { property: "og:image:width", content: "1600" },
      { property: "og:image:height", content: "1200" },
      { property: "og:image:alt", content: "Tricou oversized Trei Linii" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: ogImage },
    ],
    links: [
      {
        rel: "preload",
        href: "/fonts/hanken-grotesk-400-600-latin.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous" as const,
      },
      {
        rel: "preload",
        href: "/fonts/hanken-grotesk-400-600-latin-ext.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      ...[
        "cormorant-garamond-400-latin.woff2",
        "cormorant-garamond-400-latin-ext.woff2",
        "cormorant-garamond-400-italic-latin.woff2",
        "cormorant-garamond-400-italic-latin-ext.woff2",
        "ibm-plex-mono-400-latin.woff2",
        "ibm-plex-mono-400-latin-ext.woff2",
      ].map((font) => ({
        rel: "preload",
        href: `/fonts/${font}`,
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous" as const,
        media: "(min-width: 768px)",
      })),
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon-64.png", sizes: "64x64" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
  pendingComponent: LoadingState,
  pendingMs: 250,
  pendingMinMs: 300,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <SiteProvider>
      <CartProvider>
        <AppShell />
      </CartProvider>
    </SiteProvider>
  );
}
