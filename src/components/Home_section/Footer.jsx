import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";

export const Footer = () => {
    return (
        <footer className="footer-bg text-white py-8 sm:py-12 md:py-16">
            <div className="container mx-auto px-4 sm:px-6 md:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    {/* Logo & About */}
                    <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                        <h2 className="text-2xl font-bold mb-4">EVENT SPHERE</h2>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Discover, Connect, and Participate in the Best Events Worldwide.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-gray-300 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Events</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Organizers</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
                        <ul className="space-y-3 text-gray-300 text-sm">
                            <li className="flex items-start gap-3">
                                <FaMapMarkerAlt className="mt-1 flex-shrink-0" />
                                <span>Algiers, Algeria</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaPhoneAlt className="mt-1 flex-shrink-0" />
                                <span>+213 555 123 456</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaEnvelope className="mt-1 flex-shrink-0" />
                                <span>info@eventsphere.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                        <div className="flex gap-4">
                            <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors">
                                <FaFacebookF className="w-4 h-4" />
                            </a>
                            <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors">
                                <FaTwitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors">
                                <FaLinkedinIn className="w-4 h-4" />
                            </a>
                            <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors">
                                <FaInstagram className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-white/10 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-gray-400 text-xs sm:text-sm">
                    <p>&copy; {new Date().getFullYear()} EventSphere. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};