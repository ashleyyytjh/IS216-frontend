// import { useState } from 'react'

import './App.css'

import Home from './pages/Home'
import Layout from './pages/Layout'
import LoginPage from './pages/Login'
import Explore from './components/ui/ProductList'
import {Routes, Route,Link} from 'react-router-dom'
import Signup from './pages/Signup'
import OrderManage from './pages/OrderManage'
import OrderDispute from './pages/OrderDispute'
import OrderTrack from './pages/OrderTrack'

function App() {
  // const [count, setCount] = useState(0)
    return (
      <>
        <Routes>
               <Route path = '/'  element={<Layout/>}> 
              <Route path="/" element={<Home/>}/>
              <Route path="/login" element={<LoginPage/>}/>
              <Route path="/explore" element={<Explore/>}/>
              <Route path="/signup" element={<Signup/>}/>
              <Route path="/ordermanage" element={<OrderManage/>}/>
              <Route path="/orderdispute" element={<OrderDispute/>}/>
              <Route path="/ordertrack" element={<OrderTrack/>}/>
            </Route>
        </Routes>
      </>
    )
}

export default App


        //I commented this out to put my components (we can comment back if we wanna change)
    //   <div className="flex items-center justify-center h-dvh bg-background">
    //     <div className="text-center space-y-6">
    //       <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Welcome to XXXX</h1>
    //       <p className="text-lg text-muted-foreground max-w-[600px] mx-auto">
    //         Get started by logging in to your account and explore our market place.
    //       </p>
    //       <Button color={'primary'}  >
    //           Login
    //       </Button>
    //     </div>
    // </div>