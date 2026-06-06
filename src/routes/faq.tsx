import { createFileRoute } from "@tanstack/react-router";
import { FAQAccordion } from "@/components/FAQAccordion";
import { useSite } from "@/lib/site-context";
import { pageMeta } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

const FAQ_SEO_ITEMS: Array<{ q: string; a: string }> = [
  {
    q: "Cum aleg marimea?",
    a: "Tricourile sunt gandite oversized. Alege marimea normala pentru un fit relaxat sau o marime mai mica pentru o cadere mai apropiata de corp.",
  },
  {
    q: "Din ce material sunt tricourile?",
    a: "Bumbac 100%, material dens de 240 g/mp, cu textura stabila si cadere curata. Gramajul apare si pe pagina fiecarui produs.",
  },
  {
    q: "Cand se lanseaza primele modele?",
    a: "Colectia este pregatita in serii compacte. Lasa emailul pentru update-uri despre stoc si drop-uri noi.",
  },
  {
    q: "Cum va functiona comanda?",
    a: "Cand magazinul este activ, alegi marimea, adaugi produsul in cos si finalizezi comanda prin plata securizata.",
  },
];

export const Route = createFileRoute("/faq")({
  component: FAQPage,
  head: () => {
    const base = pageMeta({
      path: "/faq",
      title: "FAQ - Trei Linii",
      description: "Intrebari despre marimi, materiale, livrare si retur.",
    });
    return {
      ...base,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            url: `${SITE_URL}/faq`,
            mainEntity: FAQ_SEO_ITEMS.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          }),
        },
      ],
    };
  },
});

function FAQPage() {
  const { faqItems } = useSite();
  const visibleFaqs = faqItems.filter((item) => item.enabled);

  return (
    <div className="px-5 md:px-10 py-12 md:py-20">
      <div className="mx-auto max-w-[1100px]">
        <p className="font-mono-xs opacity-60">FAQ</p>
        <h1 className="font-display text-5xl md:text-8xl mt-2">Intrebari frecvente.</h1>
        <p className="mt-6 text-muted-foreground text-lg max-w-xl">
          Raspunsuri rapide despre croiala, material, livrare si modul in care vor functiona
          lansarile.
        </p>
        <div className="mt-16">
          <FAQAccordion items={visibleFaqs} />
        </div>
      </div>
    </div>
  );
}
