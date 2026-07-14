import { createFileRoute, Link } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductCard";
import {
  BundlePreview,
  MarqueeDivider,
  Newsletter,
  ThreeLineDivider,
  TrustStrip,
} from "@/components/Sections";
import { loadCatalog } from "@/lib/product-repository";
import { sectionEnabled, useSite } from "@/lib/site-context";

import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/")({
  loader: () => loadCatalog(),
  component: Index,
  head: () =>
    pageMeta({
      path: "/",
      title: "Trei Linii - Tricouri oversized cu design pe spate",
      description:
        "Trei Linii - tricouri cu fața curată și design construit pe spate. Descoperă colecțiile și detaliile fiecărei piese.",
    }),
});

function Index() {
  const { products, collections } = Route.useLoaderData();
  void collections;
  const site = useSite();
  const {
    sections,
    featuredProductIds,
    conceptEyebrow,
    conceptTitle,
    conceptBody,
    featuredTitlePreLaunch,
    featuredTitleLiveShop,
    siteMode,
  } = site;
  const configuredFeatured = featuredProductIds
    .map((id) => products.find((p: (typeof products)[number]) => p.id === id || p.handle === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const featured = configuredFeatured.length ? configuredFeatured : products.slice(0, 4);

  return (
    <>
      {sectionEnabled(sections, "hero") && <Hero products={products} />}

      <TrustStrip />
      <MarqueeDivider />

      <section className="px-5 py-20 md:px-10 md:py-32">
        <div className="mx-auto grid max-w-[1600px] gap-10 md:grid-cols-12 md:gap-14">
          <div className="flex flex-col justify-between md:col-span-3">
            <p className="font-mono-xs opacity-60">{conceptEyebrow}</p>
            <Link
              to="/manifest"
              className="mt-10 inline-flex w-fit items-center gap-3 font-mono-xs text-accent-text underline underline-offset-4 transition-opacity hover:opacity-65 md:mt-0"
            >
              Citește manifestul <span aria-hidden="true">&#8599;</span>
            </Link>
          </div>
          <div className="md:col-span-8 md:col-start-5">
            <h2 className="max-w-5xl font-display text-5xl leading-[0.98] md:text-7xl">
              {conceptTitle}
            </h2>
            <div className="mt-8 grid gap-8 border-t border-border pt-7 md:grid-cols-[minmax(0,1fr)_13rem]">
              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {conceptBody}
              </p>
              <div className="space-y-3 font-mono-xs text-charcoal/65">
                <p>01 / specificații clare</p>
                <p>02 / proporții relaxate</p>
                <p>03 / design pe spate</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ThreeLineDivider />

      {sectionEnabled(sections, "featured-products") && featured.length > 0 && (
        <section className="featured-showcase px-5 md:px-10 py-20 md:py-32">
          <div className="mx-auto max-w-[1600px]">
            <div className="featured-heading mb-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-display text-4xl md:text-6xl">
                  {siteMode === "pre-launch" ? featuredTitlePreLaunch : featuredTitleLiveShop}
                </h2>
              </div>
            </div>
            <ProductGrid products={featured} carousel showQuickView={false} />
            <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="font-mono-xs opacity-45">← Glisează pentru mai multe modele</p>
              <Link
                to="/shop"
                className="font-mono-xs text-accent-text underline underline-offset-4 hover:opacity-70"
              >
                Vezi toate produsele și colecțiile
              </Link>
            </div>
          </div>
        </section>
      )}
      <ThreeLineDivider />
      <div className="h-8 bg-background md:h-10" aria-hidden="true" />

      <BundlePreview />

      {sectionEnabled(sections, "faq") && (
        <section className="px-5 md:px-10 py-20 md:py-28 bg-cream border-y border-border">
          <div className="mx-auto max-w-[980px] text-center">
            <h2 className="font-display text-4xl md:text-6xl">
              Ai întrebări? Intră în secțiunea de{" "}
              <Link
                to="/faq"
                className="text-accent-text underline decoration-1 underline-offset-4 hover:opacity-70"
              >
                FAQ
              </Link>
              .
            </h2>
          </div>
        </section>
      )}

      {sectionEnabled(sections, "newsletter") && <Newsletter />}
    </>
  );
}
