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
import NewHome from "./pages/NewHome";
import DashboardSeller from "./pages/dashboardSeller";
import Listing from "./pages/Listing";
import Payment from "./pages/Payment";
import { PaymentSuccess } from "./pages/PaymentSuccessful";
import ListingLayout from "./pages/ListingLayout";
import AnnotationComponent from "./pages/Annotation";
import { PaymentUnsuccessful } from "./pages/PaymentUnsuccessful";
// import EditPage from "./pages/Editor";
import UploadStatus from "./pages/UploadStatus";
// import ForumPage from "./pages/ForumLayout";
import ForumPageLayout from "./pages/ForumLayout";
import ForumHome from "./pages/ForumHome";
// import PdfAnnotator from "./pages/Sample";
import Create from "./pages/Create";
import Compose from "./pages/Compose";
// import Modules from "./pages/Roadmap";
import UserArticle from "./pages/UserArticle";
import RoadmapPage from "./pages/Roadmap";
import ComposeEdit from "./pages/ComposeEdit";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/" element={<Layout />}>
          <Route path="/home" element={<NewHome />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/login" element={<AmplifyLogin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/create" element={<Create />} />
          {/* <Route path="/writeNotes" element={<EditPage />} />
          <Route path="/editNote/:id" element={<EditPage />} /> */}
          <Route path="/roadmap" element={<RoadmapPage />} />
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboardSeller" element={<DashboardSeller />} />
            <Route path="/refund/:id" element={<Refund />} />
            <Route path="/accountCreation" element={<AccountCreation />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/upload/:id" element={<UploadStatus />} />
            <Route path="/article/:id" element={<UserArticle />} />
            <Route path="/compose/edit/:id" element={<ComposeEdit />} />
            <Route path="/compose" element={<Compose />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orderdetails/:id" element={<OrderDetails />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/paymentSuccess" element={<PaymentSuccess />} />
            <Route
              path="/paymentUnsuccessful"
              element={<PaymentUnsuccessful />}
            />
            <Route path="/forum" element={<ForumPageLayout />}>
              <Route index element={<ForumHome />} />
              <Route path=":noteId" element={<AnnotationComponent />} />
            </Route>
          </Route>
        </Route>
        {/* Listing required custom footer layout */}
        <Route element={<ListingLayout />}>
          <Route path="/listings/:id" element={<Listing />} />
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
}

export default App;
