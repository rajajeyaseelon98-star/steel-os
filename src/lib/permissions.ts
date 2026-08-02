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
  | 'manage_vendors'
  | 'view_audit'
  | 'manufacturer_portal'

export const permissionMatrix: Record<Capability, Role[]> = {
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
  manage_vendors: ['super_admin', 'master_trader'],
  view_audit: ['super_admin', 'master_trader'],
  manufacturer_portal: ['manufacturer', 'super_admin', 'master_trader'],
}

export function can(role: Role, capability: Capability) {
  return permissionMatrix[capability].includes(role)
}

export type Workspace = 'admin' | 'buyer' | 'warehouse' | 'fabricator' | 'driver' | 'manufacturer'

export function workspaceForRole(role: Role): Workspace {
  switch (role) {
    case 'super_admin':
    case 'master_trader':
      return 'admin'
    case 'manufacturer':
      return 'manufacturer'
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
  if (ws === 'manufacturer') return '/manufacturer'
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

export const capabilityLabels: Record<Capability, string> = {
  manage_users: 'Manage users',
  manage_products: 'Manage products',
  manage_pricing: 'Manage pricing',
  create_quotation: 'Create quotation',
  place_order: 'Place order',
  manage_inventory: 'Manage inventory',
  dispatch: 'Dispatch / GRN',
  delivery_pod: 'Delivery POD',
  fabrication_leads: 'Fabrication leads',
  finance: 'Finance / ledger',
  reports: 'Reports / analytics',
  settings: 'Settings',
  manage_vendors: 'Vendor management',
  view_audit: 'Audit logs',
  manufacturer_portal: 'Manufacturer portal',
}
