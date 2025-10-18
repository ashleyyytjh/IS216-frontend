

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, Circle } from 'lucide-react';
import { Button } from '../ui/shd-button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';

interface LandingTextProps {
    userName?: string;
}

const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1] as const,
        },
    }),
};

const LandingText = (props : LandingTextProps) => {
    const isMobile = useIsMobile();
    const navigate = useNavigate();
    return (
        <section >   
            <div className=" relative z-10 container mx-auto px-4 md:px-6 w-auto">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                    custom={0}
                    variants={fadeUpVariants}
                    initial="hidden"
                    animate="visible"
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-50 border border-neutral-200 mb-8 md:mb-12"
                    >
                    <Circle className="h-2 w-2 fill-neutral-900" />
                    <span className="text-sm text-neutral-600 tracking-wide">
                        {props.userName}
                    </span>
                    </motion.div>

                    <motion.div custom={1} initial="hidden" animate="visible">
                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 md:mb-8 tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-700">
                        OnlyNotes
                        </span> 
                        <br />
                    </h1>
                    </motion.div>

                    <motion.div custom={2} initial="hidden" animate="visible">
                    <p className="text-base sm:text-lg md:text-xl text-neutral-600 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
                        The pinnacle of student-curated knowledge. Ace your exams with notes from the best.
                    </p>
                    </motion.div>
                    <div className="mt-8 flex justify-center gap-4 ">
                    <Button size={isMobile ? 'sm' : 'lg'} onClick={() => navigate('/explore')}>
                        Browse <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button size={isMobile ? 'sm' : 'lg'} variant="outline" onClick={() => navigate('/create')}>
                        Sell Notes
                    </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LandingText;