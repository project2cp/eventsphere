import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EventCard } from '../components/Explore_section/EventCard';
import { Navbar } from '../components/layout/Navbar';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaTicketAlt, FaCheckCircle } from 'react-icons/fa';
import api from '../api/client';

export const EventInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [similarEvents, setSimilarEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchEventData = async () => {
      try {
        const data = await api.getEvent(id);
        setEventData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id, token, navigate]);

  // Fetch similar events (only if eventData is loaded)
  useEffect(() => {
    if (!eventData?.category) return;

    const fetchSimilarEvents = async () => {
      try {
        const params = { category: eventData.category, per_page: 3 };
        const data = await api.getEvents(params);
        const filtered = data.data.filter((event) => event.id !== parseInt(id));
        setSimilarEvents(filtered);
      } catch (err) {
        console.error('Error fetching similar events:', err);
      }
    };

    fetchSimilarEvents();
  }, [eventData, id]);

  const handleRegister = async () => {
    try {
      await api.buyTicket(token, id);
      // Optionally update event tickets count locally (we can re-fetch event)
      const updatedEvent = await api.getEvent(id);
      setEventData(updatedEvent);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-purple)] flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">Loading event details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg-purple)] flex items-center justify-center">
        <div className="text-red-300 text-xl text-center p-8 bg-white/10 rounded-xl">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-purple)] px-8">
      <Navbar />

      {showSuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-down">
            <FaCheckCircle className="text-xl" />
            <div>
              <p className="font-bold">Ticket Reserved Successfully!</p>
              <p>Check your email for confirmation and ticket details</p>
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              className="ml-4 hover:text-green-200 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto pl-8 pr-4 py-8 pt-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {eventData.title}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-8">
            <img
              src={eventData.image_url || 'https://via.placeholder.com/600x400'}
              alt={eventData.title}
              className="w-full h-96 object-cover rounded-xl shadow-lg border border-gray-600"
            />
            <div className="space-y-4">
              <button
                className="w-full bg-purple-600 text-white px-8 py-4 rounded-xl font-bold 
                          hover:bg-purple-700 transition-colors border border-purple-400
                          text-lg text-center flex items-center justify-center gap-2"
                onClick={handleRegister}
              >
                <FaTicketAlt className="text-[#B39DDB]" />
                {eventData.is_paid ? `BUY TICKET ($${eventData.ticket_price})` : 'GET TICKET'}
              </button>
              <p className="text-gray-400 text-sm text-center">
                {eventData.is_paid
                  ? 'Secure payment processing powered by Stripe'
                  : "You'll receive a confirmation email with your ticket"}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[var(--bg-purple)] border border-gray-600 rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-4">
                  <FaUsers className="text-[#B39DDB] text-3xl" />
                  <div>
                    <p className="text-gray-400 text-sm">Registered</p>
                    <p className="text-white text-2xl font-bold">
                      {eventData.tickets_count || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--bg-purple)] border border-gray-600 rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-4">
                  <FaTicketAlt className="text-[#B39DDB] text-3xl" />
                  <div>
                    <p className="text-gray-400 text-sm">Price</p>
                    <p className="text-white text-2xl font-bold">
                      {eventData.is_paid ? `$${eventData.ticket_price}` : 'Free'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[var(--bg-purple)] border border-gray-600 rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-6">Event Schedule</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <FaCalendarAlt className="text-[#B39DDB] mr-4 text-xl mt-1" />
                  <div>
                    <p className="text-white font-bold mb-1">Date</p>
                    <p className="text-white">
                      {new Date(eventData.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-[#B39DDB] mr-4 text-xl mt-1" />
                  <div>
                    <p className="text-white font-bold mb-1">Location</p>
                    <p className="text-white">{eventData.location || 'TBD'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[var(--bg-purple)] border border-gray-600 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-white mb-3">Organized By</h3>
                <p className="text-white">{eventData.organizer?.name || 'SAFEX'}</p>
              </div>

              <div className="bg-[var(--bg-purple)] border border-gray-600 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-white mb-3">Sponsored By</h3>
                <p className="text-white">{eventData.sponsor || 'SAFEX'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-purple)] border border-gray-600 rounded-xl p-8 shadow-lg mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Event Description</h2>
          <p className="text-white leading-relaxed">
            {eventData.description || 'No description available'}
          </p>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Similar Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {similarEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => navigate(`/events/${event.id}`)}
              />
            ))}
          </div>
        </div>

        <div className="text-center py-8 mt-12 border-t border-gray-600">
          <p className="text-gray-400">
            <button
              onClick={() => navigate('/login')}
              className="underline hover:text-white transition-colors"
            >
              Sign in
            </button>{' '}
            to join the conversation
          </p>
        </div>
      </div>

      <footer className="text-center text-gray-500 text-sm pb-8 px-4 mt-12">
        © {new Date().getFullYear()} EventSphere. All rights reserved.
      </footer>
    </div>
  );
};