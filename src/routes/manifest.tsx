import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  editorialSharedBreath as heroImg,
  editorialShiftedPlate as lookbookOne,
  editorialConfluence as lookbookThree,
} from "@/lib/brand-images";
import type { Product } from "@/lib/catalog-types";
import { formatRON } from "@/lib/format";
import { productRepository } from "@/lib/product-repository";
import { pageMeta } from "@/lib/seo";
import { ResponsiveImage } from "@/components/ResponsiveImage";

const principles = [
  {
    number: "01",
    title: "Fața rămâne curată.",
    text: "Fără logo mare și fără un mesaj care să-ți poarte tricoul în locul tău. Prima impresie rămâne despre proporție, material și felul în care îl porți.",
  },
  {
    number: "02",
    title: "Spatele poartă ideea.",
    text: "Am ales un singur loc pentru grafică. Acolo poate fi văzută fără să transforme piesa într-un panou și fără să încarce partea din față.",
  },
  {
    number: "03",
    title: "Materialul ține linia.",
    text: "Materialul dă structură piesei. Compoziția și specificațiile exacte rămân pe pagina fiecărui produs; printul vine după material, niciodată înaintea lui.",
  },
] as const;

const differences = [
  {
    title: "Croiala înainte de logo",
    text: "Un tricou bun trebuie să funcționeze și fără grafică. De aceea proporția, umărul și căderea sunt punctul de plecare.",
  },
  {
    title: "Colecții, nu flux infinit",
    text: "Fiecare colecție are o direcție și un număr clar de piese. Mai puține alegeri, dar fiecare cu un motiv să existe.",
  },
  {
    title: "Simplu, nu anonim",
    text: "Minimal nu înseamnă gol. Linia roz și compoziția de pe spate fac piesa recognoscibilă fără să o facă zgomotoasă.",
  },
] as const;

export const Route = createFileRoute("/manifest")({
  loader: async () => {
    const products = await productRepository.listProducts();
    return { products: products.slice(0, 3) };
  },
  component: Manifest,
  head: () =>
    pageMeta({
      path: "/manifest",
      title: "De ce Trei Linii - Manifest",
      description:
        "De ce am creat Trei Linii: tricouri cu fața curată, design pe spate și colecții construite cu intenție.",
    }),
});

function Manifest() {
  const { products } = Route.useLoaderData();

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".manifest-reveal"));
    if (!nodes.length) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return undefined;
    }

    document.documentElement.classList.add("motion-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden bg-charcoal px-5 pb-12 pt-24 text-cream md:min-h-[82svh] md:px-10 md:pb-16">
        <ResponsiveImage
          src={lookbookOne}
          alt="Modele purtând tricouri Trei Linii"
          width={1600}
          height={1200}
          priority
          sizes="100vw"
          className="manifest-hero-image absolute inset-0 h-full w-full object-cover object-[50%_36%]"
        />
        <div className="absolute inset-0 bg-charcoal/55" />

        <div className="relative mx-auto grid w-full max-w-[1600px] gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="font-mono-xs text-cream/65">Manifest / București</p>
            <h1 className="mt-5 font-display text-6xl leading-[0.92] md:text-8xl lg:text-9xl">
              De ce
              <br />
              <span className="italic text-accent-text">Trei Linii.</span>
            </h1>
          </div>
          <div className="md:col-span-4">
            <p className="max-w-lg text-base leading-relaxed text-cream/82 md:text-lg">
              Pentru că nu găseam tricoul simplu pe care voiam să-l purtăm: cu proporții relaxate,
              față curată și identitate în spate. Așa că am început să-l construim.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex min-h-12 items-center bg-cream px-5 font-mono-xs text-charcoal transition-[background-color,color,transform] hover:-translate-y-0.5 hover:bg-signature hover:text-cream"
              >
                Vezi colecțiile
              </Link>
              <a
                href="#poveste"
                className="inline-flex min-h-12 items-center border border-cream/50 px-5 font-mono-xs text-cream transition-colors hover:border-cream hover:bg-cream hover:text-charcoal"
              >
                Citește povestea
              </a>
            </div>
          </div>
        </div>

        <ThreeLineSignature className="absolute bottom-8 right-5 w-32 md:right-10 md:w-44" />
      </section>

      <section id="poveste" className="scroll-mt-20 px-5 py-20 md:px-10 md:py-32">
        <div className="manifest-reveal mx-auto grid max-w-[1600px] gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="font-mono-xs text-accent-text">Punctul de plecare</p>
            <h2 className="mt-5 max-w-5xl font-display text-5xl leading-[0.97] md:text-7xl">
              Nu voiam să alegem între simplu și memorabil.
            </h2>
          </div>
          <div className="space-y-6 text-base leading-relaxed text-muted-foreground md:col-span-4 md:col-start-9 md:text-lg">
            <p>
              Trei Linii pornește dintr-o observație simplă. Tricourile cu o prezență puternică
              cereau prea multă atenție. Cele curate dispăreau complet în ținută.
            </p>
            <p>
              Am păstrat liniștea în față și am mutat ideea pe spate. În jurul ei construim
              proporția, materialul și detaliile fiecărei piese, explicate transparent pe pagina de
              produs.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-cream/45 px-5 py-20 md:px-10 md:py-28">
        <div className="manifest-reveal mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-12 lg:items-center">
          <figure className="overflow-hidden bg-warm-grey lg:col-span-6">
            <ResponsiveImage
              src={heroImg}
              alt="Croiala Trei Linii văzută în purtare"
              width={1200}
              height={1500}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="aspect-[4/5] w-full object-cover transition-transform duration-[1400ms] hover:scale-[1.025]"
            />
          </figure>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="font-mono-xs text-muted-foreground">Regula casei</p>
            <h2 className="mt-5 font-display text-5xl leading-[0.96] md:text-7xl">
              Fața nu cere atenția.
              <br />
              <span className="italic text-accent-text">Spatele o merită.</span>
            </h2>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Nu am ascuns identitatea brandului. Am ales să nu o punem în locul cel mai ușor. Din
              față vezi piesa și omul care o poartă. Din spate începe povestea.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 md:px-10 md:py-32">
        <div className="mx-auto max-w-[1600px]">
          <div className="manifest-reveal grid gap-8 border-b border-border pb-12 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="font-mono-xs text-muted-foreground">Trei decizii</p>
              <h2 className="mt-5 font-display text-5xl leading-[0.96] md:text-7xl">
                Diferența nu stă într-un slogan.
              </h2>
            </div>
            <p className="text-base leading-relaxed text-muted-foreground md:col-span-4 md:col-start-9">
              Stă în ordinea în care luăm deciziile: mai întâi piesa, apoi designul, abia la final
              semnătura.
            </p>
          </div>

          <div className="manifest-reveal">
            {principles.map((principle) => (
              <article
                key={principle.number}
                className="grid gap-5 border-b border-border py-10 md:grid-cols-12 md:items-start md:py-14"
              >
                <p className="font-mono-xs text-accent-text md:col-span-2">{principle.number}</p>
                <h3 className="font-display text-4xl leading-none md:col-span-5 md:text-5xl">
                  {principle.title}
                </h3>
                <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:col-span-4 md:col-start-9 md:text-base">
                  {principle.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-charcoal px-5 py-20 text-cream md:px-10 md:py-32">
        <div className="manifest-reveal mx-auto grid max-w-[1600px] gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-8">
            <p className="font-mono-xs text-accent-text">De ce suntem diferiți</p>
            <h2 className="mt-6 max-w-5xl font-display text-5xl leading-[0.96] md:text-7xl">
              Nu facem zgomot ca să fim văzuți. Facem piese pe care vrei să le porți.
            </h2>
          </div>
          <div className="md:col-span-3 md:col-start-10">
            <ThreeLineSignature className="w-full" />
            <p className="mt-8 text-sm leading-relaxed text-cream/65">
              Două linii țin structura. Linia roz este alegerea care rupe ritmul și semnează fiecare
              colecție.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 md:px-10 md:py-32">
        <div className="mx-auto max-w-[1600px]">
          <div className="manifest-reveal grid gap-8 md:grid-cols-3 md:gap-0">
            {differences.map((difference, index) => (
              <article
                key={difference.title}
                className="border-t border-border pt-7 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
              >
                <p className="font-mono-xs text-accent-text">0{index + 1}</p>
                <h3 className="mt-6 font-display text-3xl leading-tight md:text-4xl">
                  {difference.title}
                </h3>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                  {difference.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {products.length > 0 && (
        <section className="border-y border-border bg-cream/45 px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-[1600px]">
            <div className="manifest-reveal flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-mono-xs text-muted-foreground">Manifestul, purtat</p>
                <h2 className="mt-4 font-display text-5xl leading-[0.96] md:text-7xl">
                  Alege prima piesă.
                </h2>
              </div>
              <Link
                to="/shop"
                className="inline-flex w-fit font-mono-xs text-accent-text underline underline-offset-4"
              >
                Vezi toate colecțiile
              </Link>
            </div>

            <div className="manifest-reveal mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product: Product, index: number) => (
                <Link
                  key={product.id}
                  to="/product/$handle"
                  params={{ handle: product.handle }}
                  className="group block"
                >
                  <figure className="overflow-hidden bg-warm-grey">
                    <ResponsiveImage
                      src={product.images[1] ?? product.images[0]}
                      alt={product.title}
                      width={1200}
                      height={1600}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="aspect-[3/4] w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                    />
                  </figure>
                  <div className="mt-4 flex items-start justify-between gap-4 border-t border-border pt-4">
                    <div>
                      <p className="font-mono-xs text-muted-foreground">
                        Piesa {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-2 font-display text-2xl leading-none">{product.title}</h3>
                    </div>
                    <p className="text-sm tabular-nums">{formatRON(product.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="relative isolate flex min-h-[66svh] items-end overflow-hidden bg-charcoal px-5 py-14 text-cream md:px-10 md:py-20">
        <ResponsiveImage
          src={lookbookThree}
          alt="Tricou olive Trei Linii fotografiat din spate în context urban"
          width={1600}
          height={1200}
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-charcoal/62" />
        <div className="manifest-reveal relative mx-auto grid w-full max-w-[1600px] gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="font-mono-xs text-accent-text">Trei Linii / de aici începe</p>
            <h2 className="mt-5 font-display text-5xl leading-[0.94] md:text-7xl">
              Simplu în față.
              <br />
              <span className="italic">Al tău în spate.</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 md:col-span-4 md:justify-end">
            <Link
              to="/shop"
              className="inline-flex min-h-12 items-center bg-cream px-5 font-mono-xs text-charcoal transition-colors hover:bg-signature hover:text-cream"
            >
              Intră în shop
            </Link>
            <Link
              to="/lookbook"
              className="inline-flex min-h-12 items-center border border-cream/50 px-5 font-mono-xs text-cream transition-colors hover:bg-cream hover:text-charcoal"
            >
              Vezi lookbook
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ThreeLineSignature({ className = "" }: { className?: string }) {
  return (
    <div className={`grid gap-2 ${className}`} aria-hidden="true">
      <span className="h-px w-full bg-current" />
      <span className="h-px w-[72%] bg-current" />
      <span className="h-px w-[88%] bg-signature" />
    </div>
  );
}
