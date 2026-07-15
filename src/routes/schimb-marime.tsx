import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/LegalLayout";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/schimb-marime")({
  component: SchimbMarime,
  head: () =>
    pageMeta({
      path: "/schimb-marime",
      title: "Schimb mărime | Trei Linii",
      description: "Informații despre schimbul de mărime pentru tricourile Trei Linii.",
    }),
});

function SchimbMarime() {
  return (
    <LegalPage title="Schimb mărime">
      <LegalSection title="Cum funcționează">
        <p>
          Schimbul de mărime este posibil în limita stocului disponibil. Trimite o solicitare prin
          canalul de retur afișat pe site, cu numărul comenzii, mărimea primită și mărimea dorită.
        </p>
      </LegalSection>
      <LegalSection title="Condiții">
        <p>
          Produsul trimis pentru schimb trebuie să fie nepurtat, curat și fără urme de deteriorare.
          Dacă mărimea dorită nu mai este disponibilă, poți alege rambursarea sau un alt produs
          disponibil, după caz.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
