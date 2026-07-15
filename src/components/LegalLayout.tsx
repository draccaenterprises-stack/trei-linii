import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { Printer } from "lucide-react";
import { LEGAL } from "@/lib/site";

interface LegalSectionProps {
  id?: string;
  title: string;
  children: ReactNode;
}

function headingId(title: string) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  const sections = Children.toArray(children)
    .filter(
      (child): child is ReactElement<LegalSectionProps> =>
        isValidElement<LegalSectionProps>(child) && child.type === LegalSection,
    )
    .map((child) => ({
      id: child.props.id || headingId(child.props.title),
      title: child.props.title,
    }));

  return (
    <div className="legal-page px-5 py-16 md:px-10 md:py-24">
      <article className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
        <aside className="legal-toc lg:sticky lg:top-28 lg:self-start">
          <p className="font-mono-xs opacity-60">Legal</p>
          <h1 className="mt-3 font-display text-5xl md:text-7xl">{title}</h1>
          {LEGAL.updatedAt && (
            <p className="mt-5 text-sm text-muted-foreground">
              Ultima actualizare: {LEGAL.updatedAt}
            </p>
          )}

          {sections.length > 0 && (
            <nav className="mt-8 border-t border-border pt-5" aria-label={`Cuprins ${title}`}>
              <p className="font-mono-xs text-muted-foreground">Cuprins</p>
              <ol className="mt-4 space-y-2 text-sm">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a className="hover:text-accent-text" href={`#${section.id}`}>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <button
            type="button"
            className="legal-print mt-8 inline-flex min-h-11 items-center gap-2 border border-charcoal px-4 py-2 font-mono-xs hover:bg-charcoal hover:text-cream"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
            Tipărește
          </button>
        </aside>

        <div className="legal-content space-y-10 leading-relaxed text-muted-foreground">
          {children}
        </div>
      </article>
    </div>
  );
}

export function LegalSection({ id, title, children }: LegalSectionProps) {
  return (
    <section id={id || headingId(title)} className="scroll-mt-28 space-y-3">
      <h2 className="font-display text-2xl text-foreground">{title}</h2>
      {children}
    </section>
  );
}
