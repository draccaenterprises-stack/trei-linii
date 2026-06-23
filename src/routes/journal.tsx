import { createFileRoute } from "@tanstack/react-router";
import { pageMeta } from "@/lib/seo";

const articles = [
  {
    title: "De ce 240gsm se simte altfel",
    body: "Un tricou greu cade mai curat pe corp, tine mai bine forma si lasa grafica de pe spate sa ramana calma, nu tensionata. Pentru Trei Linii, materialul e prima parte a designului.",
  },
  {
    title: "Cum porti oversized fara sa para intamplator",
    body: "Pastreaza volumul in partea de sus si lasa restul tinutei sa respire: denim drept, pantaloni largi cu talie curata sau shorts simpli. Tricoul devine piesa centrala fara sa strige.",
  },
  {
    title: "Ingrijire pentru print si bumbac",
    body: "Spala pe dos la temperatura joasa, evita uscatorul si calca printul doar prin material. Asa pastrezi textura bumbacului si contrastul graficii pentru mai multe sezoane.",
  },
];

export const Route = createFileRoute("/journal")({
  component: Journal,
  head: () =>
    pageMeta({
      path: "/journal",
      title: "Jurnal - Trei Linii",
      description: "Note scurte despre material, fit oversized si ingrijirea tricourilor.",
    }),
});

function Journal() {
  return (
    <div className="px-5 py-12 md:px-10 md:py-20">
      <div className="mx-auto grid max-w-[1600px] gap-12 md:grid-cols-12">
        <aside className="md:col-span-4 md:sticky md:top-28 md:self-start">
          <p className="font-mono-xs text-[#ff006f]">Jurnal</p>
          <h1 className="mt-3 font-display text-5xl leading-[0.98] md:text-8xl">
            Material,
            <br />
            fit si purtare.
          </h1>
        </aside>
        <div className="md:col-span-8">
          {articles.map((article, index) => (
            <article key={article.title} className="border-t border-border py-8 md:py-12">
              <span className="font-mono-xs text-[#ff006f]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-4 font-display text-4xl leading-tight md:text-6xl">
                {article.title}
              </h2>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                {article.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
