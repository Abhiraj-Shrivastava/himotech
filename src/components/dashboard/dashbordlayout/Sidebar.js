import { useState } from "react";

const Sidebar = () => {
  const [active, setActive] = useState("Dashboard");

  const menuItems = [
    "Dashboard",
    "Members",
    "Subscription",
    "Purchase",
    "Sales",
    "Inventory",
    "Analytics",
    "Orders",
  ];

  return (
    <div className="w-64 h-screen bg-green-600 text-white pl-5 py-5  flex flex-col">
      {/* Profile Section */}
      <div className="flex items-center mb-5">
        <img
          src="https://via.placeholder.com/40"
          alt="Profile"
          className="w-10 h-10 rounded-full border-2 border-white mr-3"
        />
        <span className="text-lg font-bold">Hi, Sania</span>
      </div>

      {/* Menu */}
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li
            key={item}
            onClick={() => setActive(item)}
            className={`relative min-w-full px-5 py-3 cursor-pointer rounded-lg transition-all ${
              active === item
                ? "bg-white text-green-600 font-bold rounded-l-full -rounded-tr-full "
                : "hover:bg-green-700 "
            }`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;