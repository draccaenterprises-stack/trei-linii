import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  component: Privacy,
  head: () => ({
    meta: [
      { title: "Politica de confidențialitate — Trei Linii" },
      {
        name: "description",
        content: "Politica de confidențialitate pentru Trei Linii.",
      },
    ],
  }),
});

function Privacy() {
  return (
    <main className="px-5 md:px-10 py-16 md:py-24">
      <article className="mx-auto max-w-3xl">
        <p className="font-mono-xs opacity-60">Legal</p>
        <h1 className="font-display text-5xl md:text-7xl mt-3">Confidențialitate</h1>
        <div className="mt-10 space-y-6 text-muted-foreground leading-relaxed">
          <p>
            Această pagină va descrie datele colectate pentru comenzi, newsletter, analiză trafic și
            suport clienți.
          </p>
          <p>
            Datele de comandă și plată vor fi procesate prin Shopify și furnizorii activi în
            magazin.
          </p>
        </div>
      </article>
    </main>
  );
}
