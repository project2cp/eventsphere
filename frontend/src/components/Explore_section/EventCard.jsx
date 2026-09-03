// src/components/ui/EventCard.jsx
import React from 'react';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const { id, title, date, location, category, organizer, image } = event;

  const handleClick = () => {
    navigate(`/events/${id}`);
  };

  return (
    <div 
      className="rounded-lg shadow-md bg-[#251425] hover:shadow-xl hover:scale-102 transition p-3 flex flex-col cursor-pointer h-[400px]"
      onClick={handleClick}
    >
      {/* Image Section */}
      <div className="w-full h-36 rounded mb-2 overflow-hidden bg-purple-800 flex items-center justify-center relative">
        {image ? (
          <img
            src={image} // ✅ This is now the imported asset (img1, img3, or img4)
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // If image fails, show fallback
              e.target.style.display = 'none';
              const parent = e.target.parentElement;
              const fallback = parent?.querySelector('.fallback-initials');
              if (fallback) fallback.style.display = 'flex';
            }}
          />
        ) : null}
        {/* Fallback: show first letter of title */}
        <div 
          className="fallback-initials absolute inset-0 flex items-center justify-center text-white text-4xl font-bold"
          style={{ display: image ? 'none' : 'flex' }}
        >
          {title?.charAt(0).toUpperCase() || 'E'}
        </div>
      </div>
      
      {/* Content Section */}
      <div className="flex-1 flex flex-col">
        <h3 className="font-semibold text-lg mb-2 text-white line-clamp-1">{title}</h3>
        
        <div className="flex items-center gap-2 text-white mb-1">
          <FaCalendarAlt className="text-white flex-shrink-0" />
          <span className="text-sm">{new Date(date).toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center gap-2 text-white mb-2">
          <FaMapMarkerAlt className="text-white flex-shrink-0" />
          <span className="text-sm truncate">{location}</span>
        </div>

        {organizer && (
          <div className="mt-2 text-sm text-white">
            Organized by:{" "}
            <span className="text-white">{typeof organizer === 'string' ? organizer : organizer?.name || 'Unknown'}</span>
          </div>
        )}

        <div className="mt-2 text-sm">
          <span className="font-semibold text-white">Category:</span>{" "}
          <span className="text-white">{category}</span>
        </div>
        
        <button 
          className="mt-auto w-full bg-[#B39DDB] text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/events/${id}`);
          }}
        >
          Reserve Now
        </button>
      </div>
    </div>
  );
};