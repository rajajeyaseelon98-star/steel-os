import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
  Button,
  Card,
  Empty,
  Field,
  Input,
  PageHeader,
  Select,
  Stat,
  StatusBadge,
  Table,
  TextArea,
} from '@/components/ui'
import { brands, categories, manufacturers, warehouses } from '@/mock/data'
import { useAppStore } from '@/store/appStore'
import { useExtrasStore } from '@/store/extrasStore'
import { can, capabilityLabels, roleLabels } from '@/lib/permissions'
import type { Capability } from '@/lib/permissions'
import { formatDate, inr } from '@/lib/format'
import { availableCredit, isCreditHold, orderTotals } from '@/lib/pricing'

export function AddressBookPage() {
  const user = useAppStore((s) => s.currentUser())!
  const addresses = useExtrasStore((s) => s.addresses.filter((a) => a.userId === user.id))
  const addAddress = useExtrasStore((s) => s.addAddress)
  const removeAddress = useExtrasStore((s) => s.removeAddress)
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { label: 'Site', line1: '', city: user.city, district: '', pincode: '', isDefault: false },
  })

  return (
    <div>
      <PageHeader title="Address book" subtitle="Delivery and site addresses" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="font-semibold">Add address</h3>
          <form
            className="mt-3 space-y-3"
            onSubmit={handleSubmit((data) => {
              addAddress({
                userId: user.id,
                label: data.label,
                line1: data.line1,
                city: data.city,
                district: data.district,
                pincode: data.pincode,
                isDefault: !!data.isDefault,
              })
              reset()
            })}
          >
            <Field label="Label"><Input {...register('label', { required: true })} /></Field>
            <Field label="Line"><Input {...register('line1', { required: true })} /></Field>
            <Field label="City"><Input {...register('city', { required: true })} /></Field>
            <Field label="District"><Input {...register('district')} /></Field>
            <Field label="Pincode"><Input {...register('pincode')} /></Field>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register('isDefault')} /> Default</label>
            <Button type="submit">Save address</Button>
          </form>
        </Card>
        <Card>
          {!addresses.length ? <Empty title="No addresses" /> : (
            <div className="space-y-3">
              {addresses.map((a) => (
                <div key={a.id} className="rounded-lg border border-steel-100 p-3 text-sm">
                  <div className="flex justify-between gap-2">
                    <strong>{a.label}{a.isDefault ? ' · Default' : ''}</strong>
                    <Button variant="ghost" onClick={() => removeAddress(a.id)}>Remove</Button>
                  </div>
                  <div className="text-steel-600">{a.line1}, {a.city}, {a.district} {a.pincode}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export function GlobalSearchPage() {
  const [q, setQ] = useState('')
  const products = useAppStore((s) => s.products)
  const orders = useAppStore((s) => s.orders)
  const users = useAppStore((s) => s.users)
  const query = q.trim().toLowerCase()
  const productHits = query ? products.filter((p) => p.name.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query)).slice(0, 8) : []
  const orderHits = query ? orders.filter((o) => o.number.toLowerCase().includes(query)).slice(0, 5) : []
  const userHits = query ? users.filter((u) => u.companyName.toLowerCase().includes(query) || u.name.toLowerCase().includes(query)).slice(0, 5) : []

  return (
    <div>
      <PageHeader title="Global search" subtitle="Products · orders · customers" />
      <Card>
        <Input placeholder="Search SKU, order number, company…" value={q} onChange={(e) => setQ(e.target.value)} autoFocus />
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <div>
            <h3 className="mb-2 text-sm font-semibold">Products</h3>
            {productHits.map((p) => <Link key={p.id} className="block rounded-lg px-2 py-1 text-sm text-brand hover:bg-steel-50" to={`/buyer/products/${p.id}`}>{p.name}</Link>)}
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold">Orders</h3>
            {orderHits.map((o) => <Link key={o.id} className="block rounded-lg px-2 py-1 text-sm text-brand hover:bg-steel-50" to={`/admin/orders/${o.id}`}>{o.number}</Link>)}
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold">Customers</h3>
            {userHits.map((u) => <Link key={u.id} className="block rounded-lg px-2 py-1 text-sm text-brand hover:bg-steel-50" to={`/admin/crm/${u.id}`}>{u.companyName}</Link>)}
          </div>
        </div>
      </Card>
    </div>
  )
}

export function UserSettingsPage() {
  const user = useAppStore((s) => s.currentUser())!
  const prefs = useExtrasStore((s) => {
    const found = s.notificationPrefs.find((p) => p.userId === user.id)
    return found ?? s.getPrefs(user.id)
  })
  const updatePrefs = useExtrasStore((s) => s.updatePrefs)
  const company = useAppStore((s) => s.company)

  return (
    <div>
      <PageHeader title="User settings" subtitle="Notification preferences · account" />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="font-semibold">Notification preferences</h3>
          <div className="mt-3 space-y-2 text-sm">
            {(['in_app', 'push', 'sms', 'whatsapp', 'email'] as const).map((ch) => (
              <label key={ch} className="flex items-center justify-between rounded-lg bg-steel-50 px-3 py-2">
                <span className="uppercase">{ch.replace('_', ' ')}</span>
                <input type="checkbox" checked={prefs[ch]} onChange={(e) => updatePrefs(user.id, { [ch]: e.target.checked })} />
              </label>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold">Account</h3>
          <div className="mt-3 space-y-2 text-sm">
            <div>{user.name} · {roleLabels[user.role]}</div>
            <div>Language default: {company.language === 'ta' ? 'Tamil' : 'English'}</div>
            <Link className="text-brand" to="/profile">Open profile</Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

export function InvoiceDetailPage() {
  const { id } = useParams()
  const inv = useAppStore((s) => s.invoices.find((i) => i.id === id))
  const order = useAppStore((s) => s.orders.find((o) => o.id === inv?.orderId))
  const payments = useAppStore((s) => s.payments.filter((p) => p.invoiceId === id))
  if (!inv) return <Empty title="Invoice not found" />
  const total = inv.amount + inv.gstAmount
  return (
    <div>
      <PageHeader title={inv.number} subtitle={`Order ${order?.number ?? inv.orderId}`} actions={<Link to={`/buyer/orders/${inv.orderId}`}><Button variant="ghost">Open order</Button></Link>} />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <Table
            headers={['Field', 'Value']}
            rows={[
              ['Customer', inv.customerId],
              ['Taxable', inr(inv.amount)],
              ['GST', inr(inv.gstAmount)],
              ['Total', inr(total)],
              ['Paid', inr(inv.paidAmount)],
              ['Balance', inr(total - inv.paidAmount)],
              ['Due', inv.dueDate],
              ['Status', <StatusBadge status={inv.status} />],
            ]}
          />
        </Card>
        <Card>
          <h3 className="mb-2 font-semibold">Payments</h3>
          {payments.map((p) => (
            <div key={p.id} className="mb-2 rounded-lg bg-steel-50 px-3 py-2 text-sm">{formatDate(p.at)} · {p.method.toUpperCase()} · {inr(p.amount)}</div>
          ))}
          {!payments.length ? <div className="text-sm text-steel-500">No payments yet</div> : null}
        </Card>
      </div>
    </div>
  )
}

export function AdminOrderDetailPage() {
  const { id } = useParams()
  const order = useAppStore((s) => s.orders.find((o) => o.id === id))
  const user = useAppStore((s) => s.currentUser())!
  const approveOrder = useAppStore((s) => s.approveOrder)
  const cancelOrder = useAppStore((s) => s.cancelOrder)
  const requestReturn = useAppStore((s) => s.requestReturn)
  const refundOrder = useAppStore((s) => s.refundOrder)
  const partialDispatchOrder = useAppStore((s) => s.partialDispatchOrder)
  const dispatchOrder = useAppStore((s) => s.dispatchOrder)
  if (!order) return <Empty title="Order not found" />
  return (
    <div>
      <PageHeader
        title={order.number}
        subtitle="Admin order detail"
        actions={<Link to={`/buyer/orders/${order.id}`}><Button variant="ghost">Buyer view</Button></Link>}
      />
      <Card className="mb-4">
        <StatusBadge status={order.status} />
        <div className="mt-2 text-sm">Total {inr(orderTotals(order.items).total)} · Customer {order.customerId}</div>
        <div className="mt-4 flex flex-wrap gap-2">
          {can(user.role, 'dispatch') && order.status === 'pending_approval' ? <Button onClick={() => approveOrder(order.id)}>Approve</Button> : null}
          {can(user.role, 'dispatch') && order.status === 'approved' ? (
            <>
              <Button onClick={() => dispatchOrder(order.id, 'v-1', 'drv-1')}>Full dispatch</Button>
              <Button variant="secondary" onClick={() => partialDispatchOrder(order.id, 'v-1', 'drv-1')}>Partial dispatch</Button>
            </>
          ) : null}
          {['delivered', 'completed'].includes(order.status) ? <Button variant="ghost" onClick={() => requestReturn(order.id)}>Request return</Button> : null}
          {order.status === 'return_requested' ? <Button variant="danger" onClick={() => refundOrder(order.id)}>Refund</Button> : null}
          {!['cancelled', 'refunded', 'completed'].includes(order.status) ? <Button variant="danger" onClick={() => cancelOrder(order.id)}>Cancel</Button> : null}
        </div>
      </Card>
    </div>
  )
}

export function AdminCatalogMetaPage() {
  const products = useAppStore((s) => s.products)
  const warehousesAdmin = useExtrasStore((s) => s.warehousesAdmin)
  const addWarehouse = useExtrasStore((s) => s.addWarehouse)
  const addAudit = useExtrasStore((s) => s.addAudit)
  const user = useAppStore((s) => s.currentUser())!
  const [whName, setWhName] = useState('')
  const [whCity, setWhCity] = useState('Tenkasi')

  return (
    <div>
      <PageHeader title="Catalog admin" subtitle="Categories · brands · warehouses" />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <h3 className="mb-2 font-semibold">Categories ({categories.length})</h3>
          <ul className="space-y-1 text-sm">{categories.map((c) => <li key={c.slug}>{c.name} · {products.filter((p) => p.category === c.slug).length} SKUs</li>)}</ul>
        </Card>
        <Card>
          <h3 className="mb-2 font-semibold">Brands</h3>
          <ul className="space-y-1 text-sm">{brands.map((b) => <li key={b.id}>{b.name} · {manufacturers.find((m) => m.id === b.manufacturerId)?.name}</li>)}</ul>
        </Card>
        <Card>
          <h3 className="mb-2 font-semibold">Warehouses</h3>
          <ul className="mb-3 space-y-1 text-sm">{warehousesAdmin.map((w) => <li key={w.id}>{w.name} · {w.city}</li>)}</ul>
          {can(user.role, 'manage_inventory') ? (
            <div className="space-y-2">
              <Input placeholder="New warehouse name" value={whName} onChange={(e) => setWhName(e.target.value)} />
              <Input value={whCity} onChange={(e) => setWhCity(e.target.value)} />
              <Button onClick={() => {
                if (!whName) return
                addWarehouse({ name: whName, city: whCity, district: whCity, address: 'New yard' })
                addAudit({ actorId: user.id, action: 'WAREHOUSE_CREATE', entity: 'warehouse', ref: whName, detail: whCity })
                setWhName('')
              }}>Add warehouse</Button>
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  )
}

export function AuditLogPage() {
  const logs = useExtrasStore((s) => s.auditLogs)
  const user = useAppStore((s) => s.currentUser())!
  if (!can(user.role, 'view_audit')) return <Empty title="No audit access" body="Requires Super Admin / Master Trader" />
  return (
    <div>
      <PageHeader title="Audit log" />
      <Table headers={['When', 'Actor', 'Action', 'Entity', 'Ref', 'Detail']} rows={logs.map((l) => [formatDate(l.at), l.actorId, l.action, l.entity, l.ref, l.detail])} />
    </div>
  )
}

export function SpecialPricingPage() {
  const users = useAppStore((s) => s.users.filter((u) => ['dealer', 'contractor', 'retail'].includes(u.role)))
  const products = useAppStore((s) => s.products)
  const specialPrices = useExtrasStore((s) => s.specialPrices)
  const setSpecialPrice = useExtrasStore((s) => s.setSpecialPrice)
  const removeSpecialPrice = useExtrasStore((s) => s.removeSpecialPrice)
  const [customerId, setCustomerId] = useState(users[0]?.id ?? '')
  const [productId, setProductId] = useState(products[0]?.id ?? '')
  const [price, setPrice] = useState(750)

  return (
    <div>
      <PageHeader title="Special customer prices" subtitle="Part N #1 — overrides role price" />
      <Card className="mb-4">
        <div className="grid gap-3 md:grid-cols-4">
          <Field label="Customer">
            <Select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
              {users.map((u) => <option key={u.id} value={u.id}>{u.companyName}</option>)}
            </Select>
          </Field>
          <Field label="Product">
            <Select value={productId} onChange={(e) => setProductId(e.target.value)}>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select>
          </Field>
          <Field label="Special price"><Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} /></Field>
          <div className="flex items-end"><Button onClick={() => setSpecialPrice(customerId, productId, price, 'Manual special')}>Assign</Button></div>
        </div>
      </Card>
      <Table
        headers={['Customer', 'Product', 'Price', 'Note', '']}
        rows={specialPrices.map((sp) => [
          users.find((u) => u.id === sp.customerId)?.companyName ?? sp.customerId,
          products.find((p) => p.id === sp.productId)?.name ?? sp.productId,
          inr(sp.price),
          sp.note ?? '—',
          <Button variant="ghost" onClick={() => removeSpecialPrice(sp.id)}>Remove</Button>,
        ])}
      />
    </div>
  )
}

export function ManufacturerPortalPage() {
  const products = useAppStore((s) => s.products.filter((p) => p.manufacturerId === 'mfr-jsw'))
  const pos = useAppStore((s) => s.purchaseOrders.filter((p) => p.supplierId === 'mfr-jsw'))
  return (
    <div>
      <PageHeader title="Manufacturer portal" subtitle="Shell only — own catalog & inbound POs" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-2 font-semibold">Your SKUs</h3>
          <Table headers={['SKU', 'Name']} rows={products.map((p) => [p.sku, p.name])} />
        </Card>
        <Card>
          <h3 className="mb-2 font-semibold">POs to you</h3>
          <Table headers={['PO', 'Status']} rows={pos.map((p) => [p.number, <StatusBadge status={p.status} />])} />
        </Card>
      </div>
    </div>
  )
}

export function Crm360Page() {
  const { id } = useParams()
  const customer = useAppStore((s) => s.users.find((u) => u.id === id))
  const activities = useAppStore((s) => s.crmActivities.filter((a) => a.customerId === id))
  const orders = useAppStore((s) => s.orders.filter((o) => o.customerId === id))
  const invoices = useAppStore((s) => s.invoices.filter((i) => i.customerId === id))
  const addCrmActivity = useAppStore((s) => s.addCrmActivity)
  const user = useAppStore((s) => s.currentUser())!
  const [summary, setSummary] = useState('')
  const [type, setType] = useState<'call' | 'visit' | 'reminder' | 'feedback' | 'note'>('reminder')
  if (!customer) return <Empty title="Customer not found" />
  const hold = isCreditHold(customer)
  return (
    <div>
      <PageHeader title={customer.companyName} subtitle={`CRM 360 · ${roleLabels[customer.role]} · ${customer.city}`} />
      {hold ? <Card className="mb-4 border-danger bg-red-50 text-danger">Credit hold — used {inr(customer.creditUsed)} / limit {inr(customer.creditLimit)}</Card> : null}
      <div className="grid gap-4 sm:grid-cols-4">
        <Stat label="Credit available" value={inr(availableCredit(customer))} />
        <Stat label="Orders" value={String(orders.length)} />
        <Stat label="Outstanding" value={inr(invoices.reduce((s, i) => s + i.amount + i.gstAmount - i.paidAmount, 0))} />
        <Stat label="Activities" value={String(activities.length)} />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="font-semibold">Log activity / reminder</h3>
          <div className="mt-3 space-y-3">
            <Select value={type} onChange={(e) => setType(e.target.value as typeof type)}>
              <option value="call">Call</option>
              <option value="visit">Visit</option>
              <option value="reminder">Reminder</option>
              <option value="feedback">Feedback</option>
              <option value="note">Note</option>
            </Select>
            <TextArea value={summary} onChange={(e) => setSummary(e.target.value)} />
            <Button onClick={() => { addCrmActivity({ customerId: customer.id, type, summary, createdBy: user.id, interestedProducts: ['p-sq-1'] }); setSummary('') }}>Save</Button>
          </div>
        </Card>
        <Card>
          <h3 className="mb-2 font-semibold">Timeline</h3>
          {activities.map((a) => (
            <div key={a.id} className="mb-2 rounded-lg bg-steel-50 px-3 py-2 text-sm">
              <div className="font-medium">{a.type} · {formatDate(a.at)}</div>
              <div>{a.summary}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

export function ReportDetailPage() {
  const { type } = useParams()
  const orders = useAppStore((s) => s.orders)
  const invoices = useAppStore((s) => s.invoices)
  const inventory = useAppStore((s) => s.inventory)
  const products = useAppStore((s) => s.products)
  const users = useAppStore((s) => s.users)
  const title = (type ?? 'daily-sales').replace(/-/g, ' ')

  const rows = useMemo(() => {
    switch (type) {
      case 'outstanding':
        return invoices.map((i) => [i.number, i.customerId, i.dueDate, inr(i.amount + i.gstAmount - i.paidAmount), i.status])
      case 'gst':
        return invoices.map((i) => [i.number, inr(i.amount), inr(i.gstAmount), i.createdAt.slice(0, 10)])
      case 'dead-stock':
        return inventory.filter((i) => i.onHand - i.reserved < 20).map((i) => [
          products.find((p) => p.id === i.productId)?.name,
          warehouses.find((w) => w.id === i.warehouseId)?.name,
          i.onHand - i.reserved,
        ])
      case 'top-customers':
        return users.filter((u) => u.creditUsed > 0).sort((a, b) => b.creditUsed - a.creditUsed).map((u) => [u.companyName, inr(u.creditUsed), u.city])
      case 'warehouse-wise':
        return warehouses.map((w) => [w.name, inventory.filter((i) => i.warehouseId === w.id).reduce((s, i) => s + i.onHand, 0)])
      case 'product-wise':
        return products.map((p) => [p.name, orders.reduce((s, o) => s + o.items.filter((i) => i.productId === p.id).reduce((x, i) => x + i.qty, 0), 0)])
      default:
        return orders.map((o) => [o.number, o.status, inr(orderTotals(o.items).total), formatDate(o.createdAt)])
    }
  }, [type, orders, invoices, inventory, products, users])

  const headers =
    type === 'outstanding' ? ['Invoice', 'Customer', 'Due', 'Balance', 'Status']
      : type === 'gst' ? ['Invoice', 'Taxable', 'GST', 'Date']
        : type === 'dead-stock' ? ['Product', 'Warehouse', 'Available']
          : type === 'top-customers' ? ['Customer', 'Credit used', 'City']
            : type === 'warehouse-wise' ? ['Warehouse', 'On hand']
              : type === 'product-wise' ? ['Product', 'Qty sold']
                : ['Order', 'Status', 'Total', 'Date']

  return (
    <div>
      <PageHeader title={`Report · ${title}`} actions={<Link to="/admin/reports"><Button variant="ghost">All reports</Button></Link>} />
      <Table headers={headers} rows={rows} />
    </div>
  )
}

export function CanGate({ capability, children }: { capability: Capability; children: React.ReactNode }) {
  const user = useAppStore((s) => s.currentUser())
  if (!user || !can(user.role, capability)) {
    return <Empty title="Permission denied" body={`Requires: ${capabilityLabels[capability]}`} />
  }
  return children
}
