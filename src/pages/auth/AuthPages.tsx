import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Card, Field, Input, Select } from '@/components/ui'
import { useAppStore } from '@/store/appStore'
import { roleLabels } from '@/lib/permissions'
import type { Role } from '@/types'
import { users } from '@/mock/data'

export function WelcomePage() {
  return (
    <Card className="w-full bg-white/95">
      <h2 className="text-xl font-semibold text-steel-900">Enter the operating system</h2>
      <p className="mt-2 text-sm text-steel-500">
        Clickable multi-role prototype covering catalog, quotations, inventory, fabrication, delivery, and finance.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/login"><Button>Login</Button></Link>
        <Link to="/register"><Button variant="secondary">Register business</Button></Link>
      </div>
    </Card>
  )
}

export function LoginPage() {
  const loginAs = useAppStore((s) => s.loginAs)
  const navigate = useNavigate()
  const [email, setEmail] = useState('murugan@hardware.in')
  const [password, setPassword] = useState('demo1234')
  const [error, setError] = useState('')
  const [showRoleModal, setShowRoleModal] = useState(false)

  const openRolePicker = () => {
    // Prototype: accept demo password; match email or fall back to dealer seed
    if (password && password !== 'demo1234') {
      setError('Invalid password. Use demo1234 for prototype.')
      return
    }
    setError('')
    setShowRoleModal(true)
  }

  const enterAs = (userId: string) => {
    setShowRoleModal(false)
    navigate(loginAs(userId))
  }

  return (
    <>
      <Card className="w-full bg-white/95">
        <h2 className="text-xl font-semibold">Login</h2>
        <p className="mt-1 text-sm text-steel-500">Sign in with demo credentials, then choose a workspace role.</p>
        <div className="mt-4 space-y-3">
          <Field label="Email">
            <Input value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
          </Field>
          <Field label="Password">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </Field>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button className="w-full" onClick={openRolePicker}>
            Sign in
          </Button>
          <div className="flex justify-between text-sm">
            <Link className="text-brand" to="/forgot">Forgot password</Link>
            <Link className="text-brand" to="/register">Register</Link>
          </div>
        </div>
      </Card>

      {showRoleModal ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-steel-950/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="role-picker-title"
          onClick={() => setShowRoleModal(false)}
        >
          <Card
            className="w-full max-w-lg bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 id="role-picker-title" className="text-lg font-semibold text-steel-900">
                  Choose workspace role
                </h3>
                <p className="mt-1 text-sm text-steel-500">
                  Signed in{email ? ` as ${email}` : ''}. Pick a demo role to enter Steel Cart.
                </p>
              </div>
              <Button variant="ghost" onClick={() => setShowRoleModal(false)}>
                Cancel
              </Button>
            </div>
            <div className="mt-4 grid max-h-[50vh] grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
              {users.map((u) => (
                <Button
                  key={u.id}
                  variant="ghost"
                  className="h-auto flex-col items-start gap-0.5 py-3 text-left"
                  onClick={() => enterAs(u.id)}
                >
                  <span className="font-semibold text-steel-900">{roleLabels[u.role]}</span>
                  <span className="text-xs font-normal text-steel-500">{u.companyName}</span>
                </Button>
              ))}
            </div>
            <p className="mt-4 text-xs text-steel-400">
              Matched account tip: {users.find((x) => x.email === email)?.companyName ?? 'Dealer (default if email unknown)'}.
              You can still pick any role for the prototype demo.
            </p>
          </Card>
        </div>
      ) : null}
    </>
  )
}

export function RegisterPage() {
  const registerDraft = useAppStore((s) => s.registerDraft)
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    gstin: '',
    city: 'Tenkasi',
    role: 'dealer' as Role,
  })

  return (
    <Card className="max-w-xl bg-white/95">
      <h2 className="text-xl font-semibold">Register business</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Full name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
        <Field label="Phone"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
        <Field label="Email"><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
        <Field label="City"><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></Field>
        <Field label="Company"><Input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} /></Field>
        <Field label="GSTIN"><Input value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value })} /></Field>
        <Field label="Role">
          <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })}>
            {(['dealer', 'contractor', 'retail', 'fabricator', 'manufacturer'] as Role[]).map((r) => (
              <option key={r} value={r}>{roleLabels[r]}</option>
            ))}
          </Select>
        </Field>
      </div>
      <Button
        className="mt-4 w-full"
        onClick={() => {
          registerDraft(form)
          navigate('/otp')
        }}
      >
        Continue to OTP
      </Button>
      <p className="mt-3 text-sm text-steel-500">Already registered? <Link className="text-brand" to="/login">Login</Link></p>
    </Card>
  )
}

export function OtpPage() {
  const verifyOtp = useAppStore((s) => s.verifyOtp)
  const navigate = useNavigate()
  const [code, setCode] = useState('123456')
  const [error, setError] = useState('')

  return (
    <Card className="max-w-md bg-white/95">
      <h2 className="text-xl font-semibold">OTP verification</h2>
      <p className="mt-1 text-sm text-steel-500">Demo OTP is <strong>123456</strong></p>
      <Field label="Enter OTP">
        <Input value={code} onChange={(e) => setCode(e.target.value)} className="mt-3" />
      </Field>
      {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
      <Button
        className="mt-4 w-full"
        onClick={() => {
          if (verifyOtp(code)) navigate('/role')
          else setError('Invalid OTP')
        }}
      >
        Verify OTP
      </Button>
    </Card>
  )
}

export function ForgotPage() {
  const navigate = useNavigate()
  return (
    <Card className="max-w-md bg-white/95">
      <h2 className="text-xl font-semibold">Forgot password</h2>
      <p className="mt-1 text-sm text-steel-500">We will send a reset link / OTP (UI only).</p>
      <Field label="Registered phone / email"><Input className="mt-3" placeholder="98765..." /></Field>
      <Button className="mt-4 w-full" onClick={() => navigate('/reset')}>Send reset OTP</Button>
    </Card>
  )
}

export function ResetPage() {
  const navigate = useNavigate()
  return (
    <Card className="max-w-md bg-white/95">
      <h2 className="text-xl font-semibold">Reset password</h2>
      <div className="mt-4 space-y-3">
        <Field label="OTP"><Input defaultValue="123456" /></Field>
        <Field label="New password"><Input type="password" /></Field>
        <Field label="Confirm password"><Input type="password" /></Field>
      </div>
      <Button className="mt-4 w-full" onClick={() => navigate('/login')}>Update password</Button>
    </Card>
  )
}

export function RoleSelectPage() {
  const user = useAppStore((s) => s.currentUser())
  const navigate = useNavigate()
  return (
    <Card className="max-w-xl bg-white/95">
      <h2 className="text-xl font-semibold">Role selection</h2>
      <p className="mt-1 text-sm text-steel-500">
        Current role: <strong>{user ? roleLabels[user.role] : '—'}</strong>
      </p>
      <Button className="mt-6 w-full" onClick={() => navigate('/verify/gst')}>Continue verification</Button>
    </Card>
  )
}

export function GstVerifyPage() {
  const setVerification = useAppStore((s) => s.setVerification)
  const navigate = useNavigate()
  return (
    <Card className="max-w-xl bg-white/95">
      <h2 className="text-xl font-semibold">GST verification</h2>
      <Field label="GSTIN"><Input className="mt-3" defaultValue="33AADFM2201K1Z" /></Field>
      <div className="mt-4 flex gap-2">
        <Button onClick={() => { setVerification('business_pending'); navigate('/verify/business') }}>Verify GST</Button>
        <Button variant="ghost" onClick={() => navigate('/verify/pending')}>Skip for now</Button>
      </div>
    </Card>
  )
}

export function BusinessVerifyPage() {
  const setVerification = useAppStore((s) => s.setVerification)
  const navigate = useNavigate()
  return (
    <Card className="max-w-xl bg-white/95">
      <h2 className="text-xl font-semibold">Business verification</h2>
      <div className="mt-4 space-y-3">
        <Field label="Trade name"><Input defaultValue="Murugan Steels & Hardware" /></Field>
        <Field label="Business address"><Input defaultValue="12 Market Road, Tenkasi" /></Field>
      </div>
      <Button className="mt-4" onClick={() => { setVerification('kyc_pending'); navigate('/verify/kyc') }}>
        Submit business details
      </Button>
    </Card>
  )
}

export function KycPage() {
  const setVerification = useAppStore((s) => s.setVerification)
  const navigate = useNavigate()
  return (
    <Card className="max-w-xl bg-white/95">
      <h2 className="text-xl font-semibold">KYC upload</h2>
      <p className="mt-1 text-sm text-steel-500">Upload Aadhaar / PAN / trade license (UI mock).</p>
      <div className="mt-4 space-y-3">
        <Field label="PAN"><Input type="file" /></Field>
        <Field label="Aadhaar / owner ID"><Input type="file" /></Field>
        <Field label="Trade license"><Input type="file" /></Field>
      </div>
      <Button className="mt-4" onClick={() => { setVerification('verified'); navigate('/verify/pending') }}>
        Submit KYC
      </Button>
    </Card>
  )
}

export function VerifyPendingPage() {
  const user = useAppStore((s) => s.currentUser())
  const navigate = useNavigate()
  const setVerification = useAppStore((s) => s.setVerification)
  return (
    <Card className="max-w-xl bg-white/95">
      <h2 className="text-xl font-semibold">Verification status</h2>
      <p className="mt-2 text-sm text-steel-600">Current: <strong>{user?.verificationStatus}</strong></p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={() => setVerification('verified')}>Mark verified</Button>
        <Button variant="danger" onClick={() => setVerification('rejected')}>Mark rejected</Button>
        <Button variant="secondary" onClick={() => navigate('/')}>Enter workspace</Button>
      </div>
    </Card>
  )
}
