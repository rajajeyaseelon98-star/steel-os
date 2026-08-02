# Steel Cart — KT Detail Document (Knowledge Transfer)

> **Purpose:** Living KT / status source of truth for this project.  
> Continue work **in the current Cursor chat/session**. Use this doc + `STEEL-OS-END-TO-END-PLAN.md` so we do not deviate from agreed scope.  
> Update this file when major milestones complete or pending items change.

| Field | Value |
|---|---|
| **Document type** | KT / status handoff (in-session) |
| **Document date** | 2026-08-02 |
| **Product** | Steel Cart — South Tamil Nadu steel + fabrication B2B operating system **prototype** (not production ERP) |
| **Repo** | https://github.com/rajajeyaseelon98-star/steel-os |
| **Local path** | `C:\Users\Lenovo\steel cart\steel-os` |
| **Master plan** | `STEEL-OS-END-TO-END-PLAN.md` |
| **Stack (locked)** | React + TypeScript + Vite + React Router + Zustand + Tailwind CSS v4 + Recharts |
| **Not Next.js** | Explicitly React SPA only |

---

## 1. How we work from this KT doc

### Session convention
- Stay in **this** chat unless you decide otherwise.
- Before new work: skim **§4 Completed** and **§5 Pending**.
- Do not invent new product scope outside the master plan + this KT.
- After meaningful progress: update §4 / §5 in this file.

### Run locally
```powershell
cd "C:\Users\Lenovo\steel cart\steel-os"
npm install
npm run dev
```
App URL: `http://localhost:5173/`

### Guardrails
1. **Prototype only** — mock data, no real APIs/DB/payments/WhatsApp/GPS/ML.
2. **Journey-first** — not a consumer “steel shop app”.
3. **No native apps** until web multi-workspace is approved.
4. **Follow phases** in the master plan; don’t randomly add modules.
5. **Commit + push** local uncommitted gap/Zustand work when you ask for a commit.

---

## 2. Product thesis (do not change)

> “If we become the largest steel distributor in South Tamil Nadu, what would our operating system look like?”

References: IndiaMART + Udaan + Amazon Business + JSW Dealer Portal — specialized for **Steel + Fabrication**.

**9 roles:** Super Admin, Manufacturer, Master Trader, Warehouse Manager, Fabricator, Dealer, Contractor, Driver, Retail.

**6 workspaces in one SPA:** `/buyer`, `/admin`, `/warehouse`, `/fabricator`, `/driver`, `/manufacturer` (shell).

---

## 3. CRITICAL — Git status before continuing

### What is on GitHub today
- Initial commit only: `694dfd0` — Phase 1–5 scaffold as of first push.
- Remote: `origin/master` → `https://github.com/rajajeyaseelon98-star/steel-os.git`

### What exists locally but is NOT committed / NOT pushed
These changes are **required**; without them the app can infinite-loop and miss gap fixes:

| Area | Local files (modified / new) |
|---|---|
| Gap fixes + journeys C/F/G | `src/pages/gaps/GapPages.tsx` (new), updates to Admin/Buyer/Ops/App/Shell |
| Zustand infinite-loop fix | `appStore.ts`, `extrasStore.ts` → `createWithEqualityFn` + `shallow` |
| Pricing Part N | `src/lib/pricing.ts`, `extrasStore` special prices |
| Permissions | `src/lib/permissions.ts` (manufacturer shell, `can()`) |
| Status helpers | `src/lib/statusMachines.ts` (new) |
| Types | `src/types/index.ts` |

**Do this first in the new session:**
```powershell
cd "C:\Users\Lenovo\steel cart\steel-os"
git status
git add -A
git commit -m "Fix gap features, journeys C/F/G, and Zustand infinite re-render loop"
git push -u origin HEAD
```
(Only if the user asks to commit/push — or they run it themselves.)

---

## 4. What is COMPLETED

### 4.1 Infrastructure
- [x] Vite + React + TS project scaffold
- [x] Tailwind v4 + industrial steel theme tokens
- [x] React Router multi-workspace layouts
- [x] Zustand stores with persist (`steel-os-prototype`, `steel-os-extras`)
- [x] Shallow equality stores (fixes “Maximum update depth exceeded”)
- [x] Mock seed data (products, warehouses, users, orders, quotes, fab, trips, finance)
- [x] Shared UI kit (`src/components/ui.tsx`)
- [x] Fake role login + header role switcher
- [x] GitHub repo created under `rajajeyaseelon98-star`

### 4.2 Phases (UI prototype)

| Phase | Name | Status |
|---|---|---|
| 1 | Customer & Sales | **Done** |
| 2 | Business Operations | **Done** |
| 3 | Fabrication & Logistics | **Done** |
| 4 | Finance | **Done** |
| 5 | Intelligence (mocks) | **Done** |

### 4.3 Modules 1–20 (implemented as clickable UI)

| # | Module | Status | Notes |
|---|---|---|---|
| 1 | Authentication | Done | Login/register/OTP/forgot/reset/role/GST/business/KYC |
| 2 | Dashboard | Done | Role homes + admin KPIs |
| 3 | Product Catalog | Done | 13 categories, filters, detail, role/special price |
| 4 | Inventory | Done | Stock, reserve, transfer, barcode mock, history |
| 5 | Pricing | Done | 6 price types + special customer + Part N precedence |
| 6 | Orders | Done | Approve/dispatch/partial/return/refund/timeline |
| 7 | Quotation | Done | Create/send/revise/expire/edit qty/accept/convert |
| 8 | Delivery | Done | Trip, loading, OFD, POD signature/photo note |
| 9 | Fabrication | Done | Request → multi-quote → job → progress → pay → review |
| 10 | CRM | Done | List + 360 + reminders/activities |
| 11 | Vendors | Done | Suppliers CRUD-ish + outstanding + manufacturers |
| 12 | Purchase | Done | PR → PO → GRN → inspection → stock ↑ |
| 13 | Payments | Done | Cash/UPI/bank/credit, part pay, ledger, invoices |
| 14 | Reports | Done | Hub + separate report pages by type |
| 15 | Notifications | Done | Center + prefs + channel labels |
| 16 | AI | Done | Mock insight cards + auto PR |
| 17 | Analytics | Done | Charts + KPIs |
| 18 | HR | Done | Employees, attendance, leave approve, salary pay |
| 19 | Transport | Done | Vehicles/drivers/trips + fuel/expense logs |
| 20 | Settings | Done | Company/GST/bank/language + interactive permission matrix |

### 4.4 Journeys A–G

| Journey | Status | How to demo |
|---|---|---|
| A Dealer reorder | **Working** | Enter as Dealer → Catalog → Place order → switch Admin → Approve |
| B Contractor quote→order | **Working** | Admin Quotations prepare/send → Contractor accept → order |
| C Fabrication | **Working** | Buyer Fabrication request → Fabricator quote → Choose → Jobs advance → pay → Reviews |
| D Warehouse dispatch | **Working** | Admin/WH approve → Dispatch → Driver POD |
| E Purchase from manufacturer | **Working** | Admin Purchase PR→PO→GRN post |
| F Collections / credit | **Working** | Payments + finance + CRM reminders + credit-hold banner |
| G G+1 estimator | **Working** | Admin Estimator → BOM → quote → reserve → schedule → attach fab |

### 4.5 Key routes map

```text
/login … /verify/*
/buyer/*          catalog, quotes, orders, invoices, payments, fab, addresses, wishlist
/admin/*          full ops console + estimator + audit + special pricing + reports/:type + crm/:id
/manufacturer     shell portal (not full admin)
/warehouse/*      receiving, stock, dispatch, transfer, scan, reports
/fabricator/*     leads, quotes, jobs, payments, reviews
/driver/*         trips, POD, history
/search /settings /profile /notifications /support
```

### 4.6 Important source files

| Path | Role |
|---|---|
| `src/App.tsx` | All routes |
| `src/store/appStore.ts` | Core domain mutations |
| `src/store/extrasStore.ts` | Addresses, special prices, prefs, audit, fuel, leave, estimator drafts |
| `src/lib/pricing.ts` | Part N precedence |
| `src/lib/permissions.ts` | `can()`, workspaces, manufacturer shell |
| `src/lib/statusMachines.ts` | Transition helpers |
| `src/mock/data.ts` | Seed fixtures |
| `src/pages/auth|buyer|admin|ops|gaps/*` | Screens |
| `STEEL-OS-END-TO-END-PLAN.md` | Full A–Z product plan |

---

## 5. What is PENDING / NOT DONE

Stay disciplined: these are the only open items unless the stakeholder changes scope.

### 5.1 Must-do immediately (ops)
- [ ] **Commit + push** local gap + Zustand fixes to GitHub
- [ ] Verify infinite-loop is gone after hard refresh
- [ ] Walk Part Q 8-minute demo script once end-to-end

### 5.2 Prototype polish (still UI-only)
- [ ] Real product images (currently emoji placeholders)
- [ ] Camera-based barcode/QR (still text entry mock)
- [ ] Real map/navigation for driver (button stub only)
- [ ] Quote “accepted” intermediate status before convert (optional fidelity)
- [ ] Overdue invoice auto-aging job (mostly seed/`overdue` status)
- [ ] Separate dedicated Dealer vs Customer visual skins (same `/buyer` today — OK for prototype)
- [ ] Use TanStack Table more widely (installed; most tables still custom `Table`)
- [ ] dayjs usage (installed; formatting still mostly native `Date`)
- [ ] Tamil language content (setting toggle exists; copy is English)
- [ ] Theme switcher beyond fixed `steel` token set

### 5.3 Explicitly OUT OF SCOPE until stakeholder approval
- [ ] Real backend / database / Prisma / Firebase
- [ ] Real auth (OTP SMS gateway)
- [ ] Payment gateways
- [ ] WhatsApp Business / SMS providers
- [ ] Live GPS tracking vendor
- [ ] Real ML models
- [ ] Separate native iOS/Android apps
- [ ] Next.js migration
- [ ] Production ERP hardening

### 5.4 Post-prototype (Plan Part U) — only after demo approval
1. Real auth + RBAC  
2. DB from plan entities  
3. Order/inventory transactional integrity  
4. Pricing engine  
5. Finance/ledger  
6. Notification providers  
7. Mobile skins for Driver/Warehouse first  
8. AI/estimator as separate capability stream  

---

## 6. Known bugs fixed (do not reintroduce)

| Bug | Fix |
|---|---|
| `Maximum update depth exceeded` / getSnapshot not cached | `createWithEqualityFn` + `shallow` on both stores |
| `/admin/orders/:id` 404 from notifications | Route + `AdminOrderDetailPage` |
| Buyer quote stuck in draft | Self-serve quotes auto-`sent`; accept allows draft/sent |
| Fabrication showed all requests (`\|\| true`) | Filter by customer / admin |
| Manufacturer had full admin | Workspace `/manufacturer` shell only |
| Special price unused | `extrasStore` + Part N in `resolveUnitPrice` / `usePriceForProduct` |

---

## 7. How to demo (Part Q script — keep this)

1. Frame: “Not a shop — steel distribution OS for South TN.”  
2. **Dealer** → reorder square pipes (note special price if seeded).  
3. **Contractor** → accept quotation → order.  
4. **Warehouse / Admin** → reserve → dispatch.  
5. **Fabricator** → gate lead → competing quotes → accept → advance job → pay → review.  
6. **Driver** → POD signature + photo note.  
7. **Admin** → pricing matrix / special prices / outstanding / low stock.  
8. **Admin Estimator** → G+1 Sankarankovil BOM → quote → reserve → delivery → attach fab.  

Closing question for stakeholder:  
> “If we ran the company on this OS, what is still missing for your real yard?”

---

## 8. Suggested next work order (if continuing build)

Only after §5.1 commit/push + demo:

1. **Visual polish pass** — replace emoji product images with static assets; tighten mobile Driver/Warehouse layouts.  
2. **Stakeholder feedback loop** — log change requests against Module IDs 1–20.  
3. **Freeze prototype** — tag GitHub `v0.1-prototype`.  
4. **Architecture decision** — only then design real API/DB from proven journeys (Plan Part U).  

Do **not** start a second unrelated app or redesign the IA from scratch.

---

## 9. Quick verification checklist

After opening `steel-os` workspace:

```text
[ ] npm run dev starts without errors
[ ] Login → Quick enter as Dealer works (no infinite loop)
[ ] Role switcher changes workspace
[ ] Place order → Admin approve updates stock reserved
[ ] Contractor accepts QT-2026-001 (or new quote)
[ ] Fabricator quote → choose → job advance → review
[ ] Driver POD marks order delivered
[ ] Estimator reserve + attach fab works
[ ] /settings notification prefs save
[ ] git status clean after commit/push
```

---

## 10. How to ask for the next task (in this chat)

Keep requests scoped, for example:

- “Commit and push the local gap + Zustand fixes.”
- “Do the visual polish pass from KT §5.2.”
- “Walk the Part Q demo and fix anything broken.”
- “Tag `v0.1-prototype` after demo.”

Avoid: “rebuild everything”, “switch to Next.js”, “add real backend” — unless you explicitly change KT §5.3.

---

## 11. One-line status

**Phases 1–5 clickable prototype is built and demoable locally; gap fixes + Zustand loop fix exist locally and should be committed/pushed when you ask; next step is stakeholder demo + controlled polish — not a rewrite.**

---

*End of KT detail document. Pair with `STEEL-OS-END-TO-END-PLAN.md` for full product scope.*
