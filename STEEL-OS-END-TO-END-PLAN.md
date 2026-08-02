# Steel Cart — Perfect A-to-Z End-to-End Prototype Plan

> **Product thesis:**  
> *"If we become the largest steel distributor in South Tamil Nadu, what would our operating system look like?"*
>
> This is **not** a Steel Shop App.  
> This is a **Steel + Fabrication B2B Operating System** prototype — similar in ambition to IndiaMART, Udaan, Amazon Business, and JSW Dealer Portal — specialized for regional steel trade.

---

## Document Control

| Field | Value |
|---|---|
| Document name | Steel Cart End-to-End Plan |
| Purpose | Complete A→Z blueprint for UI prototype (not production software) |
| Region focus | South Tamil Nadu |
| Primary goal | Validate operating model via clickable user journeys |
| Out of scope (v1 prototype) | Real APIs, databases, payments, SMS/WhatsApp gateways, live GPS, ML models |
| Frontend stack (locked) | React.js SPA (Vite + TypeScript) — not Next.js |
| Success definition | 5 core journeys completable without verbal explanation |

---

# PART A — Vision & Positioning

## A1. What We Are Building

A multi-role digital platform that connects the entire steel distribution ecosystem:

```text
                    Manufacturers
                (JSW, Tata, SAIL...)
                          │
                 Manufacturer Portal
────────────────────────────────────────────────────────────
                  Master Trading Company
────────────────────────────────────────────────────────────
                   Regional Warehouses
────────────────────────────────────────────────────────────
                Fabrication Partners
────────────────────────────────────────────────────────────
                   Digital Platform (Steel Cart)
────────────────────────────────────────────────────────────
Dealers · Hardware Shops · Welders · Contractors
Builders · Retail Customers · Transporters
```

## A2. What We Are NOT Building (Yet)

- Not a consumer e-commerce “steel shop”
- Not a production ERP on day one
- Not 5 separate native apps before web journeys are proven
- Not API/database-first architecture before UX validation
- Not all 20 modules fully functional in Phase 1

## A3. Strategic References (What to Borrow)

| Reference | Borrow |
|---|---|
| IndiaMART | B2B discovery, RFQ mindset |
| Udaan | Fast reorder, dealer-centric commerce |
| Amazon Business | Multi-user buying, invoices, reorders |
| JSW Dealer Portal | Stock visibility, brand/dealer pricing, allocations |
| Local steel trade reality | Credit, partial dispatch, weight-based pricing, warehouse truth |

## A4. North-Star Outcome

Turn steel distribution from phone/WhatsApp chaos into a coherent operating system:

1. Buy steel digitally with role-based pricing  
2. Quote → Order → Dispatch → Deliver → Collect  
3. Manage warehouse stock truthfully  
4. Connect fabrication jobs to materials + partners  
5. Later: construction procurement intelligence (G+1 house steel estimate)

---

# PART B — Users, Roles & Permissions

## B1. Complete User Types (9)

| # | User Type | Primary Job in System |
|---|---|---|
| 1 | Super Admin | Platform control, users, settings, global analytics |
| 2 | Manufacturer | Supply products, allocations, brand catalog sync |
| 3 | Master Trader | Own trading company ops: pricing, purchase, finance, approvals |
| 4 | Warehouse Manager | Receiving, stock, transfers, dispatch readiness |
| 5 | Fabrication Partner | Receive leads, quote jobs, execute fabrication |
| 6 | Dealer | Buy wholesale, serve local shops/customers, collections |
| 7 | Contractor | Bulk/project buying, quotations, site delivery |
| 8 | Transport Partner / Driver | Trips, navigation, delivery proof |
| 9 | Retail Customer | Browse, small orders, fabrication requests |

## B2. Prototype Role Priority

| Priority | Roles | Treatment |
|---|---|---|
| P0 (fully designed journeys) | Master Trader/Admin, Dealer, Contractor, Warehouse Manager, Fabricator, Driver | Full clickable workspaces |
| P1 (shell / limited screens) | Manufacturer, Retail Customer, Super Admin split | Login entry + limited pages |
| Note | Super Admin + Master Trader may share admin shell in early prototype | Split visually later |

## B3. Permission Matrix (Prototype-Level)

| Capability | Super Admin | Manufacturer | Master Trader | Warehouse | Fabricator | Dealer | Contractor | Driver | Retail |
|---|---|---|---|---|---|---|---|---|---|
| Manage all users | ✅ | ❌ | ✅* | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage products/pricing | ✅ | Limited | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View role price | All | Own supply | All | Cost/ops | Material | Dealer | Contractor/Project | ❌ | Retail |
| Create quotation | ✅ | ❌ | ✅ | ❌ | Job quotes | ✅ | Request | ❌ | Request |
| Place order | ✅ | ❌ | ✅ | ❌ | Materials | ✅ | ✅ | ❌ | ✅ |
| Manage inventory | ✅ | ❌ | ✅ | ✅ | ❌ | Own stock* | ❌ | ❌ | ❌ |
| Dispatch / GRN | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | Assist | ❌ |
| Delivery POD | ✅ | ❌ | View | View | ❌ | View | View | ✅ | View |
| Fabrication leads | ✅ | ❌ | View | ❌ | ✅ | Create | Create | ❌ | Create |
| Finance/ledger | ✅ | Own | ✅ | ❌ | Own dues | Own | Own | Trip expense | Own |
| Reports/analytics | ✅ | Limited | ✅ | Ops | Jobs | Sales | Orders | Trips | ❌ |
| Settings/GST/roles | ✅ | ❌ | ✅ | ❌ | ❌ | Profile | Profile | Profile | Profile |

\*Master Trader scoped to own company. Dealer “own stock” only if dealer-inventory mode is enabled later.

## B4. Auth & Verification Requirements (Module 1)

Every user path must support:

- Login
- Register
- OTP
- Forgot password
- Role selection
- GST verification (UI + status states)
- Business verification (UI + status states)
- KYC (UI + document upload states)

### Auth states to design

- Unverified
- GST pending
- Business pending
- KYC pending
- Verified
- Suspended
- Rejected (with reason)

---

# PART C — Complete Ecosystem Architecture

## C1. Platform Layers

```text
┌──────────────────────────────────────────────┐
│                 Experience Layer             │
│ Customer · Dealer · Warehouse · Driver       │
│ Fabricator · Admin / Master Trader           │
├──────────────────────────────────────────────┤
│                 Domain Layer                 │
│ Catalog · Pricing · Orders · Inventory       │
│ Quotation · Fabrication · Transport          │
│ Purchase · Payments · CRM · HR · Reports     │
├──────────────────────────────────────────────┤
│              Intelligence Layer (Future)     │
│ Demand forecast · Price prediction           │
│ Auto purchase · Construction BOM estimator   │
├──────────────────────────────────────────────┤
│           Prototype Data Layer (Mock)        │
│ JSON fixtures · Fake auth · Local store      │
└──────────────────────────────────────────────┘
```

## C2. One Platform, Many Workspaces

Prototype strategy: **one web app + role switcher**, not five codebases.

```text
Steel Cart (Web Prototype)
├── Auth + Role Gate
├── Workspace: Buyer (Dealer / Contractor / Retail)
├── Workspace: Operations (Master Trader / Super Admin)
├── Workspace: Warehouse
├── Workspace: Fabricator
├── Workspace: Driver / Transport
└── Shared: Notifications · Profile · Support
```

## C3. Future Native App Skins (Same Flows)

| App | Audience | Core home |
|---|---|---|
| Customer App | Retail + light contractor | Home / Search / Products |
| Dealer App | Dealers / hardware shops | Dashboard / Orders / Collections |
| Warehouse App | Warehouse staff | Receiving / Stock / Dispatch |
| Driver App | Drivers | Today’s Trips / POD |
| Fabricator App | Fabrication partners | Leads / Quotations / Jobs |
| Super Admin Console | Platform owners | Users / Pricing / Analytics |

---

# PART D — Complete Modules (1–20) — Nothing Missed

## MODULE 1 — Authentication

### Features
- Login
- Register
- OTP
- Forgot password
- GST Verification
- Business Verification
- KYC
- Role Selection

### Screens
1. Splash / Welcome
2. Login
3. Register (business + personal)
4. OTP verify
5. Forgot password → reset
6. Role selection
7. GST verify
8. Business verify
9. KYC upload
10. Verification pending / rejected / approved

### Edge cases
- Duplicate GST
- Invalid GST format
- OTP expiry/resend
- Role change request after approval

---

## MODULE 2 — Dashboard

### KPIs / Widgets
- Today’s Sales
- Orders
- Pending Orders
- Revenue
- Inventory summary
- Today’s Dispatch
- Today’s Collections
- Outstanding
- Low Stock
- Top Selling Products
- Recent Activity
- Notifications

### Role-specific dashboards
| Role | Must-see widgets |
|---|---|
| Super Admin / Master Trader | Revenue, outstanding, low stock, dispatch, collections |
| Dealer | Orders, collections, outstanding, offers |
| Contractor | Quotations, orders, deliveries, dues |
| Warehouse | Pending receive, pending dispatch, low stock, transfers |
| Fabricator | New leads, open quotes, accepted jobs, payments due |
| Driver | Today’s trips, pending POD, completed deliveries |
| Retail | Orders, offers, fabrication requests |

---

## MODULE 3 — Product Catalog

### Categories (exact)
- MS Pipe
- GI Pipe
- Square Pipe
- Rectangle Pipe
- Angle
- Channel
- Flat
- Round Bar
- Plate
- Sheet
- Roofing Sheet
- TMT
- Accessories

### Every product must show
- Images
- Brand
- Manufacturer
- Weight
- Thickness
- Length
- Price (role-based)
- Available Quantity
- Warehouse
- Delivery Time
- GST

### Catalog UX requirements
- Search
- Category browse
- Filters: brand, thickness, length, warehouse, availability, price range
- Sort: relevance, price, stock, newest
- Product detail
- Related products / accessories
- Out of stock / low stock states
- Multi-warehouse availability view

---

## MODULE 4 — Inventory

### Features
- Warehouse List
- Current Stock
- Reserved Stock
- Incoming Stock
- Damaged
- Transfer Stock
- Barcode
- QR Code
- Stock History

### Inventory truths to visualize
- On-hand
- Reserved (against orders)
- Available = On-hand − Reserved
- Incoming (from PO/transfer)
- Damaged / quarantine
- In-transit transfer

### Warehouse operations screens
- Stock list
- Stock detail + history
- Reserve / unreserve (system-driven in real app; manual demo actions OK)
- Transfer create / approve / receive
- Barcode/QR scan UI (camera mock)
- Cycle count / adjustment (optional light screen)

---

## MODULE 5 — Pricing (Critical)

### Price types
- Retail Price
- Dealer Price
- Contractor Price
- Wholesale Price
- Project Price
- Special Customer Price

### Pricing rules (prototype behavior)
- Logged-in role sees matching default price
- Admin can edit full matrix per SKU / SKU+warehouse
- Quotation can override with Project/Special + reason
- GST shown separately (tax-exclusive clarity)
- Optional: quantity breaks, brand multipliers, city/warehouse differentials (show as rule cards)

### Pricing screens
1. Pricing matrix list
2. SKU pricing editor
3. Special customer price assignment
4. Project price on quotation
5. Price change history / notification preview

---

## MODULE 6 — Orders

### Lifecycle
Create → Edit → Cancel → Quotation link → Approve → Dispatch → Invoice → Delivered → Completed → Return → Refund

### Features
- Create Order
- Edit Order
- Cancel
- Quotation (link/convert)
- Approve
- Dispatch
- Invoice
- Delivered
- Completed
- Return
- Refund

### Order detail must show
- Buyer + role
- Line items (SKU, size, weight, qty, rate, GST, warehouse)
- Status timeline
- Payment status / outstanding
- Dispatch / delivery refs
- Documents: quotation, invoice, POD

### States
- Draft
- Pending Approval
- Approved
- Partially Dispatched
- Dispatched
- Delivered
- Completed
- Cancelled
- Return Requested
- Refunded

---

## MODULE 7 — Quotation

### Flow
Customer asks (“I need 100 Square Pipes”)  
→ Sales prepares quotation  
→ Customer accepts  
→ Convert to Order

### Features
- Create quotation from catalog
- Edit line items / rates / validity
- Send quotation
- Accept / Reject / Negotiate (comment)
- Convert to order
- Expire quotation

### Quotation fields
- Customer
- Validity date
- Price type used
- Line items
- Notes / terms
- Delivery estimate
- GST breakup
- Grand total

---

## MODULE 8 — Delivery

### Features
- Vehicle
- Driver
- Loading
- GPS (map placeholder in prototype)
- Delivered
- Proof
- Signature
- Photo

### Delivery flow
Assign trip → Loading confirmation → Out for delivery → Arrive → Capture POD → Mark delivered → Sync order status

### POD capture
- Customer signature
- Delivery photo(s)
- Optional remarks / partial delivery reason

---

## MODULE 9 — Fabrication Marketplace

### Flow
Customer uploads need (“I need gate”)  
→ Choose type (Gate / Grill / Stair / Roof / Shed)  
→ Dimensions  
→ Photos  
→ Location  
→ Fabricators receive request  
→ Multiple quotations  
→ Customer chooses

### Features
- Fabrication request create
- Category templates (Gate, Grill, Stair, Roof, Shed)
- Dimensions + notes + photos + site location
- Fabricator lead inbox
- Multi-quotation compare
- Accept job
- Materials required (link to catalog)
- Job progress
- Payment status
- Reviews/ratings

### Why this matters
This is the differentiator vs a normal local steel dealer catalog.

---

## MODULE 10 — CRM

### Features
- Customer profile
- Call History
- Visits
- Interested Products
- Credit
- Purchase History
- Feedback
- Reminder

### CRM screens
- Customer list
- Customer 360
- Activity timeline (calls/visits/notes)
- Credit limit / utilization
- Follow-up reminders
- Feedback list

### Prototype depth
Phase 1–2: Customer 360 light  
Phase 4+: credit + reminders stronger

---

## MODULE 11 — Vendor Management

### Features
- Manufacturers
- Suppliers
- Purchase Orders
- Pending Deliveries
- Payment

### Screens
- Manufacturer/supplier directory
- Vendor profile
- PO list linked to vendor
- Pending inbound deliveries
- Vendor payment status

---

## MODULE 12 — Purchase

### Flow
Purchase Request → Purchase Order → Goods Received → Inspection → Payment → Supplier Ledger

### Features
- Purchase Request
- Purchase Order
- Goods Received (GRN)
- Inspection
- Payment
- Supplier Ledger

### States
- PR Draft / Submitted / Approved / Rejected
- PO Sent / Confirmed / Partially Received / Closed / Cancelled
- GRN Draft / Posted
- Inspection Pass / Partial / Fail
- Payment Due / Partial / Paid

---

## MODULE 13 — Payments

### Methods & concepts
- Cash
- UPI
- Bank
- Credit
- Part Payment
- Outstanding
- Ledger

### Screens
- Record payment
- Part-payment allocation to invoices
- Customer outstanding / aging
- Ledger statement
- Collections dashboard (dealer/admin)

### Steel-trade realities to show
- Credit days
- Partial collections
- Invoice-wise outstanding
- Advance vs against-invoice

---

## MODULE 14 — Reports

### Report list
- Daily Sales
- Monthly Sales
- Product Wise
- Warehouse Wise
- Profit
- Purchase
- GST
- Outstanding
- Top Customers
- Dead Stock

### Prototype treatment
Filterable report pages with static/mock charts + export button (non-functional or CSV mock).

---

## MODULE 15 — Notifications

### Channels (UI representation)
- WhatsApp
- SMS
- Email
- Push

### Event types
- Price Changed
- Order Ready
- Delivery updates
- Payment Due
- Quotation received/accepted
- Low stock
- Fabrication lead/quote updates

### Screens
- Notification center
- Notification preferences
- Event → channel matrix (admin settings)

---

## MODULE 16 — AI (Future / Phase 5 mocks)

### Capabilities
- AI Price Prediction
- Demand Forecast
- Best Seller Prediction
- Auto Purchase Suggestion

### Prototype treatment
Insight cards + sample recommendations. No real ML required.

---

## MODULE 17 — Analytics

### Metrics
- Revenue
- Profit
- Sales
- Cities
- Customer Growth
- Order Trends
- Fast Moving Products
- Dead Stock

### Screens
- Analytics overview
- Geography (South TN cities)
- Product movement
- Customer growth

---

## MODULE 18 — HR

### Features
- Employees
- Attendance
- Salary
- Roles
- Leave

### Prototype treatment
Light admin module (list + detail + status). Not Phase 1 critical path.

---

## MODULE 19 — Transport

### Features
- Drivers
- Vehicles
- Trip
- Fuel
- Expense

### Links to
- Delivery module
- Driver app
- Order dispatch

---

## MODULE 20 — Settings

### Features
- GST
- Bank
- Roles
- Permissions
- Taxes
- Theme
- Language
- Company

### Screens
- Company profile
- Tax/GST settings
- Bank accounts
- Roles & permissions matrix
- Theme / language
- Document number series (optional)

---

# PART E — Application Surfaces (Every App)

## E1. Customer App

```text
Home
Search
Products
Offers
Brands
Quotation
Orders
Invoices
Payments
Wishlist
Notifications
Support
Profile
```

## E2. Dealer App

```text
Dashboard
Customers
Orders
Inventory
Purchase
Sales
Collections
Reports
Profile
```

## E3. Warehouse App

```text
Receiving
Stock
Dispatch
Transfer
Barcode
Reports
```

## E4. Driver App

```text
Today’s Trips
Navigation
Delivery Proof
Customer Signature
Photos
```

## E5. Fabricator App

```text
Lead Requests
My Quotations
Accepted Jobs
Materials Required
Payments
Reviews
```

## E6. Super Admin / Master Trader Console

```text
Users
Manufacturers
Products
Pricing
Warehouses
Orders
Analytics
Finance
Settings
```

---

# PART F — Core End-to-End Journeys (Non-Negotiable)

These journeys define the prototype. Every screen must serve at least one.

## Journey A — Hardware Shop Reorder (Dealer)

**Persona:** Dealer / hardware shop  
**Goal:** Reorder pipes quickly at dealer price

### Steps
1. Login as Dealer  
2. Search “MS Square Pipe 1 inch”  
3. View stock by warehouse + dealer price + GST  
4. Create quotation or place order  
5. Track Approved → Dispatched → Delivered  
6. View invoice + outstanding  

### Proves
Catalog + tier pricing + order lifecycle

---

## Journey B — Contractor Bulk / Project Buy

**Persona:** Contractor  
**Goal:** Buy bulk with project pricing via quotation

### Steps
1. Login as Contractor  
2. Request 100 square pipes + angles  
3. Sales/Master Trader prepares quotation (project price)  
4. Contractor accepts  
5. Convert to order  
6. Partial dispatch supported in UI  
7. Credit / outstanding visible  

### Proves
Quotation → order conversion + credit reality

---

## Journey C — Fabrication Marketplace (Gate)

**Persona:** Contractor / Retail / Welder-customer  
**Goal:** Get a gate fabricated

### Steps
1. Create fabrication request (Gate)  
2. Enter dimensions, photos, location  
3. Multiple fabricators receive lead  
4. Submit competing quotations  
5. Customer chooses fabricator  
6. Materials required linked from catalog  
7. Job accepted → payment/review states  

### Proves
Ecosystem differentiator beyond steel catalog

---

## Journey D — Warehouse Dispatch

**Persona:** Warehouse Manager (+ Driver handoff)

### Steps
1. See pending approved order  
2. Reserve stock  
3. Pick / load (barcode/QR UI)  
4. Assign vehicle + driver  
5. Mark dispatched  
6. Stock & reserved quantities update visually  
7. Driver completes POD  

### Proves
Inventory as system spine

---

## Journey E — Master Trader Purchase from Manufacturer

**Persona:** Master Trader / Admin

### Steps
1. Low stock alert  
2. Create Purchase Request  
3. Convert to Purchase Order  
4. Goods Received + Inspection  
5. Stock increases in warehouse  
6. Supplier ledger entry appears  

### Proves
Supply side closes the loop

---

## Journey F — Collections & Credit (Phase 4)

**Persona:** Dealer / Master Trader / Finance

### Steps
1. Open outstanding aging  
2. Record part payment (UPI/Cash/Bank/Credit adjust)  
3. Allocate to invoice(s)  
4. Ledger updates  
5. Notification “Payment Due” / receipt  

### Proves
Money flow matches steel trade

---

## Journey G — Construction Procurement Vision (Phase 5)

**Persona:** Contractor

### Prompt
> “I need steel for a G+1 house in Sankarankovil.”

### System response (mock intelligence)
1. Estimate approximate steel quantities  
2. Suggest pipes, angles, accessories  
3. Generate quotation draft  
4. Check warehouse stock  
5. Reserve inventory (UI)  
6. Schedule delivery  
7. Offer fabrication partners for gates/railings  

### Proves
Catalog → Construction Procurement Platform

---

# PART G — Five-Phase Delivery Plan

## Phase Overview

| Phase | Name | Goal | Exit criteria |
|---|---|---|---|
| 1 | Customer & Sales | Prove digital steel buying | Journeys A + B clickable |
| 2 | Business Operations | Prove internal ops | Journeys D + E connected |
| 3 | Fabrication & Logistics | Prove ecosystem expansion | Journey C + POD loop |
| 4 | Finance | Prove money/credit flow | Journey F complete |
| 5 | Intelligence | Prove future OS vision | Journey G demoable |

---

## PHASE 1 — Customer & Sales (UI Only)

### Scope
- Authentication (full UI states)
- Product catalog
- Product details
- Quotations
- Orders
- Customer / dealer / contractor profile
- Buyer dashboards (light)
- Role switcher

### Exact screen target: 18–25

#### Auth (8–10)
Welcome, Login, Register, OTP, Forgot/Reset, Role selection, GST, Business, KYC, Pending

#### Catalog (5–6)
Home, Category list, Product list/search, Product detail, Offers/Brands (light)

#### Quotation & Orders (6–8)
Quotation list/create/detail, Order list/detail/timeline, Invoice preview

#### Profile (2–3)
Business profile, addresses, credit summary (static)

### Phase 1 non-goals
Inventory deep ops, purchase, fabrication, driver, real payments, AI

### Phase 1 done when
- Dealer can reorder with dealer price  
- Contractor can accept quotation → order  
- Status timeline is understandable  

---

## PHASE 2 — Business Operations

### Scope
- Admin / Master Trader dashboard (full KPI set)
- Inventory module
- Pricing matrix
- Purchase module
- Warehouse app shell
- Vendor management (light)
- Low stock → purchase suggestion entry points

### Exact screen target: +15–20

#### Admin
Dashboard, Users (light), Products admin, Warehouses list

#### Inventory / Warehouse
Stock list/detail/history, Transfer, Receiving, Dispatch queue, Barcode/QR UI

#### Pricing
Matrix list, SKU editor, special prices

#### Purchase / Vendor
PR, PO, GRN, Inspection, Vendor list/profile

### Phase 2 done when
- Order reserve/dispatch updates stock visuals  
- Low stock can create PR→PO→GRN→stock increase  

---

## PHASE 3 — Fabrication & Logistics

### Scope
- Fabrication marketplace
- Delivery tracking
- Driver app
- Transport management (drivers/vehicles/trips/fuel/expense light)

### Exact screen target: +12–18

#### Fabrication
Request create, lead inbox, quote compose/compare, job detail, materials required, reviews

#### Delivery / Driver / Transport
Trip assign, loading, map placeholder, POD (signature+photo), today’s trips, vehicles/drivers, trip expense light

### Phase 3 done when
- Gate request gets multiple quotes and acceptance  
- Dispatch → driver POD closes delivery loop  

---

## PHASE 4 — Finance

### Scope
- Payments (cash/UPI/bank/credit/part payment)
- Outstanding + ledger
- Invoices + GST views
- Collections
- Core reports
- CRM credit/reminders stronger
- Notification center richer for payment/order events

### Exact screen target: +10–14

### Phase 4 done when
Any order can demonstrate invoice → partial pay → outstanding → ledger without confusion.

---

## PHASE 5 — Intelligence (Version 3 Preview)

### Scope (mock only)
- Analytics dashboards
- AI forecasting cards
- Demand / bestseller / dead stock insights
- Auto purchase suggestions
- Construction procurement estimator (G+1 Sankarankovil scenario)

### Exact screen target: +6–10

### Phase 5 done when
Stakeholders can see why this becomes a **construction procurement platform**, not merely an online catalog.

---

## Phase Dependency Map

```text
Phase 1 (Buy/Quote/Order)
    │
    ▼
Phase 2 (Stock/Price/Purchase)
    │
    ├──────────────► Phase 3 (Fabrication + Delivery)
    │
    ▼
Phase 4 (Payments/Credit/Reports)
    │
    ▼
Phase 5 (Analytics/AI/Procurement Vision)
```

---

# PART H — Information Architecture & Navigation

## H1. Global Navigation Principles

- One job per primary section
- Role-based home first
- Persistent: Search (buyers), Notifications, Profile
- Admin: sidebar IA
- Mobile apps: bottom tabs for top 4 tasks only

## H2. Buyer Workspace IA

```text
Home
Catalog
Quotations
Orders
Payments / Outstanding
Fabrication
Notifications
Profile / Support
```

## H3. Admin / Master Trader IA

```text
Dashboard
Orders
Quotations
Products
Pricing
Inventory
Purchase
Vendors
Fabrication (oversight)
Transport
Finance
CRM
Reports / Analytics
HR (later)
Settings
Users
```

## H4. Warehouse IA

```text
Home
Receiving
Stock
Dispatch
Transfers
Scan
Reports
```

## H5. Fabricator IA

```text
Leads
My Quotes
Jobs
Materials
Payments
Reviews
Profile
```

## H6. Driver IA

```text
Today
Trip Detail
Navigate
POD Capture
History
Profile
```

---

# PART I — Data Model (Conceptual — for Prototype Fixtures)

> Prototype uses mock JSON. This schema guides fixture design and future backend.

## I1. Core Entities

```text
Users
Roles
Permissions
Manufacturers
Suppliers
Warehouses
Products
Categories
Brands
Inventory
Orders
OrderItems
Invoices
Payments
Customers
Addresses
Vehicles
Drivers
Fabricators
Projects
Quotations
PurchaseOrders
Notifications
Reports
Settings
AuditLogs
```

## I2. Extended Entities (Needed for Full Coverage)

```text
OTPChallenges
KYCDocuments
BusinessVerifications
PriceLists
CustomerSpecialPrices
StockReservations
StockTransfers
StockMovements
GoodsReceipts
Inspections
DeliveryTrips
ProofOfDelivery
FabricationRequests
FabricationQuotations
FabricationJobs
Ledgers
LedgerEntries
CreditProfiles
CRMActivities
Reminders
Employees
Attendance
Leaves
PayrollRuns
FuelLogs
TripExpenses
NotificationPreferences
TaxConfigs
CompanyProfiles
Wishlists
Offers
Returns
Refunds
```

## I3. Key Relationships

```text
User ── Role ── Permissions
Customer/Dealer/Contractor ── Addresses
Product ── Category / Brand / Manufacturer
Product ── PriceList (by role/customer/project)
Warehouse ── Inventory(Product)
Order ── OrderItems ── Product/Warehouse
Quotation ── (optional) Order
Order ── Invoice ── Payments
Order ── DeliveryTrip ── Driver/Vehicle ── POD
PR ── PO ── GRN ── Inspection ── Inventory↑
FabricationRequest ── FabricationQuotations ── Job
Job ── Materials (Products)
Customer ── CreditProfile ── Ledger
```

## I4. Mock Data Requirements (Minimum)

| Fixture | Minimum rows |
|---|---|
| Users (all roles) | 12+ |
| Categories | 13 (exact list) |
| Products | 40–80 |
| Warehouses | 3–5 (South TN) |
| Inventory rows | per product × warehouse sample |
| Customers | 15+ |
| Quotations | 8–12 |
| Orders across statuses | 15+ |
| POs / GRNs | 5–8 |
| Fabrication requests/quotes | 6–10 |
| Trips / drivers / vehicles | 5 / 5 / 5 |
| Payments / ledger entries | enough for aging demo |
| Notifications | 20 |

---

# PART J — Status Machines (Exact)

## J1. Order Status Machine

```text
Draft
  → Pending Approval
  → Approved
  → Partially Dispatched
  → Dispatched
  → Delivered
  → Completed

Any active → Cancelled (rules by stage)
Completed/Delivered → Return Requested → Refunded / Closed
```

## J2. Quotation Status Machine

```text
Draft → Sent → Accepted → Converted
Sent → Rejected
Sent → Expired
Sent → Revised → Sent
```

## J3. Purchase Status Machine

```text
PR: Draft → Submitted → Approved → Converted
PO: Draft → Sent → Confirmed → Partially Received → Closed
GRN: Draft → Posted
Inspection: Pending → Pass / Partial / Fail
```

## J4. Delivery / Trip Status Machine

```text
Assigned → Loading → Out for Delivery → Arrived → Delivered (POD)
                         ↘ Failed / Rescheduled
```

## J5. Fabrication Status Machine

```text
Request Open → Quoting → Customer Selected → In Progress → Completed → Paid/Reviewed
Request Open → Cancelled
```

## J6. Payment / Outstanding States

```text
Unpaid → Partially Paid → Paid
Overdue (based on credit days)
Credit Hold (optional demo state)
```

---

# PART K — UX / Design System Direction

## K1. Product Feel

Industrial B2B operating system — trustworthy, dense-but-clear, operational.

Avoid:
- Consumer fashion e-commerce fluff
- Generic purple SaaS gradients
- Dashboard soup in first-time buyer home

## K2. Design Tokens (Define Early)

- Color: brand primary, steel neutrals, success/warning/danger, GST/finance accents
- Typography: expressive but readable; strong numerals for weights/prices
- Spacing scale
- Table/list patterns for ops
- Status chips (shared vocabulary across modules)
- Empty / loading / error / verification-pending states

## K3. Motion (Prototype)

2–3 intentional motions max in Phase 1:
- Role workspace transition
- Order status step progress
- POD success confirmation

## K4. Localization Readiness

- Language setting in Module 20
- Prototype can ship English-first
- Keep copy short; reserve Tamil toggle as Phase 4/5 settings demo

## K5. Device Targets

- Web responsive (desktop admin + mobile buyer)
- Mobile-first for Driver / Warehouse scan / Fabricator leads
- Desktop-first for Pricing matrix / Reports / Purchase

---

# PART L — Technical Approach for Prototype (React.js Locked)

## L1. Principles

1. Frontend-first  
2. User-journey-first  
3. Mock-data-first  
4. No backend until journeys approved  
5. One React codebase, multi-workspace  
6. SPA routing by role (not Next.js server routes / RSC)

## L2. Why React.js SPA (Exact Decision)

| Decision | Choice | Reason for this prototype |
|---|---|---|
| App type | React Single Page Application | Matches clickable multi-role OS demo; no SSR/SEO need for B2B internal prototype |
| Bundler | Vite | Fast local demos, simple deploy of static build |
| Language | TypeScript | Safe domain types for orders, pricing, inventory fixtures |
| Routing | React Router v6/v7 | Role workspaces + nested layouts without Next App Router |
| Not chosen | Next.js | Unnecessary SSR/SSG complexity for mock prototype; your preference is React.js |

## L3. Locked Stack (Do Not Randomize)

| Layer | Exact choice | Why |
|---|---|---|
| UI library | React 18/19 + TypeScript | Core |
| Tooling | Vite | Dev speed + static host |
| Routing | `react-router-dom` | Auth gate + 5 workspaces |
| Styling | Tailwind CSS | Fast, precise UI |
| State | Zustand | Role session + mutable mock ops (reserve stock, accept quote) |
| Server state (later only) | None in prototype | Fixtures only |
| Forms | React Hook Form (Phase 1+) | Auth, quotation, fabrication forms |
| Tables | TanStack Table (Phase 2+) | Inventory, orders, pricing matrix |
| Charts | Recharts (Phase 4/5) | Reports/analytics mocks |
| Dates | dayjs | Validity, aging, delivery dates |
| Icons | Inline SVG / curated set only | No random icon-pack drift |
| Hosting | Netlify / Cloudflare Pages / any static host | `vite build` → deploy `dist` |
| Auth | Fake role login (“Enter as Dealer”) | Zero backend |

## L4. React Folder Blueprint (Exact)

```text
steel-os/
  index.html
  package.json
  vite.config.ts
  tailwind.config.js
  public/
  src/
    main.tsx
    App.tsx
    routes/
      index.tsx                 # route tree
      ProtectedRoute.tsx        # role gate
      RoleRedirect.tsx          # post-login home by role
    layouts/
      AuthLayout.tsx
      BuyerLayout.tsx
      AdminLayout.tsx
      WarehouseLayout.tsx
      FabricatorLayout.tsx
      DriverLayout.tsx
    pages/
      auth/                     # Module 1 screens
      buyer/                    # Customer/Dealer/Contractor
      admin/                    # Super Admin / Master Trader
      warehouse/
      fabricator/
      driver/
      shared/                   # notifications, profile, support
    features/
      auth/
      catalog/
      pricing/
      orders/
      quotations/
      inventory/
      purchase/
      delivery/
      fabrication/
      payments/
      crm/
      reports/
      notifications/
      settings/
      analytics/                # Phase 5
      hr/                       # light
      transport/
    components/                 # shared UI primitives
      ui/
      status/
      data-display/
    store/
      authStore.ts
      catalogStore.ts
      orderStore.ts
      inventoryStore.ts
      quotationStore.ts
      fabricationStore.ts
      paymentStore.ts
      notificationStore.ts
    mock/
      users.json
      products.json
      warehouses.json
      inventory.json
      orders.json
      quotations.json
      purchases.json
      fabrication.json
      trips.json
      payments.json
      notifications.json
    types/
      index.ts
      roles.ts
      pricing.ts
      orders.ts
      inventory.ts
    lib/
      pricing.ts                # precedence rules from Part N
      permissions.ts            # matrix from Part B3
      statusMachines.ts         # Part J
      format.ts                 # weight, INR, GST
    styles/
      index.css
```

## L5. React Route Map (Maps to Plan Workspaces)

```text
/login /register /otp /forgot /role /verify/*

/buyer/*          → Dealer | Contractor | Retail
/admin/*          → Super Admin | Master Trader | Manufacturer(shell)
/warehouse/*      → Warehouse Manager
/fabricator/*     → Fabrication Partner
/driver/*         → Transport / Driver

Shared:
/notifications
/profile
/support
```

Role switcher (prototype only) lives in header and writes `authStore.currentUser`.

## L6. Phase → React Delivery Mapping

| Phase | React deliverable |
|---|---|
| Phase 1 | Vite app + auth pages + buyer routes + catalog/quote/order stores |
| Phase 2 | Admin + warehouse layouts + inventory/pricing/purchase features |
| Phase 3 | Fabricator + driver layouts + delivery/fabrication features |
| Phase 4 | Payments/ledger/reports pages + Recharts |
| Phase 5 | Analytics + AI cards + G+1 estimator pages |

## L7. Explicit Non-Goals for Engineering (Until Approved)

- No Next.js / SSR / RSC
- No real database
- No real payment gateway
- No WhatsApp Business API
- No live GPS tracking vendor
- No ML model training
- No native iOS/Android rebuilds yet
- No separate repos per app (one React SPA first)
---

# PART M — Screen Inventory (A–Z Master List)

> Use this as the checklist. Mark each as Planned / Designed / Prototyped / Approved.

## M1. Auth & Onboarding
1. Welcome  
2. Login  
3. Register  
4. OTP  
5. Forgot password  
6. Reset password  
7. Role selection  
8. GST verification  
9. Business verification  
10. KYC upload  
11. Verification pending  
12. Verification rejected  

## M2. Shared
13. Notification center  
14. Support  
15. Profile  
16. Settings (user-level)  
17. Global search (buyer/admin variants)  

## M3. Buyer (Customer / Dealer / Contractor)
18. Home dashboard  
19. Offers  
20. Brands  
21. Category list  
22. Product list/search  
23. Product detail  
24. Wishlist  
25. Quotation list  
26. Quotation create/edit  
27. Quotation detail (accept/reject)  
28. Order list  
29. Order detail + timeline  
30. Invoice detail  
31. Payments / outstanding  
32. Fabrication request create  
33. Fabrication request detail / quotes compare  
34. Address book  

## M4. Admin / Master Trader
35. Admin dashboard  
36. Users management  
37. Manufacturers  
38. Suppliers / vendors  
39. Products admin  
40. Categories/brands admin  
41. Pricing matrix  
42. Special pricing  
43. Warehouses admin  
44. Inventory overview  
45. Orders ops board  
46. Quotation ops  
47. Purchase requests  
48. Purchase orders  
49. GRN / inspection  
50. Finance overview  
51. Ledgers  
52. Collections  
53. CRM customer 360  
54. CRM reminders  
55. Reports hub + each report page  
56. Analytics overview  
57. AI insights  
58. Transport admin  
59. HR employees  
60. Attendance / leave / salary (light)  
61. Company settings  
62. Tax/GST/bank settings  
63. Roles & permissions  
64. Theme/language  
65. Audit log (light)  

## M5. Warehouse App
66. Warehouse home  
67. Receiving  
68. Stock list  
69. Stock detail/history  
70. Dispatch queue  
71. Transfer create/list  
72. Barcode/QR scan  
73. Warehouse reports  

## M6. Driver App
74. Today’s trips  
75. Trip detail  
76. Navigation handoff  
77. POD signature  
78. POD photos  
79. Trip history  

## M7. Fabricator App
80. Lead requests  
81. Quote composer  
82. My quotations  
83. Accepted jobs  
84. Materials required  
85. Payments  
86. Reviews  

## M8. Phase 5 Vision
87. Construction estimator input  
88. Suggested BOM  
89. Auto quotation draft  
90. Stock check + reserve preview  
91. Delivery schedule suggestion  
92. Fabrication attach suggestion  

**Target total:** ~70–92 screens across all phases (do not exceed without approval).

---

# PART N — Pricing, Tax, Credit Rules (Business Logic to Reflect in UI)

## N1. Pricing Precedence (Suggested)

1. Special Customer Price (if exists)  
2. Project Price (on quotation/project)  
3. Role default (Dealer / Contractor / Wholesale / Retail)  
4. Fallback list price  

## N2. Tax

- Show taxable value
- GST rate per item
- GST amount
- Grand total
- GST reports in Phase 4

## N3. Credit

- Credit limit
- Credit days
- Utilized / available
- Overdue invoices
- Optional credit hold banner

## N4. Inventory Coupling

- Order approve → reserve stock (visual)
- Dispatch → reduce on-hand / reserved
- Cancel → release reserve
- GRN post → increase on-hand
- Damage → move to damaged bucket

---

# PART O — Notifications Matrix

| Event | In-app | Push | SMS | WhatsApp | Email |
|---|---|---|---|---|---|
| OTP | ✅ | ❌ | ✅ | ❌ | ❌ |
| Registration / KYC status | ✅ | ✅ | ✅ | optional | ✅ |
| Quotation sent/accepted | ✅ | ✅ | optional | ✅ | ✅ |
| Order approved/ready | ✅ | ✅ | ✅ | ✅ | optional |
| Dispatch / out for delivery | ✅ | ✅ | ✅ | ✅ | optional |
| Delivered + POD | ✅ | ✅ | optional | ✅ | ✅ |
| Payment due / received | ✅ | ✅ | ✅ | ✅ | ✅ |
| Price changed | ✅ | ✅ | optional | ✅ | optional |
| Low stock (admin/warehouse) | ✅ | ✅ | optional | optional | ✅ |
| Fabrication lead/quote updates | ✅ | ✅ | optional | ✅ | optional |

Prototype: implement **in-app notification center** + preference toggles; other channels as labeled actions/states.

---

# PART P — Analytics, AI & Future Procurement OS

## P1. Analytics (Module 17)

- Revenue / profit / sales trends
- City-wise demand (South TN)
- Customer growth
- Order trends
- Fast movers
- Dead stock

## P2. AI (Module 16) — Mock Cards

- Price prediction
- Demand forecast
- Best seller prediction
- Auto purchase suggestion from velocity + stockout risk

## P3. Version 3 Differentiator

Construction procurement flow:

```text
Site need (G+1 Sankarankovil)
  → Steel quantity estimate
  → Suggested BOM (pipes, angles, accessories)
  → Quotation
  → Stock check
  → Reserve
  → Delivery schedule
  → Fabrication partners (gates/railings)
```

This is how Steel Cart becomes different from every local steel dealer.

---

# PART Q — Demo Script (Stakeholder)

Use this 8-minute script:

1. **Frame:** “This is not a shop. This is how we run steel distribution in South Tamil Nadu.”  
2. **Dealer:** reorder pipes with dealer price.  
3. **Contractor:** quotation → accept → order with project price.  
4. **Warehouse:** reserve → scan → dispatch.  
5. **Fabricator:** gate request → competing quotes → accept.  
6. **Driver:** POD signature + photo.  
7. **Admin:** pricing matrix + outstanding + low stock.  
8. **Future:** G+1 Sankarankovil steel estimator.  

Ask one closing question:  
> “If we ran the company on this OS, what is still missing for your real yard operations?”

---

# PART R — Team Workflow & Acceptance

## R1. Definition of Ready (per phase)

- Journeys listed
- Screen list locked
- Mock data available
- Role permissions decided
- Out-of-scope explicit

## R2. Definition of Done (prototype phase)

- All phase journeys clickable end-to-end
- Role homes differ correctly
- Status timelines correct
- Empty/error/pending states present for critical flows
- Demo script executable without apology

## R3. Review Cadence

- Weekly stakeholder walkthrough against Journeys A–G
- Freeze Phase N before starting Phase N+1 expansion
- Change requests logged against module IDs (1–20)

## R4. Approval Gates

| Gate | Approver focus |
|---|---|
| Gate 1 | Catalog + pricing realism |
| Gate 2 | Warehouse/stock truth |
| Gate 3 | Fabrication marketplace usefulness |
| Gate 4 | Credit/collections realism |
| Gate 5 | Future vision excitement vs confusion |

---

# PART S — Risks & Guardrails

| Risk | Guardrail |
|---|---|
| Scope explodes to “full ERP” | Hard phase exit criteria; max screen budget |
| Building backend too early | Mock fixtures until Gate 2–3 |
| Retail-first bias | Dealer/Contractor are P0 heroes |
| Single price bug | Always show role/matrix pricing |
| Fabrication too early | After A/B journeys solid; then C |
| Too many apps | One web multi-workspace first |
| Pretty UI without ops truth | Every flow must update visible status/stock/money |

---

# PART T — Milestone Timeline (Suggested)

> Adjust dates to your capacity; keep sequence fixed.

| Milestone | Deliverable |
|---|---|
| M0 | This plan approved + design tokens + role matrix locked |
| M1 | Phase 1 clickable (Journeys A–B) |
| M2 | Phase 2 clickable (D–E) |
| M3 | Phase 3 clickable (C + POD) |
| M4 | Phase 4 clickable (F finance) |
| M5 | Phase 5 vision (G estimator) + full demo rehearsal |
| M6 | Decision: proceed to real architecture / pilot |

---

# PART U — Post-Prototype (Only After Approval)

When journeys are approved, then and only then:

1. Real auth + RBAC  
2. Database from Part I entities  
3. Order/inventory transactional integrity  
4. Pricing engine  
5. Finance/ledger  
6. Notification providers  
7. Mobile apps for Driver/Warehouse first  
8. AI/estimator as separate capability stream  

Architecture should be shaped by the proven journeys, not by tables.

---

# PART V — Complete Traceability Checklist

Use this to confirm nothing from the source brief is missing.

## Users (9/9)
- [x] Super Admin
- [x] Manufacturer
- [x] Master Trader
- [x] Warehouse Manager
- [x] Fabrication Partner
- [x] Dealer
- [x] Contractor
- [x] Transport Partner
- [x] Retail Customer

## Modules (20/20)
- [x] 1 Authentication
- [x] 2 Dashboard
- [x] 3 Product Catalog
- [x] 4 Inventory
- [x] 5 Pricing
- [x] 6 Orders
- [x] 7 Quotation
- [x] 8 Delivery
- [x] 9 Fabrication Marketplace
- [x] 10 CRM
- [x] 11 Vendor Management
- [x] 12 Purchase
- [x] 13 Payments
- [x] 14 Reports
- [x] 15 Notifications
- [x] 16 AI
- [x] 17 Analytics
- [x] 18 HR
- [x] 19 Transport
- [x] 20 Settings

## Apps (6/6)
- [x] Customer App
- [x] Dealer App
- [x] Warehouse App
- [x] Driver App
- [x] Fabricator App
- [x] Super Admin

## Catalog categories (13/13)
- [x] MS Pipe, GI Pipe, Square Pipe, Rectangle Pipe, Angle, Channel, Flat, Round Bar, Plate, Sheet, Roofing Sheet, TMT, Accessories

## Price types (6/6)
- [x] Retail, Dealer, Contractor, Wholesale, Project, Special Customer

## Phases (5/5)
- [x] Customer & Sales
- [x] Business Operations
- [x] Fabrication & Logistics
- [x] Finance
- [x] Intelligence

## Future vision
- [x] G+1 construction procurement estimator concept

## Method
- [x] Journey-first, not database-first
- [x] Prototype UI before production software

---

# PART W — Immediate Next Actions (Exact)

1. **Approve this plan** (scope + phases + journeys).  
2. Lock **role permission matrix** and **pricing precedence**.  
3. Create **design system tokens** + status chip vocabulary.  
4. Build **mock fixtures** for products/warehouses/orders.  
5. Start **Phase 1 screen build** for Journeys A and B only.  
6. Schedule first stakeholder demo using Part Q script.

---

# PART X — One-Line Operating Principle

> Design the operating system around effortless real trade journeys; only then put architecture underneath.

---

*End of Steel Cart A-to-Z End-to-End Plan*
