import type { ReactNode } from 'react'
import { cn, statusLabel } from '@/lib/format'

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle?: string
  actions?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-steel-900">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-steel-500">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  )
}

export function Card({
  children,
  className,
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: React.MouseEventHandler<HTMLDivElement>
}) {
  return (
    <div className={cn('rounded-xl border border-steel-200 bg-white p-4 shadow-sm', className)} onClick={onClick}>
      {children}
    </div>
  )
}

export function Stat({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <Card>
      <div className="text-xs font-medium uppercase tracking-wide text-steel-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-steel-900">{value}</div>
      {hint ? <div className="mt-1 text-xs text-steel-400">{hint}</div> : null}
    </Card>
  )
}

export function Button({
  children,
  variant = 'primary',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
}) {
  const styles = {
    primary: 'bg-brand text-white hover:bg-brand-dark',
    secondary: 'bg-steel-900 text-white hover:bg-steel-800',
    ghost: 'bg-steel-100 text-steel-800 hover:bg-steel-200',
    danger: 'bg-danger text-white hover:opacity-90',
  }
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg px-3.5 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50',
        styles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'w-full rounded-lg border border-steel-200 bg-white px-3 py-2 text-sm text-steel-900 outline-none ring-brand/30 placeholder:text-steel-400 focus:ring-2',
        props.className,
      )}
    />
  )
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        'w-full rounded-lg border border-steel-200 bg-white px-3 py-2 text-sm text-steel-900 outline-none ring-brand/30 focus:ring-2',
        props.className,
      )}
    />
  )
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        'w-full rounded-lg border border-steel-200 bg-white px-3 py-2 text-sm text-steel-900 outline-none ring-brand/30 placeholder:text-steel-400 focus:ring-2',
        props.className,
      )}
    />
  )
}

export function Label({ children }: { children: ReactNode }) {
  return <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-steel-500">{children}</label>
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'brand'
}) {
  const tones = {
    neutral: 'bg-steel-100 text-steel-700',
    success: 'bg-emerald-50 text-success',
    warning: 'bg-amber-50 text-warning',
    danger: 'bg-red-50 text-danger',
    brand: 'bg-orange-50 text-brand',
  }
  return (
    <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium', tones[tone])}>
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status.includes('fail') || status.includes('cancel') || status.includes('reject') || status.includes('overdue')
      ? 'danger'
      : status.includes('deliver') || status.includes('paid') || status.includes('accept') || status.includes('complet') || status === 'verified' || status === 'approved' || status === 'pass'
        ? 'success'
        : status.includes('pending') || status.includes('draft') || status.includes('loading') || status.includes('quot')
          ? 'warning'
          : 'neutral'
  return <Badge tone={tone}>{statusLabel(status)}</Badge>
}

export function Empty({ title, body }: { title: string; body?: string }) {
  return (
    <Card className="border-dashed text-center">
      <div className="text-sm font-medium text-steel-700">{title}</div>
      {body ? <p className="mt-1 text-sm text-steel-500">{body}</p> : null}
    </Card>
  )
}

export function Timeline({ steps, current }: { steps: string[]; current: string }) {
  const idx = Math.max(0, steps.indexOf(current))
  return (
    <ol className="space-y-3">
      {steps.map((step, i) => (
        <li key={step} className="flex items-center gap-3">
          <span
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold',
              i <= idx ? 'bg-brand text-white' : 'bg-steel-100 text-steel-400',
            )}
          >
            {i + 1}
          </span>
          <span className={cn('text-sm', i <= idx ? 'font-medium text-steel-900' : 'text-steel-400')}>
            {statusLabel(step)}
          </span>
        </li>
      ))}
    </ol>
  )
}

export function Table({ headers, rows }: { headers: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-steel-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-steel-50 text-xs uppercase tracking-wide text-steel-500">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-steel-100">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 align-top text-steel-800">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  )
}
