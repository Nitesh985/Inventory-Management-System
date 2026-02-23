import { useState, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import Icon from "@/components/AppIcon";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import Loader from "@/components/Loader";
import { useFetch } from "@/hooks/useFetch";
import {
  getCustomerCreditHistory,
  getCustomersWithBalance,
} from "@/api/credits";

// ─── Types ───────────────────────────────────────────────────
interface HistoryItem {
  _id: string;
  type: "CREDIT" | "PAYMENT";
  date: string;
  amount: number;
  description: string;
  invoiceNo?: string;
  items?: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  paymentMethod?: string;
  note?: string;
  runningBalance?: number;
}

interface CreditHistoryData {
  customer: {
    _id: string;
    name: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  summary: {
    totalCredit: number;
    totalPaid: number;
    currentBalance: number;
  };
  history: HistoryItem[];
  totalCount: number;
}

interface CustomerOption {
  _id: string;
  name: string;
  balance: number;
}

type TypeFilter = "all" | "CREDIT" | "PAYMENT";

// ─── Component ───────────────────────────────────────────────
const CreditHistoryPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const customerId = searchParams.get("customerId") || "";
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Fetch customer list for selector
  const { data: customers, loading: customersLoading } =
    useFetch<CustomerOption[]>(getCustomersWithBalance, []);

  // Fetch full credit history (no limit)
  const fetchHistory = useCallback(() => {
    if (!customerId) return Promise.resolve(null);
    return getCustomerCreditHistory(customerId);
  }, [customerId]);

  const { data, loading } = useFetch<CreditHistoryData>(fetchHistory, [
    customerId,
  ]);

  // ─── Helpers ─────────────────────────────────────────────
  const formatCurrency = (amount: number) =>
    `Rs. ${Math.round(amount || 0).toLocaleString("en-NP")}`;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-NP", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString("en-NP", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // ─── Filtered / searched history ─────────────────────────
  const filteredHistory = useMemo(() => {
    if (!data?.history) return [];
    let list = data.history;

    if (typeFilter !== "all") {
      list = list.filter((h) => h.type === typeFilter);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (h) =>
          h.description?.toLowerCase().includes(q) ||
          h.invoiceNo?.toLowerCase().includes(q) ||
          h.paymentMethod?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [data?.history, typeFilter, searchTerm]);

  // ─── Customer select handler ─────────────────────────────
  const handleCustomerChange = (id: string) => {
    setSearchParams({ customerId: id });
    setExpandedItems(new Set());
    setTypeFilter("all");
    setSearchTerm("");
  };

  // ─── Render ──────────────────────────────────────────────
  return (
    <>
      <Helmet>
        <title>Credit History - Digital Khata</title>
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
          <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/customer-khata")}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Icon name="ArrowLeft" size={20} />
                </button>
                <div className="w-10 h-10 bg-blue-600/10 rounded-lg flex items-center justify-center">
                  <Icon name="History" size={20} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    Credit History
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Full transaction history for customer credits
                  </p>
                </div>
              </div>

              {/* Customer Selector */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-muted-foreground">
                  Customer:
                </label>
                <select
                  value={customerId}
                  onChange={(e) => handleCustomerChange(e.target.value)}
                  className="border border-border rounded-lg px-3 py-2 text-sm bg-background min-w-[200px] focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Select a customer</option>
                  {customers?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                      {c.balance > 0
                        ? ` (Due: Rs.${Math.round(c.balance).toLocaleString()})`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {!customerId ? (
              /* No customer selected */
              <div className="h-[400px] flex flex-col items-center justify-center bg-white border-2 border-dashed border-slate-200 rounded-2xl text-center p-10">
                <div className="p-4 bg-slate-50 rounded-full mb-4">
                  <Icon name="User" size={48} className="text-slate-300" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Select a Customer
                </h3>
                <p className="text-slate-500 max-w-xs mx-auto text-sm mt-2">
                  Choose a customer from the dropdown above to view their full
                  credit history.
                </p>
              </div>
            ) : (
              <Loader loading={loading || customersLoading}>
                {data && (
                  <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      {/* Customer Name */}
                      <div className="bg-white border border-border rounded-xl p-4">
                        <p className="text-xs text-muted-foreground mb-1">
                          Customer
                        </p>
                        <p className="text-lg font-bold text-foreground">
                          {data.customer.name}
                        </p>
                        {data.customer.phone && (
                          <p className="text-xs text-muted-foreground">
                            {data.customer.phone}
                          </p>
                        )}
                      </div>
                      <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                        <p className="text-xs text-muted-foreground mb-1">
                          Total Credit
                        </p>
                        <p className="text-lg font-bold text-red-600">
                          {formatCurrency(data.summary.totalCredit)}
                        </p>
                      </div>
                      <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                        <p className="text-xs text-muted-foreground mb-1">
                          Total Paid
                        </p>
                        <p className="text-lg font-bold text-green-600">
                          {formatCurrency(data.summary.totalPaid)}
                        </p>
                      </div>
                      <div
                        className={`rounded-xl p-4 border ${
                          data.summary.currentBalance > 0
                            ? "bg-orange-50 border-orange-100"
                            : "bg-blue-50 border-blue-100"
                        }`}
                      >
                        <p className="text-xs text-muted-foreground mb-1">
                          Balance Due
                        </p>
                        <p
                          className={`text-lg font-bold ${
                            data.summary.currentBalance > 0
                              ? "text-orange-600"
                              : "text-blue-600"
                          }`}
                        >
                          {formatCurrency(
                            Math.abs(data.summary.currentBalance)
                          )}
                          {data.summary.currentBalance < 0 && (
                            <span className="text-xs ml-1 font-normal">
                              (Advance)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Filters & Search */}
                    <div className="bg-white border border-border rounded-xl p-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        {/* Type filter pills */}
                        <div className="flex items-center gap-2">
                          {(
                            [
                              { value: "all", label: "All", icon: "List" },
                              {
                                value: "CREDIT",
                                label: "Credits",
                                icon: "ShoppingCart",
                              },
                              {
                                value: "PAYMENT",
                                label: "Payments",
                                icon: "Banknote",
                              },
                            ] as const
                          ).map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => setTypeFilter(opt.value)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                typeFilter === opt.value
                                  ? opt.value === "CREDIT"
                                    ? "bg-red-100 text-red-700"
                                    : opt.value === "PAYMENT"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-primary/10 text-primary"
                                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                              }`}
                            >
                              <Icon name={opt.icon} size={14} />
                              {opt.label}
                            </button>
                          ))}
                        </div>

                        {/* Search */}
                        <div className="relative w-full sm:w-64">
                          <Icon
                            name="Search"
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          />
                          <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
                          />
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground mt-3">
                        Showing {filteredHistory.length} of{" "}
                        {data.totalCount} transactions
                      </p>
                    </div>

                    {/* Full History Table */}
                    <div className="bg-white border border-border rounded-xl overflow-hidden">
                      {/* Table Header */}
                      <div className="hidden sm:grid sm:grid-cols-[40px_1fr_140px_140px_140px] gap-4 px-4 py-3 bg-muted/50 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        <span></span>
                        <span>Description</span>
                        <span className="text-center">Date</span>
                        <span className="text-right">Amount</span>
                        <span className="text-right">Balance</span>
                      </div>

                      {/* Table Rows */}
                      <div className="divide-y divide-border max-h-[600px] overflow-y-auto custom-scrollbar">
                        {filteredHistory.length > 0 ? (
                          filteredHistory.map((item) => (
                            <div
                              key={item._id}
                              className="hover:bg-muted/20 transition-colors"
                            >
                              {/* Row */}
                              <div
                                className={`px-4 py-3 flex items-center sm:grid sm:grid-cols-[40px_1fr_140px_140px_140px] gap-4 ${
                                  item.items && item.items.length > 0
                                    ? "cursor-pointer"
                                    : ""
                                }`}
                                onClick={() =>
                                  item.items &&
                                  item.items.length > 0 &&
                                  toggleExpand(item._id)
                                }
                              >
                                {/* Type icon */}
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    item.type === "CREDIT"
                                      ? "bg-red-100"
                                      : "bg-green-100"
                                  }`}
                                >
                                  <Icon
                                    name={
                                      item.type === "CREDIT"
                                        ? "ShoppingCart"
                                        : "Banknote"
                                    }
                                    size={14}
                                    className={
                                      item.type === "CREDIT"
                                        ? "text-red-600"
                                        : "text-green-600"
                                    }
                                  />
                                </div>

                                {/* Description */}
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium text-foreground truncate">
                                      {item.description}
                                    </p>
                                    {item.invoiceNo && (
                                      <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono text-muted-foreground flex-shrink-0">
                                        #{item.invoiceNo}
                                      </span>
                                    )}
                                    {item.items && item.items.length > 0 && (
                                      <Icon
                                        name={
                                          expandedItems.has(item._id)
                                            ? "ChevronUp"
                                            : "ChevronDown"
                                        }
                                        size={14}
                                        className="text-muted-foreground flex-shrink-0"
                                      />
                                    )}
                                  </div>
                                  {item.paymentMethod && (
                                    <p className="text-xs text-muted-foreground">
                                      via {item.paymentMethod}
                                    </p>
                                  )}
                                </div>

                                {/* Date */}
                                <div className="text-center hidden sm:block">
                                  <p className="text-sm text-foreground">
                                    {formatDate(item.date)}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatTime(item.date)}
                                  </p>
                                </div>

                                {/* Amount */}
                                <div className="text-right">
                                  <p
                                    className={`text-sm font-bold ${
                                      item.type === "CREDIT"
                                        ? "text-red-600"
                                        : "text-green-600"
                                    }`}
                                  >
                                    {item.type === "CREDIT" ? "+" : "-"}
                                    {formatCurrency(item.amount)}
                                  </p>
                                  {/* Mobile date */}
                                  <p className="text-xs text-muted-foreground sm:hidden">
                                    {formatDate(item.date)}
                                  </p>
                                </div>

                                {/* Running Balance */}
                                <div className="text-right hidden sm:block">
                                  {item.runningBalance !== undefined && (
                                    <p
                                      className={`text-sm font-medium ${
                                        item.runningBalance > 0
                                          ? "text-orange-600"
                                          : "text-blue-600"
                                      }`}
                                    >
                                      {formatCurrency(
                                        Math.abs(item.runningBalance)
                                      )}
                                      {item.runningBalance < 0 && (
                                        <span className="text-[10px] ml-0.5">
                                          (adv)
                                        </span>
                                      )}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Expanded items detail */}
                              {expandedItems.has(item._id) &&
                                item.items &&
                                item.items.length > 0 && (
                                  <div className="px-4 pb-3 sm:pl-16">
                                    <div className="bg-muted/50 rounded-lg p-3 space-y-1.5">
                                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                                        Items
                                      </p>
                                      {item.items.map((product, idx) => (
                                        <div
                                          key={idx}
                                          className="flex justify-between text-sm"
                                        >
                                          <span className="text-foreground">
                                            {product.productName}
                                            <span className="text-muted-foreground ml-1">
                                              × {product.quantity} @{" "}
                                              {formatCurrency(
                                                product.unitPrice
                                              )}
                                            </span>
                                          </span>
                                          <span className="text-muted-foreground font-medium">
                                            {formatCurrency(
                                              product.totalPrice
                                            )}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                            </div>
                          ))
                        ) : (
                          <div className="p-10 text-center">
                            <Icon
                              name="FileText"
                              size={36}
                              className="mx-auto text-muted-foreground/30 mb-3"
                            />
                            <p className="text-muted-foreground text-sm">
                              {searchTerm || typeFilter !== "all"
                                ? "No transactions match your filters"
                                : "No credit history found"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </Loader>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default CreditHistoryPage;
