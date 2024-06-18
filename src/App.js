import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/header';
import Sidebar from './components/aside';
import Home from './pages/admin/home';
import Users from './pages/admin/users';
import Chair from './pages/admin/chair';
import Events from './pages/admin/events';
import Given from './pages/admin/given';
import Login from './components/login';
import Reset from './components/reset';
import Code from './components/code';
import ResetPassword from './components/ResetPassword';
import OnePost from './pages/admin/onePost'; 
import OneUser from './pages/admin/oneUser'; 
import OneChair from './pages/admin/oneChair'; 
import Profile from './pages/admin/profile'; 
import Logout from './pages/admin/logout'; 
import './components/style.css';

const MainLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/Login' || location.pathname === '/reset' || location.pathname.startsWith('/code/') || location.pathname.startsWith('/resetPassword/');

  return (
    <div className="App">
      {!isLoginPage && <Header />}
      {!isLoginPage && <Sidebar />}
      <div className={`content-wrapper ${isLoginPage ? 'login-page' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/chair" element={<Chair />} />
          <Route path="/event" element={<Events />} />
          <Route path="/given" element={<Given />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/code/:email" element={<Code />} />
          <Route path="/resetPassword/:email" element={<ResetPassword />} />
          <Route path="/onePost/:id" element={<OnePost />} />
          <Route path="/oneChair/:id" element={<OneChair />} />
          <Route path="/oneUser/:id" element={<OneUser />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

export default App;
