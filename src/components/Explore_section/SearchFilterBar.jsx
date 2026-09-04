import React from 'react';
import { FaSearch, FaChevronDown } from 'react-icons/fa';

export const SearchFilterBar = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="flex items-center gap-4 mt-6">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search events"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/80 focus:bg-white border-none focus:ring-2 focus:ring-purple-300 outline-none transition-all"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      
      <button className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white/80 hover:bg-white text-gray-700">
        <span>Filter</span>
        <FaChevronDown className="w-4 h-4 ml-1" />
      </button>
      
      <button className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white/80 hover:bg-white text-gray-700">
        <span>Search location</span>
        <FaChevronDown className="w-4 h-4 ml-1" />
      </button>
      
      <button className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white/80 hover:bg-white text-gray-700">
        <span>Date</span>
        <FaChevronDown className="w-4 h-4 ml-1" />
      </button>
    </div>
  );
};

