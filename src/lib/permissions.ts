import type { Role } from '@/types'

export type Capability =
  | 'manage_users'
  | 'manage_products'
  | 'manage_pricing'
  | 'create_quotation'
  | 'place_order'
  | 'dispatch'
  | 'finance'
  | 'settings'
  | 'view_audit'

/** Two-role prototype: Super Admin + Retail only. */
export const permissionMatrix: Record<Capability, Role[]> = {
  manage_users: ['super_admin'],
  manage_products: ['super_admin'],
  manage_pricing: ['super_admin'],
  create_quotation: ['super_admin', 'retail'],
  place_order: ['super_admin', 'retail'],
  dispatch: ['super_admin'],
  finance: ['super_admin', 'retail'],
  settings: ['super_admin'],
  view_audit: ['super_admin'],
}

export function can(role: Role, capability: Capability) {
  return permissionMatrix[capability].includes(role)
}

export type Workspace = 'admin' | 'buyer'

export function workspaceForRole(role: Role): Workspace {
  return role === 'super_admin' ? 'admin' : 'buyer'
}

export function homePathForRole(role: Role) {
  return `/${workspaceForRole(role)}`
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
  dispatch: 'Dispatch / process orders',
  finance: 'Finance',
  settings: 'Settings',
  view_audit: 'View audit',
}

/** Demo role switcher — only the two live users. */
export const demoRoles: Role[] = ['super_admin', 'retail']
