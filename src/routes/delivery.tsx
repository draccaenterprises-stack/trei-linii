import { createFileRoute } from "@tanstack/react-router";
import { useSite } from "@/lib/site-context";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/delivery")({
  component: Delivery,
  head: () =>
    pageMeta({
      path: "/delivery",
      title: "Livrare - Trei Linii",
      description: "Informatii despre livrare pentru Trei Linii.",
    }),
});

function Delivery() {
  const { deliveryTitle, deliveryBody } = useSite();

  return (
    <main className="px-5 md:px-10 py-16 md:py-24">
      <article className="mx-auto max-w-3xl">
        <p className="font-mono-xs opacity-60">Suport</p>
        <h1 className="font-display text-5xl md:text-7xl mt-3">{deliveryTitle}</h1>
        <div className="mt-10 space-y-6 text-muted-foreground leading-relaxed">
          <p>{deliveryBody}</p>
          <p>
            Dupa expediere, primesti detaliile de urmarire pe email. Verifica adresa inainte de
            finalizarea comenzii pentru a evita intarzierile.
          </p>
        </div>
      </article>
    </main>
  );
}
