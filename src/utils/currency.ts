/**
 * formatPriceSGD takes in price in cents, returns formatted SGD
 */
export function formatPriceSGD(amount: number): string {
  if (amount == 0) {
    return "Free"
  }
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 2,
  }).format(amount/100)
}