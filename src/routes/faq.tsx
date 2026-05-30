import { createFileRoute } from "@tanstack/react-router";
import { FAQAccordion } from "@/components/FAQAccordion";
import { useSite } from "@/lib/site-context";

export const Route = createFileRoute("/faq")({
  component: FAQPage,
  head: () => ({
    meta: [
      { title: "FAQ - Trei Linii" },
      { name: "description", content: "Intrebari despre marimi, materiale, livrare si retur." },
    ],
  }),
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
