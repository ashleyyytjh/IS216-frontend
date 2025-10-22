import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {  Store} from "lucide-react";

import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import KeyPoints from '@/components/home/KeyPoints';
import ExploreSubject from '@/components/home/ExploreSubject';
import { useIsMobile } from '@/hooks/use-mobile';
import { AnimatedTestimonials } from '@/components/ui/animated-testimonials';
import { testimonials } from '@/assets/data';
import RecommendationsHub, { } from "@/components/RecommendationHub";
import { type CalendarConfig } from "@/utils/calendar"

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
  
  const heroY = useTransform(scrollYProgress, [0, 0.3], ["0px", "100px"])
  // Animate the content section to slide up as the hero fades out
  const contentY = useTransform(scrollYProgress, [0, 1], ["10vh", "0vh"]);
  const navigate = useNavigate();


  
  return (
    <div ref={targetRef} className="relative w-full overflow-y-hidden">
      {/* The Sticky Hero Section */}
      <div className="h-screen w-full sticky  flex flex-col items-center justify-center">
          <>
             <HeroGeometric />
              <motion.div
                  style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
                  initial={{ scale: 0.2, opacity: 0 }}
                  animate={{ scale: [0.2, 1], opacity: 1 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                > 
                <LandingText userName={user?.username || "Welcome Student!"} />
              </motion.div>
              </>
      </div>


      {/* Scrollable Content */}
      <motion.div style={{ y: contentY }} className="">
        <div className="max-w-7xl  mx-auto px-6 md:px-8  md:py-32 space-y-28 md:space-y-40">
          <KeyPoints />
          <div className='space-y-4'>
            <UserTypeToggle changeSelection={onChangeSelection} selection={stepSelection} />
            <StepsComponent option={stepSelection} />
          </div>

          <Roadmap />        
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
import StepsComponent from '@/components/home/Steps';
import LandingText from '@/components/home/LandingText';
import Roadmap from '@/components/home/RoadmapSection';

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







