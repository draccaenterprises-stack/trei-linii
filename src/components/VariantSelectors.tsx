import type { ColorVariant, Size } from "@/lib/catalog-types";

export function SizeSelector({
  sizes,
  stock,
  value,
  onChange,
}: {
  sizes: Size[];
  stock: Record<Size, number>;
  value: Size | null;
  onChange: (s: Size) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((s) => {
        const disabled = stock[s] === 0;
        const selected = value === s;
        return (
          <button
            type="button"
            key={s}
            disabled={disabled}
            onClick={() => onChange(s)}
            aria-pressed={selected}
            aria-label={`Mărimea ${s}${disabled ? ", indisponibilă" : ""}`}
            className={`min-w-12 h-12 px-4 font-mono-xs border transition-colors ${
              selected
                ? "bg-charcoal text-cream border-charcoal ring-2 ring-charcoal ring-offset-2 ring-offset-background"
                : "bg-transparent border-border hover:border-charcoal"
            } ${disabled ? "opacity-30 line-through cursor-not-allowed" : ""}`}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}

export function VariantSelector({
  colors,
  value,
  onChange,
}: {
  colors: ColorVariant[];
  value: string | null;
  onChange: (c: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {colors.map((c) => (
        <button
          type="button"
          key={c.name}
          onClick={() => onChange(c.name)}
          aria-pressed={value === c.name}
          aria-label={`Culoarea ${c.name}`}
          className="flex items-center gap-2 group"
        >
          <span
            className={`h-8 w-8 rounded-full border transition-[border-color,box-shadow] ${
              value === c.name
                ? "ring-2 ring-charcoal ring-offset-2 ring-offset-background border-charcoal"
                : "border-border"
            }`}
            style={{ backgroundColor: c.hex }}
          />
          <span className="font-mono-xs group-hover:opacity-60">{c.name}</span>
        </button>
      ))}
    </div>
  );
}
