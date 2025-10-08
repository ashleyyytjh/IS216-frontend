"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Link } from 'react-router-dom';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import type { User } from "@/types/types"
import { useNavigate } from "react-router-dom"
import { getUser } from "@/services/UserService"
import { toast } from "sonner";
import { set } from "date-fns"

const navigationItems = [
    // { name: "Home", href: "/home" },
    { name: "Explore", href: "/explore" },
    { name: "Upload", href: "/upload" },
    { name: "Dashboard", href: "/dashboardSeller" },
    { name: "Forum", href: "/forum" }

]

const navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [user, setUser] = useState<User | null>(null); // Initialize user state as null
    const [amplifyUser, setAmplifyUser] = useState<User | null>(null);
    const navigate = useNavigate();
    useEffect(() => {
        const checkUser = async () => {
            let isAmplifyUser: any;
            try {
                isAmplifyUser = await getCurrentUser(); // 2. Assign the value
                setAmplifyUser(isAmplifyUser);
            } catch (error) {
            }
        };
        checkUser();
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut();
            // setUser(null);
            setAmplifyUser(null);
            localStorage.clear();
            toast.success('Successfully signed out');

            setTimeout(() => {
                window.location.href = '/home';
            }, 500) 

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
                                        <span className="text-primary-foreground font-bold text-sm">N</span>
                                    </div>
                                    <span className="font-bold text-xl">Onlynotes</span>
                                </div>


                            </Button>

                        </SheetTrigger>

                        <SheetContent side="left" className="w-[300px] sm:w-[400px] pl-3">
                            <SheetTitle className="pt-5 pl-3">
                                <a href="/home" className="flex items-center space-x-2">
                                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                                        <span className="text-primary-foreground font-bold text-sm">N</span>
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
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* The code here is for the main nav bar. text align might go here. */}
                    <div className="hidden md:flex flex-1 items-center space-x-8 text-[#0f172b] text-center mr-auto ml-auto">
                        <a href="/home" className="flex items-center space-x-2">
                            <div className="h-6 w-6 rounded-lg bg-primary flex items-center justify-center">
                                <span className="text-primary-foreground text-sm">N</span>
                            </div>
                            <span className="font-bold text-xl pr-12 ">OnlyNotes</span>
                        </a>
                        {navigationItems.map((item) => {
                            if ((item.name === "Dashboard" || item.name === "Upload") && !amplifyUser) {
                                return null; // hide dashboard when user not logged in
                            }

                            return (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="hover:border-b-2 border-primary hover:text-foreground transition-colors duration-200 font-medium text-sm "
                                >
                                    {item.name}
                                </a>
                            );
                        })}
                    </div>
                    <div>
                        {!amplifyUser ? (
                            <Button>
                                <Link className="text-sm" to="/login">Login</Link>
                            </Button>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Button
                                    size={"sm"}
                                >
                                    <Link className="text-sm" to="/profile">Profile</Link>
                                </Button>
                                <Button   size={"sm"} onClick={handleSignOut}>
                                <p className="text-sm"> 
                                        Sign out
                                </p>
                                </Button>
                            </div>
                        )}
                    </div>



                </div>
            </div>
        </nav>
    )
}

export default navbar;