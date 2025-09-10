import { useState } from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
function ProfileHeader() {
    const [isView, setIsView] = useState(true)
    return (
        <Card className="flex flex-col justify-content-center md:flex-row mt-4 ml-8 mr-8 pl-8 pr-8 relative">
            <Avatar className="w-30 h-30 justify-self-center md:ml-0 mr-0">
                <AvatarImage src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp" />
            </Avatar>

            <div className="text-center mt-6 md:text-left align-items-left">
                {
                    isView ?
                        (
                            <>
                                <h1 className="text-3xl font-extrabold mb-2">John Doe</h1>
                                    <p className="text-md">john.doe@gmail.com</p>
                            </>

                        ) :
                        (
                            <>
                                <h1 className="text-3xl font-extrabold mb-2">John Test</h1>
                                    <p className="text-md">john.doe@gmail.com</p>
                            </>
                        )
  
                }

            </div>
            <div className="absolute right-5">
                <Button onClick={() => { setIsView(!isView) }}>
                    {isView ? "Edit Details" : "Cancel"}
                </Button>
            </div>
        </Card>
    )
}
export default ProfileHeader;