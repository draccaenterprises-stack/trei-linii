import { SITE_URL, absoluteUrl } from "@/lib/site";

export function pageMeta(opts: {
  path: string;
  title: string;
  description: string;
  ogType?: string;
  image?: string;
  noIndex?: boolean;
}) {
  const url = `${SITE_URL}${opts.path === "/" ? "" : opts.path}`;
  const meta: Array<Record<string, string>> = [
    { title: opts.title },
    { name: "description", content: opts.description },
    { property: "og:title", content: opts.title },
    { property: "og:description", content: opts.description },
    { property: "og:url", content: url },
    { property: "og:type", content: opts.ogType ?? "website" },
    { name: "twitter:title", content: opts.title },
    { name: "twitter:description", content: opts.description },
    { name: "twitter:card", content: "summary_large_image" },
  ];
  const image = opts.image ?? absoluteUrl("/og-image.jpg");
  meta.push({ property: "og:image", content: image });
  meta.push({ name: "twitter:image", content: image });
  if (opts.noIndex) meta.push({ name: "robots", content: "noindex, nofollow" });
  return {
    meta,
    links: [{ rel: "canonical", href: url }],
  };
}
