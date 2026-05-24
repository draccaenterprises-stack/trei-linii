import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/returns")({
  component: Returns,
  head: () => ({
    meta: [
      { title: "Politica de retur — Trei Linii" },
      {
        name: "description",
        content: "Politica de retur pentru comenzile Trei Linii.",
      },
    ],
  }),
});

function Returns() {
  return (
    <main className="px-5 md:px-10 py-16 md:py-24">
      <article className="mx-auto max-w-3xl">
        <p className="font-mono-xs opacity-60">Legal</p>
        <h1 className="font-display text-5xl md:text-7xl mt-3">Politica de retur</h1>
        <div className="mt-10 space-y-6 text-muted-foreground leading-relaxed">
          <p>
            Recomandarea pentru lansare este retur în 14 zile pentru produse nepurtate, nespălate,
            cu etichetele intacte și în ambalajul original.
          </p>
          <p>
            Textul final trebuie validat înainte de lansare și conectat la procesul real de retur
            din Shopify.
          </p>
        </div>
      </article>
    </main>
  );
}
