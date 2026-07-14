import type { Product } from "./catalog-types";

export function buildSiteSchema({
  siteUrl,
  siteName,
  logo,
  image,
  description,
  email,
}: {
  siteUrl: string;
  siteName: string;
  logo: string;
  image: string;
  description: string;
  email?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: siteName,
        url: siteUrl,
        logo,
        image,
        description,
        ...(email ? { email } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: siteName,
        inLanguage: "ro-RO",
        publisher: { "@id": `${siteUrl}/#organization` },
      },
    ],
  };
}

export function buildProductSchema({
  product,
  url,
  purchasable,
}: {
  product: Product;
  url: string;
  purchasable: boolean;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    url,
    brand: { "@type": "Brand", name: "Trei Linii" },
    ...(product.images.length ? { image: product.images } : {}),
    ...(purchasable
      ? {
          offers: {
            "@type": "Offer",
            price: product.money.amount,
            priceCurrency: product.money.currencyCode,
            availability: "https://schema.org/InStock",
            url,
          },
        }
      : {}),
  };
}

export function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value)
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029");
}
