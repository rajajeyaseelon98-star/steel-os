import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
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
} from '@/components/ui'
import { brands, manufacturers, vehicles, warehouses, drivers } from '@/mock/data'
import { useAppStore } from '@/store/appStore'
import { formatDate, inr, qty } from '@/lib/format'
import { orderTotals } from '@/lib/pricing'
import { roleLabels } from '@/lib/permissions'
import type { PriceType } from '@/types'

export function AdminDashboard() {
  const orders = useAppStore((s) => s.orders)
  const inventory = useAppStore((s) => s.inventory)
  const invoices = useAppStore((s) => s.invoices)
  const trips = useAppStore((s) => s.trips)
  const products = useAppStore((s) => s.products)
  const todaySales = orders
    .filter((o) => !['cancelled', 'draft'].includes(o.status))
    .reduce((s, o) => s + orderTotals(o.items).total, 0)
  const outstanding = invoices.reduce((s, i) => s + (i.amount + i.gstAmount - i.paidAmount), 0)
  const lowStock = inventory.filter((i) => i.onHand - i.reserved < 50)
  const pending = orders.filter((o) => o.status === 'pending_approval')

  const top = useMemo(() => {
    const map = new Map<string, number>()
    orders.forEach((o) => o.items.forEach((i) => map.set(i.productId, (map.get(i.productId) ?? 0) + i.qty)))
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, q]) => ({ name: products.find((p) => p.id === id)?.name ?? id, qty: q }))
  }, [orders, products])

  return (
    <div>
      <PageHeader title="Operations dashboard" subtitle="Today’s sales · orders · inventory · dispatch · collections · outstanding" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Today's Sales (demo)" value={inr(todaySales)} />
        <Stat label="Orders" value={String(orders.length)} hint={`${pending.length} pending approval`} />
        <Stat label="Outstanding" value={inr(outstanding)} />
        <Stat label="Low stock SKUs" value={String(lowStock.length)} />
        <Stat label="Inventory rows" value={String(inventory.length)} />
        <Stat label="Today's dispatch" value={String(trips.filter((t) => t.status !== 'delivered').length)} />
        <Stat label="Collections due" value={inr(outstanding * 0.35)} />
        <Stat label="Warehouses" value={String(warehouses.length)} />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-3 font-semibold">Top selling products</h3>
          <Table headers={['Product', 'Qty']} rows={top.map((t) => [t.name, qty(t.qty)])} />
        </Card>
        <Card>
          <h3 className="mb-3 font-semibold">Low stock</h3>
          <Table
            headers={['Product', 'Warehouse', 'Available']}
            rows={lowStock.slice(0, 8).map((i) => [
              products.find((p) => p.id === i.productId)?.name,
              warehouses.find((w) => w.id === i.warehouseId)?.name,
              i.onHand - i.reserved,
            ])}
          />
        </Card>
      </div>
      <Card className="mt-4">
        <h3 className="mb-3 font-semibold">Recent activity</h3>
        <Table
          headers={['Order', 'Status', 'Customer', '']}
          rows={orders.slice(0, 6).map((o) => [
            o.number,
            <StatusBadge status={o.status} />,
            o.customerId,
            <Link className="text-brand" to={`/admin/orders`}>Manage</Link>,
          ])}
        />
      </Card>
    </div>
  )
}

export function AdminOrdersPage() {
  const orders = useAppStore((s) => s.orders)
  const approveOrder = useAppStore((s) => s.approveOrder)
  const dispatchOrder = useAppStore((s) => s.dispatchOrder)
  const [vehicleId, setVehicleId] = useState('v-1')
  const [driverId, setDriverId] = useState('drv-1')

  return (
    <div>
      <PageHeader title="Orders ops board" subtitle="Approve · reserve stock · dispatch" />
      <Card className="mb-4 grid gap-3 md:grid-cols-2">
        <Field label="Dispatch vehicle">
          <Select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
            {vehicles.map((v) => <option key={v.id} value={v.id}>{v.number} · {v.type}</option>)}
          </Select>
        </Field>
        <Field label="Driver">
          <Select value={driverId} onChange={(e) => setDriverId(e.target.value)}>
            {drivers.map((d) => <option key={d.id} value={d.id}>{d.userId} · {d.licenseNo}</option>)}
          </Select>
        </Field>
      </Card>
      <Table
        headers={['Order', 'Customer', 'Status', 'Total', 'Actions']}
        rows={orders.map((o) => [
          o.number,
          o.customerId,
          <StatusBadge status={o.status} />,
          inr(orderTotals(o.items).total),
          <div className="flex flex-wrap gap-2">
            {o.status === 'pending_approval' ? <Button onClick={() => approveOrder(o.id)}>Approve</Button> : null}
            {o.status === 'approved' ? <Button variant="secondary" onClick={() => dispatchOrder(o.id, vehicleId, driverId)}>Dispatch</Button> : null}
            <Link className="self-center text-sm text-brand" to={`/buyer/orders/${o.id}`}>View</Link>
          </div>,
        ])}
      />
    </div>
  )
}

export function AdminQuotationsPage() {
  const quotations = useAppStore((s) => s.quotations)
  const users = useAppStore((s) => s.users)
  const products = useAppStore((s) => s.products)
  const createQuotation = useAppStore((s) => s.createQuotation)
  const sendQuotation = useAppStore((s) => s.sendQuotation)
  const [customerId, setCustomerId] = useState('u-contractor')
  const [productId, setProductId] = useState('p-sq-1')
  const [qtyVal, setQtyVal] = useState(100)
  const [priceType, setPriceType] = useState<PriceType>('project')
  const [projectName, setProjectName] = useState('G+1 Sankarankovil')

  return (
    <div>
      <PageHeader title="Sales quotations" />
      <Card className="mb-4">
        <h3 className="font-semibold">Prepare quotation</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <Field label="Customer">
            <Select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
              {users.filter((u) => ['dealer', 'contractor', 'retail'].includes(u.role)).map((u) => (
                <option key={u.id} value={u.id}>{u.companyName}</option>
              ))}
            </Select>
          </Field>
          <Field label="Product">
            <Select value={productId} onChange={(e) => setProductId(e.target.value)}>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select>
          </Field>
          <Field label="Qty"><Input type="number" value={qtyVal} onChange={(e) => setQtyVal(Number(e.target.value))} /></Field>
          <Field label="Price type">
            <Select value={priceType} onChange={(e) => setPriceType(e.target.value as PriceType)}>
              {(['retail', 'dealer', 'contractor', 'wholesale', 'project', 'special'] as PriceType[]).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </Select>
          </Field>
          <Field label="Project"><Input value={projectName} onChange={(e) => setProjectName(e.target.value)} /></Field>
        </div>
        <Button
          className="mt-3"
          onClick={() => {
            const p = products.find((x) => x.id === productId)!
            const q = createQuotation({
              customerId,
              projectName,
              validityDate: new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10),
              notes: 'Prepared by sales desk',
              items: [{
                productId,
                warehouseId: 'wh-tnk',
                qty: qtyVal,
                unitPrice: p.prices[priceType],
                priceType,
                gstPercent: p.gstPercent,
              }],
            })
            sendQuotation(q.id)
          }}
        >
          Create & send
        </Button>
      </Card>
      <Table
        headers={['Number', 'Customer', 'Status', 'Project', '']}
        rows={quotations.map((q) => [
          q.number,
          q.customerId,
          <StatusBadge status={q.status} />,
          q.projectName ?? '—',
          <Link className="text-brand" to={`/buyer/quotations/${q.id}`}>Open</Link>,
        ])}
      />
    </div>
  )
}

export function AdminProductsPage() {
  const products = useAppStore((s) => s.products)
  return (
    <div>
      <PageHeader title="Products" subtitle="Catalog admin" />
      <Table
        headers={['SKU', 'Name', 'Category', 'Brand', 'GST', 'Delivery']}
        rows={products.map((p) => [
          p.sku,
          p.name,
          p.category,
          brands.find((b) => b.id === p.brandId)?.name,
          `${p.gstPercent}%`,
          `${p.deliveryDays}d`,
        ])}
      />
    </div>
  )
}

export function AdminPricingPage() {
  const products = useAppStore((s) => s.products)
  const updatePrice = useAppStore((s) => s.updatePrice)
  const [productId, setProductId] = useState(products[0]?.id)
  const product = products.find((p) => p.id === productId)!
  const [draft, setDraft] = useState(product.prices)

  return (
    <div>
      <PageHeader title="Pricing matrix" subtitle="Retail · Dealer · Contractor · Wholesale · Project · Special" />
      <Card className="mb-4">
        <Field label="SKU">
          <Select
            value={productId}
            onChange={(e) => {
              setProductId(e.target.value)
              setDraft(products.find((p) => p.id === e.target.value)!.prices)
            }}
          >
            {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </Select>
        </Field>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {(Object.keys(draft) as PriceType[]).map((key) => (
            <Field key={key} label={key}>
              <Input
                type="number"
                value={draft[key]}
                onChange={(e) => setDraft({ ...draft, [key]: Number(e.target.value) })}
              />
            </Field>
          ))}
        </div>
        <Button
          className="mt-4"
          onClick={() => {
            ;(Object.keys(draft) as PriceType[]).forEach((k) => updatePrice(productId, k, draft[k]))
          }}
        >
          Save pricing & notify
        </Button>
      </Card>
      <Table
        headers={['Product', 'Retail', 'Dealer', 'Contractor', 'Wholesale', 'Project', 'Special']}
        rows={products.map((p) => [
          p.name,
          inr(p.prices.retail),
          inr(p.prices.dealer),
          inr(p.prices.contractor),
          inr(p.prices.wholesale),
          inr(p.prices.project),
          inr(p.prices.special),
        ])}
      />
    </div>
  )
}

export function AdminInventoryPage() {
  const inventory = useAppStore((s) => s.inventory)
  const products = useAppStore((s) => s.products)
  const movements = useAppStore((s) => s.stockMovements)
  return (
    <div>
      <PageHeader title="Inventory" subtitle="On-hand · reserved · incoming · damaged · history" />
      <Table
        headers={['Product', 'Warehouse', 'On hand', 'Reserved', 'Available', 'Incoming', 'Damaged', 'Barcode']}
        rows={inventory.map((i) => [
          products.find((p) => p.id === i.productId)?.name,
          warehouses.find((w) => w.id === i.warehouseId)?.name,
          i.onHand,
          i.reserved,
          i.onHand - i.reserved,
          i.incoming,
          i.damaged,
          i.barcode,
        ])}
      />
      <Card className="mt-4">
        <h3 className="mb-3 font-semibold">Stock history</h3>
        <Table
          headers={['When', 'Type', 'Product', 'Warehouse', 'Qty', 'Ref']}
          rows={movements.slice(0, 12).map((m) => [
            formatDate(m.at),
            m.type,
            products.find((p) => p.id === m.productId)?.name,
            warehouses.find((w) => w.id === m.warehouseId)?.name,
            m.qty,
            m.ref,
          ])}
        />
      </Card>
    </div>
  )
}

export function AdminPurchasePage() {
  const prs = useAppStore((s) => s.purchaseRequests)
  const pos = useAppStore((s) => s.purchaseOrders)
  const grns = useAppStore((s) => s.goodsReceipts)
  const products = useAppStore((s) => s.products)
  const createPR = useAppStore((s) => s.createPR)
  const convertPRtoPO = useAppStore((s) => s.convertPRtoPO)
  const postGRN = useAppStore((s) => s.postGRN)
  const user = useAppStore((s) => s.currentUser())!
  const [productId, setProductId] = useState('p-sq-1')
  const [warehouseId, setWarehouseId] = useState('wh-tnk')
  const [qtyVal, setQtyVal] = useState(100)

  return (
    <div>
      <PageHeader title="Purchase" subtitle="PR → PO → GRN → Inspection → Stock ↑" />
      <Card className="mb-4">
        <h3 className="font-semibold">Create purchase request</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-4">
          <Field label="Product">
            <Select value={productId} onChange={(e) => setProductId(e.target.value)}>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select>
          </Field>
          <Field label="Warehouse">
            <Select value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)}>
              {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
            </Select>
          </Field>
          <Field label="Qty"><Input type="number" value={qtyVal} onChange={(e) => setQtyVal(Number(e.target.value))} /></Field>
        </div>
        <Button className="mt-3" onClick={() => createPR({
          productId,
          warehouseId,
          qty: qtyVal,
          reason: 'Low stock / demand',
          createdBy: user.id,
        })}>Submit PR</Button>
      </Card>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <h3 className="mb-3 font-semibold">Purchase requests</h3>
          {prs.map((pr) => (
            <div key={pr.id} className="mb-3 rounded-lg border border-steel-100 p-3 text-sm">
              <div className="flex justify-between"><strong>{pr.number}</strong><StatusBadge status={pr.status} /></div>
              <div>{products.find((p) => p.id === pr.productId)?.name} × {pr.qty}</div>
              {pr.status === 'submitted' || pr.status === 'approved' ? (
                <Button className="mt-2" onClick={() => convertPRtoPO(pr.id, 'mfr-jsw', 700)}>Convert to PO</Button>
              ) : null}
            </div>
          ))}
        </Card>
        <Card>
          <h3 className="mb-3 font-semibold">Purchase orders</h3>
          {pos.map((po) => (
            <div key={po.id} className="mb-3 rounded-lg border border-steel-100 p-3 text-sm">
              <div className="flex justify-between"><strong>{po.number}</strong><StatusBadge status={po.status} /></div>
              <div>Supplier {po.supplierId}</div>
            </div>
          ))}
        </Card>
        <Card>
          <h3 className="mb-3 font-semibold">GRN / Inspection</h3>
          {grns.map((g) => (
            <div key={g.id} className="mb-3 rounded-lg border border-steel-100 p-3 text-sm">
              <div className="flex justify-between"><strong>{g.number}</strong><StatusBadge status={g.status} /></div>
              <div>Inspection: {g.inspection}</div>
              {g.status === 'draft' ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button onClick={() => postGRN(g.id, 'pass')}>Pass & post</Button>
                  <Button variant="ghost" onClick={() => postGRN(g.id, 'partial')}>Partial</Button>
                  <Button variant="danger" onClick={() => postGRN(g.id, 'fail')}>Fail</Button>
                </div>
              ) : null}
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

export function AdminVendorsPage() {
  return (
    <div>
      <PageHeader title="Vendor management" subtitle="Manufacturers · suppliers · pending deliveries · payments" />
      <Table
        headers={['Manufacturer', 'Brands', 'Status']}
        rows={manufacturers.map((m) => [m.name, m.brands.join(', '), <Badge tone="success">Active</Badge>])}
      />
    </div>
  )
}

export function AdminTransportPage() {
  const trips = useAppStore((s) => s.trips)
  const orders = useAppStore((s) => s.orders)
  return (
    <div>
      <PageHeader title="Transport" subtitle="Drivers · vehicles · trips · fuel · expense" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-3 font-semibold">Vehicles</h3>
          <Table headers={['Number', 'Type', 'Capacity']} rows={vehicles.map((v) => [v.number, v.type, `${v.capacityTons}T`])} />
        </Card>
        <Card>
          <h3 className="mb-3 font-semibold">Drivers</h3>
          <Table headers={['User', 'License', 'Vehicle']} rows={drivers.map((d) => [d.userId, d.licenseNo, d.vehicleId ?? '—'])} />
        </Card>
      </div>
      <Card className="mt-4">
        <h3 className="mb-3 font-semibold">Trips</h3>
        <Table
          headers={['Trip', 'Order', 'Status', 'POD']}
          rows={trips.map((t) => [
            t.id,
            orders.find((o) => o.id === t.orderId)?.number,
            <StatusBadge status={t.status} />,
            t.podSignature ? 'Signed' : '—',
          ])}
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-steel-50 p-3 text-sm">Fuel log (mock): TN76 AB 2145 · 42L · ₹3,780</div>
          <div className="rounded-lg bg-steel-50 p-3 text-sm">Trip expense (mock): Toll ₹450 · Loading ₹300</div>
        </div>
      </Card>
    </div>
  )
}

export function AdminFinancePage() {
  const invoices = useAppStore((s) => s.invoices)
  const payments = useAppStore((s) => s.payments)
  const ledger = useAppStore((s) => s.ledger)
  const recordPayment = useAppStore((s) => s.recordPayment)
  const [invoiceId, setInvoiceId] = useState(invoices[0]?.id ?? '')
  const inv = invoices.find((i) => i.id === invoiceId)

  return (
    <div>
      <PageHeader title="Finance" subtitle="Collections · credit · ledger · GST views" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Outstanding" value={inr(invoices.reduce((s, i) => s + i.amount + i.gstAmount - i.paidAmount, 0))} />
        <Stat label="Collected" value={inr(payments.reduce((s, p) => s + p.amount, 0))} />
        <Stat label="GST (invoices)" value={inr(invoices.reduce((s, i) => s + i.gstAmount, 0))} />
      </div>
      <Card className="mt-4">
        <h3 className="font-semibold">Record collection</h3>
        <div className="mt-3 flex flex-wrap gap-3">
          <Select value={invoiceId} onChange={(e) => setInvoiceId(e.target.value)}>
            {invoices.map((i) => <option key={i.id} value={i.id}>{i.number}</option>)}
          </Select>
          <Button
            onClick={() => {
              if (!inv) return
              recordPayment({
                customerId: inv.customerId,
                invoiceId: inv.id,
                amount: 5000,
                method: 'bank',
                note: 'Admin collection',
              })
            }}
          >
            Collect ₹5,000
          </Button>
        </div>
      </Card>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Table headers={['Invoice', 'Customer', 'Due', 'Balance', 'Status']} rows={invoices.map((i) => [i.number, i.customerId, i.dueDate, inr(i.amount + i.gstAmount - i.paidAmount), <StatusBadge status={i.status} />])} />
        <Table headers={['Ledger', 'Type', 'Amount', 'Note']} rows={ledger.slice(0, 10).map((l) => [l.ref, l.type, inr(l.amount), l.note])} />
      </div>
    </div>
  )
}

export function AdminCrmPage() {
  const users = useAppStore((s) => s.users.filter((u) => ['dealer', 'contractor', 'retail'].includes(u.role)))
  const activities = useAppStore((s) => s.crmActivities)
  const addCrmActivity = useAppStore((s) => s.addCrmActivity)
  const user = useAppStore((s) => s.currentUser())!
  const [customerId, setCustomerId] = useState(users[0]?.id)
  const [summary, setSummary] = useState('')

  return (
    <div>
      <PageHeader title="CRM" subtitle="Customers · calls · visits · credit · reminders · feedback" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-3 font-semibold">Customers</h3>
          <Table
            headers={['Company', 'Role', 'City', 'Credit used']}
            rows={users.map((u) => [u.companyName, roleLabels[u.role], u.city, inr(u.creditUsed)])}
          />
        </Card>
        <Card>
          <h3 className="font-semibold">Log activity</h3>
          <div className="mt-3 space-y-3">
            <Field label="Customer">
              <Select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
                {users.map((u) => <option key={u.id} value={u.id}>{u.companyName}</option>)}
              </Select>
            </Field>
            <Field label="Summary"><TextArea value={summary} onChange={(e) => setSummary(e.target.value)} /></Field>
            <Button onClick={() => { addCrmActivity({ customerId, type: 'call', summary, createdBy: user.id }); setSummary('') }}>Save call</Button>
          </div>
          <div className="mt-4 space-y-2">
            {activities.slice(0, 8).map((a) => (
              <div key={a.id} className="rounded-lg bg-steel-50 px-3 py-2 text-sm">
                <div className="font-medium">{a.type} · {a.customerId}</div>
                <div className="text-steel-600">{a.summary}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export function AdminReportsPage() {
  const orders = useAppStore((s) => s.orders)
  const products = useAppStore((s) => s.products)
  const inventory = useAppStore((s) => s.inventory)
  const invoices = useAppStore((s) => s.invoices)
  const salesByProduct = products.map((p) => ({
    name: p.name.slice(0, 12),
    qty: orders.reduce((s, o) => s + o.items.filter((i) => i.productId === p.id).reduce((x, i) => x + i.qty, 0), 0),
  })).filter((x) => x.qty > 0)

  return (
    <div>
      <PageHeader title="Reports" subtitle="Daily/monthly sales · product · warehouse · profit · purchase · GST · outstanding · top customers · dead stock" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="h-80">
          <h3 className="mb-3 font-semibold">Product-wise sales qty</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={salesByProduct}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="qty" fill="#c45c26" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 className="mb-3 font-semibold">Report snapshots</h3>
          <Table
            headers={['Report', 'Value']}
            rows={[
              ['Daily sales (demo book)', inr(orderTotals(orders.flatMap((o) => o.items)).total)],
              ['Outstanding', inr(invoices.reduce((s, i) => s + i.amount + i.gstAmount - i.paidAmount, 0))],
              ['GST liability (demo)', inr(invoices.reduce((s, i) => s + i.gstAmount, 0))],
              ['Dead stock rows (<20 avail)', String(inventory.filter((i) => i.onHand - i.reserved < 20).length)],
              ['Warehouse count', String(warehouses.length)],
            ]}
          />
        </Card>
      </div>
    </div>
  )
}

export function AdminAnalyticsPage() {
  const data = [
    { month: 'Mar', revenue: 12, customers: 40 },
    { month: 'Apr', revenue: 15, customers: 48 },
    { month: 'May', revenue: 18, customers: 55 },
    { month: 'Jun', revenue: 22, customers: 61 },
    { month: 'Jul', revenue: 27, customers: 70 },
    { month: 'Aug', revenue: 31, customers: 78 },
  ]
  return (
    <div>
      <PageHeader title="Analytics" subtitle="Revenue · profit · sales · cities · growth · trends · fast movers · dead stock" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Revenue index" value="₹3.1Cr" hint="Prototype figure" />
        <Stat label="Customer growth" value="+18%" />
        <Stat label="Top city" value="Tenkasi" />
        <Stat label="Fast mover" value="Square Pipe 1″" />
      </div>
      <Card className="mt-4 h-80">
        <h3 className="mb-3 font-semibold">Order / revenue trend</h3>
        <ResponsiveContainer width="100%" height="85%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="revenue" stroke="#c45c26" fill="#e8a06a55" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}

export function AdminAiPage() {
  const inventory = useAppStore((s) => s.inventory)
  const products = useAppStore((s) => s.products)
  const createPR = useAppStore((s) => s.createPR)
  const user = useAppStore((s) => s.currentUser())!
  const suggestions = inventory
    .filter((i) => i.onHand - i.reserved < 60)
    .slice(0, 5)
    .map((i) => ({
      product: products.find((p) => p.id === i.productId)?.name,
      warehouse: warehouses.find((w) => w.id === i.warehouseId)?.name,
      productId: i.productId,
      warehouseId: i.warehouseId,
      suggestQty: 150,
    }))

  return (
    <div>
      <PageHeader title="AI insights" subtitle="Price prediction · demand forecast · bestseller · auto purchase (mock)" />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="font-semibold">Price prediction</h3>
          <p className="mt-2 text-sm text-steel-600">MS Square Pipe 1″ likely +2.4% next 14 days based on regional demand (mock).</p>
        </Card>
        <Card>
          <h3 className="font-semibold">Demand forecast</h3>
          <p className="mt-2 text-sm text-steel-600">Sankarankovil & Tenkasi show elevated TMT / angle demand this fortnight (mock).</p>
        </Card>
        <Card>
          <h3 className="font-semibold">Best seller prediction</h3>
          <p className="mt-2 text-sm text-steel-600">Square Pipe 1″ and Color Roofing expected to lead monsoon season.</p>
        </Card>
        <Card>
          <h3 className="font-semibold">Auto purchase suggestions</h3>
          <div className="mt-3 space-y-2">
            {suggestions.map((s) => (
              <div key={`${s.productId}-${s.warehouseId}`} className="flex items-center justify-between rounded-lg bg-steel-50 px-3 py-2 text-sm">
                <span>{s.product} · {s.warehouse} · buy {s.suggestQty}</span>
                <Button onClick={() => createPR({
                  productId: s.productId,
                  warehouseId: s.warehouseId,
                  qty: s.suggestQty,
                  reason: 'AI auto purchase suggestion',
                  createdBy: user.id,
                })}>Create PR</Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export function AdminEstimatorPage() {
  const estimatorBom = useAppStore((s) => s.estimatorBom)
  const products = useAppStore((s) => s.products)
  const inventory = useAppStore((s) => s.inventory)
  const createQuotation = useAppStore((s) => s.createQuotation)
  const sendQuotation = useAppStore((s) => s.sendQuotation)
  const [city, setCity] = useState('Sankarankovil')
  const [floors, setFloors] = useState(1)
  const [bom, setBom] = useState(estimatorBom('Sankarankovil', 1))

  return (
    <div>
      <PageHeader
        title="Construction procurement estimator"
        subtitle={`“I need steel for a G+${floors} house in ${city}.”`}
      />
      <Card className="mb-4">
        <div className="grid gap-3 md:grid-cols-3">
          <Field label="City"><Input value={city} onChange={(e) => setCity(e.target.value)} /></Field>
          <Field label="Floors (G+)">
            <Input type="number" min={0} value={floors} onChange={(e) => setFloors(Number(e.target.value))} />
          </Field>
          <div className="flex items-end">
            <Button onClick={() => setBom(estimatorBom(city, floors))}>Generate BOM</Button>
          </div>
        </div>
      </Card>
      <Table
        headers={['Suggested item', 'Qty', 'Reason', 'Stock check']}
        rows={bom.map((b) => {
          const p = products.find((x) => x.id === b.productId)!
          const avail = inventory.filter((i) => i.productId === b.productId).reduce((s, i) => s + i.onHand - i.reserved, 0)
          return [p.name, b.qty, b.reason, avail >= b.qty ? <Badge tone="success">In stock</Badge> : <Badge tone="warning">Partial / transfer</Badge>]
        })}
      />
      <Button
        className="mt-4"
        onClick={() => {
          const q = createQuotation({
            customerId: 'u-contractor',
            projectName: `G+${floors} ${city}`,
            validityDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
            notes: 'Auto-generated from construction estimator. Attach fabrication for gates/railings if needed.',
            items: bom.map((b) => {
              const p = products.find((x) => x.id === b.productId)!
              return {
                productId: b.productId,
                warehouseId: 'wh-tnk',
                qty: b.qty,
                unitPrice: p.prices.project,
                priceType: 'project' as PriceType,
                gstPercent: p.gstPercent,
              }
            }),
          })
          sendQuotation(q.id)
        }}
      >
        Generate quotation + stock-aware draft
      </Button>
      <Card className="mt-4">
        <h3 className="font-semibold">Next OS steps (vision)</h3>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-steel-600">
          <li>Reserve inventory against estimator quotation</li>
          <li>Schedule delivery to site</li>
          <li>Connect fabrication partners for gates / railings</li>
        </ol>
      </Card>
    </div>
  )
}

export function AdminHrPage() {
  const employees = useAppStore((s) => s.employees)
  const attendance = useAppStore((s) => s.attendance)
  return (
    <div>
      <PageHeader title="HR" subtitle="Employees · attendance · salary · roles · leave" />
      <Table
        headers={['Name', 'Role', 'Phone', 'Salary', 'Status']}
        rows={employees.map((e) => [e.name, e.roleLabel, e.phone, inr(e.salary), <StatusBadge status={e.status} />])}
      />
      <Card className="mt-4">
        <h3 className="mb-3 font-semibold">Attendance today</h3>
        <Table
          headers={['Employee', 'Status']}
          rows={attendance.map((a) => [employees.find((e) => e.id === a.employeeId)?.name, <StatusBadge status={a.status} />])}
        />
      </Card>
    </div>
  )
}

export function AdminUsersPage() {
  const users = useAppStore((s) => s.users)
  return (
    <div>
      <PageHeader title="Users & roles" />
      <Table
        headers={['Name', 'Company', 'Role', 'City', 'Verification']}
        rows={users.map((u) => [u.name, u.companyName, roleLabels[u.role], u.city, <StatusBadge status={u.verificationStatus} />])}
      />
    </div>
  )
}

export function AdminSettingsPage() {
  const company = useAppStore((s) => s.company)
  const updateCompany = useAppStore((s) => s.updateCompany)
  const [draft, setDraft] = useState(company)
  return (
    <div>
      <PageHeader title="Settings" subtitle="GST · Bank · Roles · Permissions · Taxes · Theme · Language · Company" />
      <Card>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Company"><Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
          <Field label="GSTIN"><Input value={draft.gstin} onChange={(e) => setDraft({ ...draft, gstin: e.target.value })} /></Field>
          <Field label="Bank"><Input value={draft.bankName} onChange={(e) => setDraft({ ...draft, bankName: e.target.value })} /></Field>
          <Field label="Account"><Input value={draft.bankAccount} onChange={(e) => setDraft({ ...draft, bankAccount: e.target.value })} /></Field>
          <Field label="IFSC"><Input value={draft.ifsc} onChange={(e) => setDraft({ ...draft, ifsc: e.target.value })} /></Field>
          <Field label="Default tax %"><Input type="number" value={draft.taxPercentDefault} onChange={(e) => setDraft({ ...draft, taxPercentDefault: Number(e.target.value) })} /></Field>
          <Field label="Language">
            <Select value={draft.language} onChange={(e) => setDraft({ ...draft, language: e.target.value as 'en' | 'ta' })}>
              <option value="en">English</option>
              <option value="ta">Tamil</option>
            </Select>
          </Field>
        </div>
        <Button className="mt-4" onClick={() => updateCompany(draft)}>Save settings</Button>
      </Card>
      <Card className="mt-4">
        <h3 className="font-semibold">Roles & permissions</h3>
        <p className="mt-2 text-sm text-steel-600">Prototype uses the Part B permission matrix in code (`src/lib/permissions.ts`). Super Admin / Master Trader can access settings; other roles are gated by workspace routes.</p>
      </Card>
    </div>
  )
}
