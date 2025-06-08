import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import OtpVerification from './pages/OtpVerification';
import Profile from './pages/Profile';
import './App.css'; 
import Usermanager from './pages/Usermanager.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<OtpVerification />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/usermanager" element={<Usermanager />} />
    </Routes>
   
  );
}

export default App;
