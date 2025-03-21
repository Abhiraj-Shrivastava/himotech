import React from 'react';
// import { Crown } from 'lucide-react';

const FranchiseSubscription = () => {
  return (
    <div className="w-full mx-auto p-8 shadow-none flex flex-col items-center relative">
      <div className="text-center space-y-6 justify-center items-center top-1/2">
        <h1 className="text-2xl mt-24 font-semibold text-gray-800">Franchise</h1>

        <div className="flex items-center justify-center ">
          <h2 className="text-lg font-medium">Choose Your Plan Today! </h2>
          <span className="text-3xl -mt-3">👑</span>
          {/* <Crown className="w-6 h-6 text-orange-400" /> */}
        </div>

       

        <ul className="text-left mx-auto max-w-md">
          <li className="flex items-start gap-2">
            <span className="text-gray-700">•</span>
            <span>Try all premium features free for 7 days!</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-700">•</span>
            <span>
              Get <span className="text-[#00B251]">20%</span> off on annual subscriptions –
              <span className="text-red-500 ml-1">Limited Time Offer!</span>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-700">•</span>
            <span>
              Earn credits by referring other FPOs to 
              <span className="font-medium">AgriSarthi</span>
            </span>
          </li>
        </ul>
       
        <button className="bg-[#00B251] hover:bg-[#00B251] h-8 text-white font-medium  px-6 rounded-md transition-colors">
          Subscribe Now
        </button>
      </div>

    </div>
  );
};

export default FranchiseSubscription;
