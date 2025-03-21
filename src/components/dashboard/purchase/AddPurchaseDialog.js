import React, { useEffect, useState, useRef } from 'react';
import { Dialog, DialogContent, TextField, Autocomplete, Button, Typography, IconButton, } from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import axios from 'axios';
import Swal from 'sweetalert2';
import { RequestPurchasetoVendor } from '../../Api_url';


const AddPurchaseDialog = ({ openDialog, setOpenDialog, fetchPurchaseRequestData }) => {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([{
        selectedProduct: null,
        quantity: '',
        measurement: '',
        variant: '',
        category: '',
        selectedBrand: null,
        selectedVendor: null,
        quantityError: ''
    }]);
    const [lastPage, setLastPage] = useState(false);
    const listInnerRef = useRef();
    const scrollPositionRef = useRef(0);

    const fetchProducts = async (page, search) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://apis.agrisarathi.com/fposupplier/GetallData?filter_type=products&page=${page}&search=${search}`);
            const newProducts = response?.data?.results?.data;

            if (newProducts?.length > 0) {
                setProducts((prevProducts) => {
                    // Filter out products that are already in the array
                    const uniqueNewProducts = newProducts.filter(
                        (newProduct) => !prevProducts.some((existingProduct) => existingProduct?.product_id === newProduct?.product_id)
                    );
                    return [...prevProducts, ...uniqueNewProducts];
                });
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    // Fetch Vendors
    const fetchVendors = async () => {
        try {
            const response = await axios.get('https://apis.agrisarathi.com/vendor/GetAllVendors');
            setVendors(response?.data?.vendors);
        } catch (error) {
            console.error('Error fetching vendors:', error);
        }
    };

    // Handle scroll event to detect when user reaches the bottom
    const onScroll = () => {
        if (listInnerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
            if (scrollTop + clientHeight === scrollHeight && !loading && !lastPage) {
                // Save scroll position before new data is fetched
                scrollPositionRef.current = scrollTop;

                // Fetch new products
                setPage(prevPage => {
                    const nextPage = prevPage + 1;
                    fetchProducts(nextPage);
                    return nextPage;
                });
            }
        }
    };

    // Handle product selection change
    const handleProductChange = (index, value) => {
        const newRows = [...rows];
        newRows[index].selectedProduct = value;

        if (value) {
            // Update the measurement, variant, and category for the selected product
            newRows[index].measurement = value?.measurement?.description;
            newRows[index].variant = value?.variants ? value?.variants[0]?.variant_name : '';
            newRows[index].category = value?.category?.name;

            // Extract the brand data for the selected product
            const productBrands = value?.brands || [];

            // If there are brands for the selected product, update the brand field
            newRows[index].selectedBrand = productBrands[0] || null; // Default to the first brand

            // Set brands for all rows, assuming you want the same brand options across all rows
            setBrands(productBrands);

            // Focus the input field once the product is selected
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }

        setRows(newRows);
    };
    const inputRef = useRef(null);

    const handleFocus = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    // Handle quantity change
    const handleQuantityChange = (index, value) => {
        const newRows = [...rows];
        newRows[index].quantity = value;
        if (value < 0) {
            newRows[index].quantityError = 'Quantity cannot be negative.';
        } else {
            newRows[index].quantityError = '';
        }
        setRows(newRows);
    };

    // Handle variant change
    const handleVariantChange = (index, value) => {
        const newRows = [...rows];
        newRows[index].variant = value;
        setRows(newRows);
    };

    // Handle brand change
    const handleBrandChange = (index, value) => {
        const newRows = [...rows];
        newRows[index].selectedBrand = value;
        setRows(newRows);
    };


    // Handle vendor change
    const handleChange = (index, value) => {
        const newRows = [...rows];
        newRows[index].selectedVendor = value;
        setRows(newRows);
    };

    // Handle add row
    const handleAddRow = () => {
        setRows([...rows, {
            selectedProduct: null,
            quantity: '',
            measurement: '',
            variant: '',
            category: '',
            selectedBrand: null,
            selectedVendor: null,
            quantityError: ''
        }]);
    };

    // Handle delete row
    const handleDeleteRow = (index) => {
        const newRows = rows?.filter((_, rowIndex) => rowIndex !== index);
        setRows(newRows);
    };

    const handleSubmit = async () => {
        // Check for invalid rows
        const invalidRow = rows.some(row =>
            !row?.selectedProduct ||
            !row?.selectedProduct.product_id ||
            !row?.quantity ||
            Number(row?.quantity) <= 0 ||
            !row?.selectedProduct?.measurement?.measurement_id ||
            !row?.variant ||
            !row?.category ||
            !row?.selectedVendor
        );

        if (invalidRow) {
            // Show error message with Swal
            Swal.fire({
                title: 'Error!',
                text: 'Please fill all fields.',
                icon: 'error',
                confirmButtonText: 'OK',
                didOpen: () => {
                    const swalElement = document.querySelector('.swal2-container');
                    if (swalElement) {
                      swalElement.style.zIndex = 1500;
                    }
                  }
            });
            return;
        }

        const vendor_id = rows[0].selectedVendor?.id;

        const products = rows.map(row => {
            const variant = row.selectedProduct?.variants?.find(variant => variant?.variant_name === row?.variant);
            const quantity = row?.quantity;
            const variantValue = parseInt(variant?.variant_name?.match(/\d+/)?.[0] || 0); // Extract the variant value

            // Calculate total_variant dynamically
            const totalVariant = `${quantity * variantValue} ${variant?.variant_name.replace(/\d+/g, '').trim()}`;

            return {
                product_id: row?.selectedProduct?.product_id,
                category_id: row?.selectedProduct?.category?.category_id,
                quantity: quantity,
                measurement_id: row?.selectedProduct?.measurement?.measurement_id,
                brand_id: row?.selectedBrand?.brand_id,
                variant_id: variant?.variant_id,
                total_variant: totalVariant,  // Submit the total_variant_value
            };
        });

        const data = {
            vendor_id,
            products: JSON.stringify(products)
        };

        const access_token = localStorage.getItem('access_token');

        // if (!access_token) {
        //     // Show error message with Swal if token is missing
        //     Swal.fire({
        //         title: 'Error!',
        //         text: 'Access token is missing. Please log in again.',
        //         icon: 'error',
        //         confirmButtonText: 'OK',
        //         didOpen: () => {
        //             const swalElement = document.querySelector('.swal2-container');
        //             if (swalElement) {
        //               swalElement.style.zIndex = 1500;
        //             }
        //           }
        //     });
        //     return;
        // }

        try {
            const response = await axios.post(RequestPurchasetoVendor, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
            });

            // Show success message with Swal
            Swal.fire({
                title: 'Success!',
                text: 'Your request has been successfully submitted.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                didOpen: () => {
                    const swalElement = document.querySelector('.swal2-container');
                    if (swalElement) {
                      swalElement.style.zIndex = 1500;
                    }
                  }
            });

            setOpenDialog(false);
            fetchPurchaseRequestData();
        } catch (error) {
            // Show error message with Swal on failure
            Swal.fire({
                title: 'Error!',
                text: 'Failed to submit the data. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK',
                didOpen: () => {
                    const swalElement = document.querySelector('.swal2-container');
                    if (swalElement) {
                      swalElement.style.zIndex = 1500;
                    }
                  }
            });
            setOpenDialog(false);
        }
    };

    useEffect(() => {

        fetchVendors();
        fetchProducts(page, searchQuery);

    }, [page, searchQuery]);

    useEffect(() => {
        // After new data is loaded, scroll back to the previous position
        if (listInnerRef.current) {
            listInnerRef.current.scrollTop = scrollPositionRef.current;
        }
    }, [products]);

    return (
        <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            sx={{
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
            }}
        >
            {/* Header Section */}
            <div className="flex justify-between items-center px-4 pb-4">
                <Button sx={{ color: '#A0A0A0' }} onClick={() => setOpenDialog(false)}>
                    Cancel
                </Button>
                <div className='mt-10' >
                    <Typography variant="h6" className="text-lg font-medium text-black">
                        Add Purchase
                    </Typography>
                </div>

                <Button sx={{ color: '#00B251' }} onClick={handleSubmit}>
                    Submit
                </Button>
            </div>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', }}>

                {rows.map((row, index) => (
                    <div key={index} className="w-full  rounded-lg shadow-sm relative">

                        <div
                            className={`flex justify-between items-center pb-2 border-b mb-4 ${index >= 1 ? 'mt-6' : ''}`}
                        >
                            <Typography variant="h6" className="text-xl font-semibold text-gray-700">
                                {`Product - ${index + 1}`}
                            </Typography>

                            {rows.length > 1 && (
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
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            {/* Product Select */}
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-500 mb-1">Product</label>
                                <Autocomplete
                                    fullWidth
                                    options={products}
                                    getOptionLabel={(option) => option?.product_name}
                                    value={row?.selectedProduct || null}
                                    onInputChange={(e, newInputValue) => fetchProducts(1, newInputValue)}
                                    onChange={(e, value) => handleProductChange(index, value)}
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
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: '#F2F2F2',
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: '#F2F2F2',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#fff',
                                                        borderWidth: '1px',
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
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-500 mb-1">Quantity</label>
                                <TextField
                                    type="number"
                                    fullWidth
                                    value={row.quantity}
                                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                                    variant="outlined"
                                    size="small"
                                    InputProps={{
                                        style: {
                                            height:39,
                                            borderRadius: '8px',
                                            backgroundColor: '#fff',
                                            borderColor: '#F2F2F2',
                                        }
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
                                                borderWidth: '1px',
                                                boxShadow: 'none',
                                            },
                                        },
                                        '& .MuiOutlinedInput-input': {
                                            padding: '10px 14px',
                                        },
                                    }}
                                />
                            </div>

                            {/* Measurement */}
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-500 mb-1">Measurement</label>
                                <TextField
                                    type="text"
                                    fullWidth
                                    value={row.measurement}
                                    variant="outlined"
                                    size="small"
                                    InputProps={{
                                        style: {
                                            height:39,
                                            borderRadius: '8px',
                                            backgroundColor: '#fff',
                                            borderColor: '#F2F2F2',
                                        }
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
                                                borderWidth: '1px',
                                                boxShadow: 'none',
                                            },
                                        },
                                        '& .MuiOutlinedInput-input': {
                                            padding: '10px 14px',
                                        },
                                    }}
                                />
                            </div>

                            {/* Variant Select */}
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-500 mb-1">Variant</label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    value={row.variant}
                                    onChange={(e) => handleVariantChange(index, e.target.value)}
                                    disabled={!row.selectedProduct}
                                    style={{
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
                                                borderWidth: '1px',
                                                boxShadow: 'none',
                                            },
                                        },
                                        '& .MuiOutlinedInput-input': {
                                            padding: '10px 14px',
                                        },
                                    }}
                                >
                                    {row.selectedProduct?.variants?.map((variant) => (
                                        <option key={variant.variant_id} value={variant.variant_name}>
                                            {variant.variant_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Category */}
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-500 mb-1">Category</label>
                                <TextField
                                    type="text"
                                    fullWidth
                                    value={row.category}
                                    variant="outlined"
                                    size="small"
                                    InputProps={{
                                        style: {
                                            height:39,
                                            borderRadius: '8px',
                                            backgroundColor: '#fff',
                                            borderColor: '#F2F2F2',
                                        }
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
                                                borderWidth: '1px',
                                                boxShadow: 'none',
                                            },
                                        },
                                        '& .MuiOutlinedInput-input': {
                                            padding: '10px 14px',
                                        },
                                    }}
                                />
                            </div>

                            {/* Brand Select */}
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-500 mb-1">Brand</label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    value={row.selectedBrand?.brand_name || ''}
                                    onChange={(e) => handleBrandChange(index, e.target.value)}
                                    disabled={!row.selectedProduct}
                                    style={{
                                        height:39,
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
                                                borderWidth: '1px',
                                                boxShadow: 'none',
                                            },
                                        },
                                        '& .MuiOutlinedInput-input': {
                                            padding: '10px 14px',
                                        },
                                    }}
                                >
                                    {row.selectedProduct?.brands?.map((brand) => (
                                        <option key={brand.brand_id} value={brand.brand_name}>
                                            {brand.brand_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Vendor Select */}
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-500 mb-1">Vendor</label>
                                <Autocomplete
                                    fullWidth
                                    options={vendors}
                                    getOptionLabel={(option) => option?.name}
                                    value={row?.selectedVendor}
                                    onChange={(e, value) => handleChange(index, value)}
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
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: '#F2F2F2',
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: '#F2F2F2',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#fff',
                                                        borderWidth: '1px',
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

                            {/* Total Variant */}
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-500 mb-1">Total Variant</label>
                                <TextField
                                    type="text"
                                    fullWidth
                                    value={(() => {
                                        const selectedVariant = row?.selectedProduct?.variants?.find(variant => variant?.variant_name === row?.variant);
                                        if (!selectedVariant) return '';

                                        const numericPart = parseInt(selectedVariant.variant_name.match(/\d+/)?.[0]) || 0;
                                        let unit = selectedVariant.variant_name.replace(/\d+/g, '').trim().toLowerCase();

                                        let total = row?.quantity * numericPart;

                                        let finalUnit = unit;

                                        // Convert grams to kilograms
                                        if (unit === 'gm' && total >= 1000) {
                                            total = total / 1000;
                                            finalUnit = 'kg';
                                        }

                                        if (unit === 'kg' && total >= 100) {
                                            total /= 100;
                                            finalUnit = 'ton';
                                        }
                                        // Convert milliliters to liters
                                        if (unit === 'ml' && total >= 1000) {
                                            total = total / 1000;
                                            finalUnit = 'ltr';
                                        }

                                        return `${total} ${finalUnit}`;
                                    })()}

                                    style={{
                                        height:39,
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
                                                borderWidth: '1px',
                                                boxShadow: 'none',
                                            },
                                        },
                                        '& .MuiOutlinedInput-input': {
                                            padding: '10px 14px',
                                        },
                                    }}
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add Another Purchase Button */}
                <Button
                    onClick={handleAddRow}
                    sx={{
                        textTransform: 'none',
                        borderRadius:2,
                        backgroundColor: '#00B251',
                        paddingX:4,
                        color: 'white',
                        width: 'fit-content',
                        alignSelf: 'center',
                        marginTop: '30px',
                        '&:hover': { backgroundColor: '#008A3D' },
                    }}
                >
                    + Add Another Purchase
                </Button>
            </DialogContent>

            {/* Footer Actions */}
            {/* <DialogActions sx={{ justifyContent: 'space-between' }}>
            <Button sx={{ color: '#A0A0A0' }} onClick={() => setOpenDialog(false)}>
                Cancel
            </Button>
            <Button sx={{ color: '#00B251' }} onClick={handleSubmit}>
                Submit
            </Button>
        </DialogActions> */}
        </Dialog>


    );
};

export default AddPurchaseDialog;
