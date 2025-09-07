import { useState } from 'react'

import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';


function Home() {
  const [cards, setCards] = useState(cardData);

  useEffect(() => {
    AOS.init({
      duration: 1000, 
      once: true,  
    });
  }, []);
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.0, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="bg-[#ededed] relative">
          <div className="container w-full pt-10 mx-auto bg-whitetest pb-20" data-aos="zoom-in">
            
            <h1 className="text-black text-center text-6xl font-serif mb-2">Discover Students and Their </h1>
            <h1 className="text-black text-center text-6xl mb-10 font-serif">Notes Effortlessly</h1>
            <p className="text-black text-center">Welcome to Onlynotes, your go-to platform for exploring student's's contributions for notes.</p>
            <p className="text-black text-center mb-10">Search for forewords, prefaces and endoresements with ease.</p>

            <form className="max-w-md mx-auto mb-4">
              <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
              <div className="relative">
                <input type="search" id="default-search" className="block w-full p-4 ps-10 mt-20 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500" placeholder="Search Notes.." required />

                <div className="absolute inset-y-0 end-2 flex items-center ps-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                  </svg>
                </div>
              </div>
            </form>

          </div>
        </div>

        <div 
        data-aos="fade-up-left"
        className="relative bg-[url('https://miro.medium.com/1*4r4x8mggXOEYz1vU7tCdAw.jpeg')] pb-[5rem] w-full
        ">
          <div className="absolute inset-0 bg-[#484b6a]/40"></div>
          <div className="container ml-auto mr-auto max-w-7xl relative z-10" >
          <h1 className="text-black text-4xl font-serif mb-5 text-center pt-[5rem]">Over 1 billion students helped, and counting.</h1>
          <p className="text-black text-center mb-8">50K new study notes added every day, from the world’s most active student communities.</p>
          <div className="flex flex-row items-center justify-between text-center mr-auto ml-auto">

            <div className="max-w-sm rounded overflow-hidden shadow-lg">
              <h2 className="text-5xl font-medium font-sans text-black text-center">50M</h2>
              <p className="text-textDef font-semibold">Study Resources</p>

              <div className="px-6 py-4">
                <p className="text-textDef text-base">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.
                </p>
              </div>
            </div>

            <div className="max-w-sm rounded overflow-hidden shadow-lg">
              <h2 className="text-5xl font-medium font-sans text-black text-center">50M</h2>
              <p className="text-textDef font-semibold">Study Resources</p>

              <div className="px-6 py-4">
                <p className="text-textDef-700 text-base">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.
                </p>
              </div>
            </div>

            <div className="max-w-sm rounded overflow-hidden shadow-lg">
              <h2 className="text-5xl font-medium font-sans text-black text-center">50M</h2>
              <p className="text-textDef font-semibold">Study Resources</p>

              <div className="px-6 py-4">
                <p className="text-textDef-700 text-base">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>


        <div className=" bg-[#ededed] ml-0 mr-0 pb-[10rem] w-full" data-aos="fade-up-right">
            <div className="container mx-auto">
                        <h1 className="text-textColorBottom text-4xl font-serif text-center pt-20">Only the best for the best.</h1>
          <p className="text-black text-center mt-5">Find the best study documents to ace your way through education.</p>

          <div className="max-w-2xl rounded overflow-hidden shadow-lg ml-auto mr-auto mt-3">
            <h2 className="text-black text-center mb-10 font-serif mt-5">Quick search for notes.</h2>

            {/* Cards here can be used for mobile view */}
            <div className="grid place-items-center pb-[5rem]">

              {cards.map((card) => {
                return (
                  <Card key={card.id} cards={cards} setCards={setCards} {...card} />
                );
              })}
            </div>
          </div>
  </div>

        </div>
      </motion.div>
    </AnimatePresence>


  )
}
const Card = ({ id, url, setCards, cards }) => {
  const x = useMotionValue(0);

  const rotateRaw = useTransform(x, [-150, 150], [-18, 18]);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);

  const isFront = id === cards[cards.length - 1].id;

  const rotate = useTransform(() => {
    const offset = isFront ? 0 : id % 2 ? 6 : -6;

    return `${rotateRaw.get() + offset}deg`;
  });

  const handleDragEnd = () => {
    if (Math.abs(x.get()) > 100) {
      setCards((pv) => pv.filter((v) => v.id !== id));
    }
  };

  return (
    //change here to a card
    <motion.img
      src={url}
      alt="Placeholder alt"
      className="h-96 w-72 origin-bottom rounded-lg bg-white object-cover hover:cursor-grab active:cursor-grabbing"
      style={{
        gridRow: 1,
        gridColumn: 1,
        x,
        opacity,
        rotate,
        transition: "0.125s transform",
        boxShadow: isFront
          ? "0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)"
          : undefined,
      }}
      animate={{
        scale: 1,
      }}
      drag="x"
      dragConstraints={{
        left: 0,
        right: 0,
      }}
      onDragEnd={handleDragEnd}
    />
  );
};

const cardData = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?q=80&w=2235&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=2342&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2224&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1570464197285-9949814674a7?q=80&w=2273&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1578608712688-36b5be8823dc?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1505784045224-1247b2b29cf3?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];
export default Home;
