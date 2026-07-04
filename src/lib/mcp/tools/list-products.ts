import { defineTool } from "@lovable.dev/mcp-js";
import { fetchProducts } from "@/lib/shopify";

export default defineTool({
  name: "list_products",
  title: "List products",
  description: "List all products available in the Trei Linii Shopify storefront.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async () => {
    const products = await fetchProducts();
    const summary = products.map((p) => ({
      handle: p.handle,
      title: p.title,
      price: p.price,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
      structuredContent: { products: summary },
    };
  },
});
