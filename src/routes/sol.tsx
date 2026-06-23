import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/LegalLayout";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/sol")({
  component: Sol,
  head: () =>
    pageMeta({
      path: "/sol",
      title: "SOL/SAL | Trei Linii",
      description: "Informatii despre solutionarea alternativa a litigiilor prin ANPC/SAL.",
    }),
});

function Sol() {
  return (
    <LegalPage title="SOL / SAL">
      <LegalSection title="Solutionare alternativa a litigiilor">
        <p>
          Platforma europeana ODR/SOL a fost inchisa si nu mai este folosita pentru reclamatii noi.
          Pentru solutionarea alternativa a litigiilor, consumatorii din Romania pot folosi
          procedurile SAL prin ANPC.
        </p>
        <p>
          Link util:{" "}
          <a
            href="https://reclamatiisal.anpc.ro/"
            className="underline underline-offset-4 hover:opacity-70"
          >
            reclamatiisal.anpc.ro
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
