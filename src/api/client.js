import * as mockApi from '../services/mockApi';

// Detect if we should use mock
const USE_MOCK = true; 

const api = {
  // Auth
  login: (email, password) => USE_MOCK ? mockApi.mockLogin(email, password) : fetch('/api/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (payload) => USE_MOCK ? mockApi.mockRegister(payload) : fetch('/api/register', { method: 'POST', body: JSON.stringify(payload) }),
  resendVerification: (email) => USE_MOCK ? mockApi.mockResendVerification(email) : fetch('/api/email/resend', { method: 'POST', body: JSON.stringify({ email }) }),
  verifyEmail: (token) => USE_MOCK ? mockApi.mockVerifyEmail(token) : fetch(`/api/email/verify?token=${token}`),
  // Profile
  getProfile: (token) => USE_MOCK ? mockApi.mockGetProfile(token) : fetch('/api/profile', { headers: { Authorization: `Bearer ${token}` } }),
  updateProfile: (token, data) => USE_MOCK ? mockApi.mockUpdateProfile(token, data) : fetch('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(data) }),
  uploadPhoto: (token, formData) => USE_MOCK ? mockApi.mockUploadProfilePhoto(token, formData) : fetch('/api/profile', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData }),
  // Organizer
  getOrganizerProfile: (token) => USE_MOCK ? mockApi.mockOrganizerProfile(token) : fetch('/api/organizers/profile', { headers: { Authorization: `Bearer ${token}` } }),
  requestOrganizer: (token, formData) => USE_MOCK ? mockApi.mockOrganizerRequest(token, formData) : fetch('/api/organizers/request', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData }),
  // Events
  getEvents: (params) => USE_MOCK ? mockApi.mockGetEvents(params) : fetch(`/api/events?${new URLSearchParams(params)}`),
  getEvent: (id) => USE_MOCK ? mockApi.mockGetEvent(id) : fetch(`/api/events/${id}`),
  createEvent: (token, formData) => USE_MOCK ? mockApi.mockCreateEvent(token, formData) : fetch('/api/events', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData }),
  buyTicket: (token, eventId) => USE_MOCK ? mockApi.mockBuyTicket(token, eventId) : fetch(`/api/events/${eventId}/buy-ticket`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } }),
  // Tickets
  getTickets: (token) => USE_MOCK ? mockApi.mockGetTickets(token) : fetch('/api/tickets', { headers: { Authorization: `Bearer ${token}` } }),
  // Dashboard
  getDashboard: (token) => USE_MOCK ? mockApi.mockDashboardSummary(token) : fetch('/api/dashboard/summary', { headers: { Authorization: `Bearer ${token}` } }),
};

export default api;