import { createFileRoute, Link } from "@tanstack/react-router";
import {
  editorialConfluence as heroImg,
  editorialCounterweight as lookbookOne,
  editorialSharedBreath as lookbookTwo,
  editorialShiftedPlate as productDetail,
} from "@/lib/brand-images";
import { pageMeta } from "@/lib/seo";
import { ResponsiveImage } from "@/components/ResponsiveImage";

export const Route = createFileRoute("/about")({
  component: About,
  head: () =>
    pageMeta({
      path: "/about",
      title: "Despre - Trei Linii",
      description:
        "Trei Linii este un brand de streetwear minimal construit în jurul tricourilor și al graficii curate.",
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
              Simplu în față.
              <br />
              Memorabil
              <br />
              din spate.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Trei Linii pornește dintr-o idee simplă: un tricou poate rămâne discret în față și
              recognoscibil din spate. Construim piese ușor de purtat, cu grafică așezată acolo unde
              schimbă silueta.
            </p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8 img-zoom bg-warm-grey">
            <ResponsiveImage
              src={heroImg}
              alt="Trei Linii purtat în context urban"
              width={1200}
              height={1500}
              priority
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="aspect-[4/5] w-full object-cover"
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
              Nu vrem piese care arată bine doar în poze. Vrem o bază pentru fiecare zi: proporții
              relaxate și suficientă identitate încât să nu fie încă un tricou simplu.
            </p>
          </div>
          <div className="border-t border-border pt-6">
            <p className="font-mono-xs opacity-60">02 - Proces</p>
            <h2 className="mt-4 font-display text-3xl md:text-5xl">Față curată, spate lucrat.</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Începem cu forme simple, grile și semne discrete. Dacă grafica nu funcționează pe
              spate fără să strige, nu intră în colecție.
            </p>
          </div>
          <div className="border-t border-border pt-6">
            <p className="font-mono-xs opacity-60">03 - Look final</p>
            <h2 className="mt-4 font-display text-3xl md:text-5xl">Minimal, dar recognoscibil.</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Culori ușor de purtat, printuri curate și lansări compacte. Fără reduceri permanente,
              fără zgomot inutil.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 md:px-10">
        <div className="mx-auto grid max-w-[1600px] gap-3 md:grid-cols-12 md:gap-6">
          <ResponsiveImage
            src={lookbookOne}
            alt="Croiala oversized Trei Linii"
            width={1200}
            height={1600}
            sizes="(min-width: 768px) 42vw, 100vw"
            className="md:col-span-5 aspect-[3/4] w-full object-cover bg-warm-grey"
          />
          <ResponsiveImage
            src={productDetail}
            alt="Detaliu design pe spate Trei Linii"
            width={1200}
            height={1600}
            sizes="(min-width: 768px) 33vw, 100vw"
            className="md:col-span-4 aspect-[3/4] w-full object-cover bg-warm-grey md:mt-20"
          />
          <ResponsiveImage
            src={lookbookTwo}
            alt="Cadru editorial cu tricou Trei Linii"
            width={1200}
            height={1600}
            sizes="(min-width: 768px) 25vw, 100vw"
            className="md:col-span-3 aspect-[3/4] w-full object-cover bg-warm-grey md:mt-40"
          />
        </div>
      </section>

      <section className="px-5 md:px-10 py-20">
        <div className="mx-auto max-w-[1600px] border-t border-border pt-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <p className="font-display text-2xl md:text-3xl">Lansarea 01 este în pregătire.</p>
          <Link to="/shop" className="bg-charcoal text-cream px-6 py-3 font-mono-xs">
            Vezi modelele
          </Link>
        </div>
      </section>
    </div>
  );
}
