import { lazy } from "react";

export const DashboardPage = lazy(() => import("@/pages/DashBoardPage/DashBoardPage"));
export const BookingsPage  = lazy(() => import("@/pages/BookingsPage/BookingsPage"));
// export // const SettingsPage  = lazy(() => import("@/pages/SettingsPage/SettingsPage"));
export const LoginPage     = lazy(() => import("@/pages/LoginPage/LoginPage"));