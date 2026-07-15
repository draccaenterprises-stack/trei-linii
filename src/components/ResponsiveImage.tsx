import type { ImgHTMLAttributes } from "react";

type ResponsiveImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "width" | "height" | "loading" | "fetchPriority"
> & {
  width: number;
  height: number;
  priority?: boolean;
};

function shopifyImageUrl(src: string, width: number) {
  if (!src.startsWith("https://cdn.shopify.com/")) return null;

  const url = new URL(src);
  url.searchParams.set("width", String(width));
  return url.toString();
}

export function ResponsiveImage({
  src = "",
  alt = "",
  width,
  height,
  sizes = "100vw",
  srcSet,
  priority = false,
  decoding = priority ? "sync" : "async",
  ...props
}: ResponsiveImageProps) {
  if (!src) {
    return (
      <span
        role="img"
        aria-label={alt || "Imagine indisponibilă"}
        className={props.className}
        style={{
          ...props.style,
          aspectRatio: `${width} / ${height}`,
          background: "var(--warm-grey)",
        }}
      />
    );
  }

  const generatedSrcSet =
    srcSet ||
    [480, 800, 1200]
      .map((candidateWidth) => {
        const candidate = shopifyImageUrl(src, candidateWidth);
        return candidate ? `${candidate} ${candidateWidth}w` : "";
      })
      .filter(Boolean)
      .join(", ") ||
    undefined;

  return (
    <img
      {...props}
      src={src}
      srcSet={generatedSrcSet}
      sizes={generatedSrcSet ? sizes : undefined}
      alt={alt}
      width={width}
      height={height}
      decoding={decoding}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
    />
  );
}
