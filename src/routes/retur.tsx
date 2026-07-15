import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/LegalLayout";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/retur")({
  component: Retur,
  head: () =>
    pageMeta({
      path: "/retur",
      title: "Retur | Trei Linii",
      description: "Condițiile de retur pentru produsele Trei Linii.",
    }),
});

function Retur() {
  return (
    <LegalPage title="Retur">
      <LegalSection title="Drept de retragere">
        <p>
          Ai dreptul să te retragi din contract în 14 zile calendaristice de la primirea produsului,
          fără a preciza motivul. Trimite solicitarea prin canalul de retur afișat pe site, cu
          numărul comenzii și produsul returnat.
        </p>
      </LegalSection>
      <LegalSection title="Condiții pentru produs">
        <ul className="list-disc space-y-1 pl-5">
          <li>produs nepurtat si curat;</li>
          <li>fără urme de miros, parfum, deodorant sau deteriorare;</li>
          <li>cu etichetele atașate, dacă au fost livrate cu etichete;</li>
          <li>ambalat corespunzator pentru transport.</li>
        </ul>
      </LegalSection>
      <LegalSection title="Rambursare">
        <p>
          Rambursarea se face în termenul legal, după primirea și verificarea produselor returnate,
          prin aceeași metodă de plată folosită la comandă, dacă nu se agreează altfel.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
