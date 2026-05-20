import { createFileRoute } from "@tanstack/react-router";
import { useSite } from "@/lib/site-context";
import { products, collections } from "@/lib/mock-data";

export const Route = createFileRoute("/admin")({
  component: Admin,
  head: () => ({ meta: [{ title: "Admin — BLANK ATELIER" }, { name: "robots", content: "noindex" }] }),
});

function Admin() {
  const site = useSite();

  return (
    <div className="bg-cream min-h-screen">
      <div className="px-5 md:px-10 py-12 md:py-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12 pb-6 border-b border-border">
            <div>
              <p className="font-mono-xs opacity-60">Admin · Demo mockup (no auth)</p>
              <h1 className="font-display text-5xl md:text-7xl mt-2">Studio control.</h1>
            </div>
            <button
              onClick={site.reset}
              className="font-mono-xs border border-border px-4 py-2 hover:border-charcoal"
            >
              Reset to defaults
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Panel title="Brand">
              <Row label="Logo text">
                <input
                  className="input"
                  value={site.logoText}
                  onChange={(e) => site.update({ logoText: e.target.value })}
                />
              </Row>
              <Row label="Favicon URL">
                <input
                  className="input"
                  value={site.favicon}
                  onChange={(e) => site.update({ favicon: e.target.value })}
                />
              </Row>
              <Row label="Primary color">
                <input
                  type="color"
                  className="h-10 w-20 cursor-pointer"
                  value={site.primaryColor}
                  onChange={(e) => site.update({ primaryColor: e.target.value })}
                />
              </Row>
              <Row label="Accent color">
                <input
                  type="color"
                  className="h-10 w-20 cursor-pointer"
                  value={site.accentColor}
                  onChange={(e) => site.update({ accentColor: e.target.value })}
                />
              </Row>
              <Row label="Font system">
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
              <Row label="Eyebrow">
                <input className="input" value={site.heroEyebrow} onChange={(e) => site.update({ heroEyebrow: e.target.value })} />
              </Row>
              <Row label="Headline">
                <textarea
                  rows={3}
                  className="input resize-none"
                  value={site.heroHeadline}
                  onChange={(e) => site.update({ heroHeadline: e.target.value })}
                />
              </Row>
              <Row label="Subcopy">
                <textarea
                  rows={3}
                  className="input resize-none"
                  value={site.heroSubcopy}
                  onChange={(e) => site.update({ heroSubcopy: e.target.value })}
                />
              </Row>
              <Row label="Hero image">
                <button className="font-mono-xs border border-border px-3 py-2 hover:border-charcoal">
                  Replace image (placeholder)
                </button>
              </Row>
            </Panel>

            <Panel title="Announcement bar">
              <Row label="Message">
                <input
                  className="input"
                  value={site.announcement}
                  onChange={(e) => site.update({ announcement: e.target.value })}
                />
              </Row>
            </Panel>

            <Panel title="Homepage sections">
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

            <Panel title="Featured products">
              <p className="font-mono-xs opacity-60 mb-3">Toggle which products appear on the home page.</p>
              <ul className="space-y-2">
                {products.map((p) => {
                  const on = site.featuredProductIds.includes(p.id);
                  return (
                    <li key={p.id} className="flex items-center justify-between border border-border px-3 py-2">
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
                        {on ? "● Featured" : "○ Hidden"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Panel>

            <Panel title="Featured collections">
              <ul className="space-y-2">
                {collections.map((c) => {
                  const on = site.featuredCollectionHandles.includes(c.handle);
                  return (
                    <li key={c.handle} className="flex items-center justify-between border border-border px-3 py-2">
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
                        {on ? "● Featured" : "○ Hidden"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Panel>

            <Panel title="Product badges">
              <p className="font-mono-xs opacity-60 mb-3">Read-only preview. Hook into Shopify metafields when wiring up.</p>
              <ul className="space-y-2">
                {products.map((p) => (
                  <li key={p.id} className="flex items-center justify-between border border-border px-3 py-2">
                    <span className="text-sm">{p.title}</span>
                    <span className="font-mono-xs opacity-70">{p.badge ?? "— no badge —"}</span>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Static content">
              <p className="font-mono-xs opacity-60 mb-3">Banners · Lookbook · FAQ · Footer · About</p>
              <div className="grid grid-cols-2 gap-2">
                {["Edit banners","Edit lookbook","Edit FAQ","Edit reviews","Edit footer","Edit static pages"].map(t => (
                  <button key={t} className="font-mono-xs border border-border px-3 py-3 text-left hover:border-charcoal">
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
