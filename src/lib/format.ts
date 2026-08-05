export function taka(amount: number): string {
  return `${new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 }).format(amount)}৳`;
}
