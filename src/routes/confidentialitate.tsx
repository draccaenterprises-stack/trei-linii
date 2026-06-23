import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/LegalLayout";
import { LEGAL, hasLegalBusinessDetails, legalBusinessFallback } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/confidentialitate")({
  component: Confidentialitate,
  head: () =>
    pageMeta({
      path: "/confidentialitate",
      title: "Politica de confidentialitate | Trei Linii",
      description:
        "Afla cum colecteaza si foloseste Trei Linii datele personale ale clientilor si vizitatorilor.",
    }),
});

function Confidentialitate() {
  const legalReady = hasLegalBusinessDetails();

  return (
    <LegalPage title="Politica de confidentialitate">
      <p>Ultima actualizare: {LEGAL.updatedAt}</p>
      <p>
        Aceasta politica explica modul in care Trei Linii colecteaza, foloseste si protejeaza datele
        personale ale vizitatorilor si clientilor.
      </p>

      <LegalSection title="1. Operatorul datelor">
        {legalReady ? (
          <p>
            Operatorul este {LEGAL.company}, CUI {LEGAL.cui}, cu sediul in {LEGAL.address}. Pentru
            solicitari privind datele personale, scrie la {LEGAL.email}.
          </p>
        ) : (
          <p>
            {legalBusinessFallback()} Pentru solicitari GDPR, scrie la {LEGAL.email}.
          </p>
        )}
      </LegalSection>

      <LegalSection title="2. Ce date colectam si de ce">
        <p>
          Putem colecta date de comanda si livrare, date de contact, date necesare procesarii
          platilor, date de suport, date pentru newsletter si date tehnice de navigare. Le folosim
          pentru executarea comenzilor, suport, obligatii legale, comunicari comerciale doar cu
          acordul tau si imbunatatirea site-ului.
        </p>
      </LegalSection>

      <LegalSection title="3. Furnizori si transferuri">
        <p>
          Putem folosi servicii precum Shopify, procesatori de plati, curieri, servicii de email si
          instrumente de analiza. Unii furnizori pot procesa date in afara UE, cu garantii adecvate.
        </p>
      </LegalSection>

      <LegalSection title="4. Drepturile tale">
        <p>
          Ai dreptul de acces, rectificare, stergere, restrictionare, portabilitate, opozitie si
          retragere a consimtamantului. Ne poti scrie la {LEGAL.email}. Ai si dreptul de a depune o
          plangere la{" "}
          <a
            href="https://www.dataprotection.ro/"
            className="underline underline-offset-4 hover:opacity-70"
            rel="noopener noreferrer"
          >
            ANSPDCP
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="5. Cookies">
        <p>
          Detalii despre cookies si cum le controlezi gasesti in pagina{" "}
          <Link to="/cookies" className="underline underline-offset-4 hover:opacity-70">
            Cookies
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
