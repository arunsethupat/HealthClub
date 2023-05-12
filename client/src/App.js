import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Register';
import MemberPage from './Components/MemberPage';
import Admin from './Components/Admin';

function App() {
  console.log('In App.js!')
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/memberPage" element={<MemberPage />} />
          <Route path="/adminPage" element={<Admin />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
