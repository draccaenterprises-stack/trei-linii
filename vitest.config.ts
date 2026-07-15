import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/unit/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      include: [
        "src/lib/analytics.ts",
        "src/lib/cart-state.ts",
        "src/lib/consent.ts",
        "src/lib/form-adapters.ts",
        "src/lib/product-repository.ts",
        "src/lib/routes.ts",
        "src/lib/schema.ts",
        "src/lib/seo.ts",
        "src/lib/site.ts",
        "src/components/FeedbackRegion.tsx",
        "src/components/VariantSelectors.tsx",
      ],
    },
  },
});
