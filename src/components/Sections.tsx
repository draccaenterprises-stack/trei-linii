import { reviews } from "@/lib/mock-data";

export function Reviews() {
  return (
    <section className="px-5 md:px-10 py-20 md:py-32">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex items-end justify-between mb-12">
          <h2 className="font-display text-4xl md:text-6xl">Worn & rated.</h2>
          <span className="font-mono-xs opacity-50 hidden md:inline">★★★★★ · 4.9 / 5</span>
        </div>
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {reviews.map((r) => (
            <figure key={r.name} className="border-t border-border pt-6">
              <div className="font-mono-xs mb-4">{"★".repeat(r.rating)}</div>
              <blockquote className="font-display text-xl md:text-2xl leading-snug">
                “{r.text}”
              </blockquote>
              <figcaption className="font-mono-xs opacity-60 mt-6">
                {r.name} — {r.location}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Newsletter() {
  return (
    <section className="px-5 md:px-10 py-20 md:py-32 bg-cream border-t border-border">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-mono-xs opacity-60">Join the list</p>
        <h2 className="font-display text-4xl md:text-6xl mt-4">
          The next drop, before the next drop.
        </h2>
        <p className="mt-6 text-muted-foreground max-w-lg mx-auto">
          One email per release. No spam, no fluff — just the date, the look, and the link.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-10 flex max-w-md mx-auto border-b border-charcoal"
        >
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 bg-transparent py-3 outline-none placeholder:opacity-40"
          />
          <button className="font-mono-xs px-4 hover:opacity-60">Subscribe →</button>
        </form>
      </div>
    </section>
  );
}
