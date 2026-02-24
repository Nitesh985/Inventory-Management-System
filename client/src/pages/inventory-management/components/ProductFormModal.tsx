import React, { useState, useEffect } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { useFetch } from "@/hooks/useFetch";
import { getCategories } from "@/api/category";
import { getSuppliers, createSupplier } from "@/api/suppliers";
import type { CreateSupplierDTO } from "@/api/suppliers";
import { checkSkuAvailability } from '@/api/products';




interface Product {
  _id?: string | number;
  name?: string;
  sku?: string;
  category?: string;
  description?: string;
  stock: number;
  minStock?: number;
  price?: number;
  cost?: number;
  supplier?: string;
}

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSave: (productData: FormData) => void;
  onSwitchToEdit?: (product: any) => void;
}

interface FormData {
  name: string;
  sku: string;
  category: string;
  description: string;
  stock: string;
  minStock: string;
  price: string;
  cost: string;
  supplier: string;
}

interface FormErrors {
  [key: string]: string;
}

// TODO: Add reorderLevel
// TODO: Add reserve section

const generateSKU = (name: string, category: string) => {
  const namePart = name
    ?.trim()
    ?.toUpperCase()
    ?.replace(/[^A-Z0-9]/g, '')
    ?.slice(0, 4) || 'ITEM';

  const categoryPart = category
    ?.toUpperCase()
    ?.slice(0, 3) || 'GEN';

  const randomPart = Math.floor(1000 + Math.random() * 9000);

  return `${categoryPart}-${namePart}-${randomPart}`;
};



const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, product = null, onSave, onSwitchToEdit }) => {
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    sku: '',
    category: '',
    description: '',
    stock: '',
    minStock: '',
    price: '',
    cost: '',
    supplier: '',
  });
  const {
    data: categoryData,
    loading: categoryLoading,
    error: categoryError
  } = useFetch(getCategories, []);
  const categories = (categoryData || []).map((cat) => ({
    value: cat.name,
    label: cat.name,
  }));

  const [supplierRefreshKey, setSupplierRefreshKey] = useState(0);
  const { data: supplierData, loading: supplierLoading } = useFetch(getSuppliers, [supplierRefreshKey]);
  const suppliers = (supplierData || []).map((s: any) => ({
    value: s._id,
    label: s.company ? `${s.name} (${s.company})` : s.name,
  }));

  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [newSupplier, setNewSupplier] = useState({ name: '', phone: '', company: '', email: '', address: '' });
  const [addingSupplier, setAddingSupplier] = useState(false);

  const handleAddSupplier = async () => {
    if (!newSupplier.name.trim()) return;
    setAddingSupplier(true);
    try {
      const res = await createSupplier({
        name: newSupplier.name,
        phone: newSupplier.phone || undefined,
        company: newSupplier.company || undefined,
        email: newSupplier.email || undefined,
        address: newSupplier.address || undefined,
      } as CreateSupplierDTO);
      const created = res?.data || res;
      if (created?._id) {
        handleInputChange('supplier', created._id);
      }
      setSupplierRefreshKey((k) => k + 1);
      setNewSupplier({ name: '', phone: '', company: '', email: '', address: '' });
      setShowAddSupplier(false);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to add supplier');
    } finally {
      setAddingSupplier(false);
    }
  };

  const [isSkuManual, setIsSkuManual] = useState(false);
  const [skuStatus, setSkuStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");
  const [existingProduct, setExistingProduct] = useState<any>(null);


console.log(formData)
  
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);




  



  useEffect(() => {
    if (product) {
      setFormData({
        name: product?.name || '',
        sku: product?.sku || '',
        category: product?.category || '',
        description: product?.description || '',
        stock: product?.stock?.toString() || '',
        minStock: product?.minStock?.toString() || '',
        price: product?.price?.toString() || '',
        cost: product?.cost?.toString() || '',
        supplier: product?.supplier || '',
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        category: '',
        description: '',
        stock: '',
        minStock: '',
        price: '',
        cost: '',
        supplier: '',
      });
    }
    setErrors({});
  }, [product, isOpen]);

  useEffect(() => {
    if (!isSkuManual && formData.name && formData.category) {
      const newSku = generateSKU(formData.name, formData.category);
      setFormData(prev => ({ ...prev, sku: newSku }));
    }
  }, [formData.name, formData.category]);
  
  useEffect(() => {
    if (!formData.sku) return;
  
    let timeout: NodeJS.Timeout;
  
    setSkuStatus("checking");
    setExistingProduct(null);
  
    timeout = setTimeout(async () => {
      try {
        const res = await checkSkuAvailability(
          formData.sku,
          product?._id
        );
  
        if (res.available) {
          setSkuStatus("available");
          setExistingProduct(null);
        } else {
          setSkuStatus("taken");
          setExistingProduct(res.existingProduct || null);
        }
      } catch {
        setSkuStatus("idle");
        setExistingProduct(null);
      }
    }, 500); // debounce
  
    return () => clearTimeout(timeout);
  }, [formData.sku]);

  
  
  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData?.sku?.trim()) {
      newErrors.sku = 'SKU is required';
    }

    if (!formData?.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData?.stock || isNaN(formData?.stock) || parseInt(formData?.stock) < 0) {
      newErrors.stock = 'Valid current stock is required';
    }

    if (!formData?.price || isNaN(formData?.price) || parseFloat(formData?.price) <= 0) {
      newErrors.price = 'Valid unit price is required';
    }

    if (formData?.minStock && (isNaN(formData?.minStock) || parseInt(formData?.minStock) < 0)) {
      newErrors.minStock = 'Minimum stock must be a valid number';
    }

    if (formData?.cost && (isNaN(formData?.cost) || parseFloat(formData?.cost) < 0)) {
      newErrors.cost = 'Cost price must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (skuStatus === "taken") {
      setErrors((prev) => ({
        ...prev,
        sku: "SKU already exists",
      }));
      return;
    }


    setIsSubmitting(true);
    
    try {
      // Map form data to frontend Product format (parent will handle API mapping)
      const productData = {
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        description: formData?.description || '',
        stock: parseInt(formData?.stock) || 0,
        minStock: formData?.minStock ? parseInt(formData?.minStock) : 0,
        price: parseFloat(formData?.price) || 0,
        cost: formData?.cost ? parseFloat(formData?.cost) : 0,
        supplier: formData.supplier || '',
        lastUpdated: new Date()?.toISOString()
      };

      if (product) {
        productData._id = product?._id;
      }

      await onSave(productData);
      onClose();

    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-200 p-4">
      <div className="bg-card rounded-lg shadow-modal w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground mb-4">Basic Information</h3>
              
              <Input
                label="Product Name"
                type="text"
                placeholder="Enter product name"
                value={formData?.name}
                onChange={(e) => handleInputChange('name', e?.target?.value)}
                error={errors?.name}
                required
                disabled={isSubmitting}
              />

              <Input
                label="SKU (Stock Keeping Unit)"
                type="text" 
                placeholder="Auto-generated or enter manually"
                value={formData.sku}
                onChange={(e) => {
                  setIsSkuManual(true);
                  handleInputChange("sku", e.target.value.toUpperCase());
                }}
                error={
                  skuStatus === "taken"
                    ? "SKU already exists"
                    : errors.sku
                }
                disabled={isSubmitting}
              />
              {skuStatus === "checking" && (
                <p className="text-sm text-muted-foreground">
                  Checking SKU availability...
                </p>
              )}
              
              {skuStatus === "available" && (
                <p className="text-sm text-green-600">
                  SKU is available
                </p>
              )}
              
              {skuStatus === "taken" && existingProduct && !product && onSwitchToEdit && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 font-medium mb-2">
                    Product already exists: {existingProduct.name}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onSwitchToEdit(existingProduct);
                      onClose();
                    }}
                    iconName="Edit"
                    iconPosition="left"
                  >
                    Update Existing Product
                  </Button>
                </div>
              )}

              
              <Select
                label="Category"
                placeholder={
                  categoryLoading
                    ? "Loading categories..."
                    : categoryError
                    ? "Failed to load categories"
                    : "Select category"
                }
                options={categories}
                value={formData?.category}
                onChange={(value) => handleInputChange("category", value)}
                error={errors.category}
                required
                disabled={isSubmitting || categoryLoading}
              />


              <Input
                label="Description"
                type="text"
                placeholder="Enter product description (optional)"
                value={formData?.description}
                onChange={(e) => handleInputChange('description', e?.target?.value)}
                disabled={isSubmitting}
              />
            </div>

            {/* Stock & Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground mb-4">Stock & Pricing</h3>
              
              <Input
                label="Current Stock"
                type="number"
                placeholder="Enter current stock quantity"
                value={formData?.stock}
                onChange={(e) => handleInputChange('stock', e?.target?.value)}
                error={errors?.stock}
                required
                min="0"
                disabled={isSubmitting}
              />

                <Input
                  label="Minimum Stock"
                  type="number"
                  placeholder="Min stock level"
                  value={formData?.minStock}
                  onChange={(e) => handleInputChange('minStock', e?.target?.value)}
                  error={errors?.minStock}
                  min="0"
                  disabled={isSubmitting}
                />


              <Input
                label="Unit Price (Rs)"
                type="number"
                placeholder="Enter selling price"
                value={formData?.price}
                onChange={(e) => handleInputChange('price', e?.target?.value)}
                error={errors?.price}
                required
                min="0"
                step="0.01"
                disabled={isSubmitting}
              />

              <Input
                label="Cost Price (Rs)"
                type="number"
                placeholder="Enter cost price (optional)"
                value={formData?.cost}
                onChange={(e) => handleInputChange('cost', e?.target?.value)}
                error={errors?.cost}
                min="0"
                step="0.01"
                disabled={isSubmitting}
              />
            </div>

            {/* Additional Details */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-medium text-foreground mb-4">Additional Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Select
                    label="Supplier"
                    placeholder={
                      supplierLoading
                        ? "Loading suppliers..."
                        : "Select supplier (optional)"
                    }
                    options={suppliers}
                    value={formData?.supplier}
                    onChange={(value) => handleInputChange('supplier', value)}
                    disabled={isSubmitting || supplierLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowAddSupplier(!showAddSupplier)}
                    className="mt-2 inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    <Icon name={showAddSupplier ? 'ChevronUp' : 'Plus'} size={14} />
                    {showAddSupplier ? 'Cancel' : 'Add New Supplier'}
                  </button>
                </div>
              </div>

              {showAddSupplier && (
                <div className="p-4 bg-muted/40 border border-border rounded-lg space-y-3">
                  <p className="text-sm font-medium text-foreground">Quick Add Supplier</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Input
                      label="Name"
                      type="text"
                      placeholder="Supplier name"
                      value={newSupplier.name}
                      onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                      required
                      disabled={addingSupplier}
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      placeholder="98XXXXXXXX"
                      value={newSupplier.phone}
                      onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                      disabled={addingSupplier}
                    />
                    <Input
                      label="Company"
                      type="text"
                      placeholder="Company name"
                      value={newSupplier.company}
                      onChange={(e) => setNewSupplier({ ...newSupplier, company: e.target.value })}
                      disabled={addingSupplier}
                    />
                    <Input
                      label="Email"
                      type="email"
                      placeholder="supplier@email.com"
                      value={newSupplier.email}
                      onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                      disabled={addingSupplier}
                    />
                    <Input
                      label="Address"
                      type="text"
                      placeholder="Enter address"
                      value={newSupplier.address}
                      onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                      disabled={addingSupplier}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      onClick={handleAddSupplier}
                      loading={addingSupplier}
                      disabled={!newSupplier.name.trim() || addingSupplier}
                      iconName="Plus"
                      iconPosition="left"
                    >
                      Add Supplier
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              loading={isSubmitting}
              iconName="Save"
              iconPosition="left"
            >
              {product ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;