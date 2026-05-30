import { useState } from "react";
import { faqs } from "@/lib/mock-data";
import { Plus, Minus } from "lucide-react";
import type { FaqItem } from "@/lib/site-context";

type FaqLike = Pick<FaqItem, "q" | "a">;

export function FAQAccordion({ items = faqs }: { items?: FaqLike[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="border-t border-border">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="border-b border-border">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
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
              <p className="pb-6 max-w-2xl text-muted-foreground leading-relaxed">{f.a}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
