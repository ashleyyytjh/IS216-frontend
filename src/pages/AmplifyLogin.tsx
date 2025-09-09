
import { Authenticator, Button, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { GalleryVerticalEnd } from "lucide-react"
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';


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

  const components = {
    SignIn: {
      Header() {
        return (
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>
              Login with your email address and password
            </CardDescription>
          </CardHeader>
        );
      },

    },
    SignUp: {
      Header() {
        return (
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>
              Create new account with email address and password
            </CardDescription>
          </CardHeader>
        );
      }
    }
  }

  const formFields = {
    signIn: {
      username: {
        placeholder: 'Enter your test',
      },
    },
  }

const AmplifyLogin = () => {
  return (
    <div className="bg-muted flex min-h-svh  flex-col items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6  justify-center">
        <a href="#" className=" flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-xl text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <p className='text-2xl'>
            OnlyNotes
          </p>
        </a>
        <div className=' flex justify-center mb-30 w-300px'>
          <Authenticator className='rounded-lg' formFields={formFields}  components={components} >
              {({user }) => (
                <main>
                  {/* <Heading level={1}>Welcome {user?.username}</Heading> */}
                  <RedirectOnLogin user={user} />
                </main>
              )}
          </Authenticator>
        </div>
  
      </div>
    </div>
  );
}

export default AmplifyLogin
