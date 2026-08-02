# 09 — Fabrication Marketplace

**Status:** Implemented  
**Actors:** Buyer (`dealer` / `contractor` / `retail`), `fabricator`  
**Journey:** **C**

## Entry routes

| Route | Component |
|---|---|
| `/buyer/fabrication` | `FabricationBuyerPage` |
| `/fabricator` | `FabricatorHome` |
| `/fabricator/leads/:id` | `FabricatorLeadDetail` |
| `/fabricator/quotes` | `FabricatorQuotesPage` |
| `/fabricator/jobs` | `FabricatorJobsPage` |
| `/fabricator/payments` | `FabricatorPaymentsPage` |
| `/fabricator/reviews` | `FabricatorReviewsPage` |

## Store actions

| Action | Effect |
|---|---|
| `createFabRequest` | Request `open` |
| `addFabQuote` | Fabricator quote on lead → request often `quoting` |
| `selectFabQuote` | Buyer chooses quote → `selected` + job |
| `advanceFabJob` | Job `accepted` → `in_progress` → `completed` |
| `payFabJob` | Payment `pending`/`partial`/`paid`; request may → `paid` |
| `reviewFabJob` | Buyer/fab review record |

## Status model

| Entity | Path |
|---|---|
| Request (`FabricationStatus`) | `open` → `quoting` → `selected` → `in_progress` → `completed` → `paid` |
| Job | `accepted` → `in_progress` → `completed` |

Types: `gate` | `grill` | `stair` | `roof` | `shed`

## Step-by-step

### Buyer

1. `/buyer/fabrication` — submit request (`createFabRequest`).  
2. Wait for quotes → **Choose** quote (`selectFabQuote`).  
3. After job complete — pay / review from buyer fab UI as available.

### Fabricator

1. `/fabricator` — open leads.  
2. `/fabricator/leads/:id` — add quote (`addFabQuote`).  
3. After selection — `/fabricator/jobs` → **Advance** stages.  
4. `/fabricator/payments` — `payFabJob`.  
5. `/fabricator/reviews` — reviews list / `reviewFabJob`.

## Flowchart

```mermaid
flowchart TD
  subgraph Buyer
    BF[/buyer/fabrication] --> CR[createFabRequest]
    CR --> WAIT[Wait quotes]
    WAIT --> SEL[selectFabQuote]
    SEL --> PAYB[pay / review]
  end
  subgraph Fabricator
    FH[/fabricator] --> LD[/fabricator/leads/:id]
    LD --> AQ[addFabQuote]
    AQ --> WAIT
    SEL --> JOB[/fabricator/jobs]
    JOB --> ADV[advanceFabJob]
    ADV --> PAY[/fabricator/payments]
    PAY --> REV[/fabricator/reviews]
  end
```

## Caveats

- Prototype marketplace — no real messaging/WhatsApp.  
- Estimator can also `createFabRequest` ([10](./10-estimator-g1.md)).

## Cross-links

- [10-estimator-g1](./10-estimator-g1.md) · [12-shared-shell](./12-shared-shell.md)
