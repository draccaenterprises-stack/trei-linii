import { createFileRoute } from "@tanstack/react-router";
import { SizeGuideTable } from "@/components/SizeGuideTable";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/size-guide")({
  component: SizeGuide,
  head: () =>
    pageMeta({
      path: "/size-guide",
      title: "Ghid marimi - Trei Linii",
      description: "Ghid de marimi pentru tricouri oversized Trei Linii.",
    }),
});

function SizeGuide() {
  return (
    <main className="px-5 md:px-10 py-16 md:py-24">
      <article className="mx-auto max-w-4xl">
        <p className="font-mono-xs opacity-60">Fit</p>
        <h1 className="font-display text-5xl md:text-7xl mt-3">Ghid marimi</h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
          Tricourile sunt gandite oversized. Alege marimea normala pentru o cadere relaxata sau o
          marime mai mica pentru un fit mai apropiat de corp.
        </p>
        <div className="mt-12">
          <SizeGuideTable />
        </div>
        <p className="mt-6 font-mono-xs text-muted-foreground">
          Masuratori in cm, pe produs intins. Valorile sunt orientative pana la publicarea
          specificatiilor finale pentru fiecare model.
        </p>
      </article>
    </main>
  );
}
