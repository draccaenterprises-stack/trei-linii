import p1a from "@/assets/product-1a.jpg";
import p2a from "@/assets/product-2a.jpg";
import p2b from "@/assets/product-2b.jpg";
import p3a from "@/assets/product-3a.jpg";
import p3b from "@/assets/product-3b.jpg";
import p4a from "@/assets/product-4a.jpg";
import p4b from "@/assets/product-4b.jpg";
import colEss from "@/assets/collection-essentials.jpg";
import colWashed from "@/assets/collection-washed.jpg";
import colGraphics from "@/assets/collection-graphics.jpg";
import lb1 from "@/assets/lookbook-1.jpg";
import lb2 from "@/assets/lookbook-2.jpg";
import lb3 from "@/assets/lookbook-3.jpg";

export type Badge = "noutate" | "limitat" | "cel mai vândut";
export type Size = "S" | "M" | "L" | "XL";

export interface ColorVariant {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  price: number;
  collection: string;
  badge?: Badge;
  images: string[];
  description: string;
  fitNote: string;
  sizes: Size[];
  colors: ColorVariant[];
  stock: Record<Size, number>;
}

export const products: Product[] = [
  {
    id: "p1",
    handle: "tricou-oversized-linia-01",
    title: "Tricou Oversized Linia 01",
    price: 189,
    collection: "tricouri",
    badge: "noutate",
    images: [p1a],
    description:
      "Primul model Trei Linii. Tricou din bumbac dens, 240 gsm, cu croială boxy oversized, umeri căzuți și semn discret pe față. Creat pentru purtare zilnică.",
    fitNote:
      "Croială oversized. Alege mărimea normală pentru oversized sau o mărime mai mică pentru o croială relaxată.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Crem", hex: "#f1ead9" },
      { name: "Cărbune", hex: "#2b2a28" },
    ],
    stock: { S: 12, M: 8, L: 4, XL: 0 },
  },
  {
    id: "p2",
    handle: "tricou-spalat-urban",
    title: "Tricou Spălat Urban",
    price: 219,
    collection: "spalate",
    badge: "cel mai vândut",
    images: [p2b, p2a],
    description:
      "Tricou garment-dyed, spălat pentru o textură moale și un aspect purtat natural. Print pe spate cu grafică urbană estompată.",
    fitNote: "Oversized relaxat. Bumbacul devine mai moale după fiecare spălare.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Albastru spălat", hex: "#8aa9c8" },
      { name: "Os", hex: "#e8e3d6" },
    ],
    stock: { S: 6, M: 10, L: 12, XL: 3 },
  },
  {
    id: "p3",
    handle: "tricou-backprint-semnal",
    title: "Tricou Backprint Semnal",
    price: 239,
    collection: "printuri",
    badge: "limitat",
    images: [p3b, p3a],
    description:
      "Print mare pe spate în roșu spălat, aplicat pe bumbac charcoal. Semn mic pe piept, grafică puternică pe spate. Serie limitată.",
    fitNote: "Boxy oversized. Cade ușor sub șold.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Cărbune", hex: "#2b2a28" },
      { name: "Negru spălat", hex: "#1a1a1a" },
    ],
    stock: { S: 2, M: 5, L: 6, XL: 1 },
  },
  {
    id: "p4",
    handle: "tricou-studio-olive",
    title: "Tricou Studio Olive",
    price: 199,
    collection: "tricouri",
    images: [p4b, p4a],
    description:
      "Uniformă de studio în olive prăfuit. Bumbac greu, guler întărit și marcaj Trei Linii aproape invizibil.",
    fitNote: "Oversized pe mărimea normală. Umăr ușor căzut.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Olive", hex: "#6b7a3a" },
      { name: "Nisip", hex: "#c6b89a" },
    ],
    stock: { S: 9, M: 14, L: 7, XL: 5 },
  },
];

export interface Collection {
  handle: string;
  title: string;
  description: string;
  image: string;
  count: number;
}

export const collections: Collection[] = [
  {
    handle: "tricouri",
    title: "Tricouri",
    description: "Modelele de bază Trei Linii: bumbac greu, croială curată, purtare zilnică.",
    image: colEss,
    count: 2,
  },
  {
    handle: "spalate",
    title: "Spălate",
    description: "Culori spălate, textură moale și aspect natural purtat.",
    image: colWashed,
    count: 1,
  },
  {
    handle: "printuri",
    title: "Printuri",
    description: "Față curată, printuri mai puternice pe spate și serii limitate.",
    image: colGraphics,
    count: 1,
  },
];

export const lookbookImages = [
  { src: lb1, caption: "Lansarea 01 — Ore de beton" },
  { src: lb2, caption: "Lansarea 01 — Note de teren" },
  { src: lb3, caption: "Lansarea 01 — Traversări" },
];

export const reviews = [
  {
    name: "Alex M.",
    location: "București",
    rating: 5,
    text: "Bumbacul chiar se simte gros. Croiala cade foarte bine și arată premium.",
  },
  {
    name: "Iulia D.",
    location: "Cluj-Napoca",
    rating: 5,
    text: "Am luat două: crem și olive. Ambalarea și materialul fac diferența.",
  },
  {
    name: "Vlad P.",
    location: "Timișoara",
    rating: 5,
    text: "Printul de pe spate e exact cât trebuie: față simplă, spate cu personalitate.",
  },
];

export const faqs = [
  {
    q: "Cum aleg mărimea?",
    a: "Toate tricourile sunt gândite oversized. Pentru o croială relaxată, alege o mărime mai mică. Pentru oversized complet, alege mărimea normală.",
  },
  {
    q: "Din ce material sunt tricourile?",
    a: "Bumbac greu, 240 gsm, pre-shrunk. Modelele spălate sunt vopsite și finisate pentru textură mai moale.",
  },
  {
    q: "Unde livrați?",
    a: "În demo livrarea este doar simulată. În producție, livrarea și taxele vor fi calculate la finalizarea comenzii în Shopify.",
  },
  {
    q: "Pot returna produsul?",
    a: "Da, politica finală de retur va fi administrată prin Shopify. Recomandarea este retur în 14 zile pentru produse nepurtate.",
  },
  {
    q: "Când apar modele noi?",
    a: "Lansările vor fi organizate în serii limitate. Abonarea la newsletter va anunța data și produsele noi.",
  },
];

export const announcement =
  "Transport gratuit în România peste 350 RON · Lansarea 01 disponibilă în curând";

export const homepageSections = [
  { id: "hero", label: "Hero", enabled: true },
  { id: "featured-products", label: "Produse recomandate", enabled: true },
  { id: "collections", label: "Categorii", enabled: true },
  { id: "lookbook", label: "Editorial", enabled: true },
  { id: "reviews", label: "Recenzii", enabled: true },
  { id: "faq", label: "Întrebări frecvente", enabled: true },
  { id: "newsletter", label: "Newsletter", enabled: true },
];
