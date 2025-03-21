import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {InventoryStockStatus} from '../../Api_url';

const ProductInventory = ({ filterType }) => {
  const [activeTab, setActiveTab] = useState('in-stock');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Inventory Data from API
  useEffect(() => {
    const fetchInventoryData = async () => {
      const token = localStorage.getItem('access_token');
      

      try {
        const response = await axios.get(InventoryStockStatus, {
          headers: {
            'Authorization': `Bearer ${token}`,

          },
          params: {
            'stock_status': activeTab === 'in-stock' ? 'instock' : 'outofstock',
            'filter_type': filterType,
          },
        });

        if (response.data.stock_status) {
          setProducts(response.data.stock_status);
        } else {
          setError('No inventory data available');
        }
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryData();
  }, [activeTab, filterType]);

  return (
    <div className="w-full rounded-xl shadow-md p-4 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Products</h2>
        <div className="relative">
          <button className="px-4 py-2 bg-white rounded-lg border border-gray-200 flex items-center">
            <span className="mr-2">This month</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex bg-gray-100 items-center rounded-xl p-1 mb-2">
        <button
          className={`flex-1 py-1 rounded-xl text-center transition-colors ${activeTab === 'in-stock' ? 'bg-[#92FE9D] text-black' : 'text-gray-700'}`}
          onClick={() => setActiveTab('in-stock')}
        >
          In-Stock
        </button>
        <button
          className={`flex-1 py-1 rounded-xl text-center transition-colors ${activeTab === 'out-of-stock' ? 'bg-[#92FE9D] text-black' : 'text-gray-700'}`}
          onClick={() => setActiveTab('out-of-stock')}
        >
          Out-of-Stock
        </button>
      </div>

      {/* Product List */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          products.map((product, index) => (
            <div key={index} className="p-4 bg-gray-100 rounded-lg flex flex-col">
              <div className="text-gray-800 font-medium">{product.product_name}</div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">{product.stock} units</span>
                <span className="text-gray-500">{product.variant_name}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Total Stock Summary */}
      <div className="mt-4 bg-white rounded-lg p-2 border border-gray-100 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0084ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          </div>
          <span className="text-gray-600">Total Stock In</span>
        </div>
        <span className="text-black font-bold text-xl">{products.reduce((acc, product) => acc + product.stock, 0)}</span>
      </div>
    </div>
  );
};

export default ProductInventory;
