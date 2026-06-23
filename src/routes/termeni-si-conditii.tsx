import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/LegalLayout";
import { LEGAL, hasLegalBusinessDetails, legalBusinessFallback } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/termeni-si-conditii")({
  component: TermsRo,
  head: () =>
    pageMeta({
      path: "/termeni-si-conditii",
      title: "Termeni si conditii | Trei Linii",
      description:
        "Termenii si conditiile pentru folosirea site-ului Trei Linii si plasarea comenzilor online.",
    }),
});

function TermsRo() {
  const legalReady = hasLegalBusinessDetails();

  return (
    <LegalPage title="Termeni si conditii">
      <p>Ultima actualizare: {LEGAL.updatedAt}</p>
      <p>
        Bine ai venit pe {LEGAL.domain}, magazinul online al brandului {LEGAL.brand}. Prin accesarea
        site-ului sau plasarea unei comenzi, confirmi ca ai citit si accepti acesti termeni.
      </p>

      <LegalSection title="1. Datele comerciantului">
        {legalReady ? (
          <ul className="list-disc space-y-1 pl-5">
            <li>Denumire: {LEGAL.company}</li>
            <li>Brand comercial: {LEGAL.brand}</li>
            <li>CUI: {LEGAL.cui}</li>
            <li>Nr. Reg. Com.: {LEGAL.regCom}</li>
            <li>Sediu social: {LEGAL.address}</li>
            <li>Email contact: {LEGAL.email}</li>
            {LEGAL.phone && <li>Telefon: {LEGAL.phone}</li>}
          </ul>
        ) : (
          <p>{legalBusinessFallback()}</p>
        )}
      </LegalSection>

      <LegalSection title="2. Produse, preturi si comenzi">
        <p>
          Trei Linii comercializeaza articole vestimentare, in principal tricouri oversized cu
          design minimalist aplicat pe spate. Preturile sunt afisate in RON, iar costul livrarii
          este afisat separat in checkout, inainte de finalizarea comenzii.
        </p>
        <p>
          Ne rezervam dreptul de a modifica preturile, promotiile si disponibilitatea produselor
          fara notificare prealabila. Pretul aplicabil unei comenzi este cel afisat in momentul
          plasarii comenzii.
        </p>
      </LegalSection>

      <LegalSection title="3. Plata si livrarea">
        <p>
          Plata se face prin metodele afisate in checkout. Platile online sunt procesate securizat
          prin {LEGAL.paymentProcessor}; Trei Linii nu stocheaza datele complete ale cardului.
        </p>
        <p>
          Livrarea se face prin {LEGAL.courier}. Termen estimativ: {LEGAL.deliveryTerm}. Costul
          livrarii: {LEGAL.shippingCost}.
        </p>
      </LegalSection>

      <LegalSection title="4. Retur si schimb de marime">
        <p>
          Consumatorul are dreptul sa se retraga din contract in termen de 14 zile calendaristice de
          la primirea produsului, fara a preciza motivul. Produsul returnat trebuie sa fie nepurtat,
          curat, fara urme de miros sau deteriorare si cu etichetele atasate, daca au fost livrate
          cu etichete.
        </p>
        <p>
          Pentru retur sau schimb de marime, trimite o solicitare la {LEGAL.returnEmail}. Vezi si
          paginile{" "}
          <Link to="/retur" className="underline underline-offset-4 hover:opacity-70">
            Retur
          </Link>{" "}
          si{" "}
          <Link to="/schimb-marime" className="underline underline-offset-4 hover:opacity-70">
            Schimb marime
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="5. Reclamatii si solutionarea litigiilor">
        <p>
          Pentru orice problema legata de comanda, produs, livrare, retur sau plata, contacteaza-ne
          mai intai la {LEGAL.email}. Daca problema nu se rezolva amiabil, consumatorii se pot
          adresa ANPC sau pot folosi procedura SAL.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
