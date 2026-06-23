import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/LegalLayout";
import { LEGAL } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/schimb-marime")({
  component: SchimbMarime,
  head: () =>
    pageMeta({
      path: "/schimb-marime",
      title: "Schimb marime | Trei Linii",
      description: "Informatii despre schimbul de marime pentru tricourile Trei Linii.",
    }),
});

function SchimbMarime() {
  return (
    <LegalPage title="Schimb marime">
      <LegalSection title="Cum functioneaza">
        <p>
          Schimbul de marime este posibil in limita stocului disponibil. Trimite o solicitare la{" "}
          {LEGAL.returnEmail}, cu numarul comenzii, marimea primita si marimea dorita.
        </p>
      </LegalSection>
      <LegalSection title="Conditii">
        <p>
          Produsul trimis pentru schimb trebuie sa fie nepurtat, curat si fara urme de deteriorare.
          Daca marimea dorita nu mai este disponibila, poti alege rambursarea sau un alt produs
          disponibil, dupa caz.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
