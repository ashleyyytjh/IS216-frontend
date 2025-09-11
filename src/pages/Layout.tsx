
import Navbar from "@/components/ui/navbar"
import { Outlet } from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner"

const Layout = () => {
    return (
        <>
            <Navbar/>
            <Outlet/>
            <Toaster/>
        </>
    )
}

export default Layout