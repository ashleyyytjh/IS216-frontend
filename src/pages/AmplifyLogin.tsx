
import { Authenticator, Button, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const RedirectOnLogin = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      console.log("User logged in:", user);
      // Redirects to the intended page or to home 
      navigate(location.state?.from || '/', { replace: true });
    }
  }, [user, navigate, location]);
    return null; 
  };


const AmplifyLogin = () => {
  return (
    <Authenticator className='min-h-svh'>
      {({user }) => (
        <main>
          {/* <Heading level={1}>Welcome {user?.username}</Heading> */}
          <RedirectOnLogin user={user} />
        </main>
      )}
    </Authenticator>
  );
}

export default AmplifyLogin
