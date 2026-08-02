# 13 — Manufacturer Portal

**Status:** Display-only shell (**not** a full mutation journey)  
**Actors:** `manufacturer` (Admin Guard may enter for demo)

## Entry routes

| Route | Component |
|---|---|
| `/manufacturer` | `ManufacturerPortalPage` |
| `/profile`, `/settings`, `/support` | Shared ([12](./12-shared-shell.md)) |

## Behavior

1. Login as manufacturer → `/manufacturer`.  
2. View own SKUs (from catalog filtered by manufacturer).  
3. View inbound POs related to manufacturer (read-only tables).  
4. **No** confirm / ship / invoice mutations in store for this portal.

## Flowchart

```mermaid
flowchart TD
  L[loginAs manufacturer] --> H[/manufacturer]
  H --> SKU[Read-only SKU list]
  H --> PO[Read-only inbound POs]
  H --> PROF[/profile]
  H --> SET[/settings]
  H --> SUP[/support]
```

## Caveats

- Purchase flow mutations are **admin/warehouse** only ([06](./06-purchase-grn.md)).  
- Do not document manufacturer “accept PO” as implemented — it is not.

## Cross-links

- [06-purchase-grn](./06-purchase-grn.md) · [99-gaps-and-stubs](./99-gaps-and-stubs.md)
