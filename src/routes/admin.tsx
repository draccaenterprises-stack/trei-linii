import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { isShopifyConfigured, shopifyConfig } from "@/lib/shopify";
import { useSite, type SiteMode, type SiteSettings } from "@/lib/site-context";

const LOCAL_ADMIN_ENABLED = import.meta.env.VITE_ENABLE_LOCAL_ADMIN === "true";
const LOCAL_ADMIN_PIN = import.meta.env.VITE_LOCAL_ADMIN_PIN as string | undefined;

export const Route = createFileRoute("/admin")({
  component: Admin,
  head: () => ({
    meta: [{ title: "Admin - Trei Linii" }, { name: "robots", content: "noindex,nofollow" }],
  }),
});

function Admin() {
  const site = useSite();
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(
    () => typeof window !== "undefined" && sessionStorage.getItem("trei-linii-admin") === "1",
  );
  const [settingsBackup, setSettingsBackup] = useState("");
  const [settingsMessage, setSettingsMessage] = useState("");
  const missingLegal = !site.legalBusinessName || !site.legalBusinessDetails;
  const shopifyReady = isShopifyConfigured();

  if (!LOCAL_ADMIN_ENABLED || !LOCAL_ADMIN_PIN) {
    return (
      <div className="min-h-screen bg-cream px-5 py-20 grid place-items-center">
        <div className="w-full max-w-md border border-border bg-background p-6 space-y-4">
          <p className="font-mono-xs opacity-60">Admin privat</p>
          <h1 className="font-display text-4xl">Admin local dezactivat.</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Dashboard-ul temporar se activeaza doar in mediul local, prin variabile de mediu.
            Build-ul public nu expune cod de acces.
          </p>
        </div>
        <AdminStyles />
      </div>
    );
  }

  const updateCsv = (key: "featuredProductIds" | "featuredCollectionHandles", value: string) => {
    site.update({
      [key]: value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    });
  };
  const updateFooterTrustItems = (value: string) => {
    site.update({
      footerTrustItems: value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    });
  };
  const exportSettings = () => {
    const settingsOnly = Object.fromEntries(
      Object.entries(site).filter(([, value]) => typeof value !== "function"),
    );
    setSettingsBackup(JSON.stringify(settingsOnly, null, 2));
    setSettingsMessage("Backup generat local.");
  };
  const importSettings = () => {
    try {
      const parsed = JSON.parse(settingsBackup) as Partial<SiteSettings>;
      site.update(parsed);
      setSettingsMessage("Setarile au fost importate local.");
    } catch {
      setSettingsMessage("JSON invalid. Verifica backup-ul si incearca din nou.");
    }
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-cream px-5 py-20 grid place-items-center">
        <form
          className="w-full max-w-sm border border-border bg-background p-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (pin === LOCAL_ADMIN_PIN) {
              sessionStorage.setItem("trei-linii-admin", "1");
              setUnlocked(true);
            }
          }}
        >
          <div>
            <p className="font-mono-xs opacity-60">Admin privat</p>
            <h1 className="font-display text-4xl mt-2">Control site</h1>
          </div>
          <input
            type="password"
            className="input"
            value={pin}
            onChange={(event) => setPin(event.target.value)}
            placeholder="Cod acces"
          />
          <button className="w-full bg-charcoal text-cream py-3 font-mono-xs">
            Intra in admin
          </button>
          <p className="text-xs text-muted-foreground">
            Acces rezervat pentru administrarea continutului Trei Linii.
          </p>
        </form>
        <AdminStyles />
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <div className="px-5 md:px-10 py-12 md:py-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12 pb-6 border-b border-border">
            <div>
              <p className="font-mono-xs opacity-60">Admin · Trei Linii</p>
              <h1 className="font-display text-5xl md:text-7xl mt-2">Control site.</h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  sessionStorage.removeItem("trei-linii-admin");
                  setUnlocked(false);
                }}
                className="font-mono-xs border border-border px-4 py-2 hover:border-charcoal"
              >
                Blocheaza
              </button>
              <button
                onClick={site.reset}
                className="font-mono-xs border border-border px-4 py-2 hover:border-charcoal"
              >
                Reseteaza setarile
              </button>
            </div>
          </div>

          {missingLegal && (
            <div className="mb-6 border border-washed-red bg-background p-4 text-sm">
              Datele firmei lipsesc in admin. Publicul nu vede texte temporare, dar trebuie
              completate inainte de lansarea comerciala.
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            <Panel title="Mod site">
              <Row label="Status comercial">
                <select
                  className="input"
                  value={site.siteMode}
                  onChange={(e) => site.update({ siteMode: e.target.value as SiteMode })}
                >
                  <option value="pre-launch">Pre-lansare</option>
                  <option value="live-shop">Magazin activ</option>
                </select>
              </Row>
              <Row label="Bara anunt activa">
                <input
                  type="checkbox"
                  checked={site.announcementVisible}
                  onChange={(e) => site.update({ announcementVisible: e.target.checked })}
                />
              </Row>
              <Row label="Text bara anunt">
                <input
                  className="input"
                  value={site.announcement}
                  onChange={(e) => site.update({ announcement: e.target.value })}
                />
              </Row>
            </Panel>

            <Panel title="Brand & SEO">
              <Row label="Text logo">
                <input
                  className="input"
                  value={site.logoText}
                  onChange={(e) => site.update({ logoText: e.target.value })}
                />
              </Row>
              <Row label="SEO title">
                <input
                  className="input"
                  value={site.seoTitle}
                  onChange={(e) => site.update({ seoTitle: e.target.value })}
                />
              </Row>
              <Row label="SEO description">
                <textarea
                  rows={3}
                  className="input resize-none"
                  value={site.seoDescription}
                  onChange={(e) => site.update({ seoDescription: e.target.value })}
                />
              </Row>
              <div className="grid grid-cols-2 gap-3">
                <Row label="Culoare principala">
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
              </div>
            </Panel>

            <Panel title="Hero">
              <Row label="Text mic">
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
              <div className="grid md:grid-cols-2 gap-3">
                <Row label="CTA principal text">
                  <input
                    className="input"
                    value={site.heroPrimaryCtaText}
                    onChange={(e) => site.update({ heroPrimaryCtaText: e.target.value })}
                  />
                </Row>
                <Row label="CTA principal link">
                  <input
                    className="input"
                    value={site.heroPrimaryCtaLink}
                    onChange={(e) => site.update({ heroPrimaryCtaLink: e.target.value })}
                  />
                </Row>
                <Row label="CTA secundar text">
                  <input
                    className="input"
                    value={site.heroSecondaryCtaText}
                    onChange={(e) => site.update({ heroSecondaryCtaText: e.target.value })}
                  />
                </Row>
                <Row label="CTA secundar link">
                  <input
                    className="input"
                    value={site.heroSecondaryCtaLink}
                    onChange={(e) => site.update({ heroSecondaryCtaLink: e.target.value })}
                  />
                </Row>
              </div>
              <Row label="Badge-uri sub hero">
                <input
                  className="input"
                  value={site.heroBadges}
                  onChange={(e) => site.update({ heroBadges: e.target.value })}
                />
              </Row>
            </Panel>

            <Panel title="Homepage copy">
              <Row label="Concept - text mic">
                <input
                  className="input"
                  value={site.conceptEyebrow}
                  onChange={(e) => site.update({ conceptEyebrow: e.target.value })}
                />
              </Row>
              <Row label="Concept - titlu">
                <textarea
                  rows={2}
                  className="input resize-none"
                  value={site.conceptTitle}
                  onChange={(e) => site.update({ conceptTitle: e.target.value })}
                />
              </Row>
              <Row label="Concept - descriere">
                <textarea
                  rows={3}
                  className="input resize-none"
                  value={site.conceptBody}
                  onChange={(e) => site.update({ conceptBody: e.target.value })}
                />
              </Row>
              <div className="grid md:grid-cols-2 gap-3">
                <Row label="Produse - text mic pre-lansare">
                  <input
                    className="input"
                    value={site.featuredEyebrowPreLaunch}
                    onChange={(e) => site.update({ featuredEyebrowPreLaunch: e.target.value })}
                  />
                </Row>
                <Row label="Produse - eyebrow live">
                  <input
                    className="input"
                    value={site.featuredEyebrowLiveShop}
                    onChange={(e) => site.update({ featuredEyebrowLiveShop: e.target.value })}
                  />
                </Row>
                <Row label="Produse - titlu pre-launch">
                  <input
                    className="input"
                    value={site.featuredTitlePreLaunch}
                    onChange={(e) => site.update({ featuredTitlePreLaunch: e.target.value })}
                  />
                </Row>
                <Row label="Produse - titlu live">
                  <input
                    className="input"
                    value={site.featuredTitleLiveShop}
                    onChange={(e) => site.update({ featuredTitleLiveShop: e.target.value })}
                  />
                </Row>
              </div>
              <Row label="Text link produse">
                <input
                  className="input"
                  value={site.featuredLinkText}
                  onChange={(e) => site.update({ featuredLinkText: e.target.value })}
                />
              </Row>
              <div className="grid md:grid-cols-2 gap-3">
                <Row label="Structura - text mic">
                  <input
                    className="input"
                    value={site.collectionsEyebrow}
                    onChange={(e) => site.update({ collectionsEyebrow: e.target.value })}
                  />
                </Row>
                <Row label="Structura - titlu">
                  <input
                    className="input"
                    value={site.collectionsTitle}
                    onChange={(e) => site.update({ collectionsTitle: e.target.value })}
                  />
                </Row>
                <Row label="Lookbook - text mic">
                  <input
                    className="input"
                    value={site.lookbookEyebrow}
                    onChange={(e) => site.update({ lookbookEyebrow: e.target.value })}
                  />
                </Row>
                <Row label="Lookbook - titlu">
                  <input
                    className="input"
                    value={site.lookbookTitle}
                    onChange={(e) => site.update({ lookbookTitle: e.target.value })}
                  />
                </Row>
              </div>
            </Panel>

            <Panel title="Sectiuni homepage">
              <ul className="divide-y divide-border">
                {site.sections.map((s) => (
                  <li key={s.id} className="flex items-center justify-between py-3">
                    <span className="text-sm">{s.label}</span>
                    <button
                      onClick={() => site.toggleSection(s.id)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        s.enabled ? "bg-charcoal" : "bg-border"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 bg-cream rounded-full transition-all ${
                          s.enabled ? "left-6" : "left-0.5"
                        }`}
                      />
                    </button>
                  </li>
                ))}
              </ul>
              <Row label="Recenzii active">
                <input
                  type="checkbox"
                  checked={site.reviewsEnabled}
                  onChange={(e) => site.update({ reviewsEnabled: e.target.checked })}
                />
              </Row>
            </Panel>

            <Panel title="Featured content">
              <p className="text-sm text-muted-foreground">
                Pentru produse poti folosi ID-ul local, handle-ul public sau ID-ul venit din
                catalog. Pentru colectii foloseste handle-urile separate prin virgula.
              </p>
              <Row label="Produse featured">
                <textarea
                  rows={3}
                  className="input resize-none"
                  value={site.featuredProductIds.join(", ")}
                  onChange={(e) => updateCsv("featuredProductIds", e.target.value)}
                />
              </Row>
              <Row label="Colectii featured">
                <textarea
                  rows={3}
                  className="input resize-none"
                  value={site.featuredCollectionHandles.join(", ")}
                  onChange={(e) => updateCsv("featuredCollectionHandles", e.target.value)}
                />
              </Row>
            </Panel>

            <Panel title="Card produs">
              <Row label="Imagine spate prima">
                <input
                  type="checkbox"
                  checked={site.productCardBackImageFirst}
                  onChange={(e) => site.update({ productCardBackImageFirst: e.target.checked })}
                />
              </Row>
              <Row label="Badge previzualizare activ">
                <input
                  type="checkbox"
                  checked={site.productCardShowPreviewBadge}
                  onChange={(e) => site.update({ productCardShowPreviewBadge: e.target.checked })}
                />
              </Row>
              <Row label="Badge produs live activ">
                <input
                  type="checkbox"
                  checked={site.productCardShowLiveBadges}
                  onChange={(e) => site.update({ productCardShowLiveBadges: e.target.checked })}
                />
              </Row>
              <Row label="Adaugare rapida marimi in magazin activ">
                <input
                  type="checkbox"
                  checked={site.productCardQuickAdd}
                  onChange={(e) => site.update({ productCardQuickAdd: e.target.checked })}
                />
              </Row>
              <Row label="Meta card produs">
                <input
                  className="input"
                  value={site.productCardMetaText}
                  onChange={(e) => site.update({ productCardMetaText: e.target.value })}
                />
              </Row>
            </Panel>

            <Panel title="Trust badges">
              <p className="text-sm text-muted-foreground">
                Se editeaza local pentru modul curent. Dezactiveaza un badge daca nu vrei sa apara
                public.
              </p>
              {(site.siteMode === "pre-launch"
                ? site.trustItemsPreLaunch
                : site.trustItemsLiveShop
              ).map((item) => (
                <div key={item.id} className="border border-border p-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono-xs">{item.id}</span>
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={(e) =>
                        site.updateTrustItem(site.siteMode, item.id, { enabled: e.target.checked })
                      }
                    />
                  </div>
                  <input
                    className="input"
                    value={item.title}
                    onChange={(e) =>
                      site.updateTrustItem(site.siteMode, item.id, { title: e.target.value })
                    }
                  />
                  <textarea
                    rows={2}
                    className="input resize-none"
                    value={item.text}
                    onChange={(e) =>
                      site.updateTrustItem(site.siteMode, item.id, { text: e.target.value })
                    }
                  />
                </div>
              ))}
            </Panel>

            <Panel title="FAQ">
              <div className="grid md:grid-cols-3 gap-3">
                <Row label="Text mic FAQ">
                  <input
                    className="input"
                    value={site.faqEyebrow}
                    onChange={(e) => site.update({ faqEyebrow: e.target.value })}
                  />
                </Row>
                <Row label="Titlu FAQ">
                  <input
                    className="input"
                    value={site.faqTitle}
                    onChange={(e) => site.update({ faqTitle: e.target.value })}
                  />
                </Row>
                <Row label="Link FAQ">
                  <input
                    className="input"
                    value={site.faqLinkText}
                    onChange={(e) => site.update({ faqLinkText: e.target.value })}
                  />
                </Row>
              </div>
              {site.faqItems.map((item) => (
                <div key={item.id} className="border border-border p-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono-xs">{item.id}</span>
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={(e) => site.updateFaqItem(item.id, { enabled: e.target.checked })}
                    />
                  </div>
                  <input
                    className="input"
                    value={item.q}
                    onChange={(e) => site.updateFaqItem(item.id, { q: e.target.value })}
                  />
                  <textarea
                    rows={3}
                    className="input resize-none"
                    value={item.a}
                    onChange={(e) => site.updateFaqItem(item.id, { a: e.target.value })}
                  />
                </div>
              ))}
            </Panel>

            <Panel title="Noutati & bannere">
              <div className="grid md:grid-cols-2 gap-3">
                <Row label="Noutati - text mic pre-lansare">
                  <input
                    className="input"
                    value={site.newsletterEyebrowPreLaunch}
                    onChange={(e) => site.update({ newsletterEyebrowPreLaunch: e.target.value })}
                  />
                </Row>
                <Row label="Noutati - text mic live">
                  <input
                    className="input"
                    value={site.newsletterEyebrowLiveShop}
                    onChange={(e) => site.update({ newsletterEyebrowLiveShop: e.target.value })}
                  />
                </Row>
                <Row label="Noutati - titlu pre-lansare">
                  <input
                    className="input"
                    value={site.newsletterTitlePreLaunch}
                    onChange={(e) => site.update({ newsletterTitlePreLaunch: e.target.value })}
                  />
                </Row>
                <Row label="Noutati - titlu live">
                  <input
                    className="input"
                    value={site.newsletterTitleLiveShop}
                    onChange={(e) => site.update({ newsletterTitleLiveShop: e.target.value })}
                  />
                </Row>
              </div>
              <Row label="Noutati descriere">
                <textarea
                  rows={3}
                  className="input resize-none"
                  value={site.newsletterBody}
                  onChange={(e) => site.update({ newsletterBody: e.target.value })}
                />
              </Row>
              <div className="grid md:grid-cols-2 gap-3">
                <Row label="Buton newsletter">
                  <input
                    className="input"
                    value={site.newsletterButtonText}
                    onChange={(e) => site.update({ newsletterButtonText: e.target.value })}
                  />
                </Row>
                <Row label="Mesaj succes">
                  <input
                    className="input"
                    value={site.newsletterSuccessText}
                    onChange={(e) => site.update({ newsletterSuccessText: e.target.value })}
                  />
                </Row>
              </div>
              <Row label="Banner pre-lansare">
                <textarea
                  rows={2}
                  className="input resize-none"
                  value={site.launchBannerTitle}
                  onChange={(e) => site.update({ launchBannerTitle: e.target.value })}
                />
              </Row>
              <Row label="Banner magazin activ">
                <textarea
                  rows={2}
                  className="input resize-none"
                  value={site.liveBannerTitle}
                  onChange={(e) => site.update({ liveBannerTitle: e.target.value })}
                />
              </Row>
            </Panel>

            <Panel title="Footer">
              <Row label="Slogan footer">
                <textarea
                  rows={2}
                  className="input resize-none"
                  value={site.footerTagline}
                  onChange={(e) => site.update({ footerTagline: e.target.value })}
                />
              </Row>
              <Row label="Locatie footer">
                <input
                  className="input"
                  value={site.footerLocation}
                  onChange={(e) => site.update({ footerLocation: e.target.value })}
                />
              </Row>
              <Row label="Text lista/noutati footer">
                <textarea
                  rows={3}
                  className="input resize-none"
                  value={site.footerNewsletterText}
                  onChange={(e) => site.update({ footerNewsletterText: e.target.value })}
                />
              </Row>
              <Row label="Elemente incredere footer">
                <textarea
                  rows={4}
                  className="input resize-none"
                  value={site.footerTrustItems.join("\n")}
                  onChange={(e) => updateFooterTrustItems(e.target.value)}
                />
              </Row>
            </Panel>

            <Panel title="Contact & social">
              <Row label="Email contact">
                <input
                  className="input"
                  value={site.contactEmail}
                  onChange={(e) => site.update({ contactEmail: e.target.value })}
                />
              </Row>
              <Row label="WhatsApp link">
                <input
                  className="input"
                  value={site.whatsapp}
                  onChange={(e) => site.update({ whatsapp: e.target.value })}
                />
              </Row>
              <Row label="Instagram">
                <input
                  className="input"
                  value={site.instagram}
                  onChange={(e) => site.update({ instagram: e.target.value })}
                />
              </Row>
              <Row label="TikTok">
                <input
                  className="input"
                  value={site.tiktok}
                  onChange={(e) => site.update({ tiktok: e.target.value })}
                />
              </Row>
            </Panel>

            <Panel title="Date legale">
              <Row label="Nume firma">
                <input
                  className="input"
                  value={site.legalBusinessName}
                  onChange={(e) => site.update({ legalBusinessName: e.target.value })}
                />
              </Row>
              <Row label="CUI / Reg. Com. / adresa">
                <textarea
                  rows={3}
                  className="input resize-none"
                  value={site.legalBusinessDetails}
                  onChange={(e) => site.update({ legalBusinessDetails: e.target.value })}
                />
              </Row>
            </Panel>

            <Panel title="Shopify & publicare">
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="border border-border p-4">
                  <p className="font-mono-xs opacity-60">Status Storefront API</p>
                  <p className="mt-2">{shopifyReady ? "Configurat" : "Neconfigurat"}</p>
                </div>
                <div className="border border-border p-4">
                  <p className="font-mono-xs opacity-60">Domeniu Shopify</p>
                  <p className="mt-2 break-all">{shopifyConfig.domain ?? "Lipsa"}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Produsele, preturile, variantele si stocul vin din Shopify cand sunt publicate pe
                canalul Headless. Finalizarea comenzii se activeaza doar in modul Magazin activ si
                doar pentru variante Shopify reale.
              </p>
            </Panel>

            <Panel title="Backup setari locale">
              <p className="text-sm text-muted-foreground">
                Adminul este temporar si salveaza in browser. Genereaza backup inainte de schimbari
                mari sau inainte sa publici din alt browser.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={exportSettings}
                  className="font-mono-xs bg-charcoal text-cream px-4 py-2"
                >
                  Genereaza backup
                </button>
                <button
                  onClick={importSettings}
                  className="font-mono-xs border border-border px-4 py-2"
                >
                  Importa backup
                </button>
              </div>
              <textarea
                rows={8}
                className="input resize-none font-mono text-xs"
                value={settingsBackup}
                onChange={(e) => setSettingsBackup(e.target.value)}
              />
              {settingsMessage && (
                <p className="text-sm text-muted-foreground">{settingsMessage}</p>
              )}
            </Panel>

            <Panel title="Pagini suport & legal">
              <Row label="Titlu livrare">
                <input
                  className="input"
                  value={site.deliveryTitle}
                  onChange={(e) => site.update({ deliveryTitle: e.target.value })}
                />
              </Row>
              <Row label="Text livrare">
                <textarea
                  rows={3}
                  className="input resize-none"
                  value={site.deliveryBody}
                  onChange={(e) => site.update({ deliveryBody: e.target.value })}
                />
              </Row>
              <Row label="Titlu retur">
                <input
                  className="input"
                  value={site.returnsTitle}
                  onChange={(e) => site.update({ returnsTitle: e.target.value })}
                />
              </Row>
              <Row label="Text retur">
                <textarea
                  rows={3}
                  className="input resize-none"
                  value={site.returnsBody}
                  onChange={(e) => site.update({ returnsBody: e.target.value })}
                />
              </Row>
              <Row label="Titlu schimb marime">
                <input
                  className="input"
                  value={site.exchangeTitle}
                  onChange={(e) => site.update({ exchangeTitle: e.target.value })}
                />
              </Row>
              <Row label="Text schimb marime">
                <textarea
                  rows={3}
                  className="input resize-none"
                  value={site.exchangeBody}
                  onChange={(e) => site.update({ exchangeBody: e.target.value })}
                />
              </Row>
              <Row label="Intro termeni">
                <textarea
                  rows={3}
                  className="input resize-none"
                  value={site.legalIntro}
                  onChange={(e) => site.update({ legalIntro: e.target.value })}
                />
              </Row>
              <Row label="Intro confidentialitate">
                <textarea
                  rows={3}
                  className="input resize-none"
                  value={site.privacyIntro}
                  onChange={(e) => site.update({ privacyIntro: e.target.value })}
                />
              </Row>
              <Row label="Intro cookies">
                <textarea
                  rows={3}
                  className="input resize-none"
                  value={site.cookiesIntro}
                  onChange={(e) => site.update({ cookiesIntro: e.target.value })}
                />
              </Row>
            </Panel>
          </div>
        </div>
      </div>
      <AdminStyles />
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="bg-background border border-border p-6 md:p-8">
      <h2 className="font-display text-2xl mb-6">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="font-mono-xs opacity-60 block mb-2">{label}</label>
      {children}
    </div>
  );
}

function AdminStyles() {
  return (
    <style>{`
      .input {
        width: 100%; background: transparent; outline: none;
        border: 1px solid var(--color-border); padding: 8px 10px;
        font-family: var(--font-sans); font-size: 0.875rem;
      }
      .input:focus { border-color: var(--color-charcoal); }
    `}</style>
  );
}
