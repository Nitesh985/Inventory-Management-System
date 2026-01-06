import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

interface Product {
  id?: string | number;
  name?: string;
  sku?: string;
  category?: string;
  description?: string;
  currentStock?: number;
  minStock?: number;
  maxStock?: number;
  unitPrice?: number;
  costPrice?: number;
  supplier?: string;
  location?: string;
}

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSave: (productData: FormData) => void;
}

interface FormData {
  name: string;
  sku: string;
  category: string;
  description: string;
  unit: string;
  minStock: string;
  maxStock: string;
  price: string;
  cost: string;
  supplier: string;
  location: string;
}

interface FormErrors {
  [key: string]: string;
}

// TODO: Add reorderLevel
// TODO: Add reserve section

const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, product = null, onSave }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    sku: '',
    category: '',
    description: '',
    unit: '',
    minStock: '',
    maxStock: '',
    price: '',
    cost: '',
    supplier: '',
    location: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const categories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing & Apparel' },
    { value: 'food', label: 'Food & Beverages' },
    { value: 'books', label: 'Books & Stationery' },
    { value: 'home', label: 'Home & Garden' },
    { value: 'sports', label: 'Sports & Recreation' },
    { value: 'health', label: 'Health & Beauty' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'toys', label: 'Toys & Games' },
    { value: 'other', label: 'Other' }
  ];

  const suppliers = [
    { value: 'supplier1', label: 'ABC Electronics Ltd.' },
    { value: 'supplier2', label: 'Global Fashion House' },
    { value: 'supplier3', label: 'Fresh Foods Co.' },
    { value: 'supplier4', label: 'Tech Solutions Inc.' },
    { value: 'supplier5', label: 'Local Distributor' }
  ];

  const locations = [
    { value: 'warehouse-a', label: 'Warehouse A - Main' },
    { value: 'warehouse-b', label: 'Warehouse B - Secondary' },
    { value: 'store-front', label: 'Store Front' },
    { value: 'storage-room', label: 'Storage Room' },
    { value: 'display-area', label: 'Display Area' }
  ];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product?.name || '',
        sku: product?.sku || '',
        category: product?.category || '',
        description: product?.description || '',
        unit: product?.currentStock?.toString() || '0',
        minStock: product?.minStock?.toString() || '',
        maxStock: product?.maxStock?.toString() || '',
        price: product?.unitPrice?.toString() || '',
        cost: product?.costPrice?.toString() || '',
        supplier: product?.supplier || '',
        location: product?.location || ''
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        category: '',
        description: '',
        unit: '',
        minStock: '',
        maxStock: '',
        price: '',
        cost: '',
        supplier: '',
        location: ''
      });
    }
    setErrors({});
  }, [product, isOpen]);

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

    if (!formData?.unit || isNaN(formData?.unit) || parseInt(formData?.unit) < 0) {
      newErrors.unit = 'Valid current stock is required';
    }

    if (!formData?.price || isNaN(formData?.price) || parseFloat(formData?.price) <= 0) {
      newErrors.price = 'Valid unit price is required';
    }

    if (formData?.minStock && (isNaN(formData?.minStock) || parseInt(formData?.minStock) < 0)) {
      newErrors.minStock = 'Minimum stock must be a valid number';
    }

    if (formData?.maxStock && (isNaN(formData?.maxStock) || parseInt(formData?.maxStock) < 0)) {
      newErrors.maxStock = 'Maximum stock must be a valid number';
    }

    if (formData?.minStock && formData?.maxStock && parseInt(formData?.minStock) > parseInt(formData?.maxStock)) {
      newErrors.maxStock = 'Maximum stock must be greater than minimum stock';
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

    setIsSubmitting(true);
    
    try {
      // Map form data to frontend Product format (parent will handle API mapping)
      const productData = {
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        description: formData?.description || '',
        currentStock: parseInt(formData?.unit) || 0,
        minStock: formData?.minStock ? parseInt(formData?.minStock) : 0,
        maxStock: formData?.maxStock ? parseInt(formData?.maxStock) : 0,
        unitPrice: parseFloat(formData?.price) || 0,
        costPrice: formData?.cost ? parseFloat(formData?.cost) : 0,
        lastUpdated: new Date()?.toISOString()
      };

      if (product) {
        productData.id = product?.id;
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
                placeholder="Enter unique SKU"
                value={formData?.sku}
                onChange={(e) => handleInputChange('sku', e?.target?.value)}
                error={errors?.sku}
                required
                disabled={isSubmitting}
              />

              <Select
                label="Category"
                placeholder="Select category"
                options={categories}
                value={formData?.category}
                onChange={(value) => handleInputChange('category', value)}
                error={errors?.category}
                required
                disabled={isSubmitting}
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
                value={formData?.unit}
                onChange={(e) => handleInputChange('unit', e?.target?.value)}
                error={errors?.unit}
                required
                min="0"
                disabled={isSubmitting}
              />

              <div className="grid grid-cols-2 gap-4">
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
                  label="Maximum Stock"
                  type="number"
                  placeholder="Max stock level"
                  value={formData?.maxStock}
                  onChange={(e) => handleInputChange('maxStock', e?.target?.value)}
                  error={errors?.maxStock}
                  min="0"
                  disabled={isSubmitting}
                />
              </div>

              <Input
                label="Unit Price (USD)"
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
                label="Cost Price (USD)"
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
                <Select
                  label="Supplier"
                  placeholder="Select supplier (optional)"
                  options={suppliers}
                  value={formData?.supplier}
                  onChange={(value) => handleInputChange('supplier', value)}
                  disabled={isSubmitting}
                />

                <Select
                  label="Storage Location"
                  placeholder="Select location (optional)"
                  options={locations}
                  value={formData?.location}
                  onChange={(value) => handleInputChange('location', value)}
                  disabled={isSubmitting}
                />
              </div>
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