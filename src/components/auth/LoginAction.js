import { useDispatch } from "react-redux";
import { setUserEmail, setUserLoginLoading } from "./UserSlice";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router";
import {EmployerLogin} from '../Api_url'

export const useLoginApi = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const login = async (data) => {
        dispatch(setUserLoginLoading(true));
        try {
            const response = await axios.post(
                EmployerLogin,
                data
            );

            if (response?.status === 200 && response?.data?.tokens) {
                const { access, refresh } = response?.data?.tokens;

                if (!access || !refresh) {
                    Swal.fire("Error", "Failed to retrieve tokens. Please try again.", "error");
                    return;
                }


                localStorage.setItem("access_token", access);
                localStorage.setItem("refresh_token", refresh);
                
                // Swal.fire({
                //     icon: 'success',
                //     title: 'Login Successful!',
                //     text: 'Redirecting you to the dashboard...',
                //     showConfirmButton: false, // Hide the OK button
                //     timer: 2000, // Show for 2 seconds
                //     timerProgressBar: true, // Optional: Show a progress bar
                //     didOpen: () => {
                //         const swalElement = document.querySelector('.swal2-container');
                //         if (swalElement) {
                //           swalElement.style.zIndex = 1500;
                //         }
                //       }
                // });

                dispatch(setUserEmail(data?.email));
                
                navigate("/home");
            } else {
                Swal.fire("Error", "Login failed. Please check your credentials.", "error");
            }
        } catch (error) {
            console.error("Error during login:", error);

            if (error?.response) {
                Swal.fire("Error",  "Your email or password is incorrect.", "error");
            } else if (error?.request) {
                Swal.fire("Error", "No response received from the server. Please check your internet connection.", "error");
            } else {
                Swal.fire("Error", "An error occurred while setting up the request.", "error");
            }
        } finally {
            dispatch(setUserLoginLoading(false));
        }
    };

    return { login };
};
