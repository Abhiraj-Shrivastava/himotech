import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import axios from 'axios';

const firebaseConfig = {
    apiKey: "AIzaSyBC7_FpsKiOJghwIG0ZTLp_Hq6noyipvwE",
    authDomain: "agrisarathi-64d6e.firebaseapp.com",
    projectId: "agrisarathi-64d6e",
    storageBucket: "agrisarathi-64d6e.appspot.com",
    messagingSenderId: "86902628258",
    appId: "1:86902628258:web:943ea6b615e33326d99cfb",
    measurementId: "G-ZPGQKC678Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// Corrected export name to match "genrateToken"
export const generateToken = async () => {
    const permission = await Notification.requestPermission();
    // console.log(permission);

    if (permission === 'granted') {
        const firebaseToken = await getToken(messaging, {
            vapidKey: "BKlRDBePIhYC_RxDxMXEaoX2W_tzSNEqgHRyik6MAPtTk4iZbKjE-TocqwzFE5fLHnankFP4QSp4iia_h4iBSI0"
        });
        // console.log("Firebase Token: ", firebaseToken);

        if (firebaseToken) {
            const accessToken = localStorage.getItem("access_token");

            if (!accessToken) {
                // console.log("Access token not found!");
                return;
            }

            try {
                const response = await axios.post(
                    "https://apis.agrisarathi.com/fposupplier/FCMTokenView",
                    { fcm_token: firebaseToken },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json"
                        }
                    }
                    
                    
                );
                // console.log("API Response: ", response.data);
            } catch (error) {
                // console.error("Error sending Firebase token to API:", error);
            }
        }
    }
};
