"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { getCurrentUser, signOut } from "aws-amplify/auth";
import type { User } from "@/types/types";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { getUser } from "@/services/UserService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { getAvatarFallback } from "@/utils/util";

const userNavigationItems = [
  { name: "Explore", href: "/explore" },
  { name: "Create", href: "/create" },
  { name: "Dashboard", href: "/dashboardSeller" },
  { name: "Forum", href: "/forum" },
  { name: "Roadmap", href: "/roadmap" },
];
const guestNavigationItems = [
  { name: "Explore", href: "/explore" },
  { name: "Roadmap", href: "/roadmap" },

];
const navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null); // Initialize user state as null
  const [image, setImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [amplifyUser, setAmplifyUser] = useState<User | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [amplifyUser, resp] = await Promise.all([getCurrentUser(), getUser()]);
        setAmplifyUser(amplifyUser);
        setUser(resp as User);
        setImage(resp.imageUrl);
      } catch {}
    };
    fetchUserData();
    setLoading(false);

  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      // setUser(null);
      setAmplifyUser(null);
      localStorage.clear();
      toast.success("Successfully signed out");

      setTimeout(() => {
        window.location.href = "/home";
      }, 500);
    } catch (error) {
      console.log("error signing out: ", error);
    }
  };
  return (
    loading ? <div></div> :
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="pl-18">
                <Menu className="h-6 w-6" />
                <div className="flex items-center space-x-2">
                  <div className="h-7 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">
                      ON
                    </span>
                  </div>
                  <span className="font-bold text-xl">Onlynotes</span>
                </div>
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-[300px] sm:w-[400px] pl-3">
              <SheetTitle className="pt-5 pl-3">
                <a href="/home" className="flex items-center space-x-2">
                  <div className="h-7 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">
                      ON
                    </span>
                  </div>
                  <span className="font-bold text-xl">Onlynotes</span>
                </a>
              </SheetTitle>
              <div className="flex flex-col space-y-4 mt-8 pl-2">
                {(amplifyUser ? userNavigationItems : guestNavigationItems).map((item) => {
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        className="text-foreground hover:text-primary transition-colors duration-200 font-medium text-lg py-2"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </a>
                    );
                })}

                {!amplifyUser ? (
                  <a
                    href="/login"
                    className="text-foreground hover:text-primary font-medium text-lg py-2 md:hidden"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </a>
                ) : (
                  <>
                    <a
                      href="/profile"
                      className="text-foreground hover:text-primary font-medium text-lg py-2 md:hidden"
                      onClick={() => setIsOpen(false)}
                    >
                      Profile
                    </a>
                    <a
                      onClick={() => {
                        handleSignOut();
                        setIsOpen(false);
                      }}
                      className="text-destructive hover:text-primary font-medium text-lg py-2 md:hidden"
                    >
                      Sign Out
                    </a>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* The code here is for the main nav bar. text align might go here. */}
          <div className="hidden md:flex flex-1 items-center space-x-8 text-[#0f172b] text-center mr-auto ml-auto">
            <a href="/home" className="flex items-center space-x-2">
              <div className="h-7 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground text-sm px">ON</span>
              </div>
              <span className="font-bold text-xl pr-12 ">OnlyNotes</span>
            </a>
            {(amplifyUser ? userNavigationItems : guestNavigationItems).map((item) => {
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
          <div className="hidden md:block">
            {!amplifyUser ? (
              <Button>
                <Link className="text-sm" to="/login">
                  Login
                </Link>
              </Button>
            ) : (
              <div className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="rounded-full focus-visible:ring-2 focus-visible:ring-ring">
                      
                      <Avatar className="h-10 w-10 shrink-0 overflow-hidden">
                        {/* <AvatarImage
                          src={image}
                          alt={user?.fullName ?? "User"}
                          loading="lazy"
                          className="object-cover opacity-0 transition-opacity duration-700"
                          onLoad={(e) => e.currentTarget.classList.remove("opacity-0")}
                        /> */}
                        <AvatarFallback>
                          {getAvatarFallback(user?.fullName ?? "")}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      <h3>{user?.fullName}</h3>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="py-0">
                      <Button variant="link" asChild className="p-0">
                        <Link className="text-sm" to="/profile">
                          Profile
                        </Link>
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-0">
                      <Button
                        size="sm"
                        variant="link"
                        className="!font-medium p-0"
                        onClick={handleSignOut}
                      >
                        Sign out
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default navbar;
