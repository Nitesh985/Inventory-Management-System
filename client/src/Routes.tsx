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
  Register as RegisterPage } from "./pages";
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
              <Route path="/business-registration" element={<BusinessRegistration />} />
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
              <Route path="/sales-recording" element={<SalesRecording />} />
              <Route path="/expense-tracking" element={<ExpenseTracking />} />
              <Route path="/customer-khata" element={<CustomerKhata />} />
          </Route>
          <Route path="/register" element={
            // <Protected authentication={false}>
              <RegisterPage />
            // </Protected>
            } />
          <Route path="/sign-up" element={
            // <Protected authentication={false}>
            <SignUp />
            // </Protected>
            } />
          <Route path="/sign-in" element={
            // <Protected authentication={false}>
            <SignInPage />
            // </Protected>
            } />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
