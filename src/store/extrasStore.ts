import { createWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'
import { persist } from 'zustand/middleware'
import type {
  Address,
  AuditLog,
  EstimatorDraft,
  FuelLog,
  LeaveRequest,
  NotificationPrefs,
  SalaryPayment,
  SpecialCustomerPrice,
  Supplier,
  TripExpense,
  Warehouse,
} from '@/types'
import { addresses as addressSeed, warehouses as warehouseSeed } from '@/mock/data'

function now() {
  return new Date().toISOString()
}
function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

interface ExtrasState {
  addresses: Address[]
  specialPrices: SpecialCustomerPrice[]
  notificationPrefs: NotificationPrefs[]
  auditLogs: AuditLog[]
  fuelLogs: FuelLog[]
  tripExpenses: TripExpense[]
  leaves: LeaveRequest[]
  salaryPayments: SalaryPayment[]
  suppliers: Supplier[]
  warehousesAdmin: Warehouse[]
  estimatorDrafts: EstimatorDraft[]
  permissionOverrides: Record<string, string[]>

  addAddress: (a: Omit<Address, 'id'>) => void
  updateAddress: (id: string, patch: Partial<Address>) => void
  removeAddress: (id: string) => void
  setSpecialPrice: (customerId: string, productId: string, price: number, note?: string) => void
  removeSpecialPrice: (id: string) => void
  getSpecialPrice: (customerId: string, productId: string) => number | null
  getPrefs: (userId: string) => NotificationPrefs
  updatePrefs: (userId: string, patch: Partial<NotificationPrefs>) => void
  addAudit: (entry: Omit<AuditLog, 'id' | 'at'>) => void
  addFuel: (f: Omit<FuelLog, 'id'>) => void
  addExpense: (e: Omit<TripExpense, 'id'>) => void
  addLeave: (l: Omit<LeaveRequest, 'id' | 'status'>) => void
  setLeaveStatus: (id: string, status: LeaveRequest['status']) => void
  paySalary: (employeeId: string, month: string, amount: number) => void
  addSupplier: (s: Omit<Supplier, 'id'>) => void
  updateSupplier: (id: string, patch: Partial<Supplier>) => void
  addWarehouse: (w: Omit<Warehouse, 'id'>) => void
  saveEstimatorDraft: (d: Omit<EstimatorDraft, 'id'>) => EstimatorDraft
  updateEstimatorDraft: (id: string, patch: Partial<EstimatorDraft>) => void
}

const prefsCache = new Map<string, NotificationPrefs>()

function defaultPrefs(userId: string): NotificationPrefs {
  const cached = prefsCache.get(userId)
  if (cached) return cached
  const next: NotificationPrefs = {
    userId,
    in_app: true,
    push: true,
    sms: true,
    whatsapp: true,
    email: true,
  }
  prefsCache.set(userId, next)
  return next
}

export const useExtrasStore = createWithEqualityFn<ExtrasState>()(
  persist(
    (set, get) => ({
      addresses: addressSeed,
      specialPrices: [
        {
          id: 'sp-1',
          customerId: 'u-dealer',
          productId: 'p-sq-1',
          price: 760,
          note: 'Loyalty special for Murugan Hardware',
        },
      ],
      notificationPrefs: [],
      auditLogs: [
        {
          id: 'aud-1',
          at: '2026-08-01T10:00:00',
          actorId: 'u-trader',
          action: 'PRICE_UPDATE',
          entity: 'product',
          ref: 'p-sq-1',
          detail: 'Dealer price adjusted',
        },
      ],
      fuelLogs: [
        { id: 'fuel-1', vehicleId: 'v-1', liters: 42, amount: 3780, at: '2026-08-01T08:00:00', note: 'IOCL Tenkasi' },
      ],
      tripExpenses: [
        { id: 'exp-1', vehicleId: 'v-1', tripId: 'trip-1', category: 'toll', amount: 450, at: '2026-07-26T10:00:00' },
        { id: 'exp-2', vehicleId: 'v-1', tripId: 'trip-1', category: 'loading', amount: 300, at: '2026-07-26T09:00:00' },
      ],
      leaves: [
        {
          id: 'lv-1',
          employeeId: 'e-3',
          from: '2026-08-01',
          to: '2026-08-03',
          reason: 'Personal',
          status: 'approved',
        },
      ],
      salaryPayments: [
        { id: 'sal-1', employeeId: 'e-1', month: '2026-07', amount: 32000, status: 'paid', at: '2026-07-31T18:00:00' },
      ],
      suppliers: [
        { id: 'sup-jsw', name: 'JSW Steel', type: 'manufacturer', phone: '9876500009', city: 'Chennai', outstanding: 240000 },
        { id: 'sup-tata', name: 'Tata Steel', type: 'manufacturer', phone: '9876500012', city: 'Chennai', outstanding: 180000 },
        { id: 'sup-local', name: 'Raja Local Scrap & Pipe', type: 'local_supplier', phone: '9876500013', city: 'Tenkasi', outstanding: 45000 },
      ],
      warehousesAdmin: warehouseSeed,
      estimatorDrafts: [],
      permissionOverrides: {},

      addAddress: (a) => set((s) => ({ addresses: [{ ...a, id: uid('addr') }, ...s.addresses] })),
      updateAddress: (id, patch) =>
        set((s) => ({ addresses: s.addresses.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
      removeAddress: (id) => set((s) => ({ addresses: s.addresses.filter((x) => x.id !== id) })),

      setSpecialPrice: (customerId, productId, price, note) => {
        const existing = get().specialPrices.find((p) => p.customerId === customerId && p.productId === productId)
        if (existing) {
          set((s) => ({
            specialPrices: s.specialPrices.map((p) =>
              p.id === existing.id ? { ...p, price, note } : p,
            ),
          }))
        } else {
          set((s) => ({
            specialPrices: [
              { id: uid('sp'), customerId, productId, price, note },
              ...s.specialPrices,
            ],
          }))
        }
        get().addAudit({
          actorId: 'u-trader',
          action: 'SPECIAL_PRICE',
          entity: 'pricing',
          ref: productId,
          detail: `Special ${price} for ${customerId}`,
        })
      },
      removeSpecialPrice: (id) => set((s) => ({ specialPrices: s.specialPrices.filter((p) => p.id !== id) })),
      getSpecialPrice: (customerId, productId) => {
        const row = get().specialPrices.find((p) => p.customerId === customerId && p.productId === productId)
        return row?.price ?? null
      },

      getPrefs: (userId) => get().notificationPrefs.find((p) => p.userId === userId) ?? defaultPrefs(userId),
      updatePrefs: (userId, patch) => {
        const cur = get().getPrefs(userId)
        const next = { ...cur, ...patch, userId }
        prefsCache.set(userId, next)
        set((s) => ({
          notificationPrefs: [next, ...s.notificationPrefs.filter((p) => p.userId !== userId)],
        }))
      },

      addAudit: (entry) =>
        set((s) => ({
          auditLogs: [{ ...entry, id: uid('aud'), at: now() }, ...s.auditLogs],
        })),

      addFuel: (f) => set((s) => ({ fuelLogs: [{ ...f, id: uid('fuel') }, ...s.fuelLogs] })),
      addExpense: (e) => set((s) => ({ tripExpenses: [{ ...e, id: uid('exp') }, ...s.tripExpenses] })),

      addLeave: (l) =>
        set((s) => ({
          leaves: [{ ...l, id: uid('lv'), status: 'pending' }, ...s.leaves],
        })),
      setLeaveStatus: (id, status) =>
        set((s) => ({ leaves: s.leaves.map((l) => (l.id === id ? { ...l, status } : l)) })),

      paySalary: (employeeId, month, amount) =>
        set((s) => ({
          salaryPayments: [
            { id: uid('sal'), employeeId, month, amount, status: 'paid', at: now() },
            ...s.salaryPayments,
          ],
        })),

      addSupplier: (srow) => set((s) => ({ suppliers: [{ ...srow, id: uid('sup') }, ...s.suppliers] })),
      updateSupplier: (id, patch) =>
        set((s) => ({ suppliers: s.suppliers.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),

      addWarehouse: (w) =>
        set((s) => ({ warehousesAdmin: [{ ...w, id: uid('wh') }, ...s.warehousesAdmin] })),

      saveEstimatorDraft: (d) => {
        const draft: EstimatorDraft = { ...d, id: uid('est') }
        set((s) => ({ estimatorDrafts: [draft, ...s.estimatorDrafts] }))
        return draft
      },
      updateEstimatorDraft: (id, patch) =>
        set((s) => ({
          estimatorDrafts: s.estimatorDrafts.map((d) => (d.id === id ? { ...d, ...patch } : d)),
        })),
    }),
    { name: 'steel-os-extras' },
  ),
  shallow,
)
