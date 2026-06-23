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
      description: "Informatii despre livrare pentru comenzile Trei Linii.",
    }),
});

function Livrare() {
  return (
    <LegalPage title="Livrare">
      <LegalSection title="Termen si cost">
        <p>
          Livrarea se face prin {LEGAL.courier}. Termen estimativ: {LEGAL.deliveryTerm}. Costul
          livrarii este {LEGAL.shippingCost} si va fi afisat in checkout inainte de finalizarea
          comenzii.
        </p>
      </LegalSection>
      <LegalSection title="Date corecte de livrare">
        <p>
          Clientul este responsabil pentru corectitudinea datelor de livrare. Daca o comanda nu
          poate fi livrata din cauza datelor gresite sau incomplete, costurile suplimentare pot fi
          suportate de client.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
