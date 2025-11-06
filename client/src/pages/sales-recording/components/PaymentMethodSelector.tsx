import React from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const PaymentMethodSelector = ({ 
  paymentMethod, 
  onPaymentMethodChange, 
  amountReceived, 
  onAmountReceivedChange, 
  totalAmount 
}) => {
  const paymentMethods = [
    { value: 'cash', label: 'Cash', icon: 'Banknote' },
    { value: 'card', label: 'Credit/Debit Card', icon: 'CreditCard' },
    { value: 'digital', label: 'Digital Payment', icon: 'Smartphone' },
    { value: 'check', label: 'Check', icon: 'FileText' },
    { value: 'bank_transfer', label: 'Bank Transfer', icon: 'Building2' }
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

          {paymentMethod === 'cash' && (
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
                    <span className="font-medium text-foreground">${totalAmount?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount Received:</span>
                    <span className="font-medium text-foreground">${amountReceived?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-border">
                    <span className="text-muted-foreground">Change:</span>
                    <span className={`font-medium ${changeAmount >= 0 ? 'text-success' : 'text-error'}`}>
                      ${Math.abs(changeAmount)?.toFixed(2)}
                      {changeAmount < 0 && ' (Insufficient)'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex items-center space-x-2 text-success">
                <Icon name="CheckCircle" size={16} />
                <span className="text-sm font-medium">Card payment will be processed at checkout</span>
              </div>
            </div>
          )}

          {paymentMethod === 'digital' && (
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex items-center space-x-2 text-primary">
                <Icon name="Smartphone" size={16} />
                <span className="text-sm font-medium">Digital payment (PayPal, Venmo, etc.)</span>
              </div>
            </div>
          )}

          {paymentMethod === 'check' && (
            <div className="space-y-3">
              <Input
                label="Check Number"
                type="text"
                placeholder="Enter check number"
              />
              <div className="bg-warning/10 border border-warning/20 p-3 rounded-lg">
                <div className="flex items-center space-x-2 text-warning">
                  <Icon name="AlertTriangle" size={16} />
                  <span className="text-sm font-medium">Check payments require verification</span>
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'bank_transfer' && (
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex items-center space-x-2 text-primary">
                <Icon name="Building2" size={16} />
                <span className="text-sm font-medium">Bank transfer confirmation required</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;