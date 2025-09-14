import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { getCurrentUser } from 'aws-amplify/auth';
import { getUser } from '@/services/UserService';
import { toast } from 'sonner';
import { is } from 'date-fns/locale';

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // useEffect(() => {
  //     const checkUser = async () => {
  //     let isAmplifyUser : any;
  //         try {
  //             isAmplifyUser = await getCurrentUser(); // 2. Assign the value
  //             setAmplifyUser(isAmplifyUser);
  //             if (isAmplifyUser) {
  //                 console.log("Amplify user exists, attempting to fetch from DB");
  //                 const userDB = await getUser(); 
  //                 console.log("DB user exists");
  //                 setUser(userDB);
  //             }
  //         } catch (error) {
  //             if (isAmplifyUser) {
  //                 toast.warning("Please complete account creation");
  //                 console.log("Amplify user exists but not in DB, redirecting to account creation");
  //                 navigate('/accountCreation');
  //                 return;
  //             } 
  //         }
  //     };
  //     checkUser();
  // }, []);
  useEffect(() => {
    const checkAuthStatus = async () => {
      let isAmplifyUser : any;
      try {
        isAmplifyUser = await getCurrentUser();
        await getUser();
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

  return isAuthenticated ? <Outlet/> : null;
};

export default ProtectedRoute;
