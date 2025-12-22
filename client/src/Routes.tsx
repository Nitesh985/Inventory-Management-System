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
import BusinessRegisterPage from "./pages/auth/businessRegister/index";
import SignInPage from "./pages/auth/logIn/index";
import RegisterPage from "./pages/auth/register";
import LandingPage from './pages/landing-page/index'
import CustomerKhata from "./pages/customer-credit";
import TestPage from './pages/test-pages/TestPage'
import ProtectedLayout from "./ProtectedLayout";



const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Define your route here */}
          <Route path="/welcome" element={<LandingPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="*" element={<NotFound />} /> 
          <Route element={<ProtectedLayout />}>
              <Route path="/" element={<BusinessDashboard />} />
              <Route
                path="/inventory-management"
                element={<InventoryManagement />}
              />
              <Route
                path="/ai-reports-dashboard"
                element={<AIReportsDashboard />}
              />
              <Route path="/business-settings" element={<BusinessSettings />} />
              <Route path="/sales-recording" element={<SalesRecording />} />
              <Route path="/expense-tracking" element={<ExpenseTracking />} />
              <Route path="/customer-khata" element={<CustomerKhata />} />
          </Route>
          <Route path="/business-registration" element={<BusinessRegisterPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
