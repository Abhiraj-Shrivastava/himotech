import React, { useEffect } from 'react'
import { useNavigate } from 'react-router';

const Loader = () => {
    const navigate = useNavigate();

    useEffect(() => {
      // Set timeout based on GIF duration (example: 3 seconds)
      const timer = setTimeout(() => {
        navigate("/agriconnect"); // Redirect after GIF plays
      }, 7000);
  
      return () => clearTimeout(timer); // Cleanup timeout
    }, [navigate]);
    return (
        <div className="flex justify-center items-center h-screen">
          <img src="https://apis.agrisarathi.com/media/frontlogo.gif" alt="Loading..." className='h-full w-full' />
        </div>
      );
}

export default Loader
