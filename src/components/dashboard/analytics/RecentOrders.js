import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {RecentOrder} from '../../Api_url'
import { useNavigate } from 'react-router';


const RecentOrders = ({filterType}) => {
     const [recentOrders, setRecentOrders] = useState([]);

     const navigate = useNavigate();

     const token = localStorage.getItem('access_token');

     const fetchRecentOrders = async () => {
        try {
          const response = await axios.get(RecentOrder, {
            headers: {
              Authorization: `Bearer ${token}` // Include the token in the header
            },
            params: {
              filter_type: filterType // Add filter_type here
            }
          });
          setRecentOrders(response.data.sales_data);
        } catch (error) {
          console.error('Error fetching recent orders:', error);
        }
      };
      
      useEffect(() => {
        fetchRecentOrders();
      }, [filterType]);

  return (
    <div className="bg-white rounded-lg p-4 mb-6 shadow-sm overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <div className="flex items-center">
            <span className="text-sm text-blue-600">+1 new order</span>
            <button className="ml-4 text-sm text-gray-500" onClick={() => navigate("/orders")}>Go to Orders Page →</button>
          </div>
        </div>
        <div className="overflow-x-auto overflow-y-auto max-h-64">
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
                    <td className="py-3">{`ID${index + 1}`}</td> {/* You can replace this with actual ID if available */}
                    <td>{order.product} ({order.variant})</td>
                    <td>{order.quantity}</td>
                    <td>{new Date().toLocaleDateString()}</td> {/* Replace with actual order date if available */}
                    <td>₹{(order.quantity * order.price).toFixed(2)}</td> {/* Amount is calculated */}
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
  )
}

export default RecentOrders