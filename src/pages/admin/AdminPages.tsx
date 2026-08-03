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
  OverviewStrip,
  PageHeader,
  Select,
  Stat,
  StatusBadge,
  Table,
  TextArea,
} from '@/components/ui'
import { brands, categories, manufacturers, vehicles, warehouses, drivers } from '@/mock/data'
import { useAppStore } from '@/store/appStore'
import { useExtrasStore } from '@/store/extrasStore'
import { formatDate, inr, qty } from '@/lib/format'
import { orderTotals } from '@/lib/pricing'
import { can, capabilityLabels, permissionMatrix, roleLabels } from '@/lib/permissions'
import type { Capability } from '@/lib/permissions'
import type { PriceType, Product, Role } from '@/types'

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
    <div className="flex flex-col gap-4">
      <PageHeader title="Operations dashboard" subtitle="Today’s sales · orders · inventory · dispatch · collections · outstanding" />
      <OverviewStrip>
        <Stat label="Today's Sales (demo)" value={inr(todaySales)} />
        <Stat label="Orders" value={String(orders.length)} hint={`${pending.length} pending approval`} />
        <Stat label="Outstanding" value={inr(outstanding)} />
        <Stat label="Low stock SKUs" value={String(lowStock.length)} />
        <Stat label="Inventory rows" value={String(inventory.length)} />
        <Stat label="Today's dispatch" value={String(trips.filter((t) => t.status !== 'delivered').length)} />
        <Stat label="Collections due" value={inr(outstanding * 0.35)} />
        <Stat label="Warehouses" value={String(warehouses.length)} />
      </OverviewStrip>
      <div className="grid gap-4 lg:grid-cols-2">
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
  const users = useAppStore((s) => s.users)
  const approveOrder = useAppStore((s) => s.approveOrder)
  const cancelOrder = useAppStore((s) => s.cancelOrder)
  const dispatchOrder = useAppStore((s) => s.dispatchOrder)
  const markOrderDelivered = useAppStore((s) => s.markOrderDelivered)

  return (
    <div>
      <PageHeader title="Orders" subtitle="Accept · reject · dispatch · mark delivered" />
      <Table
        headers={['Order', 'Customer', 'Status', 'Total', 'Actions']}
        rows={orders.map((o) => [
          <Link className="text-brand" to={`/admin/orders/${o.id}`}>{o.number}</Link>,
          users.find((u) => u.id === o.customerId)?.name ?? o.customerId,
          <StatusBadge status={o.status} />,
          inr(orderTotals(o.items).total),
          <div className="flex flex-wrap gap-2">
            {o.status === 'pending_approval' ? (
              <>
                <Button onClick={() => approveOrder(o.id)}>Accept</Button>
                <Button variant="danger" onClick={() => cancelOrder(o.id)}>Reject</Button>
              </>
            ) : null}
            {o.status === 'approved' || o.status === 'partially_dispatched' ? (
              <Button variant="secondary" onClick={() => dispatchOrder(o.id, 'v-1', 'drv-1')}>Dispatch</Button>
            ) : null}
            {['dispatched', 'partially_dispatched'].includes(o.status) ? (
              <Button onClick={() => markOrderDelivered(o.id)}>Mark delivered</Button>
            ) : null}
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
  const [customerId, setCustomerId] = useState('u-retail')
  const [productId, setProductId] = useState('p-sq-1')
  const [qtyVal, setQtyVal] = useState(100)
  const [priceType, setPriceType] = useState<PriceType>('retail')
  const [projectName, setProjectName] = useState('Retail order')

  return (
    <div>
      <PageHeader title="Sales quotations" />
      <Card className="mb-4">
        <h3 className="font-semibold">Prepare quotation</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <Field label="Customer">
            <Select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
          {users.filter((u) => u.role === 'retail').map((u) => (
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
  const upsertProduct = useAppStore((s) => s.upsertProduct)
  const deleteProduct = useAppStore((s) => s.deleteProduct)
  const [editing, setEditing] = useState<string | null>(null)
  const makeBlank = (): Product => ({
    id: `p-${Date.now().toString(36)}`,
    sku: `SKU-${Date.now().toString(36).slice(-4).toUpperCase()}`,
    name: '',
    category: 'square-pipe',
    brandId: brands[0]?.id ?? 'brand-jsw',
    manufacturerId: manufacturers[0]?.id ?? 'mfr-jsw',
    images: ['📦'],
    weightKg: 1,
    thicknessMm: 1,
    lengthFt: 20,
    description: '',
    gstPercent: 18,
    deliveryDays: 2,
    prices: { retail: 100, dealer: 95, contractor: 97, wholesale: 90, project: 88, special: 85 },
  })
  const [form, setForm] = useState<Product>(makeBlank())

  const startCreate = () => {
    setEditing('new')
    setForm(makeBlank())
  }

  const startEdit = (id: string) => {
    const p = products.find((x) => x.id === id)
    if (!p) return
    setEditing(id)
    setForm({ ...p })
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Catalog"
        subtitle="Create · edit · delete products"
        actions={<Button onClick={startCreate}>Add product</Button>}
      />
      {editing ? (
        <Card>
          <h3 className="font-semibold">{editing === 'new' ? 'New product' : 'Edit product'}</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <Field label="SKU"><Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} /></Field>
            <Field label="Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Category">
              <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Product['category'] })}>
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </Select>
            </Field>
            <Field label="Retail price">
              <Input type="number" value={form.prices.retail} onChange={(e) => setForm({ ...form, prices: { ...form.prices, retail: Number(e.target.value) } })} />
            </Field>
            <Field label="GST %"><Input type="number" value={form.gstPercent} onChange={(e) => setForm({ ...form, gstPercent: Number(e.target.value) })} /></Field>
            <Field label="Delivery days"><Input type="number" value={form.deliveryDays} onChange={(e) => setForm({ ...form, deliveryDays: Number(e.target.value) })} /></Field>
          </div>
          <Field label="Description"><TextArea className="mt-3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          <div className="mt-4 flex gap-2">
            <Button
              onClick={() => {
                if (!form.sku || !form.name) return
                upsertProduct(form)
                setEditing(null)
              }}
            >
              Save
            </Button>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
          </div>
        </Card>
      ) : null}
      <Table
        headers={['SKU', 'Name', 'Category', 'Retail', 'GST', '']}
        rows={products.map((p) => [
          p.sku,
          p.name,
          p.category,
          inr(p.prices.retail),
          `${p.gstPercent}%`,
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => startEdit(p.id)}>Edit</Button>
            <Button variant="danger" onClick={() => deleteProduct(p.id)}>Delete</Button>
          </div>,
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
  const suppliers = useExtrasStore((s) => s.suppliers)
  const pos = useAppStore((s) => s.purchaseOrders)
  const addSupplier = useExtrasStore((s) => s.addSupplier)
  const updateSupplier = useExtrasStore((s) => s.updateSupplier)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('Tenkasi')

  return (
    <div>
      <PageHeader title="Vendor management" subtitle="Manufacturers · suppliers · pending POs · outstanding" />
      <Card className="mb-4">
        <h3 className="font-semibold">Add supplier</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-4">
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
          <Button onClick={() => {
            if (!name) return
            addSupplier({ name, phone, city, type: 'local_supplier', outstanding: 0 })
            setName(''); setPhone('')
          }}>Add</Button>
        </div>
      </Card>
      <Table
        headers={['Vendor', 'Type', 'City', 'Phone', 'Outstanding', 'Open POs', '']}
        rows={suppliers.map((s) => [
          s.name,
          s.type,
          s.city,
          s.phone,
          inr(s.outstanding),
          pos.filter((p) => p.supplierId === s.id || (s.id.startsWith('sup-') && p.supplierId.includes(s.id.replace('sup-', 'mfr-')))).length,
          <Button variant="ghost" onClick={() => updateSupplier(s.id, { outstanding: Math.max(0, s.outstanding - 5000) })}>Record ₹5k pay</Button>,
        ])}
      />
      <Card className="mt-4">
        <h3 className="mb-2 font-semibold">Manufacturer directory</h3>
        <Table headers={['Manufacturer', 'Brands']} rows={manufacturers.map((m) => [m.name, m.brands.join(', ')])} />
      </Card>
    </div>
  )
}

export function AdminTransportPage() {
  const trips = useAppStore((s) => s.trips)
  const orders = useAppStore((s) => s.orders)
  const fuelLogs = useExtrasStore((s) => s.fuelLogs)
  const tripExpenses = useExtrasStore((s) => s.tripExpenses)
  const addFuel = useExtrasStore((s) => s.addFuel)
  const addExpense = useExtrasStore((s) => s.addExpense)
  const [liters, setLiters] = useState(40)
  const [fuelAmt, setFuelAmt] = useState(3600)
  const [expAmt, setExpAmt] = useState(200)

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
      </Card>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="font-semibold">Fuel logs</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <Input type="number" className="w-24" value={liters} onChange={(e) => setLiters(Number(e.target.value))} />
            <Input type="number" className="w-28" value={fuelAmt} onChange={(e) => setFuelAmt(Number(e.target.value))} />
            <Button onClick={() => addFuel({ vehicleId: 'v-1', liters, amount: fuelAmt, at: new Date().toISOString() })}>Add fuel</Button>
          </div>
          <div className="mt-3">
            <Table headers={['Vehicle', 'Liters', 'Amount', 'When']} rows={fuelLogs.map((f) => [f.vehicleId, f.liters, inr(f.amount), formatDate(f.at)])} />
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold">Trip expenses</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <Input type="number" className="w-28" value={expAmt} onChange={(e) => setExpAmt(Number(e.target.value))} />
            <Button onClick={() => addExpense({ vehicleId: 'v-1', category: 'other', amount: expAmt, at: new Date().toISOString() })}>Add expense</Button>
          </div>
          <Table headers={['Vehicle', 'Category', 'Amount', 'When']} rows={tripExpenses.map((e) => [e.vehicleId, e.category, inr(e.amount), formatDate(e.at)])} />
        </Card>
      </div>
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
    <div className="flex flex-col gap-4">
      <PageHeader title="Finance" subtitle="Collections · credit · ledger · GST views" />
      <OverviewStrip>
        <Stat label="Outstanding" value={inr(invoices.reduce((s, i) => s + i.amount + i.gstAmount - i.paidAmount, 0))} />
        <Stat label="Collected" value={inr(payments.reduce((s, p) => s + p.amount, 0))} />
        <Stat label="GST (invoices)" value={inr(invoices.reduce((s, i) => s + i.gstAmount, 0))} />
      </OverviewStrip>
      <Card>
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
  const reminders = activities.filter((a) => a.type === 'reminder')

  return (
    <div>
      <PageHeader title="CRM" subtitle="Customers · calls · visits · credit · reminders · feedback" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-3 font-semibold">Customers</h3>
          <Table
            headers={['Company', 'Role', 'City', 'Credit used', '']}
            rows={users.map((u) => [
              u.companyName,
              roleLabels[u.role],
              u.city,
              inr(u.creditUsed),
              <Link className="text-brand" to="/admin/wishlists">Wishlists</Link>,
            ])}
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
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => { addCrmActivity({ customerId, type: 'call', summary, createdBy: user.id }); setSummary('') }}>Save call</Button>
              <Button variant="secondary" onClick={() => { addCrmActivity({ customerId, type: 'reminder', summary: summary || 'Follow up outstanding', createdBy: user.id }); setSummary('') }}>Set reminder</Button>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-semibold">Open reminders</h4>
            {reminders.slice(0, 6).map((a) => (
              <div key={a.id} className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm">{a.customerId}: {a.summary}</div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export function AdminReportsPage() {
  const reports = [
    { slug: 'daily-sales', name: 'Daily / Monthly Sales' },
    { slug: 'product-wise', name: 'Product Wise' },
    { slug: 'warehouse-wise', name: 'Warehouse Wise' },
    { slug: 'gst', name: 'GST' },
    { slug: 'outstanding', name: 'Outstanding' },
    { slug: 'top-customers', name: 'Top Customers' },
    { slug: 'dead-stock', name: 'Dead Stock' },
    { slug: 'purchase', name: 'Purchase' },
  ]
  return (
    <div>
      <PageHeader title="Reports" subtitle="Open each report page" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {reports.map((r) => (
          <Link key={r.slug} to={`/admin/reports/${r.slug}`} className="rounded-xl border border-steel-200 bg-white p-4 shadow-sm hover:border-brand">
            <div className="font-semibold text-steel-900">{r.name}</div>
            <div className="mt-1 text-xs text-steel-500">View report →</div>
          </Link>
        ))}
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
    <div className="flex flex-col gap-4">
      <PageHeader title="Analytics" subtitle="Revenue · profit · sales · cities · growth · trends · fast movers · dead stock" />
      <OverviewStrip>
        <Stat label="Revenue index" value="₹3.1Cr" hint="Prototype figure" />
        <Stat label="Customer growth" value="+18%" />
        <Stat label="Top city" value="Tenkasi" />
        <Stat label="Fast mover" value="Square Pipe 1″" />
      </OverviewStrip>
      <Card className="h-80">
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
  const reserveEstimatorBom = useAppStore((s) => s.reserveEstimatorBom)
  const createFabRequest = useAppStore((s) => s.createFabRequest)
  const products = useAppStore((s) => s.products)
  const inventory = useAppStore((s) => s.inventory)
  const createQuotation = useAppStore((s) => s.createQuotation)
  const sendQuotation = useAppStore((s) => s.sendQuotation)
  const saveEstimatorDraft = useExtrasStore((s) => s.saveEstimatorDraft)
  const updateEstimatorDraft = useExtrasStore((s) => s.updateEstimatorDraft)
  const drafts = useExtrasStore((s) => s.estimatorDrafts)
  const [city, setCity] = useState('Sankarankovil')
  const [floors, setFloors] = useState(1)
  const [bom, setBom] = useState(estimatorBom('Sankarankovil', 1))
  const [draftId, setDraftId] = useState<string | null>(null)
  const [deliveryDate, setDeliveryDate] = useState(new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10))

  return (
    <div>
      <PageHeader
        title="Construction procurement estimator"
        subtitle={`“I need steel for a G+${floors} house in ${city}.”`}
      />
      <Card className="mb-4">
        <div className="grid gap-3 md:grid-cols-4">
          <Field label="City"><Input value={city} onChange={(e) => setCity(e.target.value)} /></Field>
          <Field label="Floors (G+)">
            <Input type="number" min={0} value={floors} onChange={(e) => setFloors(Number(e.target.value))} />
          </Field>
          <Field label="Delivery date"><Input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} /></Field>
          <div className="flex items-end">
            <Button onClick={() => {
              const next = estimatorBom(city, floors)
              setBom(next)
              const d = saveEstimatorDraft({ city, floors, customerId: 'u-contractor', bom: next, reserved: false, deliveryDate })
              setDraftId(d.id)
            }}>Generate BOM</Button>
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
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          onClick={() => {
            const q = createQuotation({
              customerId: 'u-contractor',
              projectName: `G+${floors} ${city}`,
              validityDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
              notes: 'Auto-generated from construction estimator.',
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
            if (draftId) updateEstimatorDraft(draftId, { quotationId: q.id })
          }}
        >
          Generate quotation
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            reserveEstimatorBom(bom, 'wh-tnk')
            if (draftId) updateEstimatorDraft(draftId, { reserved: true })
          }}
        >
          Reserve inventory
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            if (draftId) updateEstimatorDraft(draftId, { deliveryDate })
          }}
        >
          Schedule delivery
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            createFabRequest({
              customerId: 'u-contractor',
              type: 'gate',
              dimensions: 'Site gate for G+ house',
              photos: ['estimator'],
              location: `${city} site`,
              city,
              notes: 'Attached from estimator',
            })
            if (draftId) updateEstimatorDraft(draftId, { fabricationAttached: true })
          }}
        >
          Attach fabrication (gate/railings)
        </Button>
      </div>
      {drafts[0] ? (
        <Card className="mt-4 text-sm">
          Latest draft: {drafts[0].city} G+{drafts[0].floors} · reserved {String(!!drafts[0].reserved)} · delivery {drafts[0].deliveryDate ?? '—'} · fab {String(!!drafts[0].fabricationAttached)} · quote {drafts[0].quotationId ?? '—'}
        </Card>
      ) : null}
    </div>
  )
}

export function AdminHrPage() {
  const employees = useAppStore((s) => s.employees)
  const attendance = useAppStore((s) => s.attendance)
  const leaves = useExtrasStore((s) => s.leaves)
  const salaryPayments = useExtrasStore((s) => s.salaryPayments)
  const addLeave = useExtrasStore((s) => s.addLeave)
  const setLeaveStatus = useExtrasStore((s) => s.setLeaveStatus)
  const paySalary = useExtrasStore((s) => s.paySalary)
  const [empId, setEmpId] = useState(employees[0]?.id ?? '')

  return (
    <div>
      <PageHeader title="HR" subtitle="Employees · attendance · salary · leave" />
      <Table
        headers={['Name', 'Role', 'Phone', 'Salary', 'Status']}
        rows={employees.map((e) => [e.name, e.roleLabel, e.phone, inr(e.salary), <StatusBadge status={e.status} />])}
      />
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <h3 className="mb-3 font-semibold">Attendance today</h3>
          <Table headers={['Employee', 'Status']} rows={attendance.map((a) => [employees.find((e) => e.id === a.employeeId)?.name, <StatusBadge status={a.status} />])} />
        </Card>
        <Card>
          <h3 className="font-semibold">Leave workflow</h3>
          <div className="mt-3 space-y-2">
            <Select value={empId} onChange={(e) => setEmpId(e.target.value)}>
              {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
            </Select>
            <Button onClick={() => addLeave({ employeeId: empId, from: '2026-08-10', to: '2026-08-11', reason: 'Personal' })}>Request leave</Button>
          </div>
          <div className="mt-3 space-y-2">
            {leaves.map((l) => (
              <div key={l.id} className="rounded-lg bg-steel-50 p-2 text-sm">
                {employees.find((e) => e.id === l.employeeId)?.name} · {l.from}→{l.to} · <StatusBadge status={l.status} />
                {l.status === 'pending' ? (
                  <div className="mt-2 flex gap-2">
                    <Button onClick={() => setLeaveStatus(l.id, 'approved')}>Approve</Button>
                    <Button variant="danger" onClick={() => setLeaveStatus(l.id, 'rejected')}>Reject</Button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold">Salary payments</h3>
          <Button className="mt-3" onClick={() => {
            const e = employees.find((x) => x.id === empId)
            if (e) paySalary(e.id, '2026-08', e.salary)
          }}>Pay selected employee</Button>
          <Table headers={['Employee', 'Month', 'Amount', 'Status']} rows={salaryPayments.map((s) => [employees.find((e) => e.id === s.employeeId)?.name, s.month, inr(s.amount), s.status])} />
        </Card>
      </div>
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
  const user = useAppStore((s) => s.currentUser())!
  const [draft, setDraft] = useState(company)
  const roles: Role[] = ['super_admin', 'master_trader', 'manufacturer', 'warehouse_manager', 'fabricator', 'dealer', 'contractor', 'driver', 'retail']
  const caps = Object.keys(permissionMatrix) as Capability[]

  if (!can(user.role, 'settings')) {
    return <Empty title="Settings locked" body="Only Super Admin / Master Trader" />
  }

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
      <Card className="mt-4 overflow-x-auto">
        <h3 className="mb-3 font-semibold">Interactive permissions matrix</h3>
        <table className="min-w-full text-left text-xs">
          <thead>
            <tr className="bg-steel-50">
              <th className="p-2">Capability</th>
              {roles.map((r) => <th key={r} className="p-2">{roleLabels[r]}</th>)}
            </tr>
          </thead>
          <tbody>
            {caps.map((cap) => (
              <tr key={cap} className="border-t border-steel-100">
                <td className="p-2 font-medium">{capabilityLabels[cap]}</td>
                {roles.map((r) => (
                  <td key={r} className="p-2 text-center">{can(r, cap) ? '✅' : '—'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
