import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography } from '@mui/material';
import { Storefront, LocalShipping, ShoppingCart, Agriculture } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import {TotalNoOfFarmersbyFPO} from '../../Api_url'

const DashboardHome = () => {
  

  // State to store the total farmers count
  const [totalFarmers, setTotalFarmers] = useState(null);

  // Fetch total farmers from the API
  const fetchTotalFarmers = async () => {
    try {
      const token = localStorage.getItem('access_token'); // Retrieve the token from localStorage
      if (!token) {
        console.error('No token found');
        return;
      }
  
      // Make the API call with the token in the Authorization header
      const response = await axios.get(
        TotalNoOfFarmersbyFPO,
        { // This is the config object containing headers
          headers: {
            Authorization: `Bearer ${token}`,
            
          },
        }
      );
  
      // Handle the API response
      if (response.data && response?.data?.total_farmers !== undefined) {
        setTotalFarmers(response?.data.total_farmers);
      } else {
        console.error('Invalid API response:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  // Call the fetch function when the component mounts
  useEffect(() => {
    fetchTotalFarmers();
  }, []); // Empty dependency array means it runs once when the component mounts
   

  return (
    <div className="flex flex-wrap justify-center gap-6 md:flex-row md:justify-start">
      {/* Farmer Card */}
      <Card className="w-64 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out">
        <CardContent
          className="flex flex-col items-center"
          style={{
            background: 'linear-gradient(to right, #48C78E, #34D399, #10B981)', // Green gradient
            color: 'white',
          }}
        >
          <Agriculture sx={{ fontSize: 60 }} className="mb-4 animate-pulse" />
          <Typography variant="h6" component="div" className="font-semibold text-center text-xl">
            Farmer
          </Typography>
          {/* Display total farmers count */}
          {totalFarmers !== null ? (
            <Typography variant="body2" component="div" className="text-center mt-2">
              Total Farmers : {totalFarmers}
            </Typography>
          ) : (
            <Typography variant="body2" component="div" className="text-center mt-2">
              Loading farmers count...
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Sales Card */}
      <Card className="w-64 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out">
        <CardContent
          className="flex flex-col items-center"
          style={{
            background: 'linear-gradient(to right, #60A5FA, #3B82F6, #1D4ED8)',
            color: 'white',
          }}
        >
          <Storefront sx={{ fontSize: 60 }} className="mb-4 animate-pulse" />
          <Typography variant="h6" component="div" className="font-semibold text-center text-xl">
            Sales
          </Typography>
          {totalFarmers !== null ? (
            <Typography variant="body2" component="div" className="text-center mt-2">
              Total Sales : {}
            </Typography>
          ) : (
            <Typography variant="body2" component="div" className="text-center mt-2">
              Loading farmers count...
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Order Card */}
      <Card className="w-64 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out">
        <CardContent
          className="flex flex-col items-center"
          style={{
            background: 'linear-gradient(to right, #FDBA74, #FB923C, #F97316)', // Orange gradient
            color: 'white',
          }}
        >
          <ShoppingCart sx={{ fontSize: 60 }} className="mb-4 animate-pulse" />
          <Typography variant="h6" component="div" className="font-semibold text-center text-xl">
            Orders
          </Typography>
          {totalFarmers !== null ? (
            <Typography variant="body2" component="div" className="text-center mt-2">
              Total Order : {}
            </Typography>
          ) : (
            <Typography variant="body2" component="div" className="text-center mt-2">
              Loading farmers count...
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Purchase Card */}
      <Card className="w-64 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out">
        <CardContent
          className="flex flex-col items-center"
          style={{
            background: 'linear-gradient(to right, #F87171, #EF4444, #DC2626)', // Red gradient
            color: 'white',
          }}
        >
          <LocalShipping sx={{ fontSize: 60 }} className="mb-4 animate-pulse" />
          <Typography variant="h6" component="div" className="font-semibold text-center text-xl">
            Purchase
          </Typography>
          {totalFarmers !== null ? (
            <Typography variant="body2" component="div" className="text-center mt-2">
              Total Purchse : {}
            </Typography>
          ) : (
            <Typography variant="body2" component="div" className="text-center mt-2">
              Loading farmers count...
            </Typography>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardHome;
