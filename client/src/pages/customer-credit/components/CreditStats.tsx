import Icon from '@/components/AppIcon';

const CreditStats = () => {
  // Use your actual stats API here
  const stats = { totalReceivable: 12500, totalReceived: 8400, activeCustomers: 12 };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white border border-border p-5 rounded-xl flex items-center gap-4 shadow-sm">
        <div className="p-3 bg-red-50 text-red-600 rounded-lg"><Icon name="ArrowUpRight" /></div>
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase">Total Receivable</p>
          <h3 className="text-2xl font-bold">${stats.totalReceivable.toLocaleString()}</h3>
        </div>
      </div>
      <div className="bg-white border border-border p-5 rounded-xl flex items-center gap-4 shadow-sm">
        <div className="p-3 bg-green-50 text-green-600 rounded-lg"><Icon name="ArrowDownLeft" /></div>
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase">Total Collected</p>
          <h3 className="text-2xl font-bold">${stats.totalReceived.toLocaleString()}</h3>
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
  );
};

export default CreditStats;