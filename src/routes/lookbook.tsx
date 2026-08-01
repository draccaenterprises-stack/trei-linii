import { createFileRoute } from "@tanstack/react-router";
import {
  editorialGestures,
  editorialCounterweight,
  editorialPressure,
  editorialSection,
} from "@/lib/brand-images";
import { pageMeta } from "@/lib/seo";
import { ResponsiveImage } from "@/components/ResponsiveImage";

export const Route = createFileRoute("/lookbook")({
  component: Lookbook,
  head: () =>
    pageMeta({
      path: "/lookbook",
      title: "Pe strada - Lansarea 01 - Trei Linii",
      description: "Trei Linii pe stradă: tricouri în context urban.",
    }),
});

function Lookbook() {
  // One frame per collection direction: olive/black gestures, counterweight,
  // the white pressure piece and the black section piece.
  const images = [editorialPressure, editorialCounterweight, editorialGestures, editorialSection];
  return (
    <div className="py-12 md:py-20">
      <header className="px-5 md:px-10 mb-16 md:mb-24 max-w-[1600px] mx-auto">
        <p className="font-mono-xs opacity-60">Pe stradă</p>
        <h1 className="font-display text-5xl leading-[0.95] mt-2 md:text-8xl lg:text-9xl">
          Lansarea 01.
          <br />
          <span className="text-muted-foreground">Trei Linii.</span>
        </h1>
        <p className="mt-6 text-muted-foreground max-w-xl">
          Cadre editoriale pentru direcția brandului: piese simple, spațiu mult și styling urban.
        </p>
      </header>

      <div className="max-w-[1600px] mx-auto px-5 md:px-10 space-y-3 md:space-y-6">
        <div className="grid md:grid-cols-12 gap-3 md:gap-6">
          <div className="md:col-span-8 img-zoom">
            <ResponsiveImage
              src={images[0]}
              alt="Tricou alb Trei Linii cu print pe spate, fundal de beton"
              width={1200}
              height={1500}
              priority
              sizes="(min-width: 768px) 66vw, 100vw"
              className="w-full aspect-[4/5] object-cover"
            />
          </div>
          <div className="md:col-span-4 img-zoom self-end">
            <ResponsiveImage
              src={images[1]}
              alt="Tricou Trei Linii fotografiat din spate"
              width={1200}
              height={1600}
              sizes="(min-width: 768px) 33vw, 100vw"
              className="w-full aspect-[3/4] object-cover"
            />
            <p className="font-mono-xs opacity-60 mt-3">FIG. 01 - Ore de beton</p>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-3 md:gap-6 md:py-24">
          <div className="md:col-span-5 md:col-start-2 img-zoom">
            <ResponsiveImage
              src={images[2]}
              alt="Tricou negru Trei Linii, grafică pe spate, lumină naturală"
              width={1200}
              height={1600}
              sizes="(min-width: 768px) 42vw, 100vw"
              className="w-full aspect-[3/4] object-cover"
            />
            <p className="font-mono-xs opacity-60 mt-3">FIG. 02 - Note de teren</p>
          </div>
          <div className="md:col-span-5 md:pt-32 self-start">
            <p className="font-display text-3xl md:text-5xl leading-tight">
              Simplu de purtat.
              <br />
              Ușor de recunoscut.
            </p>
            <p className="font-mono-xs opacity-50 mt-6">Nota de studio, 2026</p>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-3 md:gap-6">
          <div className="md:col-span-7 md:col-start-6 img-zoom">
            <ResponsiveImage
              src={images[3]}
              alt="Tricou negru Trei Linii cu trei linii pe spate, pasaj de beton"
              width={1200}
              height={1440}
              sizes="(min-width: 768px) 58vw, 100vw"
              className="w-full aspect-[5/6] object-cover"
            />
            <p className="font-mono-xs opacity-60 mt-3">FIG. 03 - Traversări</p>
          </div>
        </div>
      </div>
    </div>
  );
}
