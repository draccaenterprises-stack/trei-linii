import { createFileRoute } from "@tanstack/react-router";
import { SizeGuideTable } from "@/components/SizeGuideTable";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/size-guide")({
  component: SizeGuide,
  head: () =>
    pageMeta({
      path: "/size-guide",
      title: "Ghid de mărimi - Trei Linii",
      description: "Cum alegi și compari mărimea unui tricou Trei Linii.",
    }),
});

function SizeGuide() {
  return (
    <div className="px-5 py-16 md:px-10 md:py-24">
      <article className="mx-auto max-w-4xl">
        <p className="font-mono-xs opacity-60">Fit</p>
        <h1 className="font-display text-5xl md:text-7xl mt-3">Ghid de mărimi</h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
          Croiala poate varia de la o piesă la alta. Verifică variantele și măsurătorile publicate
          pe pagina produsului, apoi compară-le cu un tricou care îți vine bine.
        </p>
        <div className="mt-12">
          <SizeGuideTable />
        </div>
        <p className="mt-6 font-mono-xs text-muted-foreground">
          Măsurătorile exacte trebuie verificate pe pagina produsului înainte de comandă.
        </p>
      </article>
    </div>
  );
}
