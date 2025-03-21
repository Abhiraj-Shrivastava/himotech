import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const App = () => {
  const [kpiData, setKpiData] = useState({
    sales: 0,
    purchases: 0,
    returns: 0,
    farmers: 0,
    profit: 0,
    orders: 0
  });
  const [salesData, setSalesData] = useState([]);
  const [profitData, setProfitData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [products, setProducts] = useState([]); 
  const [filterType, setFilterType] = useState('online'); 
  const [stockStatus, setStockStatus] = useState('instock'); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('access_token');

  if (!token) {
    console.error("Authentication token is missing.");
  }

  useEffect(() => {
    fetchKPIs();
    fetchGraphData();
    fetchRecentOrders();
  }, []);

  const fetchKPIs = async () => {
    try {
      const response = await axios.get('https://apis.agrisarathi.com/fposupplier/GetKPIS', {
        headers: {
          Authorization: `Bearer ${token}` // Include the token in the header
        }
      });
      setKpiData(response.data);
    } catch (error) {
      console.error('Error fetching KPIs:', error);
    }
  };

  const fetchGraphData = async () => {
    try {
      const salesResponse = await axios.get('https://apis.agrisarathi.com/fposupplier/GetGraphs', {
        headers: {
          Authorization: `Bearer ${token}` // Include the token in the header
        },
        params: {
          graph_type: 'sales',
          filter_type: 'online' // Add filter_type here
        }
      });
      setSalesData(salesResponse.data.sales_data);

      const profitResponse = await axios.get('https://apis.agrisarathi.com/fposupplier/GetGraphs', {
        headers: {
          Authorization: `Bearer ${token}` // Include the token in the header
        },
        params: {
          graph_type: 'profit',
          filter_type: 'online' // Add filter_type here
        }
      });
      setProfitData(profitResponse.data.sales_data);
    } catch (error) {
      console.error('Error fetching graph data:', error);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const response = await axios.get('https://apis.agrisarathi.com/fposupplier/RecentOrders', {
        headers: {
          Authorization: `Bearer ${token}` // Include the token in the header
        },
        params: {
          filter_type: 'online' // Add filter_type here
        }
      });
      setRecentOrders(response.data.sales_data);
    } catch (error) {
      console.error('Error fetching recent orders:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null); // Reset error state before fetching
    try {
      const token = localStorage.getItem('access_tokens'); // Get token from localStorage
      const response = await axios.get('https://apis.agrisarathi.com/fposupplier/InventoryStockStatus', {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to headers
        },
        params: {
          filter_type: filterType, // Filter by online/offline
          stock_status: stockStatus, // Filter by in-stock/out-of-stock
        },
      });

      // Check if the API response is successful
      if (response.data.message === "Inventory data fetched successfully") {
        setProducts(response.data.stock_status); // Set the fetched products
      } else {
        setError('Failed to fetch product data'); // Set error message
      }
    } catch (err) {
      setError('Error occurred while fetching data'); // Handle API error
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  
  useEffect(() => {
    fetchProducts();
  }, [filterType, stockStatus]);


  const KPICard = ({ title, value, icon }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-xl font-semibold">{value}</h3>
        </div>
        <img src={icon} alt={title} className="w-6 h-6" />
      </div>
      <div className="w-full h-6">
        <svg width="100%" height="24" viewBox="0 0 100 24">
          <path
            d="M0 12 Q25 6, 50 12 T100 12"
            fill="none"
            stroke="#22c55e"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="grid grid-cols-3 gap-6 mb-6">
        <KPICard
          title="Total Farmers"
          value={kpiData.farmers}
          icon="/icons/farmers.svg"
        />
        <KPICard
          title="Total Purchases"
          value={kpiData.purchases}
          icon="/icons/purchases.svg"
        />
        <KPICard
          title="Total Orders"
          value={kpiData.orders}
          icon="/icons/orders.svg"
        />
        <KPICard
          title="Total Sales"
          value={kpiData.sales}
          icon="/icons/sales.svg"
        />
        <KPICard
          title="Total Profit"
          value={kpiData.profit}
          icon="/icons/profit.svg"
        />
        <KPICard
          title="Total Returns"
          value={kpiData.returns}
          icon="/icons/returns.svg"
        />
      </div>

      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <div className="flex items-center">
            <span className="text-sm text-blue-600">+1 new order</span>
            <a href="#" className="ml-4 text-sm text-gray-500">Go to Orders Page →</a>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 text-sm">
                <th className="py-2">ID</th>
                <th className="py-2">Item</th>
                <th className="py-2">Qty</th>
                <th className="py-2">Order Date</th>
                <th className="py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-3">{`ID${index + 1}`}</td> 
                    <td>{order.product} ({order.variant})</td>
                    <td>{order.quantity}</td>
                    <td>{new Date().toLocaleDateString()}</td> 
                    <td>₹{(order.quantity * order.price).toFixed(2)}</td> 
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-3">No recent orders available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Sales</h2>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Online
              </button>
              <button className="px-3 py-1 text-gray-500 rounded-full text-sm">
                Offline
              </button>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="ml-2 p-1 border rounded"
              >
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </select>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <YAxis />
                <Area
                  type="monotone"
                  dataKey="total_sales"
                  stroke="#22c55e"
                  fill="url(#salesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Profit Analysis</h2>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="p-1 border rounded"
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={profitData}>
                <defs>
                  <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <YAxis />
                <Area
                  type="monotone"
                  dataKey="total_sales"
                  stroke="#3b82f6"
                  fill="url(#profitGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Products</h2>
        <div className="flex items-center space-x-2">
          <button
            className={`px-3 py-1 rounded-full text-sm ${filterType === 'online' ? 'bg-green-100 text-green-800' : 'text-gray-500'}`}
            onClick={() => setFilterType('online')}
          >
            Online
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm ${filterType === 'offline' ? 'bg-green-100 text-green-800' : 'text-gray-500'}`}
            onClick={() => setFilterType('offline')}
          >
            Offline
          </button>
          <select
            className="ml-2 p-1 border rounded"
            value={stockStatus}
            onChange={(e) => setStockStatus(e.target.value)}
          >
            <option value="in-stock">In-Stock</option>
            <option value="out-of-stock">Out-of-Stock</option>
          </select>
        </div>
      </div>

      {loading && <div>Loading...</div>} {/* Show loading state */}
      {error && <div>{error}</div>} {/* Show error state */}

      <div className="space-y-4">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.inventory_id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">{product.product_name}</p>
                <p className="text-sm text-gray-500">{product.stock} units</p>
              </div>
              <p className="text-sm text-gray-500">{product.variant_name}</p>
            </div>
          ))
        ) : (
          <div>No products found</div> // Show message when no products are found
        )}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <img src="/icons/stock.svg" alt="Stock" className="w-6 h-6 mr-2" />
            <span className="font-medium">Total Stock In</span>
          </div>
          <span className="font-medium">{products.reduce((total, product) => total + product.stock, 0)}</span>
        </div>
      </div>
    </div>

      <div className="mt-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center mb-4">
            <h2 className="text-lg font-semibold">Announcements</h2>
            <button className="ml-2 text-sm text-blue-600">View all</button>
          </div>
          <div className="flex items-start space-x-4">
            <img
              src="/api/placeholder/400/320"
              alt="Announcement"
              className="w-16 h-16 rounded"
            />
            <div>
              <h3 className="font-medium">Pradhan Mantri Fasal Bima Yojana...</h3>
              <p className="text-sm text-gray-500">
                Aims to provide insurance and coverage and support many...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;