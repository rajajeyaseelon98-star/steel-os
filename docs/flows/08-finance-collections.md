# 08 — Finance & Collections

**Status:** Partial — payments/ledger **Implemented**; credit-hold **banner only**  
**Actors:** Buyer, Admin  
**Journey:** **F**

## Entry routes

| Route | Component |
|---|---|
| `/buyer/payments` | `BuyerPaymentsPage` |
| `/buyer/invoices/:id` | `InvoiceDetailPage` |
| `/admin/finance` | `AdminFinancePage` |
| `/profile` | Credit-hold banner if over limit |
| `/admin/crm/:id` | Credit-hold banner on CRM 360 |

## Store / libs

| Piece | Effect |
|---|---|
| `approveOrder` | Creates invoice; increases `creditUsed` |
| `recordPayment` | Ledger credit; invoice `partial`/`paid`; decreases `creditUsed` |
| `availableCredit` / `isCreditHold` (`pricing.ts`) | Display helpers |

## Step-by-step

### Buyer

1. After approve, invoice exists — open from order or `/buyer/payments`.  
2. Record payment (cash / UPI / bank / credit) → `recordPayment`.  
3. `/buyer/invoices/:id` — balances & payment list.  
4. `/profile` — see hold banner if `creditUsed >= creditLimit` (**orders still allowed**).

### Admin

1. `/admin/finance` — outstanding / collected / GST KPIs.  
2. Select invoice → **Collect** demo amount → `recordPayment`.  
3. Ledger entries update on the page.  
4. CRM 360 shows hold banner for over-limit customers.

## Flowchart

```mermaid
flowchart TD
  subgraph Upstream
    AP[approveOrder] --> INV[Invoice created]
    AP --> CU[creditUsed up]
  end
  subgraph Buyer
    PAY[/buyer/payments] --> RP[recordPayment]
    INV_P[/buyer/invoices/:id] --> VIEW[Balances]
  end
  subgraph Admin
    FIN[/admin/finance] --> RP
  end
  RP --> LED[Ledger credit]
  RP --> BAL[Invoice paid/partial]
  RP --> CD[creditUsed down]
  CU --> HOLD{isCreditHold?}
  HOLD -->|banner only| PROF[/profile / CRM]
  HOLD -.->|does NOT block| CO[createOrder still works]
```

## Caveats

- **Critical:** credit hold does not gate `createOrder`.  
- No real payment gateway / UPI deep link.

## Cross-links

- [04-orders](./04-orders-fulfillment.md) · [11-crm-hr-admin-ops](./11-crm-hr-admin-ops.md) · [99-gaps](./99-gaps-and-stubs.md)
