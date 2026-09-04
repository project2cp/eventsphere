import React from 'react';

export const ActionButton = ({ text, primary = false }) => {
    return (
      <button
        className={`
          px-4 py-2 rounded-md text-sm font-medium transition-colors
          ${primary 
            ? 'bg-purple-600 text-white hover:bg-purple-700' 
            : 'bg-white/80 text-gray-700 hover:bg-white'}
        `}
      >
        {text}
      </button>
    );
  };
