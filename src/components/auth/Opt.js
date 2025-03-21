import React, { useEffect, useState } from 'react';
import { MuiOtpInput } from 'mui-one-time-password-input';
import { Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import img1 from '../../assets/unsplash_01vS-aVPaVA.png'
import img2 from '../../assets/unsplash_IQVFVH0ajag.png'
import img3 from '../../assets/unsplash_ZSZ6wzNU12Q.png'
import img4 from '../../assets/unsplash_ajZibDGpPew.png'
import logo from '../../assets/agri.png'

const images = [img1, img2, img3, img4];

const Opt = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOtp] = useState('');
    const [bgIndex, setBgIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const otpValue = location?.state?.otpValue || null;
    const email = location?.state?.email || "";
    const user_type = location?.state?.user_type

    useEffect(() => {

        const interval = setInterval(() => {
            setBgIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (value) => {
        setOtp(value);
    };

    const handleSubmit = () => {
        if (otp?.length === 6) {
            if (otp == otpValue) {
                Swal.fire({
                    title: 'Success!',
                    text: 'OTP verified successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                }).then(() => {
                    navigate('/newpassword', { state: { otpValue: otpValue, email: email, user_type: user_type } });
                });
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'OTP does not match. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'Retry',
                });
            }
        } else {
            Swal.fire({
                title: 'Invalid Input',
                text: 'Please enter a valid 6-digit OTP.',
                icon: 'warning',
                confirmButtonText: 'OK',
            });
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
                        Enter OTP
                    </h1>
                    <p className="text-center text-white ">
                        Please provide the OTP that we sent in your email address.
                    </p>

                    <div>
                        <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
                            <MuiOtpInput
                                value={otp}
                                onChange={handleChange}
                                length={6}
                                type="number"
                                gap={2}
                                sx={{
                                    '& input': {
                                        backgroundColor: 'white',
                                        borderRadius: 1
                                    }
                                }}
                            />
                        </Box>
                    </div>


                    <div className="my-8 text-center">
                        <button
                            onClick={handleSubmit}
                            type="submit"
                            className={`bg-[#00B251] text-white text-lg font-medium py-1.5 px-16 rounded-md hover:bg-[#00B251]  transform hover:scale-105 transition-transform duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Submit'}
                        </button>
                    </div>
                </div>
            </div>
        </div>



    );
};

export default Opt;
