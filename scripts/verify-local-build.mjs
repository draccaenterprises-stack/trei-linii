import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const baseUrl = "http://127.0.0.1:4179";
const output = resolve(root, ".output");

if (!existsSync(resolve(output, "server/index.mjs"))) {
  console.error("Lipsește build-ul Worker. Rulează `npm run build` înainte de verificare.");
  process.exit(1);
}

const server = spawn(
  resolve(root, "node_modules/.bin/wrangler"),
  ["--cwd", ".output", "dev", "--ip", "127.0.0.1", "--port", "4179"],
  { cwd: root, stdio: "ignore" },
);

async function waitForServer() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    try {
      const response = await fetch(baseUrl, { signal: AbortSignal.timeout(1_000) });
      if (response.ok) return;
    } catch {
      // Workerul încă pornește.
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 250));
  }
  throw new Error("Workerul local nu a pornit în 30 de secunde.");
}

function runScript(script, ...args) {
  const result = spawnSync(resolve(root, "node_modules/.bin/tsx"), [script, ...args], {
    cwd: root,
    encoding: "utf8",
    stdio: "inherit",
  });
  if (result.status !== 0) throw new Error(`${script} a eșuat cu exit ${result.status}.`);
}

async function verifyHeaders() {
  const response = await fetch(baseUrl, {
    signal: AbortSignal.timeout(10_000),
    redirect: "manual",
  });
  const requiredHeaders = [
    "content-security-policy",
    "referrer-policy",
    "strict-transport-security",
    "x-content-type-options",
    "x-frame-options",
  ];
  const missing = requiredHeaders.filter((header) => !response.headers.get(header));
  if (missing.length) throw new Error(`Headere HTTP lipsă pe build: ${missing.join(", ")}`);
}

try {
  await waitForServer();
  runScript("scripts/verify-storefront.ts", baseUrl);
  runScript("scripts/verify-public-seo.ts", baseUrl);
  await verifyHeaders();
  console.log(`Build local verificat complet la ${baseUrl}.`);
} finally {
  server.kill("SIGTERM");
}
