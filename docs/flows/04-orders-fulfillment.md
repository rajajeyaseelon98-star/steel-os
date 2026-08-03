# 04 — Orders & Fulfillment

**Status:** Implemented (2-role)  
**Actors:** Retail · Super Admin  
**No warehouse/driver UI** — admin marks delivered after dispatch.

## Entry routes

| Route | Component |
|---|---|
| `/buyer/orders` | `OrdersPage` |
| `/buyer/orders/:id` | `OrderDetailPage` |
| `/buyer/invoices/:id` | `InvoiceDetailPage` |
| `/admin/orders` | `AdminOrdersPage` |
| `/admin/orders/:id` | `AdminOrderDetailPage` |

## Store actions

| Action | Effect |
|---|---|
| `createOrder` | `pending_approval` |
| `approveOrder` | → `approved`; reserve stock; create invoice; bump credit |
| `cancelOrder` | → `cancelled` |
| `dispatchOrder` | → `dispatched` (+ trip seed if any) |
| `markOrderDelivered` | → `delivered` |
| `requestReturn` / `refundOrder` | Return / refund when shown |

## Happy path

1. Retail places order (catalog or accepted quote).  
2. Admin `/admin/orders/:id` → **Accept** → **Dispatch** → **Mark delivered**.  
3. Retail tracks status on `/buyer/orders/:id`; opens invoice via `/buyer/invoices/:id`.

## Flowchart

```mermaid
flowchart TD
  CO[createOrder] --> AP[approveOrder]
  AP --> INV[Invoice]
  AP --> DIS[dispatchOrder]
  DIS --> DEL[markOrderDelivered]
  INV --> BI[/buyer/invoices/:id]
```

## Caveats

- Partial dispatch / POD / collections UIs removed from nav.  
- Invoice detail is minimal (totals + payment list).
