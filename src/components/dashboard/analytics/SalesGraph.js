import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import { GetGraphs } from '../../Api_url';

const SalesGraph = ({ filterType }) => {
  const [salesData, setSalesData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchSalesData();
  }, [year, filterType]);

  const fetchSalesData = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.get(GetGraphs, {
        params: { graph_type: "sales", filter_type: filterType },
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response);


      if (response.data && response.data.sales_data) {
        const formattedData = response.data.sales_data.map((item) => ({
          x: new Date(item.year, item.month - 1).toLocaleString("en-US", { month: "short" }),
          y: item.total_sales,
        }));
        setSalesData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };


  const chartOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
    },
    xaxis: {
      type: "category",
      labels: { style: { colors: "#000", fontSize: "14px" } },
    },
    yaxis: {
      labels: {
        style: { colors: "#000", fontSize: "14px" },
        formatter: (value) => `${value}K`,
      },
    },
    grid: { borderColor: "#ddd", strokeDashArray: 5 },
    colors: ["#00B251"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0,
        stops: [0, 100],
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
      colors: ["#00B251"],
    },
  };


  const series = [{ name: "Sales", data: salesData }];

  return (
    <div className="w-full p-4 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Sales</h2>
        <select
          className="border p-2 rounded-md shadow-sm cursor-pointer"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>
      </div>
      <Chart options={chartOptions} series={series} type="area" height={300} />
    </div>
  );
};

export default SalesGraph;
