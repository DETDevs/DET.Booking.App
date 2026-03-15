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

export const NotFoundPage = lazy(
    () => import("@/pages/NotFoundPage/NotFoundPage")
);

export const CalendarPage = lazy(
    () => import("@/pages/CalendarPage/CalendarPage")
);

export const ClientDetailPage = lazy(
    () => import("@/pages/ClientDetailPage/ClientDetailPage")
);

export const LiveOpsPage = lazy(
    () => import("@/pages/LiveOpsPage/LiveOpsPage")
);

export const ReportsPage = lazy(
    () => import("@/pages/ReportsPage/ReportsPage")
);

export const NotificationsPage = lazy(
    () => import("@/pages/NotificationsPage/NotificationsPage")
);

export const ServicesPage = lazy(
    () => import("@/pages/ServicesPage/ServicesPage")
);

export const AuditLogPage = lazy(
    () => import("@/pages/AuditLogPage/AuditLogPage")
);
