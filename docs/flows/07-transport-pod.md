# 07 — Transport & POD

> **OUT OF SCOPE (2-role trim).** Delivery is Admin **Mark delivered** — see [04](./04-orders-fulfillment.md).

**Status:** Removed from live UI  
**Actors:** ~~Admin, Warehouse, Driver~~  
**Journey:** **D** (archived)

## Entry routes

| Route | Component |
|---|---|
| `/admin/transport` | `AdminTransportPage` |
| `/warehouse/dispatch` | `WarehouseDispatchPage` |
| `/driver` | `DriverHome` |
| `/driver/trips/:id` | `DriverTripDetail` |
| `/driver/history` | `DriverHistoryPage` |

## Store actions

| Action | Effect |
|---|---|
| `dispatchOrder` / `partialDispatchOrder` | Creates `DeliveryTrip` `assigned` |
| `confirmLoading` | Trip → `loading` |
| `updateTripStatus` | Advance OFD / arrived / etc. |
| `submitPod` | Signature + photo note → trip + order `delivered` |
| extras `addFuel` / `addExpense` | Transport cost logging on admin |

## Status model (`TripStatus`)

`assigned` → `loading` → `out_for_delivery` → `arrived` → `delivered`  
Also typed: `failed`, `rescheduled`

## Step-by-step

### Admin / Warehouse

1. Approve order ([04](./04-orders-fulfillment.md)).  
2. Dispatch with vehicle + driver → trip created.  
3. `/admin/transport` — trips, fuel, expense.  
4. Confirm loading when available.

### Driver

1. `/driver` — today’s trips.  
2. `/driver/trips/:id` — advance status (loading / OFD / arrived).  
3. **Capture POD** — signature + photo note → `submitPod`.  
4. `/driver/history` — completed trips.

## Flowchart

```mermaid
flowchart TD
  subgraph Ops["Admin / Warehouse"]
    DIS[dispatchOrder] --> T0[trip assigned]
    T0 --> LOAD[confirmLoading]
    ADM[/admin/transport] --> FUEL[addFuel / addExpense]
  end
  subgraph Driver
    DH[/driver] --> TD[/driver/trips/:id]
    TD --> ST[updateTripStatus]
    ST --> POD[submitPod]
    POD --> DONE[order + trip delivered]
  end
  LOAD --> DH
```

## Caveats

- “Start navigation” advances status only — **no map/GPS**.  
- Partial dispatch creates a trip for partial qty path.

## Cross-links

- [04-orders-fulfillment](./04-orders-fulfillment.md)
