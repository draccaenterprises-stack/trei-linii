import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatRON } from "@/lib/format";
import type { Product, Size } from "@/lib/mock-data";
import { fetchProducts, getStockForColor } from "@/lib/shopify";
import { useCart } from "@/lib/cart-context";
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
        ".shop-image-stage, .shop-image-pop, .shop-image-note, .shop-context-image",
      ),
    );
    if (!nodes.length) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return undefined;
    }

    document.documentElement.classList.add("motion-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight * 0.18) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: [0.05, 0.25] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
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

      {chapters.map((product, index) => (
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
            <span className="h-px w-7 bg-[#ff006f] transition-all group-hover:w-12" />
          </Link>
        </div>
      </section>
    </div>
  );
}

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
  const mainImage = product.images[0];
  const secondaryImage = product.images[1] ?? product.images[0];
  const contextImage = product.images[2] ?? product.images[1] ?? product.images[0];

  return (
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
          <div className="shop-image-stage img-zoom relative bg-warm-grey">
            <img
              src={mainImage}
              alt={`${product.title} - imagine principala`}
              className="shop-image-main aspect-[5/6] w-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
            />
            <span className="shop-image-note absolute left-4 top-4 bg-charcoal px-3 py-2 font-mono-xs text-cream md:left-6 md:top-6">
              capitol {number}
            </span>
          </div>
          <div
            className={`shop-image-pop mt-4 w-[72%] bg-background shadow-2xl md:-mt-[18%] md:w-[46%] ${
              reverse ? "md:ml-0" : "md:ml-[54%]"
            }`}
          >
            <img
              src={secondaryImage}
              alt={`${product.title} - detaliu secundar`}
              className="aspect-[3/4] w-full object-cover"
              loading="lazy"
            />
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
          <span className="h-px w-6 bg-[#ff006f] transition-all group-hover:w-10" />
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
              className={`font-display text-lg italic transition-all ${
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
