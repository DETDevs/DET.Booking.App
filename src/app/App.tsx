import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./routes";
import { TenantProvider } from "@/entities/tenant/TenantContext";
import { AuthProvider } from "@/entities/auth/AuthContext";
import { ToastProvider } from "@/shared/ui/Toast";

export const App = () => (
  <TenantProvider>
    <AuthProvider>
      <ToastProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ToastProvider>
    </AuthProvider>
  </TenantProvider>
);
