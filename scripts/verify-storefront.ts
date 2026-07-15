import { indexableRoutes } from "../src/lib/routes";

const args = process.argv.slice(2);
const targetArg = args.find((arg) => !arg.startsWith("--"));
const baseUrl = (targetArg ?? process.env.BASE_URL ?? "http://127.0.0.1:4175").replace(/\/$/, "");
const checkPublicAssets = !args.includes("--skip-assets");
const forbiddenPublicSecrets = [
  process.env.COMPROMISED_SHOPIFY_STOREFRONT_TOKEN,
  ...(process.env.FORBIDDEN_PUBLIC_SECRETS?.split(",") ?? []),
]
  .map((secret) => secret?.trim())
  .filter((secret): secret is string => Boolean(secret && secret.length >= 4));

const routes = [...indexableRoutes, "/cart"];
const forbiddenPatterns = [
  /Blank Atelier/i,
  /Edit with Lovable/i,
  /frontend demo/i,
  /React \+ TypeScript frontend demo/i,
  /trebuie schimbat/i,
  /Publish or update your Lovable project/i,
  /47 de persoane/i,
  /9 persoane au produsul/i,
  /Lorem ipsum/i,
  /descriere model/i,
  /test pentru/i,
];
const requiredByRoute: Partial<Record<(typeof routes)[number], RegExp[]>> = {
  "/": [/Trei Linii/i],
  "/shop": [/Colecții în capitole|Colecțiile se pregătesc|Catalogul revine/i],
  "/shop/lista": [/Toate modelele|Colecțiile se pregătesc|Catalogul revine/i],
  "/manifest": [/De ce\s*(?:<!-- -->)?\s*Trei Linii|Manifest/i],
  "/cart": [/Coș/i],
  "/termeni-si-conditii": [/Termeni și condiții/i],
  "/confidentialitate": [/Confidențialitate/i],
  "/cookies": [/Cookies/i],
};
const errors: string[] = [];

function normalize(value: string) {
  return value.normalize("NFC");
}

async function fetchRoute(path: string, redirect: RequestRedirect = "follow") {
  return fetch(`${baseUrl}${path}`, {
    redirect,
    headers: { "User-Agent": "Trei-Linii-storefront-verifier" },
    signal: AbortSignal.timeout(15_000),
  });
}

function assetPathsFromHtml(html: string) {
  return [
    ...html.matchAll(
      /<(?:script|link)\b[^>]+(?:src|href)=["']([^"']+\.(?:js|css)(?:\?[^"']*)?)["']/gi,
    ),
  ]
    .map((match) => match[1] ?? "")
    .filter((asset) => asset.startsWith("/") || asset.startsWith(baseUrl));
}

function canonicalPath(html: string) {
  const match = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  if (!match?.[1]) return null;
  try {
    return new URL(match[1], baseUrl).pathname.replace(/\/$/, "") || "/";
  } catch {
    return null;
  }
}

async function verifyAssets(homeHtml: string) {
  for (const assetPath of new Set(assetPathsFromHtml(homeHtml))) {
    const assetUrl = assetPath.startsWith("http") ? assetPath : `${baseUrl}${assetPath}`;
    const response = await fetch(assetUrl, {
      headers: { "User-Agent": "Trei-Linii-storefront-verifier" },
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) {
      errors.push(`asset ${assetPath}: status ${response.status}`);
      continue;
    }

    const assetText = await response.text();
    for (const secret of forbiddenPublicSecrets) {
      if (assetText.includes(secret))
        errors.push(`asset ${assetPath}: valoare interzisă în bundle`);
    }
    for (const pattern of forbiddenPatterns) {
      if (pattern.test(assetText)) errors.push(`asset ${assetPath}: conținut demo ${pattern}`);
    }
  }
}

let homeHtml = "";
for (const route of routes) {
  try {
    const response = await fetchRoute(route);
    if (!response.ok) {
      errors.push(`${route}: status ${response.status}`);
      continue;
    }
    const html = normalize(await response.text());
    if (route === "/") homeHtml = html;

    if (!/<html\b/i.test(html) || !/<main\b/i.test(html)) {
      errors.push(`${route}: documentul SSR nu conține structura HTML principală`);
    }
    if (!/<title>[^<]+<\/title>/i.test(html)) errors.push(`${route}: lipsește title SSR`);
    if (!/<meta\b[^>]*name=["']description["'][^>]*content=["'][^"']+/i.test(html)) {
      errors.push(`${route}: lipsește meta description SSR`);
    }

    const expectedPath = route.replace(/\/$/, "") || "/";
    if (canonicalPath(html) !== expectedPath) {
      errors.push(`${route}: canonical absent sau indică altă rută`);
    }
    const hasNoIndex = /<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
    if (route === "/cart" && !hasNoIndex) errors.push("/cart: lipsește noindex");
    if (route !== "/cart" && hasNoIndex) errors.push(`${route}: rută indexabilă marcată noindex`);

    for (const pattern of forbiddenPatterns) {
      if (pattern.test(html)) errors.push(`${route}: conținut interzis ${pattern}`);
    }
    for (const pattern of requiredByRoute[route] ?? []) {
      if (!pattern.test(html)) errors.push(`${route}: text esențial absent ${pattern}`);
    }
  } catch (error) {
    errors.push(`${route}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

try {
  const admin = await fetchRoute("/admin", "manual");
  if (admin.status !== 404)
    errors.push(`/admin: trebuie să răspundă 404, răspunde ${admin.status}`);
} catch (error) {
  errors.push(`/admin: ${error instanceof Error ? error.message : String(error)}`);
}

if (checkPublicAssets && homeHtml) await verifyAssets(homeHtml);

if (errors.length) {
  console.error(`Storefront verification failed for ${baseUrl}`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Storefront verification passed for ${baseUrl} (${routes.length} routes).`);
