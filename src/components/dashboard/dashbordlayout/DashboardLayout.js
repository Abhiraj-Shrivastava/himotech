import React, { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Avatar, Menu, MenuItem } from '@mui/material';
import Navbar from '../../Navbar';
import MemberHome from '../members/MemberHome';
import GroupsIcon from '@mui/icons-material/Groups';
import MemberProfile from '../members/MemberProfile';
import PurchaseHome from '../purchase/PurchaseHome';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SinglePurchase from '../purchase/SinglePurchase';
import InventoryHome from '../inventory/InventoryHome';
import Return from '../return/Return';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SalesHome from '../sales/SalesHome';
import OrdersHome from '../orders/OrdersHome';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Profile from './Profile';
import ShopDetailsForm from './ShopDetailsForm';
import BankDetailsForm from './BankDetailsForm';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DashboardHeader from './DashboardHeader';
import women from '../../../assets/unsplash_rDEOVtE7vOs.png'
import { useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import InventoryIcon from '@mui/icons-material/Inventory';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined'
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import AnalyticsHome from '../analytics/AnalyticsHome';
import CreatedOrder from '../orders/CreatedOrder';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import Item from '../sales/Item';
import TablePage from '../members/TablePage';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [purchaseMenuOpen, setPurchaseMenuOpen] = useState(false);
  const [userName, setUserName] = useState('User');
  const [profileImage, setProfileImage] = useState(women); // default image
  const [loading, setLoading] = useState(true);

  const [activeButton, setActiveButton] = useState(null);

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleTabChange = (v) => {
    setSelectedTab(v);
    setSidebarOpen(false);
  };

  const [anchorEl, setAnchorEl] = useState(null); // For controlling the menu
  const open = Boolean(anchorEl); // Whether the menu is open

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Open menu when profile image is clicked
  };

  const handleClose = () => {
    setAnchorEl(null); // Close menu when an option is selected
  };

  const handleMenuItemClick = (setting) => {
    if (setting === 'My Profile') {
      navigate('/profile');
    } else if (setting === 'Logout') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/login', { replace: true });
    }
    handleClose(); // Close the menu after selection
  };

  const TABS = [
    { label: "Dashboard", path: 'home', icon: <DashboardIcon />, outlinedIcon: <DashboardOutlinedIcon />, component: <DashboardHeader /> },
    { label: "Employee", path: 'member', icon: <GroupsIcon />, outlinedIcon: <GroupsOutlinedIcon />, component: <MemberHome /> },
    // { label: "Purchase", path: 'purchase', icon: <StorefrontIcon />, outlinedIcon: <StorefrontOutlinedIcon />, component: <PurchaseHome /> },
    // { label: "Inventory", path: 'inventory', icon: <InventoryIcon />, outlinedIcon: <Inventory2OutlinedIcon />, component: <InventoryHome /> },
    // { label: "Sales", path: 'sale', icon: <ShoppingCartIcon />, outlinedIcon: <ShoppingCartOutlinedIcon />, component: <Item /> },
    // { label: "Analytics", path: 'analytics', icon: <AnalyticsIcon />, outlinedIcon: <AnalyticsOutlinedIcon />, component: <AnalyticsHome /> },
    // { label: "Orders", path: 'orders', icon: <ShoppingBagIcon />, outlinedIcon: <ShoppingBagOutlinedIcon />, component: <OrdersHome /> },
    // { label: "Created orders", path: 'createdorder', icon: <ShoppingBasketIcon />, outlinedIcon: <ShoppingBasketOutlinedIcon />, component: <CreatedOrder /> },
    // { label: "Return", path: 'return', icon: <AssignmentReturnIcon />, outlinedIcon: <AssignmentReturnOutlinedIcon />, component: <Return /> },
  ];


  useEffect(() => {
    // Fetch data when the component mounts
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('access_token');  // Get token from localStorage
      if (token) {
        try {
          const response = await axios.get('https://apis.agrisarathi.com/fposupplier/UserProfileView', {
            headers: {
              Authorization: `Bearer ${token}`, // Pass the token in Authorization header
            },
          });

          // Assuming the API response structure is as described
          const { data } = response;
          if (data && data.data && data.data.profile) {
            setUserName(data.data.profile.fpo_name); // Set the user's name
            setProfileImage(data.data.profile.profile); // Set the user's profile image URL
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, [profileImage]);

  const location = useLocation();

  return (
    <>
  
      <div className="flex" style={{ height: "100vh" }}>
        <div
          style={{ height: 700, paddingBottom: 5 }}
          className={`bg-[#00B251] text-white pl-6 pt-6  w-64 min-h-full fixed top-0 left-0 bottom-0 transform transition-transform md:relative md:block z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        >

          {/* Profile Section */}
          <div>
            {/* Profile Picture and Text */}
            <div className="flex items-center mb-5 py-4 cursor-pointer" onClick={handleClick}>
              <Avatar
                alt="Profile"
                src={profileImage || women}
                sx={{ width: 40, height: 40, marginRight: 2 }}
              />
              <span className="text-lg font-bold">{loading ? 'Loading...' : `Hi, ${userName}`}</span>
              <ArrowDropDownIcon sx={{ mr: 2 }} />
            </div>

            {/* MUI Menu for options */}
            <Menu
              className='ml-20 -mt-4 '
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={() => handleMenuItemClick('My Profile')}>My Profile</MenuItem>
              <MenuItem onClick={() => handleMenuItemClick('Logout')}>Logout</MenuItem>
            </Menu>
          </div>

          {/* Menu */}
          <ul className="space-y-4">
            {TABS.map((item) => (
              <li
                key={item.path}
                onClick={() => {
                  handleTabChange(item?.label);
                  navigate(`/${item?.path}`);
                }}
                className={`relative min-w-full flex px-5 py-3 cursor-pointer rounded-lg transition-all gap-4 
                   ${location.pathname.includes(item?.path) ? "bg-white text-black font-bold rounded-l-full -rounded-tr-full "
                    : "hover:bg-green-700 rounded-l-full -rounded-tr-full"}`}
              >
                {/* Render the appropriate icon based on selected tab */}
                {location.pathname.includes(item.path) ? item.icon : item.outlinedIcon}
                {item?.label}
              </li>
            ))}
          </ul>

        </div>

        <div className="flex-1 p-6 ml-0 md:ml-4 min-h-screen overflow-y-scroll" >

          <div style={{ width: "100%", position: 'relative' }}>
            <Navbar />
            <div className="flex justify-end items-center">
              <button
                className="md:hidden mt-20 text-black"
                onClick={toggleSidebar}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

            </div>
            <div className='mt-20'>
              <Routes>
                <Route path="/home" element={<DashboardHeader profileData={profileImage} />} />
                <Route path="/member" element={<MemberHome />} />
                <Route path="/memberdetail/:id" element={<MemberProfile />} />
                {/* <Route path="/purchase" element={<PurchaseHome />} />
                <Route path="/purchase/:request_code" element={<SinglePurchase />} />
                <Route path="/inventory" element={<InventoryHome />} />
                <Route path="/return" element={<Return />} />
                <Route path="/sale" element={<Item />} />
                <Route path="/analytics" element={<AnalyticsHome />} />
                <Route path="/orders" element={<OrdersHome />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/shopdetails" element={<ShopDetailsForm />} />
                <Route path="/bankdetails" element={<BankDetailsForm />} />
                <Route path="/createdorder" element={<CreatedOrder />} />
                <Route path="/table" element={<TablePage />} />   */}
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
