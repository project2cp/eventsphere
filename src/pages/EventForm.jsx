import React, { useState, useEffect } from 'react';
import {
  FaCheck,
  FaCalendarAlt,
  FaTicketAlt,
  FaMapMarker,
  FaImage,
  FaInfoCircle,
  FaClock,
  FaAlignLeft,
} from 'react-icons/fa';
import { MdNavigateNext, MdNavigateBefore } from 'react-icons/md';
import { Navbar } from '../components/layout/Navbar';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import api from '../api/client';

const initialEventData = {
  title: '',
  category: '',
  date: '',
  time: '',
  description: '',
  location: '',
  ticketPrice: '',
  ticketLimit: '',
  eventImage: null,
  termsAccepted: false,
};

const eventTypes = ['Conference', 'Concert', 'Workshop', 'Exhibition', 'Networking'];

export const EventForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialEventData);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState(null);

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
        // Organizer confirmed – allow form
      } catch (error) {
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

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = 'Event name is required';
      if (!formData.category) newErrors.category = 'Event type is required';
      if (!formData.date) newErrors.date = 'Date is required';
      if (!formData.time) newErrors.time = 'Time is required';
    }

    if (step === 2) {
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (!formData.location.trim()) newErrors.location = 'Location is required';
      if (!formData.eventImage) newErrors.eventImage = 'Event image is required';
      if (!formData.ticketLimit || parseInt(formData.ticketLimit) <= 0) {
        newErrors.ticketLimit = 'A valid ticket limit is required';
      }
      if (formData.ticketPrice && parseFloat(formData.ticketPrice) <= 0) {
        newErrors.ticketPrice = 'Ticket price must be a positive number if provided';
      }
    }

    if (step === 3 && !formData.termsAccepted) {
      newErrors.termsAccepted = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => validateStep(currentStep) && setCurrentStep((prev) => Math.min(prev + 1, 3));
  const handlePrevious = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        eventImage: file,
        eventImagePreview: URL.createObjectURL(file),
      }));
      setErrors((prev) => ({ ...prev, eventImage: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    setIsSubmitting(true);

    const token = localStorage.getItem('token');
    const formDataToSend = new FormData();
    const combinedDateTime = `${formData.date}T${formData.time}:00`;
    formDataToSend.append('title', formData.title);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('date', combinedDateTime);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('image', formData.eventImage);
    formDataToSend.append('ticket_limit', formData.ticketLimit);
    formDataToSend.append('is_paid', formData.ticketPrice ? '1' : '0');
    if (formData.ticketPrice) {
      formDataToSend.append('ticket_price', formData.ticketPrice);
    }

    try {
      await api.createEvent(token, formDataToSend);
      setIsSubmitted(true);
    } catch (error) {
      setErrors({ submit: error.message || 'Event creation failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authError) {
    return null;
  }

  const steps = [
    { title: 'Event Basics', icon: <FaInfoCircle /> },
    { title: 'Event Details', icon: <FaMapMarker /> },
    { title: 'Finalize', icon: <FaCheck /> },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-purple)] font-sans py-8">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 relative pt-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Your Event</h1>
          <p className="text-white/80">Bring your vision to life with our seamless event setup</p>
        </div>

        <div className="flex items-center justify-between mb-12">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center 
                ${
                  currentStep > index + 1 || (index === 2 && isSubmitted)
                    ? 'bg-green-500'
                    : currentStep === index + 1
                    ? 'bg-[#c4adf4]'
                    : 'bg-gray-300'
                }
                transition-colors duration-300`}
              >
                {currentStep > index + 1 || (index === 2 && isSubmitted) ? (
                  <FaCheck className="text-white" />
                ) : (
                  React.cloneElement(step.icon, { className: 'text-white' })
                )}
              </div>
              <span
                className={`mt-2 text-sm ${
                  currentStep >= index + 1 || (index === 2 && isSubmitted)
                    ? 'text-white'
                    : 'text-gray-400'
                }`}
              >
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mt-6 ${
                    currentStep > index + 1 || (index === 1 && isSubmitted)
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="relative">
          <div
            className={`bg-white rounded-xl shadow-lg p-8 transition-opacity ${
              isSubmitted ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-[#4a2c8a]">
                  <FaInfoCircle className="text-[#c4adf4]" /> Event Basics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Event Name *</label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter event name"
                      className="w-full p-3 border rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-[#c4adf4]"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Event Type *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg text-gray-700"
                    >
                      <option value="" disabled>
                        Select event type
                      </option>
                      {eventTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Date *</label>
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-400" />
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-lg"
                      />
                    </div>
                    {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Time *</label>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-gray-400" />
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-lg"
                      />
                    </div>
                    {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-[#4a2c8a]">
                  <FaMapMarker className="text-[#c4adf4]" /> Event Details
                </h2>
                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <div className="flex items-start gap-2">
                    <FaAlignLeft className="text-gray-400 mt-3" />
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your event in detail..."
                      rows="4"
                      className="w-full p-3 border rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-[#c4adf4] resize-none"
                    />
                  </div>
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location *</label>
                  <div className="flex items-center gap-2">
                    <FaMapMarker className="text-gray-400" />
                    <input
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Enter event location"
                      className="w-full p-3 border rounded-lg placeholder-gray-400"
                    />
                  </div>
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Event Image *</label>
                  <div className="flex items-center gap-2">
                    <FaImage className="text-gray-400" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full p-3 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#c4adf4] file:text-white hover:file:bg-[#a790d8]"
                    />
                  </div>
                  {formData.eventImagePreview && (
                    <img
                      src={formData.eventImagePreview}
                      alt="Event preview"
                      className="mt-4 w-48 h-32 object-cover rounded-lg"
                    />
                  )}
                  {errors.eventImage && <p className="text-red-500 text-sm mt-1">{errors.eventImage}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Ticket Options *</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Ticket Price (Leave empty for free event)
                      </label>
                      <input
                        type="number"
                        name="ticketPrice"
                        value={formData.ticketPrice}
                        onChange={handleInputChange}
                        placeholder="Enter ticket price (optional)"
                        className="w-full p-3 border rounded-lg placeholder-gray-400"
                      />
                      {errors.ticketPrice && (
                        <p className="text-red-500 text-sm mt-1">{errors.ticketPrice}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Ticket Limit *</label>
                      <input
                        type="number"
                        name="ticketLimit"
                        value={formData.ticketLimit}
                        onChange={handleInputChange}
                        placeholder="Enter ticket limit"
                        className="w-full p-3 border rounded-lg placeholder-gray-400"
                      />
                      {errors.ticketLimit && (
                        <p className="text-red-500 text-sm mt-1">{errors.ticketLimit}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-[#4a2c8a]">
                  <FaCheck className="text-[#c4adf4]" /> Final Details
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, termsAccepted: e.target.checked }))
                      }
                      className="w-5 h-5 accent-[#4a2c8a]"
                      required
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700">
                      I agree to the terms and conditions and confirm all event details are accurate *
                    </label>
                  </div>
                  {errors.termsAccepted && (
                    <p className="text-red-500 text-sm">{errors.termsAccepted}</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 hover:bg-gray-300 transition-colors"
              >
                <MdNavigateBefore /> Previous
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-[#4a2c8a] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-[#6b4ba5] transition-colors"
                >
                  Next <MdNavigateNext />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.termsAccepted}
                  className={`bg-green-500 text-white px-6 py-2 rounded-lg transition-colors ${
                    isSubmitting || !formData.termsAccepted
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-green-600'
                  }`}
                >
                  {isSubmitting ? 'Publishing Event...' : 'Publish Event'}
                </button>
              )}
            </div>

            {errors.submit && <p className="text-red-500 text-center mt-4">{errors.submit}</p>}
          </div>

          {isSubmitted && (
            <div className="absolute inset-0 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-2xl p-8 text-center space-y-6 w-full max-w-md animate-fade-in">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                    <FaCheck className="text-white text-4xl" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Event Live! 🎉</h2>
                <p className="text-gray-600 px-6">
                  Your event has been successfully published and is now visible to the community!
                </p>
                <NavLink
                  to="/dashboard"
                  className="bg-purple-800 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Return to Dashboard
                </NavLink>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};