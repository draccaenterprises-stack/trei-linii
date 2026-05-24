import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  component: Terms,
  head: () => ({
    meta: [
      { title: "Termeni și condiții — Trei Linii" },
      {
        name: "description",
        content: "Termeni și condiții pentru magazinul online Trei Linii.",
      },
    ],
  }),
});

function Terms() {
  return <LegalPage title="Termeni și condiții" />;
}

function LegalPage({ title }: { title: string }) {
  return (
    <main className="px-5 md:px-10 py-16 md:py-24">
      <article className="mx-auto max-w-3xl">
        <p className="font-mono-xs opacity-60">Legal</p>
        <h1 className="font-display text-5xl md:text-7xl mt-3">{title}</h1>
        <div className="mt-10 space-y-6 text-muted-foreground leading-relaxed">
          <p>
            Această pagină este pregătită pentru lansare și trebuie completată cu datele reale ale
            firmei, politica finală de livrare, retur, plată și contact înainte de vânzarea
            comercială.
          </p>
          <p>
            În producție, finalizarea comenzii, plata, taxele și livrarea vor fi administrate prin
            Shopify.
          </p>
        </div>
      </article>
    </main>
  );
}
