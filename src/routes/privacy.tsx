import { createFileRoute } from "@tanstack/react-router";
import { useSite } from "@/lib/site-context";

export const Route = createFileRoute("/privacy")({
  component: Privacy,
  head: () => ({
    meta: [
      { title: "Confidentialitate - Trei Linii" },
      { name: "description", content: "Politica de confidentialitate Trei Linii." },
    ],
  }),
});

function Privacy() {
  const { privacyIntro } = useSite();

  return (
    <main className="px-5 md:px-10 py-16 md:py-24">
      <article className="mx-auto max-w-3xl">
        <p className="font-mono-xs opacity-60">Legal</p>
        <h1 className="font-display text-5xl md:text-7xl mt-3">Confidentialitate</h1>
        <div className="mt-10 space-y-6 text-muted-foreground leading-relaxed">
          <p>{privacyIntro}</p>
          <p>
            Datele de plata sunt procesate prin furnizorii securizati folositi la checkout. Nu
            stocam local date complete de card.
          </p>
          <p>
            Poti cere modificarea sau stergerea datelor de contact trimitand un mesaj prin pagina de
            contact.
          </p>
        </div>
      </article>
    </main>
  );
}
