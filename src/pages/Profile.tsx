import { useEffect, useState } from "react"
import DashboardUser from "@/components/dashboard-user"
import ProfileHeader from "@/components/profile-header"
import { getUser } from "@/services/UserService"
import { User } from "@/types/types"
import SpinItem from "@/components/spinner"
// Hooked
const Profile = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUser()
      .then((resp) => {
        setCurrentUser(resp)
        console.log(resp)
      })
      .catch((err) => {
        console.error("Error fetching user:", err)
      })
      .finally(() => setLoading(false))
  }, [])
  console.log(currentUser)

    if (loading) return  <div className="flex justify-center items-center w-full h-64"> <SpinItem/></div>
  if (!currentUser) return <p>No user data found</p>

  return (
    <div className="container mw-50 mr-auto ml-auto pl-2 pr-2 w-[100%] md:w-[75%] fade-in">
      <div className="row-span-full mt-10 md: bg-white w-full ml-auto mr-auto">
        <ProfileHeader current={currentUser} />
      </div>
      <div className="row-span-full mt-10 bg-white w-full mb-20">
        <DashboardUser current={currentUser} />
      </div>
    </div>
  )
}

export default Profile