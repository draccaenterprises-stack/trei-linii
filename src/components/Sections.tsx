import { Link } from "@tanstack/react-router";
import { CreditCard, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { lookbookImages, reviews } from "@/lib/mock-data";

export function TrustStrip() {
  const items = [
    { icon: Truck, title: "Livrare rapidă", text: "Costul final se calculează în Shopify." },
    { icon: RotateCcw, title: "Retur 14 zile", text: "Pentru produse nepurtate și curate." },
    {
      icon: ShieldCheck,
      title: "Plată securizată",
      text: "Clientul finalizează comanda în Shopify.",
    },
    { icon: CreditCard, title: "Card / Apple Pay", text: "Metodele apar după conectarea Shopify." },
  ];

  return (
    <section className="border-y border-border bg-background">
      <div className="mx-auto grid max-w-[1600px] md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
        {items.map((item) => (
          <div key={item.title} className="px-5 md:px-10 py-6 flex gap-4">
            <item.icon className="h-5 w-5 shrink-0" strokeWidth={1.25} />
            <div>
              <h3 className="font-mono-xs">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function BundleBanner() {
  return (
    <section className="px-5 md:px-10 py-12 md:py-16">
      <div className="mx-auto max-w-[1600px] border border-charcoal bg-charcoal text-cream px-5 md:px-10 py-8 md:py-10 grid md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-8">
          <p className="font-mono-xs opacity-60">Ofertă de lansare</p>
          <h2 className="font-display text-3xl md:text-5xl mt-2">
            2 tricouri = transport gratuit + acces prioritar la următoarea lansare.
          </h2>
        </div>
        <div className="md:col-span-4 md:text-right">
          <Link
            to="/shop"
            className="inline-flex bg-cream text-charcoal px-6 py-3 font-mono-xs hover:bg-cream/90 transition-colors"
          >
            Construiește coșul →
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Reviews() {
  return (
    <section className="px-5 md:px-10 py-20 md:py-32">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex items-end justify-between mb-12">
          <h2 className="font-display text-4xl md:text-6xl">Purtate și apreciate.</h2>
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
        <p className="font-mono-xs opacity-60">Newsletter</p>
        <h2 className="font-display text-4xl md:text-6xl mt-4">Intră pe lista de lansare.</h2>
        <p className="mt-6 text-muted-foreground max-w-lg mx-auto">
          Primești -10% la prima comandă și acces cu 24h înainte la următoarea serie.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-10 flex max-w-md mx-auto border-b border-charcoal"
        >
          <input
            type="email"
            placeholder="email@exemplu.ro"
            className="flex-1 bg-transparent py-3 outline-none placeholder:opacity-40"
          />
          <button className="font-mono-xs px-4 hover:opacity-60">Abonează-te →</button>
        </form>
      </div>
    </section>
  );
}

export function SocialProofGrid() {
  return (
    <section className="px-5 md:px-10 py-20 md:py-32 border-t border-border">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <p className="font-mono-xs opacity-60">@treilinii pe stradă</p>
            <h2 className="font-display text-4xl md:text-6xl mt-3">Purtat în oraș.</h2>
          </div>
          <span className="hidden md:inline font-mono-xs opacity-50">
            UGC real după primele comenzi
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {lookbookImages.map((image) => (
            <Link key={image.src} to="/lookbook" className="img-zoom bg-warm-grey">
              <img
                src={image.src}
                alt={image.caption}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
            </Link>
          ))}
          <div className="border border-border p-5 md:p-6 flex flex-col justify-between min-h-56">
            <p className="font-display text-2xl">Ai purtat Trei Linii?</p>
            <p className="mt-6 text-sm text-muted-foreground">
              Trimite o poză după comandă și primești voucher pentru următoarea lansare.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
