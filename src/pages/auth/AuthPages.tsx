import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Card, Field, Input, Select } from '@/components/ui'
import { useAppStore } from '@/store/appStore'
import { roleLabels } from '@/lib/permissions'
import type { Role } from '@/types'
import { users } from '@/mock/data'

export function WelcomePage() {
  return (
    <Card className="max-w-xl bg-white/95">
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

  return (
    <Card className="max-w-xl bg-white/95">
      <h2 className="text-xl font-semibold">Login</h2>
      <p className="mt-1 text-sm text-steel-500">Use demo users below or enter as role instantly.</p>
      <div className="mt-4 space-y-3">
        <Field label="Email">
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Password">
          <Input type="password" defaultValue="demo1234" />
        </Field>
        <Button
          className="w-full"
          onClick={() => {
            const u = users.find((x) => x.email === email) ?? users.find((x) => x.role === 'dealer')!
            navigate(loginAs(u.id))
          }}
        >
          Sign in
        </Button>
        <div className="flex justify-between text-sm">
          <Link className="text-brand" to="/forgot">Forgot password</Link>
          <Link className="text-brand" to="/register">Register</Link>
        </div>
      </div>
      <div className="mt-6 border-t border-steel-100 pt-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-steel-500">Quick enter as role</div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {users.map((u) => (
            <Button key={u.id} variant="ghost" className="justify-start text-left" onClick={() => navigate(loginAs(u.id))}>
              {roleLabels[u.role]}
            </Button>
          ))}
        </div>
      </div>
    </Card>
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
