import {
  editorialCounterweight,
  editorialGravity,
  editorialConfluence,
} from "@/lib/brand-images";

export const lookbookImages = [
  { src: editorialCounterweight, caption: "Contragreutate - vedere din spate" },
  { src: editorialGravity, caption: "Gravitație - lumină naturală" },
  { src: editorialConfluence, caption: "Confluență - purtare zilnică" },
];

export const homepageSections = [
  { id: "hero", label: "Hero", enabled: true },
  { id: "featured-products", label: "Produse recomandate", enabled: true },
  { id: "collections", label: "Structură modele", enabled: true },
  { id: "lookbook", label: "Lookbook", enabled: true },
  { id: "faq", label: "Întrebări frecvente", enabled: true },
  { id: "newsletter", label: "Noutăți", enabled: true },
];
