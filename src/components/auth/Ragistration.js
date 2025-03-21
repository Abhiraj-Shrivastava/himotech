import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import Swal from 'sweetalert2';
import indiaFlag from '../../assets/india.png';
import ugandaFlag from '../../assets/uganda.png';
import { EmployerRegistration } from '../Api_url';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import img1 from '../../assets/unsplash_01vS-aVPaVA.png'
import img2 from '../../assets/unsplash_IQVFVH0ajag.png'
import img3 from '../../assets/unsplash_ZSZ6wzNU12Q.png'
import img4 from '../../assets/unsplash_ajZibDGpPew.png'
import logo from '../../assets/agri.png'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const images = [img1, img2, img3, img4];


const Registration = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [country, setCountry] = useState('1');
    const [bgIndex, setBgIndex] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const countries = [
        { value: "1", label: "India", flag: indiaFlag },
        { value: "2", label: "Uganda", flag: ugandaFlag },
    ];
    const handleSelectCountry = (value) => {
        setCountry(value);
        setIsOpen(false);
    };

    useEffect(() => {

        const interval = setInterval(() => {
            setBgIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !/^[a-zA-Z\s]+$/.test(name)) {
            Swal.fire('Error', 'Name should not contain numbers or special characters!', 'error');
            return;
        }

        // Phone number validation
        if (!phone || !/^\d+$/.test(phone)) {
            Swal.fire('Error', 'Phone number should only contain digits!', 'error');
            return;
        }

        // Email validation
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!email || !emailPattern.test(email)) {
            Swal.fire('Error', 'Please enter a valid email address!', 'error');
            return;
        }

        if (!name || !phone || !email || !password || !confirmPassword || !country) {
            Swal.fire('Warning', 'All fields are required!', 'warning');
            return;
        }

        if (password !== confirmPassword) {
            Swal.fire('Error', 'Passwords do not match!', 'error');
            return;
        }

        const userData = {
            mobile: phone,
            password: password,
            email: email,
            user_type: "employer",
            name: name,
            // country: country, 
        };

        try {
            const response = await axios.post(
                EmployerRegistration,
                userData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response?.status === 201) {
                Swal.fire('Success', 'User registered successfully!', 'success');
                navigate("/login");  // Navigate to home after successful registration
            } else {
                Swal.fire('Error', response?.data?.message || 'User with this mobile number already exists!', 'error');
            }
        } catch (error) {
            console.error("API Error:", error);

            if (error?.response) {
                console.error("API Response Error:", error?.response);

                if (error?.response.data && error?.response?.data?.message === "User with this mobile number already exists") {
                    Swal.fire('Error', 'User with this mobile number already exists', 'error');
                } else {
                    Swal.fire('Error', error?.response?.data?.message || 'User with this mobile number already exists! Try with another number', 'error');
                }
            } else if (error.request) {

                Swal.fire('Error', 'No response from the server. Please check your connection or try again later.', 'error');
            } else {

                Swal.fire('Error', 'Failed to register. Please try again later.', 'error');
            }
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: `url('https://apis.agrisarathi.com/media/home%20_page_animation%20(1).gif')`, width: '100%', }}
        >
            <div className="absolute top-4 left-4 z-10">
                {/* Logo at the top left */}
                <img src={logo} alt="Logo" className="w-60 h-auto" />
            </div>

            <div className="w-full h-[600px] flex items-center justify-end px-4 -mb-10">
                {/* Card Design for Sign Up Form */}
                <div className="w-full md:w-1/3 md:px-10 md:mr-10  bg-black bg-opacity-25 backdrop-blur-md p-4 rounded-2xl shadow-lg flex justify-center flex-col">
                    <h1 className="md:text-4xl text-xl font-bold text-white text-center mb-4">
                        Create an account
                    </h1>
                    {/* <p className="text-center mb-2 text-white">
                        Fill in your details below, and we’ll be in touch with the next steps
                    </p> */}

                    <form className="grid grid-cols-1 " onSubmit={handleSubmit}>
                        {/* Name Field */}
                        <div>
                            <label className="block text-white font-medium mb-1">Name</label>
                            <input
                                type="text"
                                placeholder="Enter Your Name"
                                className="w-full p-1.5 mb-2 border rounded-md"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        {/* Phone Number Field */}
                        <div>
                            <label className="block text-white font-medium mb-1">Phone Number</label>
                            <div className="relative flex items-center border rounded-md mb-2">
                                {/* Country Code Selection */}
                                <div
                                    className="flex items-center cursor-pointer p-1.5"
                                    onClick={() => setIsOpen(!isOpen)}
                                >
                                    {country ? (
                                        <div className="flex items-center">
                                            <img
                                                src={countries?.find(c => c.value === country)?.flag}
                                                alt="flag"
                                                className="w-8 h-8 mr-2"
                                            />
                                            <span>{countries.find(c => c?.value === country)?.code}</span>
                                            <ArrowDropDownIcon className="-ml-2 mr-2 text-white" color='#fff' />
                                        </div>
                                    ) : (
                                        <span className="text-white">Select Country</span>
                                    )}
                                </div>

                                {/* Input for Phone Number */}
                                <input
                                    type="text"
                                    placeholder="Enter Your Phone Number"
                                    className="w-full p-1.5  rounded-md"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)} // Handle phone input
                                />
                            </div>
                            {isOpen && (
                                <div className="absolute w-auto mt-1 border bg-white rounded-md shadow-lg z-10">
                                    {countries.map((c) => (
                                        <div
                                            key={c?.value}
                                            className="flex items-center p-3 cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSelectCountry(c?.value)}
                                        >
                                            <img src={c?.flag} alt={c?.label} className="w-5 h-5 mr-2" />
                                            {c?.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Email ID Field */}
                        <div>
                            <label className="block text-white font-medium mb-1">Email Id</label>
                            <input
                                type="email"
                                placeholder="Enter Your Email Id"
                                className="w-full  mb-2 p-1.5 border rounded-md"
                                value={email}
                                onChange={(e) => setEmail(e?.target?.value)}
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-white font-medium mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter Your Password"
                                    className="w-full  mb-2 p-2 border rounded-md"
                                    value={password}
                                    onChange={(e) => setPassword(e?.target?.value)}
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

                        {/* Confirm Password Field */}
                        <div>
                            <label className="block text-white font-medium mb-1">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm Your Password"
                                    className="w-full  mb-2 p-2 border rounded-md"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
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

                        {/* Submit Button */}
                        <div className="flex justify-center mt-4">
                            <button
                                type="submit"
                                className="bg-[#00B251] text-white text-lg flex justify-center items-center font-medium py-1.5 px-16 rounded-md hover:bg-[#00B251]  transform hover:scale-105 transition-transform duration-300"
                            >
                                Sign up
                            </button>
                        </div>
                    </form>

                    {/* Link to Login Page */}
                    <div className="flex items-center justify-center space-x-2 mt-4">
                        <p className="md:text-md text-white">Already have an account?</p>
                        <button onClick={() => navigate("/login")} className="text-[#00B251] md:text-lg">
                            Sign in
                        </button>
                    </div>
                </div>
            </div>
        </div>


    );
};

export default Registration;
