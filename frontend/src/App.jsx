import { Routes, Route } from 'react-router-dom';
import React from 'react';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';


import './App.css'; 
import Usermanager from './pages/Usermanager.jsx';
import Notfoundpage from './pages/Notfoundpage.jsx';
import VerifyOtp from './pages/VerifyOtp.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/usermanager" element={<Usermanager />} />
      <Route path="*" element={<Notfoundpage />} />
      
    </Routes>
   
  );
}

export default App;
