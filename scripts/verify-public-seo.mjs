const args = process.argv.slice(2);
const targetArg = args.find((arg) => !arg.startsWith("--"));
const baseUrl = (
  targetArg ??
  process.env.PUBLIC_STOREFRONT_URL ??
  "https://blank-atelier-canvas.lovable.app"
).replace(/\/$/, "");

const requiredSitemapRoutes = [
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
const forbiddenSitemapRoutes = ["/admin", "/cart"];
const forbiddenText = [/trebuie schimbat/i, /todo/i, /frontend demo/i, /publish or update/i];
const errors = [];

async function fetchText(path) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { "User-Agent": "Trei-Linii-seo-verifier" },
  });

  if (!response.ok) throw new Error(`${path}: ${response.status} ${response.statusText}`);
  return response.text();
}

async function fetchOk(path) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { "User-Agent": "Trei-Linii-seo-verifier" },
  });

  if (!response.ok) errors.push(`${path}: status ${response.status}`);
  const contentType = response.headers.get("content-type") ?? "";
  return { response, contentType };
}

function routeUrl(route) {
  return `${baseUrl}${route === "/" ? "" : route}`;
}

function routeFromUrl(url) {
  if (url === baseUrl) return "/";
  return url.startsWith(baseUrl) ? url.slice(baseUrl.length) || "/" : url;
}

function verifyNoForbiddenText(label, text) {
  for (const pattern of forbiddenText) {
    if (pattern.test(text)) errors.push(`${label}: text interzis gasit: ${pattern}`);
  }
}

const [robots, sitemap] = await Promise.all([
  fetchText("/robots.txt").catch((error) => {
    errors.push(error.message);
    return "";
  }),
  fetchText("/sitemap.xml").catch((error) => {
    errors.push(error.message);
    return "";
  }),
]);

if (robots) {
  verifyNoForbiddenText("robots.txt", robots);
  if (!/User-agent:\s*\*/i.test(robots)) errors.push("robots.txt: lipseste User-agent: *");
  if (!/Allow:\s*\//i.test(robots)) errors.push("robots.txt: lipseste Allow: /");
  if (!/Disallow:\s*\/admin/i.test(robots)) errors.push("robots.txt: lipseste Disallow: /admin");
  if (
    !new RegExp(
      `Sitemap:\\s*${baseUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/sitemap\\.xml`,
      "i",
    ).test(robots)
  ) {
    errors.push("robots.txt: sitemap URL nu corespunde domeniului public verificat");
  }
}

if (sitemap) {
  verifyNoForbiddenText("sitemap.xml", sitemap);
  if (!/<urlset\b/i.test(sitemap)) errors.push("sitemap.xml: lipseste urlset");

  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((match) => match[1].trim());
  const routes = locs.map(routeFromUrl);

  for (const route of requiredSitemapRoutes) {
    if (!locs.includes(routeUrl(route))) errors.push(`sitemap.xml: lipseste ruta ${route}`);
  }
  for (const route of forbiddenSitemapRoutes) {
    if (routes.includes(route)) errors.push(`sitemap.xml: ruta neindexabila prezenta ${route}`);
  }
  for (const loc of locs) {
    if (!loc.startsWith(baseUrl)) errors.push(`sitemap.xml: URL extern/neasteptat ${loc}`);
  }
}

for (const route of requiredSitemapRoutes) {
  await fetchOk(route);
}

const favicon = await fetchOk("/favicon.png");
if (favicon.contentType && !favicon.contentType.includes("image/")) {
  errors.push(`/favicon.png: content-type neasteptat ${favicon.contentType}`);
}

const ogImage = await fetchOk("/og-image.jpg");
if (ogImage.contentType && !ogImage.contentType.includes("image/")) {
  errors.push(`/og-image.jpg: content-type neasteptat ${ogImage.contentType}`);
}

if (errors.length) {
  console.error(`Public SEO verification failed for ${baseUrl}`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Public SEO verification passed for ${baseUrl}`);
