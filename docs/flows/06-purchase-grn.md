# 06 — Purchase → PO → GRN → Stock

> **OUT OF SCOPE (2-role trim).** Historical only — see [00-INDEX](./00-INDEX.md) · [99](./99-gaps-and-stubs.md).

**Status:** Removed from live UI  
**Actors:** ~~Admin / Warehouse~~  
**Journey:** **E** (archived)

## Entry routes

| Route | Component |
|---|---|
| `/admin/purchase` | `AdminPurchasePage` |
| `/admin/vendors` | `AdminVendorsPage` |
| `/admin/ai` | `AdminAiPage` *(can `createPR` for low stock)* |
| `/warehouse/receiving` | `WarehouseReceivingPage` |

## Store actions

| Action | Effect |
|---|---|
| `createPR` | Purchase request `submitted` |
| `convertPRtoPO` | PR → `converted`; creates PO + draft GRN |
| `postGRN` | Inspection pass/fail; on pass → stock ↑, PO closed path |
| extras `addSupplier` / `updateSupplier` | Vendor admin |

## Status model

| Entity | Typical path |
|---|---|
| PR | `submitted` → `converted` |
| PO | created `sent` → `closed` (after GRN) |
| GRN | `draft` → `posted` |

## Step-by-step

### Admin (Journey E)

1. `/admin/purchase` — **Create PR** (`createPR`) with lines / warehouse.  
2. **Convert to PO** (`convertPRtoPO`) — draft GRN appears.  
3. Optionally start from `/admin/ai` low-stock → `createPR`.  
4. Vendors: `/admin/vendors` — view / add suppliers.

### Warehouse

1. `/warehouse/receiving` — open GRN.  
2. **Pass & post** (or fail) → `postGRN`.  
3. On pass: inventory `onHand` increases ([05](./05-inventory-transfers.md)).

## Flowchart

```mermaid
flowchart TD
  subgraph Admin
    AI[/admin/ai] -->|optional createPR| PR
    PU[/admin/purchase] --> PR[createPR]
    PR --> PO[convertPRtoPO]
    PO --> GRN_D[draft GoodsReceipt]
    VE[/admin/vendors] --> SUP[addSupplier]
  end
  subgraph Warehouse
    REC[/warehouse/receiving] --> POST[postGRN]
    POST -->|pass| STOCK[onHand up]
    POST -->|fail| FAIL[no stock bump]
  end
  GRN_D --> REC
```

## Caveats

- Manufacturer portal shows inbound POs read-only ([13](./13-manufacturer-portal.md)) — no manufacturer-side confirm mutation.

## Cross-links

- [05-inventory](./05-inventory-transfers.md) · [11-crm-hr-admin-ops](./11-crm-hr-admin-ops.md) (vendors adjacent)
