import DashboardBuyer from "./dashboard-buyer"

function DashboardUser(currentUser) {
    return (
        <>
            <div className="flex flex-col mt-4 pl-8 pr-8 w-full">
                <DashboardBuyer current={currentUser}/>
            </div>
        </>

    )
}
export default DashboardUser;