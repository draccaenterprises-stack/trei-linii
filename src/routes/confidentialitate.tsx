import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/LegalLayout";
import { LEGAL, hasLegalBusinessDetails, legalBusinessFallback } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/confidentialitate")({
  component: Confidentialitate,
  head: () =>
    pageMeta({
      path: "/confidentialitate",
      title: "Politica de confidențialitate | Trei Linii",
      description:
        "Află cum colectează și folosește Trei Linii datele personale ale clienților și vizitatorilor.",
    }),
});

function Confidentialitate() {
  const legalReady = hasLegalBusinessDetails();

  return (
    <LegalPage title="Politica de confidențialitate">
      <p>
        Această politică explică modul în care Trei Linii colectează, folosește și protejează datele
        personale ale vizitatorilor și clienților.
      </p>

      <LegalSection title="1. Operatorul datelor">
        {legalReady ? (
          <p>
            Operatorul este {LEGAL.company}, CUI {LEGAL.cui}, cu sediul în {LEGAL.address}. Pentru
            solicitări privind datele personale, folosește adresa de contact afișată pe site.
          </p>
        ) : (
          <p>
            {legalBusinessFallback()} Canalul pentru solicitări GDPR va fi publicat înainte de
            activarea comenzilor.
          </p>
        )}
      </LegalSection>

      <LegalSection title="2. Ce date colectăm și de ce">
        <p>
          Putem colecta date de comandă și livrare, date de contact, date necesare procesării
          plăților, date de suport, date pentru newsletter și date tehnice de navigare. Le folosim
          pentru executarea comenzilor, suport, obligații legale, comunicări comerciale doar cu
          acordul tău și îmbunătățirea site-ului.
        </p>
      </LegalSection>

      <LegalSection title="3. Furnizori și transferuri">
        <p>
          Putem folosi servicii precum Shopify, procesatori de plăți, curieri, servicii de email și
          instrumente de analiză. Unii furnizori pot procesa date în afara UE, cu garanții adecvate.
        </p>
      </LegalSection>

      <LegalSection title="4. Drepturile tale">
        <p>
          Ai dreptul de acces, rectificare, ștergere, restricționare, portabilitate, opoziție și
          retragere a consimțământului. Ne poți contacta prin canalul afișat pe site. Ai și dreptul
          de a depune o plângere la{" "}
          <a
            href="https://www.dataprotection.ro/"
            className="underline underline-offset-4 hover:opacity-70"
            target="_blank"
            rel="noopener noreferrer"
          >
            ANSPDCP
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="5. Cookies">
        <p>
          Detalii despre cookies și cum le controlezi găsești în pagina{" "}
          <Link to="/cookies" className="underline underline-offset-4 hover:opacity-70">
            Cookies
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
