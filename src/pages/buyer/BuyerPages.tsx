import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Badge,
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
  Timeline,
} from '@/components/ui'
import { categories, brands, offers, warehouses } from '@/mock/data'
import { useAppStore, usePriceForProduct } from '@/store/appStore'
import { formatDate, inr, qty } from '@/lib/format'
import { lineTotals, orderTotals, availableCredit } from '@/lib/pricing'
import type { CategorySlug, FabricationType, PriceType } from '@/types'

export function BuyerHome() {
  const user = useAppStore((s) => s.currentUser())!
  const orders = useAppStore((s) => s.orders.filter((o) => o.customerId === user.id))
  const quotations = useAppStore((s) => s.quotations.filter((q) => q.customerId === user.id))
  const invoices = useAppStore((s) => s.invoices.filter((i) => i.customerId === user.id))
  const outstanding = invoices.reduce((s, i) => s + (i.amount + i.gstAmount - i.paidAmount), 0)

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user.companyName}`}
        subtitle={`${user.role} · ${user.city} · Credit available ${inr(availableCredit(user))}`}
        actions={<Link to="/buyer/catalog"><Button>Browse catalog</Button></Link>}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Open orders" value={String(orders.filter((o) => !['completed', 'cancelled'].includes(o.status)).length)} />
        <Stat label="Quotations" value={String(quotations.length)} />
        <Stat label="Outstanding" value={inr(outstanding)} />
        <Stat label="Credit used" value={inr(user.creditUsed)} hint={`Limit ${inr(user.creditLimit)}`} />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="font-semibold text-steel-900">Offers</h3>
          <div className="mt-3 space-y-3">
            {offers.map((o) => (
              <div key={o.id} className="rounded-lg bg-steel-50 p-3">
                <div className="font-medium">{o.title}</div>
                <div className="text-sm text-steel-500">{o.body}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold">Recent orders</h3>
          <div className="mt-3 space-y-2">
            {orders.slice(0, 4).map((o) => (
              <Link key={o.id} to={`/buyer/orders/${o.id}`} className="flex items-center justify-between rounded-lg border border-steel-100 px-3 py-2 hover:bg-steel-50">
                <span className="text-sm font-medium">{o.number}</span>
                <StatusBadge status={o.status} />
              </Link>
            ))}
            {!orders.length ? <Empty title="No orders yet" /> : null}
          </div>
        </Card>
      </div>
    </div>
  )
}

function ProductPrice({ productId }: { productId: string }) {
  const product = useAppStore((s) => s.getProduct(productId))!
  const { price, priceType } = usePriceForProduct(product)
  return (
    <div>
      <div className="text-lg font-semibold text-steel-900">{inr(price)}</div>
      <div className="text-xs uppercase text-steel-400">
        {priceType} · excl. GST {product.gstPercent}%
        {priceType === 'special' ? ' · special customer' : ''}
      </div>
    </div>
  )
}

export function CatalogPage() {
  const products = useAppStore((s) => s.products)
  const inventory = useAppStore((s) => s.inventory)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<string>('all')
  const [brand, setBrand] = useState('all')
  const [warehouse, setWarehouse] = useState('all')

  const filtered = products.filter((p) => {
    const matchQ = p.name.toLowerCase().includes(q.toLowerCase()) || p.sku.toLowerCase().includes(q.toLowerCase())
    const matchC = cat === 'all' || p.category === cat
    const matchB = brand === 'all' || p.brandId === brand
    const matchW =
      warehouse === 'all' ||
      inventory.some((i) => i.productId === p.id && i.warehouseId === warehouse && i.onHand - i.reserved > 0)
    return matchQ && matchC && matchB && matchW
  })

  return (
    <div>
      <PageHeader title="Product catalog" subtitle="MS / GI / Square / TMT / Roofing and more" />
      <Card className="mb-4">
        <div className="grid gap-3 md:grid-cols-4">
          <Input placeholder="Search pipes, angles, TMT..." value={q} onChange={(e) => setQ(e.target.value)} />
          <Select value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="all">All categories</option>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </Select>
          <Select value={brand} onChange={(e) => setBrand(e.target.value)}>
            <option value="all">All brands</option>
            {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </Select>
          <Select value={warehouse} onChange={(e) => setWarehouse(e.target.value)}>
            <option value="all">All warehouses</option>
            {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
          </Select>
        </div>
      </Card>
      <div className="mb-4 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button key={c.slug} onClick={() => setCat(c.slug)} className={`rounded-full px-3 py-1 text-xs font-medium ${cat === c.slug ? 'bg-steel-900 text-white' : 'bg-white text-steel-600 border border-steel-200'}`}>
            {c.name}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p) => {
          const stock = inventory.filter((i) => i.productId === p.id).reduce((s, i) => s + (i.onHand - i.reserved), 0)
          const brandName = brands.find((b) => b.id === p.brandId)?.name
          return (
            <Link key={p.id} to={`/buyer/products/${p.id}`} className="rounded-xl border border-steel-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="text-3xl">{p.images[0]}</div>
                <Badge>{brandName}</Badge>
              </div>
              <div className="mt-3 font-semibold text-steel-900">{p.name}</div>
              <div className="text-xs text-steel-500">{p.sku} · {p.thicknessMm}mm · {p.lengthFt || '—'}ft · {p.weightKg}kg</div>
              <div className="mt-3 flex items-end justify-between">
                <ProductPrice productId={p.id} />
                <div className="text-xs text-steel-500">Avail {qty(stock)}</div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export function ProductDetailPage() {
  const { id } = useParams()
  const product = useAppStore((s) => s.getProduct(id!))
  const inventory = useAppStore((s) => s.inventory.filter((i) => i.productId === id))
  const user = useAppStore((s) => s.currentUser())!
  const createOrder = useAppStore((s) => s.createOrder)
  const createQuotation = useAppStore((s) => s.createQuotation)
  const toggleWishlist = useAppStore((s) => s.toggleWishlist)
  const wishlist = useAppStore((s) => s.wishlist)
  const navigate = useNavigate()
  const [warehouseId, setWarehouseId] = useState(inventory[0]?.warehouseId ?? 'wh-tnk')
  const [qtyVal, setQtyVal] = useState(10)
  const fallbackProduct = useAppStore((s) => s.products[0])
  const priced = usePriceForProduct(product ?? fallbackProduct)

  if (!product) return <Empty title="Product not found" />
  const { price, priceType } = priced

  const brand = brands.find((b) => b.id === product.brandId)?.name
  const avail = inventory.find((i) => i.warehouseId === warehouseId)
  const available = avail ? avail.onHand - avail.reserved : 0

  return (
    <div>
      <PageHeader title={product.name} subtitle={`${product.sku} · ${brand}`} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex h-56 items-center justify-center rounded-xl bg-steel-900 text-7xl text-white">{product.images[0]}</div>
          <p className="mt-4 text-sm text-steel-600">{product.description}</p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-steel-400">Weight</span><div className="font-medium">{product.weightKg} kg</div></div>
            <div><span className="text-steel-400">Thickness</span><div className="font-medium">{product.thicknessMm} mm</div></div>
            <div><span className="text-steel-400">Length</span><div className="font-medium">{product.lengthFt || '—'} ft</div></div>
            <div><span className="text-steel-400">Delivery</span><div className="font-medium">{product.deliveryDays} day(s)</div></div>
            <div><span className="text-steel-400">GST</span><div className="font-medium">{product.gstPercent}%</div></div>
            <div><span className="text-steel-400">Manufacturer</span><div className="font-medium">{product.manufacturerId.replace('mfr-', '').toUpperCase()}</div></div>
          </div>
        </Card>
        <Card>
          <ProductPrice productId={product.id} />
          <div className="mt-4 space-y-3">
            <Field label="Warehouse">
              <Select value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)}>
                {inventory.map((i) => {
                  const wh = warehouses.find((w) => w.id === i.warehouseId)!
                  return <option key={i.warehouseId} value={i.warehouseId}>{wh.name} · avail {i.onHand - i.reserved}</option>
                })}
              </Select>
            </Field>
            <Field label="Quantity">
              <Input type="number" min={1} value={qtyVal} onChange={(e) => setQtyVal(Number(e.target.value))} />
            </Field>
            <div className="rounded-lg bg-steel-50 p-3 text-sm">
              Line total (incl GST): <strong>{inr(lineTotals(price, qtyVal, product.gstPercent).total)}</strong>
              <div className="text-xs text-steel-500">Available now: {available}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => {
                  const order = createOrder({
                    customerId: user.id,
                    items: [{
                      productId: product.id,
                      warehouseId,
                      qty: qtyVal,
                      unitPrice: price,
                      priceType,
                      gstPercent: product.gstPercent,
                      weightKg: product.weightKg,
                    }],
                  })
                  navigate(`/buyer/orders/${order.id}`)
                }}
              >
                Place order
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  const q = createQuotation({
                    customerId: user.id,
                    validityDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
                    items: [{
                      productId: product.id,
                      warehouseId,
                      qty: qtyVal,
                      unitPrice: price,
                      priceType,
                      gstPercent: product.gstPercent,
                    }],
                  })
                  navigate(`/buyer/quotations/${q.id}`)
                }}
              >
                Request quotation
              </Button>
              <Button variant="ghost" onClick={() => toggleWishlist(product.id)}>
                {wishlist.includes(product.id) ? 'Wishlisted' : 'Add wishlist'}
              </Button>
            </div>
          </div>
          <div className="mt-6">
            <h4 className="text-sm font-semibold">Warehouse availability</h4>
            <div className="mt-2 space-y-2">
              {inventory.map((i) => {
                const wh = warehouses.find((w) => w.id === i.warehouseId)!
                return (
                  <div key={i.id} className="flex justify-between rounded-lg border border-steel-100 px-3 py-2 text-sm">
                    <span>{wh.name}</span>
                    <span>On hand {i.onHand} · Reserved {i.reserved} · Avail {i.onHand - i.reserved}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export function QuotationsPage() {
  const user = useAppStore((s) => s.currentUser())!
  const quotations = useAppStore((s) => s.quotations.filter((q) => q.customerId === user.id || ['master_trader', 'super_admin', 'dealer'].includes(user.role)))
  return (
    <div>
      <PageHeader title="Quotations" subtitle="Ask → prepare → accept → convert to order" />
      <Table
        headers={['Number', 'Customer', 'Project', 'Status', 'Valid till', '']}
        rows={quotations.map((q) => [
          q.number,
          q.customerId,
          q.projectName ?? '—',
          <StatusBadge status={q.status} />,
          formatDate(q.validityDate),
          <Link className="text-brand" to={`/buyer/quotations/${q.id}`}>Open</Link>,
        ])}
      />
    </div>
  )
}

export function QuotationDetailPage() {
  const { id } = useParams()
  const q = useAppStore((s) => s.quotations.find((x) => x.id === id))
  const products = useAppStore((s) => s.products)
  const sendQuotation = useAppStore((s) => s.sendQuotation)
  const acceptQuotation = useAppStore((s) => s.acceptQuotation)
  const rejectQuotation = useAppStore((s) => s.rejectQuotation)
  const reviseQuotation = useAppStore((s) => s.reviseQuotation)
  const expireQuotation = useAppStore((s) => s.expireQuotation)
  const updateQuotationItems = useAppStore((s) => s.updateQuotationItems)
  const user = useAppStore((s) => s.currentUser())!
  const navigate = useNavigate()
  if (!q) return <Empty title="Quotation not found" />
  const totals = orderTotals(q.items)
  const canSend = ['draft', 'revised'].includes(q.status) && ['master_trader', 'super_admin', 'dealer'].includes(user.role)
  const canAccept = ['sent', 'revised', 'draft'].includes(q.status) && q.customerId === user.id

  return (
    <div>
      <PageHeader
        title={q.number}
        subtitle={q.projectName ?? 'Standard quotation'}
        actions={
          <div className="flex flex-wrap gap-2">
            {canSend ? <Button onClick={() => sendQuotation(q.id)}>Send to customer</Button> : null}
            {canAccept ? (
              <>
                <Button onClick={() => { const o = acceptQuotation(q.id); if (o) navigate(`/buyer/orders/${o.id}`) }}>Accept & convert</Button>
                <Button variant="danger" onClick={() => rejectQuotation(q.id)}>Reject</Button>
              </>
            ) : null}
            {['sent', 'rejected', 'draft'].includes(q.status) && ['master_trader', 'super_admin', 'dealer'].includes(user.role) ? (
              <Button variant="secondary" onClick={() => reviseQuotation(q.id, q.items, `${q.notes ?? ''} · revised`)}>Revise</Button>
            ) : null}
            {q.status === 'sent' ? <Button variant="ghost" onClick={() => expireQuotation(q.id)}>Expire</Button> : null}
          </div>
        }
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <Table
            headers={['Product', 'Qty', 'Price type', 'Rate', 'GST', 'Line', 'Edit qty']}
            rows={q.items.map((item, idx) => {
              const p = products.find((x) => x.id === item.productId)!
              const t = lineTotals(item.unitPrice, item.qty, item.gstPercent)
              return [
                p.name,
                item.qty,
                item.priceType,
                inr(item.unitPrice),
                `${item.gstPercent}%`,
                inr(t.total),
                ['draft', 'revised', 'sent'].includes(q.status) ? (
                  <Input
                    type="number"
                    className="w-20"
                    defaultValue={item.qty}
                    onBlur={(e) => {
                      const qtyVal = Number(e.target.value)
                      const next = q.items.map((it, i) => (i === idx ? { ...it, qty: qtyVal } : it))
                      updateQuotationItems(q.id, next)
                    }}
                  />
                ) : '—',
              ]
            })}
          />
          {q.notes ? <p className="mt-4 text-sm text-steel-600">{q.notes}</p> : null}
        </Card>
        <Card>
          <StatusBadge status={q.status} />
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>Taxable</span><strong>{inr(totals.taxable)}</strong></div>
            <div className="flex justify-between"><span>GST</span><strong>{inr(totals.gst)}</strong></div>
            <div className="flex justify-between text-base"><span>Total</span><strong>{inr(totals.total)}</strong></div>
            <div className="text-steel-500">Valid till {formatDate(q.validityDate)}</div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export function OrdersPage() {
  const user = useAppStore((s) => s.currentUser())!
  const orders = useAppStore((s) =>
    ['master_trader', 'super_admin'].includes(user.role)
      ? s.orders
      : s.orders.filter((o) => o.customerId === user.id),
  )
  return (
    <div>
      <PageHeader title="Orders" subtitle="Create → approve → dispatch → deliver → complete" />
      <Table
        headers={['Order', 'Customer', 'Items', 'Status', 'Updated', '']}
        rows={orders.map((o) => [
          o.number,
          o.customerId,
          o.items.length,
          <StatusBadge status={o.status} />,
          formatDate(o.updatedAt),
          <Link className="text-brand" to={`/buyer/orders/${o.id}`}>Open</Link>,
        ])}
      />
    </div>
  )
}

const orderSteps = ['pending_approval', 'approved', 'partially_dispatched', 'dispatched', 'delivered', 'completed']

export function OrderDetailPage() {
  const { id } = useParams()
  const order = useAppStore((s) => s.orders.find((o) => o.id === id))
  const products = useAppStore((s) => s.products)
  const invoices = useAppStore((s) => s.invoices.filter((i) => i.orderId === id))
  const cancelOrder = useAppStore((s) => s.cancelOrder)
  const updateOrderStatus = useAppStore((s) => s.updateOrderStatus)
  const requestReturn = useAppStore((s) => s.requestReturn)
  const refundOrder = useAppStore((s) => s.refundOrder)
  const user = useAppStore((s) => s.currentUser())!
  if (!order) return <Empty title="Order not found" />
  const totals = orderTotals(order.items)
  const timelineStatus = orderSteps.includes(order.status) ? order.status : order.status === 'partially_dispatched' ? 'partially_dispatched' : 'pending_approval'

  return (
    <div>
      <PageHeader
        title={order.number}
        subtitle={order.notes ?? 'Order detail'}
        actions={
          <div className="flex flex-wrap gap-2">
            {!['cancelled', 'completed', 'refunded'].includes(order.status) ? (
              <Button variant="danger" onClick={() => cancelOrder(order.id)}>Cancel</Button>
            ) : null}
            {['delivered', 'completed'].includes(order.status) && order.customerId === user.id ? (
              <Button variant="ghost" onClick={() => requestReturn(order.id)}>Request return</Button>
            ) : null}
            {order.status === 'return_requested' && ['master_trader', 'super_admin'].includes(user.role) ? (
              <Button variant="danger" onClick={() => refundOrder(order.id)}>Refund</Button>
            ) : null}
          </div>
        }
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <Table
            headers={['Product', 'Warehouse', 'Qty', 'Rate', 'Weight', 'Line']}
            rows={order.items.map((item) => {
              const p = products.find((x) => x.id === item.productId)!
              const wh = warehouses.find((w) => w.id === item.warehouseId)?.name
              const t = lineTotals(item.unitPrice, item.qty, item.gstPercent)
              return [p.name, wh, item.qty, `${inr(item.unitPrice)} (${item.priceType})`, `${item.weightKg}kg`, inr(t.total)]
            })}
          />
          {invoices.map((inv) => (
            <div key={inv.id} className="mt-4 rounded-lg bg-steel-50 p-3 text-sm">
              <Link className="font-medium text-brand" to={`/buyer/invoices/${inv.id}`}>Invoice {inv.number}</Link>
              {' · '}<StatusBadge status={inv.status} /> · Due {inv.dueDate} · Paid {inr(inv.paidAmount)} / {inr(inv.amount + inv.gstAmount)}
            </div>
          ))}
          {order.status === 'delivered' ? (
            <Button className="mt-4" onClick={() => updateOrderStatus(order.id, 'completed')}>Mark completed</Button>
          ) : null}
        </Card>
        <Card>
          <StatusBadge status={order.status} />
          <div className="mt-4">
            <Timeline steps={orderSteps} current={timelineStatus} />
          </div>
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between"><span>Taxable</span><strong>{inr(totals.taxable)}</strong></div>
            <div className="flex justify-between"><span>GST</span><strong>{inr(totals.gst)}</strong></div>
            <div className="flex justify-between"><span>Total</span><strong>{inr(totals.total)}</strong></div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export function BuyerPaymentsPage() {
  const user = useAppStore((s) => s.currentUser())!
  const invoices = useAppStore((s) => s.invoices.filter((i) => i.customerId === user.id))
  const payments = useAppStore((s) => s.payments.filter((p) => p.customerId === user.id))
  const ledger = useAppStore((s) => s.ledger.filter((l) => l.customerId === user.id))
  const recordPayment = useAppStore((s) => s.recordPayment)
  const [invoiceId, setInvoiceId] = useState(invoices[0]?.id ?? '')
  const [amount, setAmount] = useState(5000)
  const [method, setMethod] = useState<'cash' | 'upi' | 'bank' | 'credit'>('upi')

  return (
    <div>
      <PageHeader title="Payments & outstanding" subtitle="Cash · UPI · Bank · Credit · Part payment · Ledger" />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <h3 className="font-semibold">Record part payment</h3>
          <div className="mt-3 space-y-3">
            <Field label="Invoice">
              <Select value={invoiceId} onChange={(e) => setInvoiceId(e.target.value)}>
                {invoices.map((i) => <option key={i.id} value={i.id}>{i.number}</option>)}
              </Select>
            </Field>
            <Field label="Amount"><Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} /></Field>
            <Field label="Method">
              <Select value={method} onChange={(e) => setMethod(e.target.value as typeof method)}>
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="bank">Bank</option>
                <option value="credit">Credit adjust</option>
              </Select>
            </Field>
            <Button onClick={() => recordPayment({ customerId: user.id, invoiceId, amount, method })}>Save payment</Button>
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <h3 className="mb-3 font-semibold">Invoices</h3>
          <Table headers={['Invoice', 'Due', 'Total', 'Paid', 'Status']} rows={invoices.map((i) => [
            <Link className="text-brand" to={`/buyer/invoices/${i.id}`}>{i.number}</Link>,
            i.dueDate,
            inr(i.amount + i.gstAmount),
            inr(i.paidAmount),
            <StatusBadge status={i.status} />,
          ])} />
        </Card>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-3 font-semibold">Payments</h3>
          <Table headers={['When', 'Method', 'Amount', 'Invoice']} rows={payments.map((p) => [formatDate(p.at), p.method.toUpperCase(), inr(p.amount), p.invoiceId ?? '—'])} />
        </Card>
        <Card>
          <h3 className="mb-3 font-semibold">Ledger</h3>
          <Table headers={['When', 'Type', 'Amount', 'Ref']} rows={ledger.map((l) => [formatDate(l.at), l.type, inr(l.amount), l.ref])} />
        </Card>
      </div>
    </div>
  )
}

export function FabricationBuyerPage() {
  const user = useAppStore((s) => s.currentUser())!
  const requests = useAppStore((s) =>
    ['master_trader', 'super_admin'].includes(user.role)
      ? s.fabricationRequests
      : s.fabricationRequests.filter((r) => r.customerId === user.id),
  )
  const quotes = useAppStore((s) => s.fabricationQuotes)
  const createFabRequest = useAppStore((s) => s.createFabRequest)
  const selectFabQuote = useAppStore((s) => s.selectFabQuote)
  const [type, setType] = useState<FabricationType>('gate')
  const [dimensions, setDimensions] = useState('W 8ft x H 5ft')
  const [location, setLocation] = useState('Site address')
  const [city, setCity] = useState(user.city)
  const [notes, setNotes] = useState('')

  return (
    <div>
      <PageHeader title="Fabrication marketplace" subtitle="Gate · Grill · Stair · Roof · Shed — multi-quote" />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <h3 className="font-semibold">New request</h3>
          <div className="mt-3 space-y-3">
            <Field label="Type">
              <Select value={type} onChange={(e) => setType(e.target.value as FabricationType)}>
                {(['gate', 'grill', 'stair', 'roof', 'shed'] as FabricationType[]).map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
            </Field>
            <Field label="Dimensions"><Input value={dimensions} onChange={(e) => setDimensions(e.target.value)} /></Field>
            <Field label="Location"><Input value={location} onChange={(e) => setLocation(e.target.value)} /></Field>
            <Field label="City"><Input value={city} onChange={(e) => setCity(e.target.value)} /></Field>
            <Field label="Notes / photos ref"><TextArea value={notes} onChange={(e) => setNotes(e.target.value)} /></Field>
            <Button onClick={() => createFabRequest({
              customerId: user.id,
              type,
              dimensions,
              photos: ['upload-mock'],
              location,
              city,
              notes,
            })}>Submit request</Button>
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <h3 className="mb-3 font-semibold">My requests & quotes</h3>
          <div className="space-y-4">
            {requests.map((r) => {
              const qs = quotes.filter((q) => q.requestId === r.id)
              return (
                <div key={r.id} className="rounded-xl border border-steel-100 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-medium">{r.number} · {r.type}</div>
                      <div className="text-sm text-steel-500">{r.dimensions} · {r.city}</div>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="mt-3 space-y-2">
                    {qs.map((q) => (
                      <div key={q.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-steel-50 px-3 py-2 text-sm">
                        <span>{q.fabricatorId} · {inr(q.amount)} · {q.days} days · {q.notes}</span>
                        {r.status === 'quoting' || r.status === 'open' ? (
                          <Button onClick={() => selectFabQuote(r.id, q.id)}>Choose</Button>
                        ) : q.status === 'accepted' ? <Badge tone="success">Selected</Badge> : null}
                      </div>
                    ))}
                    {!qs.length ? <div className="text-sm text-steel-500">Waiting for fabricator quotations…</div> : null}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}

export function WishlistPage() {
  const wishlist = useAppStore((s) => s.wishlist)
  const products = useAppStore((s) => s.products)
  const toggleWishlist = useAppStore((s) => s.toggleWishlist)
  const items = products.filter((p) => wishlist.includes(p.id))
  return (
    <div>
      <PageHeader title="Wishlist" />
      {!items.length ? <Empty title="Wishlist empty" /> : (
        <Table
          headers={['Product', 'SKU', 'Category', '']}
          rows={items.map((p) => [
            <Link className="text-brand" to={`/buyer/products/${p.id}`}>{p.name}</Link>,
            p.sku,
            p.category,
            <Button variant="ghost" onClick={() => toggleWishlist(p.id)}>Remove</Button>,
          ])}
        />
      )}
    </div>
  )
}

export function ProfilePage() {
  const user = useAppStore((s) => s.currentUser())!
  const hold = user.creditLimit > 0 && user.creditUsed >= user.creditLimit
  return (
    <div>
      <PageHeader title="Profile" subtitle="Business details, GST, credit" />
      {hold ? <Card className="mb-4 border-danger bg-red-50 text-sm text-danger">Credit hold active — collections required before new credit orders.</Card> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <div className="text-3xl font-semibold">{user.avatarInitials}</div>
          <div className="mt-2 text-lg font-semibold">{user.name}</div>
          <div className="text-sm text-steel-500">{user.companyName}</div>
          <div className="mt-4 space-y-2 text-sm">
            <div>Email: {user.email}</div>
            <div>Phone: {user.phone}</div>
            <div>City: {user.city}</div>
            <div>GSTIN: {user.gstin ?? '—'}</div>
            <div>Verification: <StatusBadge status={user.verificationStatus} /></div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/buyer/addresses"><Button variant="ghost">Address book</Button></Link>
            <Link to="/settings"><Button variant="ghost">User settings</Button></Link>
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold">Credit profile</h3>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>Limit</span><strong>{inr(user.creditLimit)}</strong></div>
            <div className="flex justify-between"><span>Used</span><strong>{inr(user.creditUsed)}</strong></div>
            <div className="flex justify-between"><span>Available</span><strong>{inr(availableCredit(user))}</strong></div>
            <div className="flex justify-between"><span>Credit days</span><strong>{user.creditDays}</strong></div>
          </div>
        </Card>
      </div>
    </div>
  )
}
