import { defineMcp } from "@lovable.dev/mcp-js";
import listProducts from "./tools/list-products";
import getProduct from "./tools/get-product";
import listCollections from "./tools/list-collections";

export default defineMcp({
  name: "trei-linii-mcp",
  title: "Trei Linii Storefront",
  version: "0.1.0",
  instructions:
    "Tools for browsing the Trei Linii streetwear storefront. Use `list_products` to see available tricouri, `get_product` for a specific item by handle, and `list_collections` for curated groups.",
  tools: [listProducts, getProduct, listCollections],
});
