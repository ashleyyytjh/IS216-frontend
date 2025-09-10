import DashboardUser from "@/components/dashboard-user";
import ProfileHeader from "@/components/profile-header";


const Profile = () => {
    return (
        <div className="container mw-50 mr-auto ml-auto pl-2 pr-2 w-full">


            <div className="row-span-full md: bg-white w-full">
                <ProfileHeader/>
                
            </div>
            <div className="row-span-full bg-white w-full">
                <DashboardUser/>
            </div>
            
        </div>
    )


}
export default Profile;