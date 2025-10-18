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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      }
    }
  };


  return (
    <section className="relative">
      <motion.div 
        className="absolute top-0 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl -z-10"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl -z-10"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      {/* Animated title */}
      <motion.h2 
        className="text-4xl md:text-5xl font-bold text-center mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        Why Choose{" "}
        <span >
          OnlyNotes?
        </span>
      </motion.h2>

      {/* Animated grid container */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {keyPoints.map((point, i) => (
          <motion.div
            key={i}
            whileHover={{ 
              y: -12,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
          >
            <KeyPointsCard {...point}  />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};



const KeyPointsCard = ({ icon: Icon, title, description }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 group"
    >
      {/* Icon container */}
      <div className="mb-5 p-5 bg-blue-100 dark:bg-blue-800 rounded-full group-hover:bg-blue-200 dark:group-hover:bg-blue-700 transition-colors duration-300">
        <Icon className="h-10 w-10 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
      </div>
      {/* Title */}
      <h3 className="text-2xl font-semibold mb-3 group-hover:text-blue-600 transition-colors duration-300">
        {title}
      </h3>
      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
        {description}
      </p>
    </motion.div>

    );
};

export default KeyPoints;