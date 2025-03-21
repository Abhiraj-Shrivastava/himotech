import React, { useState, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { UserProfileView, UpdateProfile } from "../Api_url";

const BankScreen = () => {
    const [bankName, setBankName] = useState("");
    const [accountName, setAccountName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [ifscCode, setIfscCode] = useState("");
    const [panNumber, setPanNumber] = useState("");
    const [registrationId, setRegistrationId] = useState("");
    const [gstNumber, setGstNumber] = useState("");
    const [businessEstablishDate, setBusinessEstablishDate] = useState("");
    const [mobileMoney, setMobileMoney] = useState(""); // Added new state for mobile_money
    const navigate = useNavigate();

    // Fetch existing bank details
    const fetchBankDetails = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            Swal.fire("Error", "No token found, please login again!", "error");
            return;
        }

        try {
            const response = await axios.get(UserProfileView, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const { bank_details } = response?.data?.data;

            setBankName(bank_details.bank_name || "");
            setAccountName(bank_details.accountholder_name || "");
            setAccountNumber(bank_details.account_number || "");
            setIfscCode(bank_details.ifsc_code || "");
            setPanNumber(bank_details.pan_no || "");
            setRegistrationId(bank_details.registration_id || "");
            setGstNumber(bank_details.gst_number || "");
            setBusinessEstablishDate(bank_details.business_establishdate || "");
            setMobileMoney(bank_details.mobile_money || ""); // Fetch mobile_money
        } catch (error) {
            // Swal.fire("Error", "Failed to fetch bank details.", "error");
        }
    };

    useEffect(() => {
        fetchBankDetails();
    }, []); // Run once when component mounts

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const token = localStorage.getItem("access_token");
  
      if (!token) {
          Swal.fire({
              title: "Error",
              text: "No token found, please login again!",
              icon: "error",
              didOpen: () => {
                  const swalElement = document.querySelector('.swal2-container');
                  if (swalElement) {
                      swalElement.style.zIndex = 1500;
                  }
              }
          });
          return;
      }
  
      const isValidAccountNumber = /^[0-9]+$/.test(accountNumber);
      if (!isValidAccountNumber) {
          Swal.fire({
              title: "Error",
              text: "Account number must be numeric.",
              icon: "error",
              didOpen: () => {
                  const swalElement = document.querySelector('.swal2-container');
                  if (swalElement) {
                      swalElement.style.zIndex = 1500;
                  }
              }
          });
          return;
      }
  
      const isValidPanNumber = /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panNumber);
      if (!isValidPanNumber) {
          Swal.fire({
              title: "Error",
              text: "Invalid PAN number. It should be in the format AAAAA9999A.",
              icon: "error",
              didOpen: () => {
                  const swalElement = document.querySelector('.swal2-container');
                  if (swalElement) {
                      swalElement.style.zIndex = 1500;
                  }
              }
          });
          return;
      }
  
      const isValidGstNumber = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[Z]{1}[0-9A-Z]{1}$/.test(gstNumber);
      if (!isValidGstNumber) {
          Swal.fire({
              title: "Error",
              text: "Invalid GST number. It should be in the format XX999999999A.",
              icon: "error",
              didOpen: () => {
                  const swalElement = document.querySelector('.swal2-container');
                  if (swalElement) {
                      swalElement.style.zIndex = 1500;
                  }
              }
          });
          return;
      }
  
      const isValidAccountName = /^[a-zA-Z\s]+$/.test(accountName);
      if (!isValidAccountName) {
          Swal.fire({
              title: "Error",
              text: "Invalid Account Name. It should only contain alphabets and spaces.",
              icon: "error",
              didOpen: () => {
                  const swalElement = document.querySelector('.swal2-container');
                  if (swalElement) {
                      swalElement.style.zIndex = 1500;
                  }
              }
          });
          return;
      }
  
      const isValidBankName = /^[a-zA-Z\s]+$/.test(bankName);
      if (!isValidBankName) {
          Swal.fire({
              title: "Error",
              text: "Invalid Bank Name. It should only contain alphabets and spaces.",
              icon: "error",
              didOpen: () => {
                  const swalElement = document.querySelector('.swal2-container');
                  if (swalElement) {
                      swalElement.style.zIndex = 1500;
                  }
              }
          });
          return;
      }
  
      // Prepare the request body
      const body = {
          accountholder_name: accountName,
          account_number: accountNumber,
          bank_name: bankName,
          ifsc_code: ifscCode,
          business_establishdate: businessEstablishDate,
          pan_no: panNumber,
          registration_id: registrationId,
          gst_number: gstNumber,
          mobile_money: mobileMoney,
      };
  
      try {
          const response = await axios.put(UpdateProfile, body, {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          });
  
          if (response.status === 200) {
              Swal.fire({
                  title: "Success",
                  text: "Bank details updated successfully!",
                  icon: "success",
                  didOpen: () => {
                      const swalElement = document.querySelector('.swal2-container');
                      if (swalElement) {
                          swalElement.style.zIndex = 1500;
                      }
                  }
              }).then(() => {
  
              });
          }
      } catch (error) {
          Swal.fire({
              title: "Error",
              text: "Failed to update profile, please try again.",
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
  

    return (
        <>
            <h1 className="text-2xl font-medium text-center text-gray-800 my-10">
                Bank Details
            </h1>
            {/* Form Section */}
            <div className=" w-['80%'] bg-gray-100  ">
                 <form className="grid grid-cols-2 p-6 md:mt-5" >
                          <div className="col-span-8 grid md:grid-cols-2 gap-4">
                            {/* Bank Name */}
                            <div className="flex flex-col md:grid-cols-2">
                              <label className="block text-md text-gray-500 mb-2">Bank Name</label>
                              <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
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
                
                            {/* Account Holder Name */}
                            <div className="flex flex-col md:grid-cols-2">
                              <label className="block text-md text-gray-500 mb-2">Account Holder Name</label>
                              <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={accountName}
                                onChange={(e) => setAccountName(e.target.value)}
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
                
                            {/* Account Number */}
                            <div className="flex flex-col md:grid-cols-2">
                              <label className="block text-md text-gray-500 mb-2">Account Number</label>
                              <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
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
                
                            {/* IFSC Code */}
                            <div className="flex flex-col md:grid-cols-2">
                              <label className="block text-md text-gray-500 mb-2">IFSC Code</label>
                              <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={ifscCode}
                                onChange={(e) => setIfscCode(e.target.value)}
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
                
                            {/* Pan Number */}
                            <div className="flex flex-col md:grid-cols-2">
                              <label className="block text-md text-gray-500 mb-2">Pan Number</label>
                              <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={panNumber}
                                onChange={(e) => setPanNumber(e.target.value)}
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
                
                            {/* Registration Id */}
                            <div className="flex flex-col md:grid-cols-2">
                              <label className="block text-md text-gray-500 mb-2">Registration Id</label>
                              <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={registrationId}
                                onChange={(e) => setRegistrationId(e.target.value)}
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
                
                            {/* GST Number */}
                            <div className="flex flex-col md:grid-cols-2">
                              <label className="block text-md text-gray-500 mb-2">GST Number</label>
                              <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={gstNumber}
                                onChange={(e) => setGstNumber(e.target.value)}
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
                
                            {/* UPI ID */}
                            <div className="flex flex-col md:grid-cols-2">
                              <label className="block text-md text-gray-500 mb-2">UPI ID</label>
                              <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={mobileMoney}
                                onChange={(e) => setMobileMoney(e.target.value)}
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
                
                            {/* Business Establish Date */}
                            <div className="col-span-2 md:col-span-2 flex flex-col">
                              <label className="block text-md text-gray-500 mb-2">Business Establish Date</label>
                              <TextField
                                fullWidth // This still ensures it takes up the full width
                                variant="outlined"
                                size="small"
                                type="date"
                                value={businessEstablishDate}
                                onChange={(e) => setBusinessEstablishDate(e.target.value)}
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
                        </form>
                
            </div>
            <div className="col-span-2 flex justify-end mt-4 p-5 px-8 ">

                <Button variant="contained" className="!bg-[#00B251] hover:bg-[#00B251] h-8" type="submit" onClick={handleSubmit}>Submit</Button>
            </div>
        </>
    );
};

export default BankScreen;
