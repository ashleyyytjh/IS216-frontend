"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {  Menu } from "lucide-react"
import { Link } from 'react-router-dom';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import type { User } from "@/types/types"
import { useNavigate } from "react-router-dom"
const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Notes Repository", href: "/explore" },
    { name: "Upload Notes", href: "/upload" }
]

const navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [user, setUser] = useState<User | null>(null); // Initialize user state as null
    const navigate = useNavigate();
    useEffect(() => {
        const checkUser = async () => {
            try {
                const userData = await getCurrentUser(); 
                console.log("Authenticated User:", userData);
                setUser(userData); 
            } catch (error) {
                console.log("No current user");
                setUser(null); 
            }
        };
        checkUser();
    }, [user]);

    const handleSignOut = async () => {
        try {
            await signOut();
            setUser(null); // Clear the user state locally
            navigate('/'); // Redirect to the homepage after sign out
        } catch (error) {
            console.log('error signing out: ', error);
        }
    };
    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">

                    <Sheet open={isOpen} onOpenChange={setIsOpen}>

                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon" className="pl-18">
                                <Menu className="h-6 w-6" />
                                 <div className="flex items-center space-x-2">
                                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                                        <span className="text-primary-foreground font-bold text-sm">L</span>
                                    </div>
                                    <span className="font-bold text-xl">Onlynotes</span>
                                </div>
                                

                            </Button>

                        </SheetTrigger>

                        <SheetContent side="left" className="w-[300px] sm:w-[400px] pl-3">
                            <SheetTitle className="pt-5 pl-3">
                                <a href="/" className="flex items-center space-x-2">
                                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                                        <span className="text-primary-foreground font-bold text-sm">L</span>
                                    </div>
                                    <span className="font-bold text-xl">Onlynotes</span>
                                </a>

                            </SheetTitle>
                            <div className="flex flex-col space-y-4 mt-8 pl-2">
                                {navigationItems.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className="text-foreground hover:text-primary transition-colors duration-200 font-medium text-lg py-2"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item.name}
                                    </a>
                                ))}
                                <div className="pt-4 border-t flex-col space-y-4 pr-4">
                                    <Button className="w-full"> <Link to="/login">Login</Link></Button>
                        <Button className="w-full"><Link to="/signup">Sign up</Link></Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* The code here is for the main nav bar. text align might go here. */}
                    <div className="hidden md:flex flex-1 items-center space-x-8 text-[#0f172b] text-center mr-auto ml-auto">
                        <a href="/" className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-sm">L</span>
                            </div>
                            <span className="font-bold text-xl">OnlyNotes</span>
                        </a>
                        {navigationItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="hover:text-foreground transition-colors duration-200 font-medium text=[#0f172b]"
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                    <div>
                        { !user ? (
                            <Button>
                            <Link to="/login">Login</Link>
                            </Button>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Button>
                                <Link to="/profile">Profile</Link>
                                </Button>
                                <Button onClick={handleSignOut}>Sign out</Button>
                            </div>
                        )}
                    </div>
                   


                </div>
            </div>
        </nav>
    )
}

export default navbar;