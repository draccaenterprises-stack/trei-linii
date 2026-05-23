import { createFileRoute, Link } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductCard";
import { CollectionCard } from "@/components/CollectionCard";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Newsletter, Reviews } from "@/components/Sections";
import { collections, faqs, lookbookImages, products } from "@/lib/mock-data";
import { sectionEnabled, useSite } from "@/lib/site-context";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { sections, featuredProductIds, featuredCollectionHandles } = useSite();
  const featured = featuredProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const featuredCols = featuredCollectionHandles
    .map((h) => collections.find((c) => c.handle === h))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <>
      {sectionEnabled(sections, "hero") && <Hero />}

      {sectionEnabled(sections, "featured-products") && (
        <section className="px-5 md:px-10 py-20 md:py-32">
          <div className="mx-auto max-w-[1600px]">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="font-mono-xs opacity-60">01 · Recomandate</p>
                <h2 className="font-display text-4xl md:text-6xl mt-3">Lansarea 01.</h2>
              </div>
              <Link
                to="/shop"
                className="font-mono-xs hover:opacity-60 underline underline-offset-4"
              >
                Vezi tot
              </Link>
            </div>
            <ProductGrid products={featured} />
          </div>
        </section>
      )}

      {sectionEnabled(sections, "collections") && (
        <section className="px-5 md:px-10 py-20 md:py-32 bg-cream border-y border-border">
          <div className="mx-auto max-w-[1600px]">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="font-mono-xs opacity-60">02 · Categorii</p>
                <h2 className="font-display text-4xl md:text-6xl mt-3">
                  Trei direcții.
                  <br />
                  Același limbaj.
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
                <p className="font-mono-xs opacity-60">03 · Editorial</p>
                <h2 className="font-display text-4xl md:text-6xl mt-3">În oraș.</h2>
              </div>
              <Link
                to="/lookbook"
                className="font-mono-xs hover:opacity-60 underline underline-offset-4"
              >
                Deschide Lansarea 01
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

      {sectionEnabled(sections, "faq") && (
        <section className="px-5 md:px-10 py-20 md:py-32 bg-cream border-y border-border">
          <div className="mx-auto max-w-[1600px] grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p className="font-mono-xs opacity-60">04 · FAQ</p>
              <h2 className="font-display text-4xl md:text-6xl mt-3">Întrebări frecvente.</h2>
              <Link
                to="/faq"
                className="inline-block mt-6 font-mono-xs underline underline-offset-4"
              >
                Vezi toate întrebările →
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
