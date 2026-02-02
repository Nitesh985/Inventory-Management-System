import Icon from '@/components/AppIcon';
import { useFetch } from '@/hooks/useFetch';
import { getCustomersWithBalance } from '@/api/credits';
import { useMemo } from 'react';

const CreditStats: React.FC = () => {
  const { data: customersData, loading } = useFetch(getCustomersWithBalance, []);

  const stats = useMemo(() => {
    // Handle API response format { success, data, message }
    const customersList = customersData?.data || customersData || [];
    
    // Calculate total receivable (customers with positive balance - they owe money)
    const totalReceivable = customersList
      .filter((c: any) => (c.balance || 0) > 0)
      .reduce((sum: number, c: any) => sum + (c.balance || 0), 0);
    
    // Calculate total advance (customers with negative balance - they have advance payments)
    const totalAdvance = Math.abs(
      customersList
        .filter((c: any) => (c.balance || 0) < 0)
        .reduce((sum: number, c: any) => sum + (c.balance || 0), 0)
    );
    
    // Count customers with non-zero balances (either credit or advance)
    const activeCustomers = customersList.filter((c: any) => (c.balance || 0) !== 0).length;
    
    return {
      totalReceivable: Math.round(totalReceivable),
      totalAdvance: Math.round(totalAdvance),
      activeCustomers,
      totalCustomers: customersList.length
    };
  }, [customersData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white border border-border p-5 rounded-xl flex items-center gap-4 shadow-sm">
        <div className="p-3 bg-red-50 text-red-600 rounded-lg"><Icon name="ArrowUpRight" /></div>
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase">Total Receivable</p>
          <h3 className="text-2xl font-bold">Rs. {loading ? '...' : stats.totalReceivable.toLocaleString('en-NP')}</h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">Amount customers have to pay</p>
        </div>
      </div>
      <div className="bg-white border border-border p-5 rounded-xl flex items-center gap-4 shadow-sm">
        <div className="p-3 bg-green-50 text-green-600 rounded-lg"><Icon name="ArrowDownLeft" /></div>
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase">Total Advance</p>
          <h3 className="text-2xl font-bold">Rs. {loading ? '...' : stats.totalAdvance.toLocaleString('en-NP')}</h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">Advance payments received</p>
        </div>
      </div>
      <div className="bg-white border border-border p-5 rounded-xl flex items-center gap-4 shadow-sm">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Icon name="Users" /></div>
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase">Active Customers</p>
          <h3 className="text-2xl font-bold">{loading ? '...' : stats.activeCustomers}</h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">Total: {loading ? '...' : stats.totalCustomers} customers</p>
        </div>
      </div>
    </div>
  );
};

export default CreditStats;