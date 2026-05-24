import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  announcement as defaultAnnouncement,
  homepageSections as defaultSections,
} from "./mock-data";

export interface SiteSettings {
  logoText: string;
  favicon: string;
  primaryColor: string;
  accentColor: string;
  font: "Serif Editorial" | "Sans Modern";
  announcement: string;
  heroHeadline: string;
  heroSubcopy: string;
  heroEyebrow: string;
  sections: Array<{ id: string; label: string; enabled: boolean }>;
  featuredProductIds: string[];
  featuredCollectionHandles: string[];
}

const defaults: SiteSettings = {
  logoText: "Trei Linii",
  favicon: "/favicon.png",
  primaryColor: "#2b2a28",
  accentColor: "#ff006f",
  font: "Serif Editorial",
  announcement: defaultAnnouncement,
  heroEyebrow: "Lansarea 01 — Trei Linii",
  heroHeadline: "Față curată.\nSpate care vorbește.",
  heroSubcopy:
    "Tricouri oversized din bumbac dens, create pentru purtare zilnică: semn discret în față, grafică mai puternică pe spate.",
  sections: defaultSections,
  featuredProductIds: ["p1", "p3", "p2", "p4"],
  featuredCollectionHandles: ["tricouri", "spalate", "printuri"],
};

interface Ctx extends SiteSettings {
  update: (patch: Partial<SiteSettings>) => void;
  toggleSection: (id: string) => void;
  reset: () => void;
}

const SiteContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "trei-linii-site-v3";

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
