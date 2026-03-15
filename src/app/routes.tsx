import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { Loading } from "./layout/Loading";
import { useTenant } from "@/entities/tenant/TenantContext";
import { ProtectedRoute } from "@/entities/auth/ProtectedRoute";

import {
  BookingsPage,
  DashboardPage,
  LoginPage,
  ProfilePage,
  SettingsPage,
  NewBookingPage,
  UsersPage,
  CustomerPage,
  AdminLayout,
  MainLayout,
  NotFoundPage,
  CalendarPage,
  ClientDetailPage,
  LiveOpsPage,
  ReportsPage,
  NotificationsPage,
  ServicesPage,
  AuditLogPage,
} from "./lazyPages";

const featureRouteMap: Record<
  string,
  { path: string; element: React.ReactNode }
> = {
  dashboard: { path: "/", element: <DashboardPage /> },
  bookings: { path: "bookings", element: <BookingsPage /> },
  newBooking: { path: "new-booking", element: <NewBookingPage /> },
  staff: { path: "users", element: <UsersPage /> },
  patients: { path: "customers", element: <CustomerPage /> },
  settings: { path: "settings", element: <SettingsPage /> },
  profile: { path: "profile", element: <ProfilePage /> },
  calendar: { path: "calendar", element: <CalendarPage /> },
  liveOps: { path: "live", element: <LiveOpsPage /> },
  reports: { path: "reports", element: <ReportsPage /> },
  notifications: { path: "notifications", element: <NotificationsPage /> },
  services: { path: "services", element: <ServicesPage /> },
  auditLog: { path: "audit-log", element: <AuditLogPage /> },
};

export const AppRoutes = () => {
  const tenant = useTenant();

  const enabledRoutes = Object.entries(featureRouteMap).filter(
    ([key]) => tenant.features[key]?.enabled !== false,
  );

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <Suspense fallback={<Loading />}>
                <MainLayout />
              </Suspense>
            }
          >
            <Route element={<AdminLayout />}>
              {enabledRoutes.map(([key, route]) => (
                <Route
                  key={key}
                  index={route.path === "/"}
                  path={route.path === "/" ? undefined : route.path}
                  element={route.element}
                />
              ))}
              <Route path="customers/:id" element={<ClientDetailPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};
