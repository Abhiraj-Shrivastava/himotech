import React from 'react'
import accoumentimg from '../../../assets/image 20 (1).png'

const Announcements = () => {
  return (
    <div className="mb-8 bg-white p-4 rounded-lg shadow md">
    {/* Announcements Header */}
    <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Announcements</h2>
        <button className="text-[#00B251] hover:underline text-sm">View all</button>
    </div>

    {/* Announcements List */}
    <div className="space-y-2">
        {[1, 2].map((item) => (
            <div
                key={item}
                className="flex items-center bg-white p-2 rounded-md shadow-sm border border-gray-200"
            >
                {/* Image */}
                <div className="w-26 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                        src={accoumentimg}
                        alt="Announcement"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Text Content */}
                <div className="ml-3">
                    <h3 className="font-medium text-sm text-gray-900">
                        Pradhan Mantri Fasal Bima Yojana...
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 leading-tight">
                        Aims to provide insurance and coverage support for many farmers...
                    </p>
                </div>
            </div>
        ))}
    </div>
</div>
  )
}

export default Announcements