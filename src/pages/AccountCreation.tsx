import { UserCreationForm } from "@/components/user-creation-form"
import { getCurrentUser } from "aws-amplify/auth";
import { useEffect, useState } from "react"
import { User } from "@/types/types";

import { fetchUserAttributes } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import { RedirectOnLogin } from "./AmplifyLogin";
import { CardDescription } from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";

export default function AccountCreation() {
    const [user, setUser] = useState<User | null>(null);
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();

    const change = async () => {
        setIsSuccessful(true)
    }

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const timer = setTimeout(() => {
                    setProgress(40);
                }, 500)
                const amplifyUser = await getCurrentUser();
                const userAttributes = await fetchUserAttributes();
                console.log(userAttributes)
                const email = userAttributes.email;

                const newUser : User = {
                    username: amplifyUser.username,
                    email: email,
                }
                const timer3 = setTimeout(() => {
                    setProgress(100);
                }, 800)
                const timer2 = setTimeout(() => {
                    setUser(newUser);
                }, 1200)

                return () => {
                clearTimeout(timer);
                clearTimeout(timer2);
                clearTimeout(timer3);
                };

            } catch { navigate('/login'); }
        };
    
        checkAuthStatus();
    }, [])

    return ( 
        <main className=" bg-background w-full h-screen">  
        {
            !isSuccessful ? (
                user === null ? 
                <div className="flex flex-col justify-center items-center w-3/4  h-screen mx-auto ">    
                    <Progress className="w-3/4" value={progress} />
                    <CardDescription>Loading User Details...</CardDescription>
                </div>
             :
                        <div className="mx-auto max-w-2xl sm:pt-20">
                            <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-foreground mb-2">Create User Account</h1>
                            </div>
                            <UserCreationForm user={user} changeSuccessfulState={()=> change()} />
                        </div>
            ) : (
                    <div className="bg-muted flex min-h-svh  flex-col items-center justify-center p-6 md:p-10">
                        <div className="flex w-full max-w-sm flex-col gap-6 justify-center">
                            <div className=' flex justify-center mb-30 w-300px'>              
                                <RedirectOnLogin user={user!} />
                            </div>
                        </div>
                    </div>
            )
        }
        </main>
    
     
    )
}
