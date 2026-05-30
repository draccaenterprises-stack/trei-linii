import { Link } from "@tanstack/react-router";
import * as React from "react";
import { CreditCard, RefreshCw, RotateCcw, Ruler, ShieldCheck, Truck } from "lucide-react";
import { lookbookImages, reviews } from "@/lib/mock-data";
import { useSite } from "@/lib/site-context";

export function TrustStrip() {
  const { siteMode } = useSite();
  const items =
    siteMode === "pre-launch"
      ? [
          {
            icon: Ruler,
            title: "Croiala oversized",
            text: "Fit relaxat, gandit pentru purtare zilnica.",
          },
          {
            icon: ShieldCheck,
            title: "Design pe spate",
            text: "Fata ramane curata, grafica sta pe spate.",
          },
          {
            icon: RefreshCw,
            title: "Schimb marime",
            text: "Politica finala va fi afisata inainte de lansare.",
          },
          {
            icon: CreditCard,
            title: "Lista de lansare",
            text: "Anuntam disponibilitatea inainte de drop.",
          },
        ]
      : [
          { icon: Truck, title: "Livrare 2-3 zile", text: "Costul final se afiseaza la checkout." },
          { icon: RotateCcw, title: "Retur 14 zile", text: "Pentru produse nepurtate si curate." },
          { icon: RefreshCw, title: "Schimb marime", text: "Te ajutam sa alegi fit-ul potrivit." },
          {
            icon: ShieldCheck,
            title: "Plata securizata",
            text: "Comanda se finalizeaza prin Shopify Checkout.",
          },
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
  const { siteMode } = useSite();
  if (siteMode === "pre-launch") {
    return (
      <section className="px-5 md:px-10 py-12 md:py-16">
        <div className="mx-auto max-w-[1600px] border border-charcoal bg-charcoal text-cream px-5 md:px-10 py-8 md:py-10 grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8">
            <p className="font-mono-xs opacity-60">Lista de lansare</p>
            <h2 className="font-display text-3xl md:text-5xl mt-2">
              Vezi primele modele inainte de lansare si primesti anuntul cand drop-ul este gata.
            </h2>
          </div>
          <div className="md:col-span-4 md:text-right">
            <a
              href="/#newsletter"
              className="inline-flex bg-cream text-charcoal px-6 py-3 font-mono-xs hover:bg-cream/90 transition-colors"
            >
              Intra pe lista
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-5 md:px-10 py-12 md:py-16">
      <div className="mx-auto max-w-[1600px] border border-charcoal bg-charcoal text-cream px-5 md:px-10 py-8 md:py-10 grid md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-8">
          <p className="font-mono-xs opacity-60">Oferta de lansare</p>
          <h2 className="font-display text-3xl md:text-5xl mt-2">
            Doua tricouri in cos pot debloca beneficii de livrare la checkout.
          </h2>
        </div>
        <div className="md:col-span-4 md:text-right">
          <Link
            to="/shop"
            className="inline-flex bg-cream text-charcoal px-6 py-3 font-mono-xs hover:bg-cream/90 transition-colors"
          >
            Vezi modelele
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Reviews() {
  const { reviewsEnabled } = useSite();
  if (!reviewsEnabled || reviews.length === 0) return null;

  return (
    <section className="px-5 md:px-10 py-20 md:py-32">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex items-end justify-between mb-12">
          <h2 className="font-display text-4xl md:text-6xl">Feedback clienti.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {reviews.map((r) => (
            <figure key={r.name} className="border-t border-border pt-6">
              <div className="font-mono-xs mb-4">{"★".repeat(r.rating)}</div>
              <blockquote className="font-display text-xl md:text-2xl leading-snug">
                "{r.text}"
              </blockquote>
              <figcaption className="font-mono-xs opacity-60 mt-6">
                {r.name} - {r.location}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Newsletter() {
  const { siteMode } = useSite();
  const [status, setStatus] = React.useState<"idle" | "success" | "error">("idle");
  const [email, setEmail] = React.useState("");
  const [trap, setTrap] = React.useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (trap) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    const stored = JSON.parse(localStorage.getItem("trei-linii-launch-list") ?? "[]") as string[];
    localStorage.setItem(
      "trei-linii-launch-list",
      JSON.stringify([...new Set([...stored, email])]),
    );
    setStatus("success");
    setEmail("");
  };

  return (
    <section
      id="newsletter"
      className="px-5 md:px-10 py-20 md:py-32 bg-cream border-t border-border"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-mono-xs opacity-60">
          {siteMode === "pre-launch" ? "Lista de lansare" : "Newsletter"}
        </p>
        <h2 className="font-display text-4xl md:text-6xl mt-4">
          {siteMode === "pre-launch"
            ? "Afla primul cand se lanseaza."
            : "Ramai aproape de urmatorul drop."}
        </h2>
        <p className="mt-6 text-muted-foreground max-w-lg mx-auto">
          Trimitem doar noutati despre lansari, marimi disponibile si update-uri relevante pentru
          primele modele.
        </p>
        <form onSubmit={submit} className="mt-10 max-w-md mx-auto">
          <input
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            value={trap}
            onChange={(e) => setTrap(e.target.value)}
            aria-hidden="true"
          />
          <div className="flex border-b border-charcoal">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplu.ro"
              className="flex-1 bg-transparent py-3 outline-none placeholder:opacity-40"
            />
            <button className="font-mono-xs px-4 hover:opacity-60">Inscrie-te</button>
          </div>
          {status === "success" && (
            <p className="mt-3 font-mono-xs text-olive">Email salvat. Te anuntam la lansare.</p>
          )}
          {status === "error" && (
            <p className="mt-3 font-mono-xs text-red-700">Introdu o adresa de email valida.</p>
          )}
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
            <p className="font-mono-xs opacity-60">Lookbook</p>
            <h2 className="font-display text-4xl md:text-6xl mt-3">Fit-ul din spate.</h2>
          </div>
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
            <p className="font-display text-2xl">Designul sta pe spate.</p>
            <p className="mt-6 text-sm text-muted-foreground">
              Fata ramane simpla. Grafica este plasata pe spate, gandita pentru un tricou purtabil
              zi de zi.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
