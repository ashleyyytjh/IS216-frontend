import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";

// A pre-defined variant for a simple fade-in-up effect
const FADE_IN_UP_VARIANT: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: 'spring',
      stiffness: 100, 
      damping: 20
    } 
  },
};
const WelcomeComponent = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center bg-background h-screen">
            <motion.div
                className="text-center space-y-6"
                initial="hidden"
                animate="visible"
                variants={{
                    visible: {
                        transition: {
                            staggerChildren: 0.5, 
                        },
                    },
                }}
            >
                <motion.h1  variants={FADE_IN_UP_VARIANT} />
                <motion.h1
                    className="text-2xl font-bold tracking-tighter sm:text-5xl md:text-7xl"
                    variants={FADE_IN_UP_VARIANT}
                >
                    Welcome to OnlyNotes
                </motion.h1>
                
                <motion.p
                    className="text-md sm:text-2xl text-muted-foreground max-w-[500px] mx-auto"
                    variants={FADE_IN_UP_VARIANT}
                >
                    Get started and explore our market place curated specially for SMU Students!
                </motion.p>
                <motion.h1  variants={FADE_IN_UP_VARIANT} />

                <motion.div
                    variants={FADE_IN_UP_VARIANT}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button size={'lg'} onClick={() => navigate('/home')} color={'primary'}>
                        Enter
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    )
}

const Welcome = () => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5}}
      >
        <WelcomeComponent />
      </motion.div>
    );
};

export default Welcome;
