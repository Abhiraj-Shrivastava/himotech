import React from 'react'
import { useNavigate } from 'react-router';

const WelcomeScreen = () => {
  const navigate = useNavigate();
  return (
    <div
      className="h-screen w-full flex flex-col items-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://apis.agrisarathi.com/media/background%201.gif')" }}
    >
      <h1 className="md:text-6xl text-4xl mt-32  font-bold text-black">Welcome User!</h1>
      <button onClick={()=> navigate("/home")} className="mt-4 px-16 py-2 bg-[#00B251] text-white rounded-lg shadow-md hover:bg-[#00B251] transition">
        Let's Start
      </button>
    </div>
  )
}

export default WelcomeScreen;