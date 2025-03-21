import React, { useState, useEffect } from "react";
import {
    Avatar,
    Button,
    Select,
    MenuItem,
    TextField,
    InputLabel,
    Autocomplete,
} from "@mui/material";
import { useNavigate } from "react-router";
import { UploadFileOutlined } from "@mui/icons-material";
import axios from "axios";
import Swal from "sweetalert2";
import { UserProfileView, UpdateProfilePicture, UpdateProfile } from '../Api_url';
import StorefrontIcon from "@mui/icons-material/Storefront";
import CorporateFareIcon from '@mui/icons-material/CorporateFare';

const ProfileScreen = () => {
    const navigate = useNavigate();

    const [image, setImage] = useState(null);
    const [logoImage, setLogoImage] = useState(null);
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [selectedState, setSelectedState] = useState("");
    const [loadingStates, setLoadingStates] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        state: "",
        district: "",
        name: "",
        phone: "",
        email: "",
        address: "",
        villageTown: "",
        pinCode: "",
    });

    // Function to fetch the profile data
    const fetchProfileData = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.get(UserProfileView, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            const profile = response?.data?.data?.profile;
            const country_id = profile?.country;

            if (country_id === undefined) {
                setError("Country ID is missing from the profile.");

                return; // Stop execution if country_id is missing
            }

            // Proceed to fetch states if country_id exists
            fetchStates(country_id);

            setFormData({
                ...formData,
                name: profile?.fpo_name,
                phone: profile?.mobile,
                email: profile?.email,
                address: profile?.address,
                state: profile?.state,
                district: profile?.district,
                villageTown: profile?.village || "",
            });

            setImage(profile?.profile); // Set the profile image
            setLogoImage(profile?.company_logo); // Set the logo image
        } catch (error) {
            setError('Error fetching profile data.');

        }
    };

    const fetchStates = async (country_id) => {
        if (!country_id) {
            setError("Invalid country ID.");
            return; // Prevent fetching states if country_id is invalid or undefined
        }
        setLoadingStates(true);
        try {
            // Ensure you're passing the country_id to the API endpoint
            const response = await axios.get(`https://apis.agrisarathi.com/home/GetStates?user_language=1&country_id=${country_id}`);

            // Assuming the API response includes a 'states_data' property
            setStates(response?.data?.states_data || []);
        } catch (error) {
            setError('Error fetching states.');

        } finally {
            setLoadingStates(false);
        }
    };

    const fetchDistricts = async () => {
        if (formData?.state) {
            setLoadingDistricts(true);
            try {
                const response = await axios.get(
                    `https://apis.agrisarathi.com/home/GetStateDistrictsASuperadamin?state=${formData.state}&user_language=1`
                );
                setDistricts(response?.data?.states_data || []);
            } catch (error) {
                setError('Error fetching districts.');
            } finally {
                setLoadingDistricts(false);
            }
        } else {
            setDistricts([]);
        }
    };

    useEffect(() => {
        fetchStates();
        fetchProfileData();
    }, []);

    useEffect(() => {
        fetchDistricts();
    }, [formData?.state]);

    const handleImageUpload = (event) => {
        const file = event?.target?.files[0];
        if (file) {
            setImage(URL?.createObjectURL(file));
            uploadProfileImage(file);
        }
    };

    const handleLogoUpload = (event) => {
        const file = event?.target?.files[0];
        if (file) {
            setLogoImage(URL?.createObjectURL(file));
            uploadCompanyLogo(file);
        }
    };

    const uploadProfileImage = async (file) => {
        const formData = new FormData();
        formData?.append("profile", file);
        formData?.append("filter_type", "profile");

        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.put(
                UpdateProfilePicture,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.data.message) {
                Swal.fire({
                    title: "Success",
                    text: "Profile image updated!",
                    icon: "success",
                    didOpen: () => {
                        // Adjusting z-index of the Swal container
                        const swalElement = document.querySelector('.swal2-container');
                        if (swalElement) {
                            swalElement.style.zIndex = 1500;  // You can change this value as needed
                        }
                    }
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Failed to update profile image.",
                    icon: "error",
                    didOpen: () => {
                        const swalElement = document.querySelector('.swal2-container');
                        if (swalElement) {
                            swalElement.style.zIndex = 1500; // Adjust z-index for the error case
                        }
                    }
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Error uploading profile image.",
                icon: "error",
                didOpen: () => {
                    const swalElement = document.querySelector('.swal2-container');
                    if (swalElement) {
                        swalElement.style.zIndex = 1500;  // Adjust z-index for error state
                    }
                }
            });
        }
    };

    const uploadCompanyLogo = async (file) => {
        const formData = new FormData();
        formData.append("profile", file);
        formData.append("filter_type", "company");

        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.put(
                UpdateProfilePicture,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.data.message) {
                Swal.fire({
                    title: "Success",
                    text: "Company logo updated!",
                    icon: "success",
                    didOpen: () => {
                        const swalElement = document.querySelector('.swal2-container');
                        if (swalElement) {
                            swalElement.style.zIndex = 1500;  // Adjust z-index as needed
                        }
                    }
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Failed to update company logo.",
                    icon: "error",
                    didOpen: () => {
                        const swalElement = document.querySelector('.swal2-container');
                        if (swalElement) {
                            swalElement.style.zIndex = 1500;  // Adjust z-index for error case
                        }
                    }
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Error uploading company logo.",
                icon: "error",
                didOpen: () => {
                    const swalElement = document.querySelector('.swal2-container');
                    if (swalElement) {
                        swalElement.style.zIndex = 1500;  // Adjust z-index for error state
                    }
                }
            });
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // if (!formData.name || !formData.phone || !formData.email || !formData.address || !formData.state || !formData.district || !formData.villageTown) {
        //     Swal.fire("Warning", "Please fill all the required fields.", "warning");
        //     return;
        // }

        const payload = {
            mobile_no: formData.phone,
            fpo_name: formData.name,
            address: formData.address,
            village: formData.villageTown,
            email: formData.email,
            state_id: formData.state,
            district_id: formData.district,
        };

        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.put(
                UpdateProfile,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.message) {
                Swal.fire({
                    title: "Success",
                    text: "Profile updated successfully!",
                    icon: "success",
                    didOpen: () => {
                        const swalElement = document.querySelector('.swal2-container');
                        if (swalElement) {
                            swalElement.style.zIndex = 1500;  // Adjust z-index as needed
                        }
                    }
                });

            } else {
                Swal.fire({
                    title: "Error",
                    text: "Failed to update profile.",
                    icon: "error",
                    didOpen: () => {
                        const swalElement = document.querySelector('.swal2-container');
                        if (swalElement) {
                            swalElement.style.zIndex = 1500;  // Adjust z-index for error case
                        }
                    }
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "There was an issue with the API request.",
                icon: "error",
                didOpen: () => {
                    const swalElement = document.querySelector('.swal2-container');
                    if (swalElement) {
                        swalElement.style.zIndex = 1500;  // Adjust z-index for error state
                    }
                }
            });
        }
    };

    return (
        <>
            {/* <div className="flex justify-center items-center space-x-4 mb-6 md:p-0 p-5">
                <div className="flex items-center space-x-2">
                    <div className="md:w-4 md:h-4 w-6 h-4 rounded-full bg-green-500" />
                    <button onClick={() => (navigate('/profile'))}>
                        <span className="text-sm text-gray-700">Profile details</span>
                    </button>
                </div>
                <div className="w-16 h-[2px] bg-gray-400" />
                <div className="flex items-center space-x-2">
                    <div className="md:w-4 md:h-4 w-6 h-4 rounded-full bg-gray-400" />
                    <button onClick={() => (navigate('/shopdetails'))}>
                        <span className="text-sm text-gray-700">Shop Details</span>
                    </button>
                </div>
                <div className="w-16 h-[2px] bg-gray-400" />
                <div className="flex items-center space-x-2">
                    <div className="md:w-4 md:h-4 w-6 h-4 rounded-full bg-gray-400" />
                    <button onClick={() => (navigate('/bankdetails'))}>
                        <span className="text-sm text-gray-700">Bank Details</span>
                    </button>
                </div>
            </div> */}

            <h1 className="text-2xl font-medium text-center text-gray-800 my-10">
                Profile Details
            </h1>
            {/* Form */}
            <form className=" " onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 p-6">
                    {/* Left Section */}
                    <div>
                        {/* Profile Picture */}
                        <div className="flex flex-col items-center">
                            <Avatar
                                src={image || "https://via.placeholder.com/100"}
                                sx={{ width: '120px', height: '120px' }}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="mt-2"
                                id="image-upload"
                                hidden
                            />
                            <label htmlFor="image-upload">
                                <Button
                                    variant="outlined"
                                    component="label"
                                    className="px-6 text-sm font-semibold text-black bg-white border border-gray-400 rounded-xl shadow-sm hover:bg-gray-100 transition-all"
                                    sx={{
                                        marginTop: 1,
                                        borderRadius: "8px",
                                        borderColor: "#BEBEBE",
                                        color: "#313131", // Text color
                                        fontSize: "14px", // Matches the font size
                                        textTransform: 'none',
                                        padding: "1px 12px", // Spacing inside the button
                                        backgroundColor: "#fff",

                                        "&:hover": {
                                            backgroundColor: "#fff", // Light gray on hover
                                        }
                                    }}
                                >
                                    Upload Picture
                                    <input type="file" hidden onChange={handleImageUpload} />
                                </Button>
                            </label>
                        </div>

                        {/* File Uploads */}
                        <div className="mt-6 space-y-4 flex justify-center md:mt-10">
                            <div className="flex justify-center items-center flex-col">
                                {/* Show uploaded logo if available, otherwise show the default MUI icon */}
                                {logoImage ? (
                                    <div className="mt-2 text-center  md:mt-5">
                                        <img
                                            src={logoImage}
                                            alt="Company Logo Preview"
                                            className="w-32 h-32 object-cover rounded-full border-2 border-gray-300"
                                        />
                                    </div>
                                ) : (
                                    // Default placeholder with MUI icon
                                    <div className="w-32 h-32 bg-[#B1B1B1] rounded-full flex items-center justify-center mb-3 shadow-md mt-2 md:mt-5">
                                        <CorporateFareIcon sx={{ color: "#fff", fontSize: 80 }} /> {/* White icon */}
                                    </div>
                                )}

                                {/* Upload Button */}
                                <Button
                                    variant="outlined"
                                    component="label"
                                    className="px-6 text-lg font-semibold text-black bg-white border border-gray-400 rounded-xl shadow-sm hover:bg-gray-100 transition-all"
                                    sx={{
                                        marginTop: 1,
                                        borderRadius: "8px",
                                        borderColor: "#BEBEBE",
                                        color: "#313131", // Text color
                                        fontSize: "14px",
                                        textTransform: "none",
                                        padding: "1px 12px",
                                        backgroundColor: "#fff",
                                        "&:hover": { backgroundColor: "#fff" },
                                    }}
                                >
                                    Upload Company Logo
                                    <input type="file" hidden onChange={handleLogoUpload} />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="col-span-2 px-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Name & Phone */}
                            <div className="flex flex-col md:col-span-2">
                                <label className="block text-md text-gray-500 mb-2">Name</label>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    sx={{
                                        height: 39,
                                        borderRadius: '8px',
                                        backgroundColor: '#fff',
                                        borderColor: '#F2F2F2',
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#F2F2F2',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#F2F2F2',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#fff',
                                                borderWidth: '0px',
                                                boxShadow: 'none',
                                            },
                                        },
                                        '& .MuiOutlinedInput-input': {
                                            padding: '10px 14px',
                                        },
                                    }}
                                />
                            </div>
                            <div className="flex flex-col md:col-span-2">
                                <label className="block text-md text-gray-500 mb-2">Phone Number</label>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    sx={{
                                        height: 39,
                                        borderRadius: '8px',
                                        backgroundColor: '#fff',
                                        borderColor: '#F2F2F2',
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#F2F2F2',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#F2F2F2',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#fff',
                                                borderWidth: '0px',
                                                boxShadow: 'none',
                                            },
                                        },
                                        '& .MuiOutlinedInput-input': {
                                            padding: '10px 14px',
                                        },
                                    }}
                                />
                            </div>

                            {/* Email */}
                            <div className="flex flex-col md:col-span-2">
                                <label className="block text-md text-gray-500 mb-2">Email ID</label>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    sx={{
                                        height: 39,
                                        borderRadius: '8px',
                                        backgroundColor: '#fff',
                                        borderColor: '#F2F2F2',
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#F2F2F2',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#F2F2F2',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#fff',
                                                borderWidth: '0px',
                                                boxShadow: 'none',
                                            },
                                        },
                                        '& .MuiOutlinedInput-input': {
                                            padding: '10px 14px',
                                        },
                                    }}
                                />
                            </div>

                            {/* Address */}
                            <div className="flex flex-col md:col-span-2">
                                <label className="block text-md text-gray-500 mb-2">Address</label>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    sx={{
                                        height: 39,
                                        borderRadius: '8px',
                                        backgroundColor: '#fff',
                                        borderColor: '#F2F2F2',
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#F2F2F2',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#F2F2F2',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#fff',
                                                borderWidth: '0px',
                                                boxShadow: 'none',
                                            },
                                        },
                                        '& .MuiOutlinedInput-input': {
                                            padding: '10px 14px',
                                        },
                                    }}
                                />
                            </div>


                            {/* State and District Autocompletes */}
                            <div className="flex flex-col space-y-2">
                                {/* State Autocomplete */}
                                <label className="text-sm text-gray-600">State</label>
                                <Autocomplete
                                    fullWidth
                                    size="small"
                                    value={states.find((state) => state.id === formData.state) || null}
                                    onChange={(e, value) => {
                                        const updatedFormData = { ...formData, state: value ? value.id : '' };
                                        setFormData(updatedFormData);
                                    }}
                                    options={states}
                                    getOptionLabel={(option) => option.state_name || ''}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            size="small"
                                            style={{
                                                borderRadius: '8px',
                                                backgroundColor: '#fff',
                                                borderColor: '#F2F2F2',
                                            }}
                                            sx={{
                                                height: 39,
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: '#F2F2F2',
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: '#F2F2F2',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#fff',
                                                        borderWidth: '0px',
                                                        boxShadow: 'none',
                                                    },
                                                },
                                                '& .MuiOutlinedInput-input': {
                                                    padding: '10px 14px',
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </div>

                            <div className="flex flex-col space-y-2">
                                {/* District Autocomplete */}
                                <label className="text-sm text-gray-600">District</label>
                                <Autocomplete
                                    fullWidth
                                    size="small"
                                    value={districts.find((district) => district.id === formData.district) || null}
                                    onChange={(e, value) => {
                                        const updatedFormData = { ...formData, district: value ? value.id : '' };
                                        setFormData(updatedFormData);
                                    }}
                                    options={districts}
                                    getOptionLabel={(option) => option.district_name || ''}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            size="small"
                                            style={{
                                                borderRadius: '8px',
                                                backgroundColor: '#fff',
                                                borderColor: '#F2F2F2',
                                            }}
                                            sx={{
                                                height: 39,
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: '#F2F2F2',
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: '#F2F2F2',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#fff',
                                                        borderWidth: '0px',
                                                        boxShadow: 'none',
                                                    },
                                                },
                                                '& .MuiOutlinedInput-input': {
                                                    padding: '10px 14px',
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </div>



                            {/* Village/Town */}
                            <div className="flex flex-col md:col-span-2">
                                <label className="block text-md text-gray-500 mb-2">Village/Town</label>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={formData.villageTown}
                                    onChange={(e) => setFormData({ ...formData, villageTown: e.target.value })}
                                    sx={{
                                        height: 39,
                                        borderRadius: '8px',
                                        backgroundColor: '#fff',
                                        borderColor: '#F2F2F2',
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#F2F2F2',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#F2F2F2',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#fff',
                                                borderWidth: '0px',
                                                boxShadow: 'none',
                                            },
                                        },
                                        '& .MuiOutlinedInput-input': {
                                            padding: '10px 14px',
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buttons */}

            </form>



            <div className="col-span-2 flex justify-end p-5 px-8 ">
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="success"
                    className="!bg-[#00B251] hover:bg-[#00B251] h-8"
                    type="submit"
                >
                    Submit
                </Button>
            </div>

        </>
    );
};

export default ProfileScreen;
