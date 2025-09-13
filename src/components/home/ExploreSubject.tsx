
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { mockCourses } from "../../assets/data";
import { useRef } from "react";
import { useInView } from "framer-motion";

const ExploreSubject = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                // This will make each child animate 0.1s after the previous one.
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        },
    };
    return (
        <section>
            <div className="text-center">
                <Sparkles className="mx-auto h-12 w-12  mb-4" />
                <h2 className="text-4xl font-bold mb-4">Explore by Subject</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 text-center mb-12 max-w-2xl mx-auto">
                    Find study materials for your specific field of study, from core concepts to niche electives.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                <motion.div
                    ref={ref}
                    className="flex flex-wrap justify-center gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                {mockCourses.map((course) => (
                    <motion.button 
                        key={course.id} 
                        whileHover={{ y: -5 }}
                        variants={itemVariants}
                        className={`flex items-center gap-3 px-6 py-3 rounded-full text-lg font-semibold text-white ${course.color} shadow-lg cursor-pointer transition-transform`}
                    >
                        <course.icon className="h-5 w-5" />
                        {course.name}
                    </motion.button>
                ))}
                </motion.div>
            
                </div>
            </div>
        </section>

    );
}

export default ExploreSubject;