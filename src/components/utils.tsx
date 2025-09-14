export const mkId = (f: File) => `${f.name}-${f.size}-${f.lastModified}`;

export const centsToDisplay = (cents: number) =>
  (cents / 100).toFixed(2);

export const displayToCents = (v: string) => {
  const n = Number(v);
  if (Number.isNaN(n)) return 0;
  return Math.round(n * 100);
};
