import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { getCurrentUser } from 'aws-amplify/auth';
import { getUser } from '@/services/UserService';
import { toast } from 'sonner';
import { User } from '@/types/types';
import { set } from 'date-fns';

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      let isAmplifyUser : any;
      try {
        isAmplifyUser = await getCurrentUser();
        // const user = await getUser();
        console.log(user)
        setUser(user);
        setIsAuthenticated(true);
      } catch (error) {

        setIsAuthenticated(false);
        if (isAmplifyUser) {
            toast.warning("Please complete account creation");
            console.log("Amplify user exists but not in DB, redirecting to account creation");
            navigate('/accountCreation');
            return;
        } 
        toast.error("You must be logged in to access this page");
        navigate('/login');
      }
    };

    checkAuthStatus();
  }, [navigate]);

  return isAuthenticated ? <Outlet context={{ user }}/> : null;
};

export default ProtectedRoute;
