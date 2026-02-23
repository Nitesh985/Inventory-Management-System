import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";

import {
  NotFound,
  InventoryManagement,
  AIReportsDashboard,
  BusinessDashboard,
  BusinessSettings,
  BusinessRegistration,
  SalesRecording,
  ExpenseTracking,
  LogIn as SignInPage,
  LandingPage,
  CustomerCredit as CustomerKhata,
  TestPage,
  Signup as SignUp,
  Register as RegisterPage,
  EmailVerification,
  SalesManagement,
} from "./pages";
import ProtectedLayout from "./ProtectedLayout";
import Protected from "./components/Protected";
import AuthLayout from "./pages/auth/AuthLayout";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Define your route here */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/welcome" element={<LandingPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="*" element={<NotFound />} />

          <Route path="/business-dashboard" element={<BusinessDashboard />} />

          <Route
            path="/inventory-management"
            element={<InventoryManagement />}
          />
          <Route
            path="/ai-reports-dashboard"
            element={<AIReportsDashboard />}
          />
          <Route path="/business-settings" element={<BusinessSettings />} />
          <Route path="/sales-management" element={<SalesManagement />} />
          <Route path="/sales-recording" element={<SalesRecording />} />
          <Route path="/expense-tracking" element={<ExpenseTracking />} />
          <Route path="/customer-khata" element={<CustomerKhata />} />
          <Route element={<AuthLayout />}>
            <Route path="/verify-email" element={<EmailVerification />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="/sign-up" element={<SignUp />} />
          </Route>

          <Route path="/sign-in" element={<SignInPage />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
