import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/size-guide")({
  component: SizeGuide,
  head: () => ({
    meta: [
      { title: "Ghid marimi - Trei Linii" },
      { name: "description", content: "Ghid de marimi pentru tricouri oversized Trei Linii." },
    ],
  }),
});

function SizeGuide() {
  const rows = [
    ["S", "56 cm", "70 cm", "53 cm"],
    ["M", "59 cm", "72 cm", "55 cm"],
    ["L", "62 cm", "74 cm", "57 cm"],
    ["XL", "65 cm", "76 cm", "59 cm"],
  ];

  return (
    <main className="px-5 md:px-10 py-16 md:py-24">
      <article className="mx-auto max-w-4xl">
        <p className="font-mono-xs opacity-60">Fit</p>
        <h1 className="font-display text-5xl md:text-7xl mt-3">Ghid marimi</h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
          Tricourile sunt gandite oversized. Alege marimea normala pentru o cadere relaxata sau o
          marime mai mica pentru un fit mai apropiat de corp.
        </p>
        <div className="mt-12 overflow-x-auto">
          <table className="w-full text-left font-mono-xs border border-border">
            <thead className="bg-cream">
              <tr>
                <th className="p-3 border-r border-border">Marime</th>
                <th className="p-3 border-r border-border">Piept</th>
                <th className="p-3 border-r border-border">Lungime</th>
                <th className="p-3">Umar</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row[0]} className="border-t border-border">
                  {row.map((cell) => (
                    <td key={cell} className="p-3 border-r border-border last:border-r-0">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </main>
  );
}
