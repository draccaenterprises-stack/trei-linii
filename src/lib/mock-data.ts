import p1a from "@/assets/product-1a.jpg";
import p2a from "@/assets/product-2a.jpg";
import p2b from "@/assets/product-2b.jpg";
import p3a from "@/assets/product-3a.jpg";
import p3b from "@/assets/product-3b.jpg";
import p4a from "@/assets/product-4a.jpg";
import p4b from "@/assets/product-4b.jpg";
import colEss from "@/assets/collection-essentials.jpg";
import colWashed from "@/assets/collection-washed.jpg";
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
  title: string;
  price: number;
  collection: string;
  collections?: string[];
  badge?: Badge;
  images: string[];
  description: string;
  vibe: string;
  fitNote: string;
  sizes: Size[];
  colors: ColorVariant[];
  stock: Record<Size, number>;
  variants?: ProductVariant[];
}

export const products: Product[] = [
  {
    id: "p1",
    handle: "tricou-oversized-linie-01",
    title: "Tricou Oversized Linie 01",
    price: 189,
    collection: "editia-unu",
    badge: "noutate",
    images: [p1a, p2a],
    description:
      "Tricou oversized cu fata curata si compozitie liniara pe spate. Gandit ca piesa de baza pentru prima lansare Trei Linii.",
    vibe: "Structura liniara inspirata din arhitectura industriala.",
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
    handle: "tricou-backprint-cadru-02",
    title: "Tricou Backprint Cadru 02",
    price: 219,
    collection: "editia-unu",
    badge: "limitat",
    images: [p2b, p2a],
    description:
      "Model cu print mai puternic pe spate si semn discret pe fata. Purtabil zilnic, fara incarcare vizuala inutila.",
    vibe: "Un cadru care incadreaza spatiul negativ ca pe o opera.",
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
    handle: "tricou-graphic-grid-03",
    title: "Tricou Graphic Grid 03",
    price: 239,
    collection: "editia-unu",
    badge: "stoc limitat",
    images: [p3b, p3a],
    description:
      "Directie grafica mai accentuata, construita pe forme simple si spatiu liber. Fata ramane minimalista.",
    vibe: "Grid modular construit din elemente repetate cu precizie.",
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
    handle: "tricou-washed-olive-04",
    title: "Tricou Washed Olive 04",
    price: 199,
    collection: "editia-unu",
    images: [p4b, p4a],
    description:
      "Baza olive cu aspect spalat, potrivita pentru tinute simple. Designul ramane concentrat pe silueta si spate.",
    vibe: "Culoare de camp, atitudine de oras.",
    fitNote: "Oversized pe marimea normala.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Olive", hex: "#6b7a3a" },
      { name: "Nisip", hex: "#c6b89a" },
    ],
    stock: { S: 9, M: 14, L: 7, XL: 5 },
  },
  {
    id: "p5",
    handle: "tricou-off-white-mark-05",
    title: "Tricou Off White Mark 05",
    price: 209,
    collection: "editia-doi",
    images: [p1a, p3a],
    description:
      "Tricou off-white cu semn frontal mic si grafica aerisita pe spate. Creat pentru o estetica urbana, curata.",
    vibe: "Minimalism extrem - o singura urma lasata intentionat.",
    fitNote: "Oversized echilibrat, bun pentru layering.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Off white", hex: "#f7f5ed" },
      { name: "Gri cald", hex: "#c8c2b8" },
    ],
    stock: { S: 8, M: 11, L: 9, XL: 2 },
  },
  {
    id: "p6",
    handle: "tricou-charcoal-type-06",
    title: "Tricou Charcoal Type 06",
    price: 229,
    collection: "editia-doi",
    badge: "noutate",
    images: [p3a, p4a],
    description:
      "Model charcoal cu compozitie tipografica pe spate. Contrast controlat, potrivit pentru tinute negre sau neutre.",
    vibe: "Tipografie ca design. Cuvantul ca motiv grafic.",
    fitNote: "Boxy oversized, cu umar coborat.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Charcoal", hex: "#2b2a28" },
      { name: "Negru", hex: "#111111" },
    ],
    stock: { S: 5, M: 9, L: 8, XL: 4 },
  },
  {
    id: "p7",
    handle: "tricou-washed-blue-07",
    title: "Tricou Washed Blue 07",
    price: 219,
    collection: "editia-doi",
    images: [p2a, p1a],
    description:
      "Albastru spalat, croiala relaxata si print discret pe spate. O varianta mai deschisa pentru sezonul cald.",
    vibe: "Spalat, decolorat, intentionat imperfect.",
    fitNote: "Relaxed oversized, cade drept pe corp.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Albastru spalat", hex: "#8aa9c8" },
      { name: "Os", hex: "#e8e3d6" },
    ],
    stock: { S: 6, M: 7, L: 5, XL: 1 },
  },
  {
    id: "p8",
    handle: "tricou-accent-line-08",
    title: "Tricou Accent Line 08",
    price: 239,
    collection: "editia-doi",
    badge: "limitat",
    images: [p4a, p2b],
    description:
      "Model cu accent cromatic fin si print de spate mai vizibil. Pastreaza fata curata si ritmul grafic al brandului.",
    vibe: "O linie. Un accent. Nimic in plus.",
    fitNote: "Oversized pronuntat. Alege marimea normala pentru efect complet.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Crem", hex: "#f1ead9" },
      { name: "Accent rosu", hex: "#e43d30" },
    ],
    stock: { S: 3, M: 6, L: 6, XL: 2 },
  },
];

export interface Collection {
  handle: string;
  title: string;
  description: string;
  image: string;
  count: number;
  productIds?: string[];
}

export const collections: Collection[] = [
  {
    handle: "editia-unu",
    title: "Editia I",
    description:
      "Prima serie Trei Linii. Patru interpretari ale aceleiasi reguli: fata linistita, constructie grafica pe spate.",
    image: colEss,
    count: 4,
  },
  {
    handle: "editia-doi",
    title: "Editia II",
    description:
      "O continuare mai tactila, cu tonuri spalate si compozitii mai ferme. Aceeasi croiala, un alt ritm.",
    image: colWashed,
    count: 4,
  },
];

export const lookbookImages = [
  { src: lb1, caption: "Fit oversized - vedere spate" },
  { src: lb2, caption: "Material dens - cadere relaxata" },
  { src: lb3, caption: "Design minimalist - purtare zilnica" },
];

export const reviews: Array<{ name: string; location: string; rating: number; text: string }> = [
  {
    name: "Alex",
    location: "Bucuresti",
    rating: 5,
    text: "Fit-ul oversized sta bine fara sa para largit aiurea. Materialul se simte dens.",
  },
  {
    name: "Mara",
    location: "Cluj",
    rating: 5,
    text: "Imi place ca fata ramane curata, iar printul de pe spate se vede exact cat trebuie.",
  },
  {
    name: "Vlad",
    location: "Timisoara",
    rating: 5,
    text: "Pare genul de tricou pe care il porti des, nu doar o piesa de poza.",
  },
];

export const faqs = [
  {
    q: "Cum aleg marimea?",
    a: "Tricourile sunt gandite oversized. Alege marimea normala pentru un fit relaxat sau o marime mai mica pentru o cadere mai apropiata de corp.",
  },
  {
    q: "Din ce material sunt tricourile?",
    a: "Bumbac 100%, material dens de 240 g/mp, cu guler stabil si croiala relaxata. Gramajul apare si pe fiecare pagina de produs.",
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
    a: "Modelele noi sunt anuntate prin update-uri de produs si pe canalele sociale ale brandului.",
  },
];

export const announcement = "Lansare in pregatire - Tricouri oversized cu design pe spate";

export const homepageSections = [
  { id: "hero", label: "Hero", enabled: true },
  { id: "featured-products", label: "Produse recomandate", enabled: true },
  { id: "collections", label: "Structura modele", enabled: true },
  { id: "lookbook", label: "Lookbook", enabled: true },
  { id: "reviews", label: "Recenzii", enabled: true },
  { id: "faq", label: "Intrebari frecvente", enabled: true },
  { id: "newsletter", label: "Noutati", enabled: true },
];
