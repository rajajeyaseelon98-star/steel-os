import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Card, Field, Input, OverviewStrip, PageHeader, Select, Stat, StatusBadge, Table } from '@/components/ui'
import { warehouses, vehicles, drivers } from '@/mock/data'
import { useAppStore } from '@/store/appStore'
import { formatDate, inr } from '@/lib/format'
import { orderTotals } from '@/lib/pricing'

export function WarehouseHome() {
  const inventory = useAppStore((s) => s.inventory)
  const orders = useAppStore((s) => s.orders.filter((o) => o.status === 'approved'))
  const grns = useAppStore((s) => s.goodsReceipts.filter((g) => g.status === 'draft'))
  const transfers = useAppStore((s) => s.stockTransfers.filter((t) => t.status === 'in_transit'))
  return (
    <div>
      <PageHeader title="Warehouse home" subtitle="Receiving · stock · dispatch · transfer · barcode" />
      <OverviewStrip>
        <Stat label="Pending receiving" value={String(grns.length)} />
        <Stat label="Pending dispatch" value={String(orders.length)} />
        <Stat label="In-transit transfers" value={String(transfers.length)} />
        <Stat label="SKU locations" value={String(inventory.length)} />
      </OverviewStrip>
    </div>
  )
}

export function WarehouseReceivingPage() {
  const grns = useAppStore((s) => s.goodsReceipts)
  const products = useAppStore((s) => s.products)
  const postGRN = useAppStore((s) => s.postGRN)
  return (
    <div>
      <PageHeader title="Receiving (GRN)" />
      <div className="space-y-3">
        {grns.map((g) => (
          <Card key={g.id}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="font-semibold">{g.number}</div>
                <div className="text-sm text-steel-500">PO {g.poId} · {g.items.map((i) => products.find((p) => p.id === i.productId)?.name).join(', ')}</div>
              </div>
              <StatusBadge status={g.status} />
            </div>
            {g.status === 'draft' ? (
              <div className="mt-3 flex gap-2">
                <Button onClick={() => postGRN(g.id, 'pass')}>Inspect pass & post</Button>
                <Button variant="ghost" onClick={() => postGRN(g.id, 'partial')}>Partial</Button>
              </div>
            ) : null}
          </Card>
        ))}
      </div>
    </div>
  )
}

export function WarehouseStockPage() {
  const inventory = useAppStore((s) => s.inventory)
  const products = useAppStore((s) => s.products)
  return (
    <div>
      <PageHeader title="Stock" />
      <Table
        headers={['Product', 'Warehouse', 'On hand', 'Reserved', 'Available', 'QR']}
        rows={inventory.map((i) => [
          products.find((p) => p.id === i.productId)?.name,
          warehouses.find((w) => w.id === i.warehouseId)?.name,
          i.onHand,
          i.reserved,
          i.onHand - i.reserved,
          i.qrCode,
        ])}
      />
    </div>
  )
}

export function WarehouseDispatchPage() {
  const orders = useAppStore((s) => s.orders.filter((o) => ['approved', 'partially_dispatched'].includes(o.status)))
  const dispatchOrder = useAppStore((s) => s.dispatchOrder)
  const confirmLoading = useAppStore((s) => s.confirmLoading)
  const trips = useAppStore((s) => s.trips)
  const [vehicleId, setVehicleId] = useState('v-1')
  const [driverId, setDriverId] = useState('drv-1')

  return (
    <div>
      <PageHeader title="Dispatch queue" />
      <Card className="mb-4 grid gap-3 sm:grid-cols-2">
        <Field label="Vehicle">
          <Select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
            {vehicles.map((v) => <option key={v.id} value={v.id}>{v.number}</option>)}
          </Select>
        </Field>
        <Field label="Driver">
          <Select value={driverId} onChange={(e) => setDriverId(e.target.value)}>
            {drivers.map((d) => <option key={d.id} value={d.id}>{d.userId}</option>)}
          </Select>
        </Field>
      </Card>
      {orders.map((o) => (
        <Card key={o.id} className="mb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="font-semibold">{o.number}</div>
              <div className="text-sm text-steel-500">{o.items.length} lines · {inr(orderTotals(o.items).total)}</div>
            </div>
            <Button onClick={() => {
              const trip = dispatchOrder(o.id, vehicleId, driverId)
              if (trip) confirmLoading(trip.id)
            }}>Reserve → Load → Dispatch</Button>
          </div>
        </Card>
      ))}
      <Card className="mt-4">
        <h3 className="mb-2 font-semibold">Active trips</h3>
        <Table
          headers={['Trip', 'Order', 'Status', 'Loading']}
          rows={trips.slice(0, 8).map((t) => [t.id, t.orderId, <StatusBadge status={t.status} />, t.loadingConfirmed ? 'Yes' : 'No'])}
        />
      </Card>
    </div>
  )
}

export function WarehouseTransfersPage() {
  const transfers = useAppStore((s) => s.stockTransfers)
  const products = useAppStore((s) => s.products)
  const createTransfer = useAppStore((s) => s.createTransfer)
  const receiveTransfer = useAppStore((s) => s.receiveTransfer)
  const [from, setFrom] = useState('wh-tnk')
  const [to, setTo] = useState('wh-skl')
  const [productId, setProductId] = useState('p-sq-1')
  const [qtyVal, setQtyVal] = useState(20)

  return (
    <div>
      <PageHeader title="Stock transfer" />
      <Card className="mb-4">
        <div className="grid gap-3 md:grid-cols-4">
          <Field label="From">
            <Select value={from} onChange={(e) => setFrom(e.target.value)}>
              {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
            </Select>
          </Field>
          <Field label="To">
            <Select value={to} onChange={(e) => setTo(e.target.value)}>
              {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
            </Select>
          </Field>
          <Field label="Product">
            <Select value={productId} onChange={(e) => setProductId(e.target.value)}>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select>
          </Field>
          <Field label="Qty"><Input type="number" value={qtyVal} onChange={(e) => setQtyVal(Number(e.target.value))} /></Field>
        </div>
        <Button className="mt-3" onClick={() => createTransfer(from, to, productId, qtyVal)}>Create transfer</Button>
      </Card>
      <Table
        headers={['From', 'To', 'Product', 'Qty', 'Status', '']}
        rows={transfers.map((t) => [
          warehouses.find((w) => w.id === t.fromWarehouseId)?.name,
          warehouses.find((w) => w.id === t.toWarehouseId)?.name,
          products.find((p) => p.id === t.productId)?.name,
          t.qty,
          <StatusBadge status={t.status} />,
          t.status === 'in_transit' ? <Button onClick={() => receiveTransfer(t.id)}>Receive</Button> : '—',
        ])}
      />
    </div>
  )
}

export function WarehouseScanPage() {
  const inventory = useAppStore((s) => s.inventory)
  const products = useAppStore((s) => s.products)
  const [code, setCode] = useState('')
  const hit = inventory.find((i) => i.barcode === code || i.qrCode === code)
  return (
    <div>
      <PageHeader title="Barcode / QR scan" subtitle="Camera mock — enter barcode or QR text" />
      <Card>
        <Field label="Scan value"><Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="BC100000" /></Field>
        <div className="mt-3 text-xs text-steel-500">Try a barcode from stock table, e.g. BC100000</div>
        {hit ? (
          <div className="mt-4 rounded-lg bg-emerald-50 p-4 text-sm">
            <div className="font-semibold text-success">Match found</div>
            <div>{products.find((p) => p.id === hit.productId)?.name}</div>
            <div>{warehouses.find((w) => w.id === hit.warehouseId)?.name}</div>
            <div>On hand {hit.onHand} · Reserved {hit.reserved}</div>
          </div>
        ) : code ? <div className="mt-4 text-sm text-danger">No match</div> : null}
      </Card>
    </div>
  )
}

export function WarehouseReportsPage() {
  const inventory = useAppStore((s) => s.inventory)
  const movements = useAppStore((s) => s.stockMovements)
  return (
    <div>
      <PageHeader title="Warehouse reports" />
      <OverviewStrip>
        <Stat label="Total on hand" value={String(inventory.reduce((s, i) => s + i.onHand, 0))} />
        <Stat label="Reserved" value={String(inventory.reduce((s, i) => s + i.reserved, 0))} />
        <Stat label="Movements" value={String(movements.length)} />
      </OverviewStrip>
      <Card className="mt-4">
        <Table
          headers={['When', 'Type', 'Qty', 'Ref']}
          rows={movements.slice(0, 15).map((m) => [formatDate(m.at), m.type, m.qty, m.ref])}
        />
      </Card>
    </div>
  )
}

export function FabricatorHome() {
  const user = useAppStore((s) => s.currentUser())!
  const leads = useAppStore((s) => s.fabricationRequests.filter((r) => ['open', 'quoting'].includes(r.status)))
  return (
    <div>
      <PageHeader title="Lead requests" subtitle={`Signed in as ${user.companyName}`} />
      <div className="space-y-3">
        {leads.map((r) => (
          <Card key={r.id}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="font-semibold">{r.number} · {r.type}</div>
                <div className="text-sm text-steel-500">{r.dimensions} · {r.city} · {r.location}</div>
              </div>
              <Link to={`/fabricator/leads/${r.id}`}><Button>Open</Button></Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function FabricatorLeadDetail() {
  const { id } = useParams()
  const req = useAppStore((s) => s.fabricationRequests.find((r) => r.id === id))
  const products = useAppStore((s) => s.products)
  const user = useAppStore((s) => s.currentUser())!
  const addFabQuote = useAppStore((s) => s.addFabQuote)
  const [amount, setAmount] = useState(27000)
  const [days, setDays] = useState(8)
  const [notes, setNotes] = useState('Includes fabrication + primer')
  if (!req) return <div>Lead not found</div>
  return (
    <div>
      <PageHeader title={req.number} subtitle={`${req.type} · ${req.dimensions}`} />
      <Card>
        <div className="text-sm text-steel-600">{req.notes}</div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Field label="Quote amount"><Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} /></Field>
          <Field label="Days"><Input type="number" value={days} onChange={(e) => setDays(Number(e.target.value))} /></Field>
          <Field label="Notes"><Input value={notes} onChange={(e) => setNotes(e.target.value)} /></Field>
        </div>
        <Button
          className="mt-4"
          onClick={() => addFabQuote({
            requestId: req.id,
            fabricatorId: user.id,
            amount,
            days,
            notes,
            materials: [
              { productId: 'p-sq-1', qty: 10 },
              { productId: 'p-flat-25', qty: 6 },
              { productId: 'p-acc-hinge', qty: 1 },
            ],
          })}
        >
          Submit quotation
        </Button>
        <div className="mt-4 text-sm text-steel-500">Default materials: {products.filter((p) => ['p-sq-1', 'p-flat-25', 'p-acc-hinge'].includes(p.id)).map((p) => p.name).join(', ')}</div>
      </Card>
    </div>
  )
}

export function FabricatorQuotesPage() {
  const user = useAppStore((s) => s.currentUser())!
  const quotes = useAppStore((s) => s.fabricationQuotes.filter((q) => q.fabricatorId === user.id))
  return (
    <div>
      <PageHeader title="My quotations" />
      <Table
        headers={['Request', 'Amount', 'Days', 'Status']}
        rows={quotes.map((q) => [q.requestId, inr(q.amount), q.days, <StatusBadge status={q.status} />])}
      />
    </div>
  )
}

export function FabricatorJobsPage() {
  const user = useAppStore((s) => s.currentUser())!
  const jobs = useAppStore((s) =>
    ['master_trader', 'super_admin'].includes(user.role)
      ? s.fabricationJobs
      : s.fabricationJobs.filter((j) => j.fabricatorId === user.id),
  )
  const quotes = useAppStore((s) => s.fabricationQuotes)
  const products = useAppStore((s) => s.products)
  const advanceFabJob = useAppStore((s) => s.advanceFabJob)
  const payFabJob = useAppStore((s) => s.payFabJob)
  return (
    <div>
      <PageHeader title="Accepted jobs" subtitle="accepted → in progress → completed → paid" />
      {jobs.map((j) => {
        const q = quotes.find((x) => x.id === j.quoteId)
        return (
          <Card key={j.id} className="mb-3">
            <div className="flex justify-between"><strong>{j.id}</strong><StatusBadge status={j.status} /></div>
            <div className="mt-2 text-sm">Payment: <StatusBadge status={j.paymentStatus} /></div>
            <div className="mt-2 text-sm">Materials required: {q?.materials.map((m) => `${products.find((p) => p.id === m.productId)?.name} × ${m.qty}`).join(', ')}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {j.status !== 'completed' ? <Button onClick={() => advanceFabJob(j.id)}>Advance status</Button> : null}
              {j.status === 'completed' && j.paymentStatus !== 'paid' ? (
                <>
                  <Button variant="secondary" onClick={() => payFabJob(j.id, 'partial')}>Part payment</Button>
                  <Button onClick={() => payFabJob(j.id, 'paid')}>Mark paid</Button>
                </>
              ) : null}
            </div>
          </Card>
        )
      })}
      {!jobs.length ? <Card>No accepted jobs yet. Win a lead quote first.</Card> : null}
    </div>
  )
}

export function FabricatorPaymentsPage() {
  const jobs = useAppStore((s) => s.fabricationJobs)
  return (
    <div>
      <PageHeader title="Payments" />
      <Table
        headers={['Job', 'Job status', 'Payment status']}
        rows={jobs.map((j) => [j.id, <StatusBadge status={j.status} />, <StatusBadge status={j.paymentStatus} />])}
      />
    </div>
  )
}

export function FabricatorReviewsPage() {
  const jobs = useAppStore((s) => s.fabricationJobs.filter((j) => j.status === 'completed'))
  const reviewFabJob = useAppStore((s) => s.reviewFabJob)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('Good work')
  return (
    <div>
      <PageHeader title="Reviews" />
      {jobs.map((j) => (
        <Card key={j.id} className="mb-3">
          <div className="font-semibold">{j.id}</div>
          {j.review ? (
            <div className="mt-2 text-sm">★ {j.review.rating} — {j.review.comment}</div>
          ) : (
            <div className="mt-3 space-y-2">
              <Input type="number" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))} />
              <Input value={comment} onChange={(e) => setComment(e.target.value)} />
              <Button onClick={() => reviewFabJob(j.id, rating, comment)}>Submit review</Button>
            </div>
          )}
        </Card>
      ))}
      {!jobs.length ? <Card><div className="text-sm text-steel-600">Complete a job to collect reviews.</div></Card> : null}
    </div>
  )
}

export function DriverHome() {
  const trips = useAppStore((s) => s.trips.filter((t) => t.status !== 'delivered'))
  const orders = useAppStore((s) => s.orders)
  return (
    <div>
      <PageHeader title="Today's trips" />
      <div className="space-y-3">
        {trips.map((t) => (
          <Card key={t.id}>
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="font-semibold">{orders.find((o) => o.id === t.orderId)?.number}</div>
                <StatusBadge status={t.status} />
              </div>
              <Link to={`/driver/trips/${t.id}`}><Button>Open trip</Button></Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function DriverTripDetail() {
  const { id } = useParams()
  const trip = useAppStore((s) => s.trips.find((t) => t.id === id))
  const order = useAppStore((s) => s.orders.find((o) => o.id === trip?.orderId))
  const updateTripStatus = useAppStore((s) => s.updateTripStatus)
  const submitPod = useAppStore((s) => s.submitPod)
  const [signature, setSignature] = useState('Customer signature')
  const [photo, setPhoto] = useState('delivery-photo-1')
  if (!trip || !order) return <div>Trip not found</div>
  return (
    <div>
      <PageHeader title={order.number} subtitle={`Trip ${trip.id}`} />
      <Card className="space-y-3">
        <StatusBadge status={trip.status} />
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" onClick={() => updateTripStatus(trip.id, 'out_for_delivery')}>Start navigation</Button>
          <Button variant="ghost" onClick={() => updateTripStatus(trip.id, 'arrived')}>Mark arrived</Button>
        </div>
        <Field label="Customer signature"><Input value={signature} onChange={(e) => setSignature(e.target.value)} /></Field>
        <Field label="Photo proof note"><Input value={photo} onChange={(e) => setPhoto(e.target.value)} /></Field>
        <Button onClick={() => submitPod(trip.id, signature, photo)}>Capture POD & deliver</Button>
        {trip.podSignature ? <div className="rounded-lg bg-emerald-50 p-3 text-sm">POD saved: {trip.podSignature} · photos {trip.podPhotos.join(', ')}</div> : null}
      </Card>
    </div>
  )
}

export function DriverHistoryPage() {
  const trips = useAppStore((s) => s.trips.filter((t) => t.status === 'delivered'))
  return (
    <div>
      <PageHeader title="Trip history" />
      <Table
        headers={['Trip', 'Order', 'POD']}
        rows={trips.map((t) => [t.id, t.orderId, t.podSignature ?? '—'])}
      />
    </div>
  )
}

export function NotificationsPage() {
  const user = useAppStore((s) => s.currentUser())!
  const notifications = useAppStore((s) => s.notifications.filter((n) => n.userId === user.id))
  const markNotificationRead = useAppStore((s) => s.markNotificationRead)
  return (
    <div className="mx-auto max-w-3xl p-4">
      <PageHeader
        title="Notifications"
        subtitle="WhatsApp · SMS · Email · Push represented in-app"
      />
      <div className="space-y-3">
        {notifications.map((n) => (
          <Card key={n.id} className={n.read ? 'opacity-70' : ''}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold">{n.title}</div>
                <div className="text-sm text-steel-600">{n.body}</div>
                <div className="mt-1 text-xs uppercase text-steel-400">{n.channel} · {formatDate(n.at)}</div>
              </div>
              {!n.read ? <Button variant="ghost" onClick={() => markNotificationRead(n.id)}>Mark read</Button> : null}
            </div>
            {n.link ? <Link className="mt-2 inline-block text-sm text-brand" to={n.link}>Open</Link> : null}
          </Card>
        ))}
      </div>
    </div>
  )
}

export function SupportPage() {
  const faqs = [
    { q: 'How do I request a quotation?', a: 'Open Catalog → product → Request quotation, or ask Super Admin to send a quote from a template.' },
    { q: 'How do I place an order?', a: 'Open a product and Place order. Super Admin will Accept, Dispatch, then Mark delivered.' },
    { q: 'Where is my wishlist?', a: 'Retail: Wishlist in the side nav. Super Admin can see all retail wishlists under Wishlists.' },
    { q: 'Who processes dispatch?', a: 'Only Super Admin — there is no separate warehouse or driver app in this prototype.' },
  ]
  const [active, setActive] = useState<number | null>(0)
  const [custom, setCustom] = useState('')
  const [reply, setReply] = useState('Pick a suggested question or type your own.')

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Support" subtitle="FAQ chatbot (prototype — no live AI)" />
      <Card>
        <div className="flex flex-wrap gap-2">
          {faqs.map((f, i) => (
            <Button
              key={f.q}
              variant={active === i ? 'primary' : 'outline'}
              onClick={() => {
                setActive(i)
                setReply(f.a)
              }}
            >
              {f.q}
            </Button>
          ))}
        </div>
        <div className="mt-4 rounded-lg bg-surface-muted p-4 text-sm text-text-primary">{reply}</div>
        <div className="mt-4 flex gap-2">
          <Input
            placeholder="Type a question…"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && custom.trim()) {
                const hit = faqs.find((f) => f.q.toLowerCase().includes(custom.toLowerCase().slice(0, 12)))
                setReply(hit?.a ?? 'Thanks — for demos use Catalog, Quotations, Orders, and Wishlists. Call +91 98765 00000 for human help.')
                setCustom('')
              }
            }}
          />
          <Button
            onClick={() => {
              if (!custom.trim()) return
              const hit = faqs.find((f) => custom.toLowerCase().includes('order') ? f.q.includes('order') : custom.toLowerCase().includes('wish') ? f.q.includes('wishlist') : false)
              setReply(hit?.a ?? 'Thanks — for demos use Catalog, Quotations, Orders, and Wishlists. Call +91 98765 00000 for human help.')
              setCustom('')
            }}
          >
            Ask
          </Button>
        </div>
        <p className="mt-3 text-xs text-text-secondary">Call +91 98765 00000 · support@steelos.in</p>
      </Card>
    </div>
  )
}
