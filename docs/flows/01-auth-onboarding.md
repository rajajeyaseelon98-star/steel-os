# 01 — Auth & Onboarding

**Status:** Implemented (demo)  
**Actors:** `super_admin`, `retail` only

## Entry routes

| Route | Component |
|---|---|
| `/welcome` | `WelcomePage` |
| `/login` | `LoginPage` |
| `/register` | `RegisterPage` |
| `/otp` | `OtpPage` |
| `/forgot` / `/reset` | Forgot / Reset (nav only) |
| `/role` | `RoleSelectPage` |
| `/verify/*` | GST → business → KYC → pending |
| `/` | `RoleHomeRedirect` → `/admin` or `/buyer` |

## Store actions

| Action | Effect |
|---|---|
| `loginAs(userId)` | Sets session; home via `homePathForRole` |
| `logout()` | Clears session |
| `verifyOtp(code)` | Demo code **`123456`** |
| `setVerification(status)` | Onboarding chain |

## Step-by-step (primary)

1. `/login` → enter credentials (demo `demo1234`).  
2. Role picker → **Super Admin** (`u-admin`) or **Retail** (`u-retail`).  
3. Land on `/admin` or `/buyer`.  
4. TopBar role switcher can `loginAs` the other seed user.

## Flowchart

```mermaid
flowchart TD
  L[/login] -->|loginAs| P[Role picker]
  P --> A[/admin]
  P --> B[/buyer]
```

## Caveats

- No real OTP/SMS. Forgot/reset do not mutate passwords.  
- Register UI may still mention legacy buyer types; live seeds are admin + retail only.
