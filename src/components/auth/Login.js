import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { useLoginApi } from "./LoginAction";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import img1 from '../../assets/unsplash_01vS-aVPaVA.png'
import img2 from '../../assets/unsplash_IQVFVH0ajag.png'
import img3 from '../../assets/unsplash_ZSZ6wzNU12Q.png'
import img4 from '../../assets/unsplash_ajZibDGpPew.png'
import logo from '../../assets/agri.png'

const images = [img1, img2, img3, img4];


const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userLoginLoading = useSelector((state) => state.user.userLoginLoading);
    const { login } = useLoginApi();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [bgIndex, setBgIndex] = useState(0);

    const isFormValid = email && password


    // Regular expression for email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    useEffect(() => {

        const interval = setInterval(() => {
            setBgIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
            navigate("/home");
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            Swal.fire("Error", "Please fill in both email and password.", "error");
            return;
        }

        if (!emailRegex.test(email)) {
            Swal.fire("Invalid Email", "Please enter a valid email address.", "error");
            return;
        }

        const data = {
            email: email,
            password: password,
            user_type: "employer",
        };

        try {
            await login(data);
        } catch (error) {
            Swal.fire("Login Failed", "Please check your credentials and try again.", "error");
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
                    <h1 className="md:text-4xl text-xl font-bold text-white text-center mb-4 ">Log In</h1>

                    <form className="grid grid-cols-1 gap-4" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-white font-medium mb-1">Email ID</label>
                            <input
                                type="email"
                                placeholder="Enter Your Email ID"
                                className="w-full p-1.5 border rounded-md  "
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-white font-medium mb-1 ">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter Your Password"
                                    className="w-full p-1.5 border rounded-md pr-10  "
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                        <div className="flex justify-center mt-4">
                            <button
                                type="submit"
                                className={`bg-[#00B251] flex justify-center  items-center  text-white text-lg font-medium py-1.5 px-16 rounded-md hover:bg-green-600  transform hover:scale-105 transition-transform duration-300 ${userLoginLoading || !isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={userLoginLoading || !isFormValid}
                            >
                                {userLoginLoading ? "Logging In..." : "Log In"}
                            </button>
                        </div>

                    </form>

                    <div className="text-right mt-2">
                        <button onClick={() => navigate("/forgetpassword")} className="text-[#00B251]  md:text-md">
                            Forgot password?
                        </button>
                    </div>

                    <div className="flex items-center justify-center space-x-2 mt-6">
                        <p className="md:text-lg text-white">Create an account?</p>
                        <button onClick={() => navigate("/registration")} className="text-[#00B251] md:text-lg">
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
