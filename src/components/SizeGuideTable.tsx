const sizeRows = [
  ["S", "56 cm", "70 cm", "53 cm"],
  ["M", "59 cm", "72 cm", "55 cm"],
  ["L", "62 cm", "74 cm", "57 cm"],
  ["XL", "65 cm", "76 cm", "59 cm"],
];

export function SizeGuideTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left font-mono-xs border border-border">
        <caption className="sr-only">
          Masuratori tricouri Trei Linii pe marime, in centimetri
        </caption>
        <thead className="bg-cream">
          <tr>
            <th className="p-3 border-r border-border">Marime</th>
            <th className="p-3 border-r border-border">Piept</th>
            <th className="p-3 border-r border-border">Lungime</th>
            <th className="p-3">Umar</th>
          </tr>
        </thead>
        <tbody>
          {sizeRows.map((row) => (
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
  );
}
