import { describe, expect, it } from "vitest";
import { escapeHtmlNullBytes } from "@/server";

describe("răspunsurile HTML pentru WebKit", () => {
  it("înlocuiește octeții NUL din stream cu o secvență JavaScript validă", async () => {
    const response = new Response('<script>const id="root\0child"</script>', {
      headers: { "content-type": "text/html; charset=utf-8", "content-length": "42" },
    });

    const sanitized = escapeHtmlNullBytes(response);

    expect(await sanitized.text()).toBe('<script>const id="root\\u0000child"</script>');
    expect(sanitized.headers.has("content-length")).toBe(false);
  });

  it("nu modifică răspunsurile care nu sunt HTML", async () => {
    const response = new Response("a\0b", {
      headers: { "content-type": "application/octet-stream" },
    });
    const untouched = escapeHtmlNullBytes(response);

    expect(await untouched.arrayBuffer()).toEqual(await new Response("a\0b").arrayBuffer());
  });
});
