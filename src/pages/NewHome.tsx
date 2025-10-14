import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Award, Wallet, Search, Sparkles, Star, GraduationCap, ArrowRight, UploadCloud, CheckCircle, DollarSign, Store, UserIcon } from "lucide-react";
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
import RecommendationsHub, { } from "@/components/RecommendationHub";
import { type CalendarConfig } from "@/lib/calendar"

import { HeroGeometric } from "@/components/ui/shadcn-io/shape-landing-hero";

import { useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { User } from '@/types/types';

export default function ImprovedHomepage() {
  const calendar: CalendarConfig = {
    week1Monday: new Date("2025-08-18T00:00:00+08:00"),
    // You can pass tuple or array; component normalizes to [start,end]
    midtermWeeks: [6, 7, 8],          // Weeks 6–7 (22 Sep–5 Oct 2025)
    finalsWeeks: [15, 16],         // Weeks 15–16 (24 Nov–5 Dec 2025)
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [stepSelection, setStepSelection] = useState<String>('buyer');
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

  const onChangeSelection = (value: String) => {
    setStepSelection(value);
  }

  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  // --- Animation Transformations ---
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.4]);

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
          className="text-center w-full"
        > {
            isLoggedIn ?
              <>


             <HeroGeometric
                  badge={user?.username}
                  title1="OnlyNotes"
                  description="The pinnacle of student-curated knowledge. Ace your exams with notes from the best."

                />

               <div className="mt-8 flex justify-center gap-4 absolute top-2/3 right-1/2 translate-1/2  z-40">
                  <Button size={isMobile ? 'sm' : 'lg'} onClick={() => navigate('/explore')}>
                    Browse <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button size={isMobile ? 'sm' : 'lg'} variant="outline" onClick={() => navigate('/upload')}>
                    Sell Notes
                  </Button>
                </div>
              </>
              :
              <>
                <HeroGeometric
                  badge='Welcome Student!'
                  title1="OnlyNotes"
                  description="The pinnacle of student-curated knowledge. Ace your exams with notes from the best."

                />
                {/* <h1 className="text-5xl md:text-6xl 2xl:text-8xl font-bold tracking-tighter">
                  OnlyNotes
                </h1>
                <p className="mt-4 max-w-xl mx-auto text-md md:text-xl text-slate-600 ">
                  The pinnacle of student-curated knowledge. Ace your exams with notes from the best.
                </p> */}
                <div className="mt-8 flex justify-center gap-4 absolute top-2/3 right-1/2 translate-1/2  z-40">
                  <Button size={isMobile ? 'sm' : 'lg'} onClick={() => navigate('/explore')}>
                    Browse <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button size={isMobile ? 'sm' : 'lg'} variant="outline" onClick={() => navigate('/upload')}>
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
          <div className='space-y-4'>
            <UserTypeToggle changeSelection={onChangeSelection} selection={stepSelection} />
            <StepsComponent option={stepSelection} />
          </div>


          <RecommendationsHub
            isLoggedIn={isLoggedIn}
            profile={
              isLoggedIn
                ? { modules: ["IS216", "CS203"], major: "Information Systems", budgetCents: 500 }
                : undefined
            }
            calendar={calendar}
          />

          <ExploreSubject />
          <section>
            <h2 className="text-4xl font-bold text-center mb-16">Loved by all SMU Students </h2>
            <AnimatedTestimonials testimonials={testimonials} />
          </section>
        </div>
      </motion.div>
    </div>
  );
}

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

interface Props {
  selection: String
  changeSelection: (selected: String) => void
}
export function UserTypeToggle({ selection, changeSelection }: Props) {
  return (
    <div className="flex flex-col items-center gap-4">
      <ToggleGroup
        type="single"
        value={String(selection)}
        onValueChange={(value) => {
          if (value) changeSelection(value)
        }}
        className="h-12 rounded-xl border bg-background p-1 shadow-sm"
      >
        <ToggleGroupItem
          value="buyer"
          aria-label="Select buyer"
          className={cn(
            "rounded-xl px-6 py-2.5 text-sm font-medium transition-all",
            "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-md"
          )}
        >
          {/* <UserIcon className="rounded-full mr-2 h-4 w-4" /> */}
          Buyer
        </ToggleGroupItem>
        <ToggleGroupItem
          value="seller"
          aria-label="Select seller"
          className={cn(
            "rounded-xl px-6 py-2.5 text-sm font-medium transition-all",
            "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-md"
          )}
        >
          <Store className="mr-2 h-4 w-4" />
          Seller
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}







