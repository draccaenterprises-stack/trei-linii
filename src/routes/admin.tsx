import { createFileRoute } from "@tanstack/react-router";
import { collections, products } from "@/lib/mock-data";
import { useSite } from "@/lib/site-context";

export const Route = createFileRoute("/admin")({
  component: Admin,
  head: () => ({
    meta: [{ title: "Admin — Trei Linii" }, { name: "robots", content: "noindex" }],
  }),
});

function Admin() {
  const site = useSite();

  return (
    <div className="bg-cream min-h-screen">
      <div className="px-5 md:px-10 py-12 md:py-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12 pb-6 border-b border-border">
            <div>
              <p className="font-mono-xs opacity-60">Admin · Demo fără autentificare</p>
              <h1 className="font-display text-5xl md:text-7xl mt-2">Control site.</h1>
            </div>
            <button
              onClick={site.reset}
              className="font-mono-xs border border-border px-4 py-2 hover:border-charcoal"
            >
              Resetează setările
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Panel title="Brand">
              <Row label="Text logo">
                <input
                  className="input"
                  value={site.logoText}
                  onChange={(e) => site.update({ logoText: e.target.value })}
                />
              </Row>
              <Row label="URL favicon">
                <input
                  className="input"
                  value={site.favicon}
                  onChange={(e) => site.update({ favicon: e.target.value })}
                />
              </Row>
              <Row label="Culoare principală">
                <input
                  type="color"
                  className="h-10 w-20 cursor-pointer"
                  value={site.primaryColor}
                  onChange={(e) => site.update({ primaryColor: e.target.value })}
                />
              </Row>
              <Row label="Culoare accent">
                <input
                  type="color"
                  className="h-10 w-20 cursor-pointer"
                  value={site.accentColor}
                  onChange={(e) => site.update({ accentColor: e.target.value })}
                />
              </Row>
              <Row label="Sistem font">
                <select
                  className="input"
                  value={site.font}
                  onChange={(e) => site.update({ font: e.target.value as typeof site.font })}
                >
                  <option>Serif Editorial</option>
                  <option>Sans Modern</option>
                </select>
              </Row>
            </Panel>

            <Panel title="Hero">
              <Row label="Text mic de sus">
                <input
                  className="input"
                  value={site.heroEyebrow}
                  onChange={(e) => site.update({ heroEyebrow: e.target.value })}
                />
              </Row>
              <Row label="Titlu">
                <textarea
                  rows={3}
                  className="input resize-none"
                  value={site.heroHeadline}
                  onChange={(e) => site.update({ heroHeadline: e.target.value })}
                />
              </Row>
              <Row label="Descriere">
                <textarea
                  rows={3}
                  className="input resize-none"
                  value={site.heroSubcopy}
                  onChange={(e) => site.update({ heroSubcopy: e.target.value })}
                />
              </Row>
              <Row label="Imagine hero">
                <button className="font-mono-xs border border-border px-3 py-2 hover:border-charcoal">
                  Înlocuiește imaginea (placeholder)
                </button>
              </Row>
            </Panel>

            <Panel title="Bară anunț">
              <Row label="Mesaj">
                <input
                  className="input"
                  value={site.announcement}
                  onChange={(e) => site.update({ announcement: e.target.value })}
                />
              </Row>
            </Panel>

            <Panel title="Secțiuni homepage">
              <ul className="divide-y divide-border">
                {site.sections.map((s) => (
                  <li key={s.id} className="flex items-center justify-between py-3">
                    <span className="text-sm">{s.label}</span>
                    <button
                      onClick={() => site.toggleSection(s.id)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${s.enabled ? "bg-charcoal" : "bg-border"}`}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 bg-cream rounded-full transition-all ${s.enabled ? "left-6" : "left-0.5"}`}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Produse recomandate">
              <p className="font-mono-xs opacity-60 mb-3">Alege ce produse apar pe homepage.</p>
              <ul className="space-y-2">
                {products.map((p) => {
                  const on = site.featuredProductIds.includes(p.id);
                  return (
                    <li
                      key={p.id}
                      className="flex items-center justify-between border border-border px-3 py-2"
                    >
                      <span className="text-sm">{p.title}</span>
                      <button
                        onClick={() =>
                          site.update({
                            featuredProductIds: on
                              ? site.featuredProductIds.filter((id) => id !== p.id)
                              : [...site.featuredProductIds, p.id],
                          })
                        }
                        className="font-mono-xs"
                      >
                        {on ? "● Recomandat" : "○ Ascuns"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Panel>

            <Panel title="Categorii recomandate">
              <ul className="space-y-2">
                {collections.map((c) => {
                  const on = site.featuredCollectionHandles.includes(c.handle);
                  return (
                    <li
                      key={c.handle}
                      className="flex items-center justify-between border border-border px-3 py-2"
                    >
                      <span className="text-sm">{c.title}</span>
                      <button
                        onClick={() =>
                          site.update({
                            featuredCollectionHandles: on
                              ? site.featuredCollectionHandles.filter((h) => h !== c.handle)
                              : [...site.featuredCollectionHandles, c.handle],
                          })
                        }
                        className="font-mono-xs"
                      >
                        {on ? "● Recomandată" : "○ Ascunsă"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Panel>

            <Panel title="Badge-uri produse">
              <p className="font-mono-xs opacity-60 mb-3">
                Preview momentan. În producție se pot administra prin Shopify metafields.
              </p>
              <ul className="space-y-2">
                {products.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between border border-border px-3 py-2"
                  >
                    <span className="text-sm">{p.title}</span>
                    <span className="font-mono-xs opacity-70">{p.badge ?? "— fără badge —"}</span>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Conținut static">
              <p className="font-mono-xs opacity-60 mb-3">
                Bannere · Editorial · FAQ · Footer · Despre
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Editează bannere",
                  "Editează editorial",
                  "Editează FAQ",
                  "Editează recenzii",
                  "Editează footer",
                  "Editează pagini statice",
                ].map((t) => (
                  <button
                    key={t}
                    className="font-mono-xs border border-border px-3 py-3 text-left hover:border-charcoal"
                  >
                    {t} →
                  </button>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%; background: transparent; outline: none;
          border: 1px solid var(--color-border); padding: 8px 10px;
          font-family: var(--font-sans); font-size: 0.875rem;
        }
        .input:focus { border-color: var(--color-charcoal); }
      `}</style>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-background border border-border p-6 md:p-8">
      <h2 className="font-display text-2xl mb-6">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="font-mono-xs opacity-60 block mb-2">{label}</label>
      {children}
    </div>
  );
}
