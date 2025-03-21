import React from 'react';
import background from '../../assets/unsplash_caiX9QloFc8.png';
import background1 from '../../assets/unsplash_npxXWgQ33ZQ.png';
import background2 from '../../assets/unsplash_n95VMLxqM2I.png';
import background3 from '../../assets/unsplash_Ebb8fe-NZtM.png';

const AgricultureFeatures = () => {
  const features = [
    {
      title: "Seamless Aggregation & Digitization",
      image: background1,
      alt: "Person typing on laptop"
    },
    {
      title: "Enhanced Market Access & Traceability",
      image: background2,
      alt: "Business handshake"
    },
    {
      title: "Real-Time Insights for Informed Decisions",
      image: background3,
      alt: "Mobile phone with analytics"
    }
  ];

  return (
    <div className="relative w-full">
      {/* Hero Background Image */}
      <div className="relative w-full h-96">
        <img 
          src={background}
          alt="Tractor in field"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Green Overlay Section */}
      <div className="bg-[#1F4E3C] w-full py-24 ">
        <div className="container px-4 md:absolute md:bottom-0 md:left-0 min-w-full">
          <div className="flex flex-col md:flex-row justify-evenly items-center">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                {/* Circular Image Container */}
                <div className=" rounded-full overflow-hidden mb-4 p-2 border-2 border-white">
                  <img
                    src={feature.image}
                    alt={feature.alt}
                    className="w-44 object-cover rounded-full"
                  />
                </div>
                {/* Feature Title */}
                <h3 className="text-white text-lg md:mb-16 mb-6">
                  {feature.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgricultureFeatures;