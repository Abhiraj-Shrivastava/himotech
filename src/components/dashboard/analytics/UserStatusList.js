import React from 'react';

const UserStatusList = () => {
  const users = [
    { name: 'Abhiraj', active: true },
    { name: 'Amanpreet', active: true },
    { name: 'Sushil', active: false },
    { name: 'Rahul', active: true },
    
  ];

  return (
    <div className="md:max-h-72 rounded-xl shadow-md p-4 bg-white">
      <h2 className="text-xl font-bold mb-4">Users</h2>
      
      <ul className="p-0 m-0 list-none">
        {users.map((user, index) => (
          <li key={index} className="py-2 flex items-center">
            <div className="mr-4">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">
                {/* Simple SVG person icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            </div>
            <span className="flex-grow">{user.name}</span>
            <div 
              className="w-4 h-4 rounded-full"
              style={{ 
                backgroundColor: user.active ? '#2ecc71' : '#e74c3c'
              }}
            />
          </li>
        ))}
      </ul>
      
      <div className="mt-4 flex  gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500" />
          <span>Active Users</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500" />
          <span>Inactive Users</span>
        </div>
      </div>
    </div>
  );
};

export default UserStatusList;