import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

interface TransactionActionsProps {
  onRecordSale: () => void;
  onSaveAsDraft: () => void;
  onPrintReceipt: () => void;
  onClearTransaction: () => void;
  isValid: boolean;
  isProcessing?: boolean;
  hasItems?: boolean;
}

const TransactionActions: React.FC<TransactionActionsProps> = ({ 
  onRecordSale, 
  onSaveAsDraft, 
  onPrintReceipt, 
  onClearTransaction,
  isValid,
  isProcessing = false,
  hasItems = false
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Actions</h3>
      
      <div className="bg-card border border-border rounded-lg p-4 space-y-3">
        {/* Primary Action - Record Sale */}
        <Button
          variant="default"
          size="lg"
          onClick={onRecordSale}
          disabled={!isValid || isProcessing}
          loading={isProcessing}
          iconName="CheckCircle"
          iconPosition="left"
          fullWidth
        >
          {isProcessing ? 'Recording Sale...' : 'Record Sale'}
        </Button>

        {/* Secondary Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={onSaveAsDraft}
            disabled={!hasItems || isProcessing}
            iconName="Save"
            iconPosition="left"
          >
            Save as Draft
          </Button>
          
          <Button
            variant="outline"
            onClick={onPrintReceipt}
            disabled={!hasItems || isProcessing}
            iconName="Printer"
            iconPosition="left"
          >
            Print Receipt
          </Button>
        </div>

        {/* Clear Transaction */}
        <Button
          variant="ghost"
          onClick={onClearTransaction}
          disabled={isProcessing}
          iconName="RotateCcw"
          iconPosition="left"
          fullWidth
          className="text-muted-foreground hover:text-foreground"
        >
          Clear Transaction
        </Button>
      </div>

      {/* Validation Messages */}
      {!isValid && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Icon name="AlertCircle" size={16} className="text-error mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-error">Please complete the following:</p>
              <ul className="text-xs text-error space-y-1">
                {!hasItems && <li>• Add at least one product to the sale</li>}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Success Indicators */}
      {hasItems && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">Ready to record sale</span>
          </div>
        </div>
      )}

      {/* Offline Indicator */}
      <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <Icon name="Wifi" size={16} className="text-success" />
          <div className="flex-1">
            <p className="text-sm font-medium text-success">Online</p>
            <p className="text-xs text-muted-foreground">Sales will be recorded immediately</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionActions;