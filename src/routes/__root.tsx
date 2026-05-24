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
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl">A apărut o eroare.</h1>
        <p className="mt-2 text-sm text-muted-foreground">Încearcă din nou sau revino acasă.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="bg-charcoal text-cream px-6 py-3 font-mono-xs"
          >
            Încearcă din nou
          </button>
          <a href="/" className="border border-border px-6 py-3 font-mono-xs">
            Acasă
          </a>
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
      { title: "Trei Linii — Tricouri oversized și streetwear curat" },
      {
        name: "description",
        content:
          "Trei Linii — tricouri oversized din bumbac dens, cu față curată și print mai puternic pe spate. Lansarea 01 disponibilă în curând.",
      },
      { property: "og:title", content: "Trei Linii — Tricouri oversized și streetwear curat" },
      {
        property: "og:description",
        content:
          "Tricouri oversized din bumbac dens, cu față curată și print mai puternic pe spate.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Trei Linii — Tricouri oversized și streetwear curat" },
      { name: "description", content: "3Linii is a React + TypeScript frontend demo for a minimal fashion brand, showcasing products and collections." },
      { property: "og:description", content: "3Linii is a React + TypeScript frontend demo for a minimal fashion brand, showcasing products and collections." },
      { name: "twitter:description", content: "3Linii is a React + TypeScript frontend demo for a minimal fashion brand, showcasing products and collections." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/49bdac7b-d7cb-4816-b609-491e2ad3ec36/id-preview-8009d740--e18bc022-dcaa-4623-816c-c9581808d4a1.lovable.app-1779578875799.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/49bdac7b-d7cb-4816-b609-491e2ad3ec36/id-preview-8009d740--e18bc022-dcaa-4623-816c-c9581808d4a1.lovable.app-1779578875799.png" },
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
