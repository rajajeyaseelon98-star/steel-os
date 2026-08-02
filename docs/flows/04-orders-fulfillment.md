# 04 — Orders & Fulfillment

**Status:** Implemented  
**Actors:** Buyer, Admin, Warehouse, Driver (handoff)  
**Journeys:** **A** (dealer reorder), **D** (dispatch lane — see also [07](./07-transport-pod.md))

## Entry routes

| Route | Component |
|---|---|
| `/buyer/orders` | `OrdersPage` |
| `/buyer/orders/:id` | `OrderDetailPage` |
| `/admin/orders` | `AdminOrdersPage` |
| `/admin/orders/:id` | `AdminOrderDetailPage` |
| `/warehouse/dispatch` | `WarehouseDispatchPage` |

## Store actions

| Action | Effect |
|---|---|
| `createOrder` | Order `pending_approval` |
| `approveOrder` | → `approved`; `reserveStock`; creates invoice; bumps `creditUsed` |
| `cancelOrder` | → `cancelled`; releases stock if needed |
| `dispatchOrder` | Full dispatch + trip `assigned` |
| `partialDispatchOrder` | → `partially_dispatched` + trip |
| `requestReturn` / `refundOrder` | Return / refund path |
| `updateOrderStatus` | Manual status helper |
| `reserveStock` / `releaseStock` | Inventory reservation |

## Status model (`OrderStatus`)

`pending_approval` → `approved` → `partially_dispatched` | `dispatched` → `delivered` → `completed`  
Also: `cancelled`, `return_requested`, `refunded`, `draft`

## Step-by-step

### Buyer (Journey A)

1. Catalog / product → `createOrder` ([02](./02-catalog-pricing-wishlist.md)).  
2. Track `/buyer/orders/:id` (timeline).  
3. After delivery, open invoice `/buyer/invoices/:id` · pay via [08](./08-finance-collections.md).  
4. Optional: cancel / request return when status allows.

### Admin

1. `/admin/orders` — pending board.  
2. Open detail → **Approve** (`approveOrder`).  
3. **Full dispatch** or **Partial dispatch** (`dispatchOrder` / `partialDispatchOrder`).  
4. Handle return/refund/cancel buttons when shown.

### Warehouse

1. `/warehouse/dispatch` — dispatch approved orders (same store actions).  
2. Stock view after reserve: [05](./05-inventory-transfers.md).

### Driver

1. Trip appears after dispatch → POD in [07](./07-transport-pod.md) → order → `delivered`.

## Flowchart

```mermaid
flowchart TD
  subgraph Buyer
    P[Product / Quote accept] --> CO[createOrder]
    CO --> BO[/buyer/orders/:id]
  end
  subgraph Admin_WH["Admin / Warehouse"]
    AO[/admin/orders/:id] --> AP[approveOrder + reserveStock]
    AP --> INV[Invoice + creditUsed]
    AP --> DIS[dispatchOrder / partialDispatch]
    DIS --> TRIP[DeliveryTrip assigned]
  end
  subgraph Driver
    TRIP --> POD[submitPod]
    POD --> DEL[order delivered]
  end
  CO --> AO
  DEL --> BO
```

## Caveats

- Credit hold banner does **not** block `createOrder` (see [08](./08-finance-collections.md)).  
- Driver “navigation” only advances trip status — no map.

## Cross-links

- [03-quotations](./03-quotations.md) · [05-inventory](./05-inventory-transfers.md) · [07-transport](./07-transport-pod.md) · [08-finance](./08-finance-collections.md)
