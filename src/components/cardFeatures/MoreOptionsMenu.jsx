import React from 'react';

const MoreOptionsMenu = ({ isOpen, onClose, onRegister, onContact }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg overflow-hidden z-10">
      <button className="block px-4 py-2 text-sm text-[var(--bg-purple)] hover:bg-[var(--bg-purple)] hover:text-white  w-full text-left " onClick={() => { onRegister(); onClose(); }}>
        Register Now
      </button>
      <button className="block px-4 py-2 text-sm ttext-[var(--bg-purple)] hover:bg-[var(--bg-purple)] hover:text-white whitespace-nowrap" onClick={() => { onContact(); onClose(); }}>
        Contact the Organizer
      </button>
    </div>
  );
};

export default MoreOptionsMenu;
