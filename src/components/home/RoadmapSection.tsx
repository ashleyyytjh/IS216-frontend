import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Roadmap() {
    const navigate = useNavigate();
  return (
    <section className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6"
      >
        <div className="space-y-4">
          <h2 className="text-4xl font-bold">Not sure what notes to buy?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Follow curated roadmaps designed for your major and academic goals
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Button
            size="lg"
            className="group px-8 py-6 text-lg"
            onClick={() => { navigate('/roadmap'); }}
          >
            <Map className="mr-2 w-5 h-5" />
                View Roadmaps
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
