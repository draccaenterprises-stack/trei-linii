import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  Link,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { CartProvider } from "@/lib/cart-context";
import { SiteProvider } from "@/lib/site-context";
import { Announcement, Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl">404</h1>
        <h2 className="mt-4 text-xl">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">This page doesn't exist.</p>
        <Link to="/" className="inline-block mt-6 bg-charcoal text-cream px-6 py-3 font-mono-xs">
          Go home
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
        <h1 className="font-display text-3xl">Something broke.</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try again or head home.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="bg-charcoal text-cream px-6 py-3 font-mono-xs"
          >
            Try again
          </button>
          <a href="/" className="border border-border px-6 py-3 font-mono-xs">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "BLANK ATELIER — Quiet uniforms for loud cities" },
      { name: "description", content: "Heavyweight oversized tees from BLANK ATELIER. Volume I — Spring 2026. Made in Portugal, dressed on the street." },
      { property: "og:title", content: "BLANK ATELIER" },
      { property: "og:description", content: "Quiet uniforms for loud cities. Heavyweight oversized tees, Volume I." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
