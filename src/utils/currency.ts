export function formatPriceSGD(amount: number): string {
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 2,
  }).format(amount)
}