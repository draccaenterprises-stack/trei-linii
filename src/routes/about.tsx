import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero.jpg";
import lookbookOne from "@/assets/lookbook-1.jpg";
import lookbookTwo from "@/assets/lookbook-2.jpg";
import productDetail from "@/assets/product-2b.jpg";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  component: About,
  head: () =>
    pageMeta({
      path: "/about",
      title: "Despre - Trei Linii",
      description:
        "Trei Linii este un brand de streetwear minimal construit in jurul tricourilor oversized si al graficii curate.",
    }),
});

function About() {
  return (
    <div className="py-12 md:py-20">
      <section className="px-5 md:px-10">
        <div className="mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p className="font-mono-xs opacity-60">Despre noi</p>
            <h1 className="font-display text-5xl md:text-8xl mt-2 leading-[0.95]">
              Simplu in fata.
              <br />
              Memorabil
              <br />
              din spate.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Trei Linii porneste dintr-o frustrare simpla: tricourile streetwear sunt ori prea
              incarcate, ori prea anonime. Noi construim un mijloc purtabil: fit oversized, material
              dens si grafica plasata acolo unde chiar schimba silueta.
            </p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8 img-zoom bg-warm-grey">
            <img
              src={heroImg}
              alt="Trei Linii purtat in context urban"
              className="aspect-[4/5] w-full object-cover"
              loading="eager"
            />
          </div>
        </div>
      </section>

      <section className="px-5 md:px-10 py-20 md:py-32">
        <div className="mx-auto max-w-[1600px] grid md:grid-cols-3 gap-6">
          <div className="border-t border-border pt-6">
            <p className="font-mono-xs opacity-60">01 - De ce</p>
            <h2 className="mt-4 font-display text-3xl md:text-5xl">Un tricou de purtat des.</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Nu vrem piese care arata bine doar in poze. Vrem baza zilnica: materiale bune, croiala
              relaxata si suficienta identitate incat sa nu fie inca un tricou simplu.
            </p>
          </div>
          <div className="border-t border-border pt-6">
            <p className="font-mono-xs opacity-60">02 - Proces</p>
            <h2 className="mt-4 font-display text-3xl md:text-5xl">Fata curata, spate lucrat.</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Incepem cu forme simple, grid-uri si semne discrete. Daca grafica nu functioneaza pe
              spate fara sa strige, nu intra in colectie.
            </p>
          </div>
          <div className="border-t border-border pt-6">
            <p className="font-mono-xs opacity-60">03 - Look final</p>
            <h2 className="mt-4 font-display text-3xl md:text-5xl">Minimal, dar recognoscibil.</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Culori usor de purtat, printuri curate, fit oversized si lansari compacte. Fara
              reduceri permanente, fara zgomot inutil.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 md:px-10">
        <div className="mx-auto grid max-w-[1600px] gap-3 md:grid-cols-12 md:gap-6">
          <img
            src={lookbookOne}
            alt="Croiala oversized Trei Linii"
            className="md:col-span-5 aspect-[3/4] w-full object-cover bg-warm-grey"
            loading="lazy"
          />
          <img
            src={productDetail}
            alt="Detaliu design pe spate Trei Linii"
            className="md:col-span-4 aspect-[3/4] w-full object-cover bg-warm-grey md:mt-20"
            loading="lazy"
          />
          <img
            src={lookbookTwo}
            alt="Material dens si cadere relaxata"
            className="md:col-span-3 aspect-[3/4] w-full object-cover bg-warm-grey md:mt-40"
            loading="lazy"
          />
        </div>
      </section>

      <section className="px-5 md:px-10 py-20">
        <div className="mx-auto max-w-[1600px] border-t border-border pt-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <p className="font-display text-2xl md:text-3xl">Lansarea 01 este in pregatire.</p>
          <Link to="/shop" className="bg-charcoal text-cream px-6 py-3 font-mono-xs">
            Vezi modelele
          </Link>
        </div>
      </section>
    </div>
  );
}
