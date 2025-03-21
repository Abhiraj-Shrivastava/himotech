import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
    TableContainer, Paper, TablePagination,
    Button, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
    Select, MenuItem, FormControl, Checkbox, InputLabel,
    colors
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Delete, RemoveRedEye } from '@mui/icons-material';
import { useApis, AddEmployeeByEmployerView } from '../../Api_url';
import { MaterialReactTable } from 'material-react-table';
import { Add } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { BulkEmployeeAdd } from '../../Api_url'
import img from '../../../assets/Group 100.png'


const FarmersInformation = () => {
    const { postJson, getJson } = useApis()
    const [farmersData, setFarmersData] = useState([]);  // Farmers data state
    const [page, setPage] = useState(0);  // Page state
    const [rowsPerPage, setRowsPerPage] = useState(10);  // Rows per page state
    const [totalCount, setTotalCount] = useState();  // Total count of farmers for pagination
    const [error, setError] = useState(null);  // Error state
    const [selectedFarmers, setSelectedFarmers] = useState([]);  // Track selected farmers
    const [openDialog, setOpenDialog] = useState(false);  // Dialog state
    const [farmerName, setFarmerName] = useState('');  // Farmer name state for new farmer
    const [farmerMobile, setFarmerMobile] = useState('');  // Farmer mobile state for new farmer
    const [farmerVillage, setFarmerVillage] = useState('');  // Farmer district state for new farmer
    const [openModal, setOpenModal] = useState(false)
    const [dialogError, setDialogError] = useState(null);
    const [farmerGender, setFarmerGender] = useState('');  // Gender state for new farmer
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [employeeId, setEmployeeId] = useState('');
    const [email, setEmail] = useState('');
    const [designation, setDesignation] = useState('');
    const [department, setDepartment] = useState('');
    const [dob, setDob] = useState('');
    const [dateJoined, setDateJoined] = useState('');
    const [employmentType, setEmploymentType] = useState('');
    const [paymentCycle, setPaymentCycle] = useState('');
    const [address, setAddress] = useState('');
    const [employeesData, setEmployeesData] = useState([]);




    const [success, setSuccess] = useState(null)
    const navigate = useNavigate();

    // Fetch Farmers Data with Pagination
    const fetchEmployeeData = async (p) => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            setError('No access token found.');
            return;
        }

        try {
            const response = await getJson('AddEmployeeByEmployerView', {
                page: p + 1,  // API uses 1-based pagination
                per_page: rowsPerPage,
            })

            const data = response?.data?.employees || [];
            const count = response?.data?.count || 0;


            setFarmersData(data);
            setTotalCount(count);  // Set total farmer count for pagination
        } catch (error) {
            console.error('Error fetching member data:', error);
            setError('Error fetching data.');
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);  // Update page when the user changes the page
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));  // Update rows per page when changed
        setPage(0);  // Reset to the first page when rows per page changes
    };

    const downloadSampleExcel = () => {
        const sampleData = [
            ["employee_name", "employee_id", "email", "mobile", "dob", "department", "date_joined", "employment_type", "payment_cycle", "address"],
            ["John Doe", "EMP001", "john@example.com", "1234567890", "1990-05-12", "IT", "2022-01-15", "SALARIED", "1", "123 Main St"],
        ];
        const ws = XLSX.utils.aoa_to_sheet(sampleData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Members');
        XLSX.writeFile(wb, 'sample_member.xlsx');
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
    }

    // Handle file upload
    const handleUpload = async () => {
        if (!file) {
            Swal.fire({
                icon: 'warning',
                title: 'No File Selected',
                text: 'Please select a file to upload.',
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

        const formData = new FormData();
        formData?.append('file', file);

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            const token = localStorage.getItem('access_token');
            const response = await axios.post(
                BulkEmployeeAdd,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response?.status === 200) {
                if (response?.data?.errors_count > 0) {
                    let errorMessages = [];
                    if (Array.isArray(response?.data?.errors)) {
                        errorMessages = response?.data?.errors;
                    } else if (typeof response?.data?.errors === 'object') {
                        errorMessages = [JSON.stringify(response?.data?.errors)];
                    } else {
                        errorMessages = ['An unknown error occurred.'];
                    }

                    Swal.fire({
                        icon: 'error',
                        title: 'File Upload Failed',
                        html: errorMessages.map((error, index) => `<div key=${index} class="text-red-500">${error}</div>`).join(''),
                        didOpen: () => {
                            const swalElement = document.querySelector('.swal2-container');
                            if (swalElement) {
                                swalElement.style.zIndex = 1500;
                            }
                        }
                    });
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: 'File Uploaded Successfully',
                        text: 'Your file has been uploaded successfully.',
                        didOpen: () => {
                            const swalElement = document.querySelector('.swal2-container');
                            if (swalElement) {
                                swalElement.style.zIndex = 1500;
                            }
                        }
                    }).then(() => {
                        setOpenModal(false);
                    });
                }
            } else {
                setError('Something went wrong, please try again later.');
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError('Only excel file is supported, please upload excel file.');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchEmployeeData(page);  // Fetch farmers data whenever the page or rowsPerPage changes
    }, [page, rowsPerPage]);

    // Handle row click to navigate to farmer details
    const handleRowClick = (farmerId) => {
        navigate(`/memberdetail/${farmerId}`);
    };

    // Handle selection of a checkbox
    const handleSelectFarmer = (farmerId) => {
        setSelectedFarmers(prevState => {
            if (prevState.includes(farmerId)) {
                return prevState?.filter(id => id !== farmerId);  // Unselect farmer if already selected
            } else {
                return [...prevState, farmerId];  // Select farmer
            }
        });
    };

    // Handle bulk deletion
    const handleBulkDelete = async () => {
        if (selectedFarmers?.length === 0) {
            Swal.fire({
                title: 'Error!',
                text: 'No Members selected for deletion.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return;
        }

        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            Swal.fire({
                title: 'Error!',
                text: 'No access token found.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return;
        }

        try {
            const response = await axios.delete(AddEmployeeByEmployerView, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                data: {
                    farmer_id: selectedFarmers,  // Send selected farmer IDs for deletion
                },
            });

            if (response?.data?.status === 'success') {
                Swal.fire({
                    title: 'Success!',
                    text: response.data.message || 'Members deleted successfully!',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                });
                fetchEmployeeData(page); // Refetch data after successful deletion
                setSelectedFarmers([]);  // Clear the selected farmers list
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: response.data.message || 'Failed to delete member.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'An error occurred during deletion.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };

    const handleSubmit = async () => {
        // if (!farmerName || !farmerMobile || !farmerVillage || !employeeId || !email || !designation || !department || !dob || !dateJoined || !employmentType || !paymentCycle || !address) {
        //     setDialogError('Please fill in all fields.');
        //     return;
        // }

        // const phonePattern = /^[0-9]{10}$/;
        // if (!phonePattern.test(farmerMobile)) {
        //     setDialogError('Please enter a valid mobile number.');
        //     return;
        // }

        try {
            const response = await postJson('AddEmployeeByEmployerView', {
                employee_name: farmerName,
                employee_id: employeeId,
                email: email,
                mobile: farmerMobile,
                designation: designation,
                dob: dob,
                department: department,
                date_joined: dateJoined,
                employment_type: employmentType,
                payment_cycle: paymentCycle,
                address: address
            });

            if (response?.status === 200) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Employee added successfully!',
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

                // Add the newly added employee to the employeesData list
                const newEmployee = {
                    id: response?.results?.employee_id,
                    name: farmerName,
                    mobile: farmerMobile,
                    village: farmerVillage,
                    gender: farmerGender,
                    email: email,
                    designation: designation,
                    department: department,
                    dob: dob,
                    date_joined: dateJoined,
                    employment_type: employmentType,
                    payment_cycle: paymentCycle,
                    address: address
                };
                setEmployeesData(prevEmployeesData => [newEmployee, ...prevEmployeesData]);

                setOpenDialog(false);
                // fetchEmployeesData(page);
            } else {
                setOpenDialog(false);
                Swal.fire({
                    title: 'Error!',
                    text: response.data.message || 'Failed to add employee.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    didOpen: () => {
                        const swalElement = document.querySelector('.swal2-container');
                        if (swalElement) {
                            swalElement.style.zIndex = 1500;
                        }
                    }
                });
            }
        } catch (error) {
            console.log(error);

            if (error?.response?.data?.message === "Mobile number already exists") {
                setDialogError("Mobile number already exists");
            }
        }
    };


    const columns = [
        {
            header: 'Select',
            id: 'select',
            Cell: ({ row }) => (
                <Checkbox
                    checked={selectedFarmers.includes(row.original.id)}
                    onChange={() => handleSelectFarmer(row.original.id)}
                />
            ),
            size: 50,
        },
        {
            header: 'S.No',
            id: 'serial',
            accessorKey: 'id',
            Cell: ({ row }) => row.index + 1,
            size: 50,
        },
        {
            header: 'Name',
            id: 'employee_name',
            accessorKey: 'employee_name',
            size: 150,
        },
        {
            header: 'Employee ID',
            id: 'employee_id',
            accessorKey: 'employee_id',
            size: 100,
        },
        {
            header: 'Email',
            id: 'email',
            accessorKey: 'email',
            size: 200,
        },
        {
            header: 'Mobile',
            id: 'mobile',
            accessorKey: 'mobile',
            size: 150,
        },
        {
            header: 'Designation',
            id: 'designation',
            accessorKey: 'designation',
            size: 150,
        },
        {
            header: 'DOB',
            id: 'dob',
            accessorKey: 'dob',
            size: 150,
        },
        {
            header: 'Department',
            id: 'department',
            accessorKey: 'department',
            size: 150,
        },
        {
            header: 'Date Joined',
            id: 'date_joined',
            accessorKey: 'date_joined',
            size: 150,
        },
        {
            header: 'Employment Type',
            id: 'employment_type',
            accessorKey: 'employment_type',
            size: 150,
        },
        {
            header: 'Payment Cycle',
            id: 'payment_cycle',
            accessorKey: 'payment_cycle',
            size: 150,
        },
        {
            header: 'Address',
            id: 'address',
            accessorKey: 'address',
            size: 200,
        },
        {
            header: 'Action',
            id: 'action',
            Cell: ({ row }) => (
                <IconButton onClick={() => handleRowClick(row.original.id)}>
                    <RemoveRedEye />
                </IconButton>
            ),
            size: 50,
        },
    ];

    const textFieldStyle = {
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
    };


    return (
        <div className="p-6">
            {error && <Typography color="error">{error}</Typography>}

            {farmersData.length != 0 ? (
                <div className="flex flex-col md:flex-row items-center gap-4">
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
                        Add Employee
                    </Button>

                    <Button
                        variant="contained"
                        color='secondary'
                        onClick={() => setOpenModal(true)}
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
                        Upload Excel
                    </Button>

                    <IconButton
                        onClick={handleBulkDelete}
                        disabled={selectedFarmers.length === 0}
                        sx={{
                            borderRadius: 2,
                            backgroundColor: 'red', // Red background
                            color: 'white', // White color for the icon
                            '&:hover': {
                                backgroundColor: 'red', // Darker red on hover
                            },
                            '&:disabled': {
                                backgroundColor: '#d3d3d3',
                                color: '#a9a9a9',
                            },
                        }}
                    >
                        <Delete />
                    </IconButton>

                </div>
            ) : null}

            {farmersData.length === 0 ?
                <div className="flex flex-col items-center mt-28">
                    {/* Image when no data is available */}
                    <img src={img} alt="No data" className="mb-4" />

                    {/* Buttons below the image */}
                    <div className="flex flex-col md:flex-row items-center gap-4">
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
                                mt: 10
                            }}
                        >
                            Add Employee
                        </Button>

                        <Button
                            variant="contained"
                            color='secondary'
                            onClick={() => setOpenModal(true)}
                            startIcon={<Add />}
                            sx={{
                                textTransform: 'none',
                                borderRadius: 2,

                                paddingX: 4,
                                color: 'white',
                                width: 'fit-content',
                                alignSelf: 'center',
                                mt: 10

                            }}
                        >
                            Upload Excel
                        </Button>
                    </div>
                </div> :
                <div style={{ maxWidth: '100%', overflowY: 'auto', padding: 10 }}>
                    <TableContainer component={Paper} className="overflow-x-auto mt-6 relative">
                        {/* MaterialReactTable with disabled internal pagination */}
                        <MaterialReactTable
                            columns={columns}
                            data={farmersData}
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
                                rowsPerPageOptions={[5, 10, 25]} // Adjust row options
                                component="div"
                                count={totalCount}  // Total number of rows in your data
                                rowsPerPage={rowsPerPage}  // Rows per page
                                page={page}  // Current page
                                onPageChange={handleChangePage}  // Handle page change
                                onRowsPerPageChange={handleChangeRowsPerPage}  // Handle rows per page change
                                nextButtonProps={{ disabled: page * rowsPerPage + rowsPerPage >= totalCount }}  // Disable next button if no next page
                                backButtonProps={{ disabled: page === 0 }}  // Disable back button if at the first page
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
                        width: '60%',
                        maxWidth: '60%',
                        height: '80%',  // Adjusted for extra fields
                        maxHeight: '80%',
                        margin: 'auto',
                        padding: '20px',
                        borderRadius: 4,
                        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
                        overflow: 'auto',
                        backgroundColor: '#F2F2F2',
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
                <DialogTitle className="text-center text-xl font-medium pb-4 ">
                    Add Employee
                </DialogTitle>

                <DialogContent>
                    <div className="space-y-0 grid grid-cols-2 gap-4 mt-2  ">
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
                                        backgroundColor: '#fff',
                                        borderRadius: '8px',
                                        borderColor: '#F2F2F2',
                                    },
                                }}
                                sx={textFieldStyle}
                            />
                        </div>

                        {/* Employee ID */}
                        <div className=''>
                            <label className="block text-gray-500 mb-2">Employee ID</label>
                            <TextField
                                fullWidth
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                                required
                                variant="outlined"
                                InputProps={{
                                    style: {
                                        backgroundColor: '#fff',
                                        borderRadius: '8px',
                                        borderColor: '#F2F2F2',
                                    },
                                }}
                                sx={textFieldStyle}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-gray-500 mb-2">Email</label>
                            <TextField
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                type="email"
                                variant="outlined"
                                InputProps={{
                                    style: {
                                        backgroundColor: '#fff',
                                        borderRadius: '8px',
                                        borderColor: '#F2F2F2',
                                    },
                                }}
                                sx={textFieldStyle}
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
                                        backgroundColor: '#fff',
                                        borderRadius: '8px',
                                        borderColor: '#F2F2F2',
                                    },
                                }}
                                sx={textFieldStyle}
                            />
                        </div>

                        {/* Designation */}
                        <div>
                            <label className="block text-gray-500 mb-2">Designation</label>
                            <TextField
                                fullWidth
                                value={designation}
                                onChange={(e) => setDesignation(e.target.value)}
                                required
                                variant="outlined"
                                InputProps={{
                                    style: {
                                        backgroundColor: '#fff',
                                        borderRadius: '8px',
                                        borderColor: '#F2F2F2',
                                    },
                                }}
                                sx={textFieldStyle}
                            />
                        </div>

                        {/* Department */}
                        <div>
                            <label className="block text-gray-500 mb-2">Department</label>
                            <TextField
                                fullWidth
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                required
                                variant="outlined"
                                InputProps={{
                                    style: {
                                        backgroundColor: '#fff',
                                        borderRadius: '8px',
                                        borderColor: '#F2F2F2',
                                    },
                                }}
                                sx={textFieldStyle}
                            />
                        </div>

                        {/* Date of Birth (DOB) */}
                        <div>
                            <label className="block text-gray-500 mb-2">Date of Birth</label>
                            <TextField
                                fullWidth
                                type="date"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                required
                                variant="outlined"
                                InputProps={{
                                    style: {
                                        backgroundColor: '#fff',
                                        borderRadius: '8px',
                                        borderColor: '#F2F2F2',
                                    },
                                }}
                                sx={textFieldStyle}
                            />
                        </div>

                        {/* Date Joined */}
                        <div>
                            <label className="block text-gray-500 mb-2">Date Joined</label>
                            <TextField
                                fullWidth
                                type="date"
                                value={dateJoined}
                                onChange={(e) => setDateJoined(e.target.value)}
                                required
                                variant="outlined"
                                InputProps={{
                                    style: {
                                        backgroundColor: '#fff',
                                        borderRadius: '8px',
                                        borderColor: '#F2F2F2',
                                    },
                                }}
                                sx={textFieldStyle}
                            />
                        </div>

                        {/* Employment Type */}
                        <div>
                            <label className="block text-gray-500 mb-2">Employment Type</label>
                            <FormControl fullWidth required variant="outlined">

                                <Select
                                    size='small'
                                    value={employmentType}
                                    onChange={(e) => setEmploymentType(e.target.value)}

                                    InputProps={{
                                        style: {
                                            backgroundColor: '#fff',
                                            borderRadius: '8px',
                                            borderColor: '#F2F2F2',
                                        },
                                    }}
                                    sx={{
                                        backgroundColor: '#fff',
                                        border: 'none',
                                    }}
                                >
                                    <MenuItem value="SALARIED">Salaried Employee</MenuItem>
                                    <MenuItem value="CONTRACTUAL_FIXED_VARIABLE">Contractual with Fixed & Variable Salary</MenuItem>
                                    <MenuItem value="GIG_WORKER">Gig Worker with Variable Income</MenuItem>

                                    {/* Add more options as needed */}
                                </Select>
                            </FormControl>
                        </div>

                        {/* Payment Cycle */}
                        <div>
                            <label className="block text-gray-500 mb-2">Payment Cycle</label>
                            <TextField
                                fullWidth
                                value={paymentCycle}
                                onChange={(e) => setPaymentCycle(e.target.value)}
                                required
                                variant="outlined"
                                InputProps={{
                                    style: {
                                        backgroundColor: '#fff',
                                        borderRadius: '8px',
                                        borderColor: '#F2F2F2',
                                    },
                                }}
                                sx={textFieldStyle}
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-gray-500 mb-2">Address</label>
                            <TextField
                                fullWidth
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                                variant="outlined"
                                InputProps={{
                                    style: {
                                        backgroundColor: '#fff',
                                        borderRadius: '8px',
                                        borderColor: '#F2F2F2',
                                    },
                                }}
                                sx={textFieldStyle}
                            />
                        </div>

                        {/* Error Message */}
                        {dialogError && (
                            <Typography color="error" className="mt-2">
                                {dialogError}
                            </Typography>
                        )}
                    </div>
                </DialogContent>
            </Dialog>


            <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" >
                <DialogContent className="space-y-4">
                    {/* Flex container in column direction for all screen sizes */}
                    <div className="flex flex-col space-y-4">
                        <button
                            onClick={downloadSampleExcel}
                            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition w-full"
                        >
                            Download Sample Excel
                        </button>

                        <DialogTitle className="text-center text-xl font-semibold">
                            Upload Excel File
                        </DialogTitle>

                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                            className="py-2 px-4 border border-gray-300 rounded-lg w-full"
                        />
                    </div>

                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}
                </DialogContent>

                <DialogActions>
                    <button
                        onClick={handleUpload}
                        style={{ zIndex: 10 }}
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition w-full"
                        disabled={loading}
                    >
                        {loading ? 'Uploading...' : 'Upload Excel'}
                    </button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default FarmersInformation;
