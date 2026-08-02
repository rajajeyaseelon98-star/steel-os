# 02 — Catalog, Pricing & Wishlist

**Status:** Implemented (buyer browse + order/quote CTAs)  
**Actors:** `dealer`, `contractor`, `retail` (buyer workspace); admin may browse via Guard  
**Journey:** Supports **A** (reorder starts here)

## Entry routes

| Route | Component |
|---|---|
| `/buyer` | `BuyerHome` |
| `/buyer/catalog` | `CatalogPage` |
| `/buyer/products/:id` | `ProductDetailPage` |
| `/buyer/wishlist` | `WishlistPage` |
| `/admin/products` | `AdminProductsPage` *(list-only — see gaps)* |
| `/search` | `GlobalSearchPage` |

## Store / libs

| Piece | Role |
|---|---|
| `usePriceForProduct` / `pricing.ts` | Role + special-price precedence (Part N) |
| `availableQty` | On-hand minus reserved by warehouse |
| `toggleWishlist` | Wishlist add/remove |
| `createOrder` | Place order from product detail |
| `createQuotation` | Request quotation from product detail (buyer path) |

## Step-by-step (Buyer)

1. Land `/buyer` — KPI strip + offers.  
2. Open `/buyer/catalog` — filter category / search.  
3. Open `/buyer/products/:id` — see role price, warehouses, qty.  
4. Choose action:  
   - **Place order** → `createOrder` → `/buyer/orders/:id` ([04](./04-orders-fulfillment.md))  
   - **Request quotation** → quotation draft/sent path ([03](./03-quotations.md))  
   - **Wishlist** → `toggleWishlist` → `/buyer/wishlist`  
5. Optional: `/search` for products / orders / customers.

## Flowchart

```mermaid
flowchart TD
  subgraph Buyer
    H[/buyer] --> C[/buyer/catalog]
    C --> P[/buyer/products/:id]
    P -->|createOrder| O[/buyer/orders/:id]
    P -->|createQuotation| Q[/buyer/quotations]
    P -->|toggleWishlist| W[/buyer/wishlist]
    H --> S[/search]
  end
  subgraph Pricing["pricing.ts"]
    P --> PRICE[role / special / matrix price]
    P --> QTY[availableQty]
  end
```

## Caveats

- Product “images” are emoji placeholders.  
- Admin products page does not create/edit SKUs.  
- Special customer prices are managed under admin ([11](./11-crm-hr-admin-ops.md)).

## Cross-links

- [03-quotations](./03-quotations.md) · [04-orders-fulfillment](./04-orders-fulfillment.md) · [12-shared-shell](./12-shared-shell.md)
