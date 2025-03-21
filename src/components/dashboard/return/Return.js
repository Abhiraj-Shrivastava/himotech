import { Paper, TableContainer, TablePagination, Typography } from '@mui/material';
import axios from 'axios';
import { MaterialReactTable } from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { CreateGetOrderReturnsInReturn } from '../../Api_url';
import img from '../../../assets/Group 100.png'

const Return = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [returnData, setReturnData] = useState([]);

    const paginatedData = returnData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const totalCount = returnData?.length;

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event?.target?.value, 10));
        setPage(0);
    };

    const fetchData = async () => {
        try {
          const token = localStorage.getItem('access_token');
          if (!token) return;
          const response = await axios.get(CreateGetOrderReturnsInReturn, {
            
            headers: { 'Authorization': `Bearer ${token}` },
          });
          setReturnData(response?.data?.return_requests);
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
            { header: 'Request ID', accessorKey: 'req_id', size: 50 },
            { header: 'Product Name', accessorKey: 'product_name', size: 50 },
            { header: 'Variant', accessorKey: 'variant_name', size: 50 },
            { header: 'Quantity', accessorKey: 'quantity', size: 50 },
            { header: 'Reason', accessorKey: 'reason', size: 50 },
            { header: 'Status', accessorKey: 'status', size: 50 },
           
        ];

        return baseColumns;
    }, []);

    return (
        <>
            <Typography variant="h4" gutterBottom>Return Information</Typography>
            {paginatedData.length === 0 ?
             <div className="flex flex-col items-center mt-28">
             {/* Image when no data is available */}
             <img src={img} alt="No data" className="mb-4" />
   
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
        </>
    )
}

export default Return