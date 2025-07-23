import { lazy } from "react";

export const DashboardPage = lazy(
  () =>
    import(
      /* webpackChunkName: "dashboard" */ "@/pages/DashBoardPage/DashBoardPage"
    )
);

export const BookingsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "bookings" */ "@/pages/BookingsPage/BookingsPage"
    )
);

export const LoginPage = lazy(
  () => import(/* webpackChunkName: "login" */ "@/pages/LoginPage/LoginPage")
);

export const ProfilePage = lazy(
  () =>
    import(/* webpackChunkName: "profile" */ "@/pages/ProfilePage/ProfilePage")
);

export const SettingsPage = lazy(
  () =>
    import(/* webpackChunkName: "settings" */ "@/pages/SettingsPage/Settings")
);

export const MakeBookPage = lazy(
  () =>
    import(/* webpackChunkName: "makebook" */ "@/pages/MakeBookPage/MakeBook")
);

export const UsuarioPage = lazy(
  () =>
    import(/* webpackChunkName: "usuario" */ "@/pages/UsuarioPage/UsuarioPage")
);

export const CustomerPage = lazy(
  () =>
    import(
      /* webpackChunkName: "customer" */ "@/pages/CustomerPage/CustomerPage"
    )
);

// Layouts con lazy
export const AdminLayout = lazy(
  () =>
    import(/* webpackChunkName: "admin-layout" */ "@/app/layout/AdmonLayout")
);

export const Layout = lazy(
  () => import(/* webpackChunkName: "main-layout" */ "@/Layout")
);
