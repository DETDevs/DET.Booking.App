import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { Loading } from "./app/layout/Loading";

import {
  BookingsPage,
  DashboardPage,
  LoginPage,
  ProfilePage,
  SettingsPage,
  MakeBookPage,
  UsuarioPage,
  CustomerPage,
  AdminLayout,
  Layout,
} from "./lazyPages";

export const AppRoutes = () => (
  <Suspense fallback={<Loading />}>
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <Suspense fallback={<Loading />}>
            <Layout />
          </Suspense>
        }
      >
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="makebook" element={<MakeBookPage />} />
          <Route path="user" element={<UsuarioPage />} />
          <Route path="customer" element={<CustomerPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* Ruta 404 */}
      <Route path="*" element={<div className="p-10">404 – Not found</div>} />
    </Routes>
  </Suspense>
);
