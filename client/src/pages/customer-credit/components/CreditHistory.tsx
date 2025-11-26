import React, { useState, useEffect } from 'react';
import axios from '../../../utils/axios.js';

const CreditHistory = () => {
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await axios.get('/credits');
        setCredits(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching credit history:', error);
        setLoading(false);
      }
    };

    fetchCredits();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Credit History</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Customer</th>
            <th className="text-left">Amount</th>
            <th className="text-left">Description</th>
            <th className="text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {credits.map((credit) => (
            <tr key={credit._id}>
              <td>{credit.customerId.name}</td>
              <td>{credit.amount}</td>
              <td>{credit.description}</td>
              <td>{new Date(credit.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CreditHistory;
