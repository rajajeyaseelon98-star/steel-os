# 01 — Auth & Onboarding

**Status:** Implemented (prototype / demo)  
**Actors:** All roles

## Entry routes

| Route | Component |
|---|---|
| `/welcome` | `WelcomePage` |
| `/login` | `LoginPage` |
| `/register` | `RegisterPage` |
| `/otp` | `OtpPage` |
| `/forgot` | `ForgotPage` |
| `/reset` | `ResetPage` |
| `/role` | `RoleSelectPage` |
| `/verify/gst` | `GstVerifyPage` |
| `/verify/business` | `BusinessVerifyPage` |
| `/verify/kyc` | `KycPage` |
| `/verify/pending` | `VerifyPendingPage` |
| `/` | `RoleHomeRedirect` → `homePathForRole` |

## Store actions

| Action | Effect |
|---|---|
| `loginAs(userId)` | Sets `currentUserId`, returns home path |
| `logout()` | Clears session |
| `registerDraft(...)` | Creates draft user for OTP path |
| `verifyOtp(code)` | Accepts demo code **`123456`** |
| `setVerification(status)` | `business_pending` → `kyc_pending` → `verified` / `rejected` |
| `setRoleDemo(role)` | Demo role helpers on some screens |

## Step-by-step

### Path A — Quick demo login (primary)

1. Open `/login`.  
2. Sign in → role picker modal (or seed quick-enter).  
3. Select demo user → `loginAs` → land on role home (`/admin`, `/buyer`, …).  
4. Use TopBar **role switcher** anytime to `loginAs` another seed user.

### Path B — Register → verify (UI chain)

1. `/welcome` → `/register` (dealer / contractor / retail / fabricator / manufacturer).  
2. `/otp` → enter `123456` → `verifyOtp`.  
3. `/role` → continue.  
4. `/verify/gst` → `/verify/business` → `/verify/kyc` → `/verify/pending`.  
5. Enter workspace → `/` → role home.

### Path C — Forgot / reset (shallow)

1. `/forgot` → `/reset` → back to `/login`.  
2. **No password store mutation** — navigation only.

## Flowchart

```mermaid
flowchart TD
  W[/welcome] --> L[/login]
  W --> R[/register]
  L -->|loginAs| H[Role home]
  R --> OTP[/otp]
  OTP -->|verifyOtp 123456| ROLE[/role]
  ROLE --> GST[/verify/gst]
  GST --> BIZ[/verify/business]
  BIZ --> KYC[/verify/kyc]
  KYC --> PEND[/verify/pending]
  PEND --> ROOT[/]
  ROOT --> H
  L --> FORGOT[/forgot]
  FORGOT --> RESET[/reset]
  RESET --> L
```

## Caveats

- Prototype auth — no real OTP/SMS/email.  
- KYC file inputs are UI-only.  
- Forgot/reset do not change credentials.

## Cross-links

- After login: [12-shared-shell](./12-shared-shell.md) · role feature docs in [00-INDEX](./00-INDEX.md)
