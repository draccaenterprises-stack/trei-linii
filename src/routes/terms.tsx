import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/LegalLayout";
import { LEGAL, hasLegalBusinessDetails, legalBusinessFallback } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  component: Terms,
  head: () =>
    pageMeta({
      path: "/terms",
      title: "Termeni si conditii - Trei Linii",
      description: "Termenii si conditiile de utilizare a magazinului Trei Linii.",
    }),
});

function Terms() {
  const legalDetailsReady = hasLegalBusinessDetails();

  return (
    <LegalPage title="Termeni si conditii">
      <p>
        Acesti termeni reglementeaza utilizarea site-ului Trei Linii si comenzile plasate prin
        magazinul online. Prin plasarea unei comenzi confirmi ca ai citit si acceptat acesti
        termeni.
      </p>

      <LegalSection title="1. Vanzator">
        {legalDetailsReady ? (
          <p>
            {LEGAL.company}, cu sediul in {LEGAL.address}, CUI {LEGAL.cui}, inregistrata la
            Registrul Comertului sub nr. {LEGAL.regCom}. Contact: {LEGAL.email}
            {LEGAL.phone ? `, telefon ${LEGAL.phone}` : ""}.
          </p>
        ) : (
          <p>
            {legalBusinessFallback()} Pentru intrebari de pre-lansare, scrie la {LEGAL.email}.
          </p>
        )}
      </LegalSection>

      <LegalSection title="2. Produse si preturi">
        <p>
          Preturile sunt exprimate in lei (RON) si includ TVA. Imaginile au caracter de prezentare;
          pot exista mici diferente de nuanta in functie de ecran. Ne rezervam dreptul de a
          actualiza preturile, stocul si disponibilitatea produselor.
        </p>
      </LegalSection>

      <LegalSection title="3. Comanda">
        <p>
          Comanda se considera incheiata in momentul in care primesti confirmarea pe email. Ne
          rezervam dreptul de a anula o comanda in caz de eroare de pret, lipsa stoc sau suspiciune
          de frauda, cu rambursarea integrala a sumelor platite.
        </p>
      </LegalSection>

      <LegalSection title="4. Plata">
        <p>
          Plata se face online, securizat, prin procesatorii folositi la finalizarea comenzii
          (Shopify Checkout). Nu stocam datele complete ale cardului tau.
        </p>
      </LegalSection>

      <LegalSection title="5. Livrare">
        <p>
          Metodele, termenele si costurile de livrare sunt afisate la finalizarea comenzii si pe
          pagina{" "}
          <Link to="/delivery" className="underline underline-offset-4 hover:opacity-70">
            Livrare
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="6. Dreptul de retragere (retur in 14 zile)">
        <p>
          Conform OUG nr. 34/2014, ai dreptul sa te retragi din contract in 14 zile de la primirea
          produsului, fara a invoca un motiv. Conditiile si pasii sunt descrisi pe pagina{" "}
          <Link to="/returns" className="underline underline-offset-4 hover:opacity-70">
            Retur
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="7. Conformitate si garantii">
        <p>
          Produsele beneficiaza de garantia legala de conformitate conform OUG nr. 140/2021. Daca
          produsul prezinta un defect, te rugam sa ne contactezi la {LEGAL.email}.
        </p>
      </LegalSection>

      <LegalSection title="8. Solutionarea litigiilor (ANPC / SOL)">
        <p>
          Poti apela la Autoritatea Nationala pentru Protectia Consumatorilor (
          <a
            href="https://anpc.ro"
            className="underline underline-offset-4 hover:opacity-70"
            rel="noopener noreferrer"
          >
            anpc.ro
          </a>
          ) sau la procedura SAL administrata de ANPC (
          <a
            href="https://reclamatiisal.anpc.ro/"
            className="underline underline-offset-4 hover:opacity-70"
            rel="noopener noreferrer"
          >
            reclamatiisal.anpc.ro
          </a>
          ). Platforma europeana ODR/SOL nu mai este folosita.
        </p>
      </LegalSection>

      <LegalSection title="9. Legislatie aplicabila">
        <p>
          Contractul este guvernat de legislatia romana. Pentru orice intrebare, scrie-ne la{" "}
          {LEGAL.email} sau prin pagina de{" "}
          <Link to="/contact" className="underline underline-offset-4 hover:opacity-70">
            contact
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
