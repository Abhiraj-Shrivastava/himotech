import React, { useState, useEffect } from 'react';
import {
    Dialog,   
    DialogContent,
    TextField,
    IconButton,
    Button,
    Typography,
    Autocomplete
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Swal from 'sweetalert2';
import axios from 'axios';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { GetallData, AddInventoryToOffline } from '../../Api_url';
const AddInventory = ({ openAddDialog, setOpenAddDialog }) => {
    const [rows, setRows] = useState([{
        product_name: '',
        hsn_code: '',
        item_code: '',
        weight: '',
        product_description: '',
        composition: '',
        measurement_type: '',
        category: '',
        gst: '',
        quantity: '',
        variant_name: '',
        variant_weight: '',
        manufacturing_date: '',
        expiry_date: '',
        bill_number: '',
    }]);

    const [categories, setCategories] = useState([]);
    const [measurementTypes, setMeasurementTypes] = useState([]);

    useEffect(() => {
        async function fetchCategoriesAndMeasurements() {
            try {
                const categoryResponse = await axios.get(GetallData, {
                    params: { filter_type: 'category' }
                });

                const measurementResponse = await axios.get(GetallData, {
                    params: { filter_type: 'measurements' }
                });

                // Assuming response structure is { status: 'success', data: [{ category_id, name }, ...] }
                if (categoryResponse?.data?.status === 'success') {
                    setCategories(categoryResponse?.data?.data); // Set categories
                } else {
                    Swal.fire('Error', 'Failed to load categories', 'error');
                }

                if (measurementResponse?.data?.status === 'success') {
                    setMeasurementTypes(measurementResponse?.data?.data); // Set measurement types
                } else {
                    Swal.fire('Error', 'Failed to load measurement types', 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'Failed to fetch data', 'error');
            }
        }

        fetchCategoriesAndMeasurements();
    }, []);

    const handleAddRow = () => {
        setRows([...rows, {
            product_name: '',
            hsn_code: '',
            item_code: '',
            weight: '',
            product_description: '',
            composition: '',
            measurement_type: '',
            category: '',
            gst: '',
            quantity: '',
            variant_name: '',
            variant_weight: '',
            manufacturing_date: '',
            expiry_date: '',
            bill_number: '',
        }]);
    };

    const handleDeleteRow = (index) => {
        const newRows = rows?.filter((_, i) => i !== index);
        setRows(newRows);
    };

    const handleSubmit = async () => {

        for (let row of rows) {
            if (
                !row.product_name || !row.hsn_code || !row.item_code || !row.weight ||
                !row.product_description || !row.composition || !row.measurement_type ||
                !row.category || !row.gst || !row.quantity || !row.variant_name ||
                !row.variant_weight || !row.manufacturing_date || !row.expiry_date
            ) {
                Swal.fire({
                    icon: 'warning',
                    title: 'All Fields are required',
                    text: 'Please fill all the fields.',
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
        }

        const token = localStorage.getItem('access_token');

        // Prepare data for the API
        const inventoryData = rows?.map(row => ({
            product_name: row?.product_name,
            hsn_code: row?.hsn_code,
            item_code: row?.item_code,
            weight: parseFloat(row?.weight),
            product_description: row?.product_description,
            composition: row?.composition,
            measurement_type: parseInt(row?.measurement_type), // Ensure measurement_type is an integer
            category: parseInt(row?.category), // Ensure category is an integer
            gst: parseFloat(row?.gst),
            quantity: parseInt(row?.quantity),
            bill_number:(row?.bill_number),
            variants: [
                {
                    variant_name: row?.variant_name,
                    weight: parseFloat(row?.variant_weight),
                    manufacturing_date: row?.manufacturing_date,
                    expiry_date: row?.expiry_date
                }
            ]
        }));

        try {
            const response = await axios.post(
                AddInventoryToOffline,
                { products: inventoryData },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (response?.status === 201) {
                Swal.fire({
                    title: 'Success',
                    text: 'Inventory added successfully!',
                    icon: 'success',
                    didOpen: () => {
                        const swalElement = document.querySelector('.swal2-container');
                        if (swalElement) {
                            swalElement.style.zIndex = 1500;
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
                            swalElement.style.zIndex = 1500;
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
                        swalElement.style.zIndex = 1500;
                    }
                }
            });
            setOpenAddDialog(false);
        }
    };

    return (
        <Dialog
            open={openAddDialog}
            onClose={() => setOpenAddDialog(false)}
            sx={{
                '& .MuiDialog-paper': {

                    width: '70%',  // Adjust width to 85% for a more compact look
                    maxWidth: '70%', // Ensure maxWidth is also 85%
                    height: '85%',  // Make height more compact
                    maxHeight: '85%',
                    borderRadius: 4,  // Rounded corners
                    padding: '30px',  // Increased padding for a spacious design
                    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.15)',  // Stronger shadow for a subtle pop
                    overflowY: 'auto',  // Allow vertical scroll if content overflows
                    backgroundColor: '#F2F2F2'
                },
            }}
        >

            {/* Header buttons (Cancel and Submit) */}
            <div className="flex justify-between items-center px-4">
                <Button sx={{ color: '#A0A0A0' }} onClick={() => setOpenAddDialog(false)}>
                    Cancel
                </Button>
                <div className='mt-10' >
                    <Typography variant="h6" className="text-lg font-medium text-black">
                        Add Inventory (Offline)
                    </Typography>
                </div>

                <Button sx={{ color: '#00B251' }} onClick={handleSubmit}>
                    Submit
                </Button>
            </div>

            <DialogContent sx={{ display: 'flex', flexDirection: 'column', }}>
                {rows.map((row, index) => (
                    <div key={index} className="w-full relative ">
                        {/* Product Title and Delete Icon */}
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Category */}
                            <div className="flex flex-col space-y-2">
                                <label className="text-sm text-gray-600">Category</label>
                                <Autocomplete
                                    fullWidth
                                    options={categories}
                                    getOptionLabel={(option) => option?.name || ''}
                                    value={categories.find((cat) => cat?.category_id === row?.category) || null}
                                    onChange={(e, value) => {
                                        const updatedRows = [...rows];
                                        updatedRows[index].category = value ? value?.category_id : '';
                                        setRows(updatedRows);
                                    }}
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

                            {/* Measurement Type */}
                            <div className="flex flex-col space-y-2">
                                <label className="text-sm text-gray-600">Measurement Type</label>
                                <Autocomplete
                                    fullWidth
                                    options={measurementTypes}
                                    getOptionLabel={(option) => option?.description || ''}
                                    value={measurementTypes.find((m) => m?.measurement_id === row?.measurement_type) || null}
                                    onChange={(e, value) => {
                                        const updatedRows = [...rows];
                                        updatedRows[index].measurement_type = value ? value?.measurement_id : '';
                                        setRows(updatedRows);
                                    }}
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

                            {/* Product Name */}
                            <div className="flex flex-col space-y-2">
                                <label className="text-sm text-gray-600">Product Name</label>
                                <TextField
                                    fullWidth
                                    value={row?.product_name}
                                    onChange={(e) => {
                                        const updatedRows = [...rows];
                                        updatedRows[index].product_name = e?.target?.value;
                                        setRows(updatedRows);
                                    }}
                                    variant="outlined"
                                    
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

                            {/* HSN Code */}
                            <div className="flex flex-col space-y-2">
                                <label className="text-sm text-gray-600">HSN Code</label>
                                <TextField
                                    fullWidth
                                    value={row?.hsn_code}
                                    onChange={(e) => {
                                        const updatedRows = [...rows];
                                        updatedRows[index].hsn_code = e?.target?.value;
                                        setRows(updatedRows);
                                    }}
                                    variant="outlined"
                                    size="small"
                                    style={{
                                        height:39,
                                        borderRadius: '8px',
                                        backgroundColor: '#fff',
                                        borderColor: '#F2F2F2',
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                border:0,
                                                borderColor: '#F2F2F2',
                                            },
                                            '&:hover fieldset': {
                                                border:0,
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

                            {/* Item Code */}
                            <div className="flex flex-col space-y-2">
                                <label className="text-sm text-gray-600">Item Code</label>
                                <TextField
                                    fullWidth
                                    value={row?.item_code}
                                    onChange={(e) => {
                                        const updatedRows = [...rows];
                                        updatedRows[index].item_code = e?.target?.value;
                                        setRows(updatedRows);
                                    }}
                                    variant="outlined"
                                    size="small"
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

                            {/* Weight */}
                            <div className="flex flex-col space-y-2">
                                <label className="text-sm text-gray-600">Weight</label>
                                <TextField
                                    fullWidth
                                    value={row?.weight}
                                    onChange={(e) => {
                                        const updatedRows = [...rows];
                                        updatedRows[index].weight = e?.target?.value;
                                        setRows(updatedRows);
                                    }}
                                    variant="outlined"
                                    size="small"
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

                            {/* Quantity */}
                            <div className="flex flex-col space-y-2">
                                <label className="text-sm text-gray-600">Quantity</label>
                                <TextField
                                    fullWidth
                                    type="number"
                                    value={row?.quantity}
                                    onChange={(e) => {
                                        const updatedRows = [...rows];
                                        updatedRows[index].quantity = e?.target?.value;
                                        setRows(updatedRows);
                                    }}
                                    variant="outlined"
                                    size="small"
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

                            {/* Product Description */}
                            <div className="flex flex-col space-y-2">
                                <label className="text-sm text-gray-600">Product Description</label>
                                <TextField
                                    fullWidth
                                    value={row?.product_description}
                                    onChange={(e) => {
                                        const updatedRows = [...rows];
                                        updatedRows[index].product_description = e?.target?.value;
                                        setRows(updatedRows);
                                    }}
                                    variant="outlined"
                                    size="small"
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

                            {/* Composition */}
                            <div className="flex flex-col space-y-2">
                                <label className="text-sm text-gray-600">Composition</label>
                                <TextField
                                    fullWidth
                                    value={row?.composition}
                                    onChange={(e) => {
                                        const updatedRows = [...rows];
                                        updatedRows[index].composition = e?.target?.value;
                                        setRows(updatedRows);
                                    }}
                                    variant="outlined"
                                    size="small"
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

                            {/* GST */}
                            <div className="flex flex-col space-y-2">
                                <label className="text-sm text-gray-600">GST</label>
                                <TextField
                                    fullWidth
                                    value={row?.gst}
                                    onChange={(e) => {
                                        const updatedRows = [...rows];
                                        updatedRows[index].gst = e?.target?.value;
                                        setRows(updatedRows);
                                    }}
                                    variant="outlined"
                                    size="small"
                                    style={{
                                        height:39,
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

                            {/* Variant Name */}
                            <div className="flex flex-col space-y-2">
                                <label className="text-sm text-gray-600">Variant Name</label>
                                <TextField
                                    fullWidth
                                    value={row?.variant_name}
                                    onChange={(e) => {
                                        const updatedRows = [...rows];
                                        updatedRows[index].variant_name = e?.target?.value;
                                        setRows(updatedRows);
                                    }}
                                    variant="outlined"
                                    size="small"
                                    style={{
                                        height:39,
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

                            {/* Variant Weight */}
                            <div className="flex flex-col space-y-2">
                                <label className="text-sm text-gray-600">Variant Weight</label>
                                <TextField
                                    fullWidth
                                    value={row?.variant_weight}
                                    onChange={(e) => {
                                        const updatedRows = [...rows];
                                        updatedRows[index].variant_weight = e?.target?.value;
                                        setRows(updatedRows);
                                    }}
                                    variant="outlined"
                                    size="small"
                                    style={{
                                        height:39,
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

                                    
                            <div className="flex flex-col space-y-2">
                                <label className="text-sm text-gray-600">Bill number</label>
                                <TextField
                                    fullWidth
                                    value={row?.bill_number}
                                    onChange={(e) => {
                                        const updatedRows = [...rows];
                                        updatedRows[index].bill_number = e?.target?.value;
                                        setRows(updatedRows);
                                    }}
                                    variant="outlined"
                                    size="small"
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

                            {/* Manufacturing Date */}
                            <div className="flex flex-col space-y-2">
                                <label className="text-sm text-gray-600">Manufacturing Date</label>
                                <TextField
                                    fullWidth
                                    type="date"
                                    value={row?.manufacturing_date}
                                    onChange={(e) => {
                                        const updatedRows = [...rows];
                                        updatedRows[index].manufacturing_date = e?.target?.value;
                                        setRows(updatedRows);
                                    }}
                                    variant="outlined"
                                    size="small"
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

                            {/* Expiry Date */}
                            <div className="flex flex-col space-y-2">
                                <label className="text-sm text-gray-600">Expiry Date</label>
                                <TextField
                                    fullWidth
                                    type="date"
                                    value={row?.expiry_date}
                                    onChange={(e) => {
                                        const updatedRows = [...rows];
                                        updatedRows[index].expiry_date = e?.target?.value;
                                        setRows(updatedRows);
                                    }}
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
                ))}

                {/* Add Row Button */}
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
                        marginTop: '30px',
                        '&:hover': { backgroundColor: '#008A3D' },
                    }}
                >
                    + Add Another Inventory
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default AddInventory;
