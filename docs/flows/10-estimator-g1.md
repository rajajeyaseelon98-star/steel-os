# 10 — Estimator G+1

> **OUT OF SCOPE (2-role trim).** Historical only — see [99](./99-gaps-and-stubs.md).

**Status:** Removed from live UI  
**Actors:** ~~Admin~~  
**Journey:** **G** (archived)

## Entry routes

| Route | Component |
|---|---|
| `/admin/estimator` | `AdminEstimatorPage` |

## Store actions

| Action | Effect |
|---|---|
| `estimatorBom(city, floors)` | Returns BOM lines `{ productId, qty, reason }` |
| `reserveEstimatorBom` | Reserves inventory for BOM lines |
| `createQuotation` + `sendQuotation` | Quote from BOM |
| `createFabRequest` | Optional fab attach |
| extras `saveEstimatorDraft` / `updateEstimatorDraft` | Persist city/floors/deliveryDate draft |

## Step-by-step (Admin)

1. Open `/admin/estimator`.  
2. Set **city** + **floors** → **Generate BOM** (`estimatorBom`).  
3. **Generate quotation** → creates + sends quote ([03](./03-quotations.md)).  
4. **Reserve inventory** (`reserveEstimatorBom`).  
5. **Schedule delivery** — updates draft `deliveryDate` only (**no trip/order auto-created**).  
6. **Attach fabrication** — `createFabRequest` ([09](./09-fabrication-marketplace.md)).

## Flowchart

```mermaid
flowchart TD
  E[/admin/estimator] --> BOM[estimatorBom]
  BOM --> Q[createQuotation + sendQuotation]
  BOM --> RSV[reserveEstimatorBom]
  E --> DRAFT[save / updateEstimatorDraft]
  DRAFT --> DATE[deliveryDate only]
  E --> FAB[createFabRequest]
  Q --> QUOTE_FLOW[See 03-quotations]
  FAB --> FAB_FLOW[See 09-fabrication]
  RSV --> INV[Inventory reserved]
```

## Caveats

- Schedule ≠ dispatch. Wire trip via normal order dispatch ([04](./04-orders-fulfillment.md) / [07](./07-transport-pod.md)) separately.  
- BOM rules are heuristic mock, not ML.

## Cross-links

- [03-quotations](./03-quotations.md) · [05-inventory](./05-inventory-transfers.md) · [09-fabrication](./09-fabrication-marketplace.md)
