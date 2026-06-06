import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { PackageCheck, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { ProductGrid } from "@/components/ProductCard";
import { fetchProducts } from "@/lib/shopify";
import { useSite } from "@/lib/site-context";
import { pageMeta } from "@/lib/seo";
import { z } from "zod";

const searchSchema = z.object({
  color: z.string().optional(),
});

const colorFilters = [
  { label: "Toate", value: undefined },
  { label: "Crem", value: "crem" },
  { label: "Carbune", value: "carbune" },
  { label: "Olive", value: "olive" },
  { label: "Off White", value: "off-white" },
  { label: "Washed Blue", value: "washed-blue" },
] as const;

export const Route = createFileRoute("/shop")({
  validateSearch: searchSchema,
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
        "Tricouri oversized cu fata curata si design minimalist pe spate. Previzualizare de modele Trei Linii.",
    }),
});

function Shop() {
  const { products } = Route.useLoaderData();
  const { siteMode } = useSite();
  const { color } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc">("featured");

  let filtered = color
    ? products.filter((product) =>
        product.colors.some((item) => normalizeColor(item.name) === color),
      )
    : products;
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
            {siteMode === "pre-launch" ? "Previzualizare modele" : "Magazin"}
          </p>
          <h1 className="font-display text-5xl md:text-8xl mt-2">
            {color
              ? `Modele ${colorFilters.find((item) => item.value === color)?.label ?? ""}.`
              : siteMode === "pre-launch"
                ? "Modele in pregatire."
                : "Toate modelele."}
          </h1>
          <p className="mt-6 text-muted-foreground text-lg">
            {siteMode === "pre-launch"
              ? "Produsele afisate prezinta directia brandului si sunt pregatite pentru prima colectie."
              : "Alege marimea, culoarea si continua catre plata securizata."}
          </p>
        </header>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-4 border-b border-border">
          <div className="flex flex-wrap gap-2">
            {colorFilters.map((item) => (
              <FilterChip
                key={item.label}
                active={color === item.value || (!color && !item.value)}
                onClick={() => navigate({ search: item.value ? { color: item.value } : {} })}
              >
                {item.label}
              </FilterChip>
            ))}
          </div>
          {siteMode === "live-shop" && (
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              aria-label="Sorteaza produsele"
              className="font-mono-xs bg-transparent border border-border px-3 py-2 outline-none"
            >
              <option value="featured">Sortare: recomandate</option>
              <option value="price-asc">Pret: mic spre mare</option>
              <option value="price-desc">Pret: mare spre mic</option>
            </select>
          )}
        </div>

        <div className="mb-10 grid gap-3 md:grid-cols-4">
          {[
            { icon: PackageCheck, title: "Bumbac 240gsm", text: "dens, stabil, oversized" },
            { icon: Truck, title: "Livrare rapida", text: "estimare la checkout" },
            { icon: RotateCcw, title: "Schimb marime", text: "fit-ul trebuie sa cada bine" },
            { icon: ShieldCheck, title: "Plata securizata", text: "checkout prin Shopify" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="border border-border px-4 py-3">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-[#ff006f]" strokeWidth={1.5} />
                  <p className="font-mono-xs">{item.title}</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
              </div>
            );
          })}
        </div>

        <ProductGrid products={filtered} />
      </div>
    </div>
  );
}

function normalizeColor(value: string) {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-");

  if (normalized === "albastru-spalat") return "washed-blue";
  if (normalized === "off-white") return "off-white";
  return normalized;
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
