import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { MaterialReactTable } from 'material-react-table';
import { Button, Typography, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Autocomplete } from '@mui/material';
import { Add, Cloud, CloudOff } from '@mui/icons-material';
import Swal from 'sweetalert2';
import AddInventory from './AddInventory';
import { Edit } from '@mui/icons-material';
import { GetDelUpdateInventory, CreateGetOrderReturns, UserProfileView, AddInventoryToMarketplace } from '../../Api_url';
import { TableContainer, Paper, TablePagination } from '@mui/material';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import img from '../../../assets/Group 100.png'

const InventoryHome = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [filter, setFilter] = useState('offline');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentInventoryId, setCurrentInventoryId] = useState(null);
  const [currentOnlinePrice, setCurrentOnlinePrice] = useState('');
  const [currentOfflinePrice, setCurrentOfflinePrice] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openReturnDialog, setOpenReturnDialog] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [supplierShops, setSupplierShops] = useState([]);
  const [onlineDialog, setOnlineDialog] = useState(false);
  const [shopId, setShopId] = useState(null);
  const [totalCount, setTotalCount] = useState(0)


  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event?.target.value, 10));
    setPage(0);
  };

 
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      const response = await axios.get(GetDelUpdateInventory, {
        params: { filter_type: filter, page: page + 1, page_size: rowsPerPage },
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setInventoryData(response?.data?.results?.purchase_orders || []);

      setTotalCount(response?.data?.count)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter, page, rowsPerPage]);

  const handleAddToOnlineMarket = async (inventory_id) => {

    try {
      // Fetch supplier shop info
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const userProfileResponse = await axios.get(UserProfileView, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const shopsData = userProfileResponse?.data?.data?.shop_details;
      if (!shopsData) {
        Swal.fire({
          icon: 'error',
          title: 'Shop not found!',
          text: 'No supplier shop found, unable to add to marketplace.',
          didOpen: () => {
            const swalElement = document.querySelector('.swal2-container');
            if (swalElement) {
              swalElement.style.zIndex = 1500;
            }
          }
        });
        return;
      }
      setSupplierShops(shopsData); // Set the supplier shop ID

      setCurrentInventoryId(inventory_id); // Set the inventory ID
      setOnlineDialog(true);

    } catch (error) {
      console.error('Error fetching supplier shop:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to fetch shop details!',
        text: 'Unable to fetch supplier shop. Please try again later.',
        didOpen: () => {
          const swalElement = document.querySelector('.swal2-container');
          if (swalElement) {
            swalElement.style.zIndex = 1500;
          }
        }
      });
    }
  };

  const handleSubmitAddToOnline = async () => {

    const parsedQuantity = parseInt(quantity, 10);

    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Please provide a valid quantity!',
        text: 'Quantity must be a positive number.',
        showConfirmButton: true,
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
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await axios.post(
        AddInventoryToMarketplace,
        {
          inventory_products: [
            {
              inventory_id: currentInventoryId,
              quantity: parsedQuantity,
              supplier_shop: shopId,
            },
          ],
        },
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );

      if (response?.data?.message === 'Products added to marketplace successfully') {
        setOnlineDialog(false);
        Swal.fire({
          icon: 'success',
          title: 'Added to Online Market!',
          text: 'Inventory has been successfully added to the marketplace.',
          didOpen: () => {
            const swalElement = document.querySelector('.swal2-container');
            if (swalElement) {
              swalElement.style.zIndex = 1500;
            }
          }
        });
        setQuantity(''); // Clear quantity field
        fetchData(); // Refresh inventory data
      } else {
        setOnlineDialog(false);
        Swal.fire({
          icon: 'error',
          title: 'Failed to add inventory!',
          text: 'Something went wrong while adding to the online market. Please try again.',
          didOpen: () => {
            const swalElement = document.querySelector('.swal2-container');
            if (swalElement) {
              swalElement.style.zIndex = 1500;
            }
          }
        });
      }
    } catch (error) {
      setOnlineDialog(false);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong while adding to the online market. Please try again!',
        didOpen: () => {
          const swalElement = document.querySelector('.swal2-container');
          if (swalElement) {
            swalElement.style.zIndex = 1500;
          }
        }
      });
    }
  };

  const handlePriceChange = (e) => {
    if (filter === 'online') {
      setCurrentOnlinePrice(e?.target?.value);
    } else {
      if (e.target.name === 'online_price') {
        setCurrentOnlinePrice(e?.target?.value);
      } else {
        setCurrentOfflinePrice(e?.target?.value);
      }
    }
  };

  const savePriceChange = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const priceToUpdate = filter === 'online'
        ? { online_price: currentOnlinePrice }
        : { online_price: currentOnlinePrice, offline_price: currentOfflinePrice };

      await axios.put(GetDelUpdateInventory, {
        inventory_id: currentInventoryId,
        ...priceToUpdate,
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      fetchData();
      Swal.fire({
        icon: 'success',
        title: 'Price updated successfully!',
        showConfirmButton: false,
        timer: 1500,
        didOpen: () => {
          const swalElement = document.querySelector('.swal2-container');
          if (swalElement) {
            swalElement.style.zIndex = 1500;
          }
        }
      });
      setOpenDialog(false);
    } catch (error) {
      setOpenDialog(false);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong while updating the price. Please try again!',
        didOpen: () => {
          const swalElement = document.querySelector('.swal2-container');
          if (swalElement) {
            swalElement.style.zIndex = 1500;
          }
        }
      });
    }
  };

  const handleEditClick = (inventory_id, online_price, offline_price) => {
    setCurrentInventoryId(inventory_id);
    setCurrentOnlinePrice(online_price);
    setCurrentOfflinePrice(offline_price);
    setOpenDialog(true);
  };

  const handleReturnClick = (inventory_id) => {
    setCurrentInventoryId(inventory_id);
    setOpenReturnDialog(true);
  };

  const submitReturnRequest = async () => {
    if (!quantity || !reason) {
      Swal.fire({
        icon: 'warning',
        title: 'Please fill in both fields!',
        text: 'Both quantity and reason are required to submit the return request.',
        showConfirmButton: true,
        didOpen: () => {
          const swalElement = document.querySelector('.swal2-container');
          if (swalElement) {
            swalElement.style.zIndex = 1500;
          }
        }
      });
      return; // Don't proceed with the API call if fields are not filled
    }

    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await axios.post(CreateGetOrderReturns, {
        inventory_id: currentInventoryId,
        quantity: quantity,
        reason: reason
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setOpenReturnDialog(false);
      Swal.fire({
        icon: 'success',
        title: 'Return request submitted successfully!',
        showConfirmButton: false,
        timer: 1500,
        didOpen: () => {
          const swalElement = document.querySelector('.swal2-container');
          if (swalElement) {
            swalElement.style.zIndex = 1500;
          }
        }
      });

      setQuantity('');
      setReason('');
      fetchData();
    } catch (error) {
      setOpenReturnDialog(false);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong while submitting the return request. Please try again!',
        didOpen: () => {
          const swalElement = document.querySelector('.swal2-container');
          if (swalElement) {
            swalElement.style.zIndex = 1500;
          }
        }
      });
    }
  };


  const columns = useMemo(() => {
    const baseColumns = [
      { header: 'SNo.', accessorFn: (row, index) => index + 1, size: 50 },

      // Actions column, which will be conditionally rendered based on the filter
      ...(filter === 'offline' ? [{
        header: 'Actions',
        accessorFn: (row) => row?.inventory_id,
        Cell: ({ row }) => {
          const { online_price, offline_price, is_return } = row?.original;
          return (
            filter === 'offline' && (
              <div className="flex space-x-4">
                {/* Edit Button */}
                <Button
                  onClick={() => handleEditClick(row?.original?.inventory_id, online_price, offline_price)}
                  startIcon={<Edit />}
                  sx={{
                    color: "green",
                    textTransform: "none",
                    textDecoration: "underline",
                    fontWeight: "bold",
                    fontSize: "16px",
                    background: "none",
                    boxShadow: "none",
                    "&:hover": { background: "none" },
                  }}
                >
                  Edit
                </Button>

                {/* Return Button (Only shown when is_return is true) */}
                {is_return && (
                  <Button
                    onClick={() => handleReturnClick(row?.original?.inventory_id)}
                    startIcon={<AssignmentReturnIcon />}
                    sx={{
                      color: "red",
                      textTransform: "none",
                      textDecoration: "underline",
                      fontWeight: "bold",
                      fontSize: "16px",
                      background: "none",
                      boxShadow: "none",
                      "&:hover": { background: "none" },
                    }}
                  >
                    Return
                  </Button>
                )}
              </div>

            )
          );
        },
      },
      
       {
        header: 'Add to Online Market',
        accessorFn: (row) => row?.inventory_id,
        Cell: ({ row }) => {
          return (
            filter === 'offline' && (
              <div className="flex justify-center">
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => handleAddToOnlineMarket(row?.original?.inventory_id)} // Add to online market button
                  sx={{ marginLeft: 1, textTransform: 'none' }}
                >
                  Add
                </Button>
              </div>
            )
          );
        },
      },] : []),

      // Other columns (no changes needed here)
      { header: 'Inventory ID', accessorKey: 'inventory_id', size: 50 },
      { header: 'Product Name', accessorKey: 'product_name', size: 50 },
      { header: 'Variant', accessorKey: 'variant_name', size: 50 },
      { header: 'Stock', accessorKey: 'stock', size: 50 },
      { header: 'Category', accessorKey: 'category', size: 50 },
      { header: 'Brand', accessorKey: 'brand', size: 50 },
    ];


    if (filter === 'online') {
      baseColumns.push({
        header: 'Online Price',
        accessorKey: 'online_price',
        Cell: ({ row }) => <Typography>{row?.original?.online_price}</Typography>,
        size: 50,
      });
    } else if (filter === 'offline') {
      baseColumns.push(
        {
          header: 'Offline Price',
          accessorKey: 'offline_price',
          Cell: ({ row }) => <Typography>{row?.original?.offline_price}</Typography>,
          size: 50,
        },
        {
          header: 'Online Price',
          accessorKey: 'online_price',
          Cell: ({ row }) => <Typography>{row?.original?.online_price}</Typography>,
          size: 50,
        }
      );
    }

    return baseColumns;
  }, [filter]);

  const handleOnlineClick = () => {
    setFilter('online');
    setIsOnline(true);
  };

  const handleOfflineClick = () => {
    setFilter('offline');
    setIsOnline(false);
  };


  const selectedItem = inventoryData?.find(i => i?.inventory_id === currentInventoryId)

  return (
    <>
      <Typography variant="h4" gutterBottom>Inventory Information</Typography>

      <div className="p-6">
        
          <div className="flex justify-center mb-10">

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
       

        {inventoryData?.length != 0 ? (
          <div className="flex flex-col md:flex-row gap-4 ">
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenAddDialog(true)}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                paddingX: 4,
                color: 'white',
                width: 'fit-content',
                alignSelf: 'center',
              }}

            >
              Add Inventory To Offline
            </Button>
          </div>
        ) : null}

        {inventoryData.length === 0 ?
          <div className="flex flex-col items-center mt-28">
            {/* Image when no data is available */}
            <img src={img} alt="No data" className="mb-4" />

            {/* Buttons below the image */}
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenAddDialog(true)}
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
                Add Inventory To Offline
              </Button>
            </div>
          </div> :
          <div style={{ maxWidth: '100%', overflowY: 'auto',  }}>
            <TableContainer component={Paper} className="overflow-x-auto mt-6 relative">
              <MaterialReactTable
                columns={columns}
                data={inventoryData || []}
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

        {openAddDialog && <AddInventory openAddDialog={openAddDialog} setOpenAddDialog={setOpenAddDialog} />}

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 4,
              padding: 3,
              minWidth: 700,
              minHeight: 400,
              backgroundColor: '#F2F2F2',
              boxShadow: "none"
            }
          }}
        >

          {/* Top Buttons (Cancel & Save) */}
          <DialogActions
            sx={{
              justifyContent: "space-between",
              padding: "12px 24px",
              color: "#A0A0A0"
            }}
          >
            <Button
              sx={{ color: "#A0A0A0", textTransform: "none", fontSize: "14px", fontWeight: "bold" }}
              onClick={() => setOpenDialog(false)}
            >
              Cancel
            </Button>
            <Button
              sx={{ color: "#00B251", textTransform: "none", fontSize: "14px", fontWeight: "bold" }}
              onClick={savePriceChange}
            >
              Submit
            </Button>
          </DialogActions>

          {/* Dialog Title */}
          <DialogTitle
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "18px",
              paddingBottom: 2,
              color: "#313131"
            }}
          >
            Edit Price
          </DialogTitle>

          {/* Dialog Content */}
          <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>

            {filter === 'online' ? (
              <div className="w-full mt-6">
                <label className="text-gray-500 text-sm font-semibold mb-2">Online Price</label>
                <TextField
                  size='small'
                  variant="outlined"
                  fullWidth
                  type="number"
                  name="online_price"
                  value={currentOnlinePrice}
                  onChange={handlePriceChange}
                  InputProps={{
                    style: {
                      height: 39,
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
            ) : (
              <>
                <div className="w-full">
                  <label className="text-gray-500 text-sm font-semibold mb-2">Offline Price</label>
                  <TextField
                    size='small'
                    variant="outlined"
                    fullWidth
                    type="number"
                    name="offline_price"
                    value={currentOfflinePrice}
                    onChange={handlePriceChange}
                    InputProps={{
                      style: {

                        height: 39,
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

                <div className="w-full">
                  <label className="text-gray-500 text-sm font-semibold mb-4">Online Price</label>
                  <TextField
                    size='small'
                    variant="outlined"
                    fullWidth
                    type="number"
                    name="online_price"
                    value={currentOnlinePrice}
                    onChange={handlePriceChange}
                    InputProps={{
                      style: {
                        height: 39,
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
              </>
            )}
          </DialogContent>
        </Dialog>


        <Dialog
          open={openReturnDialog}
          onClose={() => setOpenReturnDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 4,
              padding: 3,
              minWidth: 700,
              minHeight: 400,
              backgroundColor: '#F2F2F2',
              boxShadow: "none"
            }
          }}
        >
          {/* Top Actions */}
          <DialogActions
            sx={{
              justifyContent: "space-between",
              padding: "12px 24px",
              color: "#A0A0A0"
            }}
          >
            <Button sx={{ color: "#A0A0A0", textTransform: "none", fontSize: "14px", fontWeight: "bold" }} onClick={() => setOpenReturnDialog(false)}>
              Cancel
            </Button>
            <Button sx={{ color: "#00B251", textTransform: "none", fontSize: "14px", fontWeight: "bold" }} onClick={submitReturnRequest}>
              Submit
            </Button>
          </DialogActions>

          {/* Dialog Title */}
          <DialogTitle sx={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "18px",
            paddingBottom: 2,
            color: "#313131"
          }}>
            Add Returns
          </DialogTitle>

          {/* Dialog Content */}
          <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>

            {/* Reason Field */}
            <div className="w-full mt-6">
              <label className="text-gray-500 text-sm font-semibold mb-1">Reason</label>
              <TextField
                size='small'
                variant="outlined"
                fullWidth
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                InputProps={{
                  style: {
                    height: 39,
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

            {/* Quantity Field */}
            <div className="w-full flex flex-col items-center">
              <label className="text-gray-500 text-sm font-semibold mb-1">Quantity</label>
              <TextField
                size='small'

                variant="outlined"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                InputProps={{
                  style: {
                    height: 39,
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

          </DialogContent>
        </Dialog>

        <Dialog
          open={onlineDialog}
          onClose={() => setOnlineDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 4,
              padding: 3,
              minWidth: 800,
              minHeight: 300,
              backgroundColor: '#F2F2F2',
              boxShadow: "none",
            }
          }}
        >
          {/* Top Buttons (Cancel & Submit) */}
          <DialogActions
            sx={{
              justifyContent: "space-between",
              padding: "12px 24px",
              color: "#A0A0A0",
            }}
          >
            <Button
              sx={{ color: "#A0A0A0", textTransform: "none", fontSize: "14px", fontWeight: "bold" }}
              onClick={() => setOnlineDialog(false)}
            >
              Cancel
            </Button>
            <Button
              sx={{ color: "#00B251", textTransform: "none", fontSize: "14px", fontWeight: "bold" }}
              onClick={handleSubmitAddToOnline}
            >
              Submit
            </Button>
          </DialogActions>

          {/* Dialog Title */}
          <DialogTitle
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "18px",
              paddingBottom: 2,
              color: "#313131",
            }}
          >
            Add to Online Market
          </DialogTitle>

          {/* Dialog Content (Form Fields) */}
          <DialogContent>
            <div className="grid grid-cols-2 gap-4 my-6">

              {/* Shop ID (Autocomplete) */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm text-gray-600">Shop ID</label>
                <Autocomplete
                  fullWidth
                  options={supplierShops}
                  getOptionLabel={(option) => option?.shopName || ''}
                  value={supplierShops.find((m) => m?.shop_id === shopId) || null}
                  onChange={(e, value) => setShopId(value?.shop_id)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      size="small"
                      sx={{
                        height: 39,
                        borderRadius: '8px',
                        backgroundColor: '#fff',
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: '#F2F2F2' },
                          '&:hover fieldset': { borderColor: '#F2F2F2' },
                          '&.Mui-focused fieldset': { borderColor: '#fff', borderWidth: '0px', boxShadow: 'none' },
                        },
                        '& .MuiOutlinedInput-input': { padding: '10px 14px' },
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
                  size="small"
                  variant="outlined"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  sx={{
                    height: 39,
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#F2F2F2' },
                      '&:hover fieldset': { borderColor: '#F2F2F2' },
                      '&.Mui-focused fieldset': { borderColor: '#fff', borderWidth: '0px', boxShadow: 'none' },
                    },
                    '& .MuiOutlinedInput-input': { padding: '10px 14px' },
                  }}
                />
              </div>

              {/* Variant */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm text-gray-600">Variant</label>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  value={selectedItem?.variant_name}
                  disabled
                  sx={{
                    height: 39,
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { border: 'none' }, // Removes border completely
                      '&:hover fieldset': { border: 'none' }, // No border on hover
                      '&.Mui-focused fieldset': { border: 'none', boxShadow: 'none' }, // No border on focus
                    },
                    '& .MuiOutlinedInput-input': { padding: '10px 14px' },
                  }}
                />
              </div>

              {/* Stock */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm text-gray-600">Stock</label>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  value={selectedItem?.stock}
                  disabled
                  sx={{
                    height: 39,
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { border: 'none' }, // Removes border completely
                      '&:hover fieldset': { border: 'none' }, // No border on hover
                      '&.Mui-focused fieldset': { border: 'none', boxShadow: 'none' }, // No border on focus
                    },
                    '& .MuiOutlinedInput-input': { padding: '10px 14px' },
                  }}
                />
              </div>

              {/* Category */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm text-gray-600">Category</label>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  value={selectedItem?.category}
                  disabled
                  sx={{
                    height: 39,
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { border: 'none' }, // Removes border completely
                      '&:hover fieldset': { border: 'none' }, // No border on hover
                      '&.Mui-focused fieldset': { border: 'none', boxShadow: 'none' }, // No border on focus
                    },
                    '& .MuiOutlinedInput-input': { padding: '10px 14px' },
                  }}
                />
              </div>

              {/* Brand */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm text-gray-600">Brand</label>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  value={selectedItem?.brand}
                  disabled
                  sx={{
                    height: 39,
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { border: 'none' }, // Removes border completely
                      '&:hover fieldset': { border: 'none' }, // No border on hover
                      '&.Mui-focused fieldset': { border: 'none', boxShadow: 'none' }, // No border on focus
                    },
                    '& .MuiOutlinedInput-input': { padding: '10px 14px' },
                  }}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </>
  );
};

export default InventoryHome;
