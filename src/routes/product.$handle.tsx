import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { RotateCcw, Shield, Truck } from "lucide-react";
import { SizeSelector, VariantSelector } from "@/components/VariantSelectors";
import { useCart } from "@/lib/cart-context";
import { formatRON } from "@/lib/format";
import { fetchProductByHandle, fetchProducts } from "@/lib/shopify";
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
  const { siteMode, reviewsEnabled } = useSite();
  const { addItem } = useCart();
  const [size, setSize] = useState<(typeof product.sizes)[number] | null>(null);
  const [color, setColor] = useState<string>(product.colors[0].name);

  const handleAdd = () => {
    if (siteMode === "pre-launch") return;
    if (!size) {
      alert("Alege o marime inainte de a adauga produsul in cos.");
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
            {siteMode === "live-shop" && (
              <div className="mt-3 text-xl tabular-nums">{formatRON(product.price)}</div>
            )}

            <p className="mt-8 text-muted-foreground leading-relaxed">{product.description}</p>

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
                  <Link
                    to="/size-guide"
                    className="font-mono-xs underline underline-offset-4 opacity-60"
                  >
                    Ghid marimi
                  </Link>
                </div>
                <SizeSelector
                  sizes={product.sizes}
                  stock={product.stock}
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
                  className="block text-center w-full bg-charcoal text-cream py-4 font-mono-xs hover:bg-charcoal/90 transition-colors"
                >
                  Anunta-ma la lansare
                </a>
              )}

              <p className="font-mono-xs opacity-60">Croiala: {product.fitNote}</p>
            </div>

            <ul className="mt-10 grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <li className="flex flex-col items-start gap-2">
                <Truck className="h-4 w-4" strokeWidth={1.25} />
                <span className="font-mono-xs">Livrare</span>
              </li>
              <li className="flex flex-col items-start gap-2">
                <RotateCcw className="h-4 w-4" strokeWidth={1.25} />
                <span className="font-mono-xs">Retur 14 zile</span>
              </li>
              <li className="flex flex-col items-start gap-2">
                <Shield className="h-4 w-4" strokeWidth={1.25} />
                <span className="font-mono-xs">Plata securizata</span>
              </li>
            </ul>

            <div className="mt-10 space-y-8 border-t border-border pt-8">
              <InfoBlock title="Ce il diferentiaza">
                <ul className="space-y-2">
                  <li>Fata ramane curata, fara logo mare pe piept.</li>
                  <li>Designul principal este plasat pe spate.</li>
                  <li>Croiala oversized este gandita pentru o cadere relaxata.</li>
                </ul>
              </InfoBlock>

              <InfoBlock title="Tabel marimi">
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono-xs border border-border">
                    <thead className="bg-cream">
                      <tr>
                        <th className="p-3 border-r border-border">Marime</th>
                        <th className="p-3 border-r border-border">Piept</th>
                        <th className="p-3 border-r border-border">Lungime</th>
                        <th className="p-3">Umar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["S", "56 cm", "70 cm", "53 cm"],
                        ["M", "59 cm", "72 cm", "55 cm"],
                        ["L", "62 cm", "74 cm", "57 cm"],
                        ["XL", "65 cm", "76 cm", "59 cm"],
                      ].map((row) => (
                        <tr key={row[0]} className="border-t border-border">
                          {row.map((cell) => (
                            <td key={cell} className="p-3 border-r border-border last:border-r-0">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-muted-foreground">
                  Daca esti intre doua marimi, alege marimea mai mare pentru un fit oversized mai
                  vizibil.
                </p>
              </InfoBlock>

              <InfoBlock title="Ingrijire">
                Spala pe dos la 30 grade C, nu folosi inalbitor si evita uscarea automata. Calca pe
                dos, fara contact direct cu printul.
              </InfoBlock>
            </div>
          </aside>
        </div>

        {reviewsEnabled && (
          <section className="mt-20 md:mt-32 border-t border-border pt-12">
            <h2 className="font-display text-4xl md:text-6xl">Feedback clienti.</h2>
          </section>
        )}

        <section className="mt-20 md:mt-32 border-t border-border pt-12">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <p className="font-mono-xs opacity-60">
                {siteMode === "pre-launch" ? "Alte previzualizari" : "Completeaza cosul"}
              </p>
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
