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

  if (loading) {
    return <div className="flex justify-center items-center w-full h-64"> <SpinItem /></div>
  }
  if (!currentUser) {
    return <div className="flex justify-center item-center text-center mt-100 mb-100 w-full">
      <h1 className="text-3xl text-muted-foreground">No User Data found.</h1></div>

  }
  return (
    <div className="container mw-50 mr-auto ml-auto pl-0 pr-0 w-[90%] md:w-[80%] fade-in">
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