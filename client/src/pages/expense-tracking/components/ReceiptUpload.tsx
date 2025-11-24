import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const ReceiptUpload = ({ receipts = [], onReceiptsChange }) => {
  const [dragActive, setDragActive] = useState(false);
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
      handleFiles(e?.dataTransfer?.files);
    }
  };

  const handleChange = (e) => {
    e?.preventDefault();
    if (e?.target?.files && e?.target?.files?.[0]) {
      handleFiles(e?.target?.files);
    }
  };

  const handleFiles = (files) => {
    const newReceipts = [];
    
    Array.from(files)?.forEach((file) => {
      if (file?.type?.startsWith('image/') || file?.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newReceipt = {
            id: Date.now() + Math.random(),
            file: file,
            name: file?.name,
            size: file?.size,
            type: file?.type,
            url: e?.target?.result,
            uploadedAt: new Date()?.toISOString()
          };
          newReceipts?.push(newReceipt);
          
          if (newReceipts?.length === files?.length) {
            onReceiptsChange([...receipts, ...newReceipts]);
          }
        };
        reader?.readAsDataURL(file);
      }
    });
  };

  const removeReceipt = (receiptId) => {
    onReceiptsChange(receipts?.filter(receipt => receipt?.id !== receiptId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
          <Icon name="Upload" size={20} className="text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Receipt Management</h3>
          <p className="text-sm text-muted-foreground">Upload receipts and supporting documents</p>
        </div>
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
          multiple
          accept="image/*,.pdf"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Icon name="Upload" size={24} className="text-muted-foreground" />
          </div>
          
          <div>
            <p className="text-lg font-medium text-foreground">
              Drop receipts here or click to upload
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Supports JPG, PNG, PDF files up to 10MB each
            </p>
          </div>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef?.current?.click()}
            iconName="Plus"
            iconPosition="left"
          >
            Choose Files
          </Button>
        </div>
      </div>
      {/* Uploaded Receipts */}
      {receipts?.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-foreground mb-4">
            Uploaded Receipts ({receipts?.length})
          </h4>
          
          <div className="space-y-3">
            {receipts?.map((receipt) => (
              <div key={receipt?.id} className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
                <div className="flex-shrink-0">
                  {receipt?.type?.startsWith('image/') ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-background">
                      <Image
                        src={receipt?.url}
                        alt={`Receipt preview for ${receipt?.name}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center">
                      <Icon name="FileText" size={20} className="text-error" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {receipt?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(receipt?.size)} • {new Date(receipt.uploadedAt)?.toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(receipt?.url, '_blank')}
                  >
                    <Icon name="Eye" size={16} />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeReceipt(receipt?.id)}
                    className="text-error hover:text-error hover:bg-error/10"
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

export default ReceiptUpload;