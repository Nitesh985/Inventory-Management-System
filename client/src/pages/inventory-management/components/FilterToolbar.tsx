import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const FilterToolbar = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  onBulkImport, 
  onBulkExport,
  totalProducts,
  filteredCount 
}) => {
  const categoryOptions = [
    { value: '', label: 'All Categories' },
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

  const stockStatusOptions = [
    { value: '', label: 'All Stock Levels' },
    { value: 'in-stock', label: 'In Stock' },
    { value: 'low-stock', label: 'Low Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' }
  ];

  const priceRangeOptions = [
    { value: '', label: 'All Prices' },
    { value: '0-10', label: '$0 - $10' },
    { value: '10-50', label: '$10 - $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100-500', label: '$100 - $500' },
    { value: '500+', label: '$500+' }
  ];

  const hasActiveFilters = filters?.category || filters?.stockStatus || filters?.priceRange;

  return (
    <div className="bg-card rounded-lg border border-border p-4 space-y-4">
      {/* Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="flex-1 min-w-0">
            <Select
              placeholder="Filter by category"
              options={categoryOptions}
              value={filters?.category}
              onChange={(value) => onFilterChange('category', value)}
              className="w-full"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <Select
              placeholder="Filter by stock status"
              options={stockStatusOptions}
              value={filters?.stockStatus}
              onChange={(value) => onFilterChange('stockStatus', value)}
              className="w-full"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <Select
              placeholder="Filter by price range"
              options={priceRangeOptions}
              value={filters?.priceRange}
              onChange={(value) => onFilterChange('priceRange', value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
      {/* Results Summary and Bulk Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground">
            Showing {filteredCount} of {totalProducts} products
          </div>
          
          {hasActiveFilters && (
            <div className="flex items-center space-x-2">
              <Icon name="Filter" size={14} className="text-primary" />
              <span className="text-sm font-medium text-primary">Filters Applied</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkImport}
            iconName="Upload"
            iconPosition="left"
          >
            Import CSV
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkExport}
            iconName="Download"
            iconPosition="left"
            disabled={filteredCount === 0}
          >
            Export CSV
          </Button>
        </div>
      </div>
      {/* Quick Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          {filters?.category && (
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              <span>Category: {categoryOptions?.find(opt => opt?.value === filters?.category)?.label}</span>
              <button
                onClick={() => onFilterChange('category', '')}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
          
          {filters?.stockStatus && (
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              <span>Stock: {stockStatusOptions?.find(opt => opt?.value === filters?.stockStatus)?.label}</span>
              <button
                onClick={() => onFilterChange('stockStatus', '')}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
          
          {filters?.priceRange && (
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              <span>Price: {priceRangeOptions?.find(opt => opt?.value === filters?.priceRange)?.label}</span>
              <button
                onClick={() => onFilterChange('priceRange', '')}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterToolbar;