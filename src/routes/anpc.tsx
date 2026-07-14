import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/LegalLayout";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/anpc")({
  component: Anpc,
  head: () =>
    pageMeta({
      path: "/anpc",
      title: "ANPC | Trei Linii",
      description: "Informații ANPC pentru consumatorii Trei Linii.",
    }),
});

function Anpc() {
  return (
    <LegalPage title="ANPC">
      <LegalSection title="Protecția consumatorilor">
        <p>
          Pentru orice problemă legată de o comandă, te rugăm să ne contactezi mai întâi prin pagina
          de contact. Dacă situația nu se rezolvă amiabil, consumatorii se pot adresa Autorității
          Naționale pentru Protecția Consumatorilor.
        </p>
        <p>
          Linkuri oficiale:{" "}
          <a
            href="https://anpc.ro/"
            className="underline underline-offset-4 hover:opacity-70"
            target="_blank"
            rel="noopener noreferrer"
          >
            anpc.ro
          </a>
          ,{" "}
          <a
            href="https://eservicii.anpc.ro/Depune-Cerere"
            className="underline underline-offset-4 hover:opacity-70"
            target="_blank"
            rel="noopener noreferrer"
          >
            depune reclamație ANPC
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
