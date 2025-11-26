import React, { useState, useEffect } from 'react';
import axios from '../../../utils/axios.js';

const CreditStats = () => {
  const [stats, setStats] = useState({ totalCredit: 0, customerCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/credits/stats');
        setStats(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching credit stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Credit Stats</h2>
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-gray-500">Total Credit</p>
          <p className="text-2xl font-bold">${stats.totalCredit}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Customers</p>
          <p className="text-2xl font-bold">{stats.customerCount}</p>
        </div>
      </div>
    </div>
  );
};

export default CreditStats;
