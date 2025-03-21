import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material';
import { useParams } from 'react-router';
import { MaterialReactTable } from 'material-react-table';
import Swal from 'sweetalert2';
import { ViewSingleRequestProductDetails, RequestPurchaseUpdate } from '../../Api_url'

const SinglePurchase = () => {
  const { request_code } = useParams();

  const [purchaseData, setPurchaseData] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('access_token');

  const statusSteps = [
    { status: 'pending', label: 'Pending' },
    { status: 'vendor_responded', label: 'Vendor Responded' },
    { status: 'quotation_sent', label: 'Quotation Sent' },
    { status: 'quotation_modify', label: 'Quotation Modify' },
    { status: 'quotation_approved', label: 'Quotation Approved' },
    { status: 'quotation_rejected', label: 'Quotation Rejected' },
    { status: 'payment_pending', label: 'Payment Pending' },
    { status: 'payment_completed', label: 'Payment Completed' },
    { status: 'in_transit', label: 'In Transit' },
    { status: 'completed', label: 'Completed' },
    { status: 'failed', label: 'Failed' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          console.error('No token found');
          return;
        }

        const purchaseResponse = await axios.get(ViewSingleRequestProductDetails, {
          params: { request_code },
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (purchaseResponse.data.results?.products?.length > 0) {
          const product = purchaseResponse.data.results.products[0];
          setPurchaseData(product);

          const currentStatus = product?.status;
          const currentStepIndex = statusSteps.findIndex(step => step?.status === currentStatus);
          setActiveStep(currentStepIndex >= 0 ? currentStepIndex : 0);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [request_code, token]);

  // const handleEditClick = (product) => {
  //   setEditedProduct(product);
  //   setOpenEditDialog(true);
  // };

  // const handleDeleteClick = async (productId) => {
  //   try {
  //     setLoading(true);
  //     await axios.delete(`https://apis.agrisarathi.com/fposupplier/DeleteProduct/${productId}`, {
  //       headers: { 'Authorization': `Bearer ${token}` }
  //     });
  //     setPurchaseData((prevData) => ({
  //       ...prevData,
  //       product_details: prevData.product_details.filter((product) => product.id !== productId)
  //     }));
  //     setLoading(false);
  //   } catch (error) {
  //     console.error('Error deleting product:', error);
  //     setLoading(false);
  //   }
  // };

  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      await axios.put(`https://apis.agrisarathi.com/fposupplier/UpdateProduct/${editedProduct.id}`, editedProduct, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setPurchaseData((prevData) => ({
        ...prevData,
        product_details: prevData.product_details.map((product) =>
          product.id === editedProduct.id ? editedProduct : product
        )
      }));
      setLoading(false);
      setOpenEditDialog(false);
    } catch (error) {
      console.error('Error saving product:', error);
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setOpenEditDialog(false);
  };

  const handleStatusUpdate = async (status) => {
    // Show SweetAlert2 confirmation
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to mark this request as "${status === 'quotation_approved' ? 'Quotation Approved' : 'Quotation Rejected'}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!'
    });

    if (result?.isConfirmed) {
      try {
        setLoading(true);
        const response = await axios.put(RequestPurchaseUpdate, {
          request_code,
          status
        }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        Swal.fire(
          'Updated!',
          `The status has been updated to "${status === 'quotation_approved' ? 'Quotation Approved' : 'Quotation Rejected'}".`,
          'success'
        );

        setPurchaseData((prevData) => ({
          ...prevData,
          status: status // Update the status in the local state
        }));

        setLoading(false);
      } catch (error) {
        console.error('Error updating status:', error);
        setLoading(false);
        Swal.fire(
          'Error!',
          'There was an error updating the status. Please try again.',
          'error'
        );
      }
    }
  };

  if (!purchaseData) {
    return <div className="text-center mt-20 text-xl">Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      <div className='md:my:0 my-10'>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ '& .MuiStepLabel-root .Mui-completed': { color: 'green' } }}>
          {statusSteps.map((step, index) => (
            <Step key={index}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>

      <div className='mt-16'>

        {/* Material React Table for Product Details */}
        <MaterialReactTable
          columns={[
            {
              header: 'SNo.',
              Cell: ({ row }) => row.index + 1,
              size: 50,
            },
            { accessorKey: 'product_name', header: 'Product Name', size: 50, },
            { accessorKey: 'brand', header: 'Brand', size: 50, },
            { accessorKey: 'quantity', header: 'Quantity', size: 50, },
            { accessorKey: 'category', header: 'Category', size: 50, },
            { accessorKey: 'variants', header: 'Variant', size: 50, },
            { accessorKey: 'available_quantity', header: 'Avalable Quantity', size: 50, },
            { accessorKey: 'total_price', header: 'Total Price', size: 50, },

          ]}
          data={purchaseData?.product_details || []}
          enableColumnFilters={true}
          enablePagination={true}
          enableSorting={false}
        />

      </div>

      <Box display="flex" justifyContent="center" gap={4} marginTop={4}>
        <Button
          variant="contained"
          color="success"
          onClick={() => handleStatusUpdate('quotation_approved')}
          disabled={loading || purchaseData?.status !== 'quotation_sent'} 
        >
          Quotation Approve
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => handleStatusUpdate('quotation_rejected')}
          disabled={loading || purchaseData?.status !== 'quotation_sent'} 
        >
          Quotation Reject
        </Button>
      </Box>


      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={handleDialogClose}>
        <DialogTitle className='bg-[#00B251] text-white'>Edit Product</DialogTitle>
        <DialogContent className='mt-4'>
          <TextField
            label="Product Name"
            fullWidth
            value={editedProduct?.product_name || ''}
            onChange={(e) => setEditedProduct({ ...editedProduct, product_name: e.target.value })}
            margin="dense"
          />
          <TextField
            label="Brand"
            fullWidth
            value={editedProduct?.brand || ''}
            onChange={(e) => setEditedProduct({ ...editedProduct, brand: e.target.value })}
            margin="dense"
          />
          <TextField
            label="Quantity"
            fullWidth
            value={editedProduct?.quantity || ''}
            onChange={(e) => setEditedProduct({ ...editedProduct, quantity: e.target.value })}
            margin="dense"
            type="number"
          />
          <TextField
            label="Category"
            fullWidth
            value={editedProduct?.category || ''}
            onChange={(e) => setEditedProduct({ ...editedProduct, category: e.target.value })}
            margin="dense"
          />
          <TextField
            label="Variant"
            fullWidth
            value={editedProduct?.variants || ''}
            onChange={(e) => setEditedProduct({ ...editedProduct, variants: e.target.value })}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} color="primary" disabled={loading}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SinglePurchase;
