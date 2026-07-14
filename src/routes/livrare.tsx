import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/LegalLayout";
import { LEGAL } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/livrare")({
  component: Livrare,
  head: () =>
    pageMeta({
      path: "/livrare",
      title: "Livrare | Trei Linii",
      description: "Informații despre livrare pentru comenzile Trei Linii.",
    }),
});

function Livrare() {
  return (
    <LegalPage title="Livrare">
      <LegalSection title="Termen și cost">
        <p>
          Livrarea se face prin {LEGAL.courier}. Termen estimativ: {LEGAL.deliveryTerm}. Costul
          livrării este {LEGAL.shippingCost} și va fi afișat în checkout înainte de finalizarea
          comenzii.
        </p>
      </LegalSection>
      <LegalSection title="Date corecte de livrare">
        <p>
          Clientul este responsabil pentru corectitudinea datelor de livrare. Dacă o comandă nu
          poate fi livrată din cauza datelor greșite sau incomplete, costurile suplimentare pot fi
          suportate de client.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
