import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { GetKPIS } from '../../Api_url';
import img1 from '../../../assets/farmer.png'
import img2 from '../../../assets/procurement.png'
import img3 from '../../../assets/tracking.png'
import img4 from '../../../assets/sale (1).png'
import img5 from '../../../assets/profit-growth.png'
import img6 from '../../../assets/return.png'

const Cards = ({ filterType }) => {

  const [kpiData, setKpiData] = useState({
    sales: 0,
    purchases: 0,
    returns: 0,
    farmers: 0,
    profit: 0,
    orders: 0
  });

  const token = localStorage.getItem('access_token');

  const fetchKPIs = async () => {
    try {
      const response = await axios.get(GetKPIS, {
        headers: {
          params: { filter_type: filterType },

          Authorization: `Bearer ${token}`
        }
      });
      setKpiData(response.data);
    } catch (error) {
      console.error('Error fetching KPIs:', error);
    }
  };

  useEffect(() => {
    fetchKPIs();
  }, []);

  const KPICard = ({ title, value, icon }) => (
    <div className="bg-[#F9F9F9] rounded-xl p-4 shadow-md">
      <div className="flex items-center justify-between ">
        <div>
          <img src={icon} alt={title} className="w-10 h-10" />
          <p className="text-lg mt-2 ">{title}</p>
          <h3 className="text-xl font-semibold">{value}</h3>
        </div>
        {/* <div className="w-24 h-6">
        <svg width="100%" height="24" viewBox="0 0 100 24">
          <path
            d="M0 12 Q25 6, 50 12 T100 12"
            fill="none"
            stroke="#22c55e"
            strokeWidth="1.5"
          />
        </svg>
      </div> */}
      </div>

    </div>
  );

  return (
    <div>
      <div className="grid grid-cols-3 gap-6 ">
        <KPICard
          title="Total Farmers"
          value={kpiData.farmers}
          icon={img1}
        />
        <KPICard
          title="Total Purchases"
          value={kpiData.purchases}
          icon={img2}
        />
        <KPICard
          title="Total Orders"
          value={kpiData.orders}
          icon={img3}
        />
        <KPICard
          title="Total Sales"
          value={kpiData.sales}
          icon={img4}
        />
        <KPICard
          title="Total Profit"
          value={kpiData.profit}
          icon={img5}
        />
        <KPICard
          title="Total Returns"
          value={kpiData.returns}
          icon={img6}
        />
      </div>
    </div>
  )
}

export default Cards