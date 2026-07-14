import { Link, type NavigateFn } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { PackageCheck, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { ProductGrid } from "@/components/ProductCard";
import type { Collection, Product } from "@/lib/catalog-types";

type ShopNavigate = NavigateFn;

export function ShopProductList({
  products,
  collections = [],
  color,
  collectionHandle,
  navigate,
  backToPresentation = false,
}: {
  products: Product[];
  collections?: Collection[];
  color?: string;
  collectionHandle?: string;
  navigate: ShopNavigate;
  backToPresentation?: boolean;
}) {
  const [sort, setSort] = useState<"recommended" | "price-asc" | "price-desc" | "title-asc">(
    "recommended",
  );
  const availableColorFilters = useMemo(() => {
    const colors = new Map<string, string>();
    products.forEach((product) =>
      product.colors.forEach((item) => colors.set(normalizeColor(item.name), item.name)),
    );
    return [
      { label: "Toate", value: undefined },
      ...[...colors].map(([value, label]) => ({ label, value })),
    ];
  }, [products]);

  let filtered = collectionHandle
    ? products.filter((product) => {
        const collection = collections.find((item) => item.handle === collectionHandle);
        if (collection?.productIds?.includes(product.id)) return true;
        if (product.collections?.includes(collectionHandle)) return true;
        return product.collection === collectionHandle;
      })
    : products;
  filtered = color
    ? filtered.filter((product) =>
        product.colors.some((item) => normalizeColor(item.name) === color),
      )
    : filtered;
  filtered = [...filtered].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "title-asc") return a.title.localeCompare(b.title, "ro");
    return 0;
  });

  const visibleCollections = collections.filter((collection) =>
    products.some(
      (product) =>
        collection.productIds?.includes(product.id) ||
        product.collections?.includes(collection.handle) ||
        product.collection === collection.handle,
    ),
  );

  return (
    <div className="px-5 py-12 md:px-10 md:py-20">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-10 border-b border-border pb-10 md:mb-14 md:grid md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <p className="font-mono-xs opacity-60">Lista completă</p>
            <h1 className="mt-2 font-display text-5xl md:text-8xl">
              {color
                ? `Modele ${availableColorFilters.find((item) => item.value === color)?.label ?? ""}.`
                : "Toate modelele."}
            </h1>
          </div>
          <div className="mt-6 md:col-span-4 md:col-start-9 md:mt-0 md:self-end">
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              Alege mărimea și culoarea în ritmul tău. Lista rămâne pentru comparație rapidă.
            </p>
            {backToPresentation && (
              <Link
                to="/shop"
                className="mt-5 inline-flex font-mono-xs text-accent-text underline underline-offset-4"
              >
                Înapoi la prezentare
              </Link>
            )}
          </div>
        </header>

        <div className="mb-8 flex flex-col gap-5 border-b border-border pb-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            {visibleCollections.length > 1 && (
              <div className="flex flex-wrap gap-2">
                <FilterChip
                  active={!collectionHandle}
                  onClick={() => navigate({ search: (color ? { color } : {}) as never })}
                >
                  Toate colecțiile
                </FilterChip>
                {visibleCollections.map((collection) => (
                  <FilterChip
                    key={collection.handle}
                    active={collectionHandle === collection.handle}
                    onClick={() =>
                      navigate({
                        search: {
                          colectie: collection.handle,
                          ...(color ? { color } : {}),
                        } as never,
                      })
                    }
                  >
                    {collection.title}
                  </FilterChip>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {availableColorFilters.map((item) => (
                <FilterChip
                  key={item.label}
                  active={color === item.value || (!color && !item.value)}
                  onClick={() =>
                    navigate({
                      search: {
                        ...(item.value ? { color: item.value } : {}),
                        ...(collectionHandle ? { colectie: collectionHandle } : {}),
                      } as never,
                    })
                  }
                >
                  {item.label}
                </FilterChip>
              ))}
            </div>
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            aria-label="Sortează produsele"
            className="w-full border border-border bg-transparent px-3 py-3 font-mono-xs outline-none md:w-auto"
          >
            <option value="recommended">Sortare: recomandate</option>
            <option value="price-asc">Preț: mic spre mare</option>
            <option value="price-desc">Preț: mare spre mic</option>
            <option value="title-asc">Nume: A-Z</option>
          </select>
        </div>

        <div className="mb-12 grid gap-3 md:grid-cols-4">
          {[
            {
              icon: PackageCheck,
              title: "Detalii clare",
              text: "variante și descriere pe fiecare produs",
            },
            { icon: Truck, title: "Livrare", text: "termen și cost afișate în checkout" },
            { icon: RotateCcw, title: "Schimb de mărime", text: "în limita stocului disponibil" },
            { icon: ShieldCheck, title: "Plată", text: "finalizare prin checkout-ul magazinului" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="border border-border px-4 py-4">
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-accent-text" strokeWidth={1.5} />
                  <p className="font-mono-xs">{item.title}</p>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{item.text}</p>
              </div>
            );
          })}
        </div>

        <p className="sr-only" aria-live="polite">
          {filtered.length} produse afișate.
        </p>
        {filtered.length > 0 ? (
          <ProductGrid products={filtered} />
        ) : (
          <div className="border-y border-border py-16 text-center">
            <h2 className="font-display text-4xl">Nu am găsit produse pentru filtrele alese.</h2>
            <button
              type="button"
              className="mt-6 font-mono-xs text-accent-text underline underline-offset-4"
              onClick={() => navigate({ search: {} as never })}
            >
              Resetează filtrele
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function normalizeColor(value: string) {
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
      type="button"
      onClick={onClick}
      className={`border px-3 py-2 font-mono-xs transition-colors ${
        active ? "border-charcoal bg-charcoal text-cream" : "border-border hover:border-charcoal"
      }`}
    >
      {children}
    </button>
  );
}
