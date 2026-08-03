# Steel Cart — Flow Index (2-role prototype)

> **Active roles only:** `super_admin` (`u-admin`) · `retail` (`u-retail`)  
> Demo password: `demo1234` · Persist: `steel-cart-v2`, `steel-cart-extras-v2`

## Roles

| Role | Home | Nav |
|---|---|---|
| Retail | `/buyer` | Home, Catalog, Search, Quotations, Orders, Wishlist, Profile, Support |
| Super Admin | `/admin` | Dashboard, Catalog (CRUD), Quote templates, Quotations, Orders (Accept → Dispatch → Deliver), Wishlists, Search, Profile, Support |

## Shared routes (role shell)

`/search` · `/profile` · `/notifications` · `/support`

## Core loops

| Flow | Doc | Steps |
|---|---|---|
| Auth | [01](./01-auth-onboarding.md) | Login → role picker → home |
| Catalog / wishlist | [02](./02-catalog-pricing-wishlist.md) | Browse → order / quote / wishlist |
| Quotations | [03](./03-quotations.md) | Request or template → send → accept → order |
| Orders | [04](./04-orders-fulfillment.md) | Create → Accept → Dispatch → Mark delivered (+ invoice) |
| Admin extras | [05](./05-admin-wishlists-templates.md) | Product CRUD, templates, wishlists, support FAQ |
| Out of scope | [99](./99-gaps-and-stubs.md) | Removed workspaces & dead routes |

## Removed from this prototype

Warehouse · fabricator · driver · manufacturer · CRM UI · finance UI · purchase/GRN · estimator · HR · `/settings` · `/buyer/addresses`
