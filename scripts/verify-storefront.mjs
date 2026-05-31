const args = process.argv.slice(2);
const targetArg = args.find((arg) => !arg.startsWith("--"));
const minProductsArg = args.find((arg) => arg.startsWith("--min-products="));
const minProducts = Number(minProductsArg?.split("=")[1] ?? process.env.MIN_PRODUCTS ?? 0);

const baseUrl = (targetArg ?? process.env.BASE_URL ?? "http://127.0.0.1:5175").replace(/\/$/, "");

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
];

const forbiddenPatterns = [
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

for (const route of routes) {
  try {
    const html = (await fetchText(route)).normalize("NFD").replace(/[\u0300-\u036f]/g, "");

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
  } catch (error) {
    errors.push(`${route}: nu poate fi verificat (${error.message})`);
  }
}

if (errors.length) {
  console.error(`Storefront verification failed for ${baseUrl}`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Storefront verification passed for ${baseUrl}`);
