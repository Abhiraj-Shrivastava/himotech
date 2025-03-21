import React, { useEffect, useState } from 'react';
import { TextField, Button, Dialog,  DialogContent, Typography, IconButton, Autocomplete, CircularProgress } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Swal from 'sweetalert2';
import axios from 'axios';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { CheckCustomerisFarmerornot, AddGetSalesbyFPO, GetInventoryProductsName } from '../../Api_url';

const AddSales = ({ openAddDialog, setOpenAddDialog }) => {
    const [salesData, setSalesData] = useState([
        {
            name: '',
            mobile_no: '',
            address: '',
            product_id: '',
            variant_id: '',
            quantity: '',
        },
    ]);

    const [products, setProducts] = useState([]);
    const [variants, setVariants] = useState([]);
    const [brands, setBrands] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [farmerAssociated, setFarmerAssociated] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch products from the API
    const fetchProducts = async (searchQuery = '') => {
        setLoading(true);
        try {
            const token = localStorage.getItem('access_token');

            // Prepare the URL with or without search query
            const url = searchQuery
                ? `${GetInventoryProductsName}?search=${searchQuery}` // If there's a search term, append it
                : GetInventoryProductsName; // Otherwise, just fetch all products

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.data?.results?.products) {
                setProducts(response.data.results.products); // Set the products state
            } else {
                setProducts([]); // If no products found
                Swal.fire('Error', 'No products found', 'error');
            }
        } catch (error) {
            setProducts([]); // If error occurs, clear the products
            Swal.fire('Error', 'Failed to fetch products', 'error');
        } finally {
            setLoading(false); // Stop loading once API request is done
        }
    };

    // Effect to fetch all products initially when the component loads
    useEffect(() => {
        fetchProducts(); // Initially fetch all products
    }, []);


    const handleProductChange = (event, newValue, index) => {
        const updatedSalesData = [...salesData];
        updatedSalesData[index].product_id = newValue?.product_name?.id || '';
        setSalesData(updatedSalesData);

        if (newValue) {
            setVariants([newValue?.variants] || []);
            setBrands([newValue?.brand_name] || []);
        } else {
            setVariants([]);
            setBrands([]);
        }
    };

    const handleVariantChange = (event, newValue, index) => {
        const updatedSalesData = [...salesData];
        updatedSalesData[index].variant_id = newValue?.variant_id || null;
        updatedSalesData[index].selectedVariant = newValue;
        setSalesData(updatedSalesData);
    };
    const handleBrandChange = (event, newValue, index) => {
        const updatedSalesData = [...salesData];
        updatedSalesData[index].brand_id = newValue?.brand_id || null;
        setSalesData(updatedSalesData);
    };

    const handleAddRow = () => {
        setSalesData([
            ...salesData,
            {
                name: '',
                mobile_no: '',
                address: '',
                product_id: '',
                variant_id: '',
                quantity: '',
            },
        ]);
    };

    const handleDeleteRow = (index) => {
        const updatedSalesData = salesData.filter((_, i) => i !== index);
        setSalesData(updatedSalesData);
    };

    const handleSubmit = async () => {
        // Validate if any row is incomplete
        for (let row of salesData) {
            if (
                !row.name ||
                !row.mobile_no ||
                !row.address ||
                !row.product_id ||
                !row.variant_id ||
                !row.quantity
            ) {
                Swal.fire({
                    icon: 'warning',
                    title: 'All fields are required',
                    text: 'Please fill all the fields.',
                    confirmButtonText: 'OK',
                    didOpen: () => {
                        const swalElement = document.querySelector('.swal2-container');
                        if (swalElement) {
                            swalElement.style.zIndex = 1500;
                        }
                    }
                });
                return; // Exit if validation fails
            }
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('access_token');

            // Check for access token
            // if (!token) {
            //     Swal.fire({
            //         icon: 'error',
            //         title: 'Error',
            //         text: 'No access token found',
            //     });
            //     return;
            // }

            // Prepare the buyer data and sales data for the request payload
            const buyerData = {
                name: salesData[0].name,
                mobile_no: salesData[0].mobile_no,
                address: salesData[0].address,
            };

            const salesDataPayload = salesData.map((row) => ({
                product_id: parseInt(row?.product_id),
                variant_id: parseInt(row?.variant_id),
                brand_id: row?.brand_id ? parseInt(row?.brand_id) : null,
                quantity: parseInt(row?.quantity),
            }));

            const payload = {
                buyer: JSON.stringify(buyerData),
                sales_data: JSON.stringify(salesDataPayload),
                discount: farmerAssociated ? discount : null,
            };

            // Prepare the file data (if exists)
            const file = salesData[0]?.file || null;
            const formData = new FormData();
            formData?.append('buyer', payload?.buyer);
            formData?.append('sales_data', payload?.sales_data);
            formData.append('discount', payload?.discount); 
            if (file) {
                formData.append('uploaded_file', file);
            }

            // Make the POST request to the backend API
            const response = await axios.post(AddGetSalesbyFPO, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response?.status === 201) {
                Swal.fire({
                    title: 'Success',
                    text: 'Inventory added successfully!',
                    icon: 'success',
                    didOpen: () => {
                        const swalElement = document.querySelector('.swal2-container');
                        if (swalElement) {
                            swalElement.style.zIndex = 1500; // Ensure it's above other modals
                        }
                    }
                });
                setOpenAddDialog(false); // Close the dialog after successful submission
            } else {
                Swal.fire({
                    title: 'Error',
                    text: response?.data?.message || 'Something went wrong',
                    icon: 'error',
                    didOpen: () => {
                        const swalElement = document.querySelector('.swal2-container');
                        if (swalElement) {
                            swalElement.style.zIndex = 1500; // Adjust the zIndex
                        }
                    }
                });
                setOpenAddDialog(false);
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error?.response?.data?.message || 'Something went wrong',
                icon: 'error',
                didOpen: () => {
                    const swalElement = document.querySelector('.swal2-container');
                    if (swalElement) {
                        swalElement.style.zIndex = 1500; // Adjust the zIndex
                    }
                }
            });
            setOpenAddDialog(false);


            const errorMessage = error?.response?.data?.message || 'Something went wrong';
            const errorTrace = error?.response?.data?.traceback || 'No traceback available';

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `${errorMessage}\n${errorTrace}`,
                didOpen: () => {
                    const swalElement = document.querySelector('.swal2-container');
                    if (swalElement) {
                        swalElement.style.zIndex = 1500;
                    }
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyMobileNumber = async (index) => {
        const mobileNo = salesData[index].mobile_no;

        if (!mobileNo) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please enter a mobile number',
                didOpen: () => {
                    const swalElement = document.querySelector('.swal2-container');
                    if (swalElement) {
                        swalElement.style.zIndex = 1500;
                    }
                }
            });
            return;
        }

        const token = localStorage.getItem('access_token');

        if (!token) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No access token found',
                didOpen: () => {
                    const swalElement = document.querySelector('.swal2-container');
                    if (swalElement) {
                        swalElement.style.zIndex = 1500;
                    }
                }
            });
            return;
        }

        try {
            const response = await axios.get(CheckCustomerisFarmerornot, {
                params: { mobile_no: mobileNo },
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response?.data?.associated) {
                setFarmerAssociated(true);
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Mobile number is associated with a farmer',
                    didOpen: () => {
                        const swalElement = document.querySelector('.swal2-container');
                        if (swalElement) {
                            swalElement.style.zIndex = 1500;
                        }
                    }
                });
            } else {
                setFarmerAssociated(false);
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning',
                    text: 'Farmer mobile number is not associated with the FPO',
                    didOpen: () => {
                        const swalElement = document.querySelector('.swal2-container');
                        if (swalElement) {
                            swalElement.style.zIndex = 1500;
                        }
                    }
                });
            }
        } catch (error) {
            setFarmerAssociated(false);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error?.response?.data?.message || 'Something went wrong',
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
        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} sx={{
            '& .MuiDialog-paper': {
                width: '70%',
                maxWidth: '70%',
                height: '80%',
                maxHeight: '80%',
                margin: 'auto',
                padding: '20px',
                borderRadius: 4,
                boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
                overflow: 'auto',
                backgroundColor: '#F2F2F2'
            },
        }}>
            <div className="flex justify-between items-center px-4 pb-4">
                <Button sx={{ color: '#A0A0A0' }} onClick={() => setOpenAddDialog(false)}>
                    Cancel
                </Button>
                <div className='mt-10' >
                    <Typography variant="h6" className="text-lg font-medium text-black">
                        Add Sales
                    </Typography>
                </div>

                <Button sx={{ color: '#00B251' }} onClick={handleSubmit}>
                    Submit
                </Button>
            </div>

            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {/* Customer Details */}
                <div className="mb-8 -mt-4">
                    <h3 className="text-gray-700 font-medium mb-4">Customer Details</h3>

                    {/* Grid Layout for Name & Address */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-500 text-sm mb-1">Customer Name</label>
                            <TextField
                                fullWidth
                                value={salesData[0].name}
                                onChange={(e) => setSalesData([{ ...salesData[0], name: e.target.value }])}
                                variant="outlined"
                                size="small"
                                style={{
                                    height: 39,
                                    borderRadius: '8px',
                                    backgroundColor: '#fff',
                                    borderColor: '#F2F2F2',
                                }}
                                sx={{
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
                        <div>
                            <label className="block text-gray-500 text-sm mb-1">Customer Address</label>
                            <TextField
                                fullWidth
                                value={salesData[0].address}
                                onChange={(e) => setSalesData([{ ...salesData[0], address: e.target.value }])}
                                variant="outlined"
                                size="small"
                                style={{
                                    height: 39,
                                    borderRadius: '8px',
                                    backgroundColor: '#fff',
                                    borderColor: '#F2F2F2',
                                }}
                                sx={{
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

                    {/* Grid Layout for Mobile No & Verify Button */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        {/* Mobile Number Input */}
                        <div>
                            <label className="block text-gray-500 text-sm mb-1">Customer Mobile No</label>
                            <TextField
                                fullWidth
                                value={salesData[0].mobile_no}
                                onChange={(e) => setSalesData([{ ...salesData[0], mobile_no: e.target.value }])}
                                variant="outlined"
                                size="small"
                                style={{
                                    height: 39,
                                    borderRadius: '8px',
                                    backgroundColor: '#fff',
                                    borderColor: '#F2F2F2',
                                }}
                                sx={{
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

                        {/* Verify Button (Right-Aligned) */}
                        <div className="flex justify-center items-center mt-4">
                            <button
                                onClick={() => handleVerifyMobileNumber(0)}
                                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
                            >
                                Verify Existing Farmer
                            </button>
                        </div>
                    </div>
                </div>

                {/* Product Details */}
                <div>
                    <h3 className="text-gray-700 font-medium mb-4">Product Details</h3>
                    {salesData.map((row, index) => (
                        <div key={index} className="w-full p-6 relative">
                            {/* Product Title and Delete Icon */}
                            <div className="flex justify-between items-center pb-2 border-b mb-4">
                                <Typography variant="h6" className="text-xl font-semibold text-gray-700">
                                    {`Product - ${index + 1}`}
                                </Typography>
                                {salesData.length > 1 && (
                                    <IconButton
                                        onClick={() => handleDeleteRow(index)}
                                        color="error"
                                        className="absolute"
                                        sx={{ top: 10, right: 10 }}
                                    >
                                        <DeleteOutlineOutlinedIcon />
                                    </IconButton>
                                )}
                            </div>

                            {/* Form Fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Product Name */}
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm text-gray-600">Product Name</label>
                                    <Autocomplete
                                        fullWidth
                                        options={products}
                                        getOptionLabel={(option) => option.product_name?.product_name || ''}
                                        value={products.find((item) => item?.product_name?.id === row?.product_id) || null}
                                        onChange={(e, val) => handleProductChange(e, val, index)}
                                        onInputChange={(e, value) => {
                                            setSearchTerm(value); // Update search term on input change
                                            fetchProducts(value); // Fetch products based on search term
                                        }}
                                        loading={loading} // Show loading spinner while fetching data
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                size="small"
                                                style={{
                                                    height: 39,
                                                    borderRadius: '8px',
                                                    backgroundColor: '#fff',
                                                    borderColor: '#F2F2F2',
                                                }}
                                                sx={{
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
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <React.Fragment>
                                                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                                            {params.InputProps.endAdornment}
                                                        </React.Fragment>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />
                                </div>

                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm text-gray-600">Brand Name</label>
                                    <Autocomplete
                                        fullWidth
                                        options={brands}
                                        getOptionLabel={(option) => option?.brand_name || ''}
                                        value={brands?.find((item) => item?.brand_id === row?.brand_id) || null}
                                        onChange={(e, val) => handleBrandChange(e, val, index)}
                                        renderInput={(params) => (
                                            <TextField {...params} variant="outlined" size="small"
                                                style={{
                                                    height: 39,
                                                    borderRadius: '8px',
                                                    backgroundColor: '#fff',
                                                    borderColor: '#F2F2F2',
                                                }}
                                                sx={{
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

                                {/* Variant */}
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm text-gray-600">Variant</label>
                                    <Autocomplete
                                        fullWidth
                                        options={variants} // Assuming `variants` is an array of variants
                                        getOptionLabel={(option) => option.variant_name || ''}
                                        value={variants.find((variant) => variant.variant_id === row?.variant_id) || null}
                                        onChange={(e, value) => handleVariantChange(e, value, index)}
                                        renderInput={(params) => (
                                            <TextField {...params} variant="outlined" size="small"
                                                style={{
                                                    height: 39,
                                                    borderRadius: '8px',
                                                    backgroundColor: '#fff',
                                                    borderColor: '#F2F2F2',
                                                }}
                                                sx={{
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

                                {/* Quantity */}
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm text-gray-600">Quantity</label>
                                    <TextField
                                        fullWidth
                                        value={row?.quantity}
                                        onChange={(e) => {
                                            const updatedRows = [...salesData];
                                            updatedRows[index].quantity = e.target.value;
                                            setSalesData(updatedRows);
                                        }}
                                        variant="outlined"
                                        size="small"
                                        type="number"
                                        style={{
                                            height: 39,
                                            borderRadius: '8px',
                                            backgroundColor: '#fff',
                                            borderColor: '#F2F2F2',
                                        }}
                                        sx={{
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
                                </div>

                                <div className="flex flex-col mt-1">
                                    <label className="text-sm text-gray-500 mb-1">Total Variant</label>
                                    <TextField
                                        fullWidth
                                        value={(() => {
                                            const variant = row?.selectedVariant;
                                            const quantity = row?.quantity || 0;
                                            if (variant) {
                                                const numericValue = variant?.variant_name.match(/\d+/);
                                                const unit = variant?.variant_name.replace(/\d+/g, '').trim();

                                                const total = numericValue ? quantity * parseInt(numericValue[0]) : 0;
                                                return `${total} ${unit}`;
                                            }
                                            return '';
                                        })()}
                                        readOnly
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            height: 39,
                                            borderRadius: '8px',
                                            backgroundColor: '#fff',
                                            borderColor: '#F2F2F2',
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
                                </div>

                                {/* Discount Name field, only shown if associated with farmer */}
                                {farmerAssociated && (
                                    <div className="flex flex-col space-y-2">
                                        <label className="text-sm text-gray-600">Discount Name</label>
                                        <TextField
                                            fullWidth
                                            value={discount}
                                            onChange={(e) => setDiscount(e.target.value)}
                                            variant="outlined"
                                            size="small"
                                            style={{
                                                height: 39,
                                                borderRadius: '8px',
                                                backgroundColor: '#fff',
                                                borderColor: '#F2F2F2',
                                            }}
                                            sx={{
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
                                    </div>
                                )}

                            </div>
                        </div>
                    ))}
                </div>
                <Button
                    onClick={handleAddRow}
                    sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        backgroundColor: '#00B251',
                        paddingX: 4,
                        color: 'white',
                        width: 'fit-content',
                        alignSelf: 'center',
                        '&:hover': { backgroundColor: '#008A3D' },
                    }}
                >
                    + Add Another Product
                </Button>
            </DialogContent>

        </Dialog>

    );
};

export default AddSales;
