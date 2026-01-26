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
import { useAutoTour } from "@/hooks/useTour";
import "@/styles/tour.css";

// Backend product structure (from API)
interface BackendProduct {
  _id: string;
  shopId: string;
  sku: string;
  name: string;
  category?: string;
  description?: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
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
  // const [onboardingCompleted, setOnboardingCompleted] = useState(true)
  const onboardingCompleted = session?.user?.onBoardingCompleted;



  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [showProductModal, setShowProductModal] = useState<boolean>(false);
  const [showBulkImportModal, setShowBulkImportModal] =
    useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [shouldStartTour, setShouldStartTour] = useState(false);

  // Initialize tour
  useAutoTour('inventory-management', shouldStartTour);

  // Check if user should see the tour
  useEffect(() => {
    const hasSeenInventoryTour = localStorage.getItem('hasSeenInventoryTour');
    if (!hasSeenInventoryTour) {
      setShouldStartTour(true);
      localStorage.setItem('hasSeenInventoryTour', 'true');
    }
  }, []);

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
      minStock: p.minStock ?? 0, // Now comes from backend
      maxStock: 0, // Not tracked
      unitPrice: parseInt(p.price) ?? 0,
      costPrice: parseInt(p.cost) ?? 0,
      description: p.description || "",
      lastUpdated: p.updatedAt || p.createdAt || new Date().toISOString(),
      reserved: 0, // No longer tracking reserved
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
    if (product.isLowStock) return "low-stock";
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
      // Use backend's isLowStock flag only
      return product.isLowStock || product.currentStock === 0;
    });
  }, [products]);

  const handleAddProduct = (): void => {
    setEditingProduct(null);
    setShowProductModal(true);
  };

  const handleEditProduct = (product: Product): void => {
    if (!product) return;
    
    console.log("Editing product:", product);
    console.log("Product values - Stock:", product.currentStock, "Price:", product.unitPrice, "Cost:", product.costPrice, "MinStock:", product.minStock);
    
    // Transform product data to match ProductFormModal interface expectations
    const productForModal = {
      _id: product.id,
      name: product.name,
      sku: product.sku,
      category: product.category,
      description: product.description,
      stock: product.currentStock, // Map currentStock to stock
      minStock: product.minStock,
      price: product.unitPrice, // Map unitPrice to price
      cost: product.costPrice, // Map costPrice to cost
      supplier: product?.supplier || "", // Default supplier
    };
    
    console.log("Product for modal:", productForModal);
    
    setEditingProduct(productForModal as any);
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
    productData: any, // Changed from Partial<Product> to any since modal returns different format
  ): Promise<void> => {
    if (!productData) return;

    console.log("Saving product data from modal:", productData);

    // Transform modal data back to our expected format
    const transformedData = {
      name: productData.name,
      sku: productData.sku,
      category: productData.category,
      description: productData.description,
      currentStock: typeof productData.stock === 'string' ? parseInt(productData.stock) || 0 : productData.stock,
      minStock: typeof productData.minStock === 'string' ? parseInt(productData.minStock) || 0 : productData.minStock,
      unitPrice: typeof productData.price === 'string' ? parseFloat(productData.price) || 0 : productData.price,
      costPrice: typeof productData.cost === 'string' ? parseFloat(productData.cost) || 0 : productData.cost,
    };

    console.log("Transformed product data:", transformedData);

    try {
      let productId: string;

      if (editingProduct) {
        // Update existing product - map frontend fields to backend fields
        console.log("Updating product:", editingProduct._id, transformedData);
        const updateResult = await updateProductMutation({
          id: String(editingProduct._id),
          payload: {
            name: transformedData.name,
            sku: transformedData.sku,
            category: transformedData.category,
            description: transformedData.description,
            price: parseInt(transformedData.unitPrice) || 0,
            cost: parseInt(transformedData.costPrice) || 0,
          } as any,
        });
        productId = String(editingProduct._id);
        
        // Update inventory if stock or minStock is specified
        if (transformedData.currentStock !== undefined || transformedData.minStock !== undefined) {
          console.log("Updating inventory for product:", productId, "stock:", transformedData.currentStock, "minStock:", transformedData.minStock);
          await updateInventoryMutation({
            productId: productId,
            stock: transformedData.currentStock,
            minStock: transformedData.minStock || 0,
          });
        }
      } else {
        // Create new product - map frontend fields to backend fields
        console.log("Creating new product:", transformedData);
        const createResult = await createProductMutation({
          name: transformedData.name || "",
          sku: transformedData.sku || `SKU-${Date.now()}`,
          price: parseInt(transformedData.unitPrice) || 0,
          cost: parseInt(transformedData.costPrice) || 0,
          category: transformedData.category,
          description: transformedData.description,
          stock: transformedData.currentStock || 0,
          minStock: transformedData.minStock || 0,
        });
        
        console.log("Product creation result:", createResult);
        
        // Extract product ID from the creation result - try multiple possible response structures
        productId = createResult?._id || 
                   createResult?.data?._id || 
                   createResult?.id || 
                   createResult?.data?.id ||
                   createResult?.product?._id ||
                   createResult?.product?.id;

        if (!productId) {
          console.error("No product ID found in creation result:", createResult);
          throw new Error("Failed to get product ID from creation result");
        }

        console.log("Extracted product ID:", productId);

        // Create inventory record for new product
        const initialStock = transformedData.currentStock !== undefined ? transformedData.currentStock : 0;
        console.log("Creating inventory for new product:", productId, "with stock:", initialStock);
        
        await updateInventoryMutation({
          productId: productId,
          stock: initialStock,
          minStock: transformedData.minStock || 0,
        });
      }

      triggerRefresh();
      setShowProductModal(false);
      setEditingProduct(null);
    } catch (err) {
      console.error("Failed to save product:", err);
      console.error("Error details:", err.response?.data || err.message || err);
      alert(`Failed to save product: ${err.response?.data?.message || err.message || 'Unknown error'}`);
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
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8" data-tour="inventory-header">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Inventory Management
                </h1>
                <p className="text-muted-foreground mt-2">
                  Manage your product catalog, track stock levels, and monitor
                  inventory performance
                </p>
              </div>

              <div className="flex items-center space-x-3" data-tour="add-product">
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
            <div data-tour="low-stock-alerts">
              <LowStockAlert
                lowStockProducts={lowStockProducts}
                onViewProduct={handleEditProduct}
                onDismiss={() => {
                  /* Handle dismiss */
                }}
              />
            </div>

            {/* Filter Toolbar */}
            <div data-tour="filter-toolbar">
              <FilterToolbar
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                onBulkImport={handleBulkImport}
                onBulkExport={handleBulkExport}
                totalProducts={products?.length}
                filteredCount={filteredProducts?.length}
              />
            </div>

            {/* Products Table */}
            <div className="mt-6" data-tour="product-table">
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
          />
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
