import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "Despre — Trei Linii" },
      {
        name: "description",
        content:
          "Trei Linii este un brand de streetwear minimal construit în jurul tricourilor oversized și al graficii curate.",
      },
    ],
  }),
});

function About() {
  return (
    <div className="px-5 md:px-10 py-12 md:py-20">
      <div className="mx-auto max-w-[1100px]">
        <p className="font-mono-xs opacity-60">Despre</p>
        <h1 className="font-display text-5xl md:text-8xl mt-2 leading-[0.95]">
          Trei linii.
          <br />
          O uniformă
          <br />
          pentru oraș.
        </h1>

        <div className="mt-16 grid md:grid-cols-12 gap-12">
          <div className="md:col-span-7 space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p>
              Trei Linii există pentru oamenii care vor un tricou simplu, dar nu plictisitor: bumbac
              dens, croială oversized și grafică suficient de clară încât să rămână purtabilă.
            </p>
            <p>
              Direcția este directă: semn mic pe față, print mai puternic pe spate, culori ușor de
              purtat și lansări limitate care nu se bazează pe reduceri permanente.
            </p>
            <p>
              Produsele finale, stocul, finalizarea comenzii și comenzile vor fi administrate în
              Shopify.
            </p>
          </div>

          <aside className="md:col-span-4 md:col-start-9 space-y-6 font-mono-xs">
            <div>
              <h3 className="opacity-50 mb-2">Brand</h3>
              <p>Trei Linii</p>
            </div>
            <div>
              <h3 className="opacity-50 mb-2">Stil</h3>
              <p>Minimal streetwear</p>
            </div>
            <div>
              <h3 className="opacity-50 mb-2">Mărimi</h3>
              <p>S — XL · Croială oversized</p>
            </div>
            <div>
              <h3 className="opacity-50 mb-2">Lansări</h3>
              <p>Lansări limitate</p>
            </div>
          </aside>
        </div>

        <div className="mt-24 border-t border-border pt-8 flex items-center justify-between">
          <p className="font-display text-2xl md:text-3xl">Lansarea 01 este în pregătire.</p>
          <Link to="/shop" className="bg-charcoal text-cream px-6 py-3 font-mono-xs">
            Vezi produsele →
          </Link>
        </div>
      </div>
    </div>
  );
}
