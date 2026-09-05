import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import logo from "../../assets/logo.png";

export const Navbar = ({ navItems = [] }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const defaultItems = [
    { text: "Home", href: "/", className: "underline-effect" },
    { text: "Explore", href: "/explore", className: "underline-effect" },
    { text: "Host Event", href: "/create-event", className: "underline-effect" },
    ...(userData?.is_organizer ? [
      { text: "Dashboard", href: "/dashboard", className: "underline-effect" }
    ] : []),
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
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-purple-500 cursor-pointer 
                         flex items-center justify-center overflow-hidden border-1 border-white"
                onClick={() => { navigate("/profile"); closeMobileMenu(); }}
              >
                {userData?.profile_photo ? (
                  <img 
                    src={`${import.meta.env.VITE_API_BASE_URL || ''}/storage/${userData.profile_photo}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-medium text-sm sm:text-base">
                    {userData?.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <button 
                onClick={handleLogout}
                className="btn-effect hover:text-[var(--primary-purple)]"
                title="Logout"
              >
                <FiLogOut className="w-4 h-4 sm:w-5 sm:h-5" />
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
    <>
      <nav className="fixed top-0 left-0 w-full text-white px-3 sm:px-6 py-2
                      mx-auto shadow-lg bg-opacity-80 backdrop-filter 
                      backdrop-blur-3xl z-50 border-b border-gray-300">
        <div className="flex justify-between items-center">
          {/* Left: Brand Name (hidden on mobile) */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="border-l-2 border-white h-11 mx-2 pl-3 -ml-0.5">
              <p className="text-xs sm:text-sm">EVENT <br/> SPHERE</p>
            </div>
          </div>

          {/* Center: Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <img src={logo} alt="logo" className="h-9 sm:h-11" />
          </div>

          {/* Right: Desktop Menu (hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-5 pr-4">
            {defaultItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.href}
                className={({ isActive }) => 
                  `${item.className} ${isActive ? "text-purple-300 font-medium" : ""} text-sm lg:text-base`
                }
              >
                {item.text}
              </NavLink>
            ))}
            {navItems.map((item, index) => (
              <NavLink
                key={`nav-${index}`}
                to={item.href}
                className={({ isActive }) => 
                  `${item.className} ${isActive ? "text-purple-300 font-medium" : ""} text-sm lg:text-base`
                }
              >
                {item.text}
              </NavLink>
            ))}
            {authItems.map((item, index) => (
              <React.Fragment key={`auth-${index}`}>
                {item.element || (
                  <NavLink
                    to={item.href}
                    className={({ isActive }) => 
                      `${item.className} ${isActive ? "text-purple-300 font-medium" : ""} text-sm lg:text-base`
                    }
                  >
                    {item.text}
                  </NavLink>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile Menu Toggle (visible only on mobile) */}
          <div className="flex md:hidden items-center gap-3">
            {/* Show profile/avatar on mobile if logged in */}
            {isLoggedIn && userData && (
              <div 
                className="w-8 h-8 rounded-full bg-purple-500 cursor-pointer 
                          flex items-center justify-center overflow-hidden border-1 border-white"
                onClick={() => { navigate("/profile"); closeMobileMenu(); }}
              >
                {userData?.profile_photo ? (
                  <img 
                    src={`${import.meta.env.VITE_API_BASE_URL || ''}/storage/${userData.profile_photo}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-medium text-sm">
                    {userData?.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>
            )}
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-white hover:text-purple-300 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-72 bg-[var(--bg-purple)] z-50 shadow-2xl 
                   transform transition-transform duration-300 ease-in-out md:hidden
                   ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full pt-16 pb-6 px-6">
          {/* Close button */}
          <button
            onClick={closeMobileMenu}
            className="absolute top-4 right-4 text-white hover:text-purple-300 transition-colors"
            aria-label="Close menu"
          >
            <FiX className="w-6 h-6" />
          </button>

          {/* Mobile Menu Items */}
          <div className="flex flex-col space-y-4 mt-4">
            {defaultItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.href}
                onClick={closeMobileMenu}
                className={({ isActive }) => 
                  `text-white hover:text-purple-300 transition-colors text-lg
                  ${isActive ? "text-purple-300 font-medium" : ""}`
                }
              >
                {item.text}
              </NavLink>
            ))}
            {navItems.map((item, index) => (
              <NavLink
                key={`nav-${index}`}
                to={item.href}
                onClick={closeMobileMenu}
                className={({ isActive }) => 
                  `text-white hover:text-purple-300 transition-colors text-lg
                  ${isActive ? "text-purple-300 font-medium" : ""}`
                }
              >
                {item.text}
              </NavLink>
            ))}
          </div>

          <div className="border-t border-white/20 my-6 pt-6">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 text-white hover:text-purple-300 transition-colors text-lg"
              >
                <FiLogOut className="w-5 h-5" />
                Logout
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <NavLink
                  to="/login"
                  onClick={closeMobileMenu}
                  className="w-full text-center text-white hover:text-purple-300 transition-colors text-lg"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  onClick={closeMobileMenu}
                  className="w-full text-center bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors text-lg"
                >
                  Sign up
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};