import React, { useEffect, useState, useRef } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { gsap } from 'gsap';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  FaCalendar,
  FaUser,
  FaClock,
  FaPlus,
  FaHistory,
} from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import api from '../api/client';

export const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const statsRef = useRef(null);
  const tableRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is an organizer
  useEffect(() => {
    const verifyOrganizerStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        handleAuthRedirect();
        return;
      }

      try {
        await api.getOrganizerProfile(token);
        // If successful, user is an organizer – allow access
      } catch (error) {
        // If 404, not an organizer – redirect to organizer form
        if (error.response?.status === 404) {
          navigate(`/organizer-form?redirect=${encodeURIComponent(location.pathname)}`, {
            replace: true,
            state: { error: 'You need to be an organizer to create events' },
          });
        } else {
          console.error('Organizer verification error:', error);
          setAuthError('Error verifying organizer status. Please try again.');
        }
      }
    };

    verifyOrganizerStatus();
  }, [navigate, location.pathname]);

  const handleAuthRedirect = () => {
    setAuthError('Please log in to create events');
    localStorage.setItem('redirectAfterLogin', location.pathname);
    navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`, { replace: true });
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await api.getDashboard(token);
        setDashboardData(data);
        setLoading(false);

        // Animations
        if (statsRef.current) {
          gsap.from(statsRef.current.children, {
            duration: 1,
            y: 50,
            opacity: 0,
            stagger: 0.2,
            ease: 'power2.out',
          });
        }
        if (tableRef.current) {
          gsap.from(tableRef.current, {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: 'power2.out',
            delay: 0.3,
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Pie chart data
  const participationData = [
    { name: 'Participated', value: dashboardData?.summary.avg_participation_rate || 0 },
    { name: 'Remaining', value: 100 - (dashboardData?.summary.avg_participation_rate || 0) },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-purple)] flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-[var(--bg-purple)] flex items-center justify-center">
        <div className="text-red-300 text-xl text-center p-8 bg-white/10 rounded-xl">
          {authError}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-purple)] font-sans">
      <Navbar />

      <div className="p-8 pt-20">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold text-white">Tableau de bord</h1>
          <div className="flex gap-4">
            <NavLink
              to="/create-event"
              className="bg-white text-[#4a2c8a] px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-[#d6b9f0] transition-colors"
            >
              <FaPlus /> Create Event
            </NavLink>
            <button className="bg-white text-[#4a2c8a] px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-[#d6b9f0] transition-colors">
              <FaHistory /> Past Events
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between hover:shadow-xl transition-shadow">
            <div>
              <p className="text-gray-500 text-sm">Total d'événements</p>
              <p className="text-3xl font-bold text-[#4a2c8a]">
                {dashboardData?.summary.total_events || 0}
              </p>
            </div>
            <FaCalendar className="text-[#4a2c8a] text-3xl" />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between hover:shadow-xl transition-shadow">
            <div>
              <p className="text-gray-500 text-sm">Inscriptions totales</p>
              <p className="text-3xl font-bold text-[#4a2c8a]">
                {dashboardData?.summary.total_registrations || 0}
              </p>
            </div>
            <FaUser className="text-[#4a2c8a] text-3xl" />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between hover:shadow-xl transition-shadow">
            <div>
              <p className="text-gray-500 text-sm">Taux de participation</p>
              <div className="w-20 h-20">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={participationData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={40}
                    >
                      {participationData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === 0 ? '#4a2c8a' : '#e0e0e0'}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between hover:shadow-xl transition-shadow">
            <div>
              <p className="text-gray-500 text-sm">Prochain événement</p>
              <p className="text-3xl font-bold text-[#4a2c8a]">
                {dashboardData?.summary.next_event
                  ? new Date(dashboardData.summary.next_event.date).toLocaleDateString()
                  : 'Aucun'}
              </p>
            </div>
            <FaClock className="text-[#4a2c8a] text-3xl" />
          </div>
        </div>

        {/* Events Table */}
        <div ref={tableRef} className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left text-[#4a2c8a] font-semibold">Titre</th>
                <th className="p-4 text-left text-[#4a2c8a] font-semibold">Date</th>
                <th className="p-4 text-left text-[#4a2c8a] font-semibold">Lieu</th>
                <th className="p-4 text-left text-[#4a2c8a] font-semibold">Limite</th>
                <th className="p-4 text-left text-[#4a2c8a] font-semibold">Inscriptions</th>
                <th className="p-4 text-left text-[#4a2c8a] font-semibold">Taux</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData?.events_stats.map((event, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 border-t border-gray-100">{event.title}</td>
                  <td className="p-4 border-t border-gray-100">
                    {new Date(event.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="p-4 border-t border-gray-100">{event.location}</td>
                  <td className="p-4 border-t border-gray-100">{event.ticket_limit}</td>
                  <td className="p-4 border-t border-gray-100">{event.registrations}</td>
                  <td className="p-4 border-t border-gray-100">
                    {event.participation_rate.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};