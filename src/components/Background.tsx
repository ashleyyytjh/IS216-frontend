import { motion, } from 'framer-motion';

const BackgroundNebula = () => (
  <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full opacity-30 blur-3xl"
        style={{
          width: Math.random() * 200 + 150,
          height: Math.random() * 200 + 150,
          top: `${Math.random() * 80}%`,
          left: `${Math.random() * 80}%`,
          backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899'][i % 3],
        }}
        animate={{
          y: [0, Math.random() * 40 - 20, 0],
          x: [0, Math.random() * 40 - 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          repeat: Infinity,
          repeatType: 'mirror',
        //   duration: Math.random() * 10 + 15,
          ease: 'easeInOut'
        }}
      />
    ))}
  </div>
);

export default BackgroundNebula;