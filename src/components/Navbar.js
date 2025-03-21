import * as React from 'react';
import logo from '../assets/agri.png';  
import { useNavigate } from 'react-router-dom';
import img from '../assets/Vector (1).png'
import axios from 'axios';
import { UserProfileView } from './Api_url'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import coin from '../assets/Coin (2).png'
function Navbar() {
  const [weather, setWeather] = React.useState({
    temp: null,
    icon: null,
    description: "",
    location: "",
  });

  const [language, setLanguage] = React.useState('en');
  const [companyLogo, setCompanyLogo] = React.useState(null); // State to store company logo

  const fetchCompanyLogo = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.get(UserProfileView, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      });

      const companyLogoUrl = response.data.data.profile.company_logo;
      if (companyLogoUrl) {
        setCompanyLogo(companyLogoUrl);  // Set the company logo if available
      }
    } catch (error) {
      console.error("Error fetching company logo:", error);
    }
  };

  const fetchWeather = async (lat, lon) => {
    const API_KEY = "4675f25ce2863825d057505230a4cca0";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.cod === 200) {
        setWeather({
          temp: Math.round(data.main.temp),
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
          description: data.weather[0].description,
          location: data.name,
        });
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  // Get user's location and fetch weather
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
    fetchCompanyLogo();
  }, []);

  const token = localStorage.getItem('access_token');
  const navigate = useNavigate();

  React.useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      navigate('/login');
    }
  }, [navigate]);

  // Function to toggle between English and Hindi
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };


  return (

    <div className=' bg-white w-["100%"] md:left-72 fixed top-0  right-0 ' style={{ zIndex: 9, }}>
      <div className="flex justify-between items-center mb-8 w-full ">
        <div className="flex items-center cursor-pointer" onClick={toggleLanguage}>

          <img
            src={language === 'en' ? img : img}
            alt={language === 'en' ? 'English' : 'Hindi'}
            className="w-6 h-6"
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="bg-gray-100 rounded-full px-4 py-1 flex items-center">
            <img className="w-5" src={coin} alt="" />
            <span className='ml-1'>0</span>
          </div>

          <div className="bg-[#E9E9E9] rounded-xl px-4 py-2 mt-2 inline-flex items-center gap-3 max-w-fit">
            <span className="font-semibold text-black">Weather</span>
            <div className="w-px h-10 bg-black" />
            {weather.temp !== null ? (
              <>
                <div className="flex items-center gap-2">
                  <img src={weather.icon} alt="Weather Icon" className="w-6 h-6" />
                  <span className="font-semibold text-gray-800">{weather?.temp}°C</span>
                  <span className="text-sm text-gray-500">{weather?.location}</span>
                </div>
              </>
            ) : (
              <span className="text-gray-600">Loading...</span>
            )}
          </div>

          <div className="relative">
            <NotificationsNoneIcon className="h-6 w-6" style={{color:'#00B251'}}/>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              2
            </span>
          </div>
          <div className="w-px h-14 bg-black" />
          <div>
            <img
              src={companyLogo || logo}
              alt="AgriSarathi"
              style={{ width: '160px', height: '70px', objectFit: 'contain', paddingTop: 2, paddingRight: 4 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
