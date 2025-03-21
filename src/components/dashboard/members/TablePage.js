// TablePage.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MaterialReactTable } from 'material-react-table';
import { IconButton, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const TablePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { view, data } = location.state || {}; // Get the state passed through navigation

    // Prepare columns based on the `view`
    const columns = view === 'lands'
        ? [
            {
                header: 'S.No',
                id: 'serial',
                accessorKey: 'id',
                Cell: ({ row }) => row.index + 1,
                size: 50,
            },
            { header: 'Area', accessorKey: 'land_area' },
            { header: 'Crop', accessorKey: 'crop' },
            { header: 'State', accessorKey: 'state' },
            { header: 'District', accessorKey: 'district' },
            { header: 'Variety', accessorKey: 'variety' },
            { header: 'Sowing date', accessorKey: 'sowing_date' },
        ]
        : view === 'posts'
            ? [
                {
                    header: 'S.No',
                    id: 'serial',
                    accessorKey: 'id',
                    Cell: ({ row }) => row.index + 1,
                    size: 50,
                },
                { header: 'Description', accessorKey: 'description' },
                { header: 'Created at', accessorKey: 'created_at' },
                { header: 'Updated at', accessorKey: 'updated_at' },
            ]
            : [
                {
                    header: 'S.No',
                    id: 'serial',
                    accessorKey: 'id',
                    Cell: ({ row }) => row.index + 1,
                    size: 50,
                },
                { header: 'Disease Name', accessorKey: 'disease_name' },
                { header: 'Detected Date', accessorKey: 'created_at' },
                { header: 'Crop', accessorKey: 'crop' },
                {
                    header: 'Image',
                    accessorKey: 'uploaded_image',
                    Cell: ({ cell }) => {
                        const imageUrl = `https://apis.agrisarathi.com${cell.getValue()}`;
                        return <img src={imageUrl} alt="uploaded" style={{ width: 50, height: 50, objectFit: 'cover' }} />;
                    },
                },
            ];

    if (!view || !data) {
        return <div>No data available</div>;
    }

    // Handle back button click
    const handleBackClick = () => {
        navigate(-1); // This will go back to the previous page
    };

    return (
        <>
            <div className="flex gap-2 mb-10 ">

                {/* Back Button */}
                <IconButton onClick={handleBackClick} className="">
                    <ArrowBack />
                </IconButton>


                <Typography style={{ fontSize: 26 }} className="text-center">{view} data</Typography>
            </div>
            <div className='relative' style={{ maxWidth: '100%', overflowY: 'auto', padding: 10 }}>
                <MaterialReactTable columns={columns} data={data}
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
            </div>

        </>
    );
};

export default TablePage;
