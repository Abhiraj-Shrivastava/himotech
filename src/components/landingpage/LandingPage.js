import React from 'react';
import logo from '../../assets/agri.png';
import profile from '../../assets/fpo 1.png';
import img1 from '../../assets/image 9.png';
import img2 from '../../assets/5175314 1.png';
import img3 from '../../assets/MacBook Air (15 inch).png';
import img4 from '../../assets/2 (1) 1.png';
import img5 from '../../assets/1 (1) 1.png';
import img6 from '../../assets/6594678 1.png';
import backgroundImage from './green.png';
import AgricultureFeatures from './AgricultureFeatures';
import { useNavigate } from 'react-router';
import { Box, Stack } from '@mui/material';

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full min-h-screen overflow-hidden flex flex-col">
        {/* Sticky Navbar */}
        <div className="flex justify-between items-center px-6 py-4 fixed top-0 left-0 w-full z-50">

          <div className="flex-1">
            <img src={logo} alt="Logo" className="w-40" />
          </div>


          <div className="fixed top-0 right-0 px-6 py-4 z-50 flex gap-4">
            <button onClick={() => navigate("/registration")} className="bg-[#00B251] hover:bg-white hover:text-[#00B251] hover:border-[#00B251] border-2 border-transparent text-white px-6 py-2 rounded-md">
              Sign up
            </button>
            <button onClick={() => navigate("/login")} className="hover:bg-[#00B251] bg-white text-[#00B251] border-[#00B251] border-2  hover:text-white px-6 py-2 rounded-md">
              Sign in
            </button>
          </div>
        </div>

        {/* Background Section */}
        <div
          className="relative w-full  bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})`, display: 'flex', alignItems: 'end', justifyContent: 'start', height: 600 }}
        >
          <h1 className="text-white text-4xl font-bold drop-shadow-lg text-center pb-20 pl-4 pr-4" style={{ width: '58%' }}>
            Smart Agri Management for FPO's & Cooperatives
          </h1>
        </div>

        {/* Circular Image */}
        <Stack direction={{ xs: 'column-reverse', md: 'row' }} justifyContent={{ xs: 'center' }} alignItems='center' sx={{ zIndex: 2, }} spacing={8}>
          <div className="flex flex-col justify-center items-center " style={{ width: '52%' }}>
            <p className="text-xl text-gray-700 mb-6 text-center">"Seamlessly bring your entire business and distributor network online, making it discoverable across multiple Buyer Apps—at no extra cost"</p>
            <button onClick={() => navigate("/registration")} className="bg-[#00B251] text-white  hover:bg-white hover:text-[#00B251] hover:border-[#00B251] border-2 border-transparent px-6 py-2 rounded-md text-center w-32">Sign up</button>
          </div>
          <div  >
            <Box sx={{ mt: { xs: 0, md: -40, lg: -50 } }}>
              <img src={profile} alt="Profile" className="rounded-full border-8 border-white overflow-hidden shadow-lg object-cover bg-[#1F4E3C]" />
            </Box>
          </div>
        </Stack>
      </div>

      {/* Features Grid */}
      <div className="relative w-full flex flex-col md:flex-row items-center justify-between">
        {/* Left Image */}
        <div className=" flex justify-start">
          <img src={img1} alt="Manage From Anywhere" className="w-full max-w-md" />
        </div>

        {/* Center Content */}
        <div className="mt-6 flex flex-col justify-center items-center md:mt-0  md:mb-24 text-center md:w-1/2 z-10">
          <h2 className="text-[#00B251] text-center md:text-4xl font-bold mb-4">
            Unlock Digital Transformation
          </h2>
          <p className="md:text-xl text-black text-center">
            AgriConnect is an all-in-one ERP platform that transforms FPO and cooperative management. Access tools for crop management, production tracking, resource aggregation, and member engagement anytime, anywhere for growth and sustainability.
          </p>
        </div>

        {/* Right Image */}
        <div className=" flex justify-end md:-mb-24 ">
          <img src={img2} alt="Illustration" className="w-56 max-w-md" />
        </div>
      </div>

      <AgricultureFeatures />

      <div className=" w-full flex flex-col md:flex-row items-center justify-between ">
        <div className=" mt-6 md:mt-0 md:mb-0 mb-28">
          <h2 className="text-[#00B251] text-4xl font-bold mb-4 text-center ">Create your account today to experience the future of agriculture management.</h2>

        </div>
        <div className="md:w-1/2 flex justify-start">
          <img src={img3} alt="Manage From Anywhere" />
        </div>
      </div>

      <div className="container mx-auto px-4 pt-12 relative w-2/3">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* First Card */}
          <div className=" rounded-3xl overflow-hidden ">
            <img
              src={img4}
              alt="Member Engagement"
              className="w-full h-96 object-cover rounded-3xl overflow-hidden"
            />

            <div className="text-center mt-4">
              <h3 className="text-black text-xl font-semibold">
                Access to Quality Inputs for Higher Yields
              </h3>
            </div>
          </div>

          {/* Second Card */}
          <div className="rounded-3xl overflow-hidden">
            <img
              src={img5}
              alt="Boost member value"
              className="w-full h-96 object-cover rounded-3xl overflow-hidden"
            />

            <div className="text-center mt-4">
              <h3 className="text-black text-xl font-semibold">
                Direct Market Access for Better Pricing & Increased Revenue
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Farmer Illustration - Positioned Absolutely */}
      <div className="">
        <img
          src={img6}
          alt="Farmer illustration"
          className="object-contain"
        />
      </div>
      {/* Footer */}
      <footer className="bg-gray-100 py-4 px-4 border-t border-gray-200">
        <div className="max-w-full mx-auto flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex justify-start">
            <img
              src={logo}
              alt="Logo"
              className="w-44"
            />
          </div>

          {/* Footer Links Section */}
          <div className="flex flex-wrap md:mr-10 justify-center gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-900">Privacy Policy</a>
            <span className="text-gray-300">|</span>
            <a href="#" className="hover:text-gray-900">Terms & Conditions</a>
            <span className="text-gray-300">|</span>
            <a href="#" className="hover:text-gray-900">Cancellations & Refunds Policy</a>
            <span className="text-gray-300">|</span>
            <a href="#" className="hover:text-gray-900">Cookies</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;