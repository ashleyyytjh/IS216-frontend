import './App.css'

import Home from './pages/Home'
import Layout from './pages/Layout'
import LoginPage from './pages/Login'
import Explore from './components/ProductList'
import {Routes, Route} from 'react-router-dom'
import Signup from './pages/Signup'
import OrderManage from './pages/OrderManage'
import AmplifyLogin from './pages/AmplifyLogin'
import { Amplify } from 'aws-amplify';
import ProtectedRoute from './components/protectedRoute'

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID,
    },
  },
});
import OrderDispute from './pages/OrderDispute'
import OrderTrack from './pages/OrderTrack'
import ReturnRefund from './pages/ReturnRefund'
import OrderDetails from './pages/OrderDetails'
import Upload from './pages/Upload';
import Profile from './pages/Profile'
import Error from './pages/ErrorPage'
import AccountCreation from './pages/AccountCreation'

function App() {
    return (
      <>
        <Routes>
          <Route path = '/'  element={<Layout/>}> 
              <Route path="/" element={<Home/>}/>
              <Route path="/explore" element={<Explore/>}/>
              <Route path ="/login" element={<AmplifyLogin/>}/>  
              <Route path="/signup" element={<Signup/>}/>
              <Route path="/ordermanage" element={<OrderManage/>}/>
              <Route path="/orderdispute" element={<OrderDispute/>}/>
              <Route path="/ordertrack" element={<OrderTrack/>}/>
              <Route path="/returnrefund" element={<ReturnRefund/>}/>
              <Route path="/orderdetails" element={<OrderDetails/>}/>
              <Route path ="/accountCreation" element={<AccountCreation/>}/>
              <Route path="/upload" element={<Upload/>}/>
              <Route path="/profile" element={<Profile/>}/>
              <Route path="/error" element={<Error/>}/>
              {/* Protected Routes */}
              <Route element={<ProtectedRoute/>}>
                    <Route path="/test" element={<LoginPage />} />
              </Route>
            
                
            
            </Route>
        </Routes>
      </>
    )
}

export default App


        //I commented this out to put my components (we can comment back if we wanna change)
    //   <div className="flex items-center justify-center h-dvh bg-background">
    //     <div className="text-center space-y-6">
    //       <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Welcome to XXXX</h1>
    //       <p className="text-lg text-muted-foreground max-w-[600px] mx-auto">
    //         Get started by logging in to your account and explore our market place.
    //       </p>
    //       <Button color={'primary'}  >
    //           Login
    //       </Button>
    //     </div>
    // </div>