
import { Authenticator, Button, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { GalleryVerticalEnd } from "lucide-react"
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getUser } from '@/services/UserService';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { User } from '@/types/types';

const components = {
  Header() {
    return (
        <a href="#" className="flex justify-center pb-5 items-center gap-2 self-center font-medium">
          <div className="bg-primary text-xl text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <p className="text-2xl">OnlyNotes</p>
        </a>
    );
  },
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
  signUp: {
    username: {
      label: 'Username',
      placeholder: 'Enter your username',
      required: true,
    },
    email: {
      label: 'Email',
      placeholder: 'Enter your email address',
      required: true,
    },
    password: {
      label: 'Password',
      placeholder: 'Enter your password',
      required: true,
    },
    confirm_password: {
      label: 'Confirm Password',
      placeholder: 'Confirm your password',
      required: true,
    },
  },
};

const AmplifyLogin = () => {
  return (
    <div className="bg-muted flex min-h-svh  flex-col items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6  justify-center">
        <div className=' flex justify-center mb-30 w-300px'>
          <Authenticator className='rounded-lg' formFields={formFields}  components={components} >
              {({user }) => (
                <main>
                  <RedirectOnLogin user={user} />
                </main>
              )}
          </Authenticator>
        </div>
  
      </div>
    </div>
  );
}

export const RedirectOnLogin = ({ user }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showRedirecting, setShowRedirecting] = useState<boolean>(false);

    useEffect(() => {
        let dbUser : User;
        const checkIfUserExistInDb = async () => {
          try {
            dbUser = await getUser();
            if (user && dbUser) {
              console.log('User logged in:', user);
              setShowRedirecting(true);
              const timer = setTimeout(() => {
                navigate(location.state?.from || '/home', { replace: true });
              }, 1500);
              return () => clearTimeout(timer);

            }
          } catch (error) {
            toast.error("Please enter your account details");
            navigate('/accountCreation', { replace: true });
            return;
          }
        }
        checkIfUserExistInDb()
  }, [user, navigate, location]);

   return (
    <>
      {showRedirecting && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [0.5, 1], opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="flex items-center justify-center"
        >
          <Heading level={1}>Welcome {user?.username}</Heading>
        </motion.div>
      )}
    </>
  );
};


export default AmplifyLogin
