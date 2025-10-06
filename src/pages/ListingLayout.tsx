import Navbar from "@/components/ui/navbar"
import { Outlet } from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner"

const ListingLayout = () => {
    return (
        <>
            <Navbar/>
            <Outlet/>
            <Toaster position="bottom-right" expand={true} richColors />
        </>
    )
}

export default ListingLayout