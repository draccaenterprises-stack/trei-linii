import p1a from "@/assets/product-1a.jpg";
import p2a from "@/assets/product-2a.jpg";
import p2b from "@/assets/product-2b.webp";
import p3a from "@/assets/product-3a.jpg";
import p3b from "@/assets/product-3b.jpg";
import p4a from "@/assets/product-4a.jpg";
import p4b from "@/assets/product-4b.jpg";
import colEss from "@/assets/collection-essentials.jpg";
import colWashed from "@/assets/collection-washed.jpg";
import type { Collection, Product } from "./catalog-types";

export type {
  Badge,
  Collection,
  ColorVariant,
  Product,
  ProductVariant,
  Size,
} from "./catalog-types";

type PreviewProductFixture = Omit<Product, "isPreview" | "media" | "money" | "status">;

const productFixtures: PreviewProductFixture[] = [
  {
    id: "p1",
    handle: "tricou-oversized-linie-01",
    title: "Tricou Oversized Linie 01",
    price: 189,
    collection: "editia-unu",
    badge: "noutate",
    images: [p1a, p2a],
    description:
      "Tricou oversized cu fața curată și compoziție liniară pe spate. Gândit ca piesă de bază pentru prima lansare Trei Linii.",
    vibe: "Structură liniară inspirată din arhitectura industrială.",
    fitNote: "Croială oversized. Alege mărimea normală pentru o cădere relaxată.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Crem", hex: "#f1ead9" },
      { name: "Cărbune", hex: "#2b2a28" },
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
      "Model cu print mai puternic pe spate și semn discret pe față. Purtabil zilnic, fără încărcare vizuală inutilă.",
    vibe: "Un cadru care încadrează spațiul negativ ca pe o operă.",
    fitNote: "Oversized relaxat, cu umeri ușor căzuți.",
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
      "Direcție grafică mai accentuată, construită pe forme simple și spațiu liber. Fața rămâne minimalistă.",
    vibe: "Grid modular construit din elemente repetate cu precizie.",
    fitNote: "Boxy oversized. Cade ușor sub șold.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Cărbune", hex: "#2b2a28" },
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
      "Bază olive cu aspect spălat, potrivită pentru ținute simple. Designul rămâne concentrat pe siluetă și spate.",
    vibe: "Culoare de câmp, atitudine de oraș.",
    fitNote: "Oversized pe mărimea normală.",
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
      "Tricou off-white cu semn frontal mic și grafică aerisită pe spate. Creat pentru o estetică urbană, curată.",
    vibe: "Minimalism reținut - o singură urmă lăsată intenționat.",
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
      "Model charcoal cu compoziție tipografică pe spate. Contrast controlat, potrivit pentru ținute negre sau neutre.",
    vibe: "Tipografie ca design. Cuvântul ca motiv grafic.",
    fitNote: "Boxy oversized, cu umăr coborât.",
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
      "Albastru spălat, croială relaxată și print discret pe spate. O variantă mai deschisă pentru sezonul cald.",
    vibe: "Spălat, decolorat, intenționat imperfect.",
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
      "Model cu accent cromatic fin și print de spate mai vizibil. Păstrează fața curată și ritmul grafic al brandului.",
    vibe: "O linie. Un accent. Nimic în plus.",
    fitNote: "Oversized pronunțat. Alege mărimea normală pentru efect complet.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Crem", hex: "#f1ead9" },
      { name: "Accent rosu", hex: "#e43d30" },
    ],
    stock: { S: 3, M: 6, L: 6, XL: 2 },
  },
];

export const products: Product[] = productFixtures.map((product) => ({
  ...product,
  isPreview: true,
  status: "preview",
  money: { amount: product.price, currencyCode: "RON" },
  media: product.images.map((url, index) => ({
    url,
    alt: `${product.title} - imagine ${index + 1}`,
  })),
}));

export const collections: Collection[] = [
  {
    handle: "editia-unu",
    title: "Ediția I",
    description:
      "Prima serie Trei Linii. Patru interpretări ale aceleiași reguli: față liniștită, construcție grafică pe spate.",
    image: colEss,
    count: 4,
  },
  {
    handle: "editia-doi",
    title: "Ediția II",
    description:
      "O continuare mai tactilă, cu tonuri spălate și compoziții mai ferme. Aceeași croială, un alt ritm.",
    image: colWashed,
    count: 4,
  },
];
