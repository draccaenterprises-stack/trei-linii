import { createFileRoute } from "@tanstack/react-router";
import { useSite } from "@/lib/site-context";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/exchange")({
  component: Exchange,
  head: () =>
    pageMeta({
      path: "/exchange",
      title: "Schimb marime - Trei Linii",
      description: "Informatii despre schimbul de marime Trei Linii.",
    }),
});

function Exchange() {
  const { exchangeTitle, exchangeBody } = useSite();

  return (
    <main className="px-5 md:px-10 py-16 md:py-24">
      <article className="mx-auto max-w-3xl">
        <p className="font-mono-xs opacity-60">Suport</p>
        <h1 className="font-display text-5xl md:text-7xl mt-3">{exchangeTitle}</h1>
        <div className="mt-10 space-y-6 text-muted-foreground leading-relaxed">
          <p>{exchangeBody}</p>
          <p>
            Trimite un mesaj cu numarul comenzii si marimea dorita. Confirmam disponibilitatea si
            pasii de schimb inainte de trimitere.
          </p>
        </div>
      </article>
    </main>
  );
}
