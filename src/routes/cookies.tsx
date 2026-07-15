import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/LegalLayout";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/cookies")({
  component: Cookies,
  head: () =>
    pageMeta({
      path: "/cookies",
      title: "Cookies - Trei Linii",
      description: "Ce cookies folosim pe site-ul Trei Linii și cum le poți controla.",
    }),
});

function Cookies() {
  return (
    <LegalPage title="Cookies">
      <p>
        Cookies sunt fișiere mici salvate în browserul tău. Le folosim pentru funcționarea site-ului
        și, cu acordul tău, pentru a înțelege cum este folosit.
      </p>

      <LegalSection title="Cookies necesare">
        <p>
          Asigură funcții de bază: navigare, coș de cumpărături, formulare și reținerea opțiunii
          tale privind cookies. Fără ele site-ul nu funcționează corect, deci nu pot fi dezactivate.
        </p>
      </LegalSection>

      <LegalSection title="Cookies de analiză (opționale)">
        <p>
          Cu acordul tău, putem folosi Google Analytics pentru a măsura traficul și a îmbunătăți
          site-ul. Serviciul se încarcă numai dacă este configurat și ai acceptat categoria de
          analiză.
        </p>
      </LegalSection>

      <LegalSection title="Cookies de marketing (opționale)">
        <p>
          Cu acordul tău, putem folosi Meta Pixel pentru a măsura performanța campaniilor. Serviciul
          se încarcă numai dacă este configurat și ai acceptat categoria de marketing.
        </p>
      </LegalSection>

      <LegalSection title="Cum le controlezi">
        <p>
          Când intri prima dată, alegi din banner dacă accepți sau refuzi cookies opționale. Poți
          oricând redeschide preferințele din footer sau să le blochezi din setările browserului.
          Blocarea unora poate afecta experiența de navigare. Vezi și politica de{" "}
          <Link to="/confidentialitate" className="underline underline-offset-4 hover:opacity-70">
            confidențialitate
          </Link>
          .
        </p>
        <button
          type="button"
          className="border border-charcoal px-5 py-3 font-mono-xs hover:bg-charcoal hover:text-cream"
          onClick={() => window.dispatchEvent(new Event("trei-linii:cookie-settings"))}
        >
          Deschide preferințele
        </button>
      </LegalSection>
    </LegalPage>
  );
}
