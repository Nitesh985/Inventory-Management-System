import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkImport = ({ onImport, isLoading = false }) => {
  const [dragActive, setDragActive] = useState(false);
  const [importData, setImportData] = useState(null);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === "dragenter" || e?.type === "dragover") {
      setDragActive(true);
    } else if (e?.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      handleFile(e?.dataTransfer?.files?.[0]);
    }
  };

  const handleChange = (e) => {
    e?.preventDefault();
    if (e?.target?.files && e?.target?.files?.[0]) {
      handleFile(e?.target?.files?.[0]);
    }
  };

  const handleFile = (file) => {
    if (file?.type !== 'text/csv' && !file?.name?.endsWith('.csv')) {
      setErrors(['Please upload a CSV file']);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e?.target?.result;
        const lines = csv?.split('\n');
        const headers = lines?.[0]?.split(',')?.map(h => h?.trim()?.toLowerCase());
        
        const requiredHeaders = ['amount', 'category', 'vendor', 'date'];
        const missingHeaders = requiredHeaders?.filter(h => !headers?.includes(h));
        
        if (missingHeaders?.length > 0) {
          setErrors([`Missing required columns: ${missingHeaders?.join(', ')}`]);
          return;
        }

        const data = [];
        const parseErrors = [];

        for (let i = 1; i < lines?.length; i++) {
          if (lines?.[i]?.trim() === '') continue;
          
          const values = lines?.[i]?.split(',')?.map(v => v?.trim());
          const row = {};
          
          headers?.forEach((header, index) => {
            row[header] = values?.[index] || '';
          });

          // Validate row data
          if (!row?.amount || isNaN(parseFloat(row?.amount))) {
            parseErrors?.push(`Row ${i + 1}: Invalid amount`);
            continue;
          }
          
          if (!row?.category) {
            parseErrors?.push(`Row ${i + 1}: Missing category`);
            continue;
          }
          
          if (!row?.vendor) {
            parseErrors?.push(`Row ${i + 1}: Missing vendor`);
            continue;
          }
          
          if (!row?.date || isNaN(Date.parse(row?.date))) {
            parseErrors?.push(`Row ${i + 1}: Invalid date format`);
            continue;
          }

          data?.push({
            id: Date.now() + Math.random(),
            amount: parseFloat(row?.amount),
            category: row?.category,
            vendor: row?.vendor,
            date: new Date(row.date)?.toISOString()?.split('T')?.[0],
            description: row?.description || '',
            isTaxRelated: row?.tax_related === 'true' || row?.tax_related === '1',
            receipts: []
          });
        }

        if (parseErrors?.length > 0) {
          setErrors(parseErrors);
        } else {
          setErrors([]);
        }

        setImportData(data);
      } catch (error) {
        setErrors(['Error parsing CSV file. Please check the format.']);
      }
    };
    
    reader?.readAsText(file);
  };

  const handleImport = () => {
    if (importData && importData?.length > 0) {
      onImport(importData);
      setImportData(null);
      setErrors([]);
      if (fileInputRef?.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const downloadTemplate = () => {
    const csvContent = `amount,category,vendor,date,description,tax_related
100.50,office-supplies,Amazon Business,2024-11-01,Office supplies purchase,false
250.00,travel,Uber for Business,2024-11-02,Client meeting transportation,true
75.25,utilities,Electric Company,2024-11-03,Monthly electricity bill,true`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expense_import_template.csv';
    a?.click();
    window.URL?.revokeObjectURL(url);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="Upload" size={20} className="text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Bulk Import</h3>
            <p className="text-sm text-muted-foreground">Import multiple expenses from CSV</p>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={downloadTemplate}
          iconName="Download"
          iconPosition="left"
        >
          Download Template
        </Button>
      </div>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Icon name="FileSpreadsheet" size={24} className="text-muted-foreground" />
          </div>
          
          <div>
            <p className="text-lg font-medium text-foreground">
              Drop CSV file here or click to upload
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Required columns: amount, category, vendor, date
            </p>
          </div>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef?.current?.click()}
            iconName="Plus"
            iconPosition="left"
          >
            Choose CSV File
          </Button>
        </div>
      </div>
      {/* Errors */}
      {errors?.length > 0 && (
        <div className="mt-4 p-4 bg-error/10 border border-error/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="AlertCircle" size={16} className="text-error" />
            <span className="text-sm font-medium text-error">Import Errors</span>
          </div>
          <ul className="text-sm text-error space-y-1">
            {errors?.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
      {/* Preview */}
      {importData && importData?.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-foreground">
              Preview ({importData?.length} expenses)
            </h4>
            <Button
              variant="default"
              onClick={handleImport}
              loading={isLoading}
              iconName="Check"
              iconPosition="left"
            >
              Import Expenses
            </Button>
          </div>
          
          <div className="max-h-64 overflow-y-auto border border-border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 font-medium text-foreground">Amount</th>
                  <th className="text-left p-3 font-medium text-foreground">Category</th>
                  <th className="text-left p-3 font-medium text-foreground">Vendor</th>
                  <th className="text-left p-3 font-medium text-foreground">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {importData?.slice(0, 10)?.map((expense, index) => (
                  <tr key={index} className="hover:bg-muted/50">
                    <td className="p-3 text-foreground font-medium">
                      ${expense?.amount?.toFixed(2)}
                    </td>
                    <td className="p-3 text-muted-foreground">{expense?.category}</td>
                    <td className="p-3 text-muted-foreground">{expense?.vendor}</td>
                    <td className="p-3 text-muted-foreground">
                      {new Date(expense.date)?.toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {importData?.length > 10 && (
              <div className="p-3 text-center text-sm text-muted-foreground bg-muted">
                ... and {importData?.length - 10} more expenses
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkImport;