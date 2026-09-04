import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import logo from "../../assets/logo.png";

export const Navbar = ({ navItems = [] }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetch("/api/profile", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          const user = data.user || data;
          setUserData(user);
          setIsLoggedIn(true);
        })
        .catch(console.error);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserData(null);
    navigate("/login");
  };

  const defaultItems = [
    { text: "Home", href: "/", className: "underline-effect" },
    { text: "Explore", href: "/explore", className: "underline-effect" }, // Fixed typo
    { text: "Host Event", href: "/create-event", className: "underline-effect" },
    // Conditionally add Dashboard for organizers
    ...(userData?.is_organizer ? [
      { text: "Dashboard", href: "/dashboard", className: "underline-effect" }
    ] : []),
    // Conditionally add My Tickets for logged-in users
    ...(isLoggedIn ? [
      { text: "My Tickets", href: "/my-tickets", className: "underline-effect" }
    ] : [])
  ];

  const authItems = isLoggedIn
    ? [
        {
          element: (
            <li className="flex items-center gap-2">
              <div 
                className="w-9 h-9 rounded-full bg-purple-500 cursor-pointer 
                         flex items-center justify-center overflow-hidden border-1 border-white"
                onClick={() => navigate("/profile")}
              >
                {userData?.profile_photo ? (
                  <img 
                    src={`${import.meta.env.VITE_API_BASE_URL || ''}/storage/${userData.profile_photo}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-medium">
                    {userData?.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <button 
                onClick={handleLogout}
                className="btn-effect hover:text-[var(--primary-purple)]"
                title="Logout"
              >
                <FiLogOut className="w-5 h-5" />
              </button>
            </li>
          )
        }
      ]
    : [
        { text: "Login", href: "/login", className: "btn-effect" },
        { text: "Sign up", href: "/signup", className: "btn-effect" }
      ];

  return (
    <nav className="fixed top-0 left-0 w-full text-white px-6 py-2
                    mx-auto shadow-lg bg-opacity-80 backdrop-filter 
                    backdrop-blur-3xl z-50 border-b border-gray-300">
      <div className="flex justify-between mx-auto items-center">
        <div className="flex items-center gap-2">
          <div className="border-l-2 border-white h-11 mx-2 pl-3 -ml-0.5">
            <p>EVENT <br/> SPHERE</p>
          </div>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img src={logo} alt="logo" className="h-11" />
        </div>

        <ul className="flex items-center space-x-5 pr-4">
          {defaultItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.href}
                className={({ isActive }) => 
                  `${item.className} ${isActive ? "text-purple-300 font-medium" : ""}`
                }
              >
                {item.text}
              </NavLink>
            </li>
          ))}
          {navItems.map((item, index) => (
            <li key={`nav-${index}`}>
              <NavLink
                to={item.href}
                className={({ isActive }) => 
                  `${item.className} ${isActive ? "text-purple-300 font-medium" : ""}`
                }
              >
                {item.text}
              </NavLink>
            </li>
          ))}
          {authItems.map((item, index) => (
            <React.Fragment key={`auth-${index}`}>
              {item.element || (
                <li>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) => 
                      `${item.className} ${isActive ? "text-purple-300 font-medium" : ""}`
                    }
                  >
                    {item.text}
                  </NavLink>
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>
      </div>
    </nav>
  );
};