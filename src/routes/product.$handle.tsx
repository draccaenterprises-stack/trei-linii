import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Bell, RotateCcw, ShieldCheck, Truck, X } from "lucide-react";
import { SizeGuideTable } from "@/components/SizeGuideTable";
import { SizeSelector, VariantSelector } from "@/components/VariantSelectors";
import { useCart } from "@/lib/cart-context";
import { formatRON } from "@/lib/format";
import { fetchProductByHandle, fetchProducts, getStockForColor } from "@/lib/shopify";
import { useSite } from "@/lib/site-context";

export const Route = createFileRoute("/product/$handle")({
  loader: async ({ params }) => {
    const [product, products] = await Promise.all([
      fetchProductByHandle(params.handle),
      fetchProducts(),
    ]);
    if (!product) throw notFound();
    const related = products.filter((p) => p.id !== product.id).slice(0, 3);
    return { product, related };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.title} - Trei Linii` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: loaderData.product.title },
          { property: "og:description", content: loaderData.product.description },
          { property: "og:image", content: loaderData.product.images[0] },
        ]
      : [],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <div className="px-5 py-32 text-center">
      <h1 className="font-display text-5xl">Produsul nu a fost gasit</h1>
      <Link to="/shop" className="font-mono-xs underline mt-6 inline-block">
        Inapoi la modele
      </Link>
    </div>
  ),
});

function ProductPage() {
  const { product, related } = Route.useLoaderData();
  const { accentColor, siteMode, reviewsEnabled } = useSite();
  const { addItem } = useCart();
  const [size, setSize] = useState<(typeof product.sizes)[number] | null>(null);
  const [color, setColor] = useState<string>(product.colors[0].name);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const selectedColorStock = useMemo(() => getStockForColor(product, color), [product, color]);

  useEffect(() => {
    if (size && selectedColorStock[size] === 0) setSize(null);
  }, [selectedColorStock, size]);

  const handleAdd = () => {
    if (siteMode === "pre-launch") return;
    if (!size) {
      alert("Alege o marime inainte de a adauga produsul in cos.");
      return;
    }
    if (selectedColorStock[size] === 0) {
      alert("Varianta aleasa nu este momentan in stoc.");
      return;
    }
    addItem(product, size, color);
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
            {product.images.map((img: string, i: number) => (
              <div key={i} className="aspect-[3/4] bg-warm-grey img-zoom">
                <img
                  src={img}
                  alt={`${product.title} ${i === 0 ? "spate" : "detaliu"}`}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          <aside className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono-xs bg-charcoal text-cream px-2 py-1">
                {siteMode === "pre-launch" ? "previzualizare" : (product.badge ?? "disponibil")}
              </span>
              <span className="font-mono-xs opacity-60">design pe spate</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl leading-tight">{product.title}</h1>
            <p className="mt-3 font-mono-xs" style={{ color: accentColor }}>
              🔥 47 de persoane au vazut produsul azi
            </p>
            <p className="mt-2 font-mono-xs text-muted-foreground">
              9 persoane au produsul in cos acum
            </p>
            <div className="mt-4">
              <div
                className="font-display text-3xl md:text-4xl tabular-nums"
                style={{ color: accentColor }}
              >
                {siteMode === "live-shop" ? formatRON(product.price) : "~149 RON"}
              </div>
              <p className="mt-1 font-mono-xs text-muted-foreground">
                {siteMode === "live-shop"
                  ? "Pret final afisat inainte de plata securizata"
                  : "Pretul final va fi confirmat la lansare"}
              </p>
            </div>

            <p className="mt-8 text-muted-foreground leading-relaxed">{product.description}</p>
            <p className="mt-3 text-sm italic text-muted-foreground/80">{product.vibe}</p>

            <div className="mt-6 grid grid-cols-2 gap-3 font-mono-xs">
              <div className="border border-border p-3">
                <span className="opacity-50 block mb-1">Material</span>
                Bumbac dens
              </div>
              <div className="border border-border p-3">
                <span className="opacity-50 block mb-1">Fit</span>
                Oversized relaxat
              </div>
            </div>

            <div className="mt-10 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono-xs">Culoare - {color}</span>
                </div>
                <VariantSelector colors={product.colors} value={color} onChange={setColor} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono-xs">Marime</span>
                  <button
                    type="button"
                    onClick={() => setSizeGuideOpen(true)}
                    className="group relative font-mono-xs underline underline-offset-4 opacity-60 hover:opacity-100"
                  >
                    Ghid marimi
                    <span className="pointer-events-none absolute bottom-full right-0 mb-3 hidden w-44 rotate-[-2deg] border-2 border-charcoal bg-cream px-3 py-2 text-left text-[10px] leading-snug text-charcoal opacity-0 shadow-sm transition-opacity group-hover:block group-hover:opacity-100">
                      Apasa pentru a vedea ghidul
                      <span className="absolute -bottom-2 right-5 h-3 w-3 rotate-45 border-b-2 border-r-2 border-charcoal bg-cream" />
                    </span>
                  </button>
                </div>
                <SizeSelector
                  sizes={product.sizes}
                  stock={selectedColorStock}
                  value={size}
                  onChange={setSize}
                />
              </div>

              {siteMode === "live-shop" ? (
                <button
                  onClick={handleAdd}
                  className="w-full bg-charcoal text-cream py-4 font-mono-xs hover:bg-charcoal/90 transition-colors"
                >
                  Adauga in cos - {formatRON(product.price)}
                </button>
              ) : (
                <a
                  href="/#newsletter"
                  className="flex w-full items-center justify-center gap-2 border bg-transparent py-4 font-mono-xs transition-colors hover:bg-charcoal hover:text-cream"
                  style={{ borderColor: accentColor, color: accentColor }}
                >
                  <Bell className="h-4 w-4" strokeWidth={1.5} />
                  Primeste update produs
                </a>
              )}

              <ul className="flex flex-wrap items-center gap-3 text-muted-foreground">
                <li className="flex items-center gap-1.5">
                  <Truck className="h-4 w-4" strokeWidth={1.25} />
                  <span className="font-mono-xs">Livrare</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <RotateCcw className="h-4 w-4" strokeWidth={1.25} />
                  <span className="font-mono-xs">Retur 14 zile</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" strokeWidth={1.25} />
                  <span className="font-mono-xs">Plata securizata</span>
                </li>
              </ul>

              <p className="font-mono-xs opacity-60">Croiala: {product.fitNote}</p>
            </div>

            <div className="mt-10 space-y-8 border-t border-border pt-8">
              <InfoBlock title="Ce il diferentiaza">
                <ul className="space-y-2">
                  <li>Fata ramane curata, fara logo mare pe piept.</li>
                  <li>Designul principal este plasat pe spate.</li>
                  <li>Croiala oversized este gandita pentru o cadere relaxata.</li>
                </ul>
              </InfoBlock>

              <InfoBlock title="Ingrijire">
                Spala pe dos la 30 grade C, nu folosi inalbitor si evita uscarea automata. Calca pe
                dos, fara contact direct cu printul.
              </InfoBlock>
            </div>
          </aside>
        </div>

        {reviewsEnabled && (
          <ProductReviews productTitle={product.title} accentColor={accentColor} />
        )}

        <section className="mt-20 md:mt-32 border-t border-border pt-12">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <p className="font-mono-xs opacity-60">S-ar putea sa-ti placa si</p>
              <h2 className="font-display text-4xl md:text-6xl mt-3">Mai multe modele.</h2>
            </div>
            <Link to="/shop" className="font-mono-xs underline underline-offset-4">
              Vezi tot
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {related.map((item) => (
              <Link key={item.id} to="/product/$handle" params={{ handle: item.handle }}>
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="aspect-[3/4] w-full object-cover bg-warm-grey"
                  loading="lazy"
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

      {siteMode === "live-shop" && (
        <div className="fixed md:hidden left-0 right-0 bottom-0 z-40 bg-background border-t border-border p-4">
          <button onClick={handleAdd} className="w-full bg-charcoal text-cream py-4 font-mono-xs">
            Adauga in cos - {formatRON(product.price)}
          </button>
        </div>
      )}

      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-charcoal/45 px-5">
          <div className="w-full max-w-2xl border border-border bg-background p-5 md:p-8 shadow-xl">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="font-mono-xs opacity-60">Fit oversized</p>
                <h2 className="font-display text-4xl mt-2">Ghid marimi</h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  Masuratori in cm, pe produs intins. Daca esti intre doua marimi, alege marimea mai
                  mare pentru o cadere oversized mai vizibila.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(false)}
                aria-label="Inchide ghidul de marimi"
                className="grid h-9 w-9 shrink-0 place-items-center border border-border hover:bg-charcoal hover:text-cream"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
            <div className="mt-6">
              <SizeGuideTable />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductReviews({
  productTitle,
  accentColor,
}: {
  productTitle: string;
  accentColor: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [customReviews, setCustomReviews] = useState<Array<{ name: string; text: string }>>([]);
  const visibleReviews = [
    ["Alex", "Bucuresti", "Material dens, sta foarte bine pe umeri."],
    ["Mara", "Cluj", "Minimal in fata, dar printul de pe spate face tot tricoul."],
    ...customReviews.map((review) => [review.name, "Review nou", review.text]),
  ];

  return (
    <section className="mt-20 md:mt-32 border-t border-border pt-12">
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <p className="font-mono-xs opacity-60">Review-uri</p>
          <h2 className="font-display text-4xl md:text-6xl mt-3">Feedback clienti.</h2>
          <div className="mt-8 space-y-6">
            {visibleReviews.map(([name, city, text], index) => (
              <figure key={`${name}-${index}`} className="border-t border-border pt-5">
                <div className="font-mono-xs" style={{ color: accentColor }}>
                  *****
                </div>
                <blockquote className="mt-3 text-muted-foreground">"{text}"</blockquote>
                <figcaption className="mt-3 font-mono-xs opacity-60">
                  {name} - {city}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
        <form
          className="lg:col-span-6 lg:col-start-7 border border-border p-5 md:p-6 space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const data = new FormData(form);
            const email = String(data.get("email") ?? "");
            const name = String(data.get("name") ?? "Client Trei Linii");
            const review = String(data.get("review") ?? "");
            try {
              const { subscribeToKlaviyo, isKlaviyoConfigured } = await import("@/lib/klaviyo");
              if (isKlaviyoConfigured()) await subscribeToKlaviyo(email);
            } catch {
              /* Review still works locally even if newsletter is unavailable. */
            }
            setCustomReviews((items) => [{ name, text: review }, ...items]);
            try {
              const stored = JSON.parse(
                localStorage.getItem("trei-linii-product-reviews") ?? "[]",
              ) as Array<{ productTitle: string; name: string; email: string; review: string }>;
              localStorage.setItem(
                "trei-linii-product-reviews",
                JSON.stringify([{ productTitle, name, email, review }, ...stored].slice(0, 50)),
              );
            } catch {
              /* best effort */
            }
            setSubmitted(true);
            form.reset();
          }}
        >
          <div>
            <p className="font-mono-xs opacity-60">Lasa un review</p>
            <h3 className="font-display text-2xl mt-2">{productTitle}</h3>
          </div>
          <input
            name="name"
            required
            placeholder="Nume"
            className="w-full border-b border-border bg-transparent py-3 outline-none"
          />
          <input
            name="email"
            type="email"
            required
            placeholder="Email pentru confirmare si noutati"
            className="w-full border-b border-border bg-transparent py-3 outline-none"
          />
          <textarea
            name="review"
            required
            rows={4}
            placeholder="Cum ti se pare produsul?"
            className="w-full resize-none border-b border-border bg-transparent py-3 outline-none"
          />
          <button className="bg-charcoal text-cream px-5 py-3 font-mono-xs hover:bg-charcoal/90">
            Trimite review
          </button>
          {submitted && (
            <p className="font-mono-xs text-olive">
              Multumim. Review-ul a fost primit si emailul poate fi folosit pentru update-uri.
            </p>
          )}
        </form>
      </div>
    </section>
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
