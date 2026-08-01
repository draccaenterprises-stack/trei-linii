export type Badge = "noutate" | "limitat" | "stoc limitat";
export type Size = string;
export type ProductStatus = "active" | "sold-out" | "preview";

export interface Money {
  amount: number;
  currencyCode: string;
}

export interface ProductMedia {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

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
  money: Money;
  price: number;
  status: ProductStatus;
  isPreview?: boolean;
  collection: string;
  collections?: string[];
  badge?: Badge;
  media: ProductMedia[];
  images: string[];
  description: string;
  descriptionParagraphs?: string[];
  vibe: string;
  fitNote: string;
  sizes: Size[];
  colors: ColorVariant[];
  stock: Record<Size, number>;
  variants?: ProductVariant[];
}

export interface Collection {
  handle: string;
  title: string;
  description: string;
  image: string;
  count: number;
  productIds?: string[];
}
