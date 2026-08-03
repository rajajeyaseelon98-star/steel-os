import { Navigate, Route, Routes } from 'react-router-dom'
import {
  AdminLayout,
  AuthLayout,
  BuyerLayout,
  RoleHomeRedirect,
  RoleWorkspaceShell,
} from '@/layouts/Shell'
import { useAppStore } from '@/store/appStore'
import {
  BusinessVerifyPage,
  ForgotPage,
  GstVerifyPage,
  KycPage,
  LoginPage,
  OtpPage,
  RegisterPage,
  ResetPage,
  RoleSelectPage,
  VerifyPendingPage,
  WelcomePage,
} from '@/pages/auth/AuthPages'
import {
  BuyerHome,
  CatalogPage,
  OrderDetailPage,
  OrdersPage,
  ProductDetailPage,
  ProfilePage,
  QuotationDetailPage,
  QuotationsPage,
  WishlistPage,
} from '@/pages/buyer/BuyerPages'
import {
  AdminDashboard,
  AdminOrdersPage,
  AdminProductsPage,
  AdminQuotationsPage,
} from '@/pages/admin/AdminPages'
import { NotificationsPage, SupportPage } from '@/pages/ops/OpsPages'
import {
  AdminOrderDetailPage,
  AdminWishlistsPage,
  GlobalSearchPage,
  InvoiceDetailPage,
  QuotationTemplatesPage,
} from '@/pages/gaps/GapPages'
import { workspaceForRole } from '@/lib/permissions'

function Guard({
  allow,
  children,
}: {
  allow: Array<ReturnType<typeof workspaceForRole>>
  children: React.ReactNode
}) {
  const user = useAppStore((s) => s.currentUser())
  if (!user) return <Navigate to="/login" replace />
  const ws = workspaceForRole(user.role)
  if (!allow.includes(ws)) return <Navigate to={`/${ws}`} replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/forgot" element={<ForgotPage />} />
        <Route path="/reset" element={<ResetPage />} />
        <Route path="/role" element={<RoleSelectPage />} />
        <Route path="/verify/gst" element={<GstVerifyPage />} />
        <Route path="/verify/business" element={<BusinessVerifyPage />} />
        <Route path="/verify/kyc" element={<KycPage />} />
        <Route path="/verify/pending" element={<VerifyPendingPage />} />
      </Route>

      <Route path="/" element={<RoleHomeRedirect />} />

      <Route
        path="/buyer"
        element={
          <Guard allow={['buyer', 'admin']}>
            <BuyerLayout />
          </Guard>
        }
      >
        <Route index element={<BuyerHome />} />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="quotations" element={<QuotationsPage />} />
        <Route path="quotations/:id" element={<QuotationDetailPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:id" element={<OrderDetailPage />} />
        <Route path="invoices/:id" element={<InvoiceDetailPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <Guard allow={['admin']}>
            <AdminLayout />
          </Guard>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="orders/:id" element={<AdminOrderDetailPage />} />
        <Route path="quotations" element={<AdminQuotationsPage />} />
        <Route path="quotation-templates" element={<QuotationTemplatesPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="wishlists" element={<AdminWishlistsPage />} />
      </Route>

      <Route element={<RoleWorkspaceShell />}>
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/search" element={<GlobalSearchPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
