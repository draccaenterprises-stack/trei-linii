import { Link } from "@tanstack/react-router";
import { RefreshCw } from "lucide-react";

export function LoadingState({ label = "Se încarcă" }: { label?: string }) {
  return (
    <div className="mx-auto min-h-[40vh] max-w-3xl px-5 py-20 text-center" aria-busy="true">
      <p className="font-mono-xs text-muted-foreground">{label}</p>
      <div className="mx-auto mt-7 h-12 max-w-lg animate-pulse bg-warm-grey" aria-hidden="true" />
    </div>
  );
}

export function EmptyState({
  eyebrow,
  title,
  message,
  actionLabel,
  actionTo,
}: {
  eyebrow: string;
  title: string;
  message: string;
  actionLabel?: string;
  actionTo?: "/" | "/shop" | "/contact" | "/manifest";
}) {
  return (
    <section className="px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-3xl border-y border-border py-16 text-center">
        <p className="font-mono-xs text-accent-text">{eyebrow}</p>
        <h1 className="mt-5 font-display text-5xl leading-tight md:text-7xl">{title}</h1>
        <p className="mx-auto mt-6 max-w-xl leading-relaxed text-muted-foreground">{message}</p>
        {actionLabel && actionTo && (
          <Link
            to={actionTo}
            className="mt-8 inline-flex min-h-12 items-center border border-charcoal px-6 font-mono-xs transition-colors hover:bg-charcoal hover:text-cream"
          >
            {actionLabel}
          </Link>
        )}
      </div>
    </section>
  );
}

export function ErrorState({
  title = "Nu am putut încărca această pagină.",
  message = "Încearcă din nou peste câteva momente.",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center" role="alert">
      <h1 className="font-display text-4xl">{title}</h1>
      <p className="mt-4 text-muted-foreground">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-7 inline-flex min-h-11 items-center gap-2 bg-charcoal px-5 text-cream"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          <span className="font-mono-xs">Încearcă din nou</span>
        </button>
      )}
    </div>
  );
}
