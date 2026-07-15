import { createContext, useContext, type ReactNode } from "react";
import { homepageSections as defaultSections } from "./brand-content";
import { LEGAL, SITE_MODE, externalConfig } from "./site";

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
  customerAccountRequired: boolean;
  customerAccountUrl: string;
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
  siteMode: SITE_MODE,
  logoText: "Trei Linii",
  favicon: "/favicon-64.png",
  announcementVisible: true,
  primaryColor: "#2b2a28",
  accentColor: "#d40059",
  font: "Serif Editorial",
  announcement: "Trei Linii - design pe spate - București",
  launchDate: "",
  heroEyebrow: "Design pe spate / fit oversized",
  heroHeadline: "Tricouri care spun orașul din spate.",
  heroSubcopy:
    "Tricouri cu fața curată și design construit pe spate. Fiecare piesă își arată materialul, croiala și disponibilitatea direct în pagina de produs.",
  heroPrimaryCtaText: "Vezi shop",
  heroPrimaryCtaLink: "/shop",
  heroSecondaryCtaText: "Conceptul",
  heroSecondaryCtaLink: "/about",
  heroBadges: "Croială oversized - Design pe spate - Material specificat pe produs",
  conceptEyebrow: "Concept",
  conceptTitle: "Tricouri simple în față, gândite să arate bine din spate.",
  conceptBody:
    "Trei Linii pornește de la o regulă simplă: fața rămâne curată, iar ideea se construiește pe spate. Specificațiile fiecărei piese apar clar în pagina produsului, fără zgomot vizual inutil.",
  featuredEyebrowPreLaunch: "01 - Selecție în pregătire",
  featuredEyebrowLiveShop: "01 - Modele disponibile",
  featuredTitlePreLaunch: "Primele direcții.",
  featuredTitleLiveShop: "Alege modelul.",
  featuredLinkText: "Vezi modelele",
  collectionsEyebrow: "02 - Structura",
  collectionsTitle: "Fit, material și design pe spate.",
  lookbookEyebrow: "03 - Lookbook",
  lookbookTitle: "Cum cade tricoul.",
  lookbookLinkText: "Deschide lookbook",
  socialProofEyebrow: "Lookbook",
  socialProofTitle: "Fit-ul din spate.",
  socialProofCardTitle: "Designul stă pe spate.",
  socialProofCardText:
    "Fața rămâne simplă. Grafica este plasată pe spate, gândită pentru un tricou purtabil zi de zi.",
  faqEyebrow: "04 - FAQ",
  faqTitle: "Întrebări utile.",
  faqLinkText: "Vezi toate întrebările",
  newsletterEyebrowPreLaunch: "Noutăți produs",
  newsletterEyebrowLiveShop: "Noutăți",
  newsletterTitlePreLaunch: "Primește noutăți despre colecție.",
  newsletterTitleLiveShop: "Rămâi aproape de următoarea lansare.",
  newsletterBody:
    "Lasă emailul și primești noutăți despre modele, stoc și lansări. Scriem rar, doar ce contează.",
  newsletterButtonText: "Mă abonez",
  newsletterSuccessText: "Email salvat. Îți trimitem noutăți despre colecție.",
  launchBannerEyebrow: "Următoarea ediție",
  launchBannerTitle:
    "Modele oversized cu fața curată și design pe spate, construite pentru purtare zilnică.",
  launchBannerCtaText: "Vezi shop",
  launchBannerCtaLink: "/shop",
  liveBannerEyebrow: "Selecția Trei Linii",
  liveBannerTitle: "Alege piesele care funcționează împreună în garderoba ta.",
  liveBannerCtaText: "Vezi modelele",
  liveBannerCtaLink: "/shop",
  productCardBackImageFirst: true,
  productCardShowPreviewBadge: true,
  productCardShowLiveBadges: true,
  productCardQuickAdd: true,
  productCardMetaText: "Design pe spate",
  customerAccountRequired: externalConfig.shopify.customerAccountRequired,
  customerAccountUrl: externalConfig.shopify.customerAccountUrl,
  trustItemsPreLaunch: [
    {
      id: "fit",
      title: "Croială oversized",
      text: "Fit relaxat, gândit pentru purtare zilnică.",
      enabled: true,
    },
    {
      id: "back-design",
      title: "Design pe spate",
      text: "Fața rămâne curată, grafica stă pe spate.",
      enabled: true,
    },
    {
      id: "size-exchange",
      title: "Schimb mărime",
      text: "Schimbul este posibil în limita stocului disponibil.",
      enabled: true,
    },
    {
      id: "launch-list",
      title: "Detalii clare",
      text: "Specificațiile sunt confirmate pe fiecare produs.",
      enabled: true,
    },
  ],
  trustItemsLiveShop: [
    {
      id: "delivery",
      title: "Livrare urmărită",
      text: "Termenul și costul sunt afișate în checkout.",
      enabled: true,
    },
    {
      id: "returns",
      title: "Retur 14 zile",
      text: "Pentru produse nepurtate și curate.",
      enabled: true,
    },
    {
      id: "size-exchange",
      title: "Schimb mărime",
      text: "Te ajutăm să alegi fit-ul potrivit.",
      enabled: true,
    },
    {
      id: "secure-payment",
      title: "Plată securizată",
      text: "Comanda se finalizează prin checkout securizat.",
      enabled: true,
    },
  ],
  faqItems: [
    {
      id: "size",
      q: "Cum aleg mărimea?",
      a: "Tricourile sunt gândite oversized. Alege mărimea normală pentru un fit relaxat sau o mărime mai mică pentru o cădere mai apropiată de corp.",
      enabled: true,
    },
    {
      id: "material",
      q: "Din ce material sunt tricourile?",
      a: "Materialul și compoziția pot varia între piese. Specificațiile exacte apar pe pagina fiecărui produs.",
      enabled: true,
    },
    {
      id: "launch",
      q: "Când se lansează primele modele?",
      a: "Colecția este pregătită în serii compacte. Lasă emailul pentru noutăți despre stoc și lansări.",
      enabled: true,
    },
    {
      id: "checkout",
      q: "Cum va funcționa comanda?",
      a: "Când magazinul este activ, alegi mărimea, adaugi produsul în coș și finalizezi comanda prin checkout-ul securizat.",
      enabled: true,
    },
  ],
  legalBusinessName: LEGAL.company,
  legalBusinessDetails: [LEGAL.cui && `CUI ${LEGAL.cui}`, LEGAL.regCom, LEGAL.address]
    .filter(Boolean)
    .join(" - "),
  contactEmail: LEGAL.email,
  whatsapp: externalConfig.social.whatsapp,
  instagram: externalConfig.social.instagram,
  tiktok: externalConfig.social.tiktok,
  footerTagline: "Simplu în față,\ndesign pe spate.",
  footerLocation: "București",
  footerNewsletterText:
    "Află când apar primele modele și când devine disponibilă finalizarea comenzii.",
  footerTrustItems: ["Retur conform politicii", "Schimb de mărime în limita stocului"],
  deliveryTitle: "Livrare",
  deliveryBody:
    "Comenzile sunt pregătite după confirmarea plății. Estimarea de livrare este afișată la finalizare, în funcție de adresă și metoda disponibilă.",
  returnsTitle: "Retur",
  returnsBody:
    "Conform legii (OUG 34/2014), ai dreptul de retur în 14 zile de la primire, fără a invoca un motiv. Produsele trebuie să fie nepurtate, nespălate, fără urme de folosire și cu etichetele intacte. Rambursarea se face după recepția produsului returnat.",
  exchangeTitle: "Schimb mărime",
  exchangeBody:
    "Dacă mărimea nu se potrivește, poți cere schimb cu o altă mărime disponibilă. Produsul trebuie să fie nepurtat, nespălat și cu etichetele intacte.",
  legalIntro:
    "Termenii de utilizare și condițiile comerciale vor guverna comenzile plasate pe site după activarea magazinului.",
  privacyIntro:
    "Datele personale sunt folosite pentru procesarea comenzilor, comunicări de suport și noutăți despre produse.",
  cookiesIntro:
    "Site-ul poate folosi cookies necesare pentru navigare, coș, formulare și măsurarea performanței.",
  seoTitle: "Trei Linii - Tricouri oversized cu design pe spate",
  seoDescription:
    "Tricouri cu fața curată și design minimalist pe spate. Descoperă colecțiile Trei Linii și detaliile fiecărei piese.",
  sections: defaultSections,
  featuredProductIds: ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"],
  featuredCollectionHandles: ["fit", "material", "spate", "grafica"],
};

type Ctx = SiteSettings;

const SiteContext = createContext<Ctx | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  return <SiteContext.Provider value={defaults}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}

export function sectionEnabled(sections: SiteSettings["sections"], id: string) {
  return sections.find((s) => s.id === id)?.enabled ?? true;
}
