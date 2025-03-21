import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, TextField, FormControl, Select, MenuItem, Typography, TableContainer, Paper, TablePagination } from '@mui/material';
import axios from 'axios';
import { MaterialReactTable } from 'material-react-table';
import Add from '@mui/icons-material/Add';
import Swal from 'sweetalert2';
import { RegisterSubordinates } from '../../Api_url';
import img from '../../../assets/Group 100.png'


const Cooperatives = () => {
    // State variables
    const [openDialog, setOpenDialog] = useState(false);
    const [farmerName, setFarmerName] = useState('');
    const [farmerMobile, setFarmerMobile] = useState('');
    const [dialogError, setDialogError] = useState('');
    const [farmersData, setFarmersData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);

    const accessToken = localStorage.getItem('access_token');

    // Define columns for MaterialReactTable
    const columns = [

        {
            header: 'S.No',
            id: 'serial',
            accessorKey: 'id',
            Cell: ({ row }) => row.index + 1,
           
        },
        {
            header: 'Name',
            id: 'name',
            accessorKey: 'name',
           
        },
        {
            header: 'Mobile',
            id: 'mobile',
            accessorKey: 'mobile',
           
        },
        {
            header: 'Email',
            id: 'email',
            accessorKey: 'email',
           
        },

    ];

    // Fetch data function
    const fetchData = async (page = 0, rowsPerPage = 5) => {
        try {
            const response = await axios.get(RegisterSubordinates, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                params: {
                    page: page + 1,  // Adjust for pagination starting from 1
                    page_size: rowsPerPage,
                },
            });
            setFarmersData(response.data.results.data || []);  // Make sure data is an array
            setTotalCount(response.data.count || 0);  // Ensure total count is set to 0 if not present
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Handle page change for pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        fetchData(newPage, rowsPerPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        fetchData(0, event.target.value);
    };

    // Submit data function

    const handleSubmit = async () => {
        if (!farmerName || !farmerMobile) {
            // Display an error message using SweetAlert for required fields
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Please fill in all required fields.',
                didOpen: () => {
                    const swalElement = document.querySelector('.swal2-container');
                    if (swalElement) {
                        swalElement.style.zIndex = 1500; // Adjust z-index for swal container
                    }
                }
            });

            return;
        }

        const data = {
            name: farmerName,
            mobile: farmerMobile,
        };

        try {
            // Send the POST request
            await axios.post(RegisterSubordinates, data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            // Show success swal
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Sub FPO submitted successfully.',
                didOpen: () => {
                    const swalElement = document.querySelector('.swal2-container');
                    if (swalElement) {
                        swalElement.style.zIndex = 1500; // Adjust z-index for swal container
                    }
                }
            });

            // After successful submission, close the dialog and fetch updated data
            setOpenDialog(false);
            fetchData(page, rowsPerPage);

        } catch (error) {
            console.error("Error submitting data:", error);

            // Show error swal if submission fails
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'SubFPO with this moblie number already exists.',
                didOpen: () => {
                    const swalElement = document.querySelector('.swal2-container');
                    if (swalElement) {
                        swalElement.style.zIndex = 1500; // Adjust z-index for swal container
                    }
                }
            });
        }
    };


    useEffect(() => {
        fetchData(page, rowsPerPage);
    }, [page, rowsPerPage]);

    return (
        <>
            {farmersData.length !== 0 ? (
                <div>
                    <Button
                        variant="contained"
                        onClick={() => setOpenDialog(true)}
                        startIcon={<Add />}
                        sx={{
                            textTransform: 'none',
                            borderRadius: 2,
                            paddingX: 4,
                            color: 'white',
                            width: 'fit-content',
                            alignSelf: 'center',
                        }}
                    >
                        Add Cooperatives
                    </Button>
                </div>

            ) : null}

            {farmersData.length === 0 ?
                <div className="flex flex-col items-center mt-28">
                    {/* Image when no data is available */}
                    <img src={img} alt="No data" className="mb-4" />

                    <div className='mt-10'>
                        <Button
                            variant="contained"
                            onClick={() => setOpenDialog(true)}
                            startIcon={<Add />}
                            sx={{
                                textTransform: 'none',
                                borderRadius: 2,
                                paddingX: 4,
                                color: 'white',
                                width: 'fit-content',
                                alignSelf: 'center',
                            }}
                        >
                            Add Cooperatives
                        </Button>
                    </div>
                    </div>
                     :

                    <div style={{ maxWidth: '100%', overflowY: 'auto', padding: 10 }}>
                        <TableContainer component={Paper} className="overflow-x-auto mt-6 relative">
                            {/* MaterialReactTable with disabled internal pagination */}
                            <MaterialReactTable
                                columns={columns}
                                data={Array.isArray(farmersData) ? farmersData : []}  // Ensure data is an array
                                enablePagination={false}
                                muiTableHeadCellProps={{
                                    sx: {
                                        borderBottom: "none",
                                    },
                                }}
                                muiTableBodyCellProps={{
                                    sx: {
                                        borderBottom: "none",
                                    },
                                }}
                            />
                            {/* Pagination Component */}
                            <div className="absolute bottom-0 left-0 right-0 z-10 bg-white">
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={totalCount}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </div>
                        </TableContainer>
                    </div>
 }

                    <Dialog
                        open={openDialog}
                        onClose={() => setOpenDialog(false)}
                        sx={{
                            '& .MuiDialog-paper': {
                                width: '50%',
                                maxWidth: '50%',
                                height: '40%',
                                maxHeight: '40%',
                                margin: 'auto',
                                padding: '20px',
                                borderRadius: 4,
                                boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
                                overflow: 'auto',
                                backgroundColor: '#F2F2F2'
                            },
                        }}
                    >
                        {/* Header with Cancel/Submit */}
                        <div className="flex justify-between items-center px-6 pt-2 ">
                            <button
                                onClick={() => setOpenDialog(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="text-green-500 hover:text-green-600 font-medium"
                            >
                                Submit
                            </button>
                        </div>

                        {/* Title */}
                        <DialogTitle className="text-center text-xl font-medium pb-4">
                            Add Cooperatives
                        </DialogTitle>

                        <DialogContent>
                            <div className="space-y-4 ">
                                {/* Name Field */}
                                <div>
                                    <label className="block text-gray-500 mb-2">Name</label>
                                    <TextField
                                        fullWidth
                                        value={farmerName}
                                        onChange={(e) => setFarmerName(e.target.value)}
                                        required
                                        variant="outlined"
                                        InputProps={{
                                            style: {
                                                borderRadius: '8px',
                                                backgroundColor: '#fff',
                                                borderColor: '#F2F2F2',
                                            }
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: '#F2F2F2',  // Default border color
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#F2F2F2',  // Hover state border color
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#F2F2F2',  // Focus state border color
                                                },
                                            },
                                            '& .MuiOutlinedInput-input': {
                                                padding: '10px 14px',
                                                borderColor: '#F2F2F2',  // Ensuring no color is applied directly here
                                            },
                                        }}
                                    />
                                </div>

                                {/* Mobile Field */}
                                <div>
                                    <label className="block text-gray-500 mb-2">Mobile</label>
                                    <TextField
                                        fullWidth
                                        value={farmerMobile}
                                        onChange={(e) => setFarmerMobile(e.target.value)}
                                        required
                                        variant="outlined"
                                        InputProps={{
                                            style: {
                                                borderRadius: '8px',
                                                backgroundColor: '#fff',
                                                borderColor: '#F2F2F2',
                                            }
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: '#F2F2F2',  // Default border color
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#F2F2F2',  // Hover state border color
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#F2F2F2',  // Focus state border color
                                                },
                                            },
                                            '& .MuiOutlinedInput-input': {
                                                padding: '10px 14px',
                                                borderColor: '#F2F2F2',  // Ensuring no color is applied directly here
                                            },
                                        }}
                                    />
                                </div>


                                {/* <div>
                            <label className="block text-gray-500 mb-2">Email</label>
                            <TextField
                                fullWidth
                                value={farmerVillage}
                                onChange={(e) => setFarmerVillage(e.target.value)}
                                required
                                variant="outlined"
                                InputProps={{
                                    style: {
                                        borderRadius: '8px',
                                        backgroundColor: '#fff',
                                        borderColor: '#F2F2F2',
                                    }
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#F2F2F2',  // Default border color
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#F2F2F2',  // Hover state border color
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#F2F2F2',  // Focus state border color
                                        },
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        padding: '10px 14px',
                                        borderColor: '#F2F2F2',  // Ensuring no color is applied directly here
                                    },
                                }}
                            />
                        </div>


                        <div>
                            <label className="block text-gray-500 mb-2">Type</label>
                            <FormControl fullWidth>
                                <Select
                                
                                    value={farmerType}
                                    onChange={(e) => setFarmerType(e.target.value)}
                                    displayEmpty
                                    variant="outlined"
                                    sx={{
                                        backgroundColor: '#fff',
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#F2F2F2',  // Default border color
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#F2F2F2',  // Hover state border color
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#F2F2F2',  // Focus state border color (override blue)
                                                borderWidth: '1px', // Ensure border width is applied
                                                boxShadow: 'none',  // Remove the default blue box shadow
                                            },
                                        },
                                        '& .MuiOutlinedInput-input': {
                                            padding: '10px 14px',
                                        },
                                    }}
                                >                                    
                                    <MenuItem value="CEO">CEO</MenuItem>
                                    <MenuItem value="Employee">Employee</MenuItem>
                                    <MenuItem value="Others">Others</MenuItem>
                                </Select>
                            </FormControl>

                        </div> */}

                                {/* Error Message */}
                                {dialogError && (
                                    <Typography color="error" className="mt-2">
                                        {dialogError}
                                    </Typography>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                </>
    );
};

            export default Cooperatives;
