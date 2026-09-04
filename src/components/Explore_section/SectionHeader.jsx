import React from 'react';
import { FaChevronDown } from 'react-icons/fa';

export const SectionHeader = ({ title, expandable = false, expanded = true, onToggle, frameNumber }) => {
    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold text-purple-900">{title}</h2>
          {expandable && (
            <button 
              onClick={onToggle}
              className="ml-2 text-purple-600 transition-transform duration-300"
            >
              <FaChevronDown 
                className={`w-5 h-5 transform ${expanded ? 'rotate-180' : 'rotate-0'}`} 
              />
            </button>
          )}
        </div>
        {frameNumber && (
          <div className="text-gray-400 text-sm">
            Frame {frameNumber}
          </div>
        )}
      </div>
    );
  };
  
