import React, { useState } from 'react'
import Cards from './Cards';
import Announcements from './Announcements';
import RecentOrders from './RecentOrders';
import UserStatusList from './UserStatusList';
import ProfitAnalysisChart from './ProfitAnalysisChart';
import ProductInventory from './ProductInventory';
import SalesGraph from './SalesGraph';
import { Typography } from '@mui/material';
import img1 from "../../../assets/undraw_predictive-analytics_6vi1 1 (1).png";

const AnalyticsHome = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [filter, setFilter] = useState('offline');

  const handleOnlineClick = () => {
    setFilter('online');
    setIsOnline(true);
  };

  const handleOfflineClick = () => {
    setFilter('offline');
    setIsOnline(false);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>Analytics Information</Typography>

      <div className="flex justify-center mb-10 ">
        <div className="inline-flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={handleOnlineClick}
            className={`px-14 py-1 rounded-xl font-semibold transition-all duration-200 ${isOnline
              ? 'bg-[#92FE9D] text-black'
              : 'bg-transparent text-gray-600 hover:bg-gray-200'
              }`}
          >
            Online
          </button>
          <button
            onClick={handleOfflineClick}
            className={`px-14 py-1 rounded-xl font-semibold transition-all duration-200 ${!isOnline
              ? 'bg-[#92FE9D] text-black'
              : 'bg-transparent text-gray-600 hover:bg-gray-200'
              }`}
          >
            Offline
          </button>
        </div>
      </div>


      <div className="grid gap-6 md:gap-8">
        {/* Cards and Announcements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Cards filterType={filter} />
          </div>
          <Announcements />
        </div>

        {/* Recent Orders and Users */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <RecentOrders  filterType={filter} />
          </div>
          <UserStatusList />
        </div>

        {/* Profit Analysis and Product Inventory */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <ProfitAnalysisChart filterType={filter} />
          </div>
          <ProductInventory filterType={filter} />
        </div>

        {/* Sales Graph and Image */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <SalesGraph filterType={filter} />
          </div>
          <div className="flex justify-center">
            <img src={img1} alt="" className="w-full md:w-80 object-contain" />
          </div>
        </div>
      </div>

    </>
  )
}

export default AnalyticsHome;