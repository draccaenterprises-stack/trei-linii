import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";

import { CartDrawer } from "@/components/CartDrawer";
import { CookieConsent } from "@/components/CookieConsent";
import { Footer } from "@/components/Footer";
import { Announcement, Header } from "@/components/Header";
import { CartProvider } from "@/lib/cart-context";
import { SiteProvider } from "@/lib/site-context";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl">404</h1>
        <h2 className="mt-4 text-xl">Pagina nu a fost gasita</h2>
        <p className="mt-2 text-sm text-muted-foreground">Pagina pe care o cauti nu exista.</p>
        <Link to="/" className="inline-block mt-6 bg-charcoal text-cream px-6 py-3 font-mono-xs">
          Inapoi acasa
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl">A aparut o eroare.</h1>
        <p className="mt-2 text-sm text-muted-foreground">Incearca din nou sau revino acasa.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="bg-charcoal text-cream px-6 py-3 font-mono-xs"
          >
            Incearca din nou
          </button>
          <a href="/" className="border border-border px-6 py-3 font-mono-xs">
            Acasa
          </a>
        </div>
      </div>
    </div>
  );
}

const seoTitle = "Trei Linii - Tricouri oversized cu design pe spate";
const seoDescription =
  "Trei Linii - tricouri oversized din bumbac dens, cu fata curata si print mai puternic pe spate. Lansarea 01 disponibila in curand.";
const ogImage = absoluteUrl("/og-image.jpg");

// Organization + WebSite structured data for Google.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: absoluteUrl("/favicon.png"),
      image: ogImage,
      email: "contact@treilinii.ro",
      description: seoDescription,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: "ro-RO",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
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
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
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
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <SiteProvider>
        <CartProvider>
          <Announcement />
          <Header />
          <main>
            <Outlet />
          </main>
          <Footer />
          <CartDrawer />
          <CookieConsent />
        </CartProvider>
      </SiteProvider>
    </QueryClientProvider>
  );
}
