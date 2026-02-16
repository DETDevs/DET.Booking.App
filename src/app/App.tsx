import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./routes";
import { TenantProvider } from "@/entities/tenant/TenantContext";
import { AuthProvider } from "@/entities/auth/AuthContext";

export const App = () => (
  <TenantProvider>
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  </TenantProvider>
);
