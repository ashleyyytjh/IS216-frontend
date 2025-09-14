import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const TestimonialCard = ({ quote, author }: any) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
        >
            <p className="text-slate-600 dark:text-slate-300 mb-4">"{quote}"</p>
            <p className="font-semibold text-slate-800 dark:text-white">- {author}</p>
        </motion.div>
    );
};

export default TestimonialCard;