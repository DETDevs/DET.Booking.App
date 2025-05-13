import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { Loading } from "./app/layout/Loading";
import { AdminLayout } from "./app/layout/AdmonLayout";
import { BookingsPage, DashboardPage, LoginPage } from "./lazyPages";

export const AppRoutes = () => (
  <Suspense fallback={<Loading />}>
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        {/* <Route path="settings"  element={<SettingsPage  />} /> */}
      </Route>

      <Route path="/login" element={<LoginPage />} />

      {/* 404 */}
      <Route path="*" element={<div className="p-10">404 – Not found</div>} />
    </Routes>
  </Suspense>
);

