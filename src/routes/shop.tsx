import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { ProductGrid } from "@/components/ProductCard";
import { fetchCollections, fetchProducts } from "@/lib/shopify";
import { useSite } from "@/lib/site-context";
import { z } from "zod";

const searchSchema = z.object({
  collection: z.string().optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: searchSchema,
  loader: async () => {
    const [products, collections] = await Promise.all([fetchProducts(), fetchCollections()]);
    return { products, collections };
  },
  component: Shop,
  head: () => ({
    meta: [
      { title: "Modele - Trei Linii" },
      {
        name: "description",
        content:
          "Tricouri oversized cu fata curata si design minimalist pe spate. Preview de modele Trei Linii.",
      },
    ],
  }),
});

function Shop() {
  const { products, collections } = Route.useLoaderData();
  const { siteMode } = useSite();
  const { collection } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc">("featured");

  let filtered = collection ? products.filter((p) => p.collection === collection) : products;
  filtered = [...filtered].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return 0;
  });

  return (
    <div className="px-5 md:px-10 py-12 md:py-20">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-12 md:mb-20 max-w-3xl">
          <p className="font-mono-xs opacity-60">
            {siteMode === "pre-launch" ? "Preview modele" : "Shop"}
          </p>
          <h1 className="font-display text-5xl md:text-8xl mt-2">
            {collection
              ? (collections.find((c) => c.handle === collection)?.title ?? "Modele")
              : siteMode === "pre-launch"
                ? "Modele in pregatire."
                : "Toate modelele."}
          </h1>
          <p className="mt-6 text-muted-foreground text-lg">
            {siteMode === "pre-launch"
              ? "Produsele afisate sunt preview-uri pentru directia brandului. Inscrie-te pe lista pentru anuntul de lansare."
              : "Alege marimea, culoarea si continua catre checkout securizat."}
          </p>
        </header>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-4 border-b border-border">
          <div className="flex flex-wrap gap-2">
            <FilterChip active={!collection} onClick={() => navigate({ search: {} })}>
              Toate
            </FilterChip>
            {collections.map((c) => (
              <FilterChip
                key={c.handle}
                active={collection === c.handle}
                onClick={() => navigate({ search: { collection: c.handle } })}
              >
                {c.title}
              </FilterChip>
            ))}
          </div>
          {siteMode === "live-shop" && (
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="font-mono-xs bg-transparent border border-border px-3 py-2 outline-none"
            >
              <option value="featured">Sortare: recomandate</option>
              <option value="price-asc">Pret: mic spre mare</option>
              <option value="price-desc">Pret: mare spre mic</option>
            </select>
          )}
        </div>

        <ProductGrid products={filtered} />
      </div>
    </div>
  );
}

function FilterChip({
  children,
  active,
  onClick,
}: {
  children: ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`font-mono-xs px-3 py-1.5 border transition-colors ${
        active ? "bg-charcoal text-cream border-charcoal" : "border-border hover:border-charcoal"
      }`}
    >
      {children}
    </button>
  );
}
