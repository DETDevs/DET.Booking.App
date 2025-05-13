import { createBrowserRouter } from "react-router-dom";
import { AdminLayout } from "./layout/AdmonLayout";
import DashboardPage from "@/pages/DashBoardPage/DashBoardPage";

export const router = createBrowserRouter([
  {
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "bookings", element: <div>Bookings (WIP)</div> },
      { path: "settings", element: <div>Settings (WIP)</div> },
    ],
  },
]);
