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

export type Badge = "noutate" | "limitat" | "stoc limitat";
export type Size = string;

export interface ColorVariant {
  name: string;
  hex: string;
}

export interface ProductVariant {
  id: string;
  size: Size;
  color: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
}

export interface Product {
  id: string;
  handle: string;
  shopifyHandle?: string;
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
  variants?: ProductVariant[];
}

export const products: Product[] = [
  {
    id: "p1",
    handle: "previzualizare-oversized-01",
    title: "Previzualizare oversized 01",
    price: 189,
    collection: "fit",
    images: [p1a],
    description:
      "Previzualizare pentru directia Trei Linii: tricou oversized cu fata curata si design minimalist pe spate.",
    fitNote: "Croiala oversized. Alege marimea normala pentru o cadere relaxata.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Crem", hex: "#f1ead9" },
      { name: "Carbune", hex: "#2b2a28" },
    ],
    stock: { S: 12, M: 8, L: 4, XL: 0 },
  },
  {
    id: "p2",
    handle: "previzualizare-spate-02",
    title: "Previzualizare design spate 02",
    price: 219,
    collection: "spate",
    images: [p2b, p2a],
    description:
      "Previzualizare pentru grafica de spate: compozitie simpla, purtabila, fara logo mare pe piept.",
    fitNote: "Oversized relaxat, cu umeri usor cazuti.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Albastru spalat", hex: "#8aa9c8" },
      { name: "Os", hex: "#e8e3d6" },
    ],
    stock: { S: 6, M: 10, L: 12, XL: 3 },
  },
  {
    id: "p3",
    handle: "previzualizare-grafica-03",
    title: "Previzualizare grafica 03",
    price: 239,
    collection: "grafica",
    images: [p3b, p3a],
    description:
      "Previzualizare pentru o directie mai puternica de print pe spate, pastrand fata tricoului curata.",
    fitNote: "Boxy oversized. Cade usor sub sold.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Carbune", hex: "#2b2a28" },
      { name: "Negru spalat", hex: "#1a1a1a" },
    ],
    stock: { S: 2, M: 5, L: 6, XL: 1 },
  },
  {
    id: "p4",
    handle: "previzualizare-olive-04",
    title: "Previzualizare olive 04",
    price: 199,
    collection: "fit",
    images: [p4b, p4a],
    description:
      "Previzualizare pentru o baza de culoare olive, gandita pentru un tricou simplu si usor de purtat.",
    fitNote: "Oversized pe marimea normala.",
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
    handle: "fit",
    title: "Fit oversized",
    description: "Croiala relaxata, umeri cazuti si proportii curate.",
    image: colEss,
    count: 2,
  },
  {
    handle: "material",
    title: "Material dens",
    description: "Textura stabila si senzatie premium la purtare.",
    image: colWashed,
    count: 1,
  },
  {
    handle: "spate",
    title: "Design pe spate",
    description: "Fata curata, grafica minimalista plasata pe spate.",
    image: colGraphics,
    count: 1,
  },
];

export const lookbookImages = [
  { src: lb1, caption: "Fit oversized - vedere spate" },
  { src: lb2, caption: "Material dens - cadere relaxata" },
  { src: lb3, caption: "Design minimalist - purtare zilnica" },
];

export const reviews: Array<{ name: string; location: string; rating: number; text: string }> = [];

export const faqs = [
  {
    q: "Cum aleg marimea?",
    a: "Tricourile sunt gandite oversized. Alege marimea normala pentru un fit relaxat sau o marime mai mica pentru o cadere mai apropiata de corp.",
  },
  {
    q: "Din ce material sunt tricourile?",
    a: "Directia brandului este bumbac dens, cu guler stabil si croiala relaxata. Specificatiile exacte apar pe fiecare pagina de produs.",
  },
  {
    q: "Unde este plasat designul?",
    a: "Designul principal este pe spatele tricoului. Fata ramane curata, fara logo mare pe piept.",
  },
  {
    q: "Pot returna produsul?",
    a: "Returul este disponibil in 14 zile pentru produse nepurtate, nespalate si cu etichetele intacte.",
  },
  {
    q: "Cand apar modele noi?",
    a: "Modelele noi sunt anuntate prin lista de lansare si pe canalele sociale ale brandului.",
  },
];

export const announcement = "Lansare in pregatire - Tricouri oversized cu design pe spate";

export const homepageSections = [
  { id: "hero", label: "Hero", enabled: true },
  { id: "featured-products", label: "Produse recomandate", enabled: true },
  { id: "collections", label: "Structura modele", enabled: true },
  { id: "lookbook", label: "Lookbook", enabled: true },
  { id: "reviews", label: "Recenzii", enabled: false },
  { id: "faq", label: "Intrebari frecvente", enabled: true },
  { id: "newsletter", label: "Noutati", enabled: true },
];
