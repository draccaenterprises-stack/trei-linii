import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ShopProductList } from "@/components/ShopProductList";
import { fetchProducts } from "@/lib/shopify";
import { pageMeta } from "@/lib/seo";

const searchSchema = z.object({
  color: z.string().optional(),
});

export const Route = createFileRoute("/shop/lista")({
  validateSearch: searchSchema,
  loader: async () => {
    const products = await fetchProducts();
    return { products };
  },
  component: ShopList,
  head: () =>
    pageMeta({
      path: "/shop/lista",
      title: "Lista modele - Trei Linii",
      description:
        "Lista completa de tricouri oversized Trei Linii, cu filtre pe culori si sortare.",
    }),
});

function ShopList() {
  const { products } = Route.useLoaderData();
  const { color } = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <ShopProductList products={products} color={color} navigate={navigate} backToPresentation />
  );
}
