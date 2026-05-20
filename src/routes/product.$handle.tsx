import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { products } from "@/lib/mock-data";
import { SizeSelector, VariantSelector } from "@/components/VariantSelectors";
import { useCart } from "@/lib/cart-context";
import { formatRON } from "@/lib/format";
import { Truck, RotateCcw, Shield } from "lucide-react";

export const Route = createFileRoute("/product/$handle")({
  loader: ({ params }) => {
    const product = products.find((p) => p.handle === params.handle);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.title} — BLANK ATELIER` },
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
      <h1 className="font-display text-5xl">Not found</h1>
      <Link to="/shop" className="font-mono-xs underline mt-6 inline-block">Back to shop</Link>
    </div>
  ),
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addItem } = useCart();
  const [size, setSize] = useState<typeof product.sizes[number] | null>(null);
  const [color, setColor] = useState<string>(product.colors[0].name);

  const handleAdd = () => {
    if (!size) {
      alert("Please select a size.");
      return;
    }
    addItem(product, size, color);
  };

  return (
    <div className="px-5 md:px-10 py-8 md:py-12">
      <div className="mx-auto max-w-[1600px]">
        <nav className="font-mono-xs opacity-60 mb-8">
          <Link to="/shop" className="hover:opacity-100">Shop</Link>
          <span className="mx-2">/</span>
          <span>{product.title}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Gallery */}
          <div className="lg:col-span-7 grid md:grid-cols-2 gap-3 md:gap-4">
            {product.images.map((img, i) => (
              <div key={i} className="aspect-[4/5] bg-warm-grey img-zoom">
                <img src={img} alt={product.title} loading={i === 0 ? "eager" : "lazy"} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* Info */}
          <aside className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center gap-3 mb-3">
              {product.badge && (
                <span className="font-mono-xs bg-charcoal text-cream px-2 py-1">{product.badge}</span>
              )}
              <span className="font-mono-xs opacity-60">{product.collection}</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl leading-tight">{product.title}</h1>
            <div className="mt-3 text-xl tabular-nums">{formatRON(product.price)}</div>

            <p className="mt-8 text-muted-foreground leading-relaxed">{product.description}</p>

            <div className="mt-10 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono-xs">Color · {color}</span>
                </div>
                <VariantSelector colors={product.colors} value={color} onChange={setColor} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono-xs">Size</span>
                  <button className="font-mono-xs underline underline-offset-4 opacity-60">Size guide</button>
                </div>
                <SizeSelector sizes={product.sizes} stock={product.stock} value={size} onChange={setSize} />
                {size && (
                  <p className="font-mono-xs mt-3 opacity-60">
                    {product.stock[size] > 0
                      ? product.stock[size] < 5
                        ? `Only ${product.stock[size]} left`
                        : "In stock"
                      : "Out of stock"}
                  </p>
                )}
              </div>

              <button
                onClick={handleAdd}
                className="w-full bg-charcoal text-cream py-4 font-mono-xs hover:bg-charcoal/90 transition-colors"
              >
                Add to cart — {formatRON(product.price)}
              </button>

              <p className="font-mono-xs opacity-60">Fit: {product.fitNote}</p>
            </div>

            <ul className="mt-10 grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <li className="flex flex-col items-start gap-2"><Truck className="h-4 w-4" strokeWidth={1.25} /><span className="font-mono-xs">EU shipping</span></li>
              <li className="flex flex-col items-start gap-2"><RotateCcw className="h-4 w-4" strokeWidth={1.25} /><span className="font-mono-xs">30-day returns</span></li>
              <li className="flex flex-col items-start gap-2"><Shield className="h-4 w-4" strokeWidth={1.25} /><span className="font-mono-xs">Secure checkout</span></li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
