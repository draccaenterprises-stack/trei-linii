import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import heroImg from "@/assets/hero.jpg";
import lookbookOne from "@/assets/lookbook-1.jpg";
import lookbookThree from "@/assets/lookbook-3.jpg";
import { formatRON } from "@/lib/format";
import { fetchProducts } from "@/lib/shopify";
import { pageMeta } from "@/lib/seo";

const principles = [
  {
    number: "01",
    title: "Fata ramane curata.",
    text: "Fara logo mare si fara un mesaj care sa-ti poarte tricoul in locul tau. Prima impresie ramane despre croiala, material si felul in care il porti.",
  },
  {
    number: "02",
    title: "Spatele poarta ideea.",
    text: "Am ales un singur loc pentru grafica. Acolo poate fi vazuta fara sa transforme piesa intr-un panou si fara sa incarce partea din fata.",
  },
  {
    number: "03",
    title: "Materialul tine linia.",
    text: "Bumbacul de 240gsm da greutate croielii oversized si pastreaza forma. Printul vine dupa material, niciodata inaintea lui.",
  },
] as const;

const differences = [
  {
    title: "Croiala inainte de logo",
    text: "Un tricou bun trebuie sa functioneze si fara grafica. De aceea proportia, umarul si caderea sunt punctul de plecare.",
  },
  {
    title: "Colectii, nu flux infinit",
    text: "Fiecare colectie are o directie si un numar limitat de piese. Mai putine alegeri, dar fiecare cu un motiv clar sa existe.",
  },
  {
    title: "Simplu, nu anonim",
    text: "Minimal nu inseamna gol. Linia roz, compozitia de pe spate si materialul dens fac piesa recognoscibila fara sa o faca zgomotoasa.",
  },
] as const;

export const Route = createFileRoute("/manifest")({
  loader: async () => {
    const products = await fetchProducts();
    return { products: products.slice(0, 3) };
  },
  component: Manifest,
  head: () =>
    pageMeta({
      path: "/manifest",
      title: "De ce Trei Linii - Manifest",
      description:
        "De ce am creat Trei Linii: tricouri oversized din bumbac dens, cu fata curata, design pe spate si colectii construite cu intentie.",
    }),
});

function Manifest() {
  const { products } = Route.useLoaderData();

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".manifest-reveal"));
    if (!nodes.length) return undefined;

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
        <img
          src={lookbookOne}
          alt="Modele purtand tricouri oversized Trei Linii"
          className="manifest-hero-image absolute inset-0 h-full w-full object-cover object-[50%_36%]"
          decoding="async"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-charcoal/55" />

        <div className="relative mx-auto grid w-full max-w-[1600px] gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="font-mono-xs text-cream/65">Manifest / Bucuresti</p>
            <h1 className="mt-5 font-display text-6xl leading-[0.92] md:text-8xl lg:text-9xl">
              De ce
              <br />
              <span className="italic text-[#ff006f]">Trei Linii.</span>
            </h1>
          </div>
          <div className="md:col-span-4">
            <p className="max-w-lg text-base leading-relaxed text-cream/82 md:text-lg">
              Pentru ca nu gaseam tricoul simplu pe care voiam sa-l purtam: dens, oversized si fara
              un logo mare pe piept. Asa ca l-am construit.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex min-h-12 items-center bg-cream px-5 font-mono-xs text-charcoal transition-[background-color,color,transform] hover:-translate-y-0.5 hover:bg-[#ff006f] hover:text-cream"
              >
                Vezi colectiile
              </Link>
              <a
                href="#poveste"
                className="inline-flex min-h-12 items-center border border-cream/50 px-5 font-mono-xs text-cream transition-colors hover:border-cream hover:bg-cream hover:text-charcoal"
              >
                Citeste povestea
              </a>
            </div>
          </div>
        </div>

        <ThreeLineSignature className="absolute bottom-8 right-5 w-32 md:right-10 md:w-44" />
      </section>

      <section id="poveste" className="scroll-mt-20 px-5 py-20 md:px-10 md:py-32">
        <div className="manifest-reveal mx-auto grid max-w-[1600px] gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="font-mono-xs text-[#ff006f]">Punctul de plecare</p>
            <h2 className="mt-5 max-w-5xl font-display text-5xl leading-[0.97] md:text-7xl">
              Nu voiam sa alegem intre simplu si memorabil.
            </h2>
          </div>
          <div className="space-y-6 text-base leading-relaxed text-muted-foreground md:col-span-4 md:col-start-9 md:text-lg">
            <p>
              Trei Linii porneste dintr-o frustrare simpla. Tricourile care aveau croiala potrivita
              cereau prea multa atentie. Cele curate dispareau complet in tinuta.
            </p>
            <p>
              Am pastrat linistea in fata si am mutat ideea pe spate. Apoi am construit in jurul ei
              o croiala oversized si un material suficient de dens incat piesa sa stea bine si fara
              print.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-cream/45 px-5 py-20 md:px-10 md:py-28">
        <div className="manifest-reveal mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-12 lg:items-center">
          <figure className="overflow-hidden bg-warm-grey lg:col-span-6">
            <img
              src={heroImg}
              alt="Croiala oversized Trei Linii vazuta in purtare"
              className="aspect-[4/5] w-full object-cover transition-transform duration-[1400ms] hover:scale-[1.025]"
              decoding="async"
              loading="lazy"
            />
          </figure>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="font-mono-xs opacity-55">Regula casei</p>
            <h2 className="mt-5 font-display text-5xl leading-[0.96] md:text-7xl">
              Fata nu cere atentia.
              <br />
              <span className="italic text-[#ff006f]">Spatele o merita.</span>
            </h2>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Nu am ascuns identitatea brandului. Am ales sa nu o punem in locul cel mai usor. Din
              fata vezi piesa si omul care o poarta. Din spate incepe povestea.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 md:px-10 md:py-32">
        <div className="mx-auto max-w-[1600px]">
          <div className="manifest-reveal grid gap-8 border-b border-border pb-12 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="font-mono-xs opacity-55">Trei decizii</p>
              <h2 className="mt-5 font-display text-5xl leading-[0.96] md:text-7xl">
                Diferenta nu sta intr-un slogan.
              </h2>
            </div>
            <p className="text-base leading-relaxed text-muted-foreground md:col-span-4 md:col-start-9">
              Sta in ordinea in care luam deciziile: mai intai piesa, apoi designul, abia la final
              semnatura.
            </p>
          </div>

          <div className="manifest-reveal">
            {principles.map((principle) => (
              <article
                key={principle.number}
                className="grid gap-5 border-b border-border py-10 md:grid-cols-12 md:items-start md:py-14"
              >
                <p className="font-mono-xs text-[#ff006f] md:col-span-2">{principle.number}</p>
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
            <p className="font-mono-xs text-[#ff006f]">De ce suntem diferiti</p>
            <h2 className="mt-6 max-w-5xl font-display text-5xl leading-[0.96] md:text-7xl">
              Nu facem zgomot ca sa fim vazuti. Facem piese pe care vrei sa le porti.
            </h2>
          </div>
          <div className="md:col-span-3 md:col-start-10">
            <ThreeLineSignature className="w-full" />
            <p className="mt-8 text-sm leading-relaxed text-cream/65">
              Doua linii tin structura. Linia roz este alegerea care rupe ritmul si semneaza fiecare
              colectie.
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
                <p className="font-mono-xs text-[#ff006f]">0{index + 1}</p>
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
                <p className="font-mono-xs opacity-55">Manifestul, purtat</p>
                <h2 className="mt-4 font-display text-5xl leading-[0.96] md:text-7xl">
                  Alege prima piesa.
                </h2>
              </div>
              <Link
                to="/shop"
                className="inline-flex w-fit font-mono-xs text-[#ff006f] underline underline-offset-4"
              >
                Vezi toate colectiile
              </Link>
            </div>

            <div className="manifest-reveal mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product, index) => (
                <Link
                  key={product.id}
                  to="/product/$handle"
                  params={{ handle: product.handle }}
                  className="group block"
                >
                  <figure className="overflow-hidden bg-warm-grey">
                    <img
                      src={product.images[1] ?? product.images[0]}
                      alt={product.title}
                      className="aspect-[3/4] w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                      decoding="async"
                      loading="lazy"
                    />
                  </figure>
                  <div className="mt-4 flex items-start justify-between gap-4 border-t border-border pt-4">
                    <div>
                      <p className="font-mono-xs opacity-45">
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
        <img
          src={lookbookThree}
          alt="Tricou Trei Linii in context urban"
          className="absolute inset-0 h-full w-full object-cover object-center"
          decoding="async"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-charcoal/62" />
        <div className="manifest-reveal relative mx-auto grid w-full max-w-[1600px] gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="font-mono-xs text-[#ff006f]">Trei Linii / de aici incepe</p>
            <h2 className="mt-5 font-display text-5xl leading-[0.94] md:text-7xl">
              Simplu in fata.
              <br />
              <span className="italic">Al tau in spate.</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 md:col-span-4 md:justify-end">
            <Link
              to="/shop"
              className="inline-flex min-h-12 items-center bg-cream px-5 font-mono-xs text-charcoal transition-colors hover:bg-[#ff006f] hover:text-cream"
            >
              Intra in shop
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
      <span className="h-px w-[88%] bg-[#ff006f]" />
    </div>
  );
}
