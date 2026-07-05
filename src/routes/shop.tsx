import { createFileRoute, Link } from "@tanstack/react-router";
import { type MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { QuickViewOverlay } from "@/components/ProductCard";
import { formatRON } from "@/lib/format";
import type { Product, Size } from "@/lib/mock-data";
import { fetchProducts, getStockForColor } from "@/lib/shopify";
import { useCart } from "@/lib/cart-context";
import { clamp, createFrameScheduler } from "@/lib/motion";
import { pageMeta } from "@/lib/seo";

const chapterQuotes = [
  "O piesa care nu cere atentie. O pastreaza.",
  "Spatele devine locul unde tricoul incepe sa vorbeasca.",
  "Material dens, ritm grafic, liniste in fata.",
  "Culoare purtata jos, semnatura pastrata sus.",
] as const;

const contextCaptions = [
  "Proba de material, in lumina atelierului",
  "Cadru de spate, linie si distanta",
  "Nota de fit, purtare zilnica",
  "Detaliu cromatic, editie limitata",
] as const;

export const Route = createFileRoute("/shop")({
  loader: async () => {
    const products = await fetchProducts();
    return { products };
  },
  component: Shop,
  head: () =>
    pageMeta({
      path: "/shop",
      title: "Modele - Trei Linii",
      description:
        "O prezentare editoriala a primei editii Trei Linii: tricouri oversized cu fata curata si design pe spate.",
    }),
});

function Shop() {
  const { products } = Route.useLoaderData();
  const chapters = products.slice(0, 4);
  const [activeChapter, setActiveChapter] = useState(0);
  const chapterRefs = useRef<Array<HTMLElement | null>>([]);

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
  }, [chapters.length]);

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".shop-image-stage, .shop-image-pop, .shop-image-note, .shop-context-image, .shop-collage-item",
      ),
    );
    if (!nodes.length) return undefined;
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
    window.addEventListener("touchmove", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      observer.disconnect();
      scheduler.cancel();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("touchmove", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [chapters.length]);

  return (
    <div>
      <ChapterIndex products={chapters} activeChapter={activeChapter} />

      <section className="px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-[1600px] gap-10 border-b border-border pb-14 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="font-mono-xs opacity-60">Editia I - patru capitole</p>
            <h1 className="mt-4 font-display text-5xl leading-[0.98] md:text-8xl">
              Fiecare piesa,
              <br />
              <span className="italic text-muted-foreground">o pagina.</span>
            </h1>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              Patru modele din prima editie, privite ca pagini de atelier: material, cadere, spate,
              semnatura.
            </p>
            <Link
              to="/shop/lista"
              className="mt-6 inline-flex font-mono-xs text-[#ff006f] underline underline-offset-4"
            >
              Vezi lista completa
            </Link>
          </div>
        </div>
      </section>

      {chapters.map((product: (typeof chapters)[number], index: number) => (
        <Chapter
          key={product.id}
          product={product}
          index={index}
          refCallback={(node) => {
            chapterRefs.current[index] = node;
          }}
        />
      ))}

      <section className="px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[900px] border-t border-border pt-14 text-center">
          <p className="font-mono-xs opacity-60">Restul editiei</p>
          <h2 className="mt-5 font-display text-5xl leading-[1.02] md:text-7xl">
            Opt piese numerotate.
            <br />
            <span className="italic text-muted-foreground">Le-ai vazut patru.</span>
          </h2>
          <Link
            to="/shop/lista"
            className="group mt-10 inline-flex items-center gap-4 bg-charcoal px-8 py-4 font-mono-xs text-cream"
          >
            Vezi lista completa
            <span className="h-px w-12 origin-left scale-x-[0.58] bg-[#ff006f] transition-transform group-hover:scale-x-100" />
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
  const contextImage = product.images[2] ?? product.images[1] ?? product.images[0];

  const pattern = COLLAGE_PATTERNS[index % COLLAGE_PATTERNS.length];
  const slots = pattern
    .map((slot, i) => ({ slot, src: product.images[i] }))
    .filter((entry): entry is { slot: CollageSlot; src: string } => Boolean(entry.src));

  const [overlay, setOverlay] = useState<null | {
    x: number;
    y: number;
    width: number;
    height: number;
  }>(null);

  const openQuickView = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setOverlay({ x: rect.left, y: rect.top, width: rect.width, height: rect.height });
  };

  const badgeEl = (
    <span className="absolute left-3 top-3 z-10 bg-charcoal px-3 py-2 font-mono-xs text-cream md:left-4 md:top-4">
      capitol {number}
    </span>
  );

  const viewBtnEl = (
    <button
      type="button"
      onClick={openQuickView}
      aria-label={`Vezi produs ${product.title}`}
      className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover/collage:opacity-100"
      style={{
        padding: "13px 28px",
        background: "rgba(232,229,221,0.62)",
        backdropFilter: "blur(10px)",
        border: "none",
        borderRadius: 14,
        fontFamily: "var(--font-display)",
        fontSize: 16,
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color: "#1a1a18",
        cursor: "pointer",
        whiteSpace: "nowrap",
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
          className={`pointer-events-none absolute top-8 font-display text-[11rem] italic leading-none opacity-[0.05] md:text-[19rem] ${
            reverse ? "right-4 md:right-20" : "left-4 md:left-20"
          }`}
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
            <div
              className="group/collage relative w-full"
              style={{ aspectRatio: "4 / 5" }}
            >
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
                  <img
                    src={src}
                    alt={`${product.title} - imagine ${i + 1}`}
                    className="absolute inset-0 h-full w-full object-cover"
                    decoding="async"
                    loading={index === 0 && i === 0 ? "eager" : "lazy"}
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
              Nr. {number} - <span className="text-[#ff006f]">editie limitata</span>
            </p>
            <h2 className="mt-4 font-display text-4xl leading-[1.02] md:text-6xl">{product.title}</h2>
            <blockquote className="mt-7 border-l border-[#ff006f] pl-5 font-display text-2xl italic leading-snug">
              {chapterQuotes[index] ?? product.vibe}
            </blockquote>
            <p
              className={`mt-6 leading-relaxed ${isDark ? "text-cream/70" : "text-muted-foreground"}`}
            >
              {product.description}
            </p>
            <p className="mt-7 font-display text-4xl">{formatRON(product.price)}</p>

            <ChapterQuickAdd product={product} isDark={isDark} />

            <div className="mt-12 hidden md:block">
              <div className="shop-context-image overflow-hidden">
                <img
                  src={contextImage}
                  alt=""
                  className="aspect-[16/10] w-full object-cover"
                  decoding="async"
                  loading="lazy"
                />
              </div>
              <p className={`mt-3 font-mono-xs ${isDark ? "text-cream/45" : "opacity-45"}`}>
                {contextCaptions[index]}
              </p>
            </div>
          </div>
        </div>
      </section>
      {overlay && (
        <QuickViewOverlay
          product={product}
          origin={overlay}
          onClose={() => setOverlay(null)}
        />
      )}
    </>
  );
}

function ChapterQuickAdd({ product, isDark }: { product: Product; isDark: boolean }) {
  const { addItem } = useCart();
  const color = product.colors[0]?.name ?? "";
  const stock = useMemo(() => getStockForColor(product, color), [product, color]);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [message, setMessage] = useState("");
  const selectedStock = selectedSize ? (stock[selectedSize] ?? 0) : 0;

  const addToCart = () => {
    if (!selectedSize) {
      setMessage("Alege o marime pentru a continua.");
      return;
    }
    addItem(product, selectedSize, color);
    setMessage("");
  };

  return (
    <div className="mt-8">
      <div className="grid max-w-sm grid-cols-4 border border-current/25">
        {product.sizes.map((size) => {
          const disabled = (stock[size] ?? 0) <= 0;
          const active = selectedSize === size;
          return (
            <button
              key={size}
              type="button"
              disabled={disabled}
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
        <p className="mt-3 font-mono-xs text-[#ff006f]">
          Ultimele {selectedStock} piese pe marimea {selectedSize}
        </p>
      )}
      {message && <p className="mt-3 font-mono-xs text-[#ff006f]">{message}</p>}

      <div className="mt-6 flex flex-wrap items-center gap-5">
        <button
          type="button"
          onClick={addToCart}
          className={`group inline-flex items-center gap-4 px-6 py-3 font-mono-xs ${
            isDark ? "bg-cream text-charcoal" : "bg-charcoal text-cream"
          }`}
        >
          Adauga in cos
          <span className="h-px w-10 origin-left scale-x-[0.6] bg-[#ff006f] transition-transform group-hover:scale-x-100" />
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
                activeChapter === index ? "scale-125 text-[#ff006f]" : "text-charcoal/35"
              }`}
            >
              {number}
            </a>
          );
        })}
        <span className="my-2 h-16 w-px bg-border" aria-hidden="true" />
        <Link
          to="/shop/lista"
          className="font-mono-xs text-charcoal/50 [writing-mode:vertical-rl] hover:text-[#ff006f]"
        >
          Lista completa
        </Link>
      </nav>
    </aside>
  );
}
