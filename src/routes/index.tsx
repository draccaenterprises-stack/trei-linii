import { createFileRoute, Link } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductCard";
import {
  BundlePreview,
  Newsletter,
  Reviews,
  ThreeLineDivider,
  TrustStrip,
} from "@/components/Sections";
import { fetchCollections, fetchProducts } from "@/lib/shopify";
import { sectionEnabled, useSite } from "@/lib/site-context";

import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [products, collections] = await Promise.all([fetchProducts(), fetchCollections()]);
    return { products, collections };
  },
  component: Index,
  head: () =>
    pageMeta({
      path: "/",
      title: "Trei Linii - Tricouri oversized cu design pe spate",
      description:
        "Trei Linii - tricouri oversized din bumbac dens, cu fata curata si print mai puternic pe spate. Lansarea 01 disponibila in curand.",
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
    .map((id) => products.find((p) => p.id === id || p.handle === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const featured = configuredFeatured.length ? configuredFeatured : products.slice(0, 4);

  return (
    <>
      {sectionEnabled(sections, "hero") && <Hero products={products} />}

      <TrustStrip />
      <ThreeLineDivider />

      <section className="px-5 md:px-10 py-16 md:py-24 border-b border-border">
        <div className="mx-auto max-w-[1600px] grid md:grid-cols-12 gap-10">
          <p className="md:col-span-3 font-mono-xs opacity-60">{conceptEyebrow}</p>
          <div className="md:col-span-8">
            <h2 className="font-display text-3xl md:text-6xl leading-tight">{conceptTitle}</h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {conceptBody}
            </p>
          </div>
        </div>
      </section>
      <ThreeLineDivider />

      {sectionEnabled(sections, "featured-products") && (
        <section className="featured-showcase px-5 md:px-10 py-20 md:py-32">
          <div className="mx-auto max-w-[1600px]">
            <div className="featured-heading mb-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-display text-4xl md:text-6xl">
                  {siteMode === "pre-launch" ? featuredTitlePreLaunch : featuredTitleLiveShop}
                </h2>
              </div>
            </div>
            <ProductGrid products={featured} carousel />
            <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="font-mono-xs opacity-45">← Gliseaza pentru mai multe modele</p>
              <Link
                to="/shop"
                className="font-mono-xs text-[#ff006f] underline underline-offset-4 hover:opacity-70"
              >
                Vezi toate produsele si colectiile
              </Link>
            </div>
          </div>
        </section>
      )}
      <ThreeLineDivider />
      <div className="h-8 bg-background md:h-10" aria-hidden="true" />

      <BundlePreview />

      {sectionEnabled(sections, "reviews") && <Reviews />}

      {sectionEnabled(sections, "faq") && (
        <section className="px-5 md:px-10 py-20 md:py-28 bg-cream border-y border-border">
          <div className="mx-auto max-w-[980px] text-center">
            <h2 className="font-display text-4xl md:text-6xl">
              Ai intrebari? Intra in sectiunea de{" "}
              <Link to="/faq" className="text-[#ff006f] hover:opacity-70">
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
