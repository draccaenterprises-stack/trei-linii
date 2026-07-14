import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/LegalLayout";
import { LEGAL, hasLegalBusinessDetails, legalBusinessFallback } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/termeni-si-conditii")({
  component: TermsRo,
  head: () =>
    pageMeta({
      path: "/termeni-si-conditii",
      title: "Termeni și condiții | Trei Linii",
      description:
        "Termenii și condițiile pentru folosirea site-ului Trei Linii și plasarea comenzilor online.",
    }),
});

function TermsRo() {
  const legalReady = hasLegalBusinessDetails();

  return (
    <LegalPage title="Termeni și condiții">
      <p>
        Bine ai venit pe {LEGAL.domain}, magazinul online al brandului {LEGAL.brand}. Prin accesarea
        site-ului sau plasarea unei comenzi, confirmi că ai citit și accepți acești termeni.
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

      <LegalSection title="2. Produse, prețuri și comenzi">
        <p>
          Trei Linii comercializează articole vestimentare, în principal tricouri oversized cu
          design minimalist aplicat pe spate. Prețurile sunt afișate în RON, iar costul livrării
          este afișat separat în checkout, înainte de finalizarea comenzii.
        </p>
        <p>
          Ne rezervăm dreptul de a modifica prețurile, promoțiile și disponibilitatea produselor
          fără notificare prealabilă. Prețul aplicabil unei comenzi este cel afișat în momentul
          plasării comenzii.
        </p>
      </LegalSection>

      <LegalSection title="3. Plata și livrarea">
        <p>
          Plata se face prin metodele afișate în checkout. Plățile online sunt procesate securizat
          prin {LEGAL.paymentProcessor}; Trei Linii nu stochează datele complete ale cardului.
        </p>
        <p>
          Livrarea se face prin {LEGAL.courier}. Termen estimativ: {LEGAL.deliveryTerm}. Costul
          livrării: {LEGAL.shippingCost}.
        </p>
      </LegalSection>

      <LegalSection title="4. Retur și schimb de mărime">
        <p>
          Consumatorul are dreptul să se retragă din contract în termen de 14 zile calendaristice de
          la primirea produsului, fără a preciza motivul. Produsul returnat trebuie să fie nepurtat,
          curat, fără urme de miros sau deteriorare și cu etichetele atașate, dacă au fost livrate
          cu etichete.
        </p>
        <p>
          Pentru retur sau schimb de mărime, folosește datele confirmate în pagina de contact și
          consultă paginile{" "}
          <Link to="/retur" className="underline underline-offset-4 hover:opacity-70">
            Retur
          </Link>{" "}
          și{" "}
          <Link to="/schimb-marime" className="underline underline-offset-4 hover:opacity-70">
            Schimb mărime
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="5. Reclamații și soluționarea litigiilor">
        <p>
          Pentru orice problemă legată de comandă, produs, livrare, retur sau plată, contactează-ne
          mai întâi prin pagina de contact. Dacă problema nu se rezolvă amiabil, consumatorii se pot
          adresa ANPC sau pot folosi procedura SAL.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
