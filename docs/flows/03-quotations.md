# 03 — Quotations

**Status:** Implemented  
**Actors:** Admin (`super_admin`, `master_trader`); Buyer (`dealer`, `contractor`, `retail`)  
**Journey:** **B** — Contractor quote → order

## Entry routes

| Route | Component |
|---|---|
| `/admin/quotations` | `AdminQuotationsPage` |
| `/buyer/quotations` | `QuotationsPage` |
| `/buyer/quotations/:id` | `QuotationDetailPage` |

## Store actions

| Action | Effect |
|---|---|
| `createQuotation` | Creates quote (`draft` or as set by caller) |
| `updateQuotationItems` | Edit lines while draft/revised |
| `sendQuotation` | `draft` → `sent` |
| `reviseQuotation` | Back to revisable state |
| `acceptQuotation` | Creates order via `createOrder`, quote → `converted` |
| `rejectQuotation` | → `rejected` |
| `expireQuotation` | → `expired` |

## Status model (`QuotationStatus`)

`draft` → `sent` → `accepted` / `rejected` / `expired` / `revised` → `converted` (on accept path)

## Step-by-step

### Admin

1. `/admin/quotations` — create quotation for a customer + lines.  
2. `sendQuotation` — customer can see it.  
3. Optionally revise / expire.

### Buyer (contractor / dealer)

1. `/buyer/quotations` — open sent quote.  
2. `/buyer/quotations/:id` — review lines & totals.  
3. **Accept** → `acceptQuotation` → new order (`pending_approval`) → continue [04](./04-orders-fulfillment.md).  
4. Or **Reject**.

## Flowchart

```mermaid
flowchart TD
  subgraph Admin
    AQ[/admin/quotations] --> CQ[createQuotation]
    CQ --> SQ[sendQuotation]
    SQ --> REV[reviseQuotation]
    SQ --> EXP[expireQuotation]
  end
  subgraph Buyer
    BQ[/buyer/quotations] --> QD[/buyer/quotations/:id]
    QD -->|acceptQuotation| ORD[createOrder]
    QD -->|rejectQuotation| REJ[rejected]
  end
  SQ --> BQ
  ORD --> ORD_PAGE[/buyer/orders/:id]
```

## Caveats

- Seed quote `QT-2026-001` is useful for demos (see README 8-minute path).  
- Transitions live in `appStore` (not `statusMachines.ts`, which is unused).

## Cross-links

- [02-catalog](./02-catalog-pricing-wishlist.md) · [04-orders](./04-orders-fulfillment.md) · [10-estimator](./10-estimator-g1.md) (can also generate + send quote)
