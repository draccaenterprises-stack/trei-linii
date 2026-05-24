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
import { Footer } from "@/components/Footer";
import { Announcement, Header } from "@/components/Header";
import { CartProvider } from "@/lib/cart-context";
import { SiteProvider } from "@/lib/site-context";
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

const seoDescription =
  "Trei Linii - tricouri oversized din bumbac dens, cu fata curata si print mai puternic pe spate. Lansarea 01 disponibila in curand.";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Trei Linii - Tricouri oversized si streetwear curat" },
      { name: "description", content: seoDescription },
      { property: "og:title", content: "Trei Linii - Tricouri oversized si streetwear curat" },
      { property: "og:description", content: seoDescription },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Trei Linii - Tricouri oversized si streetwear curat" },
      { name: "twitter:description", content: seoDescription },
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
        </CartProvider>
      </SiteProvider>
    </QueryClientProvider>
  );
}
