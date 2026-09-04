import React from 'react';

export const Sidebar = ({ sidebarItems = [] }) => {
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

  // Use provided items or fallback to defaults
  const itemsToRender = sidebarItems.length > 0 ? sidebarItems : defaultItems;

  return (
    <aside className="ml-6 mb-6.5  mt-5.5 w-200 p-6 rounded-lg border border-[#2c2c3e] ">
      {Object.keys(itemsToRender).map((section, index) => (
        <div key={section}>
          <h3 className="text-lg font-semibold mb-4">{section}</h3>
          <ul className="space-y-4 text-gray-400">
            {itemsToRender[section].map((item, itemIndex) => (
              <li key={itemIndex}>
                <a href={item.link} className={item.className}>
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
          {index < Object.keys(itemsToRender).length - 1 && (
            <div className="mt-8" />
          )}
        </div>
      ))}
    </aside>
  );
};
