import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TableContainer,
  TablePagination,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  Typography,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import Swal from "sweetalert2";
import img from '../../../assets/Group 100.png'
import { Edit } from "@mui/icons-material";

const token = localStorage.getItem('access_token');

const CreatedOrder = () => {
  const [orders, setOrders] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState("");

  // Fetch data from API with pagination
  useEffect(() => {
    fetchOrders();
  }, [page, rowsPerPage]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "https://apis.agrisarathi.com/fposupplier/GetUpdateOnlineOrders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data && response.data.results && response.data.results.products) {
        setTotalCount(response.data.count);

        // **Manual Pagination: Slice Data Based on `page` and `rowsPerPage`**
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        setOrders(response.data.results.products.slice(startIndex, endIndex));
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  // Handle opening dialog
  const handleEditClick = (order) => {
    setSelectedOrder(order);
    setStatus(order.status);
    setOpenDialog(true);
  };

  // Handle closing dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  // Handle updating order status
  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    try {
      await axios.put(
        "https://apis.agrisarathi.com/fposupplier/GetUpdateOnlineOrders",
        { order_id: selectedOrder.order_id, status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire({
        title: "Success!",
        text: "Order status updated successfully.",
        icon: "success",
        didOpen: () => {
          const swalElement = document.querySelector('.swal2-container');
          if (swalElement) {
            swalElement.style.zIndex = 1500;
          }
        }
      });

      fetchOrders(); // Refresh data after update
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating order status:", error);

      Swal.fire({
        title: "Error",
        text: "Failed to update order status. Please try again.",
        icon: "error",
        didOpen: () => {
          const swalElement = document.querySelector('.swal2-container');
          if (swalElement) {
            swalElement.style.zIndex = 1500;
          }
        }
      });
    }
  };


  // Define table columns
  const columns = [
    { accessorKey: "order_id", header: "Order ID" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "total_price", header: "Total Price" },
    { accessorKey: "payment_status", header: "Payment Status" },
    { accessorKey: "created_at", header: "Created At" },
    {
      header: "Actions",
      accessorKey: "actions",
      Cell: ({ row }) => (
        <Button variant="contained" color="primary" 
       startIcon={<Edit/>}
        onClick={() => handleEditClick(row.original)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <>
      <Typography variant="h4" gutterBottom>Created Order Information</Typography>

      {orders?.length === 0 ?
        <div className="flex flex-col items-center mt-28">
          {/* Image when no data is available */}
          <img src={img} alt="No data" className="mb-4" />

        </div> :

        <div style={{ maxWidth: '100%', overflowY: "auto", padding: 10 }}>
          <TableContainer component={Paper} className="overflow-x-auto mt-6 relative">
            <MaterialReactTable
              columns={columns}
              data={orders}
              enablePagination={false} // We are using our own pagination
              muiTableHeadCellProps={{ sx: { borderBottom: "none" } }}
              muiTableBodyCellProps={{ sx: { borderBottom: "none" } }}
            />

            {/* Pagination */}
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

      {/* Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            borderRadius: 4,
            padding: 3,
            minWidth: 700,
            minHeight: 300,
            backgroundColor: "#F2F2F2",
            boxShadow: "none",
          },
        }}
      >
        {/* Top Actions */}
        <DialogActions
          sx={{
            justifyContent: "space-between",
            padding: "12px 24px",
            color: "#A0A0A0",
          }}
        >
          <Button
            sx={{
              color: "#A0A0A0",
              textTransform: "none",
              fontSize: "14px",
              fontWeight: "bold",
            }}
            onClick={handleCloseDialog}
          >
            Cancel
          </Button>
          <Button
            sx={{
              color: "#00B251",
              textTransform: "none",
              fontSize: "14px",
              fontWeight: "bold",
            }}
            onClick={handleUpdateStatus}
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
          Update Order Status
        </DialogTitle>

        {/* Dialog Content */}
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          {/* Status Dropdown */}
          <div className="w-full mt-6">
            <label className="text-gray-500 text-sm font-semibold mb-1">Status</label>
            <FormControl fullWidth>

              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                size="small"
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#F2F2F2" },
                    "&:hover fieldset": { borderColor: "#F2F2F2" },
                    "&.Mui-focused fieldset": { borderColor: "#F2F2F2" },
                  },
                }}
              >
                <MenuItem value="Accepted">Accepted</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreatedOrder;
