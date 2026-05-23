import { createFileRoute } from "@tanstack/react-router";
import { CollectionCard } from "@/components/CollectionCard";
import { collections } from "@/lib/mock-data";

export const Route = createFileRoute("/collections")({
  component: CollectionsPage,
  head: () => ({
    meta: [
      { title: "Collections — BLANK ATELIER" },
      {
        name: "description",
        content: "Three lines, one language. Essentials, Washed, and Graphics.",
      },
    ],
  }),
});

function CollectionsPage() {
  return (
    <div className="px-5 md:px-10 py-12 md:py-20">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-12 md:mb-20 max-w-3xl">
          <p className="font-mono-xs opacity-60">Collections</p>
          <h1 className="font-display text-5xl md:text-8xl mt-2">
            Three lines.
            <br />
            One language.
          </h1>
          <p className="mt-6 text-muted-foreground text-lg max-w-xl">
            Every BLANK ATELIER piece belongs to one of three programs — built around fabric weight,
            finishing technique and intent of mark.
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
