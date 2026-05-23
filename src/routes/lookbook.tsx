import { createFileRoute } from "@tanstack/react-router";
import { lookbookImages } from "@/lib/mock-data";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/lookbook")({
  component: Lookbook,
  head: () => ({
    meta: [
      { title: "Lookbook — Volume I — BLANK ATELIER" },
      {
        name: "description",
        content: "Volume I — Spring 2026 lookbook. Editorial photography by BLANK ATELIER.",
      },
    ],
  }),
});

function Lookbook() {
  const images = [heroImg, ...lookbookImages.map((l) => l.src)];
  return (
    <div className="py-12 md:py-20">
      <header className="px-5 md:px-10 mb-16 md:mb-24 max-w-[1600px] mx-auto">
        <p className="font-mono-xs opacity-60">Lookbook</p>
        <h1 className="font-display text-5xl md:text-[10vw] leading-[0.95] mt-2">
          Volume I.
          <br />
          <span className="opacity-50">Spring 2026.</span>
        </h1>
        <p className="mt-6 text-muted-foreground max-w-xl">
          Shot on 35mm in Bucharest over three days in March. No retouching beyond color.
        </p>
      </header>

      <div className="max-w-[1600px] mx-auto px-5 md:px-10 space-y-3 md:space-y-6">
        {/* Editorial spread layout */}
        <div className="grid md:grid-cols-12 gap-3 md:gap-6">
          <div className="md:col-span-8 img-zoom">
            <img
              src={images[0]}
              alt=""
              loading="lazy"
              className="w-full aspect-[4/5] object-cover"
            />
          </div>
          <div className="md:col-span-4 img-zoom self-end">
            <img
              src={images[1]}
              alt=""
              loading="lazy"
              className="w-full aspect-[3/4] object-cover"
            />
            <p className="font-mono-xs opacity-60 mt-3">FIG. 01 · Concrete Hours</p>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-3 md:gap-6 md:py-24">
          <div className="md:col-span-5 md:col-start-2 img-zoom">
            <img
              src={images[2]}
              alt=""
              loading="lazy"
              className="w-full aspect-[3/4] object-cover"
            />
            <p className="font-mono-xs opacity-60 mt-3">FIG. 02 · Field Notes</p>
          </div>
          <div className="md:col-span-5 md:pt-32 self-start">
            <p className="font-display text-3xl md:text-5xl leading-tight">
              “We don't dress the city —<br />
              we wear it back.”
            </p>
            <p className="font-mono-xs opacity-50 mt-6">— Studio note, March 2026</p>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-3 md:gap-6">
          <div className="md:col-span-7 md:col-start-6 img-zoom">
            <img
              src={images[3]}
              alt=""
              loading="lazy"
              className="w-full aspect-[5/6] object-cover"
            />
            <p className="font-mono-xs opacity-60 mt-3">FIG. 03 · Crossings</p>
          </div>
        </div>
      </div>
    </div>
  );
}
