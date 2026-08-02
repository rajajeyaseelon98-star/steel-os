import type {
  FabricationStatus,
  OrderStatus,
  PurchaseOrderStatus,
  PurchaseRequestStatus,
  QuotationStatus,
  TripStatus,
} from '@/types'

export const orderTimeline: OrderStatus[] = [
  'pending_approval',
  'approved',
  'partially_dispatched',
  'dispatched',
  'delivered',
  'completed',
]

export function canAcceptQuotation(status: QuotationStatus) {
  return status === 'sent' || status === 'revised' || status === 'accepted'
}

export function canSendQuotation(status: QuotationStatus) {
  return status === 'draft' || status === 'revised'
}

export function canReviseQuotation(status: QuotationStatus) {
  return status === 'sent' || status === 'rejected' || status === 'draft'
}

export function fabJobNext(status: FabricationJobStatusLike): FabricationJobStatusLike | null {
  if (status === 'accepted') return 'in_progress'
  if (status === 'in_progress') return 'completed'
  return null
}

type FabricationJobStatusLike = 'accepted' | 'in_progress' | 'completed'

export function requestStatusAfterJob(jobStatus: FabricationJobStatusLike): FabricationStatus {
  if (jobStatus === 'in_progress') return 'in_progress'
  if (jobStatus === 'completed') return 'completed'
  return 'selected'
}

export function prCanConvert(status: PurchaseRequestStatus) {
  return status === 'submitted' || status === 'approved'
}

export function poReceiveNext(status: PurchaseOrderStatus): PurchaseOrderStatus | null {
  if (status === 'sent') return 'confirmed'
  if (status === 'confirmed') return 'partially_received'
  return null
}

export function tripFailOrReschedule(status: TripStatus, mode: 'failed' | 'rescheduled'): TripStatus {
  return mode
}
