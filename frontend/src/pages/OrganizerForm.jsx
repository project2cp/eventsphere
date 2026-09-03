import React, { useState, useEffect } from 'react';
import {
  FaCheck,
  FaEnvelope,
  FaInfoCircle,
  FaPhone,
  FaMapMarker,
  FaGlobe,
  FaBuilding,
  FaImage,
  FaUserPlus,
  FaCog,
} from 'react-icons/fa';
import { MdNavigateNext, MdNavigateBefore } from 'react-icons/md';
import { Navbar } from '../components/layout/Navbar';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import api from '../api/client';

const initialFormData = {
  email: '',
  phone: '',
  address: '',
  website: '',
  orgName: '',
  orgType: '',
  eventTypes: [],
  orgImage: null,
  admins: [''],
};

const steps = [
  { title: 'Contact Info', icon: <FaEnvelope /> },
  { title: 'Organization', icon: <FaBuilding /> },
  { title: 'Setup', icon: <FaCog /> },
];

const organizationTypes = ['Club', 'Enterprise', 'Non-Profit', 'Government', 'Educational'];
const eventCategories = ['Conference', 'Workshop', 'Concert', 'Sports', 'Exhibition', 'Networking'];

export const OrganizerForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthError('Please log in to access this page.');
      localStorage.setItem('redirectAfterLogin', location.pathname);
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`, { replace: true });
    }
  }, [navigate, location.pathname]);

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.phone) newErrors.phone = 'Phone is required';
      if (!formData.address) newErrors.address = 'Address is required';
    }
    
    if (step === 2) {
      if (!formData.orgName) newErrors.orgName = 'Organization name is required';
      if (!formData.orgType) newErrors.orgType = 'Organization type is required';
      if (!formData.eventTypes.length) newErrors.eventTypes = 'Select at least one event type';
      if (!formData.orgImage) newErrors.orgImage = 'Image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, orgImage: file }));
    }
  };

  const handleAdminEmailChange = (index, value) => {
    const newAdmins = [...formData.admins];
    newAdmins[index] = value;
    setFormData(prev => ({ ...prev, admins: newAdmins }));
  };

  const addAdminField = () => {
    setFormData(prev => ({ ...prev, admins: [...prev.admins, ''] }));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setAuthError('Please log in to submit the request.');
      localStorage.setItem('redirectAfterLogin', location.pathname);
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`, { replace: true });
      return;
    }

    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append('category', formData.eventTypes.join(','));
    formDataToSend.append('description', '');
    formDataToSend.append('organization_type', formData.orgType);
    formDataToSend.append('organization_name', formData.orgName);
    if (formData.orgImage) formDataToSend.append('logo', formData.orgImage);
    formDataToSend.append('document', '');

    try {
      await api.requestOrganizer(token, formDataToSend);
      setIsSubmitted(true);
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to submit request' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authError) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-purple)] font-sans py-8">
      <Navbar navItems={[
        { text: "My tickets", href: "/my-tickets", className: "underline-effect" },
      ]} />
      <div className="max-w-3xl mx-auto px-4 relative pt-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Be Part of EventSphere Family!!
          </h1>
          <p className="text-white/80">
            Join our community of event organizers and start creating amazing experiences.
          </p>
        </div>

        <div className="flex items-center justify-between mb-12">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center 
                  ${(currentStep > index + 1 || (index === 2 && isSubmitted)) ? 'bg-green-500' : (currentStep === index + 1 && !isSubmitted) ? 'bg-[#c4adf4]' : 'bg-gray-300'}
                  transition-colors duration-300`}>
                  {(currentStep > index + 1 || (index === 2 && isSubmitted)) ? <FaCheck className="text-white" /> : 
                   React.cloneElement(step.icon, { className: 'text-white' })}
                </div>
                <span className={`mt-2 text-sm ${(currentStep > index + 1 || (index === 2 && isSubmitted) || (currentStep === index + 1 && !isSubmitted)) ? 'text-white' : 'text-gray-400'}`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mt-6 ${(currentStep > index + 1 || (index === 1 && isSubmitted)) ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="relative">
          <div className={`bg-white rounded-lg shadow-lg p-8 transition-opacity ${isSubmitted ? 'opacity-50 pointer-events-none' : ''}`}>
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <FaInfoCircle className="text-[#c4adf4]" /> Contact Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email <span className="text-red-500">*</span></label>
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-gray-400" />
                      <input
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone <span className="text-red-500">*</span></label>
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-gray-400" />
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Address <span className="text-red-500">*</span></label>
                    <div className="flex items-center gap-2">
                      <FaMapMarker className="text-gray-400" />
                      <input
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Website</label>
                    <div className="flex items-center gap-2">
                      <FaGlobe className="text-gray-400" />
                      <input
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <FaBuilding className="text-[#c4adf4]" /> Organization Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Organization Name <span className="text-red-500">*</span></label>
                    <input
                      name="orgName"
                      value={formData.orgName}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg"
                    />
                    {errors.orgName && <p className="text-red-500 text-sm">{errors.orgName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Organization Type <span className="text-red-500">*</span></label>
                    <select
                      name="orgType"
                      value={formData.orgType}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="">Select Type</option>
                      {organizationTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors.orgType && <p className="text-red-500 text-sm">{errors.orgType}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Event Types <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-2 gap-2">
                      {eventCategories.map(category => (
                        <label key={category} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.eventTypes.includes(category)}
                            onChange={(e) => {
                              const newEventTypes = e.target.checked
                                ? [...formData.eventTypes, category]
                                : formData.eventTypes.filter(et => et !== category);
                              setFormData(prev => ({ ...prev, eventTypes: newEventTypes }));
                            }}
                          />
                          <span>{category}</span>
                        </label>
                      ))}
                    </div>
                    {errors.eventTypes && <p className="text-red-500 text-sm">{errors.eventTypes}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Organization Image <span className="text-red-500">*</span></label>
                    <div className="flex items-center gap-2">
                      <FaImage className="text-gray-400" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    {formData.orgImage && (
                      <img src={URL.createObjectURL(formData.orgImage)} alt="Organization Preview" className="mt-2 w-32 h-32 object-cover rounded-lg" />
                    )}
                    {errors.orgImage && <p className="text-red-500 text-sm">{errors.orgImage}</p>}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <FaUserPlus className="text-[#c4adf4]" /> Team Setup
                </h2>
                <div className="space-y-4">
                  {formData.admins.map((email, index) => (
                    <div key={index}>
                      <label className="block text-sm font-medium mb-1">
                        Admin Email {index + 1} <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={email}
                        onChange={(e) => handleAdminEmailChange(index, e.target.value)}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addAdminField}
                    className="text-blue-500 text-sm flex items-center gap-1"
                  >
                    <FaUserPlus className="text-sm" /> Add Another Admin
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
              >
                <MdNavigateBefore /> Previous
              </button>
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-purple-800 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  Next <MdNavigateNext />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`bg-purple-700 text-white px-4 py-2 rounded-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Creating your organization...' : 'Complete Setup'}
                </button>
              )}
            </div>
          </div>

          {isSubmitted && (
            <div className="absolute inset-0 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-8 text-center space-y-6 w-full max-w-md transform transition-all">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                    <FaCheck className="text-white text-3xl" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Congratulations!</h2>
                <p className="text-gray-600 px-4">
                  Your organization has been successfully accepted to EventSphere!
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
          {errors.submit && <p className="text-red-500 text-center mt-4">{errors.submit}</p>}
        </div>
      </div>
    </div>
  );
};