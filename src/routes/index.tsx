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
import { lookbookImages } from "@/lib/mock-data";
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
  const site = useSite();
  const {
    sections,
    featuredProductIds,
    featuredCollectionHandles,
    siteMode,
    faqItems,
    conceptEyebrow,
    conceptTitle,
    conceptBody,
    featuredEyebrowPreLaunch,
    featuredEyebrowLiveShop,
    featuredTitlePreLaunch,
    featuredTitleLiveShop,
    featuredLinkText,
    collectionsEyebrow,
    collectionsTitle,
    lookbookEyebrow,
    lookbookTitle,
    lookbookLinkText,
    faqEyebrow,
    faqTitle,
    faqLinkText,
  } = site;
  const configuredFeatured = featuredProductIds
    .map((id) => products.find((p) => p.id === id || p.handle === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const featured = configuredFeatured.length ? configuredFeatured : products.slice(0, 4);
  const configuredFeaturedCols = featuredCollectionHandles
    .map((h) => collections.find((c) => c.handle === h))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  const featuredCols = configuredFeaturedCols.length
    ? configuredFeaturedCols
    : collections.slice(0, 3);
  const visibleFaqs = faqItems.filter((item) => item.enabled);

  return (
    <>
      {sectionEnabled(sections, "hero") && <Hero products={products} />}

      <TrustStrip />

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

      {sectionEnabled(sections, "featured-products") && (
        <section className="px-5 md:px-10 py-20 md:py-32">
          <div className="mx-auto max-w-[1600px]">
            <div className="flex items-end justify-between gap-6 mb-12">
              <div>
                <p className="font-mono-xs opacity-60">
                  {siteMode === "pre-launch" ? featuredEyebrowPreLaunch : featuredEyebrowLiveShop}
                </p>
                <h2 className="font-display text-4xl md:text-6xl mt-3">
                  {siteMode === "pre-launch" ? featuredTitlePreLaunch : featuredTitleLiveShop}
                </h2>
              </div>
              <Link
                to="/shop"
                className="font-mono-xs hover:opacity-60 underline underline-offset-4"
              >
                {featuredLinkText}
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
                <p className="font-mono-xs opacity-60">{collectionsEyebrow}</p>
                <h2 className="font-display text-4xl md:text-6xl mt-3">{collectionsTitle}</h2>
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
            <div className="flex items-end justify-between gap-6 mb-12">
              <div>
                <p className="font-mono-xs opacity-60">{lookbookEyebrow}</p>
                <h2 className="font-display text-4xl md:text-6xl mt-3">{lookbookTitle}</h2>
              </div>
              <Link
                to="/lookbook"
                className="font-mono-xs hover:opacity-60 underline underline-offset-4"
              >
                {lookbookLinkText}
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
              <p className="font-mono-xs opacity-60">{faqEyebrow}</p>
              <h2 className="font-display text-4xl md:text-6xl mt-3">{faqTitle}</h2>
              <Link
                to="/faq"
                className="inline-block mt-6 font-mono-xs underline underline-offset-4"
              >
                {faqLinkText}
              </Link>
            </div>
            <div className="md:col-span-8">
              <FAQAccordion items={visibleFaqs.slice(0, 4)} />
            </div>
          </div>
        </section>
      )}

      {sectionEnabled(sections, "newsletter") && <Newsletter />}
    </>
  );
}
