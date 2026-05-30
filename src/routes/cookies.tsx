import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cookies")({
  component: Cookies,
  head: () => ({
    meta: [
      { title: "Cookies - Trei Linii" },
      { name: "description", content: "Informatii despre cookies pe site-ul Trei Linii." },
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
            Site-ul poate folosi cookies necesare pentru functionarea navigarii, cosului si
            formularelor. Unele servicii externe pot seta cookies pentru analiza sau masurare.
          </p>
          <p>
            Poti controla cookies din setarile browserului. Blocarea unor cookies poate afecta
            experienta de navigare sau functionalitatea cosului.
          </p>
        </div>
      </article>
    </main>
  );
}
