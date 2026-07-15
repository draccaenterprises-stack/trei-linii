export const routeRegistry = [
  { path: "/", label: "Acasă", indexable: true, groups: [] },
  { path: "/shop", label: "Shop", indexable: true, groups: ["primary", "footer"] },
  { path: "/shop/lista", label: "Toate produsele", indexable: true, groups: [] },
  { path: "/lookbook", label: "Lookbook", indexable: true, groups: ["primary", "footer"] },
  { path: "/manifest", label: "Manifest", indexable: true, groups: ["primary"] },
  { path: "/about", label: "Despre", indexable: true, groups: ["footer"] },
  { path: "/journal", label: "Jurnal", indexable: false, groups: [] },
  { path: "/contact", label: "Contact", indexable: true, groups: ["support"] },
  { path: "/faq", label: "FAQ", indexable: true, groups: ["support"] },
  { path: "/size-guide", label: "Ghid mărimi", indexable: true, groups: ["footer"] },
  { path: "/livrare", label: "Livrare", indexable: true, groups: ["support"] },
  { path: "/retur", label: "Retur", indexable: true, groups: ["support"] },
  {
    path: "/schimb-marime",
    label: "Schimb mărime",
    indexable: true,
    groups: ["support"],
  },
  {
    path: "/termeni-si-conditii",
    label: "Termeni și condiții",
    indexable: true,
    groups: ["legal"],
  },
  {
    path: "/confidentialitate",
    label: "Confidențialitate",
    indexable: true,
    groups: ["legal"],
  },
  { path: "/cookies", label: "Cookies", indexable: true, groups: ["legal"] },
  { path: "/anpc", label: "ANPC", indexable: true, groups: ["legal"] },
  { path: "/sol", label: "SOL/SAL", indexable: true, groups: ["legal"] },
  { path: "/cart", label: "Coș", indexable: false, groups: [] },
] as const;

type RouteGroup = "primary" | "footer" | "support" | "legal";

function navigationFor(group: RouteGroup) {
  return routeRegistry
    .filter((route) => (route.groups as readonly string[]).includes(group))
    .map((route) => ({ to: route.path, label: route.label }));
}

export const primaryNavigation = navigationFor("primary");
export const footerNavigation = navigationFor("footer");
export const supportNavigation = navigationFor("support");
export const legalNavigation = navigationFor("legal");
export const indexableRoutes = routeRegistry
  .filter((route) => route.indexable)
  .map((route) => route.path);

export const nonIndexableRoutes = [
  "/admin",
  "/cart",
  "/journal",
  "/mcp",
  "/.mcp",
  "/.well-known/oauth-protected-resource",
] as const;
