import { indexableRoutes, nonIndexableRoutes } from "../src/lib/routes";

const args = process.argv.slice(2);
const targetArg = args.find((arg) => !arg.startsWith("--"));
const baseUrl = (
  targetArg ??
  process.env.PUBLIC_STOREFRONT_URL ??
  "https://blank-atelier-canvas.lovable.app"
).replace(/\/$/, "");
const errors: string[] = [];

async function fetchResponse(path: string) {
  return fetch(`${baseUrl}${path}`, {
    headers: { "User-Agent": "Trei-Linii-seo-verifier" },
    signal: AbortSignal.timeout(15_000),
  });
}

async function fetchText(path: string) {
  const response = await fetchResponse(path);
  if (!response.ok) throw new Error(`${path}: status ${response.status}`);
  return response.text();
}

const [robots, sitemap] = await Promise.all([
  fetchText("/robots.txt").catch((error: Error) => {
    errors.push(error.message);
    return "";
  }),
  fetchText("/sitemap.xml").catch((error: Error) => {
    errors.push(error.message);
    return "";
  }),
]);

if (!/User-agent:\s*\*/i.test(robots)) errors.push("robots.txt: lipsește User-agent: *");
if (!/Allow:\s*\//i.test(robots)) errors.push("robots.txt: lipsește Allow: /");
if (!/Sitemap:\s*https?:\/\/[^\s]+\/sitemap\.xml/i.test(robots)) {
  errors.push("robots.txt: lipsește URL-ul absolut pentru sitemap");
}
for (const route of nonIndexableRoutes) {
  if (!robots.includes(`Disallow: ${route}`))
    errors.push(`robots.txt: lipsește Disallow: ${route}`);
}

const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((match) => match[1]?.trim() ?? "");
const sitemapPaths = locs.flatMap((loc) => {
  try {
    return [new URL(loc).pathname.replace(/\/$/, "") || "/"];
  } catch {
    errors.push(`sitemap.xml: URL invalid ${loc}`);
    return [];
  }
});
if (!/<urlset\b/i.test(sitemap)) errors.push("sitemap.xml: lipsește urlset");
for (const route of indexableRoutes) {
  if (!sitemapPaths.includes(route)) errors.push(`sitemap.xml: lipsește ruta ${route}`);
}
for (const route of nonIndexableRoutes) {
  if (sitemapPaths.includes(route)) errors.push(`sitemap.xml: include ruta neindexabilă ${route}`);
}

for (const route of indexableRoutes) {
  try {
    const response = await fetchResponse(route);
    if (!response.ok) {
      errors.push(`${route}: status ${response.status}`);
      continue;
    }
    const html = await response.text();
    if (!/<title>[^<]+<\/title>/i.test(html)) errors.push(`${route}: lipsește title SSR`);
    if (!/<meta\b[^>]*name=["']description["']/i.test(html)) {
      errors.push(`${route}: lipsește meta description SSR`);
    }
    if (/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) {
      errors.push(`${route}: noindex pe rută indexabilă`);
    }
    const canonical = html.match(
      /<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i,
    )?.[1];
    const canonicalPath = canonical
      ? new URL(canonical, baseUrl).pathname.replace(/\/$/, "") || "/"
      : null;
    if (canonicalPath !== route) errors.push(`${route}: canonical incorect`);
  } catch (error) {
    errors.push(`${route}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

for (const asset of ["/favicon-64.png", "/apple-touch-icon.png", "/og-image.jpg"]) {
  try {
    const response = await fetchResponse(asset);
    if (!response.ok) errors.push(`${asset}: status ${response.status}`);
    if (!(response.headers.get("content-type") ?? "").startsWith("image/")) {
      errors.push(`${asset}: content-type nu este imagine`);
    }
  } catch (error) {
    errors.push(`${asset}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

try {
  const admin = await fetch(`${baseUrl}/admin`, {
    redirect: "manual",
    signal: AbortSignal.timeout(15_000),
  });
  if (admin.status !== 404) errors.push(`/admin: status ${admin.status}, așteptat 404`);
} catch (error) {
  errors.push(`/admin: ${error instanceof Error ? error.message : String(error)}`);
}

if (errors.length) {
  console.error(`Public SEO verification failed for ${baseUrl}`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Public SEO verification passed for ${baseUrl}.`);
