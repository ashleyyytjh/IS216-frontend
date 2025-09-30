
import { useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, UploadCloud, DollarSign } from "lucide-react";

const howItWorksSteps = [
    { icon: CheckCircle, title: "Create Account", description: "Sign up for a free account to get started and access all features" },
    { icon: UploadCloud, title: "Upload Your Notes", description: "Easily upload your study materials, set your price, and write a compelling description." },
    { icon: DollarSign, title: "Start Earning", description: "Once approved, your notes go live on the marketplace, and you earn money with every sale." },
];

const howItWorksSteps2 = [
    { icon: CheckCircle, title: "Create Account", description: "Sign up for a free account to get started and access all features" },
    { icon: UploadCloud, title: "Search Notes", description: "Easily search for the study materials you need, and find the perfect notes in seconds." },
    { icon: DollarSign, title: "Purchase Notes", description: "Buy the notes you need to succeed in your courses." },
];

interface Props {
  option: String;
}

const StepsComponent = ({ option }: Props) => { 
    return (
        <section className='flex flex-col md:flex-row space-between'>
            <div className=" mx-auto">
                <h2 className="text-4xl font-semibold text-center mb-4">Become a {option.toUpperCase()} in 3 Easy Steps</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 text-center mb-16">
                    Turn your hard work into a passive income stream.
                </p>
                <div className="relative">
                    <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-1 bg-slate-200 dark:bg-gray-700 rounded-full" />
                    <div className="space-y-16">
                        {
                            option === 'seller' ? (
                                <>
                                {howItWorksSteps.map((step, i) => (
                                    <HowItWorksStep key={i} index={i} {...step} />
                                ))}
                                </>
                            ) : (
                                <>
                                {howItWorksSteps2.map((step, i) => (
                                    <HowItWorksStep key={i} index={i} {...step} />
                                ))}
                                </>
                            )
                        }
                        
                    </div>
                </div>
            </div>
        </section>
    );
}

const HowItWorksStep = ({ icon: Icon, title, description, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.8 });
    const isEven = index % 2 === 0;

    return (
        <div ref={ref} className={`relative flex items-center ${isEven ? 'justify-start' : 'justify-end'}`}>
            {/* 2. Replaced the div with an animatable MotionCard */}
            <motion.div
                initial={{ opacity: 0, x: isEven ? -100 : 100 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="w-[calc(50%-2.5rem)]" // Card provides its own styling (bg, shadow, rounded)
            >
                <CardHeader>
                    {/* 3. Replaced h3 with CardTitle */}
                    <CardTitle className="text-2xl">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* 4. Wrapped the p tag in CardContent */}
                    <p className="text-slate-600 dark:text-slate-400">{description}</p>
                </CardContent>
            </motion.div>
            
            {/* The central icon remains the same as it's a decorative, animated element */}
            <div className="absolute left-1/2 -translate-x-1/2 z-10">
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="h-20 w-20 rounded-full bg-blue-500 text-white flex items-center justify-center border-8 border-slate-50 dark:border-gray-950"
                >
                    <Icon className="h-8 w-8" />
                </motion.div>
            </div>
        </div>
    );
}

export default StepsComponent;