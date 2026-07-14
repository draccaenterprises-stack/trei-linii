import { describe, expect, it } from "vitest";
import { indexableRoutes, routeRegistry } from "@/lib/routes";

describe("route registry", () => {
  it("nu are path-uri duplicate și exclude rutele private din indexare", () => {
    const paths = routeRegistry.map((route) => route.path);
    expect(new Set(paths).size).toBe(paths.length);
    expect(indexableRoutes).not.toContain("/cart");
    expect(indexableRoutes).not.toContain("/journal");
  });

  it("definește explicit toate rutele publice principale", () => {
    expect(paths(routeRegistry)).toEqual(
      expect.arrayContaining(["/", "/shop", "/lookbook", "/manifest", "/faq", "/contact"]),
    );
  });
});

function paths(registry: typeof routeRegistry) {
  return registry.map((route) => route.path);
}
