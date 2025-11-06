import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const ProductSelector = ({ lineItems, onAddLineItem, onUpdateLineItem, onRemoveLineItem }) => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  const products = [
    { value: 'prod-001', label: 'iPhone 15 Pro', price: 999.00, stock: 25, category: 'Electronics' },
    { value: 'prod-002', label: 'Samsung Galaxy S24', price: 899.00, stock: 18, category: 'Electronics' },
    { value: 'prod-003', label: 'MacBook Air M3', price: 1299.00, stock: 12, category: 'Computers' },
    { value: 'prod-004', label: 'Dell XPS 13', price: 1199.00, stock: 8, category: 'Computers' },
    { value: 'prod-005', label: 'AirPods Pro', price: 249.00, stock: 45, category: 'Accessories' },
    { value: 'prod-006', label: 'Sony WH-1000XM5', price: 399.00, stock: 22, category: 'Accessories' },
    { value: 'prod-007', label: 'iPad Pro 12.9"', price: 1099.00, stock: 15, category: 'Tablets' },
    { value: 'prod-008', label: 'Surface Pro 9', price: 999.00, stock: 10, category: 'Tablets' },
    { value: 'prod-009', label: 'Apple Watch Series 9', price: 399.00, stock: 30, category: 'Wearables' },
    { value: 'prod-010', label: 'Fitbit Charge 6', price: 159.00, stock: 35, category: 'Wearables' }
  ];

  const handleAddProduct = () => {
    if (selectedProduct && quantity > 0) {
      const product = products?.find(p => p?.value === selectedProduct);
      if (product && product?.stock >= quantity) {
        const lineItem = {
          id: Date.now(),
          productId: product?.value,
          productName: product?.label,
          price: product?.price,
          quantity: quantity,
          total: product?.price * quantity,
          stock: product?.stock
        };
        onAddLineItem(lineItem);
        setSelectedProduct('');
        setQuantity(1);
      }
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { color: 'text-error', label: 'Out of Stock' };
    if (stock <= 5) return { color: 'text-warning', label: 'Low Stock' };
    return { color: 'text-success', label: 'In Stock' };
  };

  const selectedProductData = products?.find(p => p?.value === selectedProduct);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Product Selection</h3>
      <div className="bg-card border border-border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Select
              label="Select Product"
              placeholder="Search and select product"
              options={products?.map(product => ({
                value: product?.value,
                label: `${product?.label} - $${product?.price?.toFixed(2)}`,
                description: `Stock: ${product?.stock} | Category: ${product?.category}`
              }))}
              value={selectedProduct}
              onChange={setSelectedProduct}
              searchable
            />
          </div>
          <Input
            label="Quantity"
            type="number"
            min="1"
            max={selectedProductData?.stock || 999}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e?.target?.value) || 1)}
          />
        </div>

        {selectedProductData && (
          <div className="bg-muted p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{selectedProductData?.label}</p>
                <p className="text-sm text-muted-foreground">Price: ${selectedProductData?.price?.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${getStockStatus(selectedProductData?.stock)?.color}`}>
                  {getStockStatus(selectedProductData?.stock)?.label}
                </div>
                <p className="text-sm text-muted-foreground">Available: {selectedProductData?.stock}</p>
              </div>
            </div>
            {quantity > 0 && (
              <div className="mt-2 pt-2 border-t border-border">
                <p className="text-sm font-medium text-foreground">
                  Subtotal: ${(selectedProductData?.price * quantity)?.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        )}

        <Button
          variant="default"
          onClick={handleAddProduct}
          disabled={!selectedProduct || quantity <= 0 || (selectedProductData && quantity > selectedProductData?.stock)}
          iconName="Plus"
          iconPosition="left"
          className="w-full md:w-auto"
        >
          Add to Sale
        </Button>
      </div>
      {lineItems?.length > 0 && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-muted border-b border-border">
            <h4 className="font-medium text-foreground">Sale Items</h4>
          </div>
          <div className="divide-y divide-border">
            {lineItems?.map((item) => (
              <div key={item?.id} className="p-4 flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{item?.productName}</p>
                  <p className="text-sm text-muted-foreground">
                    ${item?.price?.toFixed(2)} × {item?.quantity}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onUpdateLineItem(item?.id, Math.max(1, item?.quantity - 1))}
                      disabled={item?.quantity <= 1}
                    >
                      <Icon name="Minus" size={16} />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">{item?.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onUpdateLineItem(item?.id, item?.quantity + 1)}
                      disabled={item?.quantity >= item?.stock}
                    >
                      <Icon name="Plus" size={16} />
                    </Button>
                  </div>
                  <div className="text-right min-w-0">
                    <p className="font-medium text-foreground">${item?.total?.toFixed(2)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveLineItem(item?.id)}
                    className="text-error hover:text-error"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSelector;