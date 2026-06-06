// Generates public/sitemap.xml from the list of public routes.
// Run: node scripts/generate-sitemap.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const SITE_URL = "https://blank-atelier-canvas.lovable.app";

// Public, indexable static routes. Excludes /admin and /cart.
const routes = [
  "/",
  "/shop",
  "/collections",
  "/lookbook",
  "/about",
  "/contact",
  "/faq",
  "/size-guide",
  "/delivery",
  "/returns",
  "/exchange",
  "/terms",
  "/privacy",
  "/cookies",
];

// Public product detail pages (dynamic /product/$handle).
const productHandles = [
  "tricou-oversized-linie-01",
  "tricou-backprint-cadru-02",
  "tricou-graphic-grid-03",
  "tricou-washed-olive-04",
  "tricou-off-white-mark-05",
  "tricou-charcoal-type-06",
  "tricou-washed-blue-07",
  "tricou-accent-line-08",
];

const today = new Date().toISOString().slice(0, 10);

const urlEntries = [
  ...routes.map((route) => ({
    loc: `${SITE_URL}${route === "/" ? "" : route}`,
    priority: route === "/" ? "1.0" : "0.7",
  })),
  ...productHandles.map((handle) => ({
    loc: `${SITE_URL}/product/${handle}`,
    priority: "0.6",
  })),
];

const urls = urlEntries
  .map(
    (e) =>
      `  <url>\n    <loc>${e.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, "../public/sitemap.xml");
writeFileSync(out, xml, "utf8");
console.log(`sitemap.xml written with ${urlEntries.length} routes -> ${out}`);
