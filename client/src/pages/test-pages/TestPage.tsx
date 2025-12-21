const backendData = [
  {
    date: "2025-09-15",
    products: [
      { name: "Milk", quantity: 5, price: 50 },
      { name: "Bread", quantity: 2, price: 40 }
    ]
  },
  {
    date: "2025-09-16",
    products: [
      { name: "Eggs", quantity: 12, price: 10 }
    ]
  },
  {
    date: "2025-09-17",
    products: [
      { name: "Butter", quantity: 1, price: 120 },
      { name: "Cheese", quantity: 2, price: 150 }
    ]
  }
];

export default function App() {
  const grandTotal = backendData.reduce(
    (sum, day) =>
      sum +
      day.products.reduce(
        (pSum, p) => pSum + p.quantity * p.price,
        0
      ),
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg">
        <h1 className="text-xl font-semibold p-4 border-b">
          Customer Purchase History
        </h1>

        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-sm text-gray-600">
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Products</th>
              <th className="p-3 text-right">Amount (Rs.)</th>
            </tr>
          </thead>

          <tbody>
            {backendData.map((day) => {
              const dayTotal = day.products.reduce(
                (sum, p) => sum + p.quantity * p.price,
                0
              );

              return (
                <tr key={day.date} className="border-t align-top">
                  {/* Date */}
                  <td className="p-3 font-medium text-gray-800">
                    {day.date}
                  </td>

                  {/* Products */}
                  <td className="p-3 space-y-1">
                    {day.products.map((p) => (
                      <div key={p.name} className="text-sm text-gray-700">
                        <span className="font-medium">{p.name}</span>
                        <span className="text-gray-500">
                          {" "}
                          (Rs. {p.price}) × {p.quantity}
                        </span>
                      </div>
                    ))}
                  </td>

                  {/* Amount – pushed to bottom */}
                  <td className="p-3">
                    <div className="flex flex-col h-full justify-end items-end">
                      <span className="text-xs text-gray-500 mb-1">
                        Day Total
                      </span>
                      <span className="font-semibold text-lg">
                        Rs. {dayTotal}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>

          <tfoot>
            <tr className="border-t bg-gray-50">
              <td colSpan={2} className="p-3 text-right font-semibold">
                Grand Total
              </td>
              <td className="p-3 text-right font-bold text-lg">
                Rs. {grandTotal}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
