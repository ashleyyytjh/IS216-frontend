import Navbar from "@/components/ui/navbar";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/Footer";



const Layout = () => {
  return (
    
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-center" expand={true} richColors />
    </div>
  );
};

export default Layout;
