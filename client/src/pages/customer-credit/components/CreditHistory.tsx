import React, { useState, useMemo, useEffect } from 'react';
import { useFetch } from '@/hooks/useFetch';
import Icon from '@/components/AppIcon';
import Loader from '@/components/Loader';

// Assuming you add a 'getCredits' to your api/customers.ts or similar
import { getCredits } from '@/api/credits'; 
import axios from 'axios';

const CreditHistory = () => {
  const { data: credits, loading } = useFetch(getCredits);
  // const [credits, setCredits] = useState([])
  const [creditHistory, setCreditHistory] = useState<any>({});
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const sortedCredits = useMemo(() => {
    if (!credits) return [];
    let sortableItems = [...credits];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = sortConfig.key === 'name' ? a.customerId.name : a[sortConfig.key];
        const bValue = sortConfig.key === 'name' ? b.customerId.name : b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [credits, sortConfig]);

  useEffect(()=>{
    axios.get("/api/customers/outstanding/6944d4a4b9dd57ae6c7855a3")
      .then(res=>{
        setCreditHistory(res.data.data);
        console.log(res.data.data)
      })
  }, [])

  
  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="text-lg font-semibold text-foreground">Credit History</h2>
      </div>
      <Loader loading={loading}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
              <tr >
                <th className="p-4 px-10 cursor-pointer hover:text-primary" onClick={() => requestSort('name')}>
                  Date {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-4 cursor-pointer hover:text-primary" onClick={() => requestSort('amount')}>
                 Product
                 </th>
                <th className="p-4">Amount</th>
                </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {sortedCredits.map((credit: any) => (
                <tr key={credit._id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium">{credit.customerId.name}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      credit.amount > 0 
                        ? 'bg-red-100 text-red-700'  // Business gave goods (Customer owes)
                        : 'bg-green-100 text-green-700' // Business got cash (Customer paid)
                    }`}>
                      {credit.amount > 0 ? 'GAVE' : 'GOT'}
                    </span>
                  </td>
                  <td className={`p-4 font-bold ${credit.amount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {Math.abs(credit.amount).toLocaleString()}
                  </td>
                  <td className="p-4 text-muted-foreground text-xs">
                    {new Date(credit.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}

              {/* {creditHistory?.itemsTaken?.length > 0 && creditHistory?.itemsTaken?.map((item: any) => (
                <tr key={item._id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 px-10 text-muted-foreground text-xs">
                      {new Date(item?.createdAt).toLocaleDateString()}
                    </td>
                  <td className="p-4 font-medium">{item.productName}</td>
                  <td className="p-4">
                    
                    <span className={`px-2 py-1 text-xs font-bold text-slate-600`}>
                      Rs. {item.unpaidAmount}
                    </span>
                  </td>
                </tr>
              ))} */}
            </tbody>
          </table>
        </div>
      </Loader>
    </div>
  );
};

export default CreditHistory;