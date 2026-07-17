import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { indexableRoutes, nonIndexableRoutes } from "../src/lib/routes";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function productionEnv() {
  try {
    return Object.fromEntries(
      readFileSync(resolve(root, ".env.production"), "utf8")
        .split(/\r?\n/)
        .filter((line) => line && !line.startsWith("#") && line.includes("="))
        .map((line) => {
          const index = line.indexOf("=");
          return [line.slice(0, index), line.slice(index + 1)];
        }),
    );
  } catch {
    return {};
  }
}

const fileEnv = productionEnv();
const siteUrl = (
  process.env.VITE_SITE_URL ||
  fileEnv.VITE_SITE_URL ||
  "https://blank-atelier-canvas.lovable.app"
).replace(/\/$/, "");
const storeDomain = process.env.VITE_SHOPIFY_STORE_DOMAIN || fileEnv.VITE_SHOPIFY_STORE_DOMAIN;
const token =
  process.env.SHOPIFY_STOREFRONT_TOKEN ||
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
  process.env.VITE_SHOPIFY_STOREFRONT_TOKEN ||
  fileEnv.VITE_SHOPIFY_STOREFRONT_TOKEN;
const apiVersion =
  process.env.VITE_SHOPIFY_API_VERSION || fileEnv.VITE_SHOPIFY_API_VERSION || "2026-01";

async function productHandles(): Promise<string[]> {
  if (!storeDomain || !token) return [];

  try {
    const response = await fetch(`https://${storeDomain}/api/${apiVersion}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({
        query: "query SitemapProducts { products(first: 100) { nodes { handle } } }",
      }),
      signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = (await response.json()) as {
      data?: { products?: { nodes?: Array<{ handle?: string }> } };
      errors?: Array<{ message: string }>;
    };
    if (payload.errors?.length) throw new Error(payload.errors[0]?.message ?? "GraphQL error");
    return (
      payload.data?.products?.nodes?.map((product) => product.handle ?? "").filter(Boolean) ?? []
    );
  } catch (error) {
    console.warn(
      `Sitemap: produsele Shopify nu au putut fi citite (${error instanceof Error ? error.message : String(error)}).`,
    );
    return [];
  }
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

const handles = await productHandles();
const routes = [...indexableRoutes, ...handles.map((handle) => `/product/${handle}`)];
const today = new Date().toISOString().slice(0, 10);
const urls = routes
  .map((route) => {
    const loc = `${siteUrl}${route === "/" ? "" : route}`;
    const priority = route === "/" ? "1.0" : route === "/shop" ? "0.9" : "0.6";
    return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  })
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
const robots = [
  "User-agent: *",
  "Allow: /",
  ...nonIndexableRoutes.map((route) => `Disallow: ${route}`),
  "",
  `Sitemap: ${siteUrl}/sitemap.xml`,
  "",
].join("\n");

writeFileSync(resolve(root, "public/sitemap.xml"), xml, "utf8");
writeFileSync(resolve(root, "public/robots.txt"), robots, "utf8");
console.log(`SEO files generated: ${routes.length} indexable URLs (${handles.length} products).`);
