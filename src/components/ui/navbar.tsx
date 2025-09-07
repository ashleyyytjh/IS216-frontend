"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Notes Repository", href: "/notes" },
    { name: "Upload Notes", href: "/upload" },
    { name: "Contact", href: "/contact" },
]

const navbar = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">

                    <Sheet open={isOpen} onOpenChange={setIsOpen}>

                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                            <SheetTitle className="pt-5 pl-3">
                                <a href="/" className="flex items-center space-x-2">
                                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                                        <span className="text-primary-foreground font-bold text-sm">L</span>
                                    </div>
                                    <span className="font-bold text-xl">Logo</span>
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
                                <div className="pt-4 border-t">
                                    <Button className="w-full" onClick={() => setIsOpen(false)}>
                                        Get Started
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                    <a href="/" className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-sm">L</span>
                        </div>
                        <span className="font-bold text-xl">Logo</span>
                    </a>
                    <div className="hidden md:flex items-center space-x-8 text-[#00AFF0]">
                        {navigationItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="hover:text-foreground transition-colors duration-200 font-medium text-[#00AFF0]/80"
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>

                    <div className="hidden md:flex">
                        <Button>Login</Button>
                    </div>


                </div>
            </div>
        </nav>
    )
}

export default navbar;