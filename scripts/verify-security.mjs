import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { extname, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const errors = [];
const textExtensions = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".mjs",
  ".cjs",
  ".json",
  ".md",
  ".css",
  ".html",
  ".xml",
  ".txt",
  ".yml",
  ".yaml",
]);
const secretPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bshpat_[A-Za-z0-9]{20,}\b/,
  /\bgh[opsu]_[A-Za-z0-9]{30,}\b/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bsk_(?:live|proj)_[A-Za-z0-9_-]{20,}\b/,
  /\bglpat-[A-Za-z0-9_-]{20,}\b/,
];
const forbiddenPublicEnv = /\bVITE_[A-Z0-9_]*(?:SECRET|PRIVATE_KEY|ADMIN_TOKEN)[A-Z0-9_]*\b/;
const forbiddenClaims = [
  /47 de persoane/i,
  /9 persoane au produsul/i,
  /review nou/i,
  /frontend demo/i,
  /Edit with Lovable/i,
  /Blank Atelier/i,
];
const forbiddenValues = [
  process.env.COMPROMISED_SHOPIFY_STOREFRONT_TOKEN,
  ...(process.env.FORBIDDEN_SOURCE_PATTERNS?.split(",") ?? []),
  ...(process.env.FORBIDDEN_PUBLIC_SECRETS?.split(",") ?? []),
]
  .map((value) => value?.trim())
  .filter((value) => value && value.length >= 4);

function listFiles() {
  const sourceFiles = execFileSync(
    "rg",
    [
      "--files",
      "--hidden",
      "-0",
      "-g",
      "!node_modules/**",
      "-g",
      "!.git/**",
      "-g",
      "!.output/**",
      "-g",
      "!coverage/**",
      "-g",
      "!playwright-report/**",
      "-g",
      "!test-results/**",
      "-g",
      "!reports/**",
    ],
    { cwd: root },
  )
    .toString()
    .split("\0")
    .filter(Boolean);

  if (!existsSync(resolve(root, ".output"))) return sourceFiles;
  const builtFiles = execFileSync("rg", ["--files", "-0", ".output"], { cwd: root })
    .toString()
    .split("\0")
    .filter(Boolean);
  return [...new Set([...sourceFiles, ...builtFiles])];
}

const files = listFiles();
for (const file of files) {
  if (!textExtensions.has(extname(file)) && !file.startsWith(".env")) continue;
  const absolutePath = resolve(root, file);
  if (!existsSync(absolutePath)) continue;
  const source = readFileSync(absolutePath, "utf8");

  for (const pattern of secretPatterns) {
    if (pattern.test(source)) errors.push(`${file}: posibil secret (${pattern})`);
  }
  if (forbiddenPublicEnv.test(source))
    errors.push(`${file}: secret declarat cu prefix public VITE_`);
  for (const value of forbiddenValues) {
    if (source.includes(value)) errors.push(`${file}: valoare interzisă detectată`);
  }
  if (file.startsWith("src/") || file.startsWith("public/") || file.startsWith(".output/public/")) {
    for (const pattern of forbiddenClaims) {
      if (pattern.test(source)) errors.push(`${file}: conținut public neverificabil (${pattern})`);
    }
  }
}

if (existsSync(resolve(root, "src/routes/admin.tsx"))) {
  errors.push("Ruta publică src/routes/admin.tsx există încă.");
}

for (const publicMcpPath of [
  "src/routes/mcp.ts",
  "src/routes/[.mcp]",
  "src/routes/[.well-known]/oauth-protected-resource.ts",
  "src/lib/mcp",
]) {
  if (existsSync(resolve(root, publicMcpPath))) {
    errors.push(`${publicMcpPath}: serverul MCP public nu trebuie inclus în storefront.`);
  }
}

const packageJson = readFileSync(resolve(root, "package.json"), "utf8");
if (packageJson.includes('"@lovable.dev/mcp-js"')) {
  errors.push("package.json: dependența MCP publică nu trebuie inclusă în storefront.");
}

const routeRegistry = readFileSync(resolve(root, "src/lib/routes.ts"), "utf8");
for (const legacyMcpRoute of ["/mcp", "/.mcp", "/.well-known/oauth-protected-resource"]) {
  if (routeRegistry.includes(`"${legacyMcpRoute}"`)) {
    errors.push(`src/lib/routes.ts: marcajul MCP vechi ${legacyMcpRoute} nu trebuie inclus.`);
  }
}

const productionEnv = readFileSync(resolve(root, ".env.production"), "utf8");
if (/^VITE_SHOPIFY_STOREFRONT_TOKEN=\S+/m.test(productionEnv)) {
  errors.push(
    ".env.production: tokenul Storefront trebuie furnizat de mediul de deploy, nu din repo.",
  );
}
if (!/^VITE_SITE_MODE=pre-launch$/m.test(productionEnv)) {
  errors.push(".env.production: modul implicit trebuie să rămână pre-launch.");
}
if (/^VITE_ENABLE_E2E_COMMERCE_FIXTURE=(?:true|1)$/m.test(productionEnv)) {
  errors.push(".env.production: fixture-ul comercial E2E nu poate fi activ în producție.");
}

const headers = readFileSync(resolve(root, "public/_headers"), "utf8");
for (const header of [
  "Content-Security-Policy",
  "Strict-Transport-Security",
  "X-Content-Type-Options",
  "X-Frame-Options",
  "Referrer-Policy",
  "Permissions-Policy",
]) {
  if (!headers.includes(header)) errors.push(`public/_headers: lipsește ${header}`);
}
for (const forbiddenDirective of ["'unsafe-eval'", "default-src *", "script-src *"]) {
  if (headers.includes(forbiddenDirective)) {
    errors.push(`public/_headers: directivă CSP nesigură ${forbiddenDirective}`);
  }
}

if (errors.length) {
  console.error(`Verificarea de securitate a eșuat:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}

console.log(`Verificare securitate OK: ${files.length} fișiere sursă/build scanate.`);
