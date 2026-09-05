import React, { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

export const Sidebar = ({ sidebarItems = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Default items if none provided
  const defaultItems = {
    Account: [
      { text: 'Contact info', link: '/contact-info', className: "" },
      { text: 'Change email', link: '/change-email', className: "" },
      { text: 'Password', link: '/password', className: "" },
      { text: 'Credit/Debit cards', link: '/credit-cards', className: "" },
      { text: 'Location', link: '/location', className: "" },
      { text: 'Email preferences', link: '/email-preferences', className: "" },
      { text: 'Linked accounts', link: '/linked-accounts', className: "" },
      { text: 'Personal data', link: '/personal-data', className: "" },
      { text: 'Close accounts', link: '/close-account', className: "" },
    ],
    Events: [
      { text: 'History', link: '/event-history', className: "" },
      { text: 'Favorite', link: '/favorite-events', className: "" },
      { text: 'Booked events', link: '/booked-events', className: "" },
    ],
    Settings: [
      { text: 'Settings', link: '/settings', className: "" },
    ],
  };

  const itemsToRender = sidebarItems.length > 0 ? sidebarItems : defaultItems;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-20 left-4 z-40 md:hidden bg-[var(--bg-purple)] p-3 rounded-lg border border-[#2c2c3e] text-white hover:bg-purple-800 transition-colors"
        aria-label="Toggle sidebar"
      >
        <FiMenu className="w-5 h-5" />
      </button>

      {/* Sidebar - Desktop (always visible) */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40
        w-72 md:w-60 lg:w-72
        bg-[var(--bg-purple)] md:bg-transparent
        p-6 rounded-lg border border-[#2c2c3e]
        transition-transform duration-300 ease-in-out
        overflow-y-auto max-h-[calc(100vh-80px)] md:max-h-none
        mt-16 md:mt-5.5
        ml-0 md:ml-6
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Close button (mobile only) */}
        <button
          onClick={closeSidebar}
          className="absolute top-4 right-4 md:hidden text-white hover:text-purple-300 transition-colors"
          aria-label="Close sidebar"
        >
          <FiX className="w-6 h-6" />
        </button>

        <div className="mt-8 md:mt-0">
          {Object.keys(itemsToRender).map((section, index) => (
            <div key={section} className="mb-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 text-white border-b border-[#2c2c3e] pb-2">
                {section}
              </h3>
              <ul className="space-y-2 text-gray-400">
                {itemsToRender[section].map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <a 
                      href={item.link} 
                      className={`${item.className} hover:text-white transition-colors text-sm sm:text-base block py-1`}
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
              {index < Object.keys(itemsToRender).length - 1 && (
                <div className="mt-4 border-b border-[#2c2c3e]" />
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={closeSidebar}
        />
      )}
    </>
  );
};