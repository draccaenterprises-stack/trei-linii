import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { products, reviews } from "@/lib/mock-data";
import { SizeSelector, VariantSelector } from "@/components/VariantSelectors";
import { useCart } from "@/lib/cart-context";
import { formatRON } from "@/lib/format";
import { RotateCcw, Shield, Truck } from "lucide-react";

export const Route = createFileRoute("/product/$handle")({
  loader: ({ params }) => {
    const product = products.find((p) => p.handle === params.handle);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.title} — Trei Linii` },
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
      <h1 className="font-display text-5xl">Produsul nu a fost găsit</h1>
      <Link to="/shop" className="font-mono-xs underline mt-6 inline-block">
        Înapoi la magazin
      </Link>
    </div>
  ),
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addItem } = useCart();
  const [size, setSize] = useState<(typeof product.sizes)[number] | null>(null);
  const [color, setColor] = useState<string>(product.colors[0].name);

  const handleAdd = () => {
    if (!size) {
      alert("Alege o mărime înainte de a adăuga produsul în coș.");
      return;
    }
    addItem(product, size, color);
  };

  const related = products.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="px-5 md:px-10 py-8 md:py-12 pb-28 md:pb-12">
      <div className="mx-auto max-w-[1600px]">
        <nav className="font-mono-xs opacity-60 mb-8">
          <Link to="/shop" className="hover:opacity-100">
            Magazin
          </Link>
          <span className="mx-2">/</span>
          <span>{product.title}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-7 grid md:grid-cols-2 gap-3 md:gap-4">
            {product.images.map((img: string, i: number) => (
              <div key={i} className="aspect-[4/5] bg-warm-grey img-zoom">
                <img
                  src={img}
                  alt={product.title}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          <aside className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center gap-3 mb-3">
              {product.badge && (
                <span className="font-mono-xs bg-charcoal text-cream px-2 py-1">
                  {product.badge}
                </span>
              )}
              <span className="font-mono-xs opacity-60">{product.collection}</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl leading-tight">{product.title}</h1>
            <div className="mt-3 text-xl tabular-nums">{formatRON(product.price)}</div>

            <p className="mt-8 text-muted-foreground leading-relaxed">{product.description}</p>

            <div className="mt-6 grid grid-cols-2 gap-3 font-mono-xs">
              <div className="border border-border p-3">
                <span className="opacity-50 block mb-1">Material</span>
                Bumbac dens 240 gsm
              </div>
              <div className="border border-border p-3">
                <span className="opacity-50 block mb-1">Model</span>
                1.82m · poartă L
              </div>
            </div>

            <div className="mt-10 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono-xs">Culoare · {color}</span>
                </div>
                <VariantSelector colors={product.colors} value={color} onChange={setColor} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono-xs">Mărime</span>
                  <button className="font-mono-xs underline underline-offset-4 opacity-60">
                    Ghid mărimi
                  </button>
                </div>
                <SizeSelector
                  sizes={product.sizes}
                  stock={product.stock}
                  value={size}
                  onChange={setSize}
                />
                {size && (
                  <p className="font-mono-xs mt-3 opacity-60">
                    {product.stock[size] > 0
                      ? product.stock[size] < 5
                        ? `Doar ${product.stock[size]} rămase`
                        : "În stoc"
                      : "Stoc epuizat"}
                  </p>
                )}
              </div>

              <button
                onClick={handleAdd}
                className="w-full bg-charcoal text-cream py-4 font-mono-xs hover:bg-charcoal/90 transition-colors"
              >
                Adaugă în coș — {formatRON(product.price)}
              </button>

              <p className="font-mono-xs opacity-60">Croială: {product.fitNote}</p>
            </div>

            <ul className="mt-10 grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <li className="flex flex-col items-start gap-2">
                <Truck className="h-4 w-4" strokeWidth={1.25} />
                <span className="font-mono-xs">Livrare RO/EU</span>
              </li>
              <li className="flex flex-col items-start gap-2">
                <RotateCcw className="h-4 w-4" strokeWidth={1.25} />
                <span className="font-mono-xs">Retur 14 zile</span>
              </li>
              <li className="flex flex-col items-start gap-2">
                <Shield className="h-4 w-4" strokeWidth={1.25} />
                <span className="font-mono-xs">Plată securizată</span>
              </li>
            </ul>

            <div className="mt-10 space-y-8 border-t border-border pt-8">
              <InfoBlock title="De ce costă atât">
                <ul className="space-y-2">
                  <li>Bumbac greu, 240 gsm, cu senzație premium.</li>
                  <li>Croială oversized boxy, construită pentru purtare zilnică.</li>
                  <li>Față curată, print mai puternic pe spate și serie limitată.</li>
                </ul>
              </InfoBlock>

              <InfoBlock title="Tabel mărimi">
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono-xs border border-border">
                    <thead className="bg-cream">
                      <tr>
                        <th className="p-3 border-r border-border">Mărime</th>
                        <th className="p-3 border-r border-border">Piept</th>
                        <th className="p-3 border-r border-border">Lungime</th>
                        <th className="p-3">Umăr</th>
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
                  Măsurătorile sunt orientative pentru demo. În producție se vor înlocui cu
                  măsurătorile exacte ale produsului.
                </p>
              </InfoBlock>

              <InfoBlock title="Îngrijire">
                Spală pe dos la 30°C, nu folosi înălbitor și evită uscarea automată. Calcă pe dos,
                fără contact direct cu printul.
              </InfoBlock>
            </div>
          </aside>
        </div>

        <section className="mt-20 md:mt-32 border-t border-border pt-12">
          <div className="grid md:grid-cols-12 gap-10">
            <div className="md:col-span-4">
              <p className="font-mono-xs opacity-60">Recenzii</p>
              <h2 className="font-display text-4xl md:text-6xl mt-3">Ce spun clienții.</h2>
            </div>
            <div className="md:col-span-8 grid md:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <figure key={review.name} className="border-t border-border pt-5">
                  <div className="font-mono-xs">{"★".repeat(review.rating)}</div>
                  <blockquote className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    “{review.text}”
                  </blockquote>
                  <figcaption className="font-mono-xs opacity-60 mt-4">
                    {review.name} · {review.location}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-20 md:mt-32 border-t border-border pt-12">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <p className="font-mono-xs opacity-60">Completează coșul</p>
              <h2 className="font-display text-4xl md:text-6xl mt-3">Merge bine cu.</h2>
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
                  className="aspect-[4/5] w-full object-cover bg-warm-grey"
                  loading="lazy"
                />
                <div className="mt-3 flex justify-between gap-3">
                  <span className="font-display">{item.title}</span>
                  <span className="text-sm tabular-nums">{formatRON(item.price)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className="fixed md:hidden left-0 right-0 bottom-0 z-40 bg-background border-t border-border p-4">
        <button onClick={handleAdd} className="w-full bg-charcoal text-cream py-4 font-mono-xs">
          Adaugă în coș — {formatRON(product.price)}
        </button>
      </div>
    </div>
  );
}

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-mono-xs mb-3">{title}</h2>
      <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}
