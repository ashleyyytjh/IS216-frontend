import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { getCurrentUser } from 'aws-amplify/auth';

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        await getCurrentUser();
        setIsAuthenticated(true);
      } catch {
        alert("Please login.");
        navigate('/login'); // Redirect to your login page
      }
    };

    checkAuthStatus();
  }, [navigate]);

  return isAuthenticated ? <Outlet/> : null;
};

export default ProtectedRoute;
