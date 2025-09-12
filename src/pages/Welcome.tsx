import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const WelcomeComponent = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center bg-background pt-100 overflow-hidden">
            <div className="text-center space-y-6">
                <h1 className="text-2xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Welcome to OnlyNotes</h1>
                <p className="text-sm sm:text-lg text-muted-foreground max-w-[600px] mx-auto">
                    Get started and explore our market place.
                </p>
                <Button onClick={() => {navigate('/home')}} color={'primary'}>
                    Enter
                </Button>
            </div>
        </div>
    )
}
const Welcome = () => {
    return (
         <motion.div
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{
            scale: [0.2, 1.2], 
            opacity: 1,
          }}
          transition={{
            duration: 1,      
            ease: 'easeInOut',
          }}
          className="w-full h-full"
        >
            <WelcomeComponent />      
        </motion.div>
 
    )
}

export default Welcome;