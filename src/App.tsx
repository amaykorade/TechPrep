import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { PrivateRoute } from './components/PrivateRoute';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { PracticePage } from './pages/PracticePage';
import { FeedbackPage } from './pages/FeedbackPage';
import { FeedbackHistoryPage } from './pages/FeedbackHistoryPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PricingPage } from './pages/PricingPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0B1120]">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route
            path="/practice"
            element={
              <PrivateRoute>
                <PracticePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/feedback/:sessionId"
            element={
              <PrivateRoute>
                <FeedbackPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/history"
            element={
              <PrivateRoute>
                <FeedbackHistoryPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}