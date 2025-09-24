import "./App.css";

import Layout from "./pages/Layout";
import LoginPage from "./pages/Login";
import Explore from "./pages/Explore";
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import OrderManage from "./pages/OrderManage";
import AmplifyLogin from "./pages/AmplifyLogin";
import { Amplify } from "aws-amplify";
import ProtectedRoute from "./components/protectedRoute";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID,
    },
  },
});
import OrderDispute from "./pages/OrderDispute";
import OrderTrack from "./pages/OrderTrack";
import ReturnRefund from "./pages/ReturnRefund";
import OrderDetails from "./pages/OrderDetails";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import Error from "./pages/ErrorPage";
import AccountCreation from "./pages/AccountCreation";
import Welcome from "./pages/Welcome";
import NewHome from './pages/NewHome'
import Listing from "./pages/Listing";
import Payment from "./pages/Payment";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Welcome />} />

        <Route path="/" element={<Layout />}>
          <Route path="/home" element={<NewHome />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/listings/:id" element={<Listing />} />
          <Route path="/login" element={<AmplifyLogin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/ordermanage" element={<OrderManage />} />
          <Route path="/orderdispute" element={<OrderDispute />} />
          <Route path="/ordertrack" element={<OrderTrack />} />
          <Route path="/returnrefund" element={<ReturnRefund />} />
          <Route path="/orderdetails" element={<OrderDetails />} />
          <Route path="/accountCreation" element={<AccountCreation />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/profile" element={<Profile />} />
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/paymentSuccessful" element={<Payment/>}/>
            <Route path="/test" element={<LoginPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
}

export default App;
