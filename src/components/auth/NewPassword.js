import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { PasswordResetAPIView } from '../Api_url';
import img1 from '../../assets/unsplash_01vS-aVPaVA.png'
import img2 from '../../assets/unsplash_IQVFVH0ajag.png'
import img3 from '../../assets/unsplash_ZSZ6wzNU12Q.png'
import img4 from '../../assets/unsplash_ajZibDGpPew.png'
import logo from '../../assets/agri.png'

const images = [img1, img2, img3, img4];



const NewPassword = () => {

    const navigate = useNavigate();

    const location = useLocation();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const otpValue = location?.state?.otpValue || null;
    const email = location?.state?.email || "";
    const user_type = location?.state?.user_type
    const [bgIndex, setBgIndex] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {

        const interval = setInterval(() => {
            setBgIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();


        if (newPassword !== confirmPassword) {
            Swal.fire({
                icon: 'warning',
                title: 'Passwords Do Not Match',
                text: 'Please ensure that the new password and confirm password fields match.',
            });
            return;
        }


        if (newPassword.length < 6) {
            Swal.fire({
                icon: 'warning',
                title: 'Password Too Short',
                text: 'Your new password must be at least 6 characters long.',
            });
            return;
        }

        try {
            setLoading(true);

            const response = await axios.put(
                PasswordResetAPIView,
                {
                    otp: otpValue,
                    email: email,
                    new_password: newPassword,
                    user_type: user_type,

                }
            );

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Password Updated',
                    text: 'Your password has been successfully updated.',
                });

                navigate('/login');


                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: error.response?.data?.message || 'An error occurred while updating your password.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url('https://apis.agrisarathi.com/media/home%20_page_animation%20(1).gif')`, width: '100%',}}
      >
            <div className="absolute top-4 left-4 z-10">

                <img src={logo} alt="Logo" className="w-60 h-auto" />
            </div>

            <div className="w-full h-screen flex items-center justify-end px-4   ">
                {/* Right side for Login Form */}
                <div className="w-full md:w-1/3 md:px-10 md:mr-10 bg-black bg-opacity-25 backdrop-blur-md p-5 rounded-2xl shadow-lg flex justify-center flex-col">
                    <h1 className="md:text-4xl text-xl font-bold text-white text-center mb-4">
                        Reset Password
                    </h1>
                    <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-white font-medium mb-1">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}  // Dynamically toggle type
                                    placeholder="Enter Your New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full p-1.5 border rounded-md"
                                    required
                                />

                                <button
                                    type="button"
                                    className="absolute right-3 top-3 text-gray-600 hover:text-gray-900"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-white font-medium mb-1">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}  // Dynamically toggle type
                                    placeholder="Confirm Your New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full p-1.5 border rounded-md"
                                    required
                                />

                                <button
                                    type="button"
                                    className="absolute right-3 top-3 text-gray-600 hover:text-gray-900"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                                </button>
                            </div>
                        </div>
                        <div className="mt-4 text-center">
                            <button
                                type="submit"
                                className="bg-[#00B251] text-white text-lg font-medium py-1.5 px-8 rounded-md hover:bg-[#00B251] transform hover:scale-105 transition-transform duration-300"
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Submit Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewPassword;
