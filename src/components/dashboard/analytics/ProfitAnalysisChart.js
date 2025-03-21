import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { GetGraphs } from '../../Api_url';

const ProfitAnalysisChart = ({ filterType }) => {
  // Monthly data placeholder
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const [profitData, setProfitData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('access_token');


      try {
        const response = await axios.get(GetGraphs, {
          params: { graph_type: "profit", filter_type: filterType },
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response?.data.returns_data) {
          // Mapping the returns_data to populate the profitData array
          const newProfitData = months.map((month, index) => {
            const profit = response?.data?.returns_data.find(d => d.month === index + 1);
            return profit ? profit.total_profit : 0; // If no data for month, set it as 0
          });
          console.log(newProfitData);


          setProfitData(newProfitData);
        } else {
          setError('No profit data available');
        }

      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filterType]);

  const options = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      },
      fontFamily: 'Arial, sans-serif',
      background: 'transparent', // Ensures no background color is applied
    },
    plotOptions: {
      bar: {
        borderRadius: 8, 
        columnWidth: '60%',
        
      }
    },
    colors: ['#1e66be'],
    xaxis: {
      categories: months,
      labels: {
        show: false
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        show: false
      },
      axisBorder: {
        show: false // Hide y-axis border (line)
      },
      axisTicks: {
        show: false // Hide y-axis ticks (line)
      }
    },
    grid: {
      xaxis: {
        lines: {
          show: false, // Hide background line for x-axis
        }
      },
      yaxis: {
        lines: {
          show: false, // Hide background line for y-axis
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    states: {
      hover: {
        filter: {
          type: 'darken',
          value: 0.9
        }
      }
    },
    title: {
      text: undefined
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function (value) {
          return '₹' + value.toLocaleString();
        }
      }
    },
    fill: {
      opacity: 1
    },
    // Ensure the bars remain smooth and rounded
    curve: 'smooth' // This option smooths the bar chart if needed
  };
  
  
  const series = [{
    name: 'Profit',
    data: profitData
  }];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Profit Analysis</h2>
        <div className="relative">
          <button className="px-4 py-2 bg-white rounded-lg border border-gray-200 flex items-center">
            <span className="mr-2">2025</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>
      </div>

      <div className="h-72">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <Chart
            options={options}
            series={series}
            type="bar"
            height="100%"
            width="100%"
          />
        )}
      </div>

      <div className="text-center text-gray-500 mt-2">
        Months
      </div>
    </div>
  );
};

export default ProfitAnalysisChart;
