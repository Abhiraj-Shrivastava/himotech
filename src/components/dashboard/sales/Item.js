import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { MaterialReactTable } from 'material-react-table';
import { Button, TableContainer, Paper, TablePagination, Typography, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, CircularProgress } from '@mui/material';
import { Add } from '@mui/icons-material';
import Swal from 'sweetalert2';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { AddGetSalesbyFPO, GenerateInvoice } from '../../Api_url';
import AddSales from './AddSales';
import img from '../../../assets/Group 100.png'
import PDFDocument from './PDFDocument';

const Item = () => {
  const [salesData, setSalesData] = useState([]);
  const [filter, setFilter] = useState('offline');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedSale, setSelectedSale] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [dialogPage, setDialogPage] = useState(0);
  const [dialogRowsPerPage, setDialogRowsPerPage] = useState(5);
  const [purchaseData, setPurchaseData] = useState(null); // Store API response
  const [customerDetails, setCustomerDetails] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [totalPriceBeforeGST, setTotalPriceBeforeGST] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState(null)

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'Authentication failed!',
          text: 'No access token found. Please login again.',
        });
        return;
      }

      const response = await axios.get(AddGetSalesbyFPO, {
        params: { filter_type: filter },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response?.data?.message === 'Sales fetched successfully') {
        setSalesData(response?.data?.sales || []);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed to fetch sales data',
          text: 'There was an issue fetching the sales data. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error fetching sales data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'There was an error connecting to the server. Please check your internet connection.',
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  const columns = useMemo(() => [
    {
      header: 'SNo.',
      accessorFn: (row, index) => index + 1,
      size: 50
    },
    {
      header: 'Sale ID',
      accessorKey: 'sale_id',
      size: 180
    },
    {
      header: 'Customer',
      accessorFn: (row) => row?.customer?.buyer_name || 'N/A',
      size: 50
    },
    {
      header: 'Mobile Number',
      accessorFn: (row) => row?.customer?.mobile_no || 'N/A',
      size: 50
    },
    {
      header: 'Created At',
      accessorKey: 'created_at',
      Cell: ({ row }) => <Typography>{new Date(row?.original?.created_at).toLocaleString()}</Typography>,
      size: 180,
    },
    // {
    //   header: 'Price',
    //   accessorKey: 'price',
    //   size: 50
    // },
    {
      header: 'Items',
      accessorFn: (row) => row?.items,
      Cell: ({ row }) => (
        <IconButton
          style={{ color: '#B1B1B1' }}
          onClick={() => handleOpenDialog(row?.original)}
          color="primary"
        >
          <VisibilityIcon color='grey' />
        </IconButton>
      ),
      size: 50,
    },

    ...(filter === 'offline' ? [
      {
        header: 'Generate Invoice',
        accessorFn: (row) => row?.sale_id,
        Cell: ({ row }) => (
          filter === 'offline' && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleGet(row.original.sale_id)}
              disabled={loading && selectedSaleId === row.original.sale_id}  // Disable the button when loading is true
            >
              {(loading && selectedSaleId === row.original.sale_id) ? <CircularProgress size={24} color="secondary" /> : 'Generate'}
            </Button>
          )
        ),

        size: 50,  

      },] : [])

  ], [filter, loading]);


  const handleGet = async (saleId) => {
    setSelectedSaleId(saleId)
    setLoading(true);
    await fetchPdfData(saleId);
  }

  const generatePDF = async (saleId, purchaseData, customerDetails, quotations, totalPrice, totalPriceBeforeGST) => {
    console.log("Generate PDF clicked for Sale ID:", saleId);
    try {
        // Check if all required data is available
        if (!purchaseData || !customerDetails || quotations.length === 0 || totalPrice === 0) {
            console.error("Missing required data for PDF generation");

            // Display error alert to user
            Swal.fire({
                icon: 'error',
                title: 'Missing Data',
                text: 'Some required data is missing. Please try again later.',
            });
            return;  // Prevent PDF generation if data is incomplete
        }

        // Data is ready for PDF generation
        const doc = (
            <PDFDocument
                purchaseData={purchaseData}
                customerDetails={customerDetails}
                quotations={quotations}
                totalPriceBeforeGST={totalPriceBeforeGST}
                totalPrice={totalPrice}
            />
        );

        // Import the PDF library
        const { pdf } = require('@react-pdf/renderer');

        // Generate the PDF and handle errors
        const blob = await pdf(doc).toBlob();
        console.log("PDF generated successfully");

        // Check if the blob is valid
        if (blob.size === 0) {
            console.error("Generated PDF blob is empty");
            Swal.fire({
                icon: 'error',
                title: 'PDF Generation Failed',
                text: 'The PDF was generated but is empty. Please try again later.',
            });
            return;
        }

        // If you want to download the generated PDF, you can use a blob download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Invoice_${saleId}.pdf`;  // Set the download file name
        link.click();

        // Now we need to send the PDF to the server
        await submitPDFToServer(saleId, blob);

    } catch (error) {
        console.error("Error generating PDF:", error);
        Swal.fire({
            icon: 'error',
            title: 'PDF Generation Failed',
            text: 'An error occurred while generating the PDF. Please try again later.',
        });
    } finally {
        // Hide loader after process is complete
        setSelectedSaleId(null);
        setLoading(false);
    }
};

  const submitPDFToServer = async (saleId, pdfBlob) => {
    try {
        const accessToken = localStorage.getItem('access_token');

        // Prepare FormData to submit the PDF
        const formData = new FormData();
        formData.append("sale_id", saleId);
        formData.append("invoice", pdfBlob, `Invoice_${saleId}.pdf`);

        // Send the request to the server
        const response = await axios.post(GenerateInvoice, formData, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data',  // This header is important for sending FormData
            }
        });

        if (response?.data?.message === 'Invoice saved successfully') {
            Swal.fire({
                icon: 'success',
                title: 'Invoice Submitted',
                text: 'The generated invoice has been submitted successfully.',
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'There was an issue submitting the invoice. Please try again.',
            });
        }
    } catch (error) {
        console.error("Error submitting PDF:", error);
        Swal.fire({
            icon: 'error',
            title: 'Submission Error',
            text: 'An error occurred while submitting the invoice. Please try again later.',
        });
    }
};


  // Fetch data for PDF generation
  const fetchPdfData = async (saleId) => {
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await axios.get(
        `https://apis.agrisarathi.com/fposupplier/GetInvoicePricing?sale_id=${saleId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = response?.data;
      console.log("Fetched Data: ", data);  // Log the fetched data for debugging

      // Ensure data exists and set the state correctly
      if (data?.invoice_pricing?.items) {
        setPurchaseData(data);
        setCustomerDetails(data?.invoice_pricing?.customer);
        setQuotations(data?.invoice_pricing?.items || []);

        // Calculate total prices
        const totalBeforeGST = data?.invoice_pricing?.items?.reduce(
          (acc, item) => acc + (item?.price_before_gst || 0), 0
        );
        const total = data?.invoice_pricing?.items?.reduce(
          (acc, item) => acc + (item?.price || 0), 0
        );

        setTotalPriceBeforeGST(totalBeforeGST);
        setTotalPrice(total);
        generatePDF(saleId, data, data?.invoice_pricing?.customer, data?.invoice_pricing?.items, total, totalBeforeGST)
      } else {
        console.error("No items found in the response data.");
        setPurchaseData(null);  // Reset state in case of missing data
      }
    } catch (error) {
      console.error('Error fetching data', error);
      setPurchaseData(null);  // Reset state in case of error
    }
  };

  useEffect(() => {
    if (purchaseData && customerDetails && quotations.length > 0 && totalPrice > 0) {
      // All required data is available
      console.log("Data is ready for PDF generation.");
    } else {
      console.log("Data is still being fetched.");
    }
  }, [purchaseData, customerDetails, quotations, totalPrice]);


  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event?.target?.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (sale) => {
    setSelectedSale(sale);  // Set selected sale data
    setOpenDialog(true);    // Open the dialog
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);  // Close the dialog
    setSelectedSale(null);  // Clear the selected sale
  };

  const handleDialogPageChange = (event, newPage) => setDialogPage(newPage);
  const handleDialogRowsPerPageChange = (event) => {
    setDialogRowsPerPage(parseInt(event?.target?.value, 10));
    setDialogPage(0);
  };

  const paginatedData = salesData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const totalCount = salesData?.length;

  const dialogPaginatedItems = selectedSale?.items?.slice(dialogPage * dialogRowsPerPage, dialogPage * dialogRowsPerPage + dialogRowsPerPage);
  const dialogTotalCount = selectedSale?.items?.length;
  const handleOnlineClick = () => {
    setFilter('online');
    setIsOnline(true);
  };

  const handleOfflineClick = () => {
    setFilter('offline');
    setIsOnline(false);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>Sales Information</Typography>
      <div className="p-6">

        <div className="flex justify-center mb-10 ">
          <div className="inline-flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={handleOnlineClick}
              className={`px-14 py-1 rounded-xl font-semibold transition-all duration-200 ${isOnline
                ? 'bg-[#92FE9D] text-black'
                : 'bg-transparent text-gray-600 hover:bg-gray-200'
                }`}
            >
              Online
            </button>
            <button
              onClick={handleOfflineClick}
              className={`px-14 py-1 rounded-xl font-semibold transition-all duration-200 ${!isOnline
                ? 'bg-[#92FE9D] text-black'
                : 'bg-transparent text-gray-600 hover:bg-gray-200'
                }`}
            >
              Offline
            </button>
          </div>
        </div>


        {paginatedData.length != 0 ? (

          <div className="flex flex-col md:flex-row gap-4">
            {/* Show the button only when the filter is 'offline' */}
            {filter === 'offline' && (
              <Button
                variant="contained"
                startIcon={<Add />}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  paddingX: 4,
                  color: 'white',
                  width: 'fit-content',
                  alignSelf: 'center',

                }}
                onClick={() => setOpenAddDialog(true)}
              >
                Add Sales
              </Button>
            )}
          </div>

        ) : null}

        {paginatedData.length === 0 ?
          <div className="flex flex-col items-center mt-28">
            {/* Image when no data is available */}
            <img src={img} alt="No data" className="mb-4" />

            {/* Buttons below the image */}
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Button
                variant="contained"
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
                onClick={() => setOpenAddDialog(true)}
              >
                Add Sales
              </Button>
            </div>
          </div> :
          <div style={{ maxWidth: '100%', overflowY: 'auto', padding: 10 }}>
            <TableContainer component={Paper} className="overflow-x-auto mt-6 relative">
              <MaterialReactTable
                columns={columns}
                data={paginatedData}
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

        {openAddDialog && <AddSales openAddDialog={openAddDialog} setOpenAddDialog={setOpenAddDialog} />}

        {/* Dialog for displaying items */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
          <DialogTitle sx={{ marginBottom: 2 }} className='bg-[#00B251] text-white'>Items for Sale: {selectedSale?.sale_id}</DialogTitle>
          <DialogContent>
            <MaterialReactTable
              columns={[
                { header: 'Product', accessorKey: 'product' },
                { header: 'Variant', accessorKey: 'variant' },
                { header: 'Quantity', accessorKey: 'quantity' },
                { header: 'Price', accessorKey: 'price' },
              ]}
              data={dialogPaginatedItems || []}
              enablePagination={false}
            />
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={dialogTotalCount}
              rowsPerPage={dialogRowsPerPage}
              page={dialogPage}
              onPageChange={handleDialogPageChange}
              onRowsPerPageChange={handleDialogRowsPerPageChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default Item;
