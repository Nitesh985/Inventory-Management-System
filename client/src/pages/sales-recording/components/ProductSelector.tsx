import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import { useFetch } from '@/hooks/useFetch';
import { getAllProducts } from '@/api/products';

interface Product {
  value: string;
  label: string;
  price: number;
  stock: number;
  category: string;
}

interface LineItem {
  id: number;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  total: number;
  stock: number;
}

interface ProductSelectorProps {
  lineItems: LineItem[];
  onAddLineItem: (item: LineItem) => void;
  onUpdateLineItem: (id: number, newQuantity: number) => void;
  onRemoveLineItem: (id: number) => void;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({
  lineItems,
  onAddLineItem,
  onUpdateLineItem,
  onRemoveLineItem,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const {data} = useFetch(getAllProducts)
  const products: Product[] = (data ?? []).map(p => ({
    value: p._id,
    label: p.name,
    price: p.price,
    stock: p.stock ?? 0,
    category: p.category ?? 'Uncategorized',
  }));

  const handleAddProduct = (): void => {
    if (selectedProduct && quantity > 0) {
      const product = products.find(p => p.value === selectedProduct);
      if (product && product.stock >= quantity) {
        const lineItem: LineItem = {
          id: Date.now(),
          productId: product.value,
          productName: product.label,
          price: product.price,
          quantity,
          total: product.price * quantity,
          stock: product.stock,
        };

        onAddLineItem(lineItem);
        setSelectedProduct('');
        setQuantity(1);
      }
    }
  };

  const getStockStatus = (
    stock: number,
  ): { color: string; label: string } => {
    if (stock === 0) return { color: 'text-error', label: 'Out of Stock' };
    if (stock <= 5) return { color: 'text-warning', label: 'Low Stock' };
    return { color: 'text-success', label: 'In Stock' };
  };

  const selectedProductData: Product | undefined =
    products.find(p => p.value === selectedProduct);

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
                label: `${product?.label} - Rs. ${Math.round(product?.price).toLocaleString()}`,
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
                <p className="text-sm text-muted-foreground">Price: <span className="text-xs">Rs.</span> {Math.round(selectedProductData?.price).toLocaleString()}</p>
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
                  Subtotal: <span className="text-xs">Rs.</span> {Math.round(selectedProductData?.price * quantity).toLocaleString()}
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
                    <span className="text-xs">Rs.</span> {Math.round(item?.price).toLocaleString()} × {item?.quantity}
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
                    <p className="font-medium text-foreground"><span className="text-xs">Rs.</span> {Math.round(item?.total).toLocaleString()}</p>
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


