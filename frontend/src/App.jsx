// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { seedData } from "../src/services/seedData"; 

// Pages
import { Home } from "./pages/Home";
import { Login } from "./pages/auth/Login";
import { Signup } from "./pages/auth/Signup";
import { Logout } from "./pages/auth/Logout";
import { EmailVerification } from "./pages/auth/EmailVerification";
import { EmailVerificationPrompt } from "./pages/auth/EmailVerificationPrompt";
import { Profile } from "./pages/Profile";
import { EventInfo } from "./pages/EventInfo";
import { ExplorePage } from "./pages/ExplorePage";
import { OrganizerForm } from "./pages/OrganizerForm";
import { EventForm } from "./pages/EventForm"; 
import { Dashboard } from "./pages/Dashboard";
import { MyTickets } from "./pages/MyTickets";

// Seed the mock database if empty (runs once)
seedData();

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/verify-email" element={<EmailVerificationPrompt />} />
        <Route path="/email/verify" element={<EmailVerification />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/events/:id" element={<EventInfo />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/organizer" element={<OrganizerForm />} />
        <Route path="/create-event" element={<EventForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-tickets" element={<MyTickets />} />
      </Routes>
    </Router>
  );
}

export default App;