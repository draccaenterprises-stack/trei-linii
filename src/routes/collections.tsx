import { createFileRoute } from "@tanstack/react-router";
import { CollectionCard } from "@/components/CollectionCard";
import { collections } from "@/lib/mock-data";

export const Route = createFileRoute("/collections")({
  component: CollectionsPage,
  head: () => ({
    meta: [
      { title: "Categorii — Trei Linii" },
      {
        name: "description",
        content: "Categoriile Trei Linii: Tricouri, Spălate și Printuri.",
      },
    ],
  }),
});

function CollectionsPage() {
  return (
    <div className="px-5 md:px-10 py-12 md:py-20">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-12 md:mb-20 max-w-3xl">
          <p className="font-mono-xs opacity-60">Categorii</p>
          <h1 className="font-display text-5xl md:text-8xl mt-2">
            Trei direcții.
            <br />
            Același limbaj.
          </h1>
          <p className="mt-6 text-muted-foreground text-lg max-w-xl">
            Fiecare produs Trei Linii aparține unei direcții clare: tricouri de bază, finisaje
            modele spălate sau printuri mai puternice pe spate.
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
