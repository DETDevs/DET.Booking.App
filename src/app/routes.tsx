import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { Loading } from "./layout/Loading";
import { useTenant } from "@/entities/tenant/TenantContext";

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
          </Route>
        </Route>

        <Route path="*" element={<div className="p-10">404 – Not found</div>} />
      </Routes>
    </Suspense>
  );
};
