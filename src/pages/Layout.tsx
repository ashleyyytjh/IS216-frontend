
import Navbar from "@/components/ui/navbar"
import { Outlet } from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner"
import Footer from "@/components/Footer"

const Layout = () => {
    return (
        <>
            <Navbar/>
            <Outlet/>
            <Footer/>
            <Toaster position="top-center" richColors />
        </>
    )
}

export default Layout