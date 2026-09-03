# EventSphere – Frontend

![React](https://img.shields.io/badge/React-19.0.0-blue)
![Vite](https://img.shields.io/badge/Vite-6.1.0-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0.8-teal)
![License](https://img.shields.io/badge/License-MIT-green)

**EventSphere** is a modern event management platform enabling users to discover events, register for tickets, and manage their participation, while organizers can create, publish, and monitor events through a dedicated dashboard.

The frontend is built with **React 19**, **Vite**, and **Tailwind CSS**, with an integrated mock service layer for standalone demos and development.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Backend Integration](#backend-integration)
- [Mock Service Layer](#mock-service-layer)
- [User Roles](#user-roles)
- [License](#license)

---

## Overview

EventSphere provides a complete solution for online event management:

- Users can explore events and register for tickets.
- Organizers can create events, manage capacity, and view statistics.
- Organizer access is granted after submitting an application.
- The frontend operates in two modes:
  - **Standalone Demo** – Uses the built-in mock service with localStorage persistence.
  - **Production Mode** – Connects to the Laravel backend REST API.

---

## Features

### User Features

- User registration and authentication with email verification
- Browse and search events by category, keyword, location, and date
- View detailed event information (date, location, ticket availability)
- Register for events and receive tickets
- Manage registered events (My Tickets)
- Profile management with photo upload and bio editing

### Organizer Features

- Organizer application via a dedicated multi-step form
- Approval workflow (simulated in mock mode)
- Create and publish events with:
  - Title, description, and category
  - Date, time, and location
  - Ticket limit and pricing
- Organizer dashboard with:
  - Total events, total registrations, and participation rate
  - Upcoming event overview and event statistics

---

## Tech Stack

### Core

- React 19 – Modern UI library with concurrent rendering
- Vite 6 – Next-generation frontend build tool
- Tailwind CSS 4 – Utility-first CSS framework
- React Router DOM 7 – Client-side routing

### UI & Animations

- GSAP – High-performance animations
- Recharts – Charting library for dashboards
- React Icons – Icon library

### HTTP Client

- Axios – HTTP client for API communication

### Development Tools

- ESLint – Code quality and consistency
- Vite Proxy – API request forwarding for development
- Hot Module Replacement – Fast development experience

---

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

```bash
cd frontend
npm install
npm run dev
```

The application will start at `http://localhost:5173`.

### Environment Variables

Create a `.env` file in the frontend root (optional for mock mode):

```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## Backend Integration

The frontend connects to a Laravel backend via REST API. The API client is located at `src/api/client.js`.

### Switching from Mock to Live Backend

Open `src/api/client.js` and set the `USE_MOCK` flag:

```javascript
const USE_MOCK = false;   // Set to false to use the real backend
```

When `USE_MOCK` is `false`, requests are sent to the Laravel backend endpoints. The base URL is taken from `VITE_API_BASE_URL`.

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/register` | POST | User registration |
| `/api/login` | POST | User authentication |
| `/api/email/resend` | POST | Resend verification email |
| `/api/email/verify` | GET | Email verification callback |
| `/api/profile` | GET, PUT, POST | Profile management |
| `/api/organizers/profile` | GET | Check organizer status |
| `/api/organizers/request` | POST | Organizer application |
| `/api/events` | GET, POST | Event listing and creation |
| `/api/events/{id}` | GET | Single event details |
| `/api/events/{id}/buy-ticket` | POST | Ticket registration |
| `/api/tickets` | GET | User tickets |
| `/api/dashboard/summary` | GET | Organizer statistics |

---

## Mock Service Layer

The application includes a complete mock service layer (`src/services/mockApi.js`) that simulates the entire backend behavior without requiring a live server.

### Features

- **Persistent Storage** – Data is stored in the browser's `localStorage` under the key `eventsphere_mock`. User sessions, created events, and ticket registrations persist across page reloads.
- **Full CRUD Operations** – All API endpoints are implemented with realistic responses and network delay simulation.
- **Authentication Simulation** – Login, registration, and email verification are fully functional.
- **Organizer Workflow** – The organizer application and approval process is simulated.
- **Seed Data** – Pre-populated events, users, and tickets are generated on first load via `seedData.js`.

### Using the Mock Service

1. Ensure `USE_MOCK = true` in `src/api/client.js`.
2. Start the frontend with `npm run dev`.
3. The mock service automatically seeds initial data (6 events across Science, Sports, and Medical categories using local assets).
4. All interactions (login, signup, event creation, ticket purchase) work without any backend.

### Resetting Mock Data

To reset the mock data to its initial state:

1. Open browser DevTools → Application → Local Storage.
2. Delete the key `eventsphere_mock`.
3. Refresh the page – the seed data will be regenerated.

---

## User Roles

### Regular User

- Create an account and verify email
- Explore events with search and filters
- Register for events (free ticket system)
- View and manage registered events
- Update profile information and photo
- Apply to become an organizer

### Organizer

- Submit an organizer application via a multi-step form
- After approval (simulated), access the event creation form
- Create and manage events with full details
- View dashboard with event statistics and participation data

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.