import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ShopProductList } from "@/components/ShopProductList";
import { loadCatalog } from "@/lib/product-repository";
import { pageMeta } from "@/lib/seo";

const searchSchema = z.object({
  color: z.string().optional(),
  colectie: z.string().optional(),
});

export const Route = createFileRoute("/shop_/lista")({
  validateSearch: searchSchema,
  loader: () => loadCatalog(),
  component: ShopList,
  head: () =>
    pageMeta({
      path: "/shop/lista",
      title: "Lista de modele - Trei Linii",
      description:
        "Lista completă de produse Trei Linii, cu filtre pe culori, colecții și sortare.",
    }),
});

function ShopList() {
  const { products, collections } = Route.useLoaderData();
  const { color, colectie } = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <ShopProductList
      products={products}
      collections={collections}
      color={color}
      collectionHandle={colectie}
      navigate={navigate}
      backToPresentation
    />
  );
}
