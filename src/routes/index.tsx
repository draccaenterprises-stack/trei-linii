import { createFileRoute, Link } from "@tanstack/react-router";
import { CollectionCard } from "@/components/CollectionCard";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductCard";
import {
  BundleBanner,
  Newsletter,
  Reviews,
  SocialProofGrid,
  TrustStrip,
} from "@/components/Sections";
import { faqs, lookbookImages } from "@/lib/mock-data";
import { fetchCollections, fetchProducts } from "@/lib/shopify";
import { sectionEnabled, useSite } from "@/lib/site-context";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [products, collections] = await Promise.all([fetchProducts(), fetchCollections()]);
    return { products, collections };
  },
  component: Index,
});

function Index() {
  const { products, collections } = Route.useLoaderData();
  const { sections, featuredProductIds, featuredCollectionHandles, siteMode } = useSite();
  const configuredFeatured = featuredProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const featured = configuredFeatured.length ? configuredFeatured : products.slice(0, 4);
  const configuredFeaturedCols = featuredCollectionHandles
    .map((h) => collections.find((c) => c.handle === h))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  const featuredCols = configuredFeaturedCols.length
    ? configuredFeaturedCols
    : collections.slice(0, 3);

  return (
    <>
      {sectionEnabled(sections, "hero") && <Hero />}

      <TrustStrip />

      <section className="px-5 md:px-10 py-16 md:py-24 border-b border-border">
        <div className="mx-auto max-w-[1600px] grid md:grid-cols-12 gap-10">
          <p className="md:col-span-3 font-mono-xs opacity-60">Concept</p>
          <div className="md:col-span-8">
            <h2 className="font-display text-3xl md:text-6xl leading-tight">
              Tricouri simple in fata, gandite sa arate bine din spate.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Trei Linii porneste de la o idee clara: fit oversized, material dens si design
              minimalist plasat pe spate. Fara logo mare pe piept, fara zgomot vizual inutil.
            </p>
          </div>
        </div>
      </section>

      {sectionEnabled(sections, "featured-products") && (
        <section className="px-5 md:px-10 py-20 md:py-32">
          <div className="mx-auto max-w-[1600px]">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="font-mono-xs opacity-60">
                  01 · {siteMode === "pre-launch" ? "Preview modele" : "Modele disponibile"}
                </p>
                <h2 className="font-display text-4xl md:text-6xl mt-3">
                  {siteMode === "pre-launch" ? "Primele directii." : "Alege modelul."}
                </h2>
              </div>
              <Link
                to="/shop"
                className="font-mono-xs hover:opacity-60 underline underline-offset-4"
              >
                Vezi modelele
              </Link>
            </div>
            <ProductGrid products={featured} />
          </div>
        </section>
      )}

      <BundleBanner />

      {sectionEnabled(sections, "collections") && (
        <section className="px-5 md:px-10 py-20 md:py-32 bg-cream border-y border-border">
          <div className="mx-auto max-w-[1600px]">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="font-mono-xs opacity-60">02 · Structura</p>
                <h2 className="font-display text-4xl md:text-6xl mt-3">
                  Fit, material si design pe spate.
                </h2>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredCols.map((c) => (
                <CollectionCard key={c.handle} collection={c} />
              ))}
            </div>
          </div>
        </section>
      )}

      {sectionEnabled(sections, "lookbook") && (
        <section className="px-5 md:px-10 py-20 md:py-32">
          <div className="mx-auto max-w-[1600px]">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="font-mono-xs opacity-60">03 · Lookbook</p>
                <h2 className="font-display text-4xl md:text-6xl mt-3">Cum cade tricoul.</h2>
              </div>
              <Link
                to="/lookbook"
                className="font-mono-xs hover:opacity-60 underline underline-offset-4"
              >
                Deschide lookbook
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
              {lookbookImages.map((img, i) => (
                <Link
                  to="/lookbook"
                  key={img.src}
                  className={`img-zoom relative ${i === 1 ? "md:translate-y-12" : ""}`}
                >
                  <img
                    src={img.src}
                    alt={img.caption}
                    loading="lazy"
                    className="w-full aspect-[3/4] object-cover"
                  />
                  <span className="absolute bottom-3 left-3 font-mono-xs text-cream bg-charcoal/60 backdrop-blur px-2 py-1">
                    {img.caption}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {sectionEnabled(sections, "reviews") && <Reviews />}

      <SocialProofGrid />

      {sectionEnabled(sections, "faq") && (
        <section className="px-5 md:px-10 py-20 md:py-32 bg-cream border-y border-border">
          <div className="mx-auto max-w-[1600px] grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p className="font-mono-xs opacity-60">04 · FAQ</p>
              <h2 className="font-display text-4xl md:text-6xl mt-3">Intrebari utile.</h2>
              <Link
                to="/faq"
                className="inline-block mt-6 font-mono-xs underline underline-offset-4"
              >
                Vezi toate intrebarile
              </Link>
            </div>
            <div className="md:col-span-8">
              <FAQAccordion items={faqs.slice(0, 4)} />
            </div>
          </div>
        </section>
      )}

      {sectionEnabled(sections, "newsletter") && <Newsletter />}
    </>
  );
}
