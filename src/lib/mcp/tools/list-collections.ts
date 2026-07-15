import { defineTool } from "@lovable.dev/mcp-js";
import { productRepository } from "@/lib/product-repository";

export default defineTool({
  name: "list_collections",
  title: "List collections",
  description: "List all product collections in the Trei Linii storefront.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async () => {
    const collections = await productRepository.listCollections();
    return {
      content: [{ type: "text", text: JSON.stringify(collections, null, 2) }],
      structuredContent: { collections },
    };
  },
});
