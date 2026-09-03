// src/seedData.js
export const seedData = () => {
  const STORAGE_KEY = 'eventsphere_mock';
  if (localStorage.getItem(STORAGE_KEY)) return;

  const futureDate = (daysFromNow) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return d.toISOString();
  };

  const initialData = {
    users: [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        email_verified: true,
        token: null,
        is_organizer: true,
        profile_photo: null,
        phone_number: '+1 (555) 123-4567',
        location: 'New York, NY',
        bio: 'Event organizer & tech enthusiast.',
        notificationEnabled: true,
        payementMethode: [],
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        email_verified: true,
        token: null,
        is_organizer: false,
        profile_photo: null,
        phone_number: '+1 (555) 987-6543',
        location: 'Los Angeles, CA',
        bio: 'Creative professional.',
        notificationEnabled: true,
        payementMethode: [],
      },
    ],
    organizers: [
      {
        id: 1,
        user_id: 1,
        organization_name: 'EventSphere Inc.',
        organization_type: 'Enterprise',
        category: 'Conference,Workshop',
        logo: null,
        status: 'approved',
      },
    ],
    events: [
      // ----- SCIENCE (2 events, using ai.jpeg) -----
      {
        id: 101,
        title: 'Future of AI – Science Symposium',
        category: 'Science',
        date: futureDate(5),
        description: 'Join leading researchers to discuss breakthroughs in artificial intelligence and machine learning.',
        location: 'Boston, MA',
        image: 'ai.jpeg', 
        ticket_limit: 120,
        is_paid: true,
        ticket_price: 29.99,
        organizer_id: 1,
      },
      {
        id: 102,
        title: 'Astronomy Night: Stars & Galaxies',
        category: 'Science',
        date: futureDate(12),
        description: 'Telescope viewing, talks on exoplanets, and a Q&A with astrophysicists.',
        location: 'Tucson, AZ',
        image: 'hackthon.jpg', 
        ticket_limit: 80,
        is_paid: false,
        ticket_price: 0,
        organizer_id: 1,
      },

      // ----- SPORTS (2 events, using marathon.png) -----
      {
        id: 103,
        title: 'Marathon Training Bootcamp',
        category: 'Sports',
        date: futureDate(3),
        description: '4-week intensive training program with professional coaches and nutritionists.',
        location: 'Portland, OR',
        image: 'marathon.png', 
        ticket_limit: 50,
        is_paid: true,
        ticket_price: 49.99,
        organizer_id: 1,
      },
      {
        id: 104,
        title: 'City Basketball Tournament',
        category: 'Sports',
        date: futureDate(18),
        description: '3v3 tournament open to all skill levels. Prizes for winners and MVP awards.',
        location: 'Chicago, IL',
        image: 'marathon.png', 
        ticket_limit: 60,
        is_paid: true,
        ticket_price: 15.00,
        organizer_id: 1,
      },

      // ----- MEDICAL (2 events, using medical.jpeg) -----
      {
        id: 105,
        title: 'Health & Wellness Expo',
        category: 'Medical',
        date: futureDate(8),
        description: 'Free checkups, nutrition workshops, fitness demos, and health screenings.',
        location: 'Miami, FL',
        image: 'medical.jpeg', 
        ticket_limit: 100,
        is_paid: false,
        ticket_price: 0,
        organizer_id: 1,
      },
      {
        id: 106,
        title: 'Medical Innovation Conference',
        category: 'Medical',
        date: futureDate(22),
        description: 'Latest in medical devices, telemedicine, AI in healthcare, and surgical innovations.',
        location: 'San Diego, CA',
        image: 'medical.jpeg', 
        ticket_limit: 150,
        is_paid: true,
        ticket_price: 39.99,
        organizer_id: 1,
      },
    ],
    tickets: [
      { id: 1001, event_id: 103, user_id: 2, bought_at: new Date().toISOString() },
      { id: 1002, event_id: 105, user_id: 2, bought_at: new Date().toISOString() },
    ],
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
};