# 11 — CRM, HR & Admin Ops

> **OUT OF SCOPE (2-role trim).** CRM routes removed; customer search → `/admin/wishlists`.

**Status:** Removed from live UI  
**Actors:** ~~Admin~~

## Entry routes

| Route | Component | Wired? |
|---|---|---|
| `/admin/crm` | `AdminCrmPage` | List |
| `/admin/crm/:id` | `Crm360Page` | `addCrmActivity` + credit banner |
| `/admin/pricing` | `AdminPricingPage` | `updatePrice` |
| `/admin/special-pricing` | `SpecialPricingPage` | `setSpecialPrice` / `removeSpecialPrice` |
| `/admin/hr` | `AdminHrPage` | `addLeave` / `setLeaveStatus` / `paySalary` |
| `/admin/settings` | `AdminSettingsPage` | `updateCompany` + permission matrix view |
| `/admin/audit` | `AuditLogPage` | Read + some writes via `addAudit` |
| `/admin/users` | `AdminUsersPage` | **Display-only** |
| `/admin/reports` · `/admin/reports/:type` | Reports | Read-derived |
| `/admin/analytics` | `AdminAnalyticsPage` | **Hardcoded chart** |
| `/admin/ai` | `AdminAiPage` | Mock cards + `createPR` |
| `/admin/catalog-meta` | `AdminCatalogMetaPage` | Static cats/brands; `addWarehouse` |
| `/admin/vendors` | `AdminVendorsPage` | Supplier extras |

## Step-by-step (high-traffic)

### CRM

1. `/admin/crm` → open customer.  
2. `/admin/crm/:id` — KPIs, credit-hold banner, log activity (`addCrmActivity`).

### Pricing

1. `/admin/pricing` — edit matrix cells → `updatePrice`.  
2. `/admin/special-pricing` — assign customer+SKU override (Part N #1).

### HR

1. `/admin/hr` — add leave → approve/reject → pay salary demo actions.

### Settings / Audit

1. `/admin/settings` — company prefs (`updateCompany`).  
2. `/admin/audit` — chronological action log (if `can(view_audit)`).

## Flowchart (CRM + pricing)

```mermaid
flowchart TD
  subgraph CRM
    L[/admin/crm] --> C360[/admin/crm/:id]
    C360 --> ACT[addCrmActivity]
    C360 --> HOLD[isCreditHold banner]
  end
  subgraph Pricing
    PR[/admin/pricing] --> UP[updatePrice]
    SP[/admin/special-pricing] --> SSP[setSpecialPrice]
    SSP --> BUYER_PRICE[Buyer sees override via pricing.ts]
  end
```

## Caveats

- Users / analytics / static catalog lists: see [99-gaps](./99-gaps-and-stubs.md).  
- Permission matrix is informational on settings — route access is workspace-based.

## Cross-links

- [02-catalog](./02-catalog-pricing-wishlist.md) · [06-purchase](./06-purchase-grn.md) · [08-finance](./08-finance-collections.md)
