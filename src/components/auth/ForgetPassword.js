import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import Swal from 'sweetalert2';
import OtpGenerator from './OtpGenerator';
import { PasswordResetRequestAPIView } from '../Api_url';
import img1 from '../../assets/unsplash_01vS-aVPaVA.png'
import img2 from '../../assets/unsplash_IQVFVH0ajag.png'
import img3 from '../../assets/unsplash_ZSZ6wzNU12Q.png'
import img4 from '../../assets/unsplash_ajZibDGpPew.png'
import logo from '../../assets/agri.png'

const images = [img1, img2, img3, img4];

const ForgetPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState(null);
    const [bgIndex, setBgIndex] = useState(0);


    useEffect(() => {

        const interval = setInterval(() => {
            setBgIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            Swal.fire('Error', 'Please enter a valid email address.', 'error');
            return;
        }
        const otpVal = OtpGenerator()
        setOtp(otpVal)
        setLoading(true);
        console.log(otpVal)

        try {
            const response = await axios.post(PasswordResetRequestAPIView, {
                email: email,
                user_type: "fpo",
                otp: otpVal,
            });


            if (response?.status === 200) {
                Swal.fire('Success', 'OTP is send in your email .', 'success');
                navigate("/opt", { state: { otpValue: otpVal, email: email, user_type: "fpo" } });
            } else {
                Swal.fire('Error', 'Failed to send reset email. Please try again.', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'An error occurred. Please try again later.', 'error');
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
                        Forgot Your Password
                    </h1>
                    <p className="text-center text-xs mb-6 text-white">
                        Please provide the email address that you signed up for your account.
                    </p>
                    <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-white font-medium mb-2">
                                Email Id
                            </label>
                            <input
                                type="email"
                                placeholder="Enter Your Email Id"
                                className="w-full p-1.5 border rounded-md"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <p className="text-center text-xs text-white">
                                We will send you an email that will allow you to reset your password.
                            </p>
                        </div>
                        <div className="my-4 text-center">
                            <button
                                type="submit"
                                className={`bg-[#00B251] text-white text-lg font-medium py-1.5 px-12 rounded-md hover:bg-[#00B251] transform hover:scale-105 transition-transform duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Reset Password'}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>

    );
};

export default ForgetPassword;
