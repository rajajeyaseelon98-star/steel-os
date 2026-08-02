# 05 — Inventory & Transfers

**Status:** Implemented (ops mutations + admin view)  
**Actors:** `warehouse_manager`, Admin (view / approve side-effects)

## Entry routes

| Route | Component |
|---|---|
| `/admin/inventory` | `AdminInventoryPage` |
| `/warehouse` | `WarehouseHome` |
| `/warehouse/stock` | `WarehouseStockPage` |
| `/warehouse/transfers` | `WarehouseTransfersPage` |
| `/warehouse/scan` | `WarehouseScanPage` *(mock)* |
| `/warehouse/reports` | `WarehouseReportsPage` |
| `/warehouse/receiving` | `WarehouseReceivingPage` *(GRN — see [06](./06-purchase-grn.md))* |

## Store actions

| Action | Effect |
|---|---|
| `reserveStock` | Called from `approveOrder` — increases `reserved` |
| `releaseStock` | On cancel / related paths |
| `createTransfer` | Stock transfer `in_transit` |
| `receiveTransfer` | Completes transfer; adjusts warehouse qty |
| `postGRN` | Increases `onHand` on pass ([06](./06-purchase-grn.md)) |
| `availableQty` | `onHand - reserved` |

## Step-by-step

### Warehouse Manager

1. `/warehouse` — KPIs (receiving, dispatch, transfers, SKUs).  
2. `/warehouse/stock` — on-hand / reserved by location.  
3. `/warehouse/transfers` — create transfer → later **Receive**.  
4. `/warehouse/scan` — enter barcode text (mock; no camera).  
5. `/warehouse/reports` — on-hand / reserved / recent movements.  
6. Receiving GRN: [06](./06-purchase-grn.md).

### Admin

1. `/admin/inventory` — table + movement history (display; no manual adjust UI).  
2. Stock also changes when approving orders / posting GRN / transfers.

## Flowchart

```mermaid
flowchart TD
  subgraph Triggers
    AP[approveOrder] --> RS[reserveStock]
    GRN[postGRN pass] --> OH[onHand up]
    CAN[cancelOrder] --> REL[releaseStock]
  end
  subgraph Warehouse
    WH[/warehouse/stock] --> VIEW[View levels]
    TR[/warehouse/transfers] --> CT[createTransfer]
    CT --> RT[receiveTransfer]
    SC[/warehouse/scan] --> MOCK[Text barcode mock]
  end
  RS --> WH
  OH --> WH
  RT --> WH
```

## Caveats

- No manual stock-adjust screen on admin inventory.  
- Scan is prototype text input only.

## Cross-links

- [04-orders](./04-orders-fulfillment.md) · [06-purchase-grn](./06-purchase-grn.md)
