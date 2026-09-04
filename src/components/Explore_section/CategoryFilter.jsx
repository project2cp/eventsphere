import React from 'react';
import { 
  FaTheaterMasks, 
  FaCampground, 
  FaCode, 
  FaUtensils, 
  FaBriefcase, 
  FaGraduationCap, 
  FaRunning 
} from 'react-icons/fa';

export const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
    const categories = [
      { id: 'comedy', name: 'comedy', icon: <FaTheaterMasks className="w-6 h-6" /> },
      { id: 'camping', name: 'camping', icon: <FaCampground className="w-6 h-6" /> },
      { id: 'coding', name: 'coding', icon: <FaCode className="w-6 h-6" /> },
      { id: 'food', name: 'food/drink', icon: <FaUtensils className="w-6 h-6" /> },
      { id: 'business', name: 'business', icon: <FaBriefcase className="w-6 h-6" /> },
      { id: 'education', name: 'education', icon: <FaGraduationCap className="w-6 h-6" /> },
      { id: 'sports', name: 'sports', icon: <FaRunning className="w-6 h-6" /> },
    ];
  
    return (
      <div className="grid grid-cols-7 gap-4 mt-6">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 ${
              selectedCategory === category.id 
                ? 'bg-purple-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-purple-100'
            }`}
            onClick={() => onSelectCategory(category.id)}
          >
            <div className="mb-2">{category.icon}</div>
            <span className="text-xs">{category.name}</span>
          </button>
        ))}
      </div>
    );
  };
  

