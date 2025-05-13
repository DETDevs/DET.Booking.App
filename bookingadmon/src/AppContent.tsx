// src/AppContent.tsx
import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";
import { Layout } from "./Layout";

export const AppContent = () => (
  <Router>
    <Layout>
      <AppRoutes />
    </Layout>
  </Router>
);
