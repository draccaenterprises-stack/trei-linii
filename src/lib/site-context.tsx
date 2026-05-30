import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { homepageSections as defaultSections } from "./mock-data";

export type SiteMode = "pre-launch" | "live-shop";

export interface SiteSettings {
  siteMode: SiteMode;
  logoText: string;
  favicon: string;
  announcementVisible: boolean;
  primaryColor: string;
  accentColor: string;
  font: "Serif Editorial" | "Sans Modern";
  announcement: string;
  heroHeadline: string;
  heroSubcopy: string;
  heroEyebrow: string;
  heroPrimaryCtaText: string;
  heroPrimaryCtaLink: string;
  heroSecondaryCtaText: string;
  heroSecondaryCtaLink: string;
  heroBadges: string;
  reviewsEnabled: boolean;
  legalBusinessName: string;
  legalBusinessDetails: string;
  contactEmail: string;
  whatsapp: string;
  instagram: string;
  tiktok: string;
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
  announcement: "Lansare in pregatire · Tricouri oversized cu design pe spate",
  heroEyebrow: "Pre-lansare · Trei Linii",
  heroHeadline: "Fata curata.\nSpate care vorbeste.",
  heroSubcopy:
    "Tricouri oversized cu design minimalist pe spate. Croiala relaxata, material dens si grafica simpla, fara logo-uri mari pe piept.",
  heroPrimaryCtaText: "Intra pe lista de lansare",
  heroPrimaryCtaLink: "#newsletter",
  heroSecondaryCtaText: "Vezi conceptul",
  heroSecondaryCtaLink: "/about",
  heroBadges: "Croiala oversized · Design pe spate · Lansare in pregatire",
  reviewsEnabled: false,
  legalBusinessName: "",
  legalBusinessDetails: "",
  contactEmail: "contact@treilinii.ro",
  whatsapp: "",
  instagram: "https://instagram.com",
  tiktok: "https://tiktok.com",
  seoTitle: "Trei Linii - Tricouri oversized cu design pe spate",
  seoDescription:
    "Tricouri oversized cu fata curata si design minimalist pe spate. Croiala relaxata, material dens si modele simple.",
  sections: defaultSections.map((section) =>
    section.id === "reviews" ? { ...section, enabled: false } : section,
  ),
  featuredProductIds: ["p1", "p3", "p2", "p4"],
  featuredCollectionHandles: ["tricouri", "spalate", "printuri"],
};

interface Ctx extends SiteSettings {
  update: (patch: Partial<SiteSettings>) => void;
  toggleSection: (id: string) => void;
  reset: () => void;
}

const SiteContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "trei-linii-site-v4";

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
