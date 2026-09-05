import React, { useState } from 'react';
import { FaSearch, FaChevronDown, FaCalendarAlt, FaMapMarkerAlt, FaSortAmountDown } from 'react-icons/fa';

export const SearchFilterBar = ({ 
  searchQuery, 
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  sortBy,
  onSortChange,
  sortOptions,
  onDateClick,
  onLocationClick,
  showLocationInput,
  locationRef,
  locationValue,
  onLocationChange,
  setShowLocationInput
}) => {
  const [showMobileCategory, setShowMobileCategory] = useState(false);
  const [showMobileSort, setShowMobileSort] = useState(false);

  // Get current category label
  const currentCategoryLabel = selectedCategory || 'All';
  
  // Get current sort label
  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || 'Popularity';

  return (
    <div className="w-full">
      {/* DESKTOP VIEW - Hidden on mobile, visible on md+ */}
      <div className="hidden md:flex flex-nowrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 h-12">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search events..." 
            className="w-full pl-12 pr-6 h-12 rounded-full bg-white text-[var(--bg-purple)] text-sm border-none focus:outline-none placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Category Dropdown */}
        <select
          className="flex-shrink-0 min-w-[120px] bg-white text-[var(--bg-purple)] px-4 h-12 rounded-full text-sm border-none focus:outline-none cursor-pointer"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Sort Dropdown */}
        <div className="relative min-w-[120px] bg-white rounded-full h-12">
          <FaSortAmountDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            className="w-full pl-10 pr-4 h-12 bg-transparent rounded-full text-sm text-[var(--bg-purple)] border-none focus:outline-none cursor-pointer"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Date Button */}
        <div className="relative h-12 w-10 flex-shrink-0">
          <button
            onClick={onDateClick}
            className="w-full h-full flex items-center justify-center p-1 rounded-full bg-white text-gray-400 hover:bg-gray-50 transition-colors"
          >
            <FaCalendarAlt className="text-lg" />
          </button>
        </div>

        {/* Location Button */}
        <div className="relative h-12 w-10 flex-shrink-0">
          {showLocationInput ? (
            <div className="absolute right-0 bottom-full mb-2 z-10">
              <input
                type="text"
                ref={locationRef}
                placeholder="Location"
                className="w-48 pl-8 pr-4 py-3 rounded-full bg-white text-[var(--bg-purple)] text-sm border-none focus:outline-none shadow-lg"
                value={locationValue}
                onChange={(e) => onLocationChange(e.target.value)}
                onBlur={() => setShowLocationInput(false)}
              />
              <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          ) : null}
          <button
            onClick={onLocationClick}
            className="w-full h-full flex items-center justify-center p-1 rounded-full bg-white text-gray-400 hover:bg-gray-50 transition-colors"
          >
            <FaMapMarkerAlt className="text-lg" />
          </button>
        </div>
      </div>

      {/* MOBILE VIEW - Visible only on mobile */}
      <div className="md:hidden">
        {/* Search Bar - Full width */}
        <div className="relative h-12 w-full">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search events..." 
            className="w-full pl-12 pr-6 h-12 rounded-full bg-white text-[var(--bg-purple)] text-sm border-none focus:outline-none placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Filter Chips - Horizontal scrollable row */}
        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide pb-1">
          {/* Category Chip */}
          <button
            onClick={() => setShowMobileCategory(!showMobileCategory)}
            className="flex items-center gap-1 px-4 py-2 rounded-full bg-white/90 text-[var(--bg-purple)] text-sm whitespace-nowrap shadow-sm hover:bg-white transition-colors flex-shrink-0"
          >
            <span>{currentCategoryLabel}</span>
            <FaChevronDown className={`w-3 h-3 transition-transform ${showMobileCategory ? 'rotate-180' : ''}`} />
          </button>

          {/* Sort Chip */}
          <button
            onClick={() => setShowMobileSort(!showMobileSort)}
            className="flex items-center gap-1 px-4 py-2 rounded-full bg-white/90 text-[var(--bg-purple)] text-sm whitespace-nowrap shadow-sm hover:bg-white transition-colors flex-shrink-0"
          >
            <FaSortAmountDown className="w-3 h-3" />
            <span>{currentSortLabel}</span>
            <FaChevronDown className={`w-3 h-3 transition-transform ${showMobileSort ? 'rotate-180' : ''}`} />
          </button>

          {/* Date Chip */}
          <button
            onClick={onDateClick}
            className="flex items-center gap-1 px-4 py-2 rounded-full bg-white/90 text-[var(--bg-purple)] text-sm whitespace-nowrap shadow-sm hover:bg-white transition-colors flex-shrink-0"
          >
            <FaCalendarAlt className="w-3 h-3" />
            <span>Date</span>
          </button>

          {/* Location Chip */}
          <button
            onClick={onLocationClick}
            className="flex items-center gap-1 px-4 py-2 rounded-full bg-white/90 text-[var(--bg-purple)] text-sm whitespace-nowrap shadow-sm hover:bg-white transition-colors flex-shrink-0"
          >
            <FaMapMarkerAlt className="w-3 h-3" />
            <span>Location</span>
          </button>
        </div>

        {/* Mobile Category Dropdown */}
        {showMobileCategory && (
          <div className="mt-2 p-3 bg-white rounded-xl shadow-lg z-10 relative">
            <div className="grid grid-cols-2 gap-2">
              {['All', ...categories].map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    onCategoryChange(cat === 'All' ? '' : cat);
                    setShowMobileCategory(false);
                  }}
                  className={`px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                    (cat === 'All' && !selectedCategory) || selectedCategory === cat
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-700 hover:bg-purple-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Sort Dropdown */}
        {showMobileSort && (
          <div className="mt-2 p-3 bg-white rounded-xl shadow-lg z-10 relative">
            <div className="grid grid-cols-1 gap-2">
              {sortOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    onSortChange(option.value);
                    setShowMobileSort(false);
                  }}
                  className={`px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                    sortBy === option.value
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-700 hover:bg-purple-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Location Input */}
        {showLocationInput && (
          <div className="mt-2 p-3 bg-white rounded-xl shadow-lg z-10 relative">
            <input
              type="text"
              ref={locationRef}
              placeholder="Enter location..."
              className="w-full pl-4 pr-4 py-2 rounded-lg border border-gray-200 text-[var(--bg-purple)] text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              value={locationValue}
              onChange={(e) => onLocationChange(e.target.value)}
              autoFocus
            />
          </div>
        )}
      </div>
    </div>
  );
};