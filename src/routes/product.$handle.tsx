import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  RotateCcw,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";
import { SizeGuideTable } from "@/components/SizeGuideTable";
import { SizeSelector, VariantSelector } from "@/components/VariantSelectors";
import { useCart } from "@/lib/cart-context";
import { formatRON } from "@/lib/format";
import { productRepository } from "@/lib/product-repository";
import { canPurchaseProduct, getPhotoImages, getStockForColor } from "@/lib/shopify";
import { useSite } from "@/lib/site-context";
import { SITE_URL } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { FeedbackRegion } from "@/components/FeedbackRegion";
import { buildBreadcrumbSchema, buildProductSchema, serializeJsonLd } from "@/lib/schema";
import { isKlaviyoConfigured } from "@/lib/klaviyo";

export const Route = createFileRoute("/product/$handle")({
  loader: async ({ params }) => {
    const [product, products] = await Promise.all([
      productRepository.getProduct(params.handle),
      productRepository.listProducts(),
    ]);
    if (!product) throw notFound();
    const related = products.filter((p) => p.id !== product.id).slice(0, 3);
    return { product, related };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return {};
    const url = `${SITE_URL}/product/${params.handle}`;
    const title = `${loaderData.product.title} - Trei Linii`;
    const description = loaderData.product.description;
    const image = loaderData.product.images[0];
    const canPurchase = canPurchaseProduct(loaderData.product);
    const productData = buildProductSchema({
      product: loaderData.product,
      url,
      purchasable: canPurchase,
    });
    const breadcrumbData = buildBreadcrumbSchema([
      { name: "Acasă", url: SITE_URL },
      { name: "Shop", url: `${SITE_URL}/shop` },
      { name: loaderData.product.title, url },
    ]);

    return {
      meta: [
        { title },
        { name: "description", content: description },
        ...(loaderData.product.isPreview ? [{ name: "robots", content: "noindex, nofollow" }] : []),
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "product" },
        ...(image ? [{ property: "og:image", content: image }] : []),
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        ...(image ? [{ name: "twitter:image", content: image }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: serializeJsonLd(productData),
        },
        {
          type: "application/ld+json",
          children: serializeJsonLd(breadcrumbData),
        },
      ],
    };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <div className="px-5 py-32 text-center">
      <h1 className="font-display text-5xl">Produsul nu a fost găsit</h1>
      <Link to="/shop" className="font-mono-xs underline mt-6 inline-block">
        Înapoi la modele
      </Link>
    </div>
  ),
});

function ProductPage() {
  const { product, related } = Route.useLoaderData();
  const { accentColor, siteMode } = useSite();
  const { addItem } = useCart();
  const [size, setSize] = useState<(typeof product.sizes)[number] | null>(null);
  const [color, setColor] = useState<string>(
    product.colors.length === 1 ? (product.colors[0]?.name ?? "") : "",
  );
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [purchaseMessage, setPurchaseMessage] = useState("");
  const selectedColorStock = useMemo(() => getStockForColor(product, color), [product, color]);
  const productCanBePurchased = canPurchaseProduct(product);
  // Worn photography leads the gallery; isolated vector design stays at the end.
  const galleryImages = useMemo<string[]>(() => {
    const photos = getPhotoImages(product);
    const rest = product.images.filter((image: string) => !photos.includes(image));
    const ordered = [...photos, ...rest];
    return ordered.length ? ordered : [""];
  }, [product]);


  useEffect(() => {
    trackEvent("view_item", {
      itemId: product.id,
      itemName: product.title,
      value: product.price,
      currency: "RON",
    });
  }, [product.id, product.price, product.title]);

  useEffect(() => {
    if (size && selectedColorStock[size] === 0) setSize(null);
  }, [selectedColorStock, size]);

  const handleAdd = () => {
    if (!productCanBePurchased) {
      setPurchaseMessage("Comanda nu este activă momentan pentru această piesă.");
      return;
    }
    if (!color) {
      setPurchaseMessage("Alege o culoare înainte de a adăuga produsul în coș.");
      return;
    }
    if (!size) {
      setPurchaseMessage("Alege o mărime înainte de a adăuga produsul în coș.");
      return;
    }
    if (selectedColorStock[size] === 0) {
      setPurchaseMessage("Varianta aleasă nu este momentan în stoc.");
      return;
    }
    const result = addItem(product, size, color);
    setPurchaseMessage(result.ok ? "" : result.message);
  };

  return (
    <div className="px-5 md:px-10 py-8 md:py-12 pb-28 md:pb-12">
      <div className="mx-auto max-w-[1600px]">
        <nav className="font-mono-xs opacity-60 mb-8">
          <Link to="/shop" className="hover:opacity-100">
            Modele
          </Link>
          <span className="mx-2">/</span>
          <span>{product.title}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-7 grid md:grid-cols-2 gap-3 md:gap-4">
            {galleryImages.map((img: string, i: number) => (
              <button
                key={`${img}-${i}`}
                type="button"
                className="group/image relative aspect-[3/4] bg-warm-grey img-zoom"
                aria-label={`Mărește imaginea ${i + 1} pentru ${product.title}`}
                disabled={!img}
                onClick={() => {
                  setGalleryIndex(i);
                  setGalleryOpen(true);
                }}
              >
                <ResponsiveImage
                  src={img}
                  alt={`${product.title} ${i === 0 ? "spate" : "detaliu"}`}
                  width={1200}
                  height={1600}
                  priority={i === 0}
                  sizes="(min-width: 1024px) 29vw, (min-width: 768px) 50vw, 100vw"
                  className="w-full h-full object-cover"
                />
                {img && (
                  <span className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center bg-background/90 text-charcoal opacity-100 shadow-sm md:opacity-0 md:transition-opacity md:group-hover/image:opacity-100">
                    <Maximize2 className="h-4 w-4" aria-hidden="true" />
                  </span>
                )}
              </button>
            ))}
          </div>

          <aside className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono-xs bg-charcoal text-cream px-2 py-1">
                {productCanBePurchased ? (product.badge ?? "disponibil") : "în pregătire"}
              </span>
              <span className="font-mono-xs opacity-60">design pe spate</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl leading-tight">{product.title}</h1>
            <div className="mt-4">
              <div
                className="font-display text-3xl md:text-4xl tabular-nums"
                style={{ color: accentColor }}
              >
                {product.isPreview ? "În pregătire" : formatRON(product.price)}
              </div>
              <p className="mt-1 font-mono-xs text-muted-foreground">
                {productCanBePurchased
                  ? "Livrarea se calculează în checkout"
                  : "Comenzile pentru această piesă vor fi deschise la lansare"}
              </p>
            </div>

            <div className="mt-8 space-y-4 text-muted-foreground leading-relaxed">
              {getDescriptionParagraphs(product).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>


            <div className="mt-6 grid grid-cols-2 gap-3 font-mono-xs">
              <div className="border border-border p-3">
                <span className="mb-1 block text-muted-foreground">Material</span>
                Detalii în descriere
              </div>
              <div className="border border-border p-3">
                <span className="mb-1 block text-muted-foreground">Fit</span>
                {product.fitNote}
              </div>
            </div>

            <div className="mt-10 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono-xs">Culoare - {color}</span>
                </div>
                <VariantSelector
                  colors={product.colors}
                  value={color}
                  onChange={(nextColor) => {
                    setColor(nextColor);
                    setSize(null);
                    setPurchaseMessage("");
                    trackEvent("select_variant", { itemId: product.id, color: nextColor });
                  }}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono-xs">Mărime</span>
                  <button
                    type="button"
                    onClick={() => setSizeGuideOpen(true)}
                    className="group relative font-mono-xs underline underline-offset-4 opacity-60 hover:opacity-100"
                  >
                    Ghid mărimi
                    <span className="pointer-events-none absolute bottom-full right-0 mb-3 hidden w-44 rotate-[-2deg] border-2 border-charcoal bg-cream px-3 py-2 text-left text-[10px] leading-snug text-charcoal opacity-0 shadow-sm transition-opacity group-hover:block group-hover:opacity-100">
                      Apasă pentru a vedea ghidul
                      <span className="absolute -bottom-2 right-5 h-3 w-3 rotate-45 border-b-2 border-r-2 border-charcoal bg-cream" />
                    </span>
                  </button>
                </div>
                <SizeSelector
                  sizes={product.sizes}
                  stock={selectedColorStock}
                  value={size}
                  onChange={(nextSize) => {
                    setSize(nextSize);
                    setPurchaseMessage("");
                    trackEvent("select_variant", {
                      itemId: product.id,
                      color,
                      size: nextSize,
                    });
                  }}
                />
              </div>

              {productCanBePurchased ? (
                <button
                  type="button"
                  onClick={handleAdd}
                  className="w-full bg-charcoal text-cream py-4 font-mono-xs hover:bg-charcoal/90 transition-colors"
                >
                  Adaugă în coș - {formatRON(product.price)}
                </button>
              ) : (
                <Link
                  to={isKlaviyoConfigured() ? "/" : "/shop"}
                  hash={isKlaviyoConfigured() ? "newsletter" : undefined}
                  className="flex w-full items-center justify-center gap-2 border bg-transparent py-4 font-mono-xs transition-colors hover:bg-charcoal hover:text-cream"
                  style={{ borderColor: accentColor, color: accentColor }}
                >
                  <Bell className="h-4 w-4" strokeWidth={1.5} />
                  {isKlaviyoConfigured() ? "Primește noutăți despre produs" : "Vezi colecțiile"}
                </Link>
              )}
              <FeedbackRegion message={purchaseMessage} tone="error" />

              <ul className="flex flex-wrap items-center gap-3 text-muted-foreground">
                <li className="flex items-center gap-1.5">
                  <Truck className="h-4 w-4" strokeWidth={1.25} />
                  <Link to="/livrare" className="font-mono-xs underline-offset-4 hover:underline">
                    Livrare
                  </Link>
                </li>
                <li className="flex items-center gap-1.5">
                  <RotateCcw className="h-4 w-4" strokeWidth={1.25} />
                  <Link to="/retur" className="font-mono-xs underline-offset-4 hover:underline">
                    Retur 14 zile
                  </Link>
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" strokeWidth={1.25} />
                  <span className="font-mono-xs">Plată securizată</span>
                </li>
              </ul>

              <p className="font-mono-xs opacity-60">Croială: {product.fitNote}</p>
            </div>

            <div className="mt-10 space-y-8 border-t border-border pt-8">
              <InfoBlock title="Ce îl diferențiază">
                <ul className="space-y-2">
                  <li>Fața rămâne curată, fără logo mare pe piept.</li>
                  <li>Designul principal este plasat pe spate.</li>
                  <li>Detaliile de croială sunt prezentate în descrierea produsului.</li>
                </ul>
              </InfoBlock>

              <InfoBlock title="Îngrijire">
                Urmează instrucțiunile de pe eticheta produsului. Pentru protejarea printului, evită
                contactul direct al fierului de călcat cu grafica.
              </InfoBlock>
            </div>
          </aside>
        </div>

        <section className="mt-20 md:mt-32 border-t border-border pt-12">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <p className="font-mono-xs opacity-60">S-ar putea să-ți placă și</p>
              <h2 className="font-display text-4xl md:text-6xl mt-3">Mai multe modele.</h2>
            </div>
            <Link to="/shop" className="font-mono-xs underline underline-offset-4">
              Vezi tot
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {related.map((item: (typeof related)[number]) => (
              <Link key={item.id} to="/product/$handle" params={{ handle: item.handle }}>
                <ResponsiveImage
                  src={item.images[0]}
                  alt={item.title}
                  width={1200}
                  height={1600}
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="aspect-[3/4] w-full object-cover bg-warm-grey"
                />
                <div className="mt-3 flex justify-between gap-3">
                  <span className="font-display">{item.title}</span>
                  {siteMode === "live-shop" && (
                    <span className="text-sm tabular-nums">{formatRON(item.price)}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {productCanBePurchased && (
        <div
          className="fixed left-0 right-0 z-40 border-t border-border bg-background p-4 md:hidden"
          style={{ bottom: "var(--cookie-banner-height, 0px)" }}
        >
          <button
            type="button"
            onClick={handleAdd}
            className="w-full bg-charcoal text-cream py-4 font-mono-xs"
          >
            Adaugă în coș - {formatRON(product.price)}
          </button>
        </div>
      )}

      <Dialog.Root open={sizeGuideOpen} onOpenChange={setSizeGuideOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-charcoal/45" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100svh-2.5rem)] w-[calc(100%-2.5rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto border border-border bg-background p-5 shadow-xl focus:outline-none md:p-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="font-mono-xs opacity-60">Fit oversized</p>
                <Dialog.Title className="mt-2 font-display text-4xl">Ghid mărimi</Dialog.Title>
                <Dialog.Description className="mt-3 text-sm text-muted-foreground">
                  Compară măsurătorile produsului cu un tricou pe care îl porți deja. Dimensiunile
                  exacte sunt publicate în descrierea fiecărei piese.
                </Dialog.Description>
              </div>
              <Dialog.Close
                aria-label="Închide ghidul de mărimi"
                className="grid h-9 w-9 shrink-0 place-items-center border border-border hover:bg-charcoal hover:text-cream"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </Dialog.Close>
            </div>
            <div className="mt-6">
              <SizeGuideTable />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={galleryOpen} onOpenChange={setGalleryOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[70] bg-charcoal/90" />
          <Dialog.Content
            className="fixed inset-0 z-[71] flex flex-col bg-charcoal text-cream outline-none"
            onKeyDown={(event) => {
              if (galleryImages.length <= 1) return;
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                setGalleryIndex((index) => (index === 0 ? galleryImages.length - 1 : index - 1));
              }
              if (event.key === "ArrowRight") {
                event.preventDefault();
                setGalleryIndex((index) => (index + 1) % galleryImages.length);
              }
            }}
          >
            <Dialog.Title className="sr-only">Galerie foto {product.title}</Dialog.Title>
            <Dialog.Description className="sr-only">
              Imagine mărită. Folosește butoanele pentru a naviga între fotografii.
            </Dialog.Description>

            <div className="flex h-16 shrink-0 items-center justify-between border-b border-cream/15 px-4 md:px-8">
              <p className="font-mono-xs text-cream/65">
                {String(galleryIndex + 1).padStart(2, "0")} /{" "}
                {String(galleryImages.length).padStart(2, "0")}
              </p>
              <Dialog.Close
                aria-label="Închide galeria"
                className="grid h-10 w-10 place-items-center border border-cream/25 hover:bg-cream hover:text-charcoal"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Dialog.Close>
            </div>

            <div className="relative min-h-0 flex-1">
              <ResponsiveImage
                src={galleryImages[galleryIndex] ?? ""}
                alt={`${product.title}, imagine mărită ${galleryIndex + 1}`}
                width={1600}
                height={2000}
                sizes="100vw"
                className="h-full w-full object-contain p-3 md:p-8"
              />

              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Imaginea anterioară"
                    className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center border border-cream/25 bg-charcoal/65 hover:bg-cream hover:text-charcoal md:left-8"
                    onClick={() =>
                      setGalleryIndex((index) =>
                        index === 0 ? galleryImages.length - 1 : index - 1,
                      )
                    }
                  >
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="Imaginea următoare"
                    className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center border border-cream/25 bg-charcoal/65 hover:bg-cream hover:text-charcoal md:right-8"
                    onClick={() => setGalleryIndex((index) => (index + 1) % galleryImages.length)}
                  >
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </>
              )}
            </div>

            {galleryImages.length > 1 && (
              <div className="flex shrink-0 justify-center gap-2 overflow-x-auto border-t border-cream/15 px-4 py-3">
                {galleryImages.map((image, index) => (
                  <button
                    key={`${image}-thumbnail-${index}`}
                    type="button"
                    aria-label={`Deschide imaginea ${index + 1}`}
                    aria-pressed={galleryIndex === index}
                    className={`h-16 w-12 shrink-0 border ${
                      galleryIndex === index ? "border-signature" : "border-cream/20"
                    }`}
                    onClick={() => setGalleryIndex(index)}
                  >
                    <ResponsiveImage
                      src={image}
                      alt=""
                      width={240}
                      height={320}
                      sizes="48px"
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

function InfoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-mono-xs mb-3">{title}</h2>
      <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}
