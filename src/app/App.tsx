import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./routes";
import { TenantProvider } from "@/entities/tenant/TenantContext";

export const App = () => (
  <TenantProvider>
    <Router>
      <AppRoutes />
    </Router>
  </TenantProvider>
);
