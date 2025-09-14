import { BookCopy, Icon } from 'lucide-react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Award, BookOpen, Search, Wallet } from 'lucide-react';

const keyPoints = [
    { icon: Award, title: "Verified Quality", description: "Access notes from top-performing students, all reviewed for quality and accuracy." },
    { icon: BookOpen, title: "Comprehensive Coverage", description: "From quick summaries to in-depth guides, find exactly what you need for any course." },
    { icon: Search, title: "Effortless Discovery", description: "Our powerful search and filtering tools help you find the perfect notes in seconds." },
    { icon: Wallet, title: "Earn for Your Effort", description: "Become a seller and monetize your hard work by helping other students succeed." },
];

const KeyPoints = () => {
    return (
            <section>
            <h2 className="text-4xl font-bold text-center mb-16">Why Choose OnlyNotes?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {keyPoints.map((point, i) => (
                <KeyPointsCard key={i} {...point} />
              ))}
            </div>
          </section>
    );
}

const KeyPointsCard = ({ icon: Icon, title, description }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    return (
        <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center p-6 rounded-lg"
        >
        <div className="mb-4 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <Icon className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm">{description}</p>
        </motion.div>
    );
};

export default KeyPoints;