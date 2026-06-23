import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/LegalLayout";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/anpc")({
  component: Anpc,
  head: () =>
    pageMeta({
      path: "/anpc",
      title: "ANPC | Trei Linii",
      description: "Informatii ANPC pentru consumatorii Trei Linii.",
    }),
});

function Anpc() {
  return (
    <LegalPage title="ANPC">
      <LegalSection title="Protectia consumatorilor">
        <p>
          Pentru orice problema legata de o comanda, te rugam sa ne contactezi mai intai prin pagina
          de contact. Daca situatia nu se rezolva amiabil, consumatorii se pot adresa Autoritatii
          Nationale pentru Protectia Consumatorilor.
        </p>
        <p>
          Linkuri utile:{" "}
          <a href="https://anpc.ro/" className="underline underline-offset-4 hover:opacity-70">
            anpc.ro
          </a>
          ,{" "}
          <a
            href="https://eservicii.anpc.ro/Depune-Cerere"
            className="underline underline-offset-4 hover:opacity-70"
          >
            depune cerere ANPC
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
