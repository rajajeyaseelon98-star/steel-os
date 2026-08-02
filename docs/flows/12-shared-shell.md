# 12 — Shared Shell Pages

**Status:** Implemented (inside `RoleWorkspaceShell` — sticky nav preserved)  
**Actors:** Any authenticated role (chrome = current workspace nav)

## Entry routes

| Route | Component | Behavior |
|---|---|---|
| `/search` | `GlobalSearchPage` | Client filter products / orders / users |
| `/notifications` | `NotificationsPage` | List + `markNotificationRead` |
| `/profile` | `ProfilePage` | User card + credit-hold banner |
| `/settings` | `UserSettingsPage` | Notification prefs `updatePrefs` |
| `/support` | `SupportPage` | **Static** contact copy |

Also: buyer has `/buyer/profile` nested route (same `ProfilePage`).

## Store actions

| Action | Where |
|---|---|
| `markNotificationRead` | Notifications |
| `updatePrefs` (extras) | User settings channels |
| TopBar Alerts button | Navigates to `/notifications` |

## Step-by-step

1. From any workspace, open Search / Alerts / Profile / Settings / Support via nav or TopBar.  
2. Shell stays mounted (`RoleWorkspaceShell` + `SHELL_BY_WORKSPACE` for current role).  
3. Only `<main>` content swaps.

## Flowchart

```mermaid
flowchart TD
  subgraph Shell["RoleWorkspaceShell"]
    SB[Sidebar nav for current role]
    TB[TopBar Alerts / role / logout]
    SB --> MAIN[main Outlet]
    TB --> N[/notifications]
  end
  MAIN --> SE[/search]
  MAIN --> PR[/profile]
  MAIN --> ST[/settings]
  MAIN --> SU[/support]
  N --> READ[markNotificationRead]
  ST --> PREF[updatePrefs]
```

## Caveats

- `/settings` (user prefs) ≠ `/admin/settings` (company).  
- Support has no ticket store.  
- Search links jump to buyer product / admin order / CRM when matched.

## Cross-links

- [01-auth](./01-auth-onboarding.md) · [00-INDEX](./00-INDEX.md)
