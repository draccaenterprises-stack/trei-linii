import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cookies")({
  component: Cookies,
  head: () => ({
    meta: [
      { title: "Politica de cookies — Trei Linii" },
      {
        name: "description",
        content: "Politica de cookies pentru Trei Linii.",
      },
    ],
  }),
});

function Cookies() {
  return (
    <main className="px-5 md:px-10 py-16 md:py-24">
      <article className="mx-auto max-w-3xl">
        <p className="font-mono-xs opacity-60">Legal</p>
        <h1 className="font-display text-5xl md:text-7xl mt-3">Cookies</h1>
        <div className="mt-10 space-y-6 text-muted-foreground leading-relaxed">
          <p>
            Această pagină trebuie completată cu instrumentele reale folosite pentru analiză,
            marketing, consimțământ și funcționarea coșului.
          </p>
          <p>
            În producție, recomandarea este folosirea unui banner de consimțământ compatibil GDPR.
          </p>
        </div>
      </article>
    </main>
  );
}
