import { Navigate, Route, Routes } from 'react-router-dom'
import {
  AdminLayout,
  AuthLayout,
  BuyerLayout,
  DriverLayout,
  FabricatorLayout,
  RoleHomeRedirect,
  WarehouseLayout,
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
  BuyerPaymentsPage,
  CatalogPage,
  FabricationBuyerPage,
  OrderDetailPage,
  OrdersPage,
  ProductDetailPage,
  ProfilePage,
  QuotationDetailPage,
  QuotationsPage,
  WishlistPage,
} from '@/pages/buyer/BuyerPages'
import {
  AdminAiPage,
  AdminAnalyticsPage,
  AdminCrmPage,
  AdminDashboard,
  AdminEstimatorPage,
  AdminFinancePage,
  AdminHrPage,
  AdminInventoryPage,
  AdminOrdersPage,
  AdminPricingPage,
  AdminProductsPage,
  AdminPurchasePage,
  AdminQuotationsPage,
  AdminReportsPage,
  AdminSettingsPage,
  AdminTransportPage,
  AdminUsersPage,
  AdminVendorsPage,
} from '@/pages/admin/AdminPages'
import {
  DriverHistoryPage,
  DriverHome,
  DriverTripDetail,
  FabricatorHome,
  FabricatorJobsPage,
  FabricatorLeadDetail,
  FabricatorPaymentsPage,
  FabricatorQuotesPage,
  FabricatorReviewsPage,
  NotificationsPage,
  SupportPage,
  WarehouseDispatchPage,
  WarehouseHome,
  WarehouseReceivingPage,
  WarehouseReportsPage,
  WarehouseScanPage,
  WarehouseStockPage,
  WarehouseTransfersPage,
} from '@/pages/ops/OpsPages'
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

function Authed({ children }: { children: React.ReactNode }) {
  const user = useAppStore((s) => s.currentUser())
  if (!user) return <Navigate to="/login" replace />
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
        <Route path="payments" element={<BuyerPaymentsPage />} />
        <Route path="fabrication" element={<FabricationBuyerPage />} />
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
        <Route path="quotations" element={<AdminQuotationsPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="pricing" element={<AdminPricingPage />} />
        <Route path="inventory" element={<AdminInventoryPage />} />
        <Route path="purchase" element={<AdminPurchasePage />} />
        <Route path="vendors" element={<AdminVendorsPage />} />
        <Route path="transport" element={<AdminTransportPage />} />
        <Route path="finance" element={<AdminFinancePage />} />
        <Route path="crm" element={<AdminCrmPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="ai" element={<AdminAiPage />} />
        <Route path="estimator" element={<AdminEstimatorPage />} />
        <Route path="hr" element={<AdminHrPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      <Route
        path="/warehouse"
        element={
          <Guard allow={['warehouse', 'admin']}>
            <WarehouseLayout />
          </Guard>
        }
      >
        <Route index element={<WarehouseHome />} />
        <Route path="receiving" element={<WarehouseReceivingPage />} />
        <Route path="stock" element={<WarehouseStockPage />} />
        <Route path="dispatch" element={<WarehouseDispatchPage />} />
        <Route path="transfers" element={<WarehouseTransfersPage />} />
        <Route path="scan" element={<WarehouseScanPage />} />
        <Route path="reports" element={<WarehouseReportsPage />} />
      </Route>

      <Route
        path="/fabricator"
        element={
          <Guard allow={['fabricator', 'admin']}>
            <FabricatorLayout />
          </Guard>
        }
      >
        <Route index element={<FabricatorHome />} />
        <Route path="leads/:id" element={<FabricatorLeadDetail />} />
        <Route path="quotes" element={<FabricatorQuotesPage />} />
        <Route path="jobs" element={<FabricatorJobsPage />} />
        <Route path="payments" element={<FabricatorPaymentsPage />} />
        <Route path="reviews" element={<FabricatorReviewsPage />} />
      </Route>

      <Route
        path="/driver"
        element={
          <Guard allow={['driver', 'admin']}>
            <DriverLayout />
          </Guard>
        }
      >
        <Route index element={<DriverHome />} />
        <Route path="trips/:id" element={<DriverTripDetail />} />
        <Route path="history" element={<DriverHistoryPage />} />
      </Route>

      <Route
        path="/notifications"
        element={
          <Authed>
            <div className="min-h-screen bg-[linear-gradient(180deg,#eef2f6_0%,#f7f8fa_45%,#e8ecf0_100%)]">
              <NotificationsPage />
            </div>
          </Authed>
        }
      />
      <Route
        path="/support"
        element={
          <Authed>
            <div className="min-h-screen bg-[linear-gradient(180deg,#eef2f6_0%,#f7f8fa_45%,#e8ecf0_100%)]">
              <SupportPage />
            </div>
          </Authed>
        }
      />
      <Route
        path="/profile"
        element={
          <Authed>
            <div className="min-h-screen bg-[linear-gradient(180deg,#eef2f6_0%,#f7f8fa_45%,#e8ecf0_100%)] p-4">
              <div className="mx-auto max-w-5xl">
                <ProfilePage />
              </div>
            </div>
          </Authed>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
