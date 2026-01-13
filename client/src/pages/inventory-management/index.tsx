import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "@/lib/auth-client";

import Button from "../../components/ui/Button";
import Header from "../../components/ui/Header";
import Sidebar from "../../components/ui/Sidebar";
import ProductFormModal from "./components/ProductFormModal";
import ProductTable from "./components/ProductTable";
import FilterToolbar from "./components/FilterToolbar";
import LowStockAlert from "./components/LowStockAlert";
import BulkImportModal from "./components/BulkImportModal";
import InventoryStats from "./components/InventoryStats";
import { useFetch } from "@/hooks/useFetch";
import { useMutation } from "@/hooks/useMutation";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/api/products";
import { updateInventory, createOrUpdateInventory } from "@/api/inventory";
import BusinessOnboardingModal from "@/components/onboarding/BusinessOnboardingModal";

// Backend product structure (from API)
interface BackendProduct {
  _id: string;
  shopId: string;
  sku: string;
  name: string;
  category?: string;
  description?: string;
  unit: number;
  price: number;
  cost: number;
  reorderLevel: number;
  stock: number;
  reserved: number;
  availableStock: number;
  isLowStock: boolean;
  createdAt: string;
  updatedAt: string;
}

// Frontend product structure (for UI components)
interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  costPrice: number;
  description: string;
  lastUpdated: string;
  reserved: number;
  availableStock: number;
  isLowStock: boolean;
}

interface Filters {
  category: string;
  stockStatus: string;
  priceRange: string;
}

const InventoryManagement: React.FC = () => {
  const { data: session, isPending } = useSession();
  const [onboardingCompleted, setOnboardingCompleted] = useState(true)
  // const onboardingCompleted = session?.user?.onBoardingCompleted;



  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [showProductModal, setShowProductModal] = useState<boolean>(false);
  const [showBulkImportModal, setShowBulkImportModal] =
    useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const {
    data: productsData,
    loading,
    error,
  } = useFetch(getAllProducts, [refreshKey]);

  // Transform backend data to frontend format
  const products: Product[] = useMemo(() => {
    const rawProducts = productsData?.data || productsData || [];
    if (!Array.isArray(rawProducts)) return [];

    return rawProducts.map((p: BackendProduct) => ({
      id: p._id,
      name: p.name || "",
      sku: p.sku || "",
      category: p.category || "",
      currentStock: p.stock ?? 0,
      minStock: p.reorderLevel ?? 0,
      maxStock: 0, // Not tracked in backend
      unitPrice: p.price ?? 0,
      costPrice: p.cost ?? 0,
      description: p.description || "",
      lastUpdated: p.updatedAt || p.createdAt || new Date().toISOString(),
      reserved: p.reserved ?? 0,
      availableStock: p.availableStock ?? p.stock ?? 0,
      isLowStock: p.isLowStock ?? false,
    }));
  }, [productsData]);

  const { mutate: createProductMutation, loading: creating } =
    useMutation(createProduct);
  const { mutate: updateProductMutation, loading: updating } = useMutation(
    (data: { id: string; payload: Partial<Product> }) =>
      updateProduct(data.id, data.payload),
  );
  const { mutate: deleteProductMutation, loading: deleting } =
    useMutation(deleteProduct);
  const { mutate: updateInventoryMutation } = useMutation(
    createOrUpdateInventory,
  );

  const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

  const [filters, setFilters] = useState<Filters>({
    category: "",
    stockStatus: "",
    priceRange: "",
  });

  const [syncStatus, setSyncStatus] = useState<
    "online" | "syncing" | "offline"
  >("online");

  const getProductStockStatus = (product: Product): string => {
    if (!product) return "unknown";
    if (product.currentStock === 0) return "out-of-stock";
    if (
      product.isLowStock ||
      (product.minStock != null && product.currentStock <= product.minStock)
    )
      return "low-stock";
    return "in-stock";
  };

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return [];

    return products.filter((product) => {
      if (!product) return false;

      if (filters.category && product?.category !== filters.category)
        return false;

      if (filters.stockStatus) {
        const stockStatus = getProductStockStatus(product);
        if (filters.stockStatus !== stockStatus) return false;
      }

      if (filters.priceRange) {
        const price = product?.unitPrice ?? 0;

        switch (filters.priceRange) {
          case "0-10":
            if (price > 10) return false;
            break;
          case "10-50":
            if (price <= 10 || price > 50) return false;
            break;
          case "50-100":
            if (price <= 50 || price > 100) return false;
            break;
          case "100-500":
            if (price <= 100 || price > 500) return false;
            break;
          case "500+":
            if (price <= 500) return false;
            break;
        }
      }

      return true;
    });
  }, [products, filters]);

  const lowStockProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    return products.filter((product) => {
      if (!product) return false;
      // Use backend's isLowStock flag or calculate manually
      return (
        product.isLowStock ||
        product.currentStock === 0 ||
        (product.minStock != null && product.currentStock <= product.minStock)
      );
    });
  }, [products]);

  const handleAddProduct = (): void => {
    setEditingProduct(null);
    setShowProductModal(true);
  };

  const handleEditProduct = (product: Product): void => {
    if (!product) return;
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (
    productId: string | number,
  ): Promise<void> => {
    if (!productId) return;

    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProductMutation(String(productId));
        triggerRefresh();
      } catch (err) {
        console.error("Failed to delete product:", err);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  const handleSaveProduct = async (
    productData: Partial<Product>,
  ): Promise<void> => {
    if (!productData) return;

    try {
      if (editingProduct) {
        // Update existing product - map frontend fields to backend fields
        await updateProductMutation({
          id: String(editingProduct.id),
          payload: {
            name: productData.name,
            sku: productData.sku,
            category: productData.category,
            description: productData.description,
            price: productData.unitPrice,
            cost: productData.costPrice,
            reorderLevel: productData.minStock,
          } as any,
        });
      } else {
        // Create new product - map frontend fields to backend fields
        await createProductMutation({
          name: productData.name || "",
          sku: productData.sku || `SKU-${Date.now()}`,
          unit: 1,
          price: productData.unitPrice || 0,
          cost: productData.costPrice || 0,
          category: productData.category,
          description: productData.description,
          reorderLevel: productData.minStock || 0,
        });
      }

      triggerRefresh();
      setShowProductModal(false);
      setEditingProduct(null);
    } catch (err) {
      console.error("Failed to save product:", err);
      alert("Failed to save product. Please try again.");
    }
  };

  const handleQuickStockUpdate = async (
    productId: string | number,
    newStock: number,
  ): Promise<void> => {
    if (!productId) return;

    try {
      // Update inventory stock via inventory API
      await updateInventoryMutation({
        productId: String(productId),
        stock: newStock,
      });
      triggerRefresh();
    } catch (err) {
      console.error("Failed to update stock:", err);
      alert("Failed to update stock. Please try again.");
    }
  };

  const handleFilterChange = (filterKey: string, value: string): void => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: "",
      stockStatus: "",
      priceRange: "",
    });
  };

  const handleBulkImport = () => {
    setShowBulkImportModal(true);
  };

  const handleBulkExport = () => {
    const safeProducts = Array.isArray(filteredProducts)
      ? filteredProducts
      : [];

    const headers = [
      "Product Name",
      "SKU",
      "Category",
      "Current Stock",
      "Reserved",
      "Available Stock",
      "Reorder Level",
      "Unit Price",
      "Cost Price",
      "Description",
    ];

    const csvContent = [
      headers.join(","),
      ...safeProducts.map((product) =>
        [
          `"${product?.name ?? ""}"`,
          product?.sku ?? "",
          product?.category ?? "",
          product?.currentStock ?? 0,
          product?.reserved ?? 0,
          product?.availableStock ?? 0,
          product?.minStock ?? 0,
          product?.unitPrice ?? 0,
          product?.costPrice ?? 0,
          `"${product?.description ?? ""}"`,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inventory_export_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleImportComplete = (results: unknown[]): void => {
    console.log("Import completed:", results || []);
  };
  
  if (isPending) {
    return <div>Loading...</div>;
  }


  return (
    <div className="relative min-h-screen bg-background">
      <div
        className={`transition-all duration-300 ${
          !onboardingCompleted ? "blur-sm pointer-events-none select-none" : ""
        }`}
      >
        <Header
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          syncStatus={syncStatus}
        />
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          syncStatus={syncStatus}
        />
        <main
          className={`pt-16 pb-20 lg:pb-8 transition-all duration-300 ${
            sidebarCollapsed ? "lg:ml-16" : "lg:ml-72"
          }`}
        >
          <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Inventory Management
                </h1>
                <p className="text-muted-foreground mt-2">
                  Manage your product catalog, track stock levels, and monitor
                  inventory performance
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={handleBulkImport}
                  iconName="Upload"
                  iconPosition="left"
                >
                  Import Products
                </Button>

                <Button
                  variant="default"
                  onClick={handleAddProduct}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Add Product
                </Button>
              </div>
            </div>

            {/* Inventory Statistics */}
            <InventoryStats products={products} />

            {/* Low Stock Alert */}
            <LowStockAlert
              lowStockProducts={lowStockProducts}
              onViewProduct={handleEditProduct}
              onDismiss={() => {
                /* Handle dismiss */
              }}
            />

            {/* Filter Toolbar */}
            <FilterToolbar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              onBulkImport={handleBulkImport}
              onBulkExport={handleBulkExport}
              totalProducts={products?.length}
              filteredCount={filteredProducts?.length}
            />

            {/* Products Table */}
            <div className="mt-6">
              <ProductTable
                products={filteredProducts}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onQuickStockUpdate={handleQuickStockUpdate}
              />
            </div>
          </div>
        </main>
      </div>
      {!onboardingCompleted && (
        <div className="fixed inset-0 bg-black/40 z-40" />
      )}

      {/* Modals */}
      <ProductFormModal
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onSave={handleSaveProduct}
      />
      <BulkImportModal
        isOpen={showBulkImportModal}
        onClose={() => setShowBulkImportModal(false)}
        onImport={handleImportComplete}
      />
      {!onboardingCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <BusinessOnboardingModal
            onComplete={() => setOnboardingCompleted(true)}
          />
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
