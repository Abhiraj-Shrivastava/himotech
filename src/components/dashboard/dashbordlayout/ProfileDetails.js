// import React, { useState } from "react";
// import {
//     Avatar,
//     Button,
//     Select,
//     MenuItem,
//     TextField,
//     InputLabel,
// } from "@mui/material";
// import { UploadFileOutlined } from "@mui/icons-material";
// import { useDispatch, useSelector } from "react-redux";
// import { setProfileData } from "./ProfileDetailsSlice";
// import { useNavigate } from "react-router";

// const ProfileDetails = () => {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const profileData = useSelector(state => state.profile.profileData)
//     const [image, setImage] = useState(null);
//     console.log('====================================');
//     console.log(profileData);
//     console.log('====================================');

//     const [formData, setFormData] = useState({
//         name: profileData?.name || "",
//         phone: profileData?.phone || "",
//         email: profileData?.email || "",
//         address: profileData?.address || "",
//         villageTown: profileData?.villageTown || "",
//         district: profileData?.district || "",
//         state: profileData?.state || "",
//         pinCode: profileData?.pinCode || "",
//     });

//     const handleImageUpload = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             setImage(URL.createObjectURL(file));
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: value,
//         });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         // Handle form submission logic here
//         console.log(formData);
//         const data = {
//             ...profileData,
//             ...formData,
//             }
//             dispatch(setProfileData(data))
//             navigate('/shopdetails')
            
//     };

//     return (
//         <div className="max-w-5xl mx-auto bg-gray-50   p-6">
//             {/* Progress Bar */}
//             <div className="flex justify-center items-center space-x-4 mb-6">
//                 <div className="flex items-center space-x-2">
//                     <div className="w-4 h-4 rounded-full bg-green-500" />
//                     <span className="text-sm text-gray-700">Profile details</span>
//                 </div>
//                 <div className="w-16 h-[2px] bg-gray-400" />
//                 <div className="flex items-center space-x-2">
//                     <div className="w-4 h-4 rounded-full bg-gray-400" />
//                     <span className="text-sm text-gray-700">Shop Details</span>
//                 </div>
//                 <div className="w-16 h-[2px] bg-gray-400" />
//                 <div className="flex items-center space-x-2">
//                     <div className="w-4 h-4 rounded-full bg-gray-400" />
//                     <span className="text-sm text-gray-700">Bank Details</span>
//                 </div>
//             </div>

//             {/* Form */}
//             <form className="bg-white shadow-lg rounded-xl " onSubmit={handleSubmit}>
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 ">
//                     {/* Left Section */}
//                     <div>
//                         {/* Profile Picture */}
//                         <div className="flex flex-col items-center">
//                             <Avatar
//                                 src={image || "https://via.placeholder.com/100"}
//                                 className="w-34 h-34"
//                             />
//                             <input
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={handleImageUpload}
//                                 className="mt-2"
//                                 id="image-upload"
//                                 hidden
//                             />
//                             <label htmlFor="image-upload">
//                                 <Button
//                                     variant="text"
//                                     className="mt-2 text-blue-500"
//                                     component="span"
//                                 >
//                                     Edit
//                                 </Button>
//                             </label>
//                         </div>

//                         {/* File Uploads */}
//                         <div className="mt-6 space-y-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-600">
//                                     Upload Document
//                                 </label>
//                                 <Button
//                                     variant="outlined"
//                                     startIcon={<UploadFileOutlined />}
//                                     className="w-full mt-2"
//                                     component="label"
//                                 >
//                                     Upload
//                                     <input type="file" hidden />
//                                 </Button>
//                             </div>
//                             {/* <div>
//                                 <label className="block text-sm font-medium text-gray-600">
//                                     FPO Registration Certificate
//                                 </label>
//                                 <Button
//                                     variant="outlined"
//                                     startIcon={<UploadFileOutlined />}
//                                     className="w-full mt-2"
//                                     component="label"
//                                 >
//                                     Upload
//                                     <input type="file" hidden />
//                                 </Button>
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-600">
//                                     Upload Banner
//                                 </label>
//                                 <Button
//                                     variant="outlined"
//                                     startIcon={<UploadFileOutlined />}
//                                     className="w-full mt-2"
//                                     component="label"
//                                 >
//                                     Upload
//                                     <input type="file" hidden />
//                                 </Button>
//                             </div> */}
//                         </div>
//                     </div>

//                     {/* Right Section */}
//                     <div className="col-span-2">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             {/* Name & Phone */}
//                             <div className="flex flex-col">
//                                 <TextField
//                                     label="Name"
//                                     fullWidth
//                                     variant="outlined"
//                                     className="bg-gray-50 rounded-md"
//                                     name="name"
//                                     value={formData.name}
//                                     onChange={handleChange}
//                                 />
//                             </div>
//                             <div className="flex flex-col">
//                                 <TextField
//                                     label="Phone Number"
//                                     fullWidth
//                                     variant="outlined"
//                                     className="bg-gray-50 rounded-md"
//                                     name="phone"
//                                     value={formData.phone}
//                                     onChange={handleChange}
//                                 />
//                             </div>

//                             {/* Email */}
//                             <div className="flex flex-col">
//                                 <TextField
//                                     label="Email ID"
//                                     fullWidth
//                                     variant="outlined"
//                                     className="bg-gray-50 rounded-md"
//                                     name="email"
//                                     value={formData.email}
//                                     onChange={handleChange}
//                                 />
//                             </div>

//                             {/* Address */}
//                             <div className="flex flex-col md:col-span-2">
//                                 <TextField
//                                     label="Address"
//                                     fullWidth
//                                     variant="outlined"
//                                     className="bg-gray-50 rounded-md"
//                                     name="address"
//                                     value={formData.address}
//                                     onChange={handleChange}
//                                 />
//                             </div>

//                             {/* Village/Town & District */}
//                             <div className="flex flex-col">
//                                 <TextField
//                                     label="Village/Town"
//                                     fullWidth
//                                     variant="outlined"
//                                     className="bg-gray-50 rounded-md"
//                                     name="villageTown"
//                                     value={formData.villageTown}
//                                     onChange={handleChange}
//                                 />
//                             </div>
//                             <div className="flex flex-col">
//                                 <InputLabel>District</InputLabel>
//                                 <Select
//                                     fullWidth
//                                     name="district"
//                                     value={formData.district}
//                                     onChange={handleChange}
//                                     className="bg-gray-50 rounded-md"
//                                 >
//                                     <MenuItem value="">Select District</MenuItem>
//                                     {/* Add dynamic options */}
//                                 </Select>
//                             </div>

//                             {/* State & Pin Code */}
//                             <div className="flex flex-col">
//                                 <InputLabel>State</InputLabel>
//                                 <Select
//                                     fullWidth
//                                     name="state"
//                                     value={formData.state}
//                                     onChange={handleChange}
//                                     className="bg-gray-50 rounded-md"
//                                 >
//                                     <MenuItem value="">Select State</MenuItem>
//                                     {/* Add dynamic options */}
//                                 </Select>
//                             </div>
//                             <div className="flex flex-col">
//                                 <TextField
//                                     label="Pin Code"
//                                     fullWidth
//                                     variant="outlined"
//                                     className="bg-gray-50 rounded-md"
//                                     name="pinCode"
//                                     value={formData.pinCode}
//                                     onChange={handleChange}
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Buttons */}
//                 <div className="flex justify-between mt-8 p-4">
//                     <Button
//                         variant="outlined"
//                         className="bg-gray-100 text-gray-700 hover:bg-gray-200"
//                     >
//                         Cancel
//                     </Button>
//                     <Button
//                         variant="contained"
//                         color="success"
//                         className="bg-green-500 hover:bg-green-600"
//                         type="submit"
//                     >
//                         Save
//                     </Button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default ProfileDetails;
