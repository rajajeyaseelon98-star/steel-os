# 99 — Gaps & Stubs (not full flows)

Use this list so flowcharts are not invented for incomplete UI.

| Area | Route / artifact | What works | What does **not** |
|---|---|---|---|
| Manufacturer portal | `/manufacturer` | Read tables | PO confirm / shipping mutations |
| Admin products | `/admin/products` | List | Create / edit SKU |
| Admin users | `/admin/users` | List | Invite / role edit persistence beyond seed |
| Analytics | `/admin/analytics` | Hardcoded Recharts | Live store aggregation |
| Support | `/support` | Static text | Tickets |
| Warehouse scan | `/warehouse/scan` | Text barcode | Camera / hardware |
| Driver nav | `/driver/trips/:id` | Status buttons | Maps / GPS |
| Credit hold | Profile / CRM | Banner via `isCreditHold` | Block `createOrder` |
| Auth forgot/reset | `/forgot`, `/reset` | Navigate | Password change store |
| KYC uploads | `/verify/kyc` | File inputs | Persistence / verification service |
| Estimator schedule | `/admin/estimator` | Draft `deliveryDate` | Auto trip / order |
| `statusMachines.ts` | `src/lib/statusMachines.ts` | Helpers defined | **Unused** — transitions in `appStore` |
| Catalog meta brands/cats | `/admin/catalog-meta` | Static lists | CRUD (warehouse add only) |

## When adding a new flow doc

1. Confirm a Zustand action or real UI mutation exists.  
2. If only display → add a row here, not a Journey flowchart.  
3. Link from [00-INDEX](./00-INDEX.md).
