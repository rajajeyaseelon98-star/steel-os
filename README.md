# Steel Cart

Clickable multi-role **Steel + Fabrication B2B Operating System** prototype for South Tamil Nadu distribution.

> Not a steel shop app — an operating system for dealers, contractors, warehouses, fabricators, drivers, and master traders.

## Stack

- React + TypeScript + Vite
- React Router
- Zustand (persisted mock state)
- Tailwind CSS v4
- Recharts

## Run locally

```bash
cd steel-os
npm install
npm run dev
```

## Demo

1. Open the app — role picker has **Super Admin** and **Retail Customer** only.
2. Retail: catalog → quote / order / wishlist.
3. Super Admin: accept/dispatch/deliver orders · catalog CRUD · quote templates · all retail wishlists.
4. Header **role switcher** toggles the two demo users.

### Suggested path

1. Retail → catalog → place order / request quote / wishlist  
2. Super Admin → Orders → Accept → Dispatch → Mark delivered  
3. Super Admin → Quote templates → Send to retail  
4. Super Admin → Wishlists (see retail items)  
5. Either role → Support FAQ chatbot  

## Docs

- [`docs/flows/00-INDEX.md`](./docs/flows/00-INDEX.md) — **2-role flow index**
- `STEEL-OS-END-TO-END-PLAN.md` — original A→Z product plan (broader than current UI)
- `STEEL-OS-KT-DETAIL.md` — KT / status

## Phases covered (current UI)

| Area | Status |
|---|---|
| Retail browse / quote / order / wishlist | Implemented |
| Super Admin catalog CRUD | Implemented |
| Super Admin order ops (accept/reject/dispatch/deliver) | Implemented |
| Quote templates | Implemented |
| Admin user-wise wishlists | Implemented |
| Support FAQ chatbot | Implemented (mock) |

## Plan document

See `../STEEL-OS-END-TO-END-PLAN.md` in the monorepo root (or repo docs).
