
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, User, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const NoteCard = ({ title, author, university, rating, price }: any) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    return (
        <motion.div 
            ref={ref}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="border bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
        >
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{title}</h3>
                    <div className="flex items-center gap-1 text-amber-500">
                        <Star className="h-5 w-5 fill-current" />
                        <span className="font-bold">{rating}</span>
                    </div>
                </div>
                <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-6">
                    <User className="h-4 w-4 mr-2"/> {author} &middot; <GraduationCap className="h-4 w-4 mx-2" /> {university}
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xl font-extrabold text-blue-600">{price}</span>
                    <Button variant="outline">View Details</Button>
                </div>
            </div>
        </motion.div>
    )
}

export default NoteCard;