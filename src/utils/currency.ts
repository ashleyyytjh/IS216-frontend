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

/**
 * priceOrFree takes in price in cents, returns price or free if 0
 */
export function priceOrFree(price: number): string {
  if (price <= 0) {
    return "FREE"
  }
  return formatPriceSGD(price)
}