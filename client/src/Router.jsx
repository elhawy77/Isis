import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const MainRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div>
      {/* Main Routes */}
      {location.pathname === '/' && <LandingPageRoute navigate={navigate} token={token} />}
      {location.pathname === '/admin' && (user.isAdmin ? 'Admin Dashboard' : 'Not Authorized')}
    </div>
  );
};

export default MainRouter;
