import DashboardUser from "@/components/dashboard-user";
import ProfileHeader from "@/components/profile-header";
import { User } from "@/types/types";

    const currentUser: User =
    {
        "userId": "594a352c-2081-706e-b679-00b936e6b8f9", //i dont need this for now 
        "email": "owjoel@gmail.com",
        "username": "owjoel",
        "yearOfStudy": 4,
        "major": "Computer Science",
        "modules": [
            "cs425",
            "is216"
        ], //can be updated
        "purchasedNotes": [
            "68b98faba389fd1819c78c17"
        ]
    }
const Profile = () => {
    return (
        <div className="container mw-50 mr-auto ml-auto pl-2 pr-2 w-[80%]">
            <div className="row-span-full md: bg-white w-full ml-auto mr-auto">
                <ProfileHeader current={currentUser}/>
            </div>
            <div className="row-span-full bg-white w-full">
                <DashboardUser current={currentUser}/>
            </div>
            
        </div>
    )


}
export default Profile;