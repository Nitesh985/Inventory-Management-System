import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import CreditStats from "./components/CreditStats";
import CreditForm from "./components/CreditForm";
import CreditHistory from "./components/CreditHistory";
import CustomerList from "./components/CustomerList";
import AddCustomerModal from "./components/AddCustomerModal";
import CustomerDetailsModal from "./components/CustomerDetailsModal";

const CustomerCredit = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null,
  );
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCustomerListExpanded, setIsCustomerListExpanded] = useState(false);
  const [customerDetailsModalId, setCustomerDetailsModalId] = useState<string | null>(null);

  // Function to trigger a re-fetch across all components
  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  return (
    <>
      <Helmet>
        <title>Customer Credit - Digital Khata</title>
        <meta
          name="description"
          content="Manage customer credits, track payments, and monitor account balances with comprehensive credit history and transaction recording."
        />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          syncStatus="online"
        />

        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          syncStatus="online"
        />

        <main
          className={`pt-16 lg:pb-8 transition-all duration-300 ${
            sidebarCollapsed ? "lg:ml-16" : "lg:ml-72"
          }`}
        >
          <div>
            <div className=" p-4 lg:p-8 max-w-7xl mx-auto">
              {/* Page Header */}
              <div className="">
                <div className="flex items-center justify-between space-x-3">
                  <div className="flex space-x-2" ><div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center">
                    <Icon name="User" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">
                      Customer Khata
                    </h1>
                    <p className="text-muted-foreground">
                      Manage credits, track payments, and monitor balances
                    </p>
                  </div></div>
                  <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 pb-0">
                    <Button
                      variant="default"
                      onClick={() => setIsAddModalOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700 shadow-md"
                    >
                      <Icon name="Plus" size={18} className="mr-2" /> Add New
                      Customer
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Page Content */}
            <div className="px-16 space-y-6 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
              {/* Action Button */}

              {/* 2. Top Metric Cards */}
              <CreditStats key={`stats-${refreshKey}`} />

              <div className="flex flex-col lg:flex-row gap-6 items-start">
                {/* 3. Section 1: Customer Directory (Left Sidebar within page) */}
                <div
                  className={`bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 w-full ${
                    isCustomerListExpanded
                      ? "lg:w-full"
                      : "lg:w-[33%] lg:min-w-[320px]"
                  }`}
                >
                  <CustomerList
                    selectedCustomerId={selectedCustomerId}
                    onCustomerSelect={setSelectedCustomerId}
                    onAddClick={() => setIsAddModalOpen(true)}
                    refreshKey={refreshKey}
                    isExpanded={isCustomerListExpanded}
                    onToggleExpand={() =>
                      setIsCustomerListExpanded(!isCustomerListExpanded)
                    }
                    onCustomerNameClick={(id) => setCustomerDetailsModalId(id)}
                  />
                </div>

                {/* 4. Section 3: Transaction & History (Main Content Area) - Hidden when expanded */}
                {!isCustomerListExpanded && (
                  <div className="flex-1 space-y-6 min-w-0">
                    {selectedCustomerId ? (
                      <>
                        {/* Record Entry Form (Functional Section) */}
                        <CreditForm
                          selectedCustomerId={selectedCustomerId}
                          onSuccess={handleRefresh}
                        />

                        {/* Detailed History Table */}
                        <CreditHistory
                          customerId={selectedCustomerId}
                          key={`history-${refreshKey}-${selectedCustomerId}`}
                        />
                      </>
                    ) : (
                      <div className="h-[400px] flex flex-col items-center justify-center bg-white border-2 border-dashed border-slate-200 rounded-3xl text-center p-10">
                        <div className="p-4 bg-slate-50 rounded-full mb-4">
                          <Icon
                            name="User"
                            size={48}
                            className="text-slate-300"
                          />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800">
                          No Customer Selected
                        </h3>
                        <p className="text-slate-500 max-w-xs mx-auto text-sm mt-2">
                          Select a customer from the list on the left to view
                          their credit history and record new transactions.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Manual Add Customer Modal */}
              {isAddModalOpen && (
                <AddCustomerModal
                  onClose={() => setIsAddModalOpen(false)}
                  onSuccess={handleRefresh}
                />
              )}

              {/* Customer Details Modal */}
              {customerDetailsModalId && (
                <CustomerDetailsModal
                  customerId={customerDetailsModalId}
                  onClose={() => setCustomerDetailsModalId(null)}
                  onSuccess={handleRefresh}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default CustomerCredit;
