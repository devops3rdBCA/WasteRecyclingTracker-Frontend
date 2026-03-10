import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import FamilyDashboard from './components/FamilyDashboard';
import CenterDashboard from './components/CenterDashboard';
import StatisticsDashboard from './components/StatisticsDashboard';
import Navbar from './components/Navbar';

const App = () => {
  const [role, setRole] = useState(null);
  const [familyName, setFamilyName] = useState('');

  const handleLogin = (selectedRole, name = '') => {
    setRole(selectedRole);
    setFamilyName(name);
  };

  const handleLogout = () => {
    setRole(null);
    setFamilyName('');
  };

  return (
    <BrowserRouter>
      <Navbar role={role} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
        <Route
          path="/family"
          element={
            role === 'family' ? <FamilyDashboard familyName={familyName} /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/center"
          element={role === 'center' ? <CenterDashboard /> : <Navigate to="/" replace />}
        />
        <Route path="/statistics" element={<StatisticsDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
