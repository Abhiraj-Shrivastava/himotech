import React, { useState, useEffect } from "react";
import {
  Button,
  InputLabel,
  TextField,
  Autocomplete,
  IconButton,

} from "@mui/material";
import { useNavigate } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";
import { UserProfileView, AddShopbyFPOSupplier } from '../Api_url'
import StorefrontIcon from '@mui/icons-material/Storefront';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';


const ShopScreen = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [forms, setForms] = useState([
    {
      shopName: "",
      shopContactNo: "",
      shopalternate_no: "",
      shopaddress: "",
      shopLatitude: "",
      shopLongitude: "",
      shop_opentime: "",
      shop_closetime: "",
      shop_opendays: "",
      shop_closedon: "",
      shopimage: null,
      state: "",
      district: "",
      shop_id: null,
    }
  ]);

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  const token = localStorage.getItem("access_token");

  const fetchStates = async (country_id) => {
    if (!country_id) {
      console.error("Invalid country ID.");
      return;
    }
    setLoadingStates(true);
    try {
      const response = await axios.get(
        `https://apis.agrisarathi.com/home/GetStates?user_language=1&country_id=${country_id}`
      );
      console.log("Fetched States Data:", response?.data?.states_data);
      setStates(response?.data?.states_data || []);
    } catch (error) {
      
    } finally {
      setLoadingStates(false);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(UserProfileView, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const profileData = response?.data?.data?.profile;
        const country_id = profileData?.country;
        if (!country_id) {
          console.error("Country ID is missing from the profile.");
          return;
        }

        fetchStates(country_id); // Fetch states only after getting country_id
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);


  useEffect(() => {
    fetchStates();
    fetchShopData();
  }, []);

  const fetchShopData = async () => {
    try {
      const response = await axios.get(
        "https://apis.agrisarathi.com/fposupplier/GetallShops",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.message === "suceess" && Array.isArray(response.data.data)) {
        const mappedShopData = response.data.data.map(shop => ({
          shopName: shop.shopName || "",
          shopContactNo: shop.shopContactNo || "",
          shopalternate_no: shop.shopalternate_no || "",
          shop_opentime: shop.shop_opentime || "",
          shop_closetime: shop.shop_closetime || "",
          shop_opendays: shop.shop_opendays || "",
          shop_closedon: shop.shop_closedon || "",
          shopLatitude: shop.shopLatitude || "",
          shopLongitude: shop.shopLongitude || "",
          shopaddress: shop.shopaddress || "",
          shopimage: shop.shopimage || null,
          state: shop.state || "",
          district: shop.district || "",
          shop_id: shop.shop_id || null,
        }));
        if (mappedShopData?.length > 0) {
          setForms(mappedShopData);
        } else {
          setForms([{
            shopName: "",
            shopContact: "",
            alternateContact: "",
            shopAddress: "",
            shopLatitude: "",
            shopLongitude: "",
            openTime: "",
            closeTime: "",
            openDays: "",
            closeDays: "",
            shopImage: "",
            state: "",
            district: "",
            shop_id: null,
          },]);
        }
      }
    } catch (error) {
      console.error("Error fetching shop data:", error);
      Swal.fire("Error", "Unable to fetch shop data.", "error");
    }
  };

  const handleStateChange = async (index, event, value) => {
    const selectedState = value?.id || value;
    const newForms = [...forms];

    // Update the selected state and reset district
    newForms[index].state = selectedState;
    newForms[index].district = ""; // Reset district when state is changed

    setForms(newForms); // Update the form state

    if (!selectedState) {
      setDistricts([]);  // If no state is selected, reset districts
      return;
    }

    // Fetch districts for selected state
    setLoadingDistricts(true);
    try {
      const response = await axios.get(
        `https://apis.agrisarathi.com/home/GetStateDistrictsASuperadamin?state=${selectedState}&user_language=1`
      );

      if (Array.isArray(response?.data?.states_data)) {
        setDistricts(response?.data?.states_data || []);
      } else {
        console.error("Districts data is not an array:", response?.data);
        setDistricts([]);
      }
      setLoadingDistricts(false);
    } catch (error) {
      console.error("Error fetching districts:", error);
      setLoadingDistricts(false);
    }
  };


  const handleFormChange = (index, event) => {
    const newForms = [...forms];
    newForms[index][event.target.name] = event.target.value;
    setForms(newForms);
  };

  const handleImageUpload = async (event, index) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("shop", file); // Use "shop" as the key

    const token = localStorage.getItem("access_token");

    try {
      const response = await axios.put(
        "https://apis.agrisarathi.com/fposupplier/UpdateShopPicture",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Shop image uploaded successfully.",
          icon: "success",
          didOpen: () => {
            const swalElement = document.querySelector('.swal2-container');
            if (swalElement) {
              swalElement.style.zIndex = 1500;
            }
          }
        });

        // Update form state with uploaded image URL
        const newForms = [...forms];
        newForms[index].shopimage = response.data.imageUrl; // Assuming API returns image URL
        setForms(newForms);
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to upload image.",
          icon: "error",
          didOpen: () => {
            const swalElement = document.querySelector('.swal2-container');
            if (swalElement) {
              swalElement.style.zIndex = 1500;
            }
          }
        });
      }
    } catch (error) {

      Swal.fire({
        title: "Error",
        text: "First fill and submit the shop details then upload picture.",
        icon: "error",
        didOpen: () => {
          const swalElement = document.querySelector('.swal2-container');
          if (swalElement) {
            swalElement.style.zIndex = 1500;
          }
        }
      });
    }

  };

  const handleAddForm = () => {
    setForms([
      ...forms,
      {
        shopName: "",
        shopContact: "",
        alternateContact: "",
        shopAddress: "",
        shopLatitude: "",
        shopLongitude: "",
        openTime: "",
        closeTime: "",
        openDays: "",
        closeDays: "",
        shopImage: "",
        state: "",
        district: "",
        shop_id: null,
      },
    ]);
  };

  // Handle removing a shop form
  const handleRemoveForm = (index) => {
    const newForms = forms.filter((_, i) => i !== index);
    setForms(newForms);
  };

  // Submit form data to the API
  const handleSubmit = async () => {
    // Check if all required fields are filled
    for (let shop of forms) {
      if (
        !shop.shopName ||
        !shop.shopContactNo ||
        !shop.shop_opentime ||
        !shop.shop_closetime ||
        !shop.shop_opendays ||
        !shop.shop_closedon ||
        
        !shop.state
        
      ) {
        Swal.fire({
          title: "Warning",
          text: "Please fill Shop name, contact, opentime, closetime opendays, closedays, and state in all required fields before submitting.",
          icon: "warning",
          didOpen: () => {
            const swalElement = document.querySelector(".swal2-container");
            if (swalElement) {
              swalElement.style.zIndex = 1500;
            }
          },
        });
        return; 
      }
    }
  
    const payload = {
      shops: forms.map((shop) => ({
        shopName: shop.shopName,
        shopContactNo: shop.shopContactNo,
        shop_opentime: shop.shop_opentime,
        shop_closetime: shop.shop_closetime,
        shop_opendays: shop.shop_opendays,
        shop_closedon: shop.shop_closedon,
        shopLatitude: shop.shopLatitude,
        shopLongitude: shop.shopLongitude,
        shopalternate_no: shop.shopalternate_no,
        shopaddress: shop.shopaddress,
        state: shop.state,
        district: shop.district,
      })),
    };
  
    try {
      const response = await axios.post(
        "https://apis.agrisarathi.com/fposupplier/AddShopbyFPOSupplier",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.status === 201) {
        Swal.fire({
          title: "Success!",
          text: "Shop details submitted successfully.",
          icon: "success",
          didOpen: () => {
            const swalElement = document.querySelector(".swal2-container");
            if (swalElement) {
              swalElement.style.zIndex = 1500;
            }
          },
        });
        
      } else {
        Swal.fire({
          title: "Error",
          text: "There was an issue submitting your data.",
          icon: "error",
          didOpen: () => {
            const swalElement = document.querySelector(".swal2-container");
            if (swalElement) {
              swalElement.style.zIndex = 1500;
            }
          },
        });
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      Swal.fire({
        title: "Error",
        text: "Something went wrong. Please try again.",
        icon: "error",
        didOpen: () => {
          const swalElement = document.querySelector(".swal2-container");
          if (swalElement) {
            swalElement.style.zIndex = 1500;
          }
        },
      });
    }
  };
  
  
  const handleDeleteShop = async (shopId) => {
    try {
      const response = await axios.delete(
        AddShopbyFPOSupplier,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          data: {
            shops: [shopId], // Send the shop ID inside an array
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          title: "Deleted!",
          text: "Shop deleted successfully.",
          icon: "success",
          didOpen: () => {
            const swalElement = document.querySelector('.swal2-container');
            if (swalElement) {
              swalElement.style.zIndex = 1500;
            }
          }
        });
        setForms(forms.filter((shop) => shop.shop_id !== shopId)); // Remove from UI
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to delete shop.",
          icon: "error",
          didOpen: () => {
            const swalElement = document.querySelector('.swal2-container');
            if (swalElement) {
              swalElement.style.zIndex = 1500;
            }
          }
        });
      }
    } catch (error) {
      console.error("Error deleting shop:", error);
      Swal.fire({
        title: "Error",
        text: "Something went wrong. Please try again.",
        icon: "error",
        didOpen: () => {
          const swalElement = document.querySelector('.swal2-container');
          if (swalElement) {
            swalElement.style.zIndex = 1500;
          }
        }
      });
    }

  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setForms({ ...forms, shopimage: file }); // Assuming setForm is a state setter
  };

  return (
    <>
      {/* Form Section */}
      <h1 className="text-2xl font-medium text-center text-gray-800 my-10">
        Shop Details
      </h1>
      {forms.map((form, index) => (
          <form key={index} className="flex flex-col gap-6 bg-gray-100 p-6 shadow-md rounded-2xl mb-8 " >
            <div className="flex justify-end">
              <IconButton
                color="error"
                onClick={() => handleDeleteShop(form.shop_id)}
                disabled={!form.shop_id} // Disable if shop ID is not available
              >
                <DeleteIcon />
              </IconButton>
            </div>
            {/* Main Grid Layout */}
            <div className="grid md:grid-cols-3 gap-2">
              {/* Image Upload */}
              <div className="md:col-span-1 flex flex-col items-center justify-center">
                {/* Sample Image or Placeholder */}
                {form.shopimage ? (
                  typeof form.shopimage === "string" ? (
                    // Load image from API URL
                    <img
                      src={`https://apis.agrisarathi.com/${form.shopimage}`}
                      alt="Shop"
                      className="w-32 h-32 object-cover rounded-full shadow-md mb-4"
                    />
                  ) : (
                    // Show preview for newly selected file
                    <img
                      src={URL.createObjectURL(form.shopimage)}
                      alt="Shop"
                      className="w-32 h-32 object-cover rounded-full shadow-md mb-4"
                    />
                  )
                ) : (
                  // Default placeholder when no image exists
                  <div className="w-32 h-32 bg-[#B1B1B1] rounded-full flex items-center justify-center mb-3 shadow-md">
                    <StorefrontIcon sx={{ color: '#fff', fontSize: '90px' }} />
                  </div>
                )}



                {/* Hidden file input */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  id={`upload-image-${index}`}
                />

                {/* Upload Button */}
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
                  Upload Shop Picture
                  <input type="file" hidden onChange={(e) => handleImageUpload(e, index)} />
                </Button>
              </div>

              {/* Form Fields */}
              <div className="grid md:grid-cols-2 md:col-span-2 gap-2" style={{ marginTop: 20 }}>
                <div>
                  <InputLabel>Open Time</InputLabel>
                  <Autocomplete
                    fullWidth
                    size="small"
                    name="openTime"
                    value={form.shop_opentime || null}
                    onChange={(event, value) => {
                      const newForms = [...forms];
                      newForms[index].shop_opentime = value || ""; // Ensure value is not null
                      setForms(newForms);
                    }}
                    options={["1 a.m", "2 a.m", "3 a.m", "4 a.m", "5 a.m", "6 a.m", "7 a.m", "8 a.m", "9 a.m", "10 a.m", "11 a.m"]}
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

                <div>
                  <InputLabel>Close Time</InputLabel>
                  <Autocomplete
                    fullWidth
                    size="small"
                    name="closeTime"
                    value={form.shop_closetime || null}
                    onChange={(event, value) => {
                      const newForms = [...forms];
                      newForms[index].shop_closetime = value || ""; // Ensure value is not null
                      setForms(newForms);
                    }}
                    options={["12 p.m", "1 p.m", "2 p.m", "3 p.m", "4 p.m", "5 p.m", "6 p.m", "7 p.m", "8 p.m", "9 p.m", "10 p.m", "11 p.m"]}
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

                <div>
                  <InputLabel>Open Days</InputLabel>
                  <Autocomplete
                    fullWidth
                    size="small"
                    name="openDays"
                    value={form.shop_opendays || null}
                    onChange={(event, value) => {
                      const newForms = [...forms];
                      newForms[index].shop_opendays = value || ""; // Ensure value is not null
                      setForms(newForms);
                    }}
                    options={["Monday - Tuesday", "Monday - Wednesday", "Monday - Thursday", "Monday - Friday", "Monday - Saturday", "Monday - Sunday"]}
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

                <div>
                  <InputLabel>Close Days</InputLabel>
                  <Autocomplete
                    fullWidth
                    size="small"
                    name="closeDays"
                    value={form.shop_closedon || null}
                    onChange={(event, value) => {
                      const newForms = [...forms];
                      newForms[index].shop_closedon = value || ""; // Ensure value is not null
                      setForms(newForms);
                    }}
                    options={["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]}
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
              </div>

              {/* Shop Name */}
              <div className="w-full">
                <label className="block text-md text-gray-500 mb-2">Shop Name</label>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  name="shopName"
                  value={form.shopName}
                  onChange={(e) => handleFormChange(index, e)}
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

              {/* State */}
              <div>
                <InputLabel>State</InputLabel>
                <Autocomplete
                  fullWidth
                  size="small"
                  name="state"
                  value={states.find((state) => state.id === form?.state) || null}
                  onChange={(e, value) => handleStateChange(index, e, value)}  // Update state and reset district
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

              {/* District */}
              <div>
                <InputLabel>District</InputLabel>
                <Autocomplete
                  fullWidth
                  size="small"
                  name="district"
                  value={districts.find((district) => district.id === form?.district) || null}  // Bind to form state
                  onChange={(e, value) => {
                    // Ensure value has id
                    const newForms = [...forms];
                    newForms[index].district = value?.id || value; // Set selected district value
                    setForms(newForms); // Update forms state
                  }}
                  options={districts}
                  getOptionLabel={(option) => option.district_name || ''}  // Ensure the option contains district_name
                  disabled={loadingDistricts || !form?.state}  // Disable if no state is selected
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
                            borderWidth: '0px',
                            borderColor: '#F2F2F2',
                          },
                          '&:hover fieldset': {
                            borderWidth: '0px',
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


              {/* Shop Contact No. */}
              <div className="w-full">
                <label className="block text-md text-gray-500 mb-2">Shop Contact No.</label>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  name="shopContactNo"
                  value={form.shopContactNo}
                  onChange={(e) => handleFormChange(index, e)}  // Make sure to handle state correctly
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


              {/* Shop Address */}
              <div className="md:col-span-2">
                <label className="block text-md text-gray-500 mb-2">Shop Address</label>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  name="shopaddress"
                  value={form.shopaddress}
                  onChange={(e) => handleFormChange(index, e)}
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

              {/* Alternate Contact No. */}
              <div className="w-full">
                <label className="block text-md text-gray-500 mb-2">Alternate Contact No.</label>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  name="shopalternate_no"
                  value={form.shopalternate_no}
                  onChange={(e) => handleFormChange(index, e)}
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

              {/* Shop Latitude */}
              <div>
                <label className="block text-md text-gray-500 mb-2">Shop Latitude</label>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  name="shopLatitude"
                  value={form.shopLatitude}
                  onChange={(e) => handleFormChange(index, e)}
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

              {/* Shop Longitude */}
              <div>
                <label className="block text-md text-gray-500 mb-2">Shop Longitude</label>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  name="shopLongitude"
                  value={form.shopLongitude}
                  onChange={(e) => handleFormChange(index, e)}
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

            {/* Remove Button */}
            {(forms.length > 1 && !form?.shop_id) && (
              <div className="flex justify-end mt-4 text-white">
                <Button
                  variant="contained"
                  color="success"
                  className="!bg-[#00B251] hover:bg-[#00B251]"
                  onClick={() => handleRemoveForm(index)}
                >
                  Remove shop
                </Button>
              </div>
            )}

              <div className="col-span-2 flex justify-end mt-4 p-5 px-8 ">
                    {/* <Button
                        className="!text-green-600 !border-green-600 hover:!bg-green-50"
                        variant="outlined"
                        color="secondary"
                        onClick={() => navigate("/profile")}
                      >
                        Back
                      </Button> */}
                    <Button
                      variant="contained"
                      color="success"
                      className="h-8 !bg-[#00B251] hover:bg-[#00B251]"
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                  </div>

          </form>
        ))}
      {/* Add another shop button */}
      <div className="my-8 p-4 text-center">
        <Button
          onClick={handleAddForm}
          variant="contained"
          className="!bg-[#00B251] hover:bg-[#00B251]"
          startIcon={<AddIcon />}  // Adding the "+" icon at the start of the button text
          sx={{
            height: '32px',  // 8 * 4px for h-8 in Tailwind
            padding: '0 24px',  // 6px for px-6 and 2px for py-2 (adjusting to fit the previous padding)
            borderRadius: '8px',  // Rounded button similar to Tailwind's rounded-lg
          }}
        >
          Add Another Shop
        </Button>
      </div>

      <div className="col-span-2 flex justify-end mt-4 p-5 px-8 ">

        <Button
          variant="contained"
          color="success"
          className="h-8 !bg-[#00B251] hover:bg-[#00B251]"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>

    </>
  );
};

export default ShopScreen;
