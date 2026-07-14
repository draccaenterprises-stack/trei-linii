import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const baseUrl = "http://127.0.0.1:4176";
const reportsDir = resolve(root, "reports/lighthouse");
const requestedRunCount = Number.parseInt(process.env.LIGHTHOUSE_RUNS ?? "3", 10);
const runCount =
  Number.isFinite(requestedRunCount) && requestedRunCount > 0 ? requestedRunCount : 3;
mkdirSync(reportsDir, { recursive: true });

if (!existsSync(resolve(root, ".output/public"))) {
  console.error("Lipsește buildul. Rulează `npm run build` înainte de `npm run verify:perf`.");
  process.exit(1);
}

const server = spawn(
  resolve(root, "node_modules/.bin/wrangler"),
  ["--cwd", ".output", "dev", "--ip", "127.0.0.1", "--port", "4176"],
  { cwd: root, stdio: "ignore" },
);

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // Preview-ul încă pornește.
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 500));
  }
  throw new Error("Serverul de preview nu a pornit în 30 de secunde.");
}

function runLighthouse({ path, name, desktop, run }) {
  return new Promise((resolveRun, rejectRun) => {
    const outputPath = resolve(reportsDir, `${name}-${run}.json`);
    rmSync(outputPath, { force: true });
    const flags = [
      `${baseUrl}${path}`,
      "--quiet",
      "--output=json",
      `--output-path=${outputPath}`,
      "--chrome-flags=--headless --no-sandbox",
      "--throttling-method=devtools",
      "--only-categories=performance,accessibility,best-practices,seo",
    ];
    if (desktop) flags.push("--preset=desktop");
    const child = spawn(resolve(root, "node_modules/.bin/lighthouse"), flags, {
      cwd: root,
      stdio: "inherit",
    });
    child.on("exit", (code) => {
      if (code === 0) resolveRun(outputPath);
      else rejectRun(new Error(`Lighthouse a ieșit cu codul ${code}.`));
    });
  });
}

function firstProductPath() {
  const sitemap = readFileSync(resolve(root, "public/sitemap.xml"), "utf8");
  return sitemap.match(/<loc>[^<]+(\/product\/[^<]+)<\/loc>/)?.[1] ?? "/shop";
}

function metrics(reportPath) {
  const report = JSON.parse(readFileSync(reportPath, "utf8"));
  return {
    lcp: report.audits["largest-contentful-paint"].numericValue,
    cls: report.audits["cumulative-layout-shift"].numericValue,
    inpProxy: report.audits["total-blocking-time"].numericValue,
    performance: report.categories.performance.score,
    accessibility: report.categories.accessibility.score,
    bestPractices: report.categories["best-practices"].score,
    seo: report.categories.seo.score,
  };
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

const allScenarios = [
  { path: "/", name: "home-mobile", desktop: false },
  { path: firstProductPath(), name: "catalog-mobile", desktop: false },
  { path: "/", name: "home-desktop", desktop: true },
];
const requestedScenario = process.env.LIGHTHOUSE_SCENARIO?.trim();
const scenarios = requestedScenario
  ? allScenarios.filter((scenario) => scenario.name === requestedScenario)
  : allScenarios;
if (!scenarios.length) {
  throw new Error(`Scenariul Lighthouse "${requestedScenario}" nu există.`);
}
const failures = [];
const summary = {};

try {
  await waitForServer();
  for (const scenario of scenarios) {
    const runs = [];
    for (let run = 1; run <= runCount; run += 1) {
      const outputPath = await runLighthouse({ ...scenario, run });
      runs.push(metrics(outputPath));
    }
    const result = Object.fromEntries(
      Object.keys(runs[0]).map((key) => [key, median(runs.map((entry) => entry[key]))]),
    );
    summary[scenario.name] = { path: scenario.path, runs, median: result };
    console.log(
      `${scenario.name}: LCP ${Math.round(result.lcp)}ms, CLS ${result.cls.toFixed(3)}, TBT ${Math.round(result.inpProxy)}ms, performance ${Math.round(result.performance * 100)}`,
    );

    if (result.lcp >= 2_500)
      failures.push(`${scenario.name}: LCP ${Math.round(result.lcp)}ms >= 2500ms`);
    if (result.cls >= 0.1) failures.push(`${scenario.name}: CLS ${result.cls.toFixed(3)} >= 0.1`);
    if (result.inpProxy >= 300)
      failures.push(`${scenario.name}: TBT ${Math.round(result.inpProxy)}ms >= 300ms`);
    if (result.performance < 0.75) failures.push(`${scenario.name}: performance sub 75`);
    if (result.accessibility < 0.9) failures.push(`${scenario.name}: accesibilitate sub 90`);
    if (result.bestPractices < 0.9) failures.push(`${scenario.name}: best-practices sub 90`);
    if (result.seo < 0.9) failures.push(`${scenario.name}: SEO sub 90`);
  }
} finally {
  server.kill("SIGTERM");
}

writeFileSync(resolve(reportsDir, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
if (failures.length) {
  console.error(`Praguri Lighthouse neatinse:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(`Lighthouse OK: mediană din ${runCount} rulări/scenariu. Rapoarte: ${reportsDir}`);
