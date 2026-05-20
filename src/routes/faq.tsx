import { createFileRoute } from "@tanstack/react-router";
import { FAQAccordion } from "@/components/FAQAccordion";

export const Route = createFileRoute("/faq")({
  component: FAQPage,
  head: () => ({
    meta: [
      { title: "FAQ — BLANK ATELIER" },
      { name: "description", content: "Fit, fabric, shipping, returns and drop schedule." },
    ],
  }),
});

function FAQPage() {
  return (
    <div className="px-5 md:px-10 py-12 md:py-20">
      <div className="mx-auto max-w-[1100px]">
        <p className="font-mono-xs opacity-60">FAQ</p>
        <h1 className="font-display text-5xl md:text-8xl mt-2">Asked often.</h1>
        <p className="mt-6 text-muted-foreground text-lg max-w-xl">
          Quick answers about fit, fabric, shipping and how our drops work.
        </p>
        <div className="mt-16">
          <FAQAccordion />
        </div>
      </div>
    </div>
  );
}
