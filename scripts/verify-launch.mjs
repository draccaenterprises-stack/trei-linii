import { existsSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

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
  .filter(Boolean);

const checks = [];

function runCheck(name, commandLine, options = {}) {
  const result = spawnSync(commandLine, {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: true,
    env: { ...process.env, ...(options.env ?? {}) },
  });

  checks.push({
    name,
    command: options.commandLabel ?? maskSensitive(commandLine),
    status: result.status === 0 ? "passed" : options.allowedFailure ? "blocked" : "failed",
    exitCode: result.status,
    output: sanitizeOutput(`${result.stdout ?? ""}${result.stderr ?? ""}`),
    note: options.note,
  });

  return result;
}

function runAudit() {
  const hadPackageLock = existsSync("package-lock.json");
  const installResult = runCheck(
    "npm audit lockfile",
    "npm install --package-lock-only --ignore-scripts",
  );

  if (installResult.status === 0) {
    runCheck("dependency audit", "npm audit --audit-level=moderate");
  }

  if (!hadPackageLock && existsSync("package-lock.json")) {
    rmSync("package-lock.json", { force: true });
  }
}

function runSourceSecretScan() {
  const envPatterns = process.env.FORBIDDEN_SOURCE_PATTERNS?.split(",") ?? [];
  const patterns = [
    ...envPatterns.map((pattern) => pattern.trim()).filter(Boolean),
    "React \\+ TypeScript frontend demo",
    "frontend demo",
  ];
  const commandLine = `rg -n "${patterns.join("|")}" src public .env.example --glob "!routeTree.gen.ts"`;
  const result = spawnSync(commandLine, {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: true,
  });

  checks.push({
    name: "source secret/demo scan",
    command: 'rg -n "<forbidden patterns>" src public .env.example --glob "!routeTree.gen.ts"',
    status: result.status === 1 ? "passed" : "failed",
    exitCode: result.status,
    output: sanitizeOutput(`${result.stdout ?? ""}${result.stderr ?? ""}`),
    note: "Exit 1 inseamna ca rg nu a gasit match-uri.",
  });
}

function gitValue(args) {
  const result = spawnSync("git", args, {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
  });

  return result.status === 0 ? result.stdout.trim() : "necunoscut";
}

function checkbox(status) {
  if (status === "passed") return "[x]";
  if (status === "blocked") return "[ ]";
  return "[!]";
}

function summarizeOutput(output) {
  if (!output) return "";

  return output
    .split(/\r?\n/)
    .filter(Boolean)
    .slice(-12)
    .map((line) => `    ${line}`)
    .join("\n");
}

function sanitizeOutput(output) {
  return maskSensitive(output)
    .replace(/\x1b\[[0-9;]*m/g, "")
    .replace(/[^\x09\x0a\x0d\x20-\x7e]/g, "?")
    .trim();
}

function maskSensitive(value) {
  let masked = value;
  for (const secret of sensitiveValues) {
    if (secret.length < 4) continue;
    masked = masked.split(secret).join("[masked]");
  }

  return masked;
}

function writeReport() {
  const failed = checks.filter((check) => check.status === "failed");
  const blocked = checks.filter((check) => check.status === "blocked");
  const commit = gitValue(["rev-parse", "--short", "HEAD"]);
  const branch = gitValue(["branch", "--show-current"]);

  const lines = [
    "# Trei Linii - raport final de verificare",
    "",
    `Generat: ${new Date().toISOString()}`,
    `Commit: ${commit}`,
    `Branch: ${branch}`,
    `URL public verificat: ${publicUrl}`,
    "",
    "## Rezultat",
    "",
    failed.length
      ? "Status: NU TRECE. Exista verificari locale esuate."
      : blocked.length
        ? "Status: PARTIAL. Codul public trece verificarile locale, dar exista blocaje externe inainte de lansare completa."
        : "Status: TRECE. Verificarile automate locale si publice au trecut.",
    "",
    "## Verificari automate",
    "",
    ...checks.flatMap((check) => [
      `${checkbox(check.status)} ${check.name}`,
      `    Comanda: ${check.command}`,
      `    Status: ${check.status}, exit ${check.exitCode}`,
      ...(check.note ? [`    Nota: ${check.note}`] : []),
      ...(check.output ? ["    Output relevant:", summarizeOutput(check.output)] : []),
      "",
    ]),
    "## Blocaje inainte de comenzi reale",
    "",
    "- Token Shopify Storefront nou, rotit si setat in Lovable env.",
    "- Produse reale publicate pe canalul Shopify Headless.",
    "- Test checkout real Shopify cu o comanda de test.",
    "- Date firma reale si politici legale finale validate pentru Romania.",
    "- Klaviyo configurat sau newsletter dezactivat daca nu se foloseste.",
    "",
  ];

  writeFileSync(reportPath, `${lines.join("\n")}\n`);

  if (failed.length) {
    console.error(`Launch verification failed. Report written to ${reportPath}`);
    process.exit(1);
  }

  console.log(`Launch verification report written to ${reportPath}`);
  if (blocked.length) {
    console.log("External blockers remain before full live checkout launch.");
  }
}

runCheck("lint", "npm run lint");
runCheck("build", "npm run build");
runCheck(
  "public storefront",
  `npm run verify:storefront -- ${publicUrl} --min-products=8 --check-public-admin --check-public-assets`,
);
runSourceSecretScan();
runAudit();
runCheck("Shopify readiness", "npm run verify:shopify", {
  allowedFailure: true,
  note: "Blocat pana cand tokenul Shopify nou este setat in env.",
});
writeReport();
