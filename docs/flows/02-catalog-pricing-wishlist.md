# 02 — Catalog, Pricing & Wishlist

**Status:** Implemented  
**Actors:** Retail (browse/order); Super Admin (CRUD + browse)

## Entry routes

| Route | Component |
|---|---|
| `/buyer` | `BuyerHome` |
| `/buyer/catalog` | `CatalogPage` |
| `/buyer/products/:id` | `ProductDetailPage` |
| `/buyer/wishlist` | `WishlistPage` |
| `/admin/products` | Admin product list + CRUD |
| `/search` | `GlobalSearchPage` |

## Store

| Piece | Role |
|---|---|
| `usePriceForProduct` / `pricing.ts` | Role pricing |
| `wishlists: Record<userId, productIds>` | Per-user lists |
| `toggleWishlist` | Retail toggles own list |
| `createOrder` / `createQuotation` | From product detail |
| Product CRUD actions | Admin only |

## Step-by-step

1. Retail: `/buyer/catalog` → product → place order, request quote, or wishlist.  
2. Admin: `/admin/products` — create / edit / deactivate products.  
3. Admin: `/admin/wishlists` — see all retail wishlists ([05](./05-admin-wishlists-templates.md)).

## Flowchart

```mermaid
flowchart TD
  C[/buyer/catalog] --> P[/buyer/products/:id]
  P -->|createOrder| O[Orders flow 04]
  P -->|createQuotation| Q[Quotes flow 03]
  P -->|toggleWishlist| W[/buyer/wishlist]
  W -.-> A[/admin/wishlists]
```
