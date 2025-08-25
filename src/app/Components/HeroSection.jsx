'use client';

import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

const HeroSection = () => {
  const constraintsRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  // Predefined positions and opacities for particles to avoid hydration mismatch
  const particlePositions = [
    { top: "67.08%", left: "17.98%", opacity: 0.55 },
    { top: "3.72%", left: "36.06%", opacity: 0.25 },
    { top: "43.86%", left: "34.26%", opacity: 0.42 },
    { top: "23.24%", left: "33.95%", opacity: 0.22 },
    { top: "76.03%", left: "16.40%", opacity: 0.53 },
    { top: "16.03%", left: "13.60%", opacity: 0.24 },
    { top: "68.20%", left: "56.02%", opacity: 0.22 },
    { top: "68.90%", left: "6.71%", opacity: 0.54 },
    { top: "74.23%", left: "24.81%", opacity: 0.54 },
    { top: "22.96%", left: "54.02%", opacity: 0.15 },
    { top: "82.94%", left: "38.13%", opacity: 0.22 },
    { top: "86.23%", left: "55.63%", opacity: 0.58 },
    { top: "48.49%", left: "4.91%", opacity: 0.39 },
    { top: "31.45%", left: "14.38%", opacity: 0.35 },
    { top: "89.69%", left: "2.33%", opacity: 0.13 }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-black to-[#0A0A0A] pt-16">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        {/* Animated cricket field lines */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-1 bg-[#D4AF37] opacity-30"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
        <motion.div 
          className="absolute top-1/2 left-0 w-full h-1 bg-[#D4AF37] opacity-30"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.7 }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-full h-1 bg-[#D4AF37] opacity-30"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.9 }}
        />
        
        {/* Animated circles (cricket field markings) */}
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37] opacity-20"
          initial={{ width: 0, height: 0 }}
          animate={{ width: 500, height: 500 }}
          transition={{ duration: 2, delay: 1 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37] opacity-20"
          initial={{ width: 0, height: 0 }}
          animate={{ width: 300, height: 300 }}
          transition={{ duration: 2, delay: 1.2 }}
        />
        
        {/* Floating particles - using predefined positions to avoid hydration issues */}
        {isClient && particlePositions.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-[#D4AF37]"
            style={{
              top: pos.top,
              left: pos.left,
              opacity: pos.opacity
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, (i % 2 === 0 ? 1 : -1) * 10, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: Math.floor(Math.random() * 5 + 3),
              repeat: Infinity,
              delay: Math.floor(Math.random() * 2)
            }}
          />
        ))}
      </div>

      <div className="container w-11/12 mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col lg:flex-row items-center justify-between gap-10"
        >
          {/* Left content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              <span className="text-white">Welcome to </span>
              <span className="text-[#D4AF37]">Mighty Strikers</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-300 mb-8"
            >
              The most formidable cricket team that strikes with power, precision and passion
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(212, 175, 55, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#D4AF37] text-black font-bold py-3 px-8 rounded-full text-lg transition-all duration-300"
              >
                Meet The Team
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300"
              >
                Upcoming Matches
              </motion.button>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="mt-12 flex items-center justify-center lg:justify-start space-x-8"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-[#D4AF37]">24</div>
                <div className="text-white">Matches Won</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-[#D4AF37]">5</div>
                <div className="text-white">Tournaments</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-[#D4AF37]">18</div>
                <div className="text-white">Players</div>
              </div>
            </motion.div>
          </div>
          
          {/* Right content - Animated cricket elements */}
          <div className="lg:w-1/2 relative hidden lg:block">
            <div ref={constraintsRef} className="relative h-96 lg:h-[500px]">
              {/* Floating cricket bat */}
              <motion.div
                drag
                dragConstraints={constraintsRef}
                className="absolute top-10 left-1/2 transform -translate-x-1/2 z-20"
                animate={floatingAnimation}
              >
                <div className="relative">
                  <div className="w-6 h-40 bg-gradient-to-b from-[#8B4513] to-[#5D2906] rounded-lg"></div>
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-2 bg-[#D4AF37] rounded-full"></div>
                </div>
              </motion.div>
              
              {/* Floating cricket ball */}
              <motion.div
                drag
                dragConstraints={constraintsRef}
                className="absolute top-32 right-20 w-12 h-12 bg-[#D4AF37] rounded-full z-10 shadow-lg"
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 180, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="w-full h-full relative">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-[#8B4513]"></div>
                  <div className="absolute top-0 left-1/2 h-full w-1 bg-[#8B4513]"></div>
                </div>
              </motion.div>
              
              {/* Stumps */}
              <motion.div 
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-6"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
              >
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-4 h-32 bg-gradient-to-b from-[#D4AF37] to-[#8B4513] rounded-lg"></div>
                ))}
              </motion.div>
              
              {/* Player silhouette */}
              <motion.div
                className="absolute bottom-0 right-10"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 1.8 }}
              >
                <div className="relative">
                  <div className="w-16 h-40 bg-gradient-to-t from-[#D4AF37] to-transparent opacity-80 rounded-t-full"></div>
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-[#0A0A0A] border-4 border-[#D4AF37] rounded-full"></div>
                </div>
              </motion.div>
            </div>
            
            {/* Animated text */}
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 2 }}
            >
              <p className="text-gray-400 italic">Drag the cricket elements around!</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute hidden lg:block bottom-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.5 }}
      >
        <div className="flex flex-col items-center">
          <span className="text-[#D4AF37] mb-2">Scroll Down</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;