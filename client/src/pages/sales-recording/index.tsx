import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import CustomerSelector from '@/components/customer/CustomerSelector';

import ProductSelector from './components/ProductSelector';
import TransactionSummary from './components/TransactionSummary';
import PaymentMethodSelector from './components/PaymentMethodSelector';
import TransactionActions from './components/TransactionActions';

/* ----------------------------------
 * Local Types (minimal & safe)
 * ---------------------------------- */
interface LineItem {
  id: string;
  productId?: string;
  name?: string;
  price: number;
  quantity: number;
  total: number;
}

interface Customer {
  id: string;
  name: string;
}

const SalesRecording: React.FC = () => {
  const navigate = useNavigate();

  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [transactionDate, setTransactionDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [amountReceived, setAmountReceived] = useState<number>(0);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const taxRate = 8.25;
  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const totalAmount = subtotal + taxAmount;

  const handleAddCustomer = (customer: Customer) => {
    setCustomers(prev => [...prev, customer]);
  };

  const handleAddLineItem = (lineItem: LineItem) => {
    setLineItems(prev => [...prev, lineItem]);
  };

  const handleUpdateLineItem = (id: string, newQuantity: number) => {
    setLineItems(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              quantity: newQuantity,
              total: item.price * newQuantity,
            }
          : item
      )
    );
  };

  const handleRemoveLineItem = (id: string) => {
    setLineItems(prev => prev.filter(item => item.id !== id));
  };

  const handleRecordSale = async (): Promise<void> => {
    if (!isValidTransaction()) return;

    setIsProcessing(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const saleData = {
      id: `SALE-${Date.now()}`,
      customer: selectedCustomer,
      date: transactionDate,
      items: lineItems,
      subtotal,
      tax: taxAmount,
      total: totalAmount,
      paymentMethod,
      amountReceived: paymentMethod === 'cash' ? amountReceived : totalAmount,
      change:
        paymentMethod === 'cash'
          ? Math.max(0, amountReceived - totalAmount)
          : 0,
      timestamp: new Date().toISOString(),
    };

    console.log('Sale recorded:', saleData);

    handleClearTransaction();
    setIsProcessing(false);

    alert('Sale recorded successfully!');
  };

  const handleSaveAsDraft = (): void => {
    const draftData = {
      customer: selectedCustomer,
      date: transactionDate,
      items: lineItems,
      paymentMethod,
      savedAt: new Date().toISOString(),
    };

    console.log('Draft saved:', draftData);
    alert('Transaction saved as draft!');
  };

  const handlePrintReceipt = (): void => {
    const receiptData = {
      customer: selectedCustomer,
      date: transactionDate,
      items: lineItems,
      subtotal,
      tax: taxAmount,
      total: totalAmount,
      paymentMethod,
    };

    console.log('Printing receipt:', receiptData);
    alert('Receipt sent to printer!');
  };

  const handleClearTransaction = (): void => {
    setSelectedCustomer('');
    setPaymentMethod('');
    setAmountReceived(0);
    setLineItems([]);
  };

  const isValidTransaction = (): boolean => {
    return (
      lineItems.length > 0 &&
      !!selectedCustomer &&
      !!paymentMethod &&
      (paymentMethod !== 'cash' || amountReceived >= totalAmount)
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/business-dashboard')}
              >
                <Icon name="ArrowLeft" size={20} />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  Sales Recording
                </h1>
                <p className="text-sm text-muted-foreground">
                  Record new sales transactions
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-success/10 px-3 py-1 rounded-full flex items-center space-x-2">
                <Icon name="Wifi" size={14} className="text-success" />
                <span className="text-xs font-medium text-success">
                  Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transaction Details */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Transaction Details
                </h2>
                <div className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Transaction Date"
                  type="date"
                  value={transactionDate}
                  onChange={e => setTransactionDate(e.target.value)}
                  required
                />
                <div className="flex items-end">
                  <div className="bg-muted px-3 py-2 rounded-lg border border-border flex items-center space-x-2">
                    <Icon
                      name="Hash"
                      size={16}
                      className="text-muted-foreground"
                    />
                    <span className="text-sm font-medium text-foreground">
                      SALE-{Date.now().toString().slice(-6)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Selection */}
            <div className="bg-card border border-border rounded-lg p-6">
              <CustomerSelector
                selectedCustomer={selectedCustomer}
                onCustomerSelect={setSelectedCustomer}
                onAddCustomer={handleAddCustomer}
              />
            </div>

            {/* Product Selection */}
            <div className="bg-card border border-border rounded-lg p-6">
              <ProductSelector
                lineItems={lineItems}
                onAddLineItem={handleAddLineItem}
                onUpdateLineItem={handleUpdateLineItem}
                onRemoveLineItem={handleRemoveLineItem}
              />
            </div>

            {/* Payment Method */}
            <div className="bg-card border border-border rounded-lg p-6">
              <PaymentMethodSelector
                paymentMethod={paymentMethod}
                onPaymentMethodChange={setPaymentMethod}
                amountReceived={amountReceived}
                onAmountReceivedChange={setAmountReceived}
                totalAmount={totalAmount}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <TransactionSummary lineItems={lineItems} taxRate={taxRate} />

            <TransactionActions
              onRecordSale={handleRecordSale}
              onSaveAsDraft={handleSaveAsDraft}
              onPrintReceipt={handlePrintReceipt}
              onClearTransaction={handleClearTransaction}
              isValid={isValidTransaction()}
              isProcessing={isProcessing}
              hasItems={lineItems.length > 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesRecording;
