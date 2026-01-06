import Icon from '@/components/AppIcon';
import { useFetch } from '@/hooks/useFetch';
import { getCredits } from '@/api/credits';
import { getCustomers } from '@/api/customers';
import Loader from '@/components/Loader';
import { useMemo } from 'react';

const CreditStats: React.FC = () => {
  const { data: credits, loading: creditsLoading } = useFetch(getCredits, []);
  const { data: customers, loading: customersLoading } = useFetch(getCustomers, []);

  const stats = useMemo(() => {
    const creditsList = credits || [];
    const customersList = customers || [];
    
    // Calculate total receivable (positive amounts - what customers owe)
    const totalReceivable = creditsList
      .filter((c: any) => c.amount > 0)
      .reduce((sum: number, c: any) => sum + c.amount, 0);
    
    // Calculate total received/collected (negative amounts - payments received)
    const totalReceived = Math.abs(
      creditsList
        .filter((c: any) => c.amount < 0)
        .reduce((sum: number, c: any) => sum + c.amount, 0)
    );
    
    // Count active customers with outstanding credits
    const activeCustomerIds = new Set(
      creditsList
        .filter((c: any) => c.amount > 0)
        .map((c: any) => c.customerId?._id || c.customerId)
    );
    
    return {
      totalReceivable,
      totalReceived,
      activeCustomers: activeCustomerIds.size || customersList.length
    };
  }, [credits, customers]);

  const loading = creditsLoading || customersLoading;

  return (
    <Loader loading={loading}>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white border border-border p-5 rounded-xl flex items-center gap-4 shadow-sm">
        <div className="p-3 bg-red-50 text-red-600 rounded-lg"><Icon name="ArrowUpRight" /></div>
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase">Total Receivable</p>
          <h3 className="text-2xl font-bold">Rs. {stats.totalReceivable.toLocaleString()}</h3>
        </div>
      </div>
      <div className="bg-white border border-border p-5 rounded-xl flex items-center gap-4 shadow-sm">
        <div className="p-3 bg-green-50 text-green-600 rounded-lg"><Icon name="ArrowDownLeft" /></div>
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase">Total Collected</p>
          <h3 className="text-2xl font-bold">Rs. {stats.totalReceived.toLocaleString()}</h3>
        </div>
      </div>
      <div className="bg-white border border-border p-5 rounded-xl flex items-center gap-4 shadow-sm">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Icon name="Users" /></div>
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase">Active Customers</p>
          <h3 className="text-2xl font-bold">{stats.activeCustomers}</h3>
        </div>
      </div>
    </div>
    </Loader>
  );
};

export default CreditStats;