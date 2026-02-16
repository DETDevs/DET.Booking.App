import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { Loading } from "./layout/Loading";

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

export const AppRoutes = () => (
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
          <Route index element={<DashboardPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="new-booking" element={<NewBookingPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="customer" element={<CustomerPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<div className="p-10">404 – Not found</div>} />
    </Routes>
  </Suspense>
);
