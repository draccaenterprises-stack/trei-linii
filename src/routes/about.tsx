import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "Despre - Trei Linii" },
      {
        name: "description",
        content:
          "Trei Linii este un brand de streetwear minimal construit in jurul tricourilor oversized si al graficii curate.",
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
          O uniforma
          <br />
          pentru oras.
        </h1>

        <div className="mt-16 grid md:grid-cols-12 gap-12">
          <div className="md:col-span-7 space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p>
              Trei Linii exista pentru oamenii care vor un tricou simplu, dar nu plictisitor: bumbac
              dens, croiala oversized si grafica suficient de clara incat sa ramana purtabila.
            </p>
            <p>
              Directia este simpla: semn mic pe fata, print mai puternic pe spate, culori usor de
              purtat si lansari limitate care nu se bazeaza pe reduceri permanente.
            </p>
            <p>
              Produsele finale, stocul, cosul si comenzile vor fi operate printr-un flux securizat,
              fara finalizare custom.
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
              <h3 className="opacity-50 mb-2">Marimi</h3>
              <p>S - XL - Croiala oversized</p>
            </div>
            <div>
              <h3 className="opacity-50 mb-2">Lansari</h3>
              <p>Lansari limitate</p>
            </div>
          </aside>
        </div>

        <div className="mt-24 border-t border-border pt-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <p className="font-display text-2xl md:text-3xl">Lansarea 01 este in pregatire.</p>
          <Link to="/shop" className="bg-charcoal text-cream px-6 py-3 font-mono-xs">
            Vezi modelele
          </Link>
        </div>
      </div>
    </div>
  );
}
