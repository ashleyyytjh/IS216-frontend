import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Award, Wallet, Search, Sparkles, Star, GraduationCap, ArrowRight, UploadCloud, CheckCircle, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component from shadcn/ui
import BackgroundNebula from '@/components/Background';
import TestimonialCard from '@/components/home/TestimonialCard';
import NoteCard from '@/components/home/NoteCard';
import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { mockCourses } from '@/assets/data';
import HowItWorksStep from '@/components/home/Steps';
import StepsComponent from '@/components/home/Steps';
import KeyPoints from '@/components/home/KeyPoints';
import ExploreSubject from '@/components/home/ExploreSubject';
import { useIsMobile } from '@/hooks/use-mobile';
import { AnimatedTestimonials } from '@/components/ui/animated-testimonials';
import { testimonials } from '@/assets/data';

const featuredNotes = [
    { id: 1, title: "Advanced Algorithms Cheatsheet", author: "Jane Doe", university: "Stanford University", rating: 5, price: "$9.99" },
    { id: 2, title: "Corporate Law Case Summaries", author: "John Smith", university: "Harvard University", rating: 4, price: "$12.50" },
    { id: 3, title: "Marketing 101 Full Semester Notes", author: "Emily White", university: "Wharton School", rating: 5, price: "$19.00" },
];


import { useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { User } from '@/types/types';
import logo from '../assets/logodark.png';

export default function ImprovedHomepage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [user, setUser] = useState<User | null>(null);
  const isMobile = useIsMobile();
    useEffect(() => {
        window.history.scrollRestoration = 'manual'; 
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
      const fetchData = async () => {
        const amplifyUser = await getCurrentUser();
        if (amplifyUser) {
          setIsLoggedIn(true);
          setUser(amplifyUser);
        }
      }
      fetchData();
    }, []);

    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"],
    });

  // --- Animation Transformations ---
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0,  0.3], [1, 0.4]);
  
  // Animate the content section to slide up as the hero fades out
  const contentY = useTransform(scrollYProgress, [0, 1], ["10vh", "0vh"]);
  const navigate = useNavigate();

  return (
    <div ref={targetRef} className="relative w-full">

      {/* The Sticky Hero Section */}
      <BackgroundNebula />

      <div className="h-screen w-full sticky top-0 flex flex-col items-center justify-center">

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: [0.2, 1], opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="text-center px-4"
        > {
          isLoggedIn ? 
          <>
          <h1 className="text-5xl md:text-6xl 2xl:text-8xl font-bold tracking-tighter">
            Welcome {user?.username}
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-md md:text-xl text-slate-600 ">
            The pinnacle of student-curated knowledge. Ace your exams with notes from the best.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size={isMobile ? 'sm' : 'lg'} onClick={() => navigate('/explore')}>
                Browse <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button  size={isMobile ? 'sm' : 'lg'} variant="outline" onClick={() => navigate('/upload')}>
                Sell Notes
            </Button>
          </div>
          </> 
          : 
          <>
            <h1 className="text-5xl md:text-6xl 2xl:text-8xl font-bold tracking-tighter">
              OnlyNotes
            {/* <img src={logo} className='w-90' alt="Logo" /> */}
            </h1>
            <p className="mt-4 max-w-xl mx-auto text-md md:text-xl text-slate-600 ">
              The pinnacle of student-curated knowledge. Ace your exams with notes from the best.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size={isMobile ? 'sm' : 'lg'} onClick={() => navigate('/explore')}>
                  Browse <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button  size={isMobile ? 'sm' : 'lg'} variant="outline" onClick={() => navigate('/upload')}>
                  Sell Notes
              </Button>
            </div>
          </>
        }
          
        </motion.div>
      </div>


      {/* Scrollable Content */}
      <motion.div style={{ y: contentY }} className="relative z-10 w-full bg-slate-50 dark:bg-gray-900 rounded-t-3xl l">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-20 md:py-32 space-y-28 md:space-y-40">
            <KeyPoints />
            <StepsComponent />
            <ExploreSubject/>
            <section>
                <h2 className="text-4xl font-bold text-center mb-16">Loved by Students Everywhere</h2>
                            <AnimatedTestimonials testimonials={testimonials} />
            </section>
        </div>
      </motion.div>
    </div>
  );
}


const NoteCarouselCard = ({ title, author, university, price, image }) => {
    return (
        <div className="w-96 flex-shrink-0 h-[500px] rounded-2xl shadow-xl overflow-hidden relative group">
            <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{title}</h3>
                <div className="text-sm opacity-80 mb-4">
                    <span>{author} &middot; {university}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-2xl font-extrabold">{price}</span>
                    <Button variant="outline" className="bg-white/20 border-white/30 backdrop-blur-sm text-white hover:bg-white/30">
                        View
                    </Button>
                </div>
            </div>
        </div>
    );
};






