const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to simulate API responses
const apiResponse = (data, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => data,
  text: async () => JSON.stringify(data),
});

// ----- In-memory data stores (with localStorage persistence) -----
const STORAGE_KEY = 'eventsphere_mock';

const defaultData = {
  users: [],
  tokens: {}, // email => token
  events: [],
  tickets: [],
  organizers: [],
  profiles: {}, // user_id => profile
};

const loadData = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : { ...defaultData, users: [] };
};

const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// ----- Helper to get current user from token -----
const getCurrentUser = (token) => {
  const data = loadData();
  const user = data.users.find(u => u.token === token);
  return user || null;
};

// ----- MOCK API EXPORTS -----

// 1. Authentication
export const mockLogin = async (email, password) => {
  await delay(600);
  const data = loadData();
  const user = data.users.find(u => u.email === email && u.password === password);
  if (!user) {
    throw new Error('Invalid credentials');
  }
  if (!user.email_verified) {
    throw new Error('Email not verified');
  }
  const token = `mock-token-${user.id}`;
  user.token = token;
  saveData(data);
  return { access_token: token, user };
};

export const mockRegister = async (payload) => {
  await delay(700);
  const data = loadData();
  if (data.users.find(u => u.email === payload.email)) {
    throw { response: { status: 422, data: { errors: { email: ['Email already taken'] } } } };
  }
  const newUser = {
    id: Date.now(),
    name: payload.name,
    email: payload.email,
    password: payload.password,
    email_verified: false,
    token: null,
    is_organizer: false,
    profile_photo: null,
    phone_number: '',
    location: '',
    bio: '',
    notificationEnabled: true,
    payementMethode: [],
  };
  data.users.push(newUser);
  saveData(data);
  return { message: 'User registered. Please verify email.' };
};

export const mockResendVerification = async (email) => {
  await delay(500);
  // simulate sending email
  return { message: 'Verification email resent.' };
};

export const mockVerifyEmail = async (token) => {
  await delay(500);
  const data = loadData();
  const unverified = data.users.find(u => !u.email_verified);
  if (unverified) {
    unverified.email_verified = true;
    saveData(data);
    return { message: 'Email verified successfully' };
  } else {
    throw new Error('Invalid verification token');
  }
};

// 2. Profile
export const mockGetProfile = async (token) => {
  await delay(400);
  const user = getCurrentUser(token);
  if (!user) throw new Error('Unauthorized');
  const profile = {
    name: user.name,
    email: user.email,
    phone_number: user.phone_number || '',
    location: user.location || '',
    bio: user.bio || '',
    profile_photo: user.profile_photo || null,
    notificationEnabled: user.notificationEnabled,
    payementMethode: user.payementMethode || [],
    is_organizer: user.is_organizer || false,
  };
  return profile;
};

export const mockUpdateProfile = async (token, updates) => {
  await delay(500);
  const data = loadData();
  const user = data.users.find(u => u.token === token);
  if (!user) throw new Error('Unauthorized');
  Object.assign(user, updates);
  saveData(data);
  return { user };
};

export const mockUploadProfilePhoto = async (token, formData) => {
  await delay(700);
  const data = loadData();
  const user = data.users.find(u => u.token === token);
  if (!user) throw new Error('Unauthorized');
  // Simulate storing image path
  const photoPath = `storage/profile_${user.id}.jpg`;
  user.profile_photo = photoPath;
  saveData(data);
  return { user: { ...user, profile_photo: photoPath } };
};

// 3. Organizer requests
export const mockOrganizerProfile = async (token) => {
  await delay(400);
  const user = getCurrentUser(token);
  if (!user) throw new Error('Unauthorized');
  // Check if user has organizer profile
  const data = loadData();
  const org = data.organizers.find(o => o.user_id === user.id);
  if (!org) {
    throw { response: { status: 404, data: { message: 'Organizer not found' } } };
  }
  return org;
};

export const mockOrganizerRequest = async (token, formData) => {
  await delay(700);
  const user = getCurrentUser(token);
  if (!user) throw new Error('Unauthorized');
  const data = loadData();
  const org = {
    id: Date.now(),
    user_id: user.id,
    organization_name: formData.get('organization_name'),
    organization_type: formData.get('organization_type'),
    category: formData.get('category'),
    logo: formData.get('logo') ? 'mock-logo.jpg' : null,
    status: 'pending',
  };
  data.organizers.push(org);
  user.is_organizer = true; // mark as organizer
  saveData(data);
  return { message: 'Request submitted successfully' };
};

// 4. Events
export const mockGetEvents = async (params) => {
  await delay(500);
  const data = loadData();
  let events = data.events;
  // Apply filters
  if (params.category) {
    events = events.filter(e => e.category === params.category);
  }
  if (params.location) {
    events = events.filter(e => e.location.toLowerCase().includes(params.location.toLowerCase()));
  }
  if (params.keyword) {
    events = events.filter(e => e.title.toLowerCase().includes(params.keyword.toLowerCase()));
  }
  // Sort
  if (params.sort_by === 'date') {
    events.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (params.sort_by === 'ticket_price') {
    events.sort((a, b) => (a.is_paid ? a.ticket_price : 0) - (b.is_paid ? b.ticket_price : 0));
  } else { // popularity default
    // just keep order
  }
  // Pagination (simple)
  const page = parseInt(params.page) || 1;
  const perPage = 6;
  const total = events.length;
  const last_page = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const paginated = events.slice(start, start + perPage);
  return {
    data: paginated,
    current_page: page,
    last_page: last_page,
    total: total,
  };
};

export const mockGetEvent = async (id) => {
  await delay(400);
  const data = loadData();
  const event = data.events.find(e => e.id === parseInt(id));
  if (!event) throw new Error('Event not found');
  // Add tickets count
  const tickets = data.tickets.filter(t => t.event_id === event.id);
  event.tickets_count = tickets.length;
  // Add organizer info
  const organizer = data.users.find(u => u.id === event.organizer_id);
  event.organizer = organizer ? { name: organizer.name } : { name: 'SAFEX' };
  return event;
};

export const mockCreateEvent = async (token, formData) => {
  await delay(800);
  const user = getCurrentUser(token);
  if (!user) throw new Error('Unauthorized');
  // Check if user is organizer
  const data = loadData();
  const org = data.organizers.find(o => o.user_id === user.id);
  if (!org) throw new Error('You must be an organizer to create events');
  const newEvent = {
    id: Date.now(),
    title: formData.get('title'),
    category: formData.get('category'),
    date: formData.get('date'),
    description: formData.get('description'),
    location: formData.get('location'),
    image: formData.get('image') ? 'mock-event.jpg' : null,
    ticket_limit: parseInt(formData.get('ticket_limit')),
    is_paid: formData.get('is_paid') === '1',
    ticket_price: formData.get('ticket_price') ? parseFloat(formData.get('ticket_price')) : 0,
    organizer_id: user.id,
  };
  data.events.push(newEvent);
  saveData(data);
  return { message: 'Event created successfully', event: newEvent };
};

export const mockBuyTicket = async (token, eventId) => {
  await delay(600);
  const user = getCurrentUser(token);
  if (!user) throw new Error('Unauthorized');
  const data = loadData();
  const event = data.events.find(e => e.id === parseInt(eventId));
  if (!event) throw new Error('Event not found');
  // Check if tickets available
  const ticketsSold = data.tickets.filter(t => t.event_id === event.id).length;
  if (ticketsSold >= event.ticket_limit) {
    throw new Error('Tickets sold out');
  }
  const ticket = {
    id: Date.now(),
    event_id: event.id,
    user_id: user.id,
    bought_at: new Date().toISOString(),
  };
  data.tickets.push(ticket);
  saveData(data);
  return { message: 'Ticket bought successfully' };
};

// 5. Tickets
export const mockGetTickets = async (token) => {
  await delay(500);
  const user = getCurrentUser(token);
  if (!user) throw new Error('Unauthorized');
  const data = loadData();
  const userTickets = data.tickets.filter(t => t.user_id === user.id);
  // Enrich with event data
  const ticketsWithEvents = userTickets.map(t => {
    const event = data.events.find(e => e.id === t.event_id);
    return { ...t, event };
  });
  return { tickets: ticketsWithEvents };
};

// 6. Dashboard summary
export const mockDashboardSummary = async (token) => {
  await delay(500);
  const user = getCurrentUser(token);
  if (!user) throw new Error('Unauthorized');
  const data = loadData();
  // Events created by this organizer
  const myEvents = data.events.filter(e => e.organizer_id === user.id);
  const totalEvents = myEvents.length;
  const totalRegistrations = data.tickets.filter(t => {
    const ev = data.events.find(e => e.id === t.event_id);
    return ev && ev.organizer_id === user.id;
  }).length;
  // next event
  const now = new Date();
  const upcoming = myEvents
    .filter(e => new Date(e.date) > now)
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
  const avgParticipation = totalEvents > 0 ? (totalRegistrations / totalEvents) * 10 : 0; // arbitrary
  const eventsStats = myEvents.map(e => ({
    title: e.title,
    date: e.date,
    location: e.location,
    ticket_limit: e.ticket_limit,
    registrations: data.tickets.filter(t => t.event_id === e.id).length,
    participation_rate: e.ticket_limit > 0 ? (data.tickets.filter(t => t.event_id === e.id).length / e.ticket_limit) * 100 : 0,
  }));
  return {
    summary: {
      total_events: totalEvents,
      total_registrations: totalRegistrations,
      avg_participation_rate: avgParticipation,
      next_event: upcoming ? { date: upcoming.date } : null,
    },
    events_stats: eventsStats,
  };
};