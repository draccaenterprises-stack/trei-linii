const args = process.argv.slice(2);
const targetArg = args.find((arg) => !arg.startsWith("--"));
const minProductsArg = args.find((arg) => arg.startsWith("--min-products="));
const minProducts = Number(minProductsArg?.split("=")[1] ?? process.env.MIN_PRODUCTS ?? 0);
const checkPublicAdmin = args.includes("--check-public-admin");
const checkPublicAssets = args.includes("--check-public-assets");

const baseUrl = (targetArg ?? process.env.BASE_URL ?? "http://127.0.0.1:5175").replace(/\/$/, "");

const compromisedStorefrontTokenPattern = new RegExp(
  ["2e7349a2", "b51f0c348", "441461382", "242f23"].join(""),
  "i",
);

const routes = [
  "/",
  "/shop",
  "/collections",
  "/lookbook",
  "/about",
  "/faq",
  "/contact",
  "/cart",
  "/delivery",
  "/returns",
  "/exchange",
  "/terms",
  "/privacy",
  "/cookies",
  "/admin",
];

const forbiddenPatterns = [
  compromisedStorefrontTokenPattern,
  /\bmodel\s*\d+\b/i,
  /\bmodel\d+\b/i,
  /test pentru/i,
  /descriere model/i,
  /colectie\s*\d+\s*test/i,
  /frontend demo/i,
  /React \+ TypeScript frontend demo/i,
  /se completeaza/i,
  /finalizarea Shopify se conecteaza dupa configurare/i,
  /Publish or update your Lovable project/i,
  /Error loading preview URL bar/i,
];

const requiredByRoute = {
  "/": [/Trei Linii/i, /Fata curata/i, /Spate/i],
  "/shop": [/Modele|Magazin/i, /Previzualizare design spate|tricou/i],
  "/cart": [/cos/i],
  "/terms": [/Termeni/i],
  "/privacy": [/Confidentialitate/i],
  "/cookies": [/Cookies/i],
};

const compromisedSecretPatterns = [compromisedStorefrontTokenPattern];

const errors = [];

async function fetchText(path) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { "User-Agent": "Trei-Linii-storefront-verifier" },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return response.text();
}

function assetPathsFromHtml(html) {
  return [
    ...html.matchAll(
      /<(?:script|link)\b[^>]+(?:src|href)=["']([^"']+\.(?:js|css)(?:\?[^"']*)?)["']/gi,
    ),
  ]
    .map((match) => match[1])
    .filter((asset) => asset.startsWith("/") || asset.startsWith(baseUrl));
}

async function verifyPublicAssets(homeHtml) {
  const assetPaths = [...new Set(assetPathsFromHtml(homeHtml))];

  for (const assetPath of assetPaths) {
    const assetUrl = assetPath.startsWith("http") ? assetPath : `${baseUrl}${assetPath}`;
    const response = await fetch(assetUrl, {
      headers: { "User-Agent": "Trei-Linii-storefront-verifier" },
    });

    if (!response.ok) {
      errors.push(`asset ${assetPath}: nu poate fi verificat (${response.status})`);
      continue;
    }

    const assetText = await response.text();
    for (const pattern of compromisedSecretPatterns) {
      if (pattern.test(assetText)) {
        errors.push(`asset ${assetPath}: secret compromis gasit: ${pattern}`);
      }
    }
  }
}

let homeHtmlForAssets = "";

for (const route of routes) {
  try {
    const html = (await fetchText(route)).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (route === "/") homeHtmlForAssets = html;

    for (const pattern of forbiddenPatterns) {
      if (pattern.test(html)) {
        errors.push(`${route}: text interzis gasit: ${pattern}`);
      }
    }

    for (const pattern of requiredByRoute[route] ?? []) {
      if (!pattern.test(html)) {
        errors.push(`${route}: text obligatoriu lipsa: ${pattern}`);
      }
    }

    if (route === "/shop" && Number.isFinite(minProducts) && minProducts > 0) {
      const productCards = html.match(/<article\b/gi)?.length ?? 0;

      if (productCards < minProducts) {
        errors.push(
          `${route}: produse vizibile insuficiente (${productCards}/${minProducts}); probabil ruleaza o versiune Lovable nepublicata`,
        );
      }
    }

    if (route === "/admin" && checkPublicAdmin && !/Admin local dezactivat/i.test(html)) {
      errors.push("/admin: adminul local nu este dezactivat in build-ul public");
    }
  } catch (error) {
    errors.push(`${route}: nu poate fi verificat (${error.message})`);
  }
}

if (checkPublicAssets && homeHtmlForAssets) {
  try {
    await verifyPublicAssets(homeHtmlForAssets);
  } catch (error) {
    errors.push(`assets: nu pot fi verificate (${error.message})`);
  }
}

if (errors.length) {
  console.error(`Storefront verification failed for ${baseUrl}`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Storefront verification passed for ${baseUrl}`);
