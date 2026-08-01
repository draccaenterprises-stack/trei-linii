import { createFileRoute, Link } from "@tanstack/react-router";
import { type MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { QuickViewOverlay } from "@/components/ProductCard";
import { formatRON } from "@/lib/format";
import type { Collection, Product, Size } from "@/lib/catalog-types";
import { loadCatalog } from "@/lib/product-repository";
import {
  canPurchaseProduct,
  findVectorImage,
  getPhotoImages,
  getStockForColor,
  isPreviewCatalogEnabled,
} from "@/lib/shopify";

import { useCart } from "@/lib/cart-context";
import { clamp, createFrameScheduler } from "@/lib/motion";
import { pageMeta } from "@/lib/seo";
import { preloadQuickViewImages } from "@/lib/quick-view";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { FeedbackRegion } from "@/components/FeedbackRegion";
import { EmptyState } from "@/components/AsyncState";
import { SITE_MODE } from "@/lib/site";

const contextCaptions = [
  "Vedere complementară a produsului",
  "Detaliu de spate",
  "Proporție și cădere",
  "Detaliu cromatic",
] as const;

const shopSearchSchema = z.object({
  colectie: z.string().optional(),
});

type CollectionGroup = {
  collection: Collection;
  products: Product[];
};

const previewCopy = [
  {
    title: "Linie de atelier",
    description:
      "O compoziție liniară simplă, așezată vertical pe spate. Fața rămâne complet curată.",
    vibe: "Un studiu despre ritm, distanță și spațiu liber.",
  },
  {
    title: "Cadru tipografic",
    description:
      "Un cadru subțire și un semn tipografic discret construiesc spatele. Gândit pentru o bază neutră.",
    vibe: "Tipografie redusă la formă și proporție.",
  },
  {
    title: "Semn modular",
    description: "Forme repetate, lăsate să respire. Un model grafic fără aglomerare.",
    vibe: "Repetiție controlată, cu o singură ruptură de ritm.",
  },
  {
    title: "Ritm vertical",
    description:
      "Linii lungi și contrast redus pentru un spate mai calm. Construcția rămâne vizibilă de aproape.",
    vibe: "Mișcare verticală păstrată într-un cadru simplu.",
  },
  {
    title: "Contur nocturn",
    description:
      "O direcție charcoal cu grafică luminoasă și contur fin. Potrivită pentru o paletă închisă.",
    vibe: "Contrast scurt, desenat pentru lumina de seară.",
  },
  {
    title: "Material spălat",
    description:
      "Culoarea spălată devine fundal pentru un print aerisit. Proporția rămâne relaxată.",
    vibe: "Textura întâi, semnătura grafică după.",
  },
  {
    title: "Linie cromatică",
    description:
      "Un singur accent de culoare traversează compoziția de pe spate. Restul rămâne intenționat reținut.",
    vibe: "Culoare folosită ca semn, nu ca decor.",
  },
  {
    title: "Arhivă urbană",
    description:
      "Referințe de atelier și notații mici reunite într-un print compact. Fața rămâne fără mesaj.",
    vibe: "O pagină de arhivă mutată pe material.",
  },
] as const;

function addPreviewProducts(groups: CollectionGroup[], previewTemplates: Product[]) {
  if (!isPreviewCatalogEnabled() || !previewTemplates.length) return groups;

  return groups.map((group, groupIndex) => {
    const missingCount = Math.max(0, 4 - group.products.length);
    const previews = Array.from({ length: missingCount }, (_, offset) => {
      const pieceIndex = group.products.length + offset;
      const templateIndex = (groupIndex * 4 + pieceIndex) % previewTemplates.length;
      const template = previewTemplates[templateIndex];
      const copy = previewCopy[templateIndex % previewCopy.length];
      const number = String(pieceIndex + 1).padStart(2, "0");

      return {
        ...template,
        id: `preview-${group.collection.handle}-${number}`,
        handle: `preview-${group.collection.handle}-${number}`,
        title: `Tricou ${copy.title} ${number}`,
        description: copy.description,
        vibe: copy.vibe,
        fitNote: "Croială oversized, cu linia umărului coborâtă.",
        collection: group.collection.handle,
        collections: [group.collection.handle],
        badge: undefined,
        variants: undefined,
        isPreview: true,
      } satisfies Product;
    });

    return {
      collection: { ...group.collection, count: group.products.length + previews.length },
      products: [...group.products, ...previews],
    };
  });
}

function buildCollectionGroups(
  products: Product[],
  collections: Collection[],
  previewTemplates: Product[],
): CollectionGroup[] {
  const groups = collections
    .map((collection) => {
      const members = products.filter((product) => {
        if (collection.productIds?.includes(product.id)) return true;
        if (product.collections?.includes(collection.handle)) return true;
        return product.collection === collection.handle;
      });

      // Respect the curated Shopify collection order when it is known.
      const order = collection.productIds ?? [];
      const ordered = [...members].sort((a, b) => {
        const ai = order.indexOf(a.id);
        const bi = order.indexOf(b.id);
        if (ai === -1 && bi === -1) return 0;
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      });

      return { collection, products: ordered };
    })
    .filter((group) => group.products.length > 0);

  // Products outside any curated collection stay on /shop/lista only —
  // they must never become a synthetic numbered collection here.

  if (!groups.length && products.length) {
    groups.push({
      collection: {
        handle: "editia-curenta",
        title: "Ediția curentă",
        description:
          "Piese construite pe aceeași regulă: față curată și design pe spate. Specificațiile rămân pe pagina fiecărui produs.",
        image: products[0]?.images[0] ?? "",
        count: products.length,
        productIds: products.map((product) => product.id),
      },
      products,
    });
  }

  return addPreviewProducts(groups, previewTemplates);
}

function conciseDescription(value: string) {
  return value
    .trim()
    .split(/(?<=[.!?])\s+/)
    .slice(0, 2)
    .join(" ");
}

export const Route = createFileRoute("/shop")({
  validateSearch: shopSearchSchema,
  loader: async () => {
    const catalog = await loadCatalog();
    const previewTemplates =
      import.meta.env.DEV && isPreviewCatalogEnabled()
        ? (await import("@/lib/mock-data")).products
        : [];
    return { ...catalog, previewTemplates };
  },
  component: Shop,
  head: () =>
    pageMeta({
      path: "/shop",
      title: "Modele - Trei Linii",
      description:
        "O prezentare editorială a colecțiilor Trei Linii: tricouri cu fața curată și design pe spate.",
    }),
});

function Shop() {
  const { products, collections, previewTemplates } = Route.useLoaderData();
  const { colectie } = Route.useSearch();
  const navigate = Route.useNavigate();
  const collectionGroups = useMemo(
    () => buildCollectionGroups(products, collections, previewTemplates),
    [collections, previewTemplates, products],
  );
  const activeGroup =
    collectionGroups.find((group) => group.collection.handle === colectie) ?? collectionGroups[0];
  const chapters = activeGroup?.products ?? [];
  const [activeChapter, setActiveChapter] = useState(0);
  const chapterRefs = useRef<Array<HTMLElement | null>>([]);
  const collectionIntroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setActiveChapter(0);
    chapterRefs.current = [];
  }, [activeGroup?.collection.handle]);

  useEffect(() => {
    const nodes = chapterRefs.current.filter(Boolean) as HTMLElement[];
    if (!nodes.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting || entry.boundingClientRect.top < 0)
          .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));
        const target = visible[0]?.target as HTMLElement | undefined;
        const index = target ? Number(target.dataset.chapterIndex) : NaN;
        if (!Number.isNaN(index)) setActiveChapter(index);
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.2, 0.6] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [activeGroup?.collection.handle, chapters.length]);

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".shop-image-stage, .shop-image-pop, .shop-image-note, .shop-context-image, .shop-collage-item",
      ),
    );
    if (!nodes.length) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return undefined;
    }
    const stages = nodes.filter((node) =>
      node.matches(".shop-image-stage, .shop-context-image"),
    ) as HTMLElement[];

    document.documentElement.classList.add("motion-ready");
    const animatedNodes = new Set<Element>();

    const revealNode = (node: Element) => {
      if (animatedNodes.has(node)) return;
      animatedNodes.add(node);
      node.classList.add("is-visible");
    };

    const updateImageMotion = () => {
      stages.forEach((stage) => {
        const rect = stage.getBoundingClientRect();
        if (rect.bottom < -180 || rect.top > window.innerHeight + 180) return;

        const progress = clamp(
          (window.innerHeight * 0.96 - rect.top) / (window.innerHeight * 0.72),
        );
        const shift = Math.round((1 - progress) * 34);
        const scale = 1.12 - progress * 0.12;
        stage.style.setProperty("--shop-stage-shift", `${shift}px`);
        stage.style.setProperty("--shop-media-scale", scale.toFixed(3));
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight * 0.18) {
            revealNode(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: [0.01, 0.16] },
    );

    nodes.forEach((node) => observer.observe(node));
    const scheduler = createFrameScheduler(updateImageMotion);
    const scheduleUpdate = () => scheduler.schedule();

    scheduler.runNow();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      observer.disconnect();
      scheduler.cancel();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [activeGroup?.collection.handle, chapters.length]);

  if (!activeGroup || !chapters.length) {
    return (
      <EmptyState
        eyebrow={SITE_MODE === "pre-launch" ? "În pregătire" : "Catalog momentan indisponibil"}
        title={
          SITE_MODE === "pre-launch" ? "Colecțiile se pregătesc." : "Catalogul revine în curând."
        }
        message={
          SITE_MODE === "pre-launch"
            ? "Piesele vor apărea aici după publicarea colecției."
            : "Produsele nu pot fi încărcate acum. Încearcă din nou peste câteva momente."
        }
        actionLabel={SITE_MODE === "pre-launch" ? "Citește manifestul" : "Reîncarcă pagina"}
        actionTo={SITE_MODE === "pre-launch" ? "/manifest" : "/shop"}
      />
    );
  }

  const selectCollection = (handle: string) => {
    void navigate({ search: { colectie: handle }, replace: true });
    window.requestAnimationFrame(() => {
      collectionIntroRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div>
      <ChapterIndex products={chapters} activeChapter={activeChapter} />

      <section className="px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-[1600px] gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="font-mono-xs text-accent-text">Colecții / Trei Linii</p>
            <h1 className="mt-5 font-display text-5xl leading-[0.94] md:text-8xl">
              Colecții în capitole.
              <br />
              <span className="italic text-muted-foreground">Aceeași semnătură.</span>
            </h1>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              Fiecare colecție schimbă ritmul, nu regula: față curată, proporții relaxate și grafică
              așezată pe spate.
            </p>
            <Link
              to="/shop/lista"
              className="mt-6 inline-flex font-mono-xs text-accent-text underline underline-offset-4"
            >
              Vezi toate produsele
            </Link>
          </div>
        </div>
      </section>

      <nav className="border-y border-border bg-cream/35" aria-label="Alege colecția">
        <div className="mx-auto flex max-w-[1600px] snap-x snap-mandatory overflow-x-auto px-5 [scrollbar-width:none] md:px-10 [&::-webkit-scrollbar]:hidden">
          {collectionGroups.map((group, index) => {
            const selected = group.collection.handle === activeGroup.collection.handle;
            return (
              <button
                key={group.collection.handle}
                type="button"
                aria-pressed={selected}
                onClick={() => selectCollection(group.collection.handle)}
                className={`relative min-h-32 min-w-[76vw] snap-start border-r border-border px-5 py-7 text-left transition-colors sm:min-w-72 md:min-h-36 md:px-8 ${
                  selected ? "bg-charcoal text-cream" : "bg-transparent hover:bg-cream"
                }`}
              >
                <span className={`font-mono-xs ${selected ? "text-accent-text" : "opacity-45"}`}>
                  {String(index + 1).padStart(2, "0")} / {group.products.length} piese
                </span>
                <span className="mt-4 block font-display text-2xl leading-none md:text-3xl">
                  {group.collection.title}
                </span>
                <span
                  className={`absolute inset-x-0 bottom-0 h-0.5 origin-left bg-signature transition-transform duration-500 ${
                    selected ? "scale-x-100" : "scale-x-0"
                  }`}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>
      </nav>

      <section
        ref={collectionIntroRef}
        className="scroll-mt-20 border-b border-border bg-background px-5 py-14 md:px-10 md:py-20"
      >
        <div className="mx-auto grid max-w-[1600px] gap-10 md:grid-cols-12 md:items-center">
          <div className="md:col-span-7">
            <p className="font-mono-xs opacity-55">Colecția selectată</p>
            <h2 className="mt-4 font-display text-5xl leading-[0.95] md:text-7xl">
              {activeGroup.collection.title}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {activeGroup.collection.description}
            </p>
          </div>
          {activeGroup.collection.image && (
            <figure className="overflow-hidden bg-warm-grey md:col-span-4 md:col-start-9">
              <ResponsiveImage
                src={activeGroup.collection.image}
                alt={`Colecția ${activeGroup.collection.title}`}
                width={1600}
                height={1000}
                priority
                sizes="(min-width: 768px) 33vw, 100vw"
                className="aspect-[16/10] w-full object-cover transition-transform duration-[1200ms] hover:scale-[1.025]"
              />
            </figure>
          )}
        </div>
      </section>

      {chapters.map((product: (typeof chapters)[number], index: number) => (
        <Chapter
          key={`${activeGroup.collection.handle}-${product.id}`}
          product={product}
          index={index}
          refCallback={(node) => {
            chapterRefs.current[index] = node;
          }}
        />
      ))}

      <section className="px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[900px] border-t border-border pt-14 text-center">
          <p className="font-mono-xs opacity-60">Ai văzut întreaga colecție</p>
          <h2 className="mt-5 font-display text-5xl leading-[1.02] md:text-7xl">
            {activeGroup.collection.title}.
            <br />
            <span className="italic text-muted-foreground">Continuă cu toate piesele.</span>
          </h2>
          <Link
            to="/shop/lista"
            className="group mt-10 inline-flex items-center gap-4 bg-charcoal px-8 py-4 font-mono-xs text-cream"
          >
            Vezi toate produsele
            <span className="h-px w-12 origin-left scale-x-[0.58] bg-signature transition-transform group-hover:scale-x-100" />
          </Link>
        </div>
      </section>
    </div>
  );
}

type CollageSlot = {
  top: number;
  left: number;
  width: number;
  aspect: string;
  z: number;
};

const COLLAGE_PATTERNS: CollageSlot[][] = [
  // 1: big left tall + two staggered right (small overlap on inner edges)
  [
    { top: 0, left: 0, width: 60, aspect: "3/4", z: 1 },
    { top: 6, left: 54, width: 44, aspect: "1/1", z: 2 },
    { top: 60, left: 58, width: 40, aspect: "4/5", z: 2 },
  ],
  // 2: wide bottom + two small tops
  [
    { top: 0, left: 4, width: 42, aspect: "3/4", z: 2 },
    { top: 6, left: 52, width: 46, aspect: "1/1", z: 2 },
    { top: 52, left: 0, width: 82, aspect: "16/10", z: 1 },
  ],
  // 3: diagonal descending squares
  [
    { top: 0, left: 0, width: 46, aspect: "3/4", z: 1 },
    { top: 26, left: 40, width: 42, aspect: "1/1", z: 2 },
    { top: 56, left: 58, width: 42, aspect: "3/4", z: 3 },
  ],
  // 4: tall right + two stepped left
  [
    { top: 0, left: 54, width: 46, aspect: "3/5", z: 1 },
    { top: 4, left: 0, width: 48, aspect: "1/1", z: 2 },
    { top: 56, left: 8, width: 44, aspect: "3/4", z: 2 },
  ],
  // 5: centered square with two flanks
  [
    { top: 12, left: 22, width: 56, aspect: "1/1", z: 1 },
    { top: 0, left: 0, width: 36, aspect: "3/4", z: 2 },
    { top: 62, left: 62, width: 38, aspect: "3/4", z: 2 },
  ],
  // 6: wide top + wide bottom cascade
  [
    { top: 0, left: 0, width: 68, aspect: "16/10", z: 1 },
    { top: 30, left: 46, width: 54, aspect: "3/4", z: 2 },
    { top: 74, left: 4, width: 50, aspect: "16/10", z: 2 },
  ],
];

function Chapter({
  product,
  index,
  refCallback,
}: {
  product: Product;
  index: number;
  refCallback: (node: HTMLElement | null) => void;
}) {
  const isDark = index === 2;
  const reverse = index % 2 === 1;
  const number = String(index + 1).padStart(2, "0");
  // Collage = worn photography. Context slot = isolated design, matched to the background:
  // dark section gets the white-line vector, light sections the black-line vector.
  const photos = getPhotoImages(product);
  const contextImage =
    findVectorImage(product, isDark ? "textile inchise" : "textile deschise") ??
    findVectorImage(product, isDark ? "textile deschise" : "textile inchise") ??
    photos[2] ??
    photos[1] ??
    photos[0];

  const pattern = COLLAGE_PATTERNS[index % COLLAGE_PATTERNS.length];
  const slots = pattern
    .map((slot, i) => ({ slot, src: photos[i] ?? (i === 0 ? "" : undefined) }))
    .filter((entry): entry is { slot: CollageSlot; src: string } => entry.src !== undefined);


  const [overlay, setOverlay] = useState<null | {
    x: number;
    y: number;
    width: number;
    height: number;
  }>(null);
  const viewButtonRef = useRef<HTMLButtonElement>(null);

  const openQuickView = (e: MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.focus({ preventScroll: true });
    const rect = e.currentTarget.getBoundingClientRect();
    setOverlay({ x: rect.left, y: rect.top, width: rect.width, height: rect.height });
  };

  const closeQuickView = () => {
    setOverlay(null);
    window.requestAnimationFrame(() => viewButtonRef.current?.focus({ preventScroll: true }));
  };

  const badgeEl = (
    <span className="absolute left-3 top-3 z-10 bg-charcoal px-3 py-2 font-mono-xs text-cream md:left-4 md:top-4">
      capitol {number}
    </span>
  );

  const viewBtnEl = (
    <button
      ref={viewButtonRef}
      type="button"
      onClick={openQuickView}
      onPointerEnter={() => preloadQuickViewImages(product)}
      onPointerDown={() => preloadQuickViewImages(product)}
      onFocus={() => preloadQuickViewImages(product)}
      aria-label={`Vezi produs ${product.title}`}
      className="pc-view-btn absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover/collage:opacity-100"
      style={{
        padding: "13px 28px",
        background: "rgba(232,229,221,0.94)",
        boxShadow: "0 8px 24px rgba(20,18,14,0.12)",
        border: "none",
        borderRadius: 4,
        fontFamily: "var(--font-display)",
        fontSize: 16,
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color: "#1a1a18",
        cursor: "pointer",
        whiteSpace: "nowrap",
        visibility: overlay ? "hidden" : undefined,
      }}
    >
      Vezi produs
    </button>
  );

  return (
    <>
      <section
        id={`capitol-${number}`}
        ref={refCallback}
        data-chapter-index={index}
        className={`shop-reveal relative overflow-hidden px-5 py-16 md:px-10 md:py-28 ${
          isDark ? "bg-charcoal text-cream" : "bg-background text-charcoal"
        }`}
      >
        <span
          className={`shop-ghost-number pointer-events-none absolute top-8 font-display text-[11rem] italic leading-none md:text-[19rem] ${
            isDark ? "shop-ghost-number-dark" : ""
          } ${reverse ? "right-4 md:right-20" : "left-4 md:left-20"}`}
          aria-hidden="true"
        >
          {number}
        </span>

        <div
          className={`relative mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-12 lg:items-center ${
            reverse ? "lg:[&_.chapter-media]:col-start-7 lg:[&_.chapter-copy]:col-start-2" : ""
          }`}
        >
          <div className="chapter-media lg:col-span-6">
            {/* Absolute-positioned collage — same layout for mobile and desktop */}
            <div className="group/collage relative w-full" style={{ aspectRatio: "4 / 5" }}>
              {slots.map(({ slot, src }, i) => (
                <div
                  key={i}
                  className="shop-collage-item absolute bg-warm-grey"
                  style={{
                    top: `${slot.top}%`,
                    left: `${slot.left}%`,
                    width: `${slot.width}%`,
                    aspectRatio: slot.aspect.replace("/", " / "),
                    zIndex: slot.z,
                    transitionDelay: `${i * 110}ms`,
                  }}
                >
                  <ResponsiveImage
                    src={src}
                    alt={`${product.title} - imagine ${i + 1}`}
                    width={1200}
                    height={1600}
                    priority={index === 0 && i === 0}
                    sizes="(min-width: 1024px) 35vw, 70vw"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  {i === 0 && badgeEl}
                  {i === 1 && viewBtnEl}
                </div>
              ))}
            </div>
          </div>

          <div
            className={`chapter-copy lg:col-span-4 ${reverse ? "lg:row-start-1" : "lg:col-start-9"}`}
          >
            <p className={isDark ? "font-mono-xs text-cream/60" : "font-mono-xs opacity-60"}>
              Nr. {number} -{" "}
              <span className="text-accent-text">
                {product.isPreview ? "piesă în pregătire" : (product.badge ?? "piesă disponibilă")}
              </span>
            </p>
            <h2 className="mt-4 font-display text-4xl leading-[1.02] md:text-6xl">
              {product.title}
            </h2>
            {product.isPreview && (
              <blockquote className="mt-7 border-l border-signature pl-5 font-display text-2xl italic leading-snug">
                {product.vibe}
              </blockquote>
            )}
            <p
              className={`mt-6 leading-relaxed ${isDark ? "text-cream/70" : "text-muted-foreground"}`}
            >
              {conciseDescription(product.description)}
            </p>
            <p className="mt-7 font-display text-4xl">
              {product.isPreview ? "În pregătire" : formatRON(product.price)}
            </p>

            <ChapterQuickAdd product={product} isDark={isDark} />

            <div className="mt-12 hidden md:block">
              <div className="shop-context-image overflow-hidden">
                <ResponsiveImage
                  src={contextImage}
                  alt=""
                  width={1600}
                  height={1000}
                  sizes="33vw"
                  className="aspect-[16/10] w-full object-cover"
                />
              </div>
              <p className={`mt-3 font-mono-xs ${isDark ? "text-cream/70" : "opacity-45"}`}>
                {contextCaptions[index % contextCaptions.length]}
              </p>
            </div>
          </div>
        </div>
      </section>
      {overlay && <QuickViewOverlay product={product} origin={overlay} onClose={closeQuickView} />}
    </>
  );
}

function ChapterQuickAdd({ product, isDark }: { product: Product; isDark: boolean }) {
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.colors.length === 1 ? (product.colors[0]?.name ?? null) : null,
  );
  const stock = useMemo(
    () => getStockForColor(product, selectedColor ?? ""),
    [product, selectedColor],
  );
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"error" | "success">("error");
  const selectedStock = selectedSize ? (stock[selectedSize] ?? 0) : 0;

  if (!canPurchaseProduct(product)) {
    return (
      <div className="mt-8 max-w-md border border-current/20 px-5 py-5">
        <p className="font-mono-xs text-accent-text">
          {product.isPreview ? "Colecție în pregătire" : "Comandă indisponibilă momentan"}
        </p>
        <p
          className={`mt-3 text-sm leading-relaxed ${isDark ? "text-cream/65" : "text-muted-foreground"}`}
        >
          {product.isPreview
            ? "Direcție de colecție în pregătire. Detaliile finale vor apărea odată cu publicarea piesei."
            : "Poți vedea toate detaliile piesei. Comenzile vor fi deschise la lansare."}
        </p>
      </div>
    );
  }

  const addToCart = () => {
    if (!selectedColor) {
      setMessage("Alege o culoare pentru a continua.");
      setMessageTone("error");
      return;
    }
    if (!selectedSize) {
      setMessage("Alege o mărime pentru a continua.");
      setMessageTone("error");
      return;
    }
    const result = addItem(product, selectedSize, selectedColor);
    setMessage(result.ok ? "Produsul a fost adăugat în coș." : result.message);
    setMessageTone(result.ok ? "success" : "error");
  };

  return (
    <div className="mt-8">
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono-xs">Culoare</p>
          {selectedColor && <p className="text-sm opacity-65">{selectedColor}</p>}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.colors.map((color) => {
            const active = selectedColor === color.name;
            return (
              <button
                key={color.name}
                type="button"
                aria-label={`Alege culoarea ${color.name}`}
                aria-pressed={active}
                onClick={() => {
                  setSelectedColor(color.name);
                  setSelectedSize(null);
                  setMessage("");
                }}
                className={`h-11 w-11 border p-1 transition-colors ${
                  active ? "border-current" : "border-current/25 hover:border-current/60"
                }`}
              >
                <span className="block h-full w-full" style={{ backgroundColor: color.hex }} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid max-w-sm grid-cols-4 border border-current/25">
        {product.sizes.map((size) => {
          const disabled = (stock[size] ?? 0) <= 0;
          const active = selectedSize === size;
          return (
            <button
              key={size}
              type="button"
              disabled={!selectedColor || disabled}
              aria-pressed={active}
              aria-label={`Mărimea ${size}${!selectedColor || disabled ? ", indisponibilă" : ""}`}
              onClick={() => {
                setSelectedSize(size);
                setMessage("");
              }}
              className={`h-12 border-r border-current/25 font-mono-xs last:border-r-0 transition-colors ${
                active
                  ? isDark
                    ? "bg-cream text-charcoal"
                    : "bg-charcoal text-cream"
                  : "hover:bg-current/5"
              } disabled:cursor-not-allowed disabled:opacity-35 disabled:line-through`}
            >
              {size}
            </button>
          );
        })}
      </div>

      {selectedSize && selectedStock > 0 && selectedStock <= 4 && (
        <p className="mt-3 font-mono-xs text-accent-text">
          Ultimele {selectedStock} piese pe mărimea {selectedSize}
        </p>
      )}
      <FeedbackRegion message={message} tone={messageTone} className="mt-3" />

      <div className="mt-6 flex flex-wrap items-center gap-5">
        <button
          type="button"
          onClick={addToCart}
          className={`group inline-flex items-center gap-4 px-6 py-3 font-mono-xs ${
            isDark ? "bg-cream text-charcoal" : "bg-charcoal text-cream"
          }`}
        >
          Adaugă în coș
          <span className="h-px w-10 origin-left scale-x-[0.6] bg-signature transition-transform group-hover:scale-x-100" />
        </button>
        <Link
          to="/product/$handle"
          params={{ handle: product.handle }}
          className="font-mono-xs underline underline-offset-4 hover:opacity-70"
        >
          Vezi produsul
        </Link>
      </div>
    </div>
  );
}

function ChapterIndex({ products, activeChapter }: { products: Product[]; activeChapter: number }) {
  if (!products.length) return null;

  return (
    <aside className="fixed left-5 top-1/2 z-30 hidden -translate-y-1/2 xl:block">
      <nav className="flex flex-col items-center gap-4" aria-label="Index capitole shop">
        {products.map((product, index) => {
          const number = String(index + 1).padStart(2, "0");
          return (
            <a
              key={product.id}
              href={`#capitol-${number}`}
              className={`font-display text-lg italic transition-[color,transform] ${
                activeChapter === index ? "scale-125 text-accent-text" : "text-muted-foreground"
              }`}
            >
              {number}
            </a>
          );
        })}
        <span className="my-2 h-16 w-px bg-border" aria-hidden="true" />
        <Link
          to="/shop/lista"
          className="font-mono-xs text-charcoal/50 [writing-mode:vertical-rl] hover:text-accent-text"
        >
          Lista completă
        </Link>
      </nav>
    </aside>
  );
}
