import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { fetchProductByHandle } from "@/lib/shopify";

export default defineTool({
  name: "get_product",
  title: "Get product",
  description: "Fetch full details for a Trei Linii product by its handle (URL slug).",
  inputSchema: {
    handle: z.string().min(1).describe("The product handle, e.g. 'tricou-oversized-negru'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ handle }) => {
    const product = await fetchProductByHandle(handle);
    if (!product) {
      return {
        content: [{ type: "text", text: `No product found with handle "${handle}".` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(product, null, 2) }],
      structuredContent: { product },
    };
  },
});
