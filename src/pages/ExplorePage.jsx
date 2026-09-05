// src/pages/ExplorePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { EventCard } from '../components/Explore_section/EventCard';
import { Footer } from '../components/Home_section/Footer';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../api/client';
import { SectionHeader } from '../components/Explore_section/SectionHeader';
import { ActionButton } from '../components/Explore_section/ActionButton';
import { SearchFilterBar } from '../components/Explore_section/SearchFilterBar';

import img1 from '../assets/ai.jpeg';
import img3 from '../assets/marathon.png';
import img4 from '../assets/medical.jpeg';
import img5 from '../assets/hackthon.jpg';

gsap.registerPlugin(ScrollTrigger);

export const ExplorePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    date: '',
    keyword: '',
    sort_by: 'popularity',
    page: 1
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0
  });
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const titleContainerRef = useRef(null);
  const dateRef = useRef(null);
  const locationRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const imageMap = {
    'ai.jpeg': img1,
    'marathon.png': img3,
    'medical.jpeg': img4,
    'hackthon.jpg': img5
  };

  const categories = ['Conference', 'Concert', 'Workshop', 'Exhibition', 'Networking', 'Science', 'Sports', 'Medical'];
  const sortOptions = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'date', label: 'Date' },
    { value: 'ticket_price', label: 'Price' }
  ];

  const titles = [
    "Unlock Extraordinary Experiences!",
    "Your Next Memory Starts Here!",
    "Where Will Curiosity Take You?",
    "Events That Spark Connection!",
    "Adventure Awaits Around the Corner!"
  ];

  // Fetch events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {
        page: filters.page,
        category: filters.category,
        location: filters.location,
        date: filters.date,
        keyword: filters.keyword,
        sort_by: filters.sort_by
      };
      const data = await api.getEvents(params);
      
      const eventsWithImages = data.data.map(event => ({
        ...event,
        image: imageMap[event.image] || img1,
      }));
      
      setEvents(eventsWithImages);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  // Title animation
  useEffect(() => {
    const titleElements = titleContainerRef.current?.children;
    if (!titleElements) return;

    const tl = gsap.timeline({ repeat: -1 });
    Array.from(titleElements).forEach((title, index) => {
      tl.to(title, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power4.out",
        onStart: () => setCurrentTitleIndex(index)
      })
      .to(title, {
        opacity: 0,
        y: -40,
        duration: 0.8,
        ease: "power4.in",
        delay: 1.5
      }, "+=0.5");
    });

    return () => tl.kill();
  }, []);

  // GSAP animation for event cards
  useEffect(() => {
    if (loading || events.length === 0) return;

    const cards = document.querySelectorAll(".event-card");
    if (cards.length === 0) return;

    gsap.from(cards, {
      opacity: 0,
      y: 50,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".events-grid",
        start: "top center+=100px",
        toggleActions: "play none none none"
      }
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, [events, loading]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1
    }));
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.last_page) return;
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDateClick = () => {
    if (dateRef.current) {
      dateRef.current.showPicker();
    }
  };

  const handleLocationClick = () => {
    setShowLocationInput(true);
    if (locationRef.current) {
      setTimeout(() => locationRef.current.focus(), 0);
    }
  };

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handleClearFilters = () => {
    setFilters({
      category: '',
      location: '',
      date: '',
      keyword: '',
      sort_by: 'popularity',
      page: 1
    });
  };

  return (
    <div className='min-h-screen bg-[var(--bg-purple)] text-white font-sans'>
      <Navbar />

      {/* Animated Header */}
      <div className='pt-16'>
        <div className="w-4/5 mx-auto mt-8 p-12 bg-[#dbcef5] rounded-lg shadow-lg relative min-h-[140px] flex items-center justify-center">
          <div ref={titleContainerRef} className="relative w-full h-full">
            {titles.map((title, index) => (
              <h2
                key={title}
                className={`absolute w-full text-3xl font-bold text-[var(--bg-purple)] text-center opacity-0 ${index === currentTitleIndex ? 'opacity-100' : ''}`}
                style={{
                  top: "50%",
                  transform: "translateY(-50%)",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.1)"
                }}
              >
                {title}
              </h2>
            ))}
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="w-4/5 mx-auto mt-8">
        <SearchFilterBar
          searchQuery={filters.keyword}
          onSearchChange={(value) => handleFilterChange('keyword', value)}
          selectedCategory={filters.category}
          onCategoryChange={(value) => handleFilterChange('category', value)}
          categories={categories}
          sortBy={filters.sort_by}
          onSortChange={(value) => handleFilterChange('sort_by', value)}
          sortOptions={sortOptions}
          onDateClick={handleDateClick}
          onLocationClick={handleLocationClick}
          showLocationInput={showLocationInput}
          locationRef={locationRef}
          locationValue={filters.location}
          onLocationChange={(value) => handleFilterChange('location', value)}
          setShowLocationInput={setShowLocationInput}
        />
        
        {/* Hidden date input */}
        <input
          type="date"
          ref={dateRef}
          className="hidden"
          value={filters.date}
          onChange={(e) => handleFilterChange('date', e.target.value)}
        />

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-4">
          <ActionButton text="Clear filters" primary={false} onClick={handleClearFilters} />
        </div>
      </div>

      {/* Events Grid */}
      <div className="w-4/5 mx-auto mt-12 events-container">
        <SectionHeader 
          title={`Events (${pagination.total})`}
          expandable={true}
          expanded={isExpanded}
          onToggle={toggleExpand}
          frameNumber={`${pagination.current_page} of ${pagination.last_page}`}
        />

        {isExpanded && (
          <>
            {loading ? (
              <div className="text-center py-12 text-xl">Loading events...</div>
            ) : error ? (
              <div className="text-center py-12 text-xl text-red-300">{error}</div>
            ) : events.length === 0 ? (
              <div className="text-center py-12 text-xl">No events found matching your criteria</div>
            ) : (
              <>
                <div className="events-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {events.map(event => (
                    <div key={event.id} className="event-card">
                      <EventCard
                        event={{
                          ...event,
                          image: event.image,
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center mt-8 pb-8">
                  <button
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    disabled={pagination.current_page === 1}
                    className={`px-4 py-2 mx-2 rounded ${
                      pagination.current_page === 1 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-white text-[var(--bg-purple)] hover:bg-gray-100'
                    }`}
                  >
                    <FaArrowLeft />
                  </button>
                  
                  <span className="mx-4">
                    Page {pagination.current_page} of {pagination.last_page}
                  </span>

                  <button
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                    disabled={pagination.current_page === pagination.last_page}
                    className={`px-4 py-2 mx-2 rounded ${
                      pagination.current_page === pagination.last_page
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-white text-[var(--bg-purple)] hover:bg-gray-100'
                    }`}
                  >
                    <FaArrowRight />
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};