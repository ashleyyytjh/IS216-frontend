import { useState } from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import type { User } from '../types/types';
import { Calendar, Mail } from 'lucide-react';
function ProfileHeader(currentUser) {
    currentUser = currentUser['current']
    return (
        <Card className="flex flex-col md:flex-row mt-4 ml-8 mr-8 pl-8 pr-8 relative transition-all duration-300 hover:shadow-lg">
            <div className="text-center md:text-left">
                <Avatar className="w-20 h-20 inline-block md:ml-0 mr-0">
                    <AvatarImage src={currentUser.imageUrl} />
                </Avatar>
            </div>

            <div className="text-center mt-2 md:text-left align-items-left">
                <h1 className="text-3xl font-extrabold mb-3">{currentUser.fullName ?? currentUser.username}</h1>
                <p className="text-md mb-3">{currentUser.major} Student</p>
                <div className="flex flex-col gap-y-3">
                    <div className="flex gap-x-2 items-center">
                        <Mail />
                        <p className="text-sm">{currentUser.email}</p>
                    </div>
                    <div className="flex gap-x-2 items-center">
                        <Calendar />
                        <p className="text-sm">Year {currentUser.yearOfStudy} Student</p>
                    </div>
                </div>
            </div>
        </Card>
    )
}
export default ProfileHeader;