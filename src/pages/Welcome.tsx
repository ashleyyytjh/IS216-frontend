import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShimmeringText } from "@/components/ui/shadcn-io/shimmering-text";
import { useEffect } from "react";
import { useState } from "react";
import TypingText from "@/components/ui/shadcn-io/typing-text";
import BackgroundNebula from "@/components/Background";
import { useIsMobile } from "@/hooks/use-mobile";

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
    const isMobile = useIsMobile();
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
                <motion.h1 variants={FADE_IN_UP_VARIANT} >
                    <ShimmeringText
                        text=" Welcome to OnlyNotes"
                        duration={1}
                        // color="hsl(var(--foreground))"
                        shimmeringColor="hsl(var(--primary))"   
                        wave={!isMobile} 
                         className="text-2xl font-semibold tracking-tighter sm:text-5xl md:text-7xl"
                        />
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

interface TerminalIntroProps {
    typingSpeed?: number;
    pauseDuration?: number;
    textLines: string[];
}
function SmartTerminalIntro(props: TerminalIntroProps) {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-background ">
      <TypingText
        text={props.textLines}
        typingSpeed={props.typingSpeed}
        pauseDuration={props.pauseDuration}
        showCursor={true}
        className="text-xl font-semibold tracking-tighter sm:text-5xl md:text-7xl"
        cursorClassName="h-10"
        deletingSpeed={0}
        textColors={['#000000']}
        // variableSpeed={{ min: 100, max: 120 }}
      />
    </div>
  );
}

const Welcome = () => {
    const [isTypingComplete, setIsTypingComplete] = useState(false);

    const typingSpeed = 40;
    const pauseDuration = 1000;
    const textLines = [
        "The best notes, from the best students.",
        "Your key to academic success.",
        // "Welcome to OnlyNotes."
    ];
    useEffect(() => {
        // --- Calculate the total animation duration ---
        const totalChars = textLines.join('').length;
        // We have one pause after each line except the last one.
        const numberOfPauses = textLines.length - 1;

        const totalTypingTime = totalChars * typingSpeed;
        const totalPauseTime = numberOfPauses * pauseDuration;
        
        // Add a small buffer (e.g., 500ms) to be safe
        const estimatedTotalTime = totalTypingTime + totalPauseTime + 1000;

        const timer = setTimeout(() => {
        setIsTypingComplete(true);
        }, estimatedTotalTime);

        return () => clearTimeout(timer);
    }, []); 
    return (
        <div >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5}}
            > 
            {/* <div className="hidden md:block"> */}
                <BackgroundNebula/>
            {/* </div> */}

            { !isTypingComplete ? 
                <SmartTerminalIntro typingSpeed={40} pauseDuration={1200} textLines={textLines} />
                : <WelcomeComponent />
            }
                {/* <WelcomeComponent /> */}
            </motion.div>
        </div>
 
    );
};

export default Welcome;
