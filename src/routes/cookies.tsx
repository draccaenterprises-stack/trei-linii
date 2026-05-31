import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/LegalLayout";

export const Route = createFileRoute("/cookies")({
  component: Cookies,
  head: () => ({
    meta: [
      { title: "Cookies - Trei Linii" },
      {
        name: "description",
        content: "Ce cookies folosim pe site-ul Trei Linii si cum le poti controla.",
      },
    ],
  }),
});

function Cookies() {
  return (
    <LegalPage title="Cookies">
      <p>
        Cookies sunt fisiere mici salvate in browserul tau. Le folosim pentru functionarea site-ului
        si, cu acordul tau, pentru a intelege cum este folosit.
      </p>

      <LegalSection title="Cookies necesare">
        <p>
          Asigura functii de baza: navigare, cos de cumparaturi, formulare, retinerea optiunii tale
          privind cookies. Fara ele site-ul nu functioneaza corect, deci nu pot fi dezactivate.
        </p>
      </LegalSection>

      <LegalSection title="Cookies de analiza (optionale)">
        <p>
          Cu acordul tau, folosim Google Analytics pentru a masura traficul si a imbunatati site-ul.
          Datele sunt agregate si ne ajuta sa intelegem ce pagini sunt utile.
        </p>
      </LegalSection>

      <LegalSection title="Cookies de marketing (optionale)">
        <p>
          Cu acordul tau, folosim Meta Pixel pentru a masura performanta si, pe viitor, pentru
          reclame relevante pe Facebook si Instagram.
        </p>
      </LegalSection>

      <LegalSection title="Cum le controlezi">
        <p>
          Cand intri prima data, alegi din banner daca accepti sau refuzi cookies optionale. Poti
          oricand sa stergi cookies sau sa le blochezi din setarile browserului. Blocarea unora
          poate afecta experienta de navigare. Vezi si politica de{" "}
          <Link to="/privacy" className="underline underline-offset-4 hover:opacity-70">
            confidentialitate
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
