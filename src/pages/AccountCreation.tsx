import { UserCreationForm } from "@/components/user-creation-form"
import { getCurrentUser } from "aws-amplify/auth";
import { useEffect, useState } from "react"
import { User } from "@/types/types";

import { fetchUserAttributes } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import { RedirectOnLogin } from "./AmplifyLogin";
// export type User = {
//     userId?: string;
//     username: string;
//     email?: string;
//     yearOfStudy?: number;
//     major?: string;
//     modules?: string[];
//     purchasedNotes?: string[];
// }
export default function AccountCreation() {
    const [user, setUser] = useState<User | null>(null);
    const [isSuccessful, setIsSuccessful] = useState(false)
    const navigate = useNavigate();

    const change = async () => {
        setIsSuccessful(true)
    }
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
            const amplifyUser = await getCurrentUser();
            
            const userAttributes = await fetchUserAttributes();
            console.log(userAttributes)
            const email = userAttributes.email;

            const newUser : User = {
                username: amplifyUser.username,
                email: email,
            }
            setUser(newUser);
            } catch {
                navigate('/login'); // Redirect to your login page
            }
        };
    
        checkAuthStatus();
    }, [])

    return ( 
        !isSuccessful ? (
            user === null ? <p>Loading...</p> :
                <main className="pt-20 bg-background p-6">
                    <div className="mx-auto max-w-2xl">
                        <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">Create User Account</h1>
                        </div>
                        <UserCreationForm user={user} changeSuccessfulState={()=> change()} />
                    </div>
                </main>
        ) : (
                <div className="bg-muted flex min-h-svh  flex-col items-center justify-center p-6 md:p-10">
                    <div className="flex w-full max-w-sm flex-col gap-6 justify-center">
                        <div className=' flex justify-center mb-30 w-300px'>              
                            <RedirectOnLogin user={user!} />
                        </div>
                    </div>
                </div>
        )
     
    )
}
