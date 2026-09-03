import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaCalendarAlt } from 'react-icons/fa';
import { Navbar } from "../components/layout/Navbar";
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const fetchTickets = async () => {
    try {
      const data = await api.getTickets(token);
      setTickets(data.tickets);
    } catch (err) {
      if (err.message === 'Unauthorized') {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();

    // Set up polling every 10 seconds to check for updates (optional)
    const intervalId = setInterval(fetchTickets, 10000);

    return () => clearInterval(intervalId);
  }, [navigate]);

  const isTicketValid = (eventDate) => {
    return new Date(eventDate) > new Date();
  };

  if (loading) return (
    <div className="min-h-screen bg-[var(--bg-purple)] flex items-center justify-center">
      <div className="text-white text-2xl animate-pulse">Loading your tickets...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[var(--bg-purple)] flex items-center justify-center">
      <div className="text-red-300 text-xl text-center p-8 bg-white/10 rounded-xl">
        Error: {error}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-purple)] px-8">
      <Navbar />
      
      <div className="max-w-6xl mx-auto pl-8 pr-4 py-8 pt-20">
        <h1 className="text-4xl font-bold text-white mb-8">Your Tickets</h1>

        <div className="flex flex-col gap-4">
          {tickets.sort((a, b) => new Date(b.event.date) - new Date(a.event.date)).map((ticket) => (
            <div key={ticket.id} className="bg-[var(--bg-purple)] border border-gray-600 rounded-xl p-4 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white truncate">{ticket.event.name}</h2>
                <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs 
                  ${isTicketValid(ticket.event.date) ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {isTicketValid(ticket.event.date) ? (
                    <><FaCheckCircle /> Valid</>
                  ) : (
                    <><FaTimesCircle /> Expired</>
                  )}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                  <FaCalendarAlt className="text-[#B39DDB] mr-2 text-lg" />
                  <p className="text-white">
                    {new Date(ticket.event.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-[#B39DDB] mr-2 text-lg" />
                  <p className="text-white truncate">{ticket.event.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <footer className="text-center text-gray-500 text-sm pb-8 px-4 mt-8">
          © {new Date().getFullYear()} EventSphere. All rights reserved.
        </footer>
      </div>
    </div>
  );
};