import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { indexableRoutes } from "../src/lib/routes";

const root = resolve(import.meta.dirname, "..");
const outputRoot = resolve(root, ".output/public");
const baseUrl = "http://127.0.0.1:4177";
const skipStaticPrerender =
  root === resolve("/dev-server") ||
  ["1", "true"].includes(process.env.SKIP_STATIC_PRERENDER?.toLowerCase() ?? "");

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
  throw new Error("Workerul pentru pre-render nu a pornit în 30 de secunde.");
}

function outputPath(route: string) {
  return route === "/"
    ? resolve(outputRoot, "index.html")
    : resolve(outputRoot, route.slice(1), "index.html");
}

if (skipStaticPrerender) {
  console.log("Pre-render static omis în mediul de deploy; randarea SSR Nitro rămâne activă.");
} else {
  const server = spawn(
    resolve(root, "node_modules/.bin/wrangler"),
    ["--cwd", ".output", "dev", "--ip", "127.0.0.1", "--port", "4177"],
    { cwd: root, stdio: "ignore" },
  );

  try {
    await waitForServer();
    for (const route of indexableRoutes) {
      const response = await fetch(`${baseUrl}${route}`, {
        headers: { "User-Agent": "Trei-Linii-prerender" },
        signal: AbortSignal.timeout(15_000),
      });
      if (!response.ok) throw new Error(`${route}: status ${response.status}`);
      const html = (await response.text()).replaceAll("\0", "\\u0000");
      if (
        !/<html\b/i.test(html) ||
        !/<main\b/i.test(html) ||
        !/<title>[^<]+<\/title>/i.test(html)
      ) {
        throw new Error(`${route}: răspunsul SSR este incomplet.`);
      }
      const destination = outputPath(route);
      await mkdir(dirname(destination), { recursive: true });
      await writeFile(destination, html, "utf8");
      if (html.includes("\0")) throw new Error(`${route}: HTML-ul conține octeți NUL.`);
    }
    console.log(`Pre-render OK: ${indexableRoutes.length} rute statice scrise în .output/public.`);
  } finally {
    server.kill("SIGTERM");
  }
}
