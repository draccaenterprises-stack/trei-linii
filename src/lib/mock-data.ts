import p1a from "@/assets/product-1a.jpg";
import p1b from "@/assets/product-1b.jpg";
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

export type Badge = "new drop" | "limited" | "best seller";
export type Size = "S" | "M" | "L" | "XL";

export interface ColorVariant {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  price: number; // RON
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
    handle: "atelier-01-oversized-tee",
    title: "Atelier 01 Oversized Tee",
    price: 189,
    collection: "essentials",
    badge: "new drop",
    images: [p1b, p1a],
    description:
      "The opening statement. A heavyweight 240 gsm cotton tee cut to an exaggerated boxy silhouette with dropped shoulders and a discreet front mark. Built to age slowly.",
    fitNote: "Oversized fit. Size down for a relaxed fit, true to size for oversized.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Cream", hex: "#f1ead9" },
      { name: "Charcoal", hex: "#2b2a28" },
    ],
    stock: { S: 12, M: 8, L: 4, XL: 0 },
  },
  {
    id: "p2",
    handle: "washed-city-tee",
    title: "Washed City Tee",
    price: 219,
    collection: "washed",
    badge: "best seller",
    images: [p2b, p2a],
    description:
      "Garment-dyed and tumbled for a softened hand. Back-printed with a faded mid-century cityscape rendered in washed monochrome.",
    fitNote: "Relaxed oversized. Cotton softens further with every wash.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Washed Blue", hex: "#8aa9c8" },
      { name: "Bone", hex: "#e8e3d6" },
    ],
    stock: { S: 6, M: 10, L: 12, XL: 3 },
  },
  {
    id: "p3",
    handle: "signal-backprint-tee",
    title: "Signal Backprint Tee",
    price: 239,
    collection: "graphics",
    badge: "limited",
    images: [p3b, p3a],
    description:
      "A heavy backprint in washed red sits against deep charcoal cotton. Small chest signal mark, large back graphic. Limited run of 200.",
    fitNote: "Boxy oversized. Drops past the hip.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Charcoal", hex: "#2b2a28" },
      { name: "Off Black", hex: "#1a1a1a" },
    ],
    stock: { S: 2, M: 5, L: 6, XL: 1 },
  },
  {
    id: "p4",
    handle: "olive-studio-tee",
    title: "Olive Studio Tee",
    price: 199,
    collection: "essentials",
    images: [p4b, p4a],
    description:
      "Studio uniform in dusty olive. Heavyweight cotton with reinforced collar and a barely-there embroidered atelier mark.",
    fitNote: "True to size oversized. Slight drop shoulder.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Olive", hex: "#6b7a3a" },
      { name: "Sand", hex: "#c6b89a" },
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
    handle: "essentials",
    title: "Essentials",
    description: "The atelier basics — the pieces we build everything else around.",
    image: colEss,
    count: 2,
  },
  {
    handle: "washed",
    title: "Washed",
    description: "Garment-dyed and tumbled. Soft hand, lived-in feel.",
    image: colWashed,
    count: 1,
  },
  {
    handle: "graphics",
    title: "Graphics",
    description: "Strong back prints. Quiet front marks. Limited runs only.",
    image: colGraphics,
    count: 1,
  },
];

export const lookbookImages = [
  { src: lb1, caption: "Volume I — Concrete Hours" },
  { src: lb2, caption: "Volume I — Field Notes" },
  { src: lb3, caption: "Volume I — Crossings" },
];

export const reviews = [
  {
    name: "Alex M.",
    location: "Bucharest",
    rating: 5,
    text: "The cotton is genuinely heavy. Fit is perfect, drape is the best part. Worth the price.",
  },
  {
    name: "Iulia D.",
    location: "Cluj-Napoca",
    rating: 5,
    text: "Bought two — the cream and the olive. The packaging alone tells you what the brand is about.",
  },
  {
    name: "Vlad P.",
    location: "Timișoara",
    rating: 5,
    text: "The back print on the Signal tee is unreal. Quiet from the front, statement from the back.",
  },
];

export const faqs = [
  {
    q: "How does the fit run?",
    a: "All tees are designed oversized. If you prefer a relaxed (not exaggerated) fit, size down one. The fit note on each product page is the most reliable guide.",
  },
  {
    q: "What is the fabric?",
    a: "240 gsm heavyweight long-staple cotton, knitted and finished in Portugal. Pre-shrunk, garment-dyed where noted.",
  },
  {
    q: "Where do you ship?",
    a: "We currently ship across the EU. Orders inside Romania arrive in 2–3 working days. EU orders 4–7 days.",
  },
  {
    q: "What is your return policy?",
    a: "Unworn items can be returned within 30 days. Limited drops are final sale and clearly marked.",
  },
  {
    q: "When do new drops happen?",
    a: "Roughly every six weeks. Subscribe to the newsletter for the date and time of release.",
  },
];

export const announcement = "Free shipping in RO over 350 RON · Volume I now shipping worldwide";

export const homepageSections = [
  { id: "hero", label: "Hero", enabled: true },
  { id: "featured-products", label: "Featured Products", enabled: true },
  { id: "collections", label: "Collections", enabled: true },
  { id: "lookbook", label: "Lookbook Preview", enabled: true },
  { id: "reviews", label: "Reviews", enabled: true },
  { id: "faq", label: "FAQ Preview", enabled: true },
  { id: "newsletter", label: "Newsletter", enabled: true },
];
