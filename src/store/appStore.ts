import { createWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'
import { persist } from 'zustand/middleware'
import type {
  AttendanceRecord,
  CompanySettings,
  CrmActivity,
  DeliveryTrip,
  Employee,
  FabricationJob,
  FabricationQuote,
  FabricationRequest,
  GoodsReceipt,
  InventoryItem,
  Invoice,
  LedgerEntry,
  NotificationItem,
  Order,
  OrderStatus,
  Payment,
  PaymentMethod,
  PriceType,
  Product,
  PurchaseOrder,
  PurchaseRequest,
  Quotation,
  Role,
  StockMovement,
  StockTransfer,
  User,
  VerificationStatus,
} from '@/types'
import {
  attendance as attendanceSeed,
  companySettings as companySeed,
  crmActivities as crmSeed,
  employees as employeesSeed,
  fabricationJobs as fabJobsSeed,
  fabricationQuotes as fabQuotesSeed,
  fabricationRequests as fabReqSeed,
  goodsReceipts as grnSeed,
  inventory as inventorySeed,
  invoices as invoicesSeed,
  ledger as ledgerSeed,
  notifications as notificationsSeed,
  orders as ordersSeed,
  payments as paymentsSeed,
  products as productsSeed,
  purchaseOrders as poSeed,
  purchaseRequests as prSeed,
  quotations as quotationsSeed,
  stockMovements as movementsSeed,
  stockTransfers as transfersSeed,
  trips as tripsSeed,
  users as usersSeed,
  wishlistSeed,
} from '@/mock/data'
import { orderTotals, resolveUnitPrice } from '@/lib/pricing'
import { homePathForRole } from '@/lib/permissions'
import { useExtrasStore } from '@/store/extrasStore'

function now() {
  return new Date().toISOString()
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

interface AppState {
  users: User[]
  currentUserId: string | null
  products: Product[]
  inventory: InventoryItem[]
  quotations: Quotation[]
  orders: Order[]
  invoices: Invoice[]
  payments: Payment[]
  ledger: LedgerEntry[]
  purchaseRequests: PurchaseRequest[]
  purchaseOrders: PurchaseOrder[]
  goodsReceipts: GoodsReceipt[]
  trips: DeliveryTrip[]
  fabricationRequests: FabricationRequest[]
  fabricationQuotes: FabricationQuote[]
  fabricationJobs: FabricationJob[]
  stockMovements: StockMovement[]
  stockTransfers: StockTransfer[]
  crmActivities: CrmActivity[]
  notifications: NotificationItem[]
  employees: Employee[]
  attendance: AttendanceRecord[]
  company: CompanySettings
  /** userId → productIds */
  wishlists: Record<string, string[]>
  otpCode: string | null
  pendingRegister: Partial<User> | null

  currentUser: () => User | null
  loginAs: (userId: string) => string
  logout: () => void
  setRoleDemo: (role: Role) => string
  registerDraft: (data: Partial<User>) => void
  verifyOtp: (code: string) => boolean
  setVerification: (status: VerificationStatus) => void

  getProduct: (id: string) => Product | undefined
  availableQty: (productId: string, warehouseId: string) => number
  updatePrice: (productId: string, priceType: PriceType, value: number) => void
  upsertProduct: (product: Product) => void
  deleteProduct: (productId: string) => void

  createQuotation: (input: {
    customerId: string
    items: Quotation['items']
    validityDate: string
    notes?: string
    projectName?: string
  }) => Quotation
  sendQuotation: (id: string) => void
  acceptQuotation: (id: string) => Order | null
  rejectQuotation: (id: string) => void
  reviseQuotation: (id: string, items?: Quotation['items'], notes?: string) => void
  expireQuotation: (id: string) => void
  updateQuotationItems: (id: string, items: Quotation['items']) => void

  createOrder: (input: {
    customerId: string
    items: Order['items']
    notes?: string
    quotationId?: string
  }) => Order
  updateOrderStatus: (id: string, status: OrderStatus) => void
  approveOrder: (id: string) => void
  cancelOrder: (id: string) => void
  requestReturn: (id: string) => void
  refundOrder: (id: string) => void
  partialDispatchOrder: (orderId: string, vehicleId: string, driverId: string) => DeliveryTrip | null

  reserveStock: (order: Order) => void
  releaseStock: (order: Order) => void
  dispatchOrder: (orderId: string, vehicleId: string, driverId: string) => DeliveryTrip | null
  confirmLoading: (tripId: string) => void
  updateTripStatus: (tripId: string, status: DeliveryTrip['status']) => void
  submitPod: (tripId: string, signature: string, photoNote: string) => void
  markOrderDelivered: (orderId: string) => void

  createTransfer: (from: string, to: string, productId: string, qty: number) => void
  receiveTransfer: (id: string) => void

  createPR: (input: Omit<PurchaseRequest, 'id' | 'number' | 'status' | 'createdAt'>) => void
  convertPRtoPO: (prId: string, supplierId: string, unitCost: number) => void
  postGRN: (grnId: string, inspection: GoodsReceipt['inspection']) => void

  createFabRequest: (input: Omit<FabricationRequest, 'id' | 'number' | 'status' | 'createdAt'>) => void
  addFabQuote: (input: Omit<FabricationQuote, 'id' | 'status' | 'createdAt'>) => void
  selectFabQuote: (requestId: string, quoteId: string) => void
  advanceFabJob: (jobId: string) => void
  payFabJob: (jobId: string, mode?: 'partial' | 'paid') => void
  reviewFabJob: (jobId: string, rating: number, comment: string) => void

  recordPayment: (input: {
    customerId: string
    invoiceId?: string
    amount: number
    method: PaymentMethod
    note?: string
  }) => void

  toggleWishlist: (productId: string) => void
  wishlistFor: (userId: string) => string[]
  markNotificationRead: (id: string) => void
  addNotification: (n: Omit<NotificationItem, 'id' | 'at' | 'read'>) => void
  addCrmActivity: (a: Omit<CrmActivity, 'id' | 'at'>) => void
  updateCompany: (patch: Partial<CompanySettings>) => void

  estimatorBom: (city: string, floors: number) => { productId: string; qty: number; reason: string }[]
  reserveEstimatorBom: (bom: { productId: string; qty: number }[], warehouseId: string) => void
}

export const useAppStore = createWithEqualityFn<AppState>()(
  persist(
    (set, get) => ({
      users: usersSeed,
      currentUserId: null,
      products: productsSeed,
      inventory: inventorySeed,
      quotations: quotationsSeed,
      orders: ordersSeed,
      invoices: invoicesSeed,
      payments: paymentsSeed,
      ledger: ledgerSeed,
      purchaseRequests: prSeed,
      purchaseOrders: poSeed,
      goodsReceipts: grnSeed,
      trips: tripsSeed,
      fabricationRequests: fabReqSeed,
      fabricationQuotes: fabQuotesSeed,
      fabricationJobs: fabJobsSeed,
      stockMovements: movementsSeed,
      stockTransfers: transfersSeed,
      crmActivities: crmSeed,
      notifications: notificationsSeed,
      employees: employeesSeed,
      attendance: attendanceSeed,
      company: companySeed,
      wishlists: wishlistSeed,
      otpCode: null,
      pendingRegister: null,

      currentUser: () => {
        const id = get().currentUserId
        return get().users.find((u) => u.id === id) ?? null
      },

      loginAs: (userId) => {
        set({ currentUserId: userId })
        const user = get().users.find((u) => u.id === userId)
        return user ? homePathForRole(user.role) : '/login'
      },

      logout: () => set({ currentUserId: null }),

      setRoleDemo: (role) => {
        const user = get().users.find((u) => u.role === role)
        if (!user) return '/login'
        return get().loginAs(user.id)
      },

      registerDraft: (data) => {
        set({ pendingRegister: data, otpCode: '123456' })
      },

      verifyOtp: (code) => {
        if (code !== get().otpCode) return false
        const draft = get().pendingRegister
        if (!draft?.email) return false
        const user: User = {
          id: uid('u'),
          name: draft.name ?? 'New User',
          email: draft.email,
          phone: draft.phone ?? '',
          role: draft.role ?? 'retail',
          companyName: draft.companyName ?? 'Business',
          gstin: draft.gstin,
          verificationStatus: 'gst_pending',
          creditLimit: draft.role === 'dealer' ? 200000 : draft.role === 'contractor' ? 500000 : 25000,
          creditUsed: 0,
          creditDays: draft.role === 'contractor' ? 45 : 15,
          city: draft.city ?? 'Tenkasi',
          avatarInitials: (draft.name ?? 'NU')
            .split(' ')
            .map((p) => p[0])
            .join('')
            .slice(0, 2)
            .toUpperCase(),
        }
        set((s) => ({
          users: [...s.users, user],
          currentUserId: user.id,
          pendingRegister: null,
          otpCode: null,
        }))
        return true
      },

      setVerification: (status) => {
        const id = get().currentUserId
        if (!id) return
        set((s) => ({
          users: s.users.map((u) => (u.id === id ? { ...u, verificationStatus: status } : u)),
        }))
      },

      getProduct: (id) => get().products.find((p) => p.id === id),

      availableQty: (productId, warehouseId) => {
        const row = get().inventory.find((i) => i.productId === productId && i.warehouseId === warehouseId)
        if (!row) return 0
        return Math.max(0, row.onHand - row.reserved)
      },

      updatePrice: (productId, priceType, value) => {
        set((s) => ({
          products: s.products.map((p) =>
            p.id === productId ? { ...p, prices: { ...p.prices, [priceType]: value } } : p,
          ),
        }))
        get().addNotification({
          userId: 'u-retail',
          title: 'Price Changed',
          body: `Price updated for ${get().getProduct(productId)?.name ?? productId}`,
          channel: 'in_app',
          link: `/buyer/products/${productId}`,
        })
      },

      upsertProduct: (product) => {
        set((s) => {
          const exists = s.products.some((p) => p.id === product.id)
          return {
            products: exists
              ? s.products.map((p) => (p.id === product.id ? product : p))
              : [product, ...s.products],
          }
        })
      },

      deleteProduct: (productId) => {
        set((s) => ({ products: s.products.filter((p) => p.id !== productId) }))
      },

      createQuotation: (input) => {
        const user = get().currentUser()
        const selfServe = !!user && user.id === input.customerId && user.role === 'retail'
        const q: Quotation = {
          id: uid('q'),
          number: `QT-2026-${String(get().quotations.length + 1).padStart(3, '0')}`,
          customerId: input.customerId,
          createdBy: user?.id ?? 'u-admin',
          status: selfServe ? 'sent' : 'draft',
          items: input.items,
          validityDate: input.validityDate,
          notes: input.notes,
          projectName: input.projectName,
          createdAt: now(),
        }
        set((s) => ({ quotations: [q, ...s.quotations] }))
        if (selfServe) {
          get().addNotification({
            userId: 'u-admin',
            title: 'Customer quotation request',
            body: `${q.number} sent for review / acceptance`,
            channel: 'in_app',
            link: `/admin/quotations`,
          })
        }
        return q
      },

      sendQuotation: (id) => {
        set((s) => ({
          quotations: s.quotations.map((q) => (q.id === id ? { ...q, status: 'sent' } : q)),
        }))
        const q = get().quotations.find((x) => x.id === id)
        if (q) {
          get().addNotification({
            userId: q.customerId,
            title: 'Quotation ready',
            body: `${q.number} is ready for acceptance.`,
            channel: 'whatsapp',
            link: `/buyer/quotations/${q.id}`,
          })
        }
      },

      acceptQuotation: (id) => {
        const q = get().quotations.find((x) => x.id === id)
        if (!q) return null
        // Allow sent/revised/accepted; draft self-serve gets sent first
        if (!['sent', 'revised', 'accepted', 'draft'].includes(q.status)) return null
        if (q.status === 'draft') {
          set((s) => ({
            quotations: s.quotations.map((x) => (x.id === id ? { ...x, status: 'sent' } : x)),
          }))
        }
        const fresh = get().quotations.find((x) => x.id === id)!
        const order = get().createOrder({
          customerId: fresh.customerId,
          quotationId: fresh.id,
          notes: fresh.notes,
          items: fresh.items.map((item) => {
            const product = get().getProduct(item.productId)!
            return {
              ...item,
              weightKg: product.weightKg,
            }
          }),
        })
        set((s) => ({
          quotations: s.quotations.map((x) =>
            x.id === id ? { ...x, status: 'converted', orderId: order.id } : x,
          ),
        }))
        return order
      },

      rejectQuotation: (id) => {
        set((s) => ({
          quotations: s.quotations.map((q) => (q.id === id ? { ...q, status: 'rejected' } : q)),
        }))
      },

      reviseQuotation: (id, items, notes) => {
        set((s) => ({
          quotations: s.quotations.map((q) =>
            q.id === id
              ? {
                  ...q,
                  status: 'revised',
                  items: items ?? q.items,
                  notes: notes ?? q.notes,
                  validityDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
                }
              : q,
          ),
        }))
      },

      expireQuotation: (id) => {
        set((s) => ({
          quotations: s.quotations.map((q) => (q.id === id ? { ...q, status: 'expired' } : q)),
        }))
      },

      updateQuotationItems: (id, items) => {
        set((s) => ({
          quotations: s.quotations.map((q) => (q.id === id ? { ...q, items } : q)),
        }))
      },

      createOrder: (input) => {
        const user = get().currentUser()
        const order: Order = {
          id: uid('o'),
          number: `ORD-2026-${100 + get().orders.length + 1}`,
          customerId: input.customerId,
          createdBy: user?.id ?? input.customerId,
          status: 'pending_approval',
          items: input.items,
          quotationId: input.quotationId,
          notes: input.notes,
          createdAt: now(),
          updatedAt: now(),
        }
        set((s) => ({ orders: [order, ...s.orders] }))
        get().addNotification({
          userId: 'u-admin',
          title: 'New order',
          body: `${order.number} awaiting approval`,
          channel: 'in_app',
          link: `/admin/orders/${order.id}`,
        })
        get().addNotification({
          userId: 'u-admin',
          title: 'New order',
          body: `${order.number} awaiting approval`,
          channel: 'in_app',
          link: `/admin/orders/${order.id}`,
        })
        return order
      },

      updateOrderStatus: (id, status) => {
        set((s) => ({
          orders: s.orders.map((o) => (o.id === id ? { ...o, status, updatedAt: now() } : o)),
        }))
      },

      approveOrder: (id) => {
        const order = get().orders.find((o) => o.id === id)
        if (!order) return
        get().reserveStock(order)
        get().updateOrderStatus(id, 'approved')
        const totals = orderTotals(order.items)
        const invoice: Invoice = {
          id: uid('inv'),
          number: `INV-2026-${200 + get().invoices.length + 1}`,
          orderId: order.id,
          customerId: order.customerId,
          amount: totals.taxable,
          gstAmount: totals.gst,
          paidAmount: 0,
          status: 'unpaid',
          dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
          createdAt: now(),
        }
        set((s) => ({
          invoices: [invoice, ...s.invoices],
          ledger: [
            {
              id: uid('led'),
              customerId: order.customerId,
              type: 'debit',
              amount: totals.total,
              ref: invoice.number,
              at: now(),
              note: 'Invoice raised',
            },
            ...s.ledger,
          ],
          users: s.users.map((u) =>
            u.id === order.customerId ? { ...u, creditUsed: u.creditUsed + totals.total } : u,
          ),
        }))
        get().addNotification({
          userId: order.customerId,
          title: 'Order approved',
          body: `${order.number} approved. Invoice ${invoice.number} generated.`,
          channel: 'in_app',
          link: `/buyer/orders/${order.id}`,
        })
      },

      cancelOrder: (id) => {
        const order = get().orders.find((o) => o.id === id)
        if (!order) return
        if (['approved', 'partially_dispatched'].includes(order.status)) {
          get().releaseStock(order)
        }
        get().updateOrderStatus(id, 'cancelled')
      },

      requestReturn: (id) => {
        get().updateOrderStatus(id, 'return_requested')
        const order = get().orders.find((o) => o.id === id)
        if (order) {
          get().addNotification({
            userId: 'u-admin',
            title: 'Return requested',
            body: `${order.number} return requested`,
            channel: 'in_app',
            link: `/admin/orders/${order.id}`,
          })
        }
      },

      refundOrder: (id) => {
        const order = get().orders.find((o) => o.id === id)
        if (!order) return
        const inv = get().invoices.find((i) => i.orderId === id)
        if (inv) {
          set((s) => ({
            invoices: s.invoices.map((i) =>
              i.id === inv.id ? { ...i, paidAmount: i.amount + i.gstAmount, status: 'paid' } : i,
            ),
            ledger: [
              {
                id: uid('led'),
                customerId: order.customerId,
                type: 'credit',
                amount: inv.amount + inv.gstAmount - inv.paidAmount,
                ref: `REFUND-${inv.number}`,
                at: now(),
                note: 'Order refunded',
              },
              ...s.ledger,
            ],
            users: s.users.map((u) =>
              u.id === order.customerId
                ? { ...u, creditUsed: Math.max(0, u.creditUsed - (inv.amount + inv.gstAmount - inv.paidAmount)) }
                : u,
            ),
          }))
        }
        get().updateOrderStatus(id, 'refunded')
      },

      partialDispatchOrder: (orderId, vehicleId, driverId) => {
        const order = get().orders.find((o) => o.id === orderId)
        if (!order || order.status !== 'approved') return null
        const trip = get().dispatchOrder(orderId, vehicleId, driverId)
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === orderId ? { ...o, status: 'partially_dispatched', updatedAt: now() } : o,
          ),
        }))
        return trip
      },

      reserveStock: (order) => {
        set((s) => ({
          inventory: s.inventory.map((row) => {
            const item = order.items.find(
              (i) => i.productId === row.productId && i.warehouseId === row.warehouseId,
            )
            if (!item) return row
            return { ...row, reserved: row.reserved + item.qty }
          }),
          stockMovements: [
            ...order.items.map((item) => ({
              id: uid('sm'),
              productId: item.productId,
              warehouseId: item.warehouseId,
              type: 'reserve' as const,
              qty: item.qty,
              ref: order.number,
              at: now(),
            })),
            ...s.stockMovements,
          ],
        }))
      },

      releaseStock: (order) => {
        set((s) => ({
          inventory: s.inventory.map((row) => {
            const item = order.items.find(
              (i) => i.productId === row.productId && i.warehouseId === row.warehouseId,
            )
            if (!item) return row
            return { ...row, reserved: Math.max(0, row.reserved - item.qty) }
          }),
        }))
      },

      dispatchOrder: (orderId, vehicleId, driverId) => {
        const order = get().orders.find((o) => o.id === orderId)
        if (!order) return null
        const trip: DeliveryTrip = {
          id: uid('trip'),
          orderId,
          vehicleId,
          driverId,
          status: 'assigned',
          loadingConfirmed: false,
          podPhotos: [],
          createdAt: now(),
        }
        set((s) => ({
          trips: [trip, ...s.trips],
          orders: s.orders.map((o) =>
            o.id === orderId
              ? { ...o, status: 'dispatched', dispatchTripId: trip.id, updatedAt: now() }
              : o,
          ),
          inventory: s.inventory.map((row) => {
            const item = order.items.find(
              (i) => i.productId === row.productId && i.warehouseId === row.warehouseId,
            )
            if (!item) return row
            return {
              ...row,
              onHand: Math.max(0, row.onHand - item.qty),
              reserved: Math.max(0, row.reserved - item.qty),
            }
          }),
        }))
        get().addNotification({
          userId: 'u-driver',
          title: 'Trip assigned',
          body: `Deliver ${order.number}`,
          channel: 'push',
          link: `/driver/trips/${trip.id}`,
        })
        return trip
      },

      confirmLoading: (tripId) => {
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id === tripId ? { ...t, loadingConfirmed: true, status: 'loading' } : t,
          ),
        }))
      },

      updateTripStatus: (tripId, status) => {
        set((s) => ({
          trips: s.trips.map((t) => (t.id === tripId ? { ...t, status } : t)),
        }))
      },

      submitPod: (tripId, signature, photoNote) => {
        const trip = get().trips.find((t) => t.id === tripId)
        if (!trip) return
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id === tripId
              ? {
                  ...t,
                  status: 'delivered',
                  podSignature: signature,
                  podPhotos: [...t.podPhotos, photoNote || 'photo-proof'],
                }
              : t,
          ),
          orders: s.orders.map((o) =>
            o.id === trip.orderId ? { ...o, status: 'delivered', updatedAt: now() } : o,
          ),
        }))
        const order = get().orders.find((o) => o.id === trip.orderId)
        if (order) {
          get().addNotification({
            userId: order.customerId,
            title: 'Delivered',
            body: `${order.number} delivered. POD captured.`,
            channel: 'whatsapp',
            link: `/buyer/orders/${order.id}`,
          })
        }
      },

      markOrderDelivered: (orderId) => {
        const trip = get().trips.find((t) => t.orderId === orderId && t.status !== 'delivered')
        if (trip) {
          get().submitPod(trip.id, 'Admin POD', 'admin-delivered')
          return
        }
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === orderId ? { ...o, status: 'delivered', updatedAt: now() } : o,
          ),
        }))
        const order = get().orders.find((o) => o.id === orderId)
        if (order) {
          get().addNotification({
            userId: order.customerId,
            title: 'Delivered',
            body: `${order.number} marked delivered by admin.`,
            channel: 'in_app',
            link: `/buyer/orders/${order.id}`,
          })
        }
      },

      createTransfer: (from, to, productId, qty) => {
        set((s) => ({
          stockTransfers: [
            {
              id: uid('st'),
              fromWarehouseId: from,
              toWarehouseId: to,
              productId,
              qty,
              status: 'in_transit',
              createdAt: now(),
            },
            ...s.stockTransfers,
          ],
          inventory: s.inventory.map((row) => {
            if (row.productId === productId && row.warehouseId === from) {
              return { ...row, onHand: Math.max(0, row.onHand - qty) }
            }
            return row
          }),
        }))
      },

      receiveTransfer: (id) => {
        const tr = get().stockTransfers.find((t) => t.id === id)
        if (!tr) return
        set((s) => {
          const hasTarget = s.inventory.some(
            (i) => i.productId === tr.productId && i.warehouseId === tr.toWarehouseId,
          )
          let inventory = s.inventory.map((row) => {
            if (row.productId === tr.productId && row.warehouseId === tr.toWarehouseId) {
              return { ...row, onHand: row.onHand + tr.qty }
            }
            return row
          })
          if (!hasTarget) {
            inventory = [
              ...inventory,
              {
                id: uid('inv'),
                productId: tr.productId,
                warehouseId: tr.toWarehouseId,
                onHand: tr.qty,
                reserved: 0,
                incoming: 0,
                damaged: 0,
                barcode: `BC${Date.now()}`,
                qrCode: `QR-${tr.productId}-${tr.toWarehouseId}`,
              },
            ]
          }
          return {
            inventory,
            stockTransfers: s.stockTransfers.map((t) =>
              t.id === id ? { ...t, status: 'received' } : t,
            ),
          }
        })
      },

      createPR: (input) => {
        set((s) => ({
          purchaseRequests: [
            {
              ...input,
              id: uid('pr'),
              number: `PR-2026-${String(s.purchaseRequests.length + 1).padStart(2, '0')}`,
              status: 'submitted',
              createdAt: now(),
            },
            ...s.purchaseRequests,
          ],
        }))
      },

      convertPRtoPO: (prId, supplierId, unitCost) => {
        const pr = get().purchaseRequests.find((p) => p.id === prId)
        if (!pr) return
        const po: PurchaseOrder = {
          id: uid('po'),
          number: `PO-2026-${String(get().purchaseOrders.length + 1).padStart(2, '0')}`,
          supplierId,
          status: 'sent',
          createdAt: now(),
          prId,
          items: [
            {
              productId: pr.productId,
              warehouseId: pr.warehouseId,
              qty: pr.qty,
              unitCost,
            },
          ],
        }
        const grn: GoodsReceipt = {
          id: uid('grn'),
          number: `GRN-2026-${String(get().goodsReceipts.length + 1).padStart(2, '0')}`,
          poId: po.id,
          status: 'draft',
          inspection: 'pending',
          createdAt: now(),
          items: po.items.map((i) => ({
            productId: i.productId,
            warehouseId: i.warehouseId,
            qty: i.qty,
          })),
        }
        set((s) => ({
          purchaseOrders: [po, ...s.purchaseOrders],
          goodsReceipts: [grn, ...s.goodsReceipts],
          purchaseRequests: s.purchaseRequests.map((p) =>
            p.id === prId ? { ...p, status: 'converted', poId: po.id } : p,
          ),
        }))
      },

      postGRN: (grnId, inspection) => {
        const grn = get().goodsReceipts.find((g) => g.id === grnId)
        if (!grn) return
        set((s) => ({
          goodsReceipts: s.goodsReceipts.map((g) =>
            g.id === grnId ? { ...g, status: 'posted', inspection } : g,
          ),
          purchaseOrders: s.purchaseOrders.map((po) =>
            po.id === grn.poId ? { ...po, status: 'closed' } : po,
          ),
          inventory: s.inventory.map((row) => {
            const item = grn.items.find(
              (i) => i.productId === row.productId && i.warehouseId === row.warehouseId,
            )
            if (!item || inspection === 'fail') return row
            const add = inspection === 'partial' ? Math.floor(item.qty / 2) : item.qty
            return {
              ...row,
              onHand: row.onHand + add,
              incoming: Math.max(0, row.incoming - item.qty),
            }
          }),
          stockMovements: [
            ...grn.items.map((item) => ({
              id: uid('sm'),
              productId: item.productId,
              warehouseId: item.warehouseId,
              type: 'in' as const,
              qty: item.qty,
              ref: grn.number,
              at: now(),
              note: `Inspection ${inspection}`,
            })),
            ...s.stockMovements,
          ],
        }))
      },

      createFabRequest: (input) => {
        const req: FabricationRequest = {
          ...input,
          id: uid('fab'),
          number: `FAB-2026-${String(get().fabricationRequests.length + 1).padStart(2, '0')}`,
          status: 'open',
          createdAt: now(),
        }
        set((s) => ({ fabricationRequests: [req, ...s.fabricationRequests] }))
        get().users
          .filter((u) => u.role === 'fabricator')
          .forEach((f) =>
            get().addNotification({
              userId: f.id,
              title: 'New fabrication lead',
              body: `${req.type} request ${req.number} in ${req.city}`,
              channel: 'in_app',
              link: `/fabricator/leads/${req.id}`,
            }),
          )
      },

      addFabQuote: (input) => {
        const quote: FabricationQuote = {
          ...input,
          id: uid('fq'),
          status: 'sent',
          createdAt: now(),
        }
        set((s) => ({
          fabricationQuotes: [quote, ...s.fabricationQuotes],
          fabricationRequests: s.fabricationRequests.map((r) =>
            r.id === input.requestId ? { ...r, status: 'quoting' } : r,
          ),
        }))
      },

      selectFabQuote: (requestId, quoteId) => {
        const quote = get().fabricationQuotes.find((q) => q.id === quoteId)
        if (!quote) return
        const job: FabricationJob = {
          id: uid('job'),
          requestId,
          quoteId,
          fabricatorId: quote.fabricatorId,
          status: 'accepted',
          paymentStatus: 'pending',
        }
        set((s) => ({
          fabricationRequests: s.fabricationRequests.map((r) =>
            r.id === requestId ? { ...r, status: 'selected', selectedQuoteId: quoteId } : r,
          ),
          fabricationQuotes: s.fabricationQuotes.map((q) =>
            q.requestId === requestId
              ? { ...q, status: q.id === quoteId ? 'accepted' : 'rejected' }
              : q,
          ),
          fabricationJobs: [job, ...s.fabricationJobs],
        }))
      },

      advanceFabJob: (jobId) => {
        const job = get().fabricationJobs.find((j) => j.id === jobId)
        if (!job) return
        const next =
          job.status === 'accepted' ? 'in_progress' : job.status === 'in_progress' ? 'completed' : null
        if (!next) return
        set((s) => ({
          fabricationJobs: s.fabricationJobs.map((j) => (j.id === jobId ? { ...j, status: next } : j)),
          fabricationRequests: s.fabricationRequests.map((r) =>
            r.id === job.requestId
              ? { ...r, status: next === 'in_progress' ? 'in_progress' : 'completed' }
              : r,
          ),
        }))
      },

      payFabJob: (jobId, mode = 'paid') => {
        set((s) => ({
          fabricationJobs: s.fabricationJobs.map((j) =>
            j.id === jobId ? { ...j, paymentStatus: mode } : j,
          ),
          fabricationRequests: s.fabricationRequests.map((r) => {
            const job = s.fabricationJobs.find((j) => j.id === jobId)
            if (!job || r.id !== job.requestId) return r
            return mode === 'paid' ? { ...r, status: 'paid' } : r
          }),
        }))
      },

      reviewFabJob: (jobId, rating, comment) => {
        set((s) => ({
          fabricationJobs: s.fabricationJobs.map((j) =>
            j.id === jobId ? { ...j, review: { rating, comment } } : j,
          ),
        }))
      },

      recordPayment: ({ customerId, invoiceId, amount, method, note }) => {
        const payment: Payment = {
          id: uid('pay'),
          customerId,
          invoiceId,
          amount,
          method,
          at: now(),
          note,
          recordedBy: get().currentUserId ?? 'u-admin',
        }
        set((s) => ({
          payments: [payment, ...s.payments],
          ledger: [
            {
              id: uid('led'),
              customerId,
              type: 'credit',
              amount,
              ref: payment.id,
              at: now(),
              note: note ?? `${method.toUpperCase()} collection`,
            },
            ...s.ledger,
          ],
          invoices: s.invoices.map((inv) => {
            if (invoiceId && inv.id === invoiceId) {
              const paidAmount = inv.paidAmount + amount
              const full = inv.amount + inv.gstAmount
              return {
                ...inv,
                paidAmount,
                status: paidAmount >= full ? 'paid' : 'partial',
              }
            }
            return inv
          }),
          users: s.users.map((u) =>
            u.id === customerId ? { ...u, creditUsed: Math.max(0, u.creditUsed - amount) } : u,
          ),
        }))
        get().addNotification({
          userId: customerId,
          title: 'Payment received',
          body: `${method.toUpperCase()} ${amount} recorded`,
          channel: 'sms',
        })
      },

      toggleWishlist: (productId) => {
        const userId = get().currentUserId
        if (!userId) return
        set((s) => {
          const current = s.wishlists[userId] ?? []
          const next = current.includes(productId)
            ? current.filter((id) => id !== productId)
            : [...current, productId]
          return { wishlists: { ...s.wishlists, [userId]: next } }
        })
      },

      wishlistFor: (userId) => get().wishlists[userId] ?? [],

      markNotificationRead: (id) => {
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        }))
      },

      addNotification: (n) => {
        set((s) => ({
          notifications: [
            { ...n, id: uid('n'), at: now(), read: false },
            ...s.notifications,
          ],
        }))
      },

      addCrmActivity: (a) => {
        set((s) => ({
          crmActivities: [{ ...a, id: uid('crm'), at: now() }, ...s.crmActivities],
        }))
      },

      updateCompany: (patch) => set((s) => ({ company: { ...s.company, ...patch } })),

      estimatorBom: (city, floors) => {
        const mult = floors >= 1 ? 1 + floors * 0.35 : 1
        return [
          { productId: 'p-tmt-12', qty: Math.round(180 * mult), reason: `Columns & slab for ${city}` },
          { productId: 'p-tmt-16', qty: Math.round(90 * mult), reason: 'Main bars' },
          { productId: 'p-angle-40', qty: Math.round(40 * mult), reason: 'Roof / staircase support' },
          { productId: 'p-sq-1', qty: Math.round(60 * mult), reason: 'Windows, railings frames' },
          { productId: 'p-roof-color', qty: Math.round(80 * mult), reason: 'Roofing coverage' },
          { productId: 'p-acc-hinge', qty: 4, reason: 'Gate hardware' },
        ]
      },

      reserveEstimatorBom: (bom, warehouseId) => {
        set((s) => ({
          inventory: s.inventory.map((row) => {
            const item = bom.find((b) => b.productId === row.productId && row.warehouseId === warehouseId)
            if (!item) return row
            return { ...row, reserved: row.reserved + item.qty }
          }),
          stockMovements: [
            ...bom.map((b) => ({
              id: uid('sm'),
              productId: b.productId,
              warehouseId,
              type: 'reserve' as const,
              qty: b.qty,
              ref: 'ESTIMATOR',
              at: now(),
              note: 'Reserved from G+ estimator',
            })),
            ...s.stockMovements,
          ],
        }))
      },
    }),
    {
      name: 'steel-cart-v2',
      partialize: (s) => ({
        currentUserId: s.currentUserId,
        users: s.users,
        products: s.products,
        inventory: s.inventory,
        quotations: s.quotations,
        orders: s.orders,
        invoices: s.invoices,
        payments: s.payments,
        ledger: s.ledger,
        purchaseRequests: s.purchaseRequests,
        purchaseOrders: s.purchaseOrders,
        goodsReceipts: s.goodsReceipts,
        trips: s.trips,
        fabricationRequests: s.fabricationRequests,
        fabricationQuotes: s.fabricationQuotes,
        fabricationJobs: s.fabricationJobs,
        stockMovements: s.stockMovements,
        stockTransfers: s.stockTransfers,
        crmActivities: s.crmActivities,
        notifications: s.notifications,
        wishlists: s.wishlists,
        company: s.company,
      }),
    },
  ),
  shallow,
)

export function usePriceForProduct(product: Product) {
  const userId = useAppStore((s) => s.currentUserId)
  const role = useAppStore((s) => s.users.find((u) => u.id === s.currentUserId)?.role ?? 'retail')
  const special = useExtrasStore((s) => {
    if (!userId) return null
    const row = s.specialPrices.find((p) => p.customerId === userId && p.productId === product.id)
    return row?.price ?? null
  })
  return resolveUnitPrice(
    product,
    role as import('@/types').Role,
    { specialPrice: special },
  )
}
