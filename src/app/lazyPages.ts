import { lazy } from "react";

export const DashboardPage = lazy(
    () => import("@/pages/DashboardPage/DashboardPage")
);

export const BookingsPage = lazy(
    () => import("@/pages/BookingsPage/BookingsPage")
);

export const LoginPage = lazy(
    () => import("@/pages/LoginPage/LoginPage")
);

export const ProfilePage = lazy(
    () => import("@/pages/ProfilePage/ProfilePage")
);

export const SettingsPage = lazy(
    () => import("@/pages/SettingsPage/SettingsPage")
);

export const NewBookingPage = lazy(
    () => import("@/pages/NewBookingPage/NewBookingPage")
);

export const UsersPage = lazy(
    () => import("@/pages/UsersPage/UsersPage")
);

export const CustomerPage = lazy(
    () => import("@/pages/CustomerPage/CustomerPage")
);

export const AdminLayout = lazy(
    () => import("@/app/layout/AdminLayout")
);

export const MainLayout = lazy(
    () => import("@/app/layout/MainLayout")
);
