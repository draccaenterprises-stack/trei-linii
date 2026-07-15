import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/LegalLayout";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/sol")({
  component: Sol,
  head: () =>
    pageMeta({
      path: "/sol",
      title: "SOL/SAL | Trei Linii",
      description: "Informații despre soluționarea alternativă a litigiilor prin ANPC/SAL.",
    }),
});

function Sol() {
  return (
    <LegalPage title="SOL / SAL">
      <LegalSection title="Soluționare alternativă a litigiilor">
        <p>
          Platforma europeană ODR/SOL a fost închisă și nu mai este folosită pentru reclamații noi.
          Pentru soluționarea alternativă a litigiilor, consumatorii din România pot folosi
          procedurile SAL prin ANPC.
        </p>
        <p>
          Link oficial:{" "}
          <a
            href="https://anpc.ro/sal/"
            className="underline underline-offset-4 hover:opacity-70"
            target="_blank"
            rel="noopener noreferrer"
          >
            informații despre SAL prin ANPC
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
