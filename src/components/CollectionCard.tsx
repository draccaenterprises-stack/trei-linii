import { Link } from "@tanstack/react-router";
import type { Collection } from "@/lib/mock-data";

export function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Link to="/shop" search={{ collection: collection.handle }} className="group block">
      <div className="relative img-zoom aspect-[3/4] bg-warm-grey">
        <img
          src={collection.image}
          alt={collection.title}
          decoding="async"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 text-cream">
          <div className="font-mono-xs opacity-70">
            {String(collection.count).padStart(2, "0")} produse
          </div>
          <h3 className="font-display text-3xl md:text-4xl mt-1">{collection.title}</h3>
          <p className="text-sm opacity-80 mt-2 max-w-xs">{collection.description}</p>
        </div>
      </div>
    </Link>
  );
}
