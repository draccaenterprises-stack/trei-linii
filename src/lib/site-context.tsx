import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { homepageSections as defaultSections } from "./mock-data";

export type SiteMode = "pre-launch" | "live-shop";

export interface FaqItem {
  id: string;
  q: string;
  a: string;
  enabled: boolean;
}

export interface TrustItem {
  id: string;
  title: string;
  text: string;
  enabled: boolean;
}

export interface SiteSettings {
  siteMode: SiteMode;
  logoText: string;
  favicon: string;
  announcementVisible: boolean;
  primaryColor: string;
  accentColor: string;
  font: "Serif Editorial" | "Sans Modern";
  announcement: string;
  launchDate: string;
  heroHeadline: string;
  heroSubcopy: string;
  heroEyebrow: string;
  heroPrimaryCtaText: string;
  heroPrimaryCtaLink: string;
  heroSecondaryCtaText: string;
  heroSecondaryCtaLink: string;
  heroBadges: string;
  conceptEyebrow: string;
  conceptTitle: string;
  conceptBody: string;
  featuredEyebrowPreLaunch: string;
  featuredEyebrowLiveShop: string;
  featuredTitlePreLaunch: string;
  featuredTitleLiveShop: string;
  featuredLinkText: string;
  collectionsEyebrow: string;
  collectionsTitle: string;
  lookbookEyebrow: string;
  lookbookTitle: string;
  lookbookLinkText: string;
  socialProofEyebrow: string;
  socialProofTitle: string;
  socialProofCardTitle: string;
  socialProofCardText: string;
  faqEyebrow: string;
  faqTitle: string;
  faqLinkText: string;
  newsletterEyebrowPreLaunch: string;
  newsletterEyebrowLiveShop: string;
  newsletterTitlePreLaunch: string;
  newsletterTitleLiveShop: string;
  newsletterBody: string;
  newsletterButtonText: string;
  newsletterSuccessText: string;
  launchBannerEyebrow: string;
  launchBannerTitle: string;
  launchBannerCtaText: string;
  launchBannerCtaLink: string;
  liveBannerEyebrow: string;
  liveBannerTitle: string;
  liveBannerCtaText: string;
  liveBannerCtaLink: string;
  productCardBackImageFirst: boolean;
  productCardShowPreviewBadge: boolean;
  productCardShowLiveBadges: boolean;
  productCardQuickAdd: boolean;
  productCardMetaText: string;
  reviewsEnabled: boolean;
  trustItemsPreLaunch: TrustItem[];
  trustItemsLiveShop: TrustItem[];
  faqItems: FaqItem[];
  legalBusinessName: string;
  legalBusinessDetails: string;
  contactEmail: string;
  whatsapp: string;
  instagram: string;
  tiktok: string;
  footerTagline: string;
  footerLocation: string;
  footerNewsletterText: string;
  footerTrustItems: string[];
  deliveryTitle: string;
  deliveryBody: string;
  returnsTitle: string;
  returnsBody: string;
  exchangeTitle: string;
  exchangeBody: string;
  legalIntro: string;
  privacyIntro: string;
  cookiesIntro: string;
  seoTitle: string;
  seoDescription: string;
  sections: Array<{ id: string; label: string; enabled: boolean }>;
  featuredProductIds: string[];
  featuredCollectionHandles: string[];
}

const defaults: SiteSettings = {
  siteMode: "pre-launch",
  logoText: "Trei Linii",
  favicon: "/favicon.png",
  announcementVisible: true,
  primaryColor: "#2b2a28",
  accentColor: "#ff006f",
  font: "Serif Editorial",
  announcement: "Acces early la prima colectie - intra pe lista, locuri limitate",
  launchDate: "",
  heroEyebrow: "Pre-lansare - Trei Linii",
  heroHeadline: "Fata curata.\nSpate care vorbeste.",
  heroSubcopy:
    "Tricouri oversized cu design minimalist pe spate. Croiala relaxata, material dens si grafica simpla, fara logo-uri mari pe piept.",
  heroPrimaryCtaText: "Vreau acces early",
  heroPrimaryCtaLink: "#newsletter",
  heroSecondaryCtaText: "Vezi conceptul",
  heroSecondaryCtaLink: "/about",
  heroBadges: "Croiala oversized - Design pe spate - Lansare in pregatire",
  conceptEyebrow: "Concept",
  conceptTitle: "Tricouri simple in fata, gandite sa arate bine din spate.",
  conceptBody:
    "Trei Linii porneste de la o idee clara: fit oversized, material dens (bumbac 100%, 240 g/mp) si design minimalist plasat pe spate. Fara logo mare pe piept, fara zgomot vizual inutil.",
  featuredEyebrowPreLaunch: "01 - Previzualizare modele",
  featuredEyebrowLiveShop: "01 - Modele disponibile",
  featuredTitlePreLaunch: "Primele directii.",
  featuredTitleLiveShop: "Alege modelul.",
  featuredLinkText: "Vezi modelele",
  collectionsEyebrow: "02 - Structura",
  collectionsTitle: "Fit, material si design pe spate.",
  lookbookEyebrow: "03 - Lookbook",
  lookbookTitle: "Cum cade tricoul.",
  lookbookLinkText: "Deschide lookbook",
  socialProofEyebrow: "Lookbook",
  socialProofTitle: "Fit-ul din spate.",
  socialProofCardTitle: "Designul sta pe spate.",
  socialProofCardText:
    "Fata ramane simpla. Grafica este plasata pe spate, gandita pentru un tricou purtabil zi de zi.",
  faqEyebrow: "04 - FAQ",
  faqTitle: "Intrebari utile.",
  faqLinkText: "Vezi toate intrebarile",
  newsletterEyebrowPreLaunch: "Lista de lansare",
  newsletterEyebrowLiveShop: "Noutati",
  newsletterTitlePreLaunch: "Afla primul cand se lanseaza.",
  newsletterTitleLiveShop: "Ramai aproape de urmatoarea lansare.",
  newsletterBody:
    "Inscrie-te si prinzi acces early la prima colectie, plus o reducere de bun venit la prima comanda. Stoc limitat per model. Scriem rar, doar ce conteaza.",
  newsletterButtonText: "Inscrie-te",
  newsletterSuccessText: "Email salvat. Te anuntam la lansare.",
  launchBannerEyebrow: "Acces early - locuri limitate",
  launchBannerTitle:
    "Primii inscrisi vad colectia inainte de lansare si primesc o reducere de bun venit la prima comanda.",
  launchBannerCtaText: "Prinde accesul early",
  launchBannerCtaLink: "/#newsletter",
  liveBannerEyebrow: "Oferta de lansare",
  liveBannerTitle: "Doua tricouri in cos pot debloca beneficii de livrare la finalizare.",
  liveBannerCtaText: "Vezi modelele",
  liveBannerCtaLink: "/shop",
  productCardBackImageFirst: true,
  productCardShowPreviewBadge: true,
  productCardShowLiveBadges: true,
  productCardQuickAdd: true,
  productCardMetaText: "Design pe spate",
  reviewsEnabled: false,
  trustItemsPreLaunch: [
    {
      id: "fit",
      title: "Croiala oversized",
      text: "Fit relaxat, gandit pentru purtare zilnica.",
      enabled: true,
    },
    {
      id: "back-design",
      title: "Design pe spate",
      text: "Fata ramane curata, grafica sta pe spate.",
      enabled: true,
    },
    {
      id: "size-exchange",
      title: "Schimb marime 14 zile",
      text: "Schimbi marimea daca nu se potriveste, simplu.",
      enabled: true,
    },
    {
      id: "launch-list",
      title: "Acces early",
      text: "Primii inscrisi cumpara inaintea publicului.",
      enabled: true,
    },
  ],
  trustItemsLiveShop: [
    {
      id: "delivery",
      title: "Livrare 2-3 zile",
      text: "Costul final se afiseaza la finalizare.",
      enabled: true,
    },
    {
      id: "returns",
      title: "Retur 14 zile",
      text: "Pentru produse nepurtate si curate.",
      enabled: true,
    },
    {
      id: "size-exchange",
      title: "Schimb marime",
      text: "Te ajutam sa alegi fit-ul potrivit.",
      enabled: true,
    },
    {
      id: "secure-payment",
      title: "Plata securizata",
      text: "Comanda se finalizeaza prin plata securizata.",
      enabled: true,
    },
  ],
  faqItems: [
    {
      id: "size",
      q: "Cum aleg marimea?",
      a: "Tricourile sunt gandite oversized. Alege marimea normala pentru un fit relaxat sau o marime mai mica pentru o cadere mai apropiata de corp.",
      enabled: true,
    },
    {
      id: "material",
      q: "Din ce material sunt tricourile?",
      a: "Bumbac 100%, material dens de 240 g/mp, cu textura stabila si cadere curata. Gramajul apare si pe pagina fiecarui produs.",
      enabled: true,
    },
    {
      id: "launch",
      q: "Cand se lanseaza primele modele?",
      a: "Lansarea este aproape. Inscrie-te pe lista pentru acces early, reducere de bun venit si stoc limitat la primele modele.",
      enabled: true,
    },
    {
      id: "checkout",
      q: "Cum va functiona comanda?",
      a: "Cand magazinul este activ, alegi marimea, adaugi produsul in cos si finalizezi comanda prin plata securizata.",
      enabled: true,
    },
  ],
  legalBusinessName: "",
  legalBusinessDetails: "",
  contactEmail: "contact@treilinii.ro",
  whatsapp: "",
  instagram: "https://instagram.com",
  tiktok: "https://tiktok.com",
  footerTagline: "Simplu in fata,\ndesign pe spate.",
  footerLocation: "Bucuresti",
  footerNewsletterText:
    "Afla cand apar primele modele si cand devine disponibila finalizarea comenzii.",
  footerTrustItems: ["Retur 14 zile", "Schimb marime", "Plata securizata la finalizare"],
  deliveryTitle: "Livrare",
  deliveryBody:
    "Comenzile sunt pregatite dupa confirmarea platii. Estimarea de livrare este afisata la finalizare, in functie de adresa si metoda disponibila.",
  returnsTitle: "Retur",
  returnsBody:
    "Conform legii (OUG 34/2014), ai dreptul de retur in 14 zile de la primire, fara a invoca un motiv. Produsele trebuie sa fie nepurtate, nespalate, fara urme de folosire si cu etichetele intacte. Rambursarea se face dupa receptia produsului returnat.",
  exchangeTitle: "Schimb marime",
  exchangeBody:
    "Daca marimea nu se potriveste, poti cere schimb cu o alta marime disponibila. Produsul trebuie sa fie nepurtat, nespalat si cu etichetele intacte.",
  legalIntro:
    "Termenii de utilizare si conditiile comerciale vor guverna comenzile plasate pe site dupa activarea magazinului.",
  privacyIntro:
    "Datele personale sunt folosite pentru procesarea comenzilor, comunicari de suport si mesaje trimise prin lista de lansare.",
  cookiesIntro:
    "Site-ul poate folosi cookies necesare pentru navigare, cos, formulare si masurarea performantei.",
  seoTitle: "Trei Linii - Tricouri oversized cu design pe spate",
  seoDescription:
    "Tricouri oversized cu fata curata si design minimalist pe spate. Croiala relaxata, material dens si modele simple.",
  sections: defaultSections.map((section) =>
    section.id === "reviews" ? { ...section, enabled: false } : section,
  ),
  featuredProductIds: ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"],
  featuredCollectionHandles: ["fit", "material", "spate", "grafica"],
};

interface Ctx extends SiteSettings {
  update: (patch: Partial<SiteSettings>) => void;
  toggleSection: (id: string) => void;
  updateFaqItem: (id: string, patch: Partial<FaqItem>) => void;
  updateTrustItem: (
    mode: "pre-launch" | "live-shop",
    id: string,
    patch: Partial<TrustItem>,
  ) => void;
  reset: () => void;
}

const SiteContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "trei-linii-site-v9";

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaults);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSettings({ ...defaults, ...JSON.parse(raw) });
    } catch {
      /* noop */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* noop */
    }
  }, [settings]);

  const value = useMemo<Ctx>(
    () => ({
      ...settings,
      update: (patch) => setSettings((s) => ({ ...s, ...patch })),
      toggleSection: (id) =>
        setSettings((s) => ({
          ...s,
          sections: s.sections.map((sec) =>
            sec.id === id ? { ...sec, enabled: !sec.enabled } : sec,
          ),
        })),
      updateFaqItem: (id, patch) =>
        setSettings((s) => ({
          ...s,
          faqItems: s.faqItems.map((item) => (item.id === id ? { ...item, ...patch } : item)),
        })),
      updateTrustItem: (mode, id, patch) =>
        setSettings((s) => {
          const key = mode === "pre-launch" ? "trustItemsPreLaunch" : "trustItemsLiveShop";
          return {
            ...s,
            [key]: s[key].map((item) => (item.id === id ? { ...item, ...patch } : item)),
          };
        }),
      reset: () => setSettings(defaults),
    }),
    [settings],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}

export function sectionEnabled(sections: SiteSettings["sections"], id: string) {
  return sections.find((s) => s.id === id)?.enabled ?? true;
}
