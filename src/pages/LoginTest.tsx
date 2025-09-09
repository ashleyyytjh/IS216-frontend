
import { Authenticator, Button, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const LoginTest = () => {
  return (
    <Authenticator className='min-h-svh'>
      {({ signOut, user }) => (
        <main>
          <Heading level={1}>Hello {user?.username}</Heading>
          <Button onClick={signOut}>Sign out</Button>
        </main>
      )}
    </Authenticator>
  );
}

export default LoginTest
