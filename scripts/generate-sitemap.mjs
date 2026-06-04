// Generates public/sitemap.xml from the list of public routes.
// Run: node scripts/generate-sitemap.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const SITE_URL = "https://blank-atelier-canvas.lovable.app";

// Public, indexable routes. Excludes /admin, /cart and dynamic /product/$handle.
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

const today = new Date().toISOString().slice(0, 10);

const urls = routes
  .map((route) => {
    const priority = route === "/" ? "1.0" : "0.7";
    return `  <url>\n    <loc>${SITE_URL}${route === "/" ? "" : route}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  })
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, "../public/sitemap.xml");
writeFileSync(out, xml, "utf8");
console.log(`sitemap.xml written with ${routes.length} routes -> ${out}`);
