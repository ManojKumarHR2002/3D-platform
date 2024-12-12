import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import AuthenticationPage from './pages/AuthenticationPage/AuthenticationPage';
import DashboardPage from './pages/DashboardPage/DashboardPage'
import CanvasPage from './pages/CanvasPage/CanvasPage'


function App() {
  return (
    <Router>
      <Routes>
        {/* Define the route for LandingPage */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Define the route for SignUp page */}
        {/* <Route path="/signup" element={<AuthenticationPage />} /> */}
        {/* <Route path="/login" element={<AuthenticationPage />} /> */}
        <Route path="/auth/:authType" element={<AuthenticationPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/canvas" element={<CanvasPage />} />

      </Routes>
    </Router>
  );
}

export default App;
