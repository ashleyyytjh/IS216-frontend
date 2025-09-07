import { useState } from 'react'

import './App.css'
import { Button } from './components/ui/button'
import Navbar from './components/ui/navbar'
import Home from './pages/Home'

function App() {
  // const [count, setCount] = useState(0)

    return (
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
<>
    <Navbar/>
    <Home/>
</>

       
    )
}

export default App
