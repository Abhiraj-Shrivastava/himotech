// MemberProfile.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GetSingleFarmerDetailsbyFPO } from '../../Api_url';
import img1 from "../../../assets/unsplash_IQVFVH0ajag.png";
import img2 from "../../../assets/3.png";
import img3 from "../../../assets/4.png";
import img4 from "../../../assets/5.png";
import { Person } from '@mui/icons-material';


const MemberProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // State to store various data
    const [member, setMember] = useState(null);
    const [landRecords, setLandRecords] = useState([]);
    const [farmerPosts, setFarmerPosts] = useState([]);
    const [diseaseRecords, setDiseaseRecords] = useState([]);
    const [totalLands, setTotalLands] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalDisease, setTotalDisease] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Replace with your actual token
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        const fetchMemberData = async () => {
            try {
                const response = await axios.get(GetSingleFarmerDetailsbyFPO, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include token in the request header
                    },
                    params: {
                        farmer_id: id,
                    },
                });

                const data = response?.data;
                setMember(data?.farmer_data);
                setLandRecords(data?.land_records);
                setTotalLands(data?.total_lands);
                setFarmerPosts(data?.farmer_posts);
                setTotalPosts(data?.total_posts);
                setDiseaseRecords(data?.disease_records);
                setTotalDisease(data?.total_disease);
            } catch (err) {
                setError('Error fetching member data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMemberData();
    }, [id, token]);

    // Show loading or error state if needed
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    // Navigate to the TablePage with the selected view and data
    const handleCardClick = (view) => {
        const data = view === 'lands' ? landRecords : view === 'posts' ? farmerPosts : diseaseRecords;
        navigate('/table', { state: { view, data } });
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="max-w-md mx-auto bg-white rounded-3xl shadow-lg overflow-hidden justify-center items-center">

                {/* Background Image */}
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={img1}
                        alt="Farm background"
                        className="w-full h-full object-cover"
                        style={{ clipPath: 'ellipse(70% 100% at 50% 0%)' }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-24" />
                </div>

                {/* Profile Section */}
                <div className="relative px-6 -mt-16">
                    <div className="relative">
                        {/* Profile Image */}
                        <div className="relative w-32 h-32 mx-auto">
                            {member?.profile ? (
                                <img
                                    className="w-full h-full object-cover rounded-full border-4 border-white shadow-xl"
                                    src={'https://apis.agrisarathi.com/' + member?.profile}
                                    alt={member?.name || 'Member'}
                                />
                            ) : (
                                <div className="w-full h-full bg-[#B1B1B1] flex items-center justify-center rounded-full border-4 border-white">
                                    <Person style={{ fontSize: 80, color: 'white' }} />
                                </div>
                            )}
                        </div>

                        {/* Profile Info */}
                        <div className="text-center mt-4 space-y-2">
                            <h2 className="text-xl font-semibold">Name: {member?.name || 'USER NAME'}</h2>
                            <div className="text-gray-600 space-y-1">
                                <p>Gender: {member?.gender || 'N/A'}</p>
                                <p>Mobile: {member?.mobile || 'N/A'}</p>
                                <p>Village: {member?.village || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-3 gap-4 mt-6 mb-6">
                        {/* Total Lands Card */}
                        <div
                            className="p-4 rounded-xl text-center relative cursor-pointer"
                            style={{ backgroundImage: `url(${img2})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                            onClick={() => handleCardClick('lands')} // Navigate to the TablePage with 'lands' data
                        >
                            <p className="text-2xl font-bold text-white">{totalLands || 0}</p>
                            <p className="text-sm text-white">Total Lands</p>
                        </div>

                        {/* Total Posts Card */}
                        <div
                            className="p-4 rounded-xl text-center relative cursor-pointer"
                            style={{ backgroundImage: `url(${img3})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                            onClick={() => handleCardClick('posts')} // Navigate to the TablePage with 'posts' data
                        >
                            <p className="text-2xl font-bold text-white">{totalPosts || 0}</p>
                            <p className="text-sm text-white">Total Posts</p>
                        </div>

                        {/* Total Diseases Card */}
                        <div
                            className="p-4 rounded-xl text-center relative cursor-pointer"
                            style={{ backgroundImage: `url(${img4})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                            onClick={() => handleCardClick('diseases')} // Navigate to the TablePage with 'diseases' data
                        >
                            <p className="text-2xl font-bold text-white">{totalDisease || 0}</p>
                            <p className="text-sm text-white">Total Diseases</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberProfile;
