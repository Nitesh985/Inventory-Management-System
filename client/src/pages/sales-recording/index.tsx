import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import CustomerSelector from '@/components/customer/CustomerSelector';
import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';

import ProductSelector from './components/ProductSelector';
import TransactionSummary from './components/TransactionSummary';
import PaymentMethodSelector from './components/PaymentMethodSelector';
import TransactionActions from './components/TransactionActions';
import { useMutation } from '@/hooks/useMutation';
import { createSale } from '@/api/sales';


interface LineItem {
  id: number;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  total: number;
  stock: number;
}

interface Customer {
  id: string;
  name: string;
}

const SalesRecording: React.FC = () => {
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [transactionDate, setTransactionDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [amountReceived, setAmountReceived] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const { mutate: createSaleMutation, loading: creatingSale } = useMutation(createSale);

  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  const discountedSubtotal = subtotal - discount;
  const totalAmount = discountedSubtotal;

  const handleAddCustomer = (customer: Customer) => {
    setCustomers(prev => [...prev, customer]);
  };

  const handleAddLineItem = (lineItem: LineItem) => {
    setLineItems(prev => [...prev, lineItem]);
  };

  const handleUpdateLineItem = (id: number, newQuantity: number) => {
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

  const handleRemoveLineItem = (id: number) => {
    setLineItems(prev => prev.filter(item => item.id !== id));
  };

  const handleRecordSale = async (): Promise<void> => {
    if (!isValidTransaction()) return;

    setIsProcessing(true);

    try {
      const saleData = {
        customerId: selectedCustomer,
        items: lineItems.map(item => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.total
        })),
        totalAmount: totalAmount,
        paidAmount: paymentMethod === 'CREDIT' ? 0 : (paymentMethod === 'CASH' ? amountReceived : totalAmount),
        paymentMethod: paymentMethod,
        discount: discount
      };

      await createSaleMutation(saleData);

      console.log('Sale recorded:', saleData);
      handleClearTransaction();
      alert('Sale recorded successfully!');
    } catch (error) {
      console.error('Error recording sale:', error);
      alert('Error recording sale. Please try again.');
    } finally {
      setIsProcessing(false);
    }
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
    setDiscount(0);
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
    <>
      <Helmet>
        <title>Sales Recording - Digital Khata</title>
        <meta name="description" content="Record and manage business sales transactions with customer details, product selection, and payment tracking for efficient sales management." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header 
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          syncStatus="online"
        />
        
        <Sidebar 
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          syncStatus="online"
        />

        <main className={`pt-16 pb-20 lg:pb-8 transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'
        }`}>
          <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="ShoppingCart" size={24} className="text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Sales Recording</h1>
                  <p className="text-muted-foreground">
                    Record new sales transactions with customer details and payment tracking
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content */}
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
                <TransactionSummary 
                  lineItems={lineItems} 
                  discountAmount={discount}
                  onDiscountChange={setDiscount}
                />

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
        </main>
      </div>
    </>
  );
};

export default SalesRecording;
