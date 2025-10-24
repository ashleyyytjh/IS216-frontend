import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Calendar, Mail, User } from 'lucide-react';
function ProfileHeader(currentUser) {
    currentUser = currentUser['current']
    console.log(localStorage)
    return (
        <Card className="flex flex-col md:flex-row mt-4 ml-8 mr-8 pl-8 pr-8 relative transition-all duration-300 hover:shadow-lg">
            <div className="text-center md:text-left">
                <Avatar className="w-20 h-20 inline-block md:ml-0 mr-0">
                    <AvatarImage src={currentUser.imageUrl} />
                    <AvatarFallback>
                        <User className="w-8 h-8 text-gray-500" />
                    </AvatarFallback>
                </Avatar>
            </div>

            <div className="text-center mt-2 md:text-left align-items-left">
                <h1 className="text-3xl font-extrabold mb-3 text-center md:text-left">{currentUser.fullName ?? currentUser.username}</h1>
                <p className="text-md mb-3">{currentUser.major} Student</p>
                <div className="flex flex-col gap-y-3">
                        <div className="flex items-center justify-center lg:justify-start gap-x-2 w-full">
                            <Mail className="hidden md:inline w-5 h-5 shrink-0 text-gray-700" />
                            <p className="text-sm text-center lg:text-left break-all">
                                {currentUser.email}
                            </p>
                    </div>

                        <div className="flex items-center lg:justify-start gap-x-2 w-full [@media(max-width:767px)]:justify-center">
                            <Calendar className="hidden md:inline w-5 h-5 shrink-0 text-gray-700" />
                        <p className="text-sm text-center lg:text-left break-all">
                            Year {currentUser.yearOfStudy} Student
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    )
}
export default ProfileHeader;