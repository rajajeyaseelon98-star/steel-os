# Steel Cart — User & Feature Flow Index

> Evidence-based flowcharts for **implemented** prototype behavior only.  
> Source of truth: `src/App.tsx`, `src/layouts/Shell.tsx`, `src/store/appStore.ts`, `src/lib/permissions.ts`.

## How to use

1. Pick a **role** in the table below → open linked feature docs.  
2. Or pick a **Journey A–G** → open the matching feature file.  
3. Shallow / display-only screens are listed in [`99-gaps-and-stubs.md`](./99-gaps-and-stubs.md) — do not treat them as full flows.

Demo tip: Login → header **role switcher** (`loginAs`) to hop between lanes mid-journey.

---

## Roles → workspace → flows

| Role | Workspace | Home | Flows (docs) |
|---|---|---|---|
| `super_admin` / `master_trader` | admin | `/admin` | [01](./01-auth-onboarding.md) … [12](./12-shared-shell.md) (all ops) |
| `dealer` / `contractor` / `retail` | buyer | `/buyer` | [01](./01-auth-onboarding.md), [02](./02-catalog-pricing-wishlist.md), [03](./03-quotations.md), [04](./04-orders-fulfillment.md), [08](./08-finance-collections.md), [09](./09-fabrication-marketplace.md), [12](./12-shared-shell.md) |
| `warehouse_manager` | warehouse | `/warehouse` | [01](./01-auth-onboarding.md), [04](./04-orders-fulfillment.md), [05](./05-inventory-transfers.md), [07](./07-transport-pod.md), [12](./12-shared-shell.md) |
| `fabricator` | fabricator | `/fabricator` | [01](./01-auth-onboarding.md), [09](./09-fabrication-marketplace.md), [12](./12-shared-shell.md) |
| `driver` | driver | `/driver` | [01](./01-auth-onboarding.md), [07](./07-transport-pod.md), [12](./12-shared-shell.md) |
| `manufacturer` | manufacturer | `/manufacturer` | [01](./01-auth-onboarding.md), [13](./13-manufacturer-portal.md), [12](./12-shared-shell.md) |

Admin `Guard` also allows entering `/buyer`, `/warehouse`, `/fabricator`, `/driver`, `/manufacturer` for demos.

---

## Journeys A–G → docs

| Journey | Name | Status | Doc |
|---|---|---|---|
| **A** | Dealer reorder | Implemented | [04-orders-fulfillment](./04-orders-fulfillment.md) (+ [02](./02-catalog-pricing-wishlist.md)) |
| **B** | Contractor quote → order | Implemented | [03-quotations](./03-quotations.md) |
| **C** | Fabrication marketplace | Implemented | [09-fabrication-marketplace](./09-fabrication-marketplace.md) |
| **D** | Warehouse dispatch + POD | Implemented | [04](./04-orders-fulfillment.md) + [07](./07-transport-pod.md) |
| **E** | Purchase → GRN → stock | Implemented | [06-purchase-grn](./06-purchase-grn.md) |
| **F** | Collections & credit | Partial\* | [08-finance-collections](./08-finance-collections.md) |
| **G** | Estimator G+1 | Implemented\* | [10-estimator-g1](./10-estimator-g1.md) |

\*F: payments/ledger work; credit-hold is **banner only** (does not block `createOrder`).  
\*G: schedule step updates estimator draft date only (no trip created).

---

## Feature file list

| # | File | Domain |
|---|---|---|
| 00 | [00-INDEX.md](./00-INDEX.md) | This index |
| 01 | [01-auth-onboarding.md](./01-auth-onboarding.md) | Auth & verification |
| 02 | [02-catalog-pricing-wishlist.md](./02-catalog-pricing-wishlist.md) | Catalog & pricing |
| 03 | [03-quotations.md](./03-quotations.md) | Quotations |
| 04 | [04-orders-fulfillment.md](./04-orders-fulfillment.md) | Orders |
| 05 | [05-inventory-transfers.md](./05-inventory-transfers.md) | Inventory & transfers |
| 06 | [06-purchase-grn.md](./06-purchase-grn.md) | Purchase & GRN |
| 07 | [07-transport-pod.md](./07-transport-pod.md) | Transport & POD |
| 08 | [08-finance-collections.md](./08-finance-collections.md) | Finance |
| 09 | [09-fabrication-marketplace.md](./09-fabrication-marketplace.md) | Fabrication |
| 10 | [10-estimator-g1.md](./10-estimator-g1.md) | G+1 estimator |
| 11 | [11-crm-hr-admin-ops.md](./11-crm-hr-admin-ops.md) | CRM / HR / admin ops |
| 12 | [12-shared-shell.md](./12-shared-shell.md) | Shared shell pages |
| 13 | [13-manufacturer-portal.md](./13-manufacturer-portal.md) | Manufacturer (read-only) |
| 99 | [99-gaps-and-stubs.md](./99-gaps-and-stubs.md) | Shallow / stubs |

---

## Doc template (every feature file)

1. Scope & status  
2. Actors  
3. Entry routes  
4. Store actions  
5. Status model  
6. Step-by-step by role  
7. Mermaid flowchart  
8. Cross-links & caveats  
