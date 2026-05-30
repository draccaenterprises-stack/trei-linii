import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  component: Terms,
  head: () => ({
    meta: [
      { title: "Termeni si conditii - Trei Linii" },
      { name: "description", content: "Termeni pentru folosirea site-ului Trei Linii." },
    ],
  }),
});

function Terms() {
  return (
    <main className="px-5 md:px-10 py-16 md:py-24">
      <article className="mx-auto max-w-3xl">
        <p className="font-mono-xs opacity-60">Legal</p>
        <h1 className="font-display text-5xl md:text-7xl mt-3">Termeni si conditii</h1>
        <div className="mt-10 space-y-6 text-muted-foreground leading-relaxed">
          <p>
            Prin folosirea site-ului Trei Linii accepti termenii de navigare, informare si, atunci
            cand magazinul este activ, plasare a comenzilor prin checkout securizat.
          </p>
          <p>
            Produsele, preturile, disponibilitatea, livrarea si metodele de plata pot fi actualizate
            in functie de stoc, furnizori si setarile magazinului.
          </p>
          <p>
            Pentru intrebari despre comenzi, retur sau schimb de marime, foloseste pagina de
            contact.
          </p>
        </div>
      </article>
    </main>
  );
}
