import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import type { FaqItem } from "@/lib/site-context";

type FaqLike = Pick<FaqItem, "q" | "a">;

export function FAQAccordion({ items = [] }: { items?: FaqLike[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="border-t border-border">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="border-b border-border">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${i}`}
              className="w-full py-6 flex items-center justify-between gap-6 text-left"
            >
              <span className="font-display text-lg md:text-xl">{f.q}</span>
              {isOpen ? (
                <Minus className="h-4 w-4 shrink-0" />
              ) : (
                <Plus className="h-4 w-4 shrink-0" />
              )}
            </button>
            {isOpen && (
              <p
                id={`faq-answer-${i}`}
                role="region"
                className="pb-6 max-w-2xl text-muted-foreground leading-relaxed"
              >
                {f.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
