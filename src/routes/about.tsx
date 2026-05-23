import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About — BLANK ATELIER" },
      {
        name: "description",
        content:
          "BLANK ATELIER is a Bucharest-based studio building quiet, heavyweight uniforms for everyday life.",
      },
    ],
  }),
});

function About() {
  return (
    <div className="px-5 md:px-10 py-12 md:py-20">
      <div className="mx-auto max-w-[1100px]">
        <p className="font-mono-xs opacity-60">About</p>
        <h1 className="font-display text-5xl md:text-8xl mt-2 leading-[0.95]">
          We make heavy
          <br />
          cotton for quiet
          <br />
          people.
        </h1>

        <div className="mt-16 grid md:grid-cols-12 gap-12">
          <div className="md:col-span-7 space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p>
              BLANK ATELIER is a small studio in Bucharest. We design and produce one thing very
              well — oversized cotton tees — and we drop them in small, dated runs.
            </p>
            <p>
              Every piece is knitted in Portugal at a mill we've worked with since 2024. 240 gsm
              long-staple cotton, garment-dyed where it makes sense, finished with restraint. Small
              mark on the front. The story sits on the back.
            </p>
            <p>We don't do seasons. We do volumes. This is Volume I.</p>
          </div>

          <aside className="md:col-span-4 md:col-start-9 space-y-6 font-mono-xs">
            <div>
              <h3 className="opacity-50 mb-2">Founded</h3>
              <p>Bucharest, 2026</p>
            </div>
            <div>
              <h3 className="opacity-50 mb-2">Made in</h3>
              <p>Vila Nova de Famalicão, Portugal</p>
            </div>
            <div>
              <h3 className="opacity-50 mb-2">Sizing</h3>
              <p>S — XL · Oversized fit</p>
            </div>
            <div>
              <h3 className="opacity-50 mb-2">Releases</h3>
              <p>One volume every six weeks</p>
            </div>
          </aside>
        </div>

        <div className="mt-24 border-t border-border pt-8 flex items-center justify-between">
          <p className="font-display text-2xl md:text-3xl">Volume I now shipping.</p>
          <Link to="/shop" className="bg-charcoal text-cream px-6 py-3 font-mono-xs">
            Shop now →
          </Link>
        </div>
      </div>
    </div>
  );
}
