import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/LegalLayout";
import { LEGAL } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/retur")({
  component: Retur,
  head: () =>
    pageMeta({
      path: "/retur",
      title: "Retur | Trei Linii",
      description: "Conditiile de retur pentru produsele Trei Linii.",
    }),
});

function Retur() {
  return (
    <LegalPage title="Retur">
      <LegalSection title="Drept de retragere">
        <p>
          Ai dreptul sa te retragi din contract in 14 zile calendaristice de la primirea produsului,
          fara a preciza motivul. Trimite solicitarea la {LEGAL.returnEmail}, cu numarul comenzii si
          produsul returnat.
        </p>
      </LegalSection>
      <LegalSection title="Conditii pentru produs">
        <ul className="list-disc space-y-1 pl-5">
          <li>produs nepurtat si curat;</li>
          <li>fara urme de miros, parfum, deodorant sau deteriorare;</li>
          <li>cu etichetele atasate, daca au fost livrate cu etichete;</li>
          <li>ambalat corespunzator pentru transport.</li>
        </ul>
      </LegalSection>
      <LegalSection title="Rambursare">
        <p>
          Rambursarea se face in termenul legal, dupa primirea si verificarea produselor returnate,
          prin aceeasi metoda de plata folosita la comanda, daca nu se agreeaza altfel.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
