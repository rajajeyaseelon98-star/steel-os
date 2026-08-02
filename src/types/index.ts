export type Role =
  | 'super_admin'
  | 'manufacturer'
  | 'master_trader'
  | 'warehouse_manager'
  | 'fabricator'
  | 'dealer'
  | 'contractor'
  | 'driver'
  | 'retail'

export type VerificationStatus =
  | 'unverified'
  | 'gst_pending'
  | 'business_pending'
  | 'kyc_pending'
  | 'verified'
  | 'suspended'
  | 'rejected'

export type PriceType =
  | 'retail'
  | 'dealer'
  | 'contractor'
  | 'wholesale'
  | 'project'
  | 'special'

export type OrderStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'partially_dispatched'
  | 'dispatched'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'return_requested'
  | 'refunded'

export type QuotationStatus =
  | 'draft'
  | 'sent'
  | 'accepted'
  | 'rejected'
  | 'expired'
  | 'revised'
  | 'converted'

export type PurchaseRequestStatus =
  | 'draft'
  | 'submitted'
  | 'approved'
  | 'rejected'
  | 'converted'

export type PurchaseOrderStatus =
  | 'draft'
  | 'sent'
  | 'confirmed'
  | 'partially_received'
  | 'closed'
  | 'cancelled'

export type TripStatus =
  | 'assigned'
  | 'loading'
  | 'out_for_delivery'
  | 'arrived'
  | 'delivered'
  | 'failed'
  | 'rescheduled'

export type FabricationStatus =
  | 'open'
  | 'quoting'
  | 'selected'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'paid'

export type FabricationType = 'gate' | 'grill' | 'stair' | 'roof' | 'shed'

export type PaymentMethod = 'cash' | 'upi' | 'bank' | 'credit'

export type CategorySlug =
  | 'ms-pipe'
  | 'gi-pipe'
  | 'square-pipe'
  | 'rectangle-pipe'
  | 'angle'
  | 'channel'
  | 'flat'
  | 'round-bar'
  | 'plate'
  | 'sheet'
  | 'roofing-sheet'
  | 'tmt'
  | 'accessories'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: Role
  companyName: string
  gstin?: string
  verificationStatus: VerificationStatus
  creditLimit: number
  creditUsed: number
  creditDays: number
  city: string
  avatarInitials: string
}

export interface Address {
  id: string
  userId: string
  label: string
  line1: string
  city: string
  district: string
  pincode: string
  isDefault: boolean
}

export interface Warehouse {
  id: string
  name: string
  city: string
  district: string
  address: string
  managerId?: string
}

export interface Brand {
  id: string
  name: string
  manufacturerId: string
}

export interface Manufacturer {
  id: string
  name: string
  brands: string[]
}

export interface Product {
  id: string
  name: string
  sku: string
  category: CategorySlug
  brandId: string
  manufacturerId: string
  images: string[]
  weightKg: number
  thicknessMm: number
  lengthFt: number
  description: string
  gstPercent: number
  deliveryDays: number
  prices: Record<PriceType, number>
}

export interface InventoryItem {
  id: string
  productId: string
  warehouseId: string
  onHand: number
  reserved: number
  incoming: number
  damaged: number
  barcode: string
  qrCode: string
}

export interface StockMovement {
  id: string
  productId: string
  warehouseId: string
  type: 'in' | 'out' | 'reserve' | 'release' | 'transfer' | 'damage' | 'adjust'
  qty: number
  ref: string
  at: string
  note?: string
}

export interface StockTransfer {
  id: string
  fromWarehouseId: string
  toWarehouseId: string
  productId: string
  qty: number
  status: 'pending' | 'in_transit' | 'received' | 'cancelled'
  createdAt: string
}

export interface OrderItem {
  productId: string
  warehouseId: string
  qty: number
  unitPrice: number
  priceType: PriceType
  gstPercent: number
  weightKg: number
}

export interface Order {
  id: string
  number: string
  customerId: string
  createdBy: string
  status: OrderStatus
  items: OrderItem[]
  quotationId?: string
  notes?: string
  createdAt: string
  updatedAt: string
  dispatchTripId?: string
}

export interface QuotationItem {
  productId: string
  warehouseId: string
  qty: number
  unitPrice: number
  priceType: PriceType
  gstPercent: number
}

export interface Quotation {
  id: string
  number: string
  customerId: string
  createdBy: string
  status: QuotationStatus
  items: QuotationItem[]
  validityDate: string
  notes?: string
  projectName?: string
  createdAt: string
  orderId?: string
}

export interface Invoice {
  id: string
  number: string
  orderId: string
  customerId: string
  amount: number
  gstAmount: number
  paidAmount: number
  status: 'unpaid' | 'partial' | 'paid' | 'overdue'
  dueDate: string
  createdAt: string
}

export interface Payment {
  id: string
  customerId: string
  invoiceId?: string
  amount: number
  method: PaymentMethod
  at: string
  note?: string
  recordedBy: string
}

export interface LedgerEntry {
  id: string
  customerId: string
  type: 'debit' | 'credit'
  amount: number
  ref: string
  at: string
  note: string
}

export interface PurchaseRequest {
  id: string
  number: string
  status: PurchaseRequestStatus
  productId: string
  warehouseId: string
  qty: number
  reason: string
  createdBy: string
  createdAt: string
  poId?: string
}

export interface PurchaseOrder {
  id: string
  number: string
  supplierId: string
  status: PurchaseOrderStatus
  items: { productId: string; warehouseId: string; qty: number; unitCost: number }[]
  createdAt: string
  prId?: string
}

export interface GoodsReceipt {
  id: string
  number: string
  poId: string
  status: 'draft' | 'posted'
  items: { productId: string; warehouseId: string; qty: number }[]
  inspection: 'pending' | 'pass' | 'partial' | 'fail'
  createdAt: string
}

export interface Vehicle {
  id: string
  number: string
  type: string
  capacityTons: number
}

export interface Driver {
  id: string
  userId: string
  licenseNo: string
  vehicleId?: string
}

export interface DeliveryTrip {
  id: string
  orderId: string
  vehicleId: string
  driverId: string
  status: TripStatus
  loadingConfirmed: boolean
  podSignature?: string
  podPhotos: string[]
  notes?: string
  createdAt: string
}

export interface FabricationRequest {
  id: string
  number: string
  customerId: string
  type: FabricationType
  dimensions: string
  photos: string[]
  location: string
  city: string
  notes?: string
  status: FabricationStatus
  selectedQuoteId?: string
  createdAt: string
}

export interface FabricationQuote {
  id: string
  requestId: string
  fabricatorId: string
  amount: number
  days: number
  notes: string
  materials: { productId: string; qty: number }[]
  status: 'sent' | 'accepted' | 'rejected'
  createdAt: string
}

export interface FabricationJob {
  id: string
  requestId: string
  quoteId: string
  fabricatorId: string
  status: 'accepted' | 'in_progress' | 'completed'
  paymentStatus: 'pending' | 'partial' | 'paid'
  review?: { rating: number; comment: string }
}

export interface CrmActivity {
  id: string
  customerId: string
  type: 'call' | 'visit' | 'note' | 'reminder' | 'feedback'
  summary: string
  at: string
  createdBy: string
  interestedProducts?: string[]
}

export interface NotificationItem {
  id: string
  userId: string
  title: string
  body: string
  channel: 'in_app' | 'push' | 'sms' | 'whatsapp' | 'email'
  read: boolean
  at: string
  link?: string
}

export interface Employee {
  id: string
  name: string
  roleLabel: string
  phone: string
  salary: number
  status: 'active' | 'on_leave' | 'inactive'
}

export interface AttendanceRecord {
  id: string
  employeeId: string
  date: string
  status: 'present' | 'absent' | 'half' | 'leave'
}

export interface CompanySettings {
  name: string
  gstin: string
  bankName: string
  bankAccount: string
  ifsc: string
  theme: 'steel'
  language: 'en' | 'ta'
  taxPercentDefault: number
}

export interface BomSuggestion {
  productId: string
  qty: number
  reason: string
}

export interface SpecialCustomerPrice {
  id: string
  customerId: string
  productId: string
  price: number
  note?: string
}

export interface NotificationPrefs {
  userId: string
  in_app: boolean
  push: boolean
  sms: boolean
  whatsapp: boolean
  email: boolean
}

export interface AuditLog {
  id: string
  at: string
  actorId: string
  action: string
  entity: string
  ref: string
  detail: string
}

export interface FuelLog {
  id: string
  vehicleId: string
  liters: number
  amount: number
  at: string
  note?: string
}

export interface TripExpense {
  id: string
  tripId?: string
  vehicleId: string
  category: 'toll' | 'loading' | 'parking' | 'other'
  amount: number
  at: string
  note?: string
}

export interface LeaveRequest {
  id: string
  employeeId: string
  from: string
  to: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
}

export interface SalaryPayment {
  id: string
  employeeId: string
  month: string
  amount: number
  status: 'draft' | 'paid'
  at: string
}

export interface Supplier {
  id: string
  name: string
  type: 'manufacturer' | 'local_supplier'
  phone: string
  city: string
  outstanding: number
}

export interface EstimatorDraft {
  id: string
  city: string
  floors: number
  customerId: string
  bom: BomSuggestion[]
  quotationId?: string
  reserved: boolean
  deliveryDate?: string
  fabricationAttached?: boolean
  fabricationRequestId?: string
}
