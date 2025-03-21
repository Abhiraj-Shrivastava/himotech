import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import Navbar from "../../Navbar";
import { UserProfileView, UpdateProfile } from "../../Api_url";

const BankDetailsForm = () => {
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
      Swal.fire("Error", "No token found, please login again!", "error");
      return;
    }

    if (
      !accountName ||
      !accountNumber ||
      !bankName ||
      !ifscCode ||
      !businessEstablishDate ||
      !panNumber ||
      !registrationId ||
      !gstNumber ||
      !mobileMoney // Check if mobileMoney is filled
    ) {
      Swal.fire("Warning", "Please fill in all required fields.", "warning");
      return;
    }

    const isValidAccountNumber = /^[0-9]+$/.test(accountNumber);
    if (!isValidAccountNumber) {
      Swal.fire("Error", "Account number must be numeric.", "error");
      return;
    }

    const isValidPanNumber = /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panNumber);
    if (!isValidPanNumber) {
      Swal.fire("Error", "Invalid PAN number. It should be in the format AAAAA9999A.", "error");
      return;
    }

    const isValidGstNumber = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[Z]{1}[0-9A-Z]{1}$/.test(gstNumber);
    if (!isValidGstNumber) {
      Swal.fire("Error", "Invalid GST number. It should be in the format XX999999999A.", "error");
      return;
    }

    const isValidAccountName = /^[a-zA-Z\s]+$/.test(accountName);
    if (!isValidAccountName) {
      Swal.fire("Error", "Invalid Account Name. It should only contain alphabets and spaces.", "error");
      return;
    }

    const isValidBankName = /^[a-zA-Z\s]+$/.test(bankName);
    if (!isValidBankName) {
      Swal.fire("Error", "Invalid Bank Name. It should only contain alphabets and spaces.", "error");
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
        Swal.fire("Success", "Bank details updated successfully!", "success").then(() => {
          // Redirect after success
        });
      }
    } catch (error) {
      Swal.fire("Error", "Failed to update profile, please try again.", "error");
    }
  };

  return (
    <>


      <div className="flex justify-center items-center space-x-4 mb-6 md:p-0 p-5">
        <div className="flex items-center space-x-2">
          <div className="md:w-4 md:h-4 w-6 h-4 rounded-full bg-green-500" />
          <button onClick={() => navigate("/profile")}>
            <span className="text-sm text-gray-700">Profile details</span>
          </button>
        </div>
        <div className="w-16 h-[2px] bg-gray-400" />
        <div className="flex items-center space-x-2">
          <div className="md:w-4 md:h-4 w-6 h-4 rounded-full bg-green-500" />
          <button onClick={() => navigate("/shopdetails")}>
            <span className="text-sm text-gray-700">Shop Details</span>
          </button>
        </div>
        <div className="w-16 h-[2px] bg-gray-400" />
        <div className="flex items-center space-x-2">
          <div className="md:w-4 md:h-4 w-6 h-4 rounded-full bg-green-500" />
          <button onClick={() => navigate("/bankdetails")}>
            <span className="text-sm text-gray-700">Bank Details</span>
          </button>
        </div>
      </div>

      {/* Form Section */}

      <div className="w-['80%'] bg-gray-100 rounded-2xl shadow-lg">
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

      <div className="col-span-8 flex justify-between mt-4">
        <Button variant="outlined" color="secondary" className="!text-green-600 !border-green-600 hover:!bg-green-50" onClick={() => navigate("/shopdetails")}>
          Back
        </Button>
        <Button variant="contained" className="!bg-green-600 !hover:bg-green-700" type="submit" onClick={handleSubmit}>Save</Button>
      </div>
    </>
  );
};

export default BankDetailsForm;
