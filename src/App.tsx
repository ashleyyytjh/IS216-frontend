import "./App.css";

import Layout from "./pages/Layout";
import LoginPage from "./pages/Login";
import Explore from "./pages/Explore";
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
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
import Refund from "./pages/Refund";
import OrderDetails from "./pages/OrderDetails";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import Error from "./pages/ErrorPage";
import AccountCreation from "./pages/AccountCreation";
import Welcome from "./pages/Welcome";
import NewHome from './pages/NewHome'
import DashboardSeller from "./pages/dashboardSeller";
import Listing from "./pages/Listing";
import UserEdit from "./pages/Editor";
import Payment from "./pages/Payment";
import { PaymentSuccess } from "./pages/PaymentSuccessful";
import ListingLayout from "./pages/ListingLayout";
import AnnotationComponent from "./pages/Annotation";
import { PaymentUnsuccessful } from "./pages/PaymentUnsuccessful";
import EditPage from "./pages/Editor";
import UploadStatus from "./pages/UploadStatus";
import ForumPage from "./pages/ForumLayout";
import ForumPageLayout from "./pages/ForumLayout";
import { TooltipProvider } from "@/components/ui/tooltip";
import ForumHome from "./pages/ForumHome";
import PdfAnnotator from "./pages/Sample";

function App() {
    return (
      <>
        <Routes>
          <Route path="/" element={<Welcome/>}/>
          <Route path = '/'  element={<Layout/>}> 
              <Route path="/home" element={<NewHome/>}/>

              <Route path="/explore" element={<Explore/>}/>
              <Route path ="/login" element={<AmplifyLogin/>}/>  
              <Route path="/signup" element={<Signup/>}/>
              <Route path="/dashboardSeller" element={<DashboardSeller/>}/>
              <Route path="/refund/:id" element={<Refund/>}/>
              <Route path ="/accountCreation" element={<AccountCreation/>}/>
              <Route path="/upload" element={<Upload/>}/>
              <Route path="/upload/:id" element={<UploadStatus/>}/>
              <Route path="/profile" element={<Profile/>}/>
              <Route path="/orderdetails/:id" element={<OrderDetails />} />
              <Route path="/writeNotes" element={<EditPage/>} />
              <Route path="/editNote/:id" element={<EditPage/>} />
              <Route path="/sample/:noteId" element={<PdfAnnotator/>}/>
              {/* Protected Routes */}
              <Route element={<ProtectedRoute/>}>
                    <Route path="/test" element={<LoginPage />} />
                    {/* <Route path="/profile" element={<Profile/>}/> */}
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/paymentSuccess" element={<PaymentSuccess />} />
                    <Route path="/paymentUnsuccessful" element={<PaymentUnsuccessful />} />
                    <Route path="/forum" element={<ForumPageLayout />}>
                      <Route index element={<ForumHome />} />
                      <Route path=":noteId" element={<AnnotationComponent />} />
                    </Route>
              </Route>
          </Route>
          {/* Listing required custom footer layout */}
          <Route element={<ListingLayout />}>
            <Route path="/listings/:id" element={<Listing />} /></Route>
            <Route path="*" element={<Error />} />
        </Routes>
      </>
    )
}

export default App;
