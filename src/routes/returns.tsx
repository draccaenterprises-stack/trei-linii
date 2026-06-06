import { createFileRoute } from "@tanstack/react-router";
import { useSite } from "@/lib/site-context";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/returns")({
  component: Returns,
  head: () =>
    pageMeta({
      path: "/returns",
      title: "Retur - Trei Linii",
      description: "Informatii despre retur pentru produsele Trei Linii.",
    }),
});

function Returns() {
  const { returnsTitle, returnsBody } = useSite();

  return (
    <main className="px-5 md:px-10 py-16 md:py-24">
      <article className="mx-auto max-w-3xl">
        <p className="font-mono-xs opacity-60">Suport</p>
        <h1 className="font-display text-5xl md:text-7xl mt-3">{returnsTitle}</h1>
        <div className="mt-10 space-y-6 text-muted-foreground leading-relaxed">
          <p>{returnsBody}</p>
          <p>
            Pentru a incepe returul, trimite un email cu numarul comenzii si motivul returului.
            Costurile si pasii exacti sunt confirmati in raspunsul de suport.
          </p>
          <p>Produsele personalizate sau deteriorate prin folosire pot fi refuzate la retur.</p>
        </div>
      </article>
    </main>
  );
}
