import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import InventoryManagement from "./pages/inventory-management";
import AIReportsDashboard from "./pages/ai-reports-dashboard";
import BusinessDashboard from "./pages/business-dashboard";
import BusinessSettings from "./pages/business-settings";
import SalesRecording from "./pages/sales-recording";
import ExpenseTracking from "./pages/expense-tracking";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Define your route here */}
          <Route path="/" element={<BusinessDashboard />} />
          <Route
            path="/inventory-management"
            element={<InventoryManagement />}
          />
          <Route
            path="/ai-reports-dashboard"
            element={<AIReportsDashboard />}
          />
          <Route path="/business-dashboard" element={<BusinessDashboard />} />
          <Route path="/business-settings" element={<BusinessSettings />} />
          <Route path="/sales-recording" element={<SalesRecording />} />
          <Route path="/expense-tracking" element={<ExpenseTracking />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
