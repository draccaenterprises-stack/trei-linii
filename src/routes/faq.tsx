import { createFileRoute, Link } from "@tanstack/react-router";
import { FAQAccordion } from "@/components/FAQAccordion";
import { useSite } from "@/lib/site-context";
import { pageMeta } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { serializeJsonLd } from "@/lib/schema";

const FAQ_SEO_ITEMS: Array<{ q: string; a: string }> = [
  {
    q: "Cum aleg mărimea?",
    a: "Consultă ghidul de mărimi și informațiile de croială de pe pagina produsului. Pentru o alegere sigură, compară dimensiunile cu un tricou pe care îl porți deja.",
  },
  {
    q: "Din ce material sunt tricourile?",
    a: "Materialul și compoziția pot varia între piese. Specificațiile exacte apar pe pagina fiecărui produs.",
  },
  {
    q: "Când se lansează modelele?",
    a: "Colecțiile sunt pregătite în serii compacte. Abonează-te la newsletter pentru informații despre stoc și lansări noi.",
  },
  {
    q: "Cum funcționează comanda?",
    a: "Când magazinul este activ, alegi varianta disponibilă, adaugi produsul în coș și finalizezi comanda în pagina de plată securizată.",
  },
];

export const Route = createFileRoute("/faq")({
  component: FAQPage,
  head: () => {
    const base = pageMeta({
      path: "/faq",
      title: "FAQ - Trei Linii",
      description: "Întrebări despre mărimi, materiale, livrare și retur.",
    });
    return {
      ...base,
      scripts: [
        {
          type: "application/ld+json",
          children: serializeJsonLd({
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
        <h1 className="font-display text-5xl md:text-8xl mt-2">Întrebări frecvente.</h1>
        <p className="mt-6 text-muted-foreground text-lg max-w-xl">
          Răspunsuri rapide despre croială, materiale, livrare și modul în care funcționează
          lansările.
        </p>
        <div className="mt-16">
          <FAQAccordion items={visibleFaqs} />
        </div>
        <div className="mt-14 border-t border-border pt-8">
          <p className="font-display text-3xl md:text-4xl">
            Ai alte întrebări?{" "}
            <Link
              to="/contact"
              className="text-accent-text underline decoration-1 underline-offset-4 hover:opacity-70"
            >
              Dă-ne un mail
            </Link>{" "}
            și vom răspunde cât se poate de repede.
          </p>
        </div>
      </div>
    </div>
  );
}
