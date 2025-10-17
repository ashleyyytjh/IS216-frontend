export const mkId = (f: File) => `${f.name}-${f.size}-${f.lastModified}`;

export const centsToDisplay = (cents: number) =>
  (cents / 100).toFixed(2);

export const displayToCents = (v: string) => {
  const n = Number(v);
  if (Number.isNaN(n)) return 0;
  return Math.round(n * 100);
};

export function dateFormat(string: any) {
  const date = new Date(string)
  return date.toLocaleDateString("en-SG", { 'year': "numeric", "month": "short", "day": "numeric" }) + " " + date.toLocaleTimeString("en-SG", { hour: "2-digit", minute: "2-digit" })

}

export const formatCount = (value: number) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${Math.round(value / 1_000)}K`
  return `${value}`
}
export function stringFormat(o:any){
  return o.charAt(0).toUpperCase() + o.slice(1)
}