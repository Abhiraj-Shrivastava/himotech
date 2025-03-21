import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { MaterialReactTable } from 'material-react-table';
import { Button, TableContainer, Paper, TablePagination, Typography, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Add, Cloud, CloudOff } from '@mui/icons-material';
import Swal from 'sweetalert2';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { AddGetSalesbyFPO } from '../../Api_url';
import AddSales from './AddSales';
import img from '../../../assets/Group 100.png'
import PDFDocument from './PDFDocument';

const SalesHome = () => {
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
    { header: 'SNo.', accessorFn: (row, index) => index + 1, size: 50 },
    { header: 'Sale ID', accessorKey: 'sale_id', size: 180 },
    { header: 'Customer', accessorKey: 'customer', size: 50 },
    {
      header: 'Created At',
      accessorKey: 'created_at',
      Cell: ({ row }) => <Typography>{new Date(row?.original?.created_at).toLocaleString()}</Typography>,
      size: 180,
    },
    { header: 'Final Price', accessorKey: 'final_price', size: 50 },
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
    {
      header: 'pdf',
      accessorFn: 'pdf',
      Cell: ({ row }) => (
        <IconButton
          style={{ color: '#B1B1B1' }}
          onClick={generatePDF}
          color="primary"
        >
          <VisibilityIcon color='grey' />
        </IconButton>
      ),
      size: 50,
    },
  ], [filter]);

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

  const generatePDF = (quotations) => {
    // if (!companyLogo) {           
    //     return null;
    // }

    const doc = <PDFDocument />;

    const { pdf } = require('@react-pdf/renderer');
    return pdf(doc).toBlob().catch((error) => {
        console.error('Error generating PDF:', error);
        return null;
    });
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

export default SalesHome;
