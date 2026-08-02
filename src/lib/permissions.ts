import type { Role } from '@/types'

export type Capability =
  | 'manage_users'
  | 'manage_products'
  | 'manage_pricing'
  | 'create_quotation'
  | 'place_order'
  | 'manage_inventory'
  | 'dispatch'
  | 'delivery_pod'
  | 'fabrication_leads'
  | 'finance'
  | 'reports'
  | 'settings'

const matrix: Record<Capability, Role[]> = {
  manage_users: ['super_admin', 'master_trader'],
  manage_products: ['super_admin', 'master_trader', 'manufacturer'],
  manage_pricing: ['super_admin', 'master_trader'],
  create_quotation: ['super_admin', 'master_trader', 'dealer', 'fabricator'],
  place_order: ['super_admin', 'master_trader', 'dealer', 'contractor', 'retail', 'fabricator'],
  manage_inventory: ['super_admin', 'master_trader', 'warehouse_manager'],
  dispatch: ['super_admin', 'master_trader', 'warehouse_manager'],
  delivery_pod: ['super_admin', 'master_trader', 'warehouse_manager', 'driver', 'dealer', 'contractor', 'retail'],
  fabrication_leads: ['super_admin', 'master_trader', 'fabricator', 'dealer', 'contractor', 'retail'],
  finance: ['super_admin', 'master_trader', 'dealer', 'contractor', 'retail', 'fabricator', 'manufacturer', 'driver'],
  reports: ['super_admin', 'master_trader', 'warehouse_manager', 'dealer', 'contractor', 'fabricator', 'driver', 'manufacturer'],
  settings: ['super_admin', 'master_trader'],
}

export function can(role: Role, capability: Capability) {
  return matrix[capability].includes(role)
}

export function workspaceForRole(role: Role): 'admin' | 'buyer' | 'warehouse' | 'fabricator' | 'driver' {
  switch (role) {
    case 'super_admin':
    case 'master_trader':
    case 'manufacturer':
      return 'admin'
    case 'warehouse_manager':
      return 'warehouse'
    case 'fabricator':
      return 'fabricator'
    case 'driver':
      return 'driver'
    default:
      return 'buyer'
  }
}

export function homePathForRole(role: Role) {
  const ws = workspaceForRole(role)
  return `/${ws}`
}

export const roleLabels: Record<Role, string> = {
  super_admin: 'Super Admin',
  manufacturer: 'Manufacturer',
  master_trader: 'Master Trader',
  warehouse_manager: 'Warehouse Manager',
  fabricator: 'Fabrication Partner',
  dealer: 'Dealer',
  contractor: 'Contractor',
  driver: 'Transport / Driver',
  retail: 'Retail Customer',
}
