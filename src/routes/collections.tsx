import { createFileRoute } from "@tanstack/react-router";
import { CollectionCard } from "@/components/CollectionCard";
import { fetchCollections } from "@/lib/shopify";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/collections")({
  loader: () => fetchCollections(),
  component: CollectionsPage,
  head: () =>
    pageMeta({
      path: "/collections",
      title: "Lansari - Trei Linii",
      description: "Lansarile si directiile Trei Linii: tricouri, materiale si design pe spate.",
    }),
});

function CollectionsPage() {
  const collections = Route.useLoaderData();

  return (
    <div className="px-5 md:px-10 py-12 md:py-20">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-12 md:mb-20 max-w-3xl">
          <p className="font-mono-xs opacity-60">Lansari</p>
          <h1 className="font-display text-5xl md:text-8xl mt-2">
            Lansarea 01.
            <br />
            Trei directii.
          </h1>
          <p className="mt-6 text-muted-foreground text-lg max-w-xl">
            Fiecare produs Trei Linii apartine unei directii clare: fit oversized, material dens si
            design mai puternic pe spate.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          {collections.map((c) => (
            <CollectionCard key={c.handle} collection={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
