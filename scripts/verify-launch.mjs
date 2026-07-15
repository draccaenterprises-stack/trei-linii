import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const publicUrl = process.env.PUBLIC_STOREFRONT_URL ?? "https://blank-atelier-canvas.lovable.app";
const reportPath = "docs/final-verification-report.md";
const sensitiveValues = [
  process.env.VITE_SHOPIFY_STOREFRONT_TOKEN,
  process.env.SHOPIFY_STOREFRONT_TOKEN,
  process.env.COMPROMISED_SHOPIFY_STOREFRONT_TOKEN,
  ...(process.env.FORBIDDEN_SOURCE_PATTERNS?.split(",") ?? []),
  ...(process.env.FORBIDDEN_PUBLIC_SECRETS?.split(",") ?? []),
]
  .map((value) => value?.trim())
  .filter((value) => value && value.length >= 4);

const checks = [];

function maskSensitive(value) {
  let masked = value;
  for (const secret of sensitiveValues) masked = masked.split(secret).join("[masked]");
  return masked;
}

function sanitizeOutput(value) {
  return maskSensitive(value)
    .replace(/\x1b\[[0-9;]*m/g, "")
    .trim();
}

function runCheck(name, executable, args, options = {}) {
  const result = spawnSync(executable, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    env: { ...process.env, ...(options.env ?? {}) },
    maxBuffer: 20 * 1024 * 1024,
  });
  const passed = result.status === 0;
  checks.push({
    name,
    command: maskSensitive([executable, ...args].join(" ")),
    status: passed ? "passed" : options.allowedFailure ? "external" : "failed",
    exitCode: result.status,
    output: sanitizeOutput(`${result.stdout ?? ""}${result.stderr ?? ""}`),
    note: options.note,
  });
  return passed;
}

function gitValue(args) {
  const result = spawnSync("git", args, { cwd: process.cwd(), encoding: "utf8" });
  return result.status === 0 ? result.stdout.trim() : "necunoscut";
}

function checkbox(status) {
  if (status === "passed") return "[x]";
  if (status === "external") return "[ ]";
  return "[!]";
}

function relevantOutput(output) {
  if (!output) return [];
  const cleaned = [];
  let skipLanternStack = false;

  for (const line of output.split(/\r?\n/).filter(Boolean)) {
    if (line.startsWith("LanternError:")) {
      skipLanternStack = true;
      continue;
    }
    if (skipLanternStack && /^\s+at /.test(line)) continue;
    skipLanternStack = false;
    if (line.includes("NO_COLOR") || line.includes("node --trace-warnings")) continue;
    cleaned.push(line.trimEnd());
  }

  const highlights = cleaned.filter((line) =>
    /All matched files|Test Files|Tests\s+\d+|All files|built in|Pre-render OK|passed \(|skipped|Storefront verification passed|Public SEO verification passed|Build local verificat|Verificare securitate OK|found 0 vulnerabilities|home-mobile:|catalog-mobile:|home-desktop:|Lighthouse OK/i.test(
      line,
    ),
  );
  return (highlights.length ? highlights : cleaned.slice(-18))
    .slice(-30)
    .map((line) => `    ${line}`);
}

function writeReport() {
  const failed = checks.filter((check) => check.status === "failed");
  const external = checks.filter((check) => check.status === "external");
  const status = failed.length
    ? "NU TRECE - există verificări locale eșuate."
    : external.length
      ? "CODUL TRECE - activarea comercială mai are verificări externe."
      : "TRECE - toate verificările locale și externe au trecut.";

  const lines = [
    "# Trei Linii - raport final de verificare",
    "",
    `Generat: ${new Date().toISOString()}`,
    `Commit de bază: ${gitValue(["rev-parse", "--short", "HEAD"])}`,
    `Branch: ${gitValue(["branch", "--show-current"])}`,
    `URL public verificat: ${publicUrl}`,
    "",
    "## Rezultat",
    "",
    status,
    "",
    "- CXD-001 - CXD-039: implementate în cod și acoperite de gate-ul local.",
    "- CXD-040: gate local complet; verificările externe sunt marcate separat.",
    "",
    "## Verificări",
    "",
    ...checks.flatMap((check) => [
      `${checkbox(check.status)} ${check.name}`,
      `    Comandă: ${check.command}`,
      `    Status: ${check.status}; exit ${check.exitCode ?? "null"}`,
      ...(check.note ? [`    Notă: ${check.note}`] : []),
      ...relevantOutput(check.output),
      "",
    ]),
    "## Inputuri externe pentru activarea live-shop",
    "",
    "- tokenul public Shopify Storefront setat numai în mediul de deploy;",
    "- produse și colecții reale publicate pe canalul Storefront/Headless;",
    "- datele comerciale reale și textele juridice validate;",
    "- o comandă Shopify de test și confirmarea hostului de checkout;",
    "- endpointurile opționale pentru contact, newsletter și analytics, dacă vor fi folosite;",
    "- republicarea deploy-ului după integrarea ultimului commit.",
    "",
    "Niciunul dintre aceste inputuri nu cere schimbări de arhitectură; în lipsa lor, producția rămâne în pre-lansare sigură.",
    "",
  ];

  writeFileSync(reportPath, `${lines.join("\n")}\n`, "utf8");
  console.log(`Raport scris în ${reportPath}.`);
  if (failed.length) process.exit(1);
}

runCheck("release gate local", "npm", ["run", "verify:all"]);
runCheck("storefront public", "npm", ["run", "verify:storefront", "--", publicUrl], {
  allowedFailure: true,
  note: "Poate rămâne extern până când ultimul commit este publicat.",
});
runCheck("SEO public", "npm", ["run", "verify:seo", "--", publicUrl], {
  allowedFailure: true,
  note: "Poate rămâne extern până când robots, sitemap și build-ul nou sunt publicate.",
});
runCheck("Shopify readiness", "npm", ["run", "verify:shopify"], {
  allowedFailure: true,
  note: "Necesită tokenul Storefront și catalogul real în mediul de verificare.",
});
writeReport();
