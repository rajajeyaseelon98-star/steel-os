# Steel OS

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

1. Open the app and use **Quick enter as role** on Login.
2. Walk Journeys A–G from `STEEL-OS-END-TO-END-PLAN.md`.
3. Use the header **role switcher** during stakeholder demos.

### Suggested 8-minute path

1. Dealer → catalog → order square pipes  
2. Contractor → accept quotation QT-2026-001  
3. Admin → approve / dispatch  
4. Warehouse → receiving / stock / dispatch  
5. Fabricator → quote gate lead  
6. Driver → POD capture  
7. Admin → finance / pricing  
8. Admin → G+1 estimator  

## Phases covered

| Phase | Status |
|---|---|
| 1 Customer & Sales | Implemented |
| 2 Business Operations | Implemented |
| 3 Fabrication & Logistics | Implemented |
| 4 Finance | Implemented |
| 5 Intelligence | Implemented (mock AI + estimator) |

## Plan document

See `../STEEL-OS-END-TO-END-PLAN.md` in the monorepo root (or repo docs).
