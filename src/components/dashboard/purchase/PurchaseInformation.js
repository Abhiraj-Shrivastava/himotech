import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { TableContainer, Paper, TablePagination, Button, Typography, IconButton, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Add, Delete, RemoveRedEye } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useApis } from '../../Api_url';
import AddPurchaseDialog from './AddPurchaseDialog'; // Import the dialog component
import { MaterialReactTable } from 'material-react-table';
import { RequestPurchasetoVendor } from '../../Api_url';
import img from '../../../assets/Group 100.png'


const PurchaseInformation = () => {
    const { postJson, getJson, deleteJson } = useApis();
    const [farmersData, setFarmersData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedFarmers, setSelectedFarmers] = useState([]);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false); // Control dialog open/close state
    const [paymentLink, setPaymentLink] = useState(null); // Payment link for the modal
    const [openPaymentDialog, setOpenPaymentDialog] = useState(false); // State for the payment modal
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);
    const [buttonClicked, setButtonClicked] = useState(false);

    const navigate = useNavigate();
    const accessToken = localStorage.getItem('access_token'); // Assuming token is stored in localStorage

    // Fetch purchase request data from the API
    const fetchPurchaseRequestData = async () => {
        try {
            const response = await axios.get(RequestPurchasetoVendor, {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Include the token in the header
                },
                params: {
                    page: page + 1, // Send the current page (API is 1-based index)
                    page_size: rowsPerPage, // Send the rows per page
                },
            });

            const { count, next, previous, results } = response?.data;
            setFarmersData(results?.products); // Set the data for the table
            setTotalCount(count); // Set total count for pagination
            setNextPage(next); // Set next page URL for pagination
            setPreviousPage(previous); // Set previous page URL for pagination
        } catch (err) {
            setError('Failed to fetch data.');

        }
    };

    useEffect(() => {
        fetchPurchaseRequestData(); // Fetch the data when page or rowsPerPage changes
    }, [page, rowsPerPage]); // Add page and rowsPerPage to the dependency array


    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSelectFarmer = (requestCode) => {
        setSelectedFarmers(prevState => {
            if (prevState.includes(requestCode)) {
                return prevState?.filter(code => code !== requestCode);  // Unselect farmer if already selected
            } else {
                return [...prevState, requestCode];  // Select farmer
            }
        });
    };

    const handleBulkDelete = async () => {
        if (selectedFarmers.length === 0) {
            Swal.fire({
                title: 'Error!',
                text: 'No Members selected for deletion.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            setError('No access token found.');
            return;
        }

        try {
            // Ensure selectedFarmers is an array of strings
            const response = await axios.delete(RequestPurchasetoVendor, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                data: {
                    request_code: selectedFarmers,  // Make sure this is an array
                }
            });

            if (response?.data?.status === 'success') {
                Swal.fire({
                    title: 'Success!',
                    text: response.data.message || 'Items deleted successfully!',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                });
                fetchPurchaseRequestData();  // Refresh the data after deletion
                setSelectedFarmers([]);  // Clear the selected farmers list
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: response.data.message || 'Failed to delete items.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'An error occurred during deletion.',
                icon: 'error',
                confirmButtonText: 'OK'
            });


        }
    };

    const handlePaymentClick = (row) => {
        const paymentLink = row?.link?.length > 0 ? row?.link[0]?.razorpay_payment_link : null;

        if (paymentLink) {
            setPaymentLink(paymentLink); // Set the payment link
            setOpenPaymentDialog(true);  // Open the payment modal
        } else {
            console.log("No payment link available.");
        }
    };

    const columns = [
        {
            header: 'Select',
            id: 'select',
            Cell: ({ row }) => (
                <Checkbox
                    checked={selectedFarmers.includes(row.original.request_code)}
                    onChange={() => handleSelectFarmer(row.original.request_code)}
                />
            ),
            size: 50,
        },
        {
            header: 'S.No',
            id: 'serial',
            accessorKey: 'request_code',
            Cell: ({ row }) => row.index + 1,
            size: 50,
        },
        {
            header: 'Request code',
            id: 'request_code',
            accessorKey: 'request_code',
        },
        {
            header: 'Status',
            id: 'status',
            accessorKey: 'status',
        },
        {
            header: 'Vendor',
            id: 'vendor',
            accessorKey: 'vendor',
        },
        {
            header: 'Actions',
            id: 'actions',
            Cell: ({ row }) => (
                <IconButton onClick={() => navigate(`/purchase/${row.original.request_code}`)}>
                    <RemoveRedEye />
                </IconButton>
            ),
            size: 50,
        },
        {
            header: 'Payment',
            id: 'payment',
            Cell: ({ row }) => (
                <Button
                    variant="contained"
                    color="primary"
                    disabled={row.original.status !== 'payment_pending'}
                    onClick={() => handlePaymentClick(row.original)}
                >
                    Pay
                </Button>
            ),
            size: 50,
        },
        {
            header: 'Quotation',
            id: 'quotation',
            Cell: ({ row }) => (
                row?.original?.quotation_pdf ? (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            const quotationPdf = row?.original?.quotation_pdf; // Get the quotation PDF link

                            console.log("Quotation PDF link:", quotationPdf); // Log the link to inspect

                            if (quotationPdf) {
                                // If the quotation_pdf link is relative, prepend the base URL
                                const pdfUrl = quotationPdf.startsWith("http")
                                    ? quotationPdf // If it's already an absolute URL, use it as is
                                    : `https://apis.agrisarathi.com${quotationPdf}`; // Otherwise, prepend the base URL

                                console.log("Final PDF URL:", pdfUrl); // Log the final URL to check

                                window.open(pdfUrl, "_blank"); // Open the link in a new tab
                            } else {
                                alert("No Quotation Available"); // Show alert if no link is available
                            }
                        }}
                    >
                        View pdf
                    </Button>
                ) : (
                    // If there's no quotation link, return null (don't show the button)
                    null
                )
            ),
            size: 180,
        }


    ];

    return (
        <div className="p-6">
            <Typography variant="h4" gutterBottom>Request Purchase Information</Typography>

            {error && <Typography color="error">{error}</Typography>}

            {farmersData.length != 0 ? (
                <div className="flex  md:flex-row gap-4 mb-5 ">
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setOpenDialog(true)}
                        sx={{
                            textTransform: 'none',
                            borderRadius: 2,
                            paddingX: 4,
                            color: 'white',
                            width: 'fit-content',
                            alignSelf: 'center',
                        }}
                    >
                        Add purchase
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
                                backgroundColor: '#d3d3d3', // Light gray background when disabled
                                color: '#a9a9a9', // Light gray icon when disabled
                            },
                        }}
                    >
                        <Delete />
                    </IconButton>
                </div>
            ) : null}
            {/* Table to display farmers */}

            {farmersData.length === 0 ?
            <div className="flex flex-col items-center mt-28">
            {/* Image when no data is available */}
            <img src={img} alt="No data" className="mb-4" />

            {/* Buttons below the image */}
            <div className="flex flex-col md:flex-row items-center gap-4">
            <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setOpenDialog(true)}
                        sx={{
                            textTransform: 'none',
                            borderRadius: 2,
                            paddingX: 4,
                            color: 'white',
                            width: 'fit-content',
                            alignSelf: 'center',
                            mt:10
                        }}
                    >
                        Add purchase
                    </Button>
            </div>
        </div> :
            <div style={{ maxWidth: '100%', overflowY: 'auto', padding: 10 }}>
                <TableContainer component={Paper} className="overflow-x-auto mt-6 relative">
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
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={totalCount}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            nextButtonProps={{ disabled: !nextPage }}
                            backButtonProps={{ disabled: !previousPage }}
                        />
                    </div>
                </TableContainer>
            </div>
}



            {/* Dialog for Adding Purchase */}
            {openDialog && <AddPurchaseDialog openDialog={openDialog} setOpenDialog={setOpenDialog} fetchPurchaseRequestData={fetchPurchaseRequestData} />}

            {/* Dialog for Payment Link */}
            <Dialog
                open={openPaymentDialog}
                onClose={() => setOpenPaymentDialog(false)}
                aria-labelledby="payment-dialog-title"
                fullWidth
                maxWidth="md"  // Adjust maxWidth as needed
            >
                <DialogTitle id="payment-dialog-title">Payment Information</DialogTitle>
                <DialogContent>
                    {paymentLink ? (
                        <iframe
                            src={paymentLink}
                            width="100%"
                            height="600"
                            title="Payment Page"
                            frameBorder="0"
                        />
                    ) : (
                        <Typography>No payment link available.</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenPaymentDialog(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default PurchaseInformation;
