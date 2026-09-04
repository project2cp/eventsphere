import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import logo from "../../assets/logo.png";

export const Footer = () => {
  return (
    <footer className="bg-[#1f1738]  text-white px-4 md:px-16 lg:px-28 py-12 border-t footer-bg">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Animated Logo Section */}
          <div className="flex items-center justify-center group">
            <div className="relative perspective-1000 mr-4">
              <img
                src={logo}
                alt="Event Sphere Logo"
                className="w-40 h-40 transition-transform duration-1000 
                         hover:rotate-y-180 hover:[transform-style:preserve-3d]
                         animate-spin-3d cursor-pointer -pl-20 "
              />
            </div>
            
          </div>

          {/* Quick Links Columns */}
          <div className="text-center md:text-left">
            <h2 className="text-lg font-bold mb-4">Quick links</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Home</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">About</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Gallery</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Contact</a></li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-lg font-bold mb-4">Others</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Sign in</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Sign up</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Host Event</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Contact</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="text-center md:text-left">
            <h2 className="text-lg font-bold mb-4">Stay Connected</h2>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FaFacebookF size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FaLinkedinIn size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8 pt-8 border-t border-gray-800">
          <p className="text-gray-400">&copy; 2024 Event Sphere. All rights reserved.</p>
        </div>
      </div>

     
    </footer>
  );
};