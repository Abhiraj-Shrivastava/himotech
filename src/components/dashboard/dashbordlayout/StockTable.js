// import React from "react";
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

// const StockTable = () => {
//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-bold text-green-700">Our Stock</h2>
//       <div className="flex justify-between mt-4 gap-4">
//         {/* In Stock Section */}
//         <div className="w-1/2 border rounded-lg shadow-md">
//           <div className="p-4 border-b bg-gray-50">
//             <h3 className="text-lg font-semibold text-gray-700">In Stock</h3>
//           </div>
//           <TableContainer component={Paper} className="rounded-b-lg">
//             <Table size="small">
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Company</TableCell>
//                   <TableCell>Price</TableCell>
//                   <TableCell>Delivery</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {/* Add rows dynamically here */}
//               </TableBody>
//             </Table>
//           </TableContainer>
//           <div className="flex justify-between items-center p-4 bg-blue-100">
//             <div className="flex items-center space-x-2">
//               <span className="text-blue-500 material-icons">inventory</span>
//               <span className="text-sm font-medium">Total Stock In</span>
//             </div>
//             <span className="font-bold text-gray-700">10294</span>
//           </div>
//         </div>

//         {/* Out Stock Section */}
//         <div className="w-1/2 border rounded-lg shadow-md">
//           <div className="p-4 border-b bg-gray-50">
//             <h3 className="text-lg font-semibold text-gray-700">Out Stock</h3>
//           </div>
//           <TableContainer component={Paper} className="rounded-b-lg">
//             <Table size="small">
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Company</TableCell>
//                   <TableCell>Delivery</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {/* Dynamic rows for Out Stock */}
//                 {[...Array(5)].map((_, index) => (
//                   <TableRow key={index}>
//                     <TableCell>Item Name</TableCell>
//                     <TableCell>02/07/2024</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//           <div className="flex justify-between items-center p-4 bg-orange-100">
//             <div className="flex items-center space-x-2">
//               <span className="text-orange-500 material-icons">inventory</span>
//               <span className="text-sm font-medium">Total Stock Out</span>
//             </div>
//             <span className="font-bold text-gray-700">10294</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StockTable;
