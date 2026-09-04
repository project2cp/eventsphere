import React from "react";
import { Navbar } from "../../components/layout/Navbar";
import { FaArrowLeft } from "react-icons/fa";
import videoBg from "../../assets/bg-vd1.mp4";

export const Logout = () => {
    return (
        <div className="h-screen flex items-center justify-center overflow-hidden login">
          

            {/* Glass Effect Card */}
            <div className="relative z-10 w-full h-fit max-w-md bg-[rgba(93,51,139,0.2)] rounded-2xl backdrop-blur-lg border border-[rgba(255,255,255,0.1)] shadow-2xl p-8 mx-4 my-10">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">You’ve logged out </h1>
                    <p className="text-gray-300 text-lg">Sign in to continue</p>
                </div>

                <div className="space-y-6">
                    {/* Login Button */}
                    <a 
                        href="/login" // Replace with your login route
                        className="w-full flex items-center justify-center py-3 rounded-lg font-semibold transition-colors bg-purple-600 text-white hover:bg-purple-700 space-x-2"
                    >
                        <FaArrowLeft className="text-lg" />

                        <span>Sign In Again</span>
                    </a>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-500"></div>
                        </div>
                    </div>

                    {/* Additional Text */}
                    <p className="text-center text-gray-400 text-sm">
                        Need help?{" "}
                        <a href="#" className="text-purple-300 hover:text-purple-200">
                            Contact support
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};