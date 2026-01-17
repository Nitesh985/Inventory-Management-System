import React from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import * as LucideIcons from 'lucide-react';

interface PaymentMethodSelectorProps {
  paymentMethod: string;
  onPaymentMethodChange: (value: string) => void;
  amountReceived: number;
  onAmountReceivedChange: (value: number) => void;
  totalAmount: number;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ 
  paymentMethod, 
  onPaymentMethodChange, 
  amountReceived, 
  onAmountReceivedChange, 
  totalAmount 
}) => {
  const paymentMethods: { value: string; label: string; icon: keyof typeof LucideIcons }[] = [
    { value: 'CASH', label: 'Cash', icon: 'Banknote' },
    { value: 'CREDIT', label: 'Credit', icon: 'Book' },
    { value: 'ESEWA', label: 'Esewa', icon: 'Smartphone' },
    { value: 'KHALTI', label: 'Khalti', icon: 'Wallet' }
  ];

  const selectedMethod = paymentMethods?.find(method => method?.value === paymentMethod);
  const changeAmount = amountReceived - totalAmount;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Payment Information</h3>
      <Select
        label="Payment Method"
        placeholder="Select payment method"
        options={paymentMethods?.map(method => ({
          value: method?.value,
          label: method?.label
        }))}
        value={paymentMethod}
        onChange={onPaymentMethodChange}
        required
      />
      {selectedMethod && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-4">
          <div className="flex items-center space-x-2">
            <Icon name={selectedMethod?.icon} size={20} className="text-primary" />
            <span className="font-medium text-foreground">{selectedMethod?.label}</span>
          </div>

          {paymentMethod === 'CASH' && (
            <div className="space-y-3">
              <Input
                label="Amount Received"
                type="number"
                step="0.01"
                min={totalAmount}
                placeholder="Enter amount received"
                value={amountReceived}
                onChange={(e) => onAmountReceivedChange(parseFloat(e?.target?.value) || 0)}
              />
              
              {amountReceived > 0 && (
                <div className="bg-muted p-3 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Amount:</span>
                    <span className="font-medium text-foreground"><span className="text-xs">Rs.</span> {Math.round(totalAmount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount Received:</span>
                    <span className="font-medium text-foreground"><span className="text-xs">Rs.</span> {Math.round(amountReceived).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-border">
                    <span className="text-muted-foreground">Change:</span>
                    <span className={`font-medium ${changeAmount >= 0 ? 'text-success' : 'text-error'}`}>
                      <span className="text-xs">Rs.</span> {Math.round(Math.abs(changeAmount)).toLocaleString()}
                      {changeAmount < 0 && ' (Insufficient)'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {paymentMethod === 'CREDIT' && (
            <div className="bg-warning/10 border border-warning/20 p-3 rounded-lg">
              <div className="flex items-center space-x-2 text-warning">
                <Icon name="AlertTriangle" size={16} />
                <span className="text-sm font-medium">This sale will be recorded as credit (Pending)</span>
              </div>
            </div>
          )}

          {paymentMethod === 'ESEWA' && (
            <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
              <div className="flex items-center space-x-2 text-green-600">
                <Icon name="Smartphone" size={16} />
                <span className="text-sm font-medium">Esewa payment - Verify transaction before confirming</span>
              </div>
            </div>
          )}

          {paymentMethod === 'KHALTI' && (
            <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg">
              <div className="flex items-center space-x-2 text-purple-600">
                <Icon name="Wallet" size={16} />
                <span className="text-sm font-medium">Khalti payment - Verify transaction before confirming</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;