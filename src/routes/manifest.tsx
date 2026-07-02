import { createFileRoute, Link } from "@tanstack/react-router";
import lookbookOne from "@/assets/lookbook-1.jpg";
import { pageMeta } from "@/lib/seo";

const values = [
  {
    title: "Disciplina, nu zgomot",
    text: "Nu lansam des. Lansam cand o piesa merita sa existe. Fiecare model trece prin probe de croiala, material si print inainte sa primeasca un numar.",
  },
  {
    title: "Tiraj limitat, pe bune",
    text: "Cand o editie se termina, se termina. Nu reeditam, nu facem re-stock. Piesa ta ramane a ta si a celor putini care au prins-o.",
  },
  {
    title: "Spatele ca scena",
    text: "Am ales un singur loc pentru design: spatele. E o alegere de restraint. Fata curata e cea mai greu de purtat afirmatie.",
  },
] as const;

const stats = [
  { value: "240", label: "grame pe metru patrat" },
  { value: "8", label: "piese numerotate in prima editie" },
  { value: "0", label: "reeditari. Niciodata." },
] as const;

export const Route = createFileRoute("/manifest")({
  component: Manifest,
  head: () =>
    pageMeta({
      path: "/manifest",
      title: "Manifest - Trei Linii",
      description:
        "Manifestul Trei Linii: fata curata, design pe spate, bumbac dens si editii limitate.",
    }),
});

function Manifest() {
  return (
    <div className="pb-24 pt-12 md:pb-32 md:pt-20">
      <section className="px-5 md:px-10">
        <div className="mx-auto max-w-[1600px]">
          <p className="font-mono-xs opacity-60">Manifest</p>
          <h1 className="mt-6 max-w-5xl font-display text-5xl leading-[1.02] md:text-8xl">
            Doua linii negre tin structura.{" "}
            <span className="italic text-muted-foreground">
              A treia, <span className="text-[#ff006f]">cea roz</span>, e semnatura.
            </span>
          </h1>
        </div>
      </section>

      <section className="px-5 md:px-10 py-16 md:py-24">
        <div className="mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5 img-zoom bg-warm-grey">
            <img
              src={lookbookOne}
              alt="Doua persoane purtand tricouri oversized Trei Linii"
              className="aspect-[4/5] w-full object-cover"
              decoding="async"
              loading="eager"
            />
          </div>

          <div className="lg:col-span-6 lg:col-start-7 lg:self-center">
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              Trei Linii a pornit de la o observatie simpla: garderobele bune se construiesc din
              piese care tac frumos. Un tricou purtat des nu are nevoie de logo pe piept. Are nevoie
              de material dens, de o croiala care cade corect si de un motiv sa ramana.
            </p>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              Asa am ajuns la regula casei: fata curata, designul pe spate, tirajul limitat. Restul
              e disciplina: aceeasi croiala probata de zeci de ori, acelasi bumbac de 240gsm,
              aceeasi linie roz care semneaza fiecare editie.
            </p>

            <div className="mt-14 space-y-10">
              {values.map((value) => (
                <article key={value.title} className="flex gap-6">
                  <span className="mt-2 h-px w-10 flex-none bg-[#ff006f]" aria-hidden="true" />
                  <div>
                    <h2 className="font-mono-xs">{value.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {value.text}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-charcoal text-cream">
        <div className="mx-auto grid max-w-[1600px] gap-px bg-cream/15 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-charcoal px-10 py-16 text-center">
              <p className="font-display text-6xl italic">{stat.value}</p>
              <p className="mt-4 font-mono-xs text-cream/55">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 md:px-10 pt-16 md:pt-24">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-6 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          <p className="font-display text-2xl md:text-3xl">Fata curata. Totul pe spate.</p>
          <Link to="/shop" className="inline-flex bg-charcoal px-6 py-3 font-mono-xs text-cream">
            Vezi shop
          </Link>
        </div>
      </section>
    </div>
  );
}
