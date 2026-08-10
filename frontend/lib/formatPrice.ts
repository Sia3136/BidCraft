export function formatPrice(amount: number | string): string {
  if (amount === undefined || amount === null) return '₹0';
  const num = typeof amount === 'string' ? Number(amount) : amount;
  return `₹${num.toLocaleString('en-IN')}`;
}
