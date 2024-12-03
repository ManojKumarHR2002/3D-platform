import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/Landing/LandingPage';
import SignUpPage from './pages/SignUp/SignUpPage';
import LogInPage from './pages/LogIn/LogInPage';
import DashboardPage from './pages/Dashboard/DashboardPage/DashboardPage'

function App() {
  return (
    <Router>
      <Routes>
        {/* Define the route for LandingPage */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Define the route for SignUp page */}
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />

      </Routes>
    </Router>
  );
}

export default App;
