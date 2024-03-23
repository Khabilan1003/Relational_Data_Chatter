import { useEffect, useState, useRef, useContext } from "react";
import { MdOutlineExpandMore } from "react-icons/md";
import { UserContext } from "../provider/user_provider";

export const ProfileDropdown = () => {
  // State Variable to handle open and close the dropdown
  const [isOpen, setIsOpen] = useState(false);
  const toggleProfileMenu = () => {
    setIsOpen((prev) => !prev);
  };
  

  // Getting Data from useContext to display username and to use logout
  const { user, logout } = useContext(UserContext);  
  

  // Dropdown Effect Code
  const dropdownRef = useRef(null);
  const closeDropdown = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", closeDropdown);
    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  });


  return (
    <div className="relative group cursor-pointer" ref={dropdownRef}>
      
      {/* Profile Button */}
      <div
        className="inline-flex justify-center items-center"
        onClick={toggleProfileMenu}
      >
        {/* Circle Avatar */}
        <div className="w-10 h-10 bg-gray-100 rounded-full inline-flex items-center justify-center">
          <span className="font-medium text-gray-600 group-hover:text-gray-700">
            {String(user["email"]).split("@")[0].toUpperCase().substring(0, 1)}
          </span>
        </div>
        
        {/* Username extracted from email */}
        <span className="ml-2 font-semibold hidden md:block">
          {String(user["email"]).split("@")[0].toUpperCase().substring(0, 1) +
            String(user["email"]).split("@")[0].toLowerCase().substring(1)}
        </span>

        <MdOutlineExpandMore className="w-6 h-6 hidden md:block" />
      </div>


      {/* Dropdown Box */}
      <div
        id="dropdown"
        className={`${
          isOpen ? "block" : "hidden"
        } absolute top-0 right-0 mt-12 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-40`}
      >
        <ul
          className="py-2 text-sm text-gray-700"
          aria-labelledby="dropdownDefaultButton"
        >
          <li key="profile">
            <a href="#" className="block px-4 py-2 hover:bg-gray-100">
              Profile
            </a>
          </li>
          <li key="logout">
            <a className="block px-4 py-2 hover:bg-gray-100" onClick={logout}>
              Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};
