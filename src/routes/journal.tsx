import { createFileRoute, Link } from "@tanstack/react-router";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/journal")({
  component: Journal,
  head: () =>
    pageMeta({
      path: "/journal",
      title: "Jurnal - Trei Linii",
      description: "Jurnalul editorial Trei Linii este în pregătire.",
      noIndex: true,
    }),
});

function Journal() {
  return (
    <section className="px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-4xl border-y border-border py-16">
        <p className="font-mono-xs text-accent-text">Jurnal</p>
        <h1 className="mt-5 max-w-3xl font-display text-5xl leading-tight md:text-8xl">
          Publicăm numai când avem ceva de spus.
        </h1>
        <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Primele note vor apărea odată cu materialele și procesele pe care le putem documenta
          direct. Până atunci, colecțiile spun povestea.
        </p>
        <Link
          to="/shop"
          className="mt-9 inline-flex min-h-12 items-center border border-charcoal px-6 font-mono-xs transition-colors hover:bg-charcoal hover:text-cream"
        >
          Vezi colecțiile
        </Link>
      </div>
    </section>
  );
}
