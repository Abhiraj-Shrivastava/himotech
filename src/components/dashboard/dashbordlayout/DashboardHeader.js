import React, { useState, useEffect } from 'react';
import axios from 'axios';
import img1 from '../../../assets/photo_2025-02-12_15-04-41.jpg';
import img2 from '../../../assets/photo_2025-02-12_15-04-49.jpg';
import img3 from '../../../assets/photo_2025-02-12_15-04-55.jpg';
import img4 from '../../../assets/photo_2025-02-12_15-05-00.jpg';
import MembersManagement from '../../profilescreens/MembersManagement';
import FranchiseSubscription from '../../profilescreens/FranchiseSubscription';
import { Box, Button, CircularProgress, Dialog, IconButton, Stack } from '@mui/material';
import ProfileScreen from '../../profilescreens/ProfileScreen';
import ShopScreen from '../../profilescreens/ShopScreen';
import BankScreen from '../../profilescreens/BankScreen';
import women from '../../../assets/unsplash_rDEOVtE7vOs.png'
import accoumentimg from '../../../assets/image 20 (1).png'
import { useNavigate } from 'react-router';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { FPOProfileCompletionView, GetHomeScreenKPI } from '../../Api_url';
import { FaUserCheck, FaUserSlash } from "react-icons/fa";

const slides = [
    {
        title: ' "Manage your team effortlessly and stay organized."',
        buttonText: "Add Members",
        image: img4,
        buttonColor: "#00B251",
        navigateTo: "/member", // Target route for this button
    },
    {
        title: '"Explore and choose the premium offers that best suit your needs for exclusive features."',
        buttonText: "Explore Premium Plans",
        image: img1,
        buttonColor: "#FF9933",
        // navigateTo: "/premium-plans", 
    },
    {
        title: '"Explore products, make purchases, and view your order history to keep track of all your transactions."',
        buttonText: "Make a Purchase",
        image: img2,
        buttonColor: "#0288D1",
        navigateTo: "/purchase", // Target route for this button
    },
    {
        title: ' "Monitor your sales performance and make data-driven decisions to boost your business growth."',
        buttonText: "View Sales Insights",
        image: img3,
        buttonColor: "#000080",
        navigateTo: "/sale", // Target route for this button
    },
];
const DashboardHeader = ({ profileData }) => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [profileStatus, setProfileStatus] = useState(null);
    const [skipStatus, setSkipStatus] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const [data, setData] = useState({ active_employees: 0, inactive_employees: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    // const totalSlides = slides.length;

    // useEffect(() => {
       
    //     if (totalSlides > 0) {
    //         const intervalId = setInterval(() => {
    //             setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
    //         }, 2000);
    //         return () => clearInterval(intervalId);
    //     }
    // }, [totalSlides]);

    // const TABS = [
    //     { key: 1, component: <ProfileScreen /> },
    //     { key: 2, component: <ShopScreen /> },
    //     { key: 3, component: <BankScreen /> },
    //     { key: 4, component: <MembersManagement /> },
    //     { key: 5, component: <FranchiseSubscription /> },
    // ]


    // const [currentIndex, setCurrentIndex] = useState(1)

    // const fetchProfileCompletionStatus = async () => {
    //     try {
    //         const token = localStorage.getItem('access_token');
    //         const response = await axios.get(FPOProfileCompletionView, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         });

    //         if (response?.data) {
    //             const { profile_completion, is_complete } = response?.data;

    //             setProfileStatus({
    //                 profileCompletion: profile_completion,
    //                 isComplete: is_complete
    //             });
    //         }
    //     } catch (error) {
    //         console.error("Error fetching profile completion status", error);
    //     }
    // };

    // const fetchSkipStatus = async () => {
    //     try {
    //         const token = localStorage.getItem('access_token');
    //         const response = await axios.get('https://apis.agrisarathi.com/fposupplier/UserProfileView', {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });

    //         if (response?.data?.data?.profile) {
    //             const { skip_status } = response.data.data.profile; // Extract skip_status

    //             setSkipStatus(skip_status);
    //             setModalOpen(!skip_status); // Open dialog if false, close if true
    //         }
    //     } catch (error) {
    //         console.error('Error fetching skip status', error);
    //     }
    // };

    // useEffect(() => {
    //     fetchSkipStatus();
    //     fetchProfileCompletionStatus();
    // }, []);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("access_token"); // Get token from localStorage
            if (!token) {
                setError("No access token found.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(GetHomeScreenKPI, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.data.status === "success") {
                    setData({
                        active_employees: response.data.active_employees,
                        inactive_employees: response.data.inactive_employees,
                    });
                } else {
                    setError("Failed to fetch data.");
                }
            } catch (err) {
                setError("Error fetching data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);



    return (
        <>

            <div className="flex flex-col min-h-screen  p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Employee Status</h2>

                {loading ? (
                    <p className="text-lg text-blue-500 font-semibold">Loading...</p>
                ) : error ? (
                    <p className="text-lg text-red-500 font-semibold">{error}</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Active Employees Card */}
                        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center transition-transform transform hover:scale-105">
                            <FaUserCheck className="text-green-500 text-5xl mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700">Active Employees</h3>
                            <p className="text-3xl font-bold text-gray-900">{data?.active_employees}</p>
                        </div>

                        {/* Inactive Employees Card */}
                        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center transition-transform transform hover:scale-105">
                            <FaUserSlash className="text-red-500 text-5xl mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700">Inactive Employees</h3>
                            <p className="text-3xl font-bold text-gray-900">{data?.inactive_employees}</p>
                        </div>
                    </div>
                )}
            </div>






            <div className="w-full mx-auto p-4">

                <div className='md:flex md:justify-between'>


                    {profileStatus && !profileStatus?.isComplete && (
                        <div className='md:flex md:justify-between px-4'>
                            <div className="flex flex-col md:flex-row  items-center space-x-6 mb-8">

                                {/* <div className="relative">
                                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                        <CircularProgress
                                            size={148}
                                            variant="determinate"
                                            value={profileStatus?.profileCompletion}
                                            sx={{
                                                color: '#00B251',
                                                "& .MuiCircularProgress-circle": {
                                                    strokeLinecap: "round", 
                                                },
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                width: 140, // Adjust size as needed
                                                height: 140,
                                                borderRadius: '50%',
                                                overflow: 'hidden', 
                                                zIndex: -1
                                            }}
                                        >
                                            <img
                                                src={profileData || women}
                                                alt="Profile"
                                                width="100%"
                                                height="100%"
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </Box>
                                    </Box>


                                </div> */}

                                {/* Profile Completion Details */}
                                {/* <div>
                                    <p className="text-gray-700 font-medium text-center mb-2">{profileStatus?.profileCompletion}% Completed</p>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            textTransform: 'none',
                                            backgroundColor: '#00B251',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: '#00B251',
                                            },
                                        }}
                                        onClick={() => navigate('/profile')}
                                    >
                                        Complete Your Profile
                                    </Button>
                                </div> */}
                            </div>
                        </div>
                    )}


                    {/* Announcements */}
                    <div className="mb-8 bg-white p-4 rounded-lg shadow md">

                        {/* <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Announcements</h2>
                            <button className="text-[#00B251] hover:underline text-sm">View all</button>
                        </div> */}

                        {/* Announcements List */}
                        {/* <div className="space-y-2">
                            {[1, 2].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center bg-white p-2 rounded-md shadow-sm border border-gray-200"
                                >
                                   
                                    <div className="w-26 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            src={accoumentimg}
                                            alt="Announcement"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                   
                                    <div className="ml-3">
                                        <h3 className="font-medium text-sm text-gray-900">
                                            Pradhan Mantri Fasal Bima Yojana...
                                        </h3>
                                        <p className="text-xs text-gray-600 mt-1 leading-tight">
                                            Aims to provide insurance and coverage support for many farmers...
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div> */}
                    </div>
                </div>

                {/* Custom Slider Banner */}
                {/* <div className='md:px-10'>
                    <div className="relative rounded-2xl overflow-hidden shadow-lg ">
                        <div className="relative rounded-2xl overflow-hidden shadow-lg ">
                            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                                {slides.map((slide, index) => (
                                    <div
                                        key={index}
                                        className="min-w-full"
                                        style={{
                                            backgroundImage: `url(${slide?.image})`,
                                            height: '400px',
                                            backgroundSize: 'cover',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'end',
                                        }}
                                    >
                                        <div className="text-black text-center w-1/2">
                                            <h2 className="text-xl font-semibold mb-4 text-center">{slide?.title}</h2>
                                            <button
                                                style={{  textTransform: 'none', backgroundColor: slide?.buttonColor }}
                                                className="text-white px-6 py-2 rounded-lg"
                                                onClick={() => navigate(slide?.navigateTo)} // Navigate to the route
                                            >
                                                {slide?.buttonText}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* Custom Dot Indicators */}
                {/* <div className='mt-4'>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2 ">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${currentSlide === index ? 'w-8 bg-[#00B251]' : 'w-2 bg-gray-300'}`}
                            />
                        ))}
                    </div>
                </div> */}

                {/* <div className="flex items-center justify-center py-4 mt-20 text-gray-500">
                    <span className="mr-2 text-sm">Powered by</span>
                    <div className="relative h-8">
                        <img
                            src="/api/placeholder/120/40"
                            alt="AgriSarthi Logo"
                            className="h-full object-contain"
                        />
                    </div>
                </div> */}

                {/* {modalOpen && (
                    <Dialog
                        open={modalOpen}
                        fullWidth
                        maxWidth="lg"
                        onClose={() => setModalOpen(false)}
                        sx={{
                            '& .MuiDialog-paper': {
                                borderRadius: '20px',
                                backgroundColor: '#F2F2F2',
                                width: '90vw',
                                maxWidth: '900px',
                                minWidth: '300px',
                                height: '80vh',
                                maxHeight: '90vh',
                                minHeight: '400px',
                                margin: 'auto',
                                display: 'flex',  // Makes content fit inside
                                flexDirection: 'column', // Stacks content properly
                            },
                        }}
                    >
                       
                        <Stack sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
                           
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '40px',
                                    right: '40px',
                                    zIndex: 1,
                                    color: '#B1B1B1'
                                }}
                            >
                                <button variant="outlined" onClick={() => setModalOpen(false)}>Skip</button>
                            </div>

                          
                            <Stack spacing={2} sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: '70vh' }}>
                                {TABS?.map((item) => currentIndex === item?.key && item?.component)}
                            </Stack>
                        </Stack>

                      
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{
                                borderTop: '1px solid #ddd', // Adds subtle separation
                                p: 2,
                                background: '#F2F2F2',
                            }}
                        >
                           
                            <div style={{ width: '10%' }}>
                                {currentIndex > 1 && (
                                    <Button
                                        onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 1))}
                                        sx={{ textTransform: "none", color: "#6B6B6B", fontWeight: "bold" }}
                                        disabled={currentIndex === 1}
                                        startIcon={<ArrowBackIos fontSize='small' />}
                                    >
                                        Previous
                                    </Button>
                                )}
                            </div>

                            
                            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ width: '80%' }}>
                                {TABS.map((item) => (
                                    <IconButton
                                        onClick={() => setCurrentIndex(item?.key)}
                                        sx={{
                                            color: currentIndex === item?.key ? '#fff' : '#000',
                                            height: 30,
                                            fontSize: 16,
                                            py: 2,
                                            px: 1.5,
                                            backgroundColor: currentIndex === item?.key ? '#00B251' : '',
                                            '&:hover': { color: '#000' },
                                        }}
                                    >
                                        {item?.key}
                                    </IconButton>
                                ))}
                            </Stack>

                           
                            <div style={{ width: '10%' }}>
                                {currentIndex < 5 && (
                                    <Button
                                        onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, 5))}
                                        sx={{ textTransform: "none", color: "#00B251", fontWeight: "bold" }}
                                        disabled={currentIndex === 5}
                                        endIcon={<ArrowForwardIos fontSize='small' />}
                                    >
                                        Next
                                    </Button>
                                )}
                            </div>
                        </Stack>
                    </Dialog>
                )} */}
            </div>

        </>
    );
};

export default DashboardHeader;
