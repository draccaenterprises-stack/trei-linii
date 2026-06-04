import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/LegalLayout";
import { LEGAL, hasLegalBusinessDetails } from "@/lib/site";

export const Route = createFileRoute("/privacy")({
  component: Privacy,
  head: () => ({
    meta: [
      { title: "Confidentialitate - Trei Linii" },
      {
        name: "description",
        content: "Politica de confidentialitate si protectia datelor (GDPR) Trei Linii.",
      },
    ],
  }),
});

function Privacy() {
  const legalDetailsReady = hasLegalBusinessDetails();

  return (
    <LegalPage title="Confidentialitate">
      <p>
        Aceasta politica explica ce date personale colectam, de ce, si ce drepturi ai, conform
        Regulamentului (UE) 2016/679 (GDPR).
      </p>

      <LegalSection title="1. Operator de date">
        {legalDetailsReady ? (
          <p>
            {LEGAL.company}, sediu in {LEGAL.address}, CUI {LEGAL.cui}. Pentru orice solicitare
            privind datele tale, scrie la {LEGAL.email}.
          </p>
        ) : (
          <p>
            Datele complete ale operatorului vor fi publicate aici inainte de activarea comenzilor
            reale. Pentru orice solicitare privind datele tale, scrie la {LEGAL.email}.
          </p>
        )}
      </LegalSection>

      <LegalSection title="2. Ce date colectam">
        <p>
          Date de comanda si livrare (nume, adresa, email, telefon), date de cont daca iti creezi
          unul, adresa de email pentru lista de noutati daca te inscrii, si date tehnice de navigare
          (cu acordul tau, prin cookies).
        </p>
      </LegalSection>

      <LegalSection title="3. Scopuri si temei legal">
        <p>
          Procesarea si livrarea comenzilor (executarea contractului); comunicari de marketing
          (consimtamant, retragerea oricand); masurarea traficului (consimtamant, prin cookies);
          obligatii legale fiscale si contabile (obligatie legala).
        </p>
      </LegalSection>

      <LegalSection title="4. Cine ne ajuta sa procesam datele">
        <p>
          Folosim furnizori care actioneaza ca persoane imputernicite: Shopify (magazin si
          checkout), Klaviyo (email / lista de lansare), firme de curierat pentru livrare si
          procesatorii de plata. Acestia prelucreaza datele doar pentru serviciile prestate.
        </p>
      </LegalSection>

      <LegalSection title="5. Transfer in afara UE">
        <p>
          Unii furnizori (ex. Shopify, Klaviyo) pot procesa date in afara UE. Transferurile se fac
          cu garantii adecvate, conform clauzelor contractuale standard ale Comisiei Europene.
        </p>
      </LegalSection>

      <LegalSection title="6. Cat timp pastram datele">
        <p>
          Datele de comanda se pastreaza conform obligatiilor legale fiscale. Datele de marketing se
          pastreaza pana iti retragi consimtamantul (dezabonare).
        </p>
      </LegalSection>

      <LegalSection title="7. Drepturile tale">
        <p>
          Ai dreptul de acces, rectificare, stergere, restrictionare, portabilitate si opozitie,
          precum si dreptul de a-ti retrage consimtamantul. Le poti exercita scriind la{" "}
          {LEGAL.email}. Ai dreptul de a depune o plangere la Autoritatea Nationala de Supraveghere
          a Prelucrarii Datelor cu Caracter Personal (
          <a
            href="https://www.dataprotection.ro"
            className="underline underline-offset-4 hover:opacity-70"
            rel="noopener noreferrer"
          >
            dataprotection.ro
          </a>
          ).
        </p>
      </LegalSection>

      <LegalSection title="8. Plata">
        <p>
          Datele de plata sunt procesate securizat de procesatorii folositi la checkout. Nu stocam
          local datele complete de card.
        </p>
      </LegalSection>

      <LegalSection title="9. Cookies">
        <p>
          Detalii despre cookies si cum le controlezi gasesti pe pagina{" "}
          <Link to="/cookies" className="underline underline-offset-4 hover:opacity-70">
            Cookies
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
