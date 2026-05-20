export const formatRON = (n: number) =>
  new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", maximumFractionDigits: 0 }).format(n);
