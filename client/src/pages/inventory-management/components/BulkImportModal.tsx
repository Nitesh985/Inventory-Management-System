import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkImportModal = ({ isOpen, onClose, onImport }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const [step, setStep] = useState('upload'); // 'upload', 'processing', 'results'
  const fileInputRef = useRef(null);

  const sampleData = `Product Name,SKU,Category,Current Stock,Min Stock,Max Stock,Unit Price,Cost Price,Description
iPhone 15 Pro,IPH15PRO001,electronics,25,5,100,999.00,750.00,Latest iPhone model with Pro features
Samsung Galaxy S24,SGS24001,electronics,15,3,50,899.00,650.00,Premium Android smartphone
MacBook Air M3,MBA-M3-001,electronics,8,2,20,1299.00,950.00,Latest MacBook Air with M3 chip
Wireless Earbuds,WEB001,electronics,50,10,200,79.99,45.00,Bluetooth wireless earbuds with noise cancellation`;

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
      handleFileSelect(e?.dataTransfer?.files?.[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (file && file?.type === 'text/csv') {
      setSelectedFile(file);
    } else {
      alert('Please select a valid CSV file.');
    }
  };

  const handleFileInputChange = (e) => {
    if (e?.target?.files && e?.target?.files?.[0]) {
      handleFileSelect(e?.target?.files?.[0]);
    }
  };

  const processImport = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setStep('processing');

    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock import results
      const mockResults = {
        total: 156,
        successful: 142,
        failed: 14,
        errors: [
          { row: 5, error: 'Invalid SKU format: must be alphanumeric' },
          { row: 12, error: 'Missing required field: Product Name' },
          { row: 23, error: 'Invalid price: must be a positive number' },
          { row: 34, error: 'Category not found: electronics2' },
          { row: 45, error: 'Duplicate SKU: IPH15PRO001' }
        ]
      };

      setImportResults(mockResults);
      setStep('results');

      // Call the parent import handler
      if (mockResults?.successful > 0) {
        onImport(mockResults);
      }
    } catch (error) {
      console.error('Import failed:', error);
      setImportResults({
        total: 0,
        successful: 0,
        failed: 0,
        errors: [{ row: 0, error: 'Failed to process file. Please try again.' }]
      });
      setStep('results');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadSampleCSV = () => {
    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory_sample.csv';
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    window.URL?.revokeObjectURL(url);
  };

  const resetModal = () => {
    setSelectedFile(null);
    setImportResults(null);
    setStep('upload');
    setIsProcessing(false);
    if (fileInputRef?.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-200 p-4">
      <div className="bg-card rounded-lg shadow-modal w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            Bulk Import Products
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            disabled={isProcessing}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {step === 'upload' && (
            <div className="space-y-6">
              {/* Instructions */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-medium text-foreground mb-2">Import Instructions</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Upload a CSV file with product information</li>
                  <li>• Required columns: Product Name, SKU, Category, Current Stock, Unit Price</li>
                  <li>• Optional columns: Min Stock, Max Stock, Cost Price, Description</li>
                  <li>• Maximum file size: 10MB</li>
                </ul>
              </div>

              {/* Sample Download */}
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <h4 className="font-medium text-foreground">Download Sample CSV</h4>
                  <p className="text-sm text-muted-foreground">
                    Use this template to format your data correctly
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={downloadSampleCSV}
                  iconName="Download"
                  iconPosition="left"
                >
                  Download Template
                </Button>
              </div>

              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-primary bg-primary/5'
                    : selectedFile
                    ? 'border-success bg-success/5' :'border-border hover:border-primary/50'
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
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="space-y-4">
                    <Icon name="FileCheck" size={48} className="mx-auto text-success" />
                    <div>
                      <h3 className="font-medium text-foreground">{selectedFile?.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile?.size / 1024)?.toFixed(1)} KB • Ready to import
                      </p>
                    </div>
                    <div className="flex items-center justify-center space-x-3">
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef?.current?.click()}
                      >
                        Choose Different File
                      </Button>
                      <Button
                        variant="default"
                        onClick={processImport}
                        iconName="Upload"
                        iconPosition="left"
                      >
                        Start Import
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Icon name="Upload" size={48} className="mx-auto text-muted-foreground" />
                    <div>
                      <h3 className="font-medium text-foreground">Drop your CSV file here</h3>
                      <p className="text-sm text-muted-foreground">
                        or click to browse and select a file
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef?.current?.click()}
                    >
                      Choose File
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="text-center py-12 space-y-6">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="RefreshCw" size={32} className="text-primary animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">Processing Import</h3>
                <p className="text-muted-foreground">
                  Please wait while we process your file...
                </p>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </div>
          )}

          {step === 'results' && importResults && (
            <div className="space-y-6">
              {/* Results Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{importResults?.total}</div>
                  <div className="text-sm text-muted-foreground">Total Records</div>
                </div>
                <div className="text-center p-4 bg-success/10 rounded-lg">
                  <div className="text-2xl font-bold text-success">{importResults?.successful}</div>
                  <div className="text-sm text-muted-foreground">Successful</div>
                </div>
                <div className="text-center p-4 bg-error/10 rounded-lg">
                  <div className="text-2xl font-bold text-error">{importResults?.failed}</div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </div>
              </div>

              {/* Errors */}
              {importResults?.errors && importResults?.errors?.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Import Errors</h4>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {importResults?.errors?.slice(0, 10)?.map((error, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-error/5 border border-error/20 rounded-lg">
                        <Icon name="AlertCircle" size={16} className="text-error mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground">
                            Row {error?.row}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {error?.error}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {importResults?.errors?.length > 10 && (
                    <p className="text-sm text-muted-foreground">
                      And {importResults?.errors?.length - 10} more errors...
                    </p>
                  )}
                </div>
              )}

              {/* Success Message */}
              {importResults?.successful > 0 && (
                <div className="flex items-center space-x-3 p-4 bg-success/10 border border-success/20 rounded-lg">
                  <Icon name="CheckCircle" size={20} className="text-success flex-shrink-0" />
                  <div>
                    <div className="font-medium text-foreground">
                      Import Completed Successfully
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {importResults?.successful} products have been added to your inventory.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-4 p-6 border-t border-border">
          {step === 'results' ? (
            <>
              <Button
                variant="outline"
                onClick={resetModal}
              >
                Import More
              </Button>
              <Button
                variant="default"
                onClick={handleClose}
              >
                Done
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isProcessing}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkImportModal;