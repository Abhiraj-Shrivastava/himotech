import { Button, Paper, TableContainer, TablePagination, Typography } from '@mui/material';
import axios from 'axios';
import { MaterialReactTable } from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { ViewPurchaseOrders } from '../../Api_url';
import img from '../../../assets/Group 100.png'

const OrdersHome = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderData, setOrderData] = useState([]);

  const paginatedData = orderData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const totalCount = orderData?.length;

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event?.target?.value, 10));
    setPage(0);
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      const response = await axios.get(ViewPurchaseOrders, {

        headers: { 'Authorization': `Bearer ${token}` },
      });
      setOrderData(response?.data?.results?.products);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = useMemo(() => {
    const baseColumns = [
      { header: 'SNo.', accessorFn: (row, index) => index + 1, size: 50 },
      { header: 'Order code', accessorKey: 'order_code', size: 50 },
      { header: 'Request Id', accessorKey: 'request_id', size: 50 },
      { header: 'Vendor', accessorKey: 'vendor_name', size: 50 },
      { header: 'Status', accessorKey: 'status', size: 50 },
      {
        header: 'PDF',
        id: 'quotation',
        Cell: ({ row }) => (
            row?.original?.file ? (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        const fileUrl = row?.original?.file; // Get the file path

                        if (fileUrl) {
                            // If the file link is relative, prepend the base URL
                            const pdfUrl = fileUrl.startsWith("http")
                                ? fileUrl // If it's already an absolute URL, use it as is
                                : `https://apis.agrisarathi.com${fileUrl}`; // Prepend base URL if relative

                            window.open(pdfUrl, "_blank"); // Open the PDF in a new tab
                        } else {
                            alert("No PDF Available"); // Show alert if no PDF link
                        }
                    }}
                >
                    View pdf
                </Button>
            ) : (
                // If there's no file (null), return null (don't show the button)
                null
            )
        ),
        size: 180,
    }    ];

    return baseColumns;
  }, []);


  return (
    <>
      <Typography variant="h4" gutterBottom>Purchase Order Information</Typography>
      {paginatedData.length === 0 ?
        <div className="flex flex-col items-center mt-28">
          {/* Image when no data is available */}
          <img src={img} alt="No data" className="mb-4" />

        </div> :
        <div style={{maxWidth: '100%', overflowY: 'auto', padding: 10 }}>
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
    </>
  )
}

export default OrdersHome