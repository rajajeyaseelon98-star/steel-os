# 05 — Admin wishlists, templates & support

**Status:** Implemented  
**Actors:** Super Admin (ops) · Retail (wishlist + support)

## Routes

| Route | Purpose |
|---|---|
| `/admin/wishlists` | All retail users’ wishlists |
| `/admin/quote-templates` | Quotation template CRUD |
| `/admin/products` | Product CRUD |
| `/support` | FAQ chatbot (both roles) |

## Notes

- Wishlists keyed by `userId` in `wishlists` map (not a global array).  
- Global search customer hits link to `/admin/wishlists` (CRM 360 removed).  
- Support answers from FAQ seeds — no live ticketing backend.
