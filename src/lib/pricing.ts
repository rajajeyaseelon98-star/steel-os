import type { PriceType, Product, Role, User } from '@/types'

const roleDefaultPrice: Partial<Record<Role, PriceType>> = {
  retail: 'retail',
  dealer: 'dealer',
  contractor: 'contractor',
  manufacturer: 'wholesale',
  master_trader: 'wholesale',
  super_admin: 'wholesale',
  warehouse_manager: 'wholesale',
  fabricator: 'wholesale',
  driver: 'retail',
}

export function defaultPriceTypeForRole(role: Role): PriceType {
  return roleDefaultPrice[role] ?? 'retail'
}

export function resolveUnitPrice(
  product: Product,
  role: Role,
  override?: PriceType,
): { price: number; priceType: PriceType } {
  const priceType = override ?? defaultPriceTypeForRole(role)
  return { price: product.prices[priceType], priceType }
}

export function lineTotals(unitPrice: number, qty: number, gstPercent: number) {
  const taxable = unitPrice * qty
  const gst = Math.round(taxable * (gstPercent / 100))
  return { taxable, gst, total: taxable + gst }
}

export function orderTotals(
  items: { unitPrice: number; qty: number; gstPercent: number }[],
) {
  return items.reduce(
    (acc, item) => {
      const t = lineTotals(item.unitPrice, item.qty, item.gstPercent)
      acc.taxable += t.taxable
      acc.gst += t.gst
      acc.total += t.total
      return acc
    },
    { taxable: 0, gst: 0, total: 0 },
  )
}

export function availableCredit(user: User) {
  return Math.max(0, user.creditLimit - user.creditUsed)
}
