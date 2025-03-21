import axios from "axios";
import { useNavigate } from "react-router";

 const BASE_URL = "http://64.227.166.238:8090/employer/";
 const MEDIA_URL = "https://apis.agrisarathi.com/";


export const EmployerRegistration = `${BASE_URL}EmployerRegistration`;
export const EmployerLogin = `${BASE_URL}EmployerLogin`;
export const AddEmployeeByEmployerView = `${BASE_URL}AddEmployeeByEmployerView`;
export const BulkEmployeeAdd = `${BASE_URL}BulkEmployeeAdd`;
export const GetHomeScreenKPI = `${BASE_URL}GetHomeScreenKPI`;



export const PasswordResetRequestAPIView = `${BASE_URL}PasswordResetRequestAPIView`;
export const UserLogin = `${BASE_URL}UserLogin`;
export const PasswordResetAPIView = `${BASE_URL}PasswordResetAPIView`;
export const UserProfileView = `${BASE_URL}UserProfileView`;
export const TotalNoOfFarmersbyFPO = `${BASE_URL}TotalNoOfFarmersbyFPO`;
export const UpdateProfile = `${BASE_URL}UpdateProfile`;
export const UpdateProfilePicture = `${BASE_URL}UpdateProfilePicture`;
export const AddShopbyFPOSupplier = `${BASE_URL}AddShopbyFPOSupplier`;
export const FarmerByFPO = `${BASE_URL}FarmerByFPO`;
export const GetSingleFarmerDetailsbyFPO = `${BASE_URL}GetSingleFarmerDetailsbyFPO`;
export const GetAllVendors = `${BASE_URL}GetAllVendors`;
export const RequestPurchasetoVendor = `${BASE_URL}RequestPurchasetoVendor`;
export const ViewSingleRequestProductDetails = `${BASE_URL}ViewSingleRequestProductDetails`;
export const RequestPurchaseUpdate = `${BASE_URL}RequestPurchaseUpdate`;
export const GetallData = `${BASE_URL}GetallData`;
export const AddInventoryToOffline = `${BASE_URL}AddInventoryToOffline`;
export const GetDelUpdateInventory = `${BASE_URL}GetDelUpdateInventory`;
export const CreateGetOrderReturns = `${BASE_URL}GetDelUpdateInventory`;
export const AddInventoryToMarketplace = `${BASE_URL}AddInventoryToMarketplace`;
export const CreateGetOrderReturnsInReturn = `${BASE_URL}CreateGetOrderReturns`;
export const CheckCustomerisFarmerornot = `${BASE_URL}CheckCustomerisFarmerornot`;
export const ViewPurchaseOrders = `${BASE_URL}ViewPurchaseOrders`;
export const AddGetSalesbyFPO = `${BASE_URL}AddGetSalesbyFPO`;
export const GetInventoryVariantBrands = `${BASE_URL}GetInventoryVariantBrands`;
export const GetInventoryProductsName = `${BASE_URL}GetInventoryProductsName`;
export const FPOProfileCompletionView = `${BASE_URL}FPOProfileCompletionView`;
export const GetKPIS = `${BASE_URL}GetKPIS`;
export const RecentOrder = `${BASE_URL}RecentOrders`;
export const InventoryStockStatus = `${BASE_URL}InventoryStockStatus`;
export const GetGraphs = `${BASE_URL}GetGraphs`;
export const RegisterSubordinates = `${BASE_URL}RegisterSubordinates`;
export const GenerateInvoice = `${BASE_URL}GenerateInvoice`;
export const UpdateShopPicture = `${BASE_URL}UpdateShopPicture`;

export const mediaUrl = `${MEDIA_URL}`


export const useApis = () => {
    
    const navigate = useNavigate()

    const postJson = async (url, data) => {
        const accessToken = localStorage.getItem('access_token');

        if (!accessToken) {
            navigate('/login'); // Navigate if there's no token
            return;
        }

        try {
            const res = await axios.post(`${BASE_URL}${url}`, data, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            return res; // Return the response if needed
        } catch (error) {
            if (error.response && error.response.data?.code === 'token_not_valid') {
                // Navigate to  if token is invalid or expired
                localStorage.clear()
                navigate('/login');

            } else {
                // Handle other errors (e.g., network issues, server errors)
                console.error('API error:', error);
                throw error;
            }
        }
    };

    const putJson = async (url, data) => {
        const accessToken = localStorage.getItem('access_token');

        if (!accessToken) {
            navigate('/login'); // Navigate if there's no token
            return;
        }

        try {
            const res = await axios.put(`${BASE_URL}${url}`, data, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            
            return res; // Return the response if needed
        } catch (error) {
            if (error.response && error.response.data?.code === 'token_not_valid') {
                // Navigate to  if token is invalid or expired
                localStorage.clear()
                navigate('/login');
            } else {
                // Handle other errors (e.g., network issues, server errors)
                console.error('API error:', error);
                throw error;
            }
        }
    };

    const postFormData = async (url, data) => {
        const accessToken = localStorage.getItem('access_token');

        if (!accessToken) {
            navigate('/login'); // Navigate if there's no token
            return;
        }

        try {
            const res = await axios.post(`${BASE_URL}${url}`, data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "multipart/form-data", // Set the content type for file upload
                  },
            });

            return res; // Return the response if needed
        } catch (error) {
            if (error.response && error.response.data?.code === 'token_not_valid') {
                // Navigate to  if token is invalid or expired
                localStorage.clear()
                navigate('/login');
            } else {
                // Handle other errors (e.g., network issues, server errors)
                console.error('API error:', error);
                throw error;
            }
        }
    };

    const putFormData = async (url, data) => {
        const accessToken = localStorage.getItem('access_token');

        if (!accessToken) {
            navigate('/login'); // Navigate if there's no token
            return;
        }

        try {
            const res = await axios.put(`${BASE_URL}${url}`, data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "multipart/form-data", // Set the content type for file upload
                  },
            });
            
            return res; // Return the response if needed
        } catch (error) {
            if (error.response && error.response.data?.code === 'token_not_valid') {
                // Navigate to  if token is invalid or expired
                localStorage.clear()
                navigate('/login');
            } else {
                // Handle other errors (e.g., network issues, server errors)
                console.error('API error:', error);
                throw error;
            }
        }
    };

    const getJson = async (url, params) => {
        const accessToken = localStorage.getItem('access_token');

        if (!accessToken) {
            navigate('/login'); // Navigate if there's no token
            return;
        }

        try {
            const res = await axios.get(`${BASE_URL}${url}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                params
            });
            
            return res; // Return the response if needed
        } catch (error) {
            if (error.response && error.response.data?.code === 'token_not_valid') {
                // Navigate to  if token is invalid or expired
                localStorage.clear()
                navigate('/login');
            } else {
                // Handle other errors (e.g., network issues, server errors)
                console.error('API error:', error);
                throw error;
            }
        }
    };


    return { postJson, putJson, postFormData, putFormData, getJson};
};


