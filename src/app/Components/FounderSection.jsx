'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const FounderSection = () => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [ref2, inView2] = useInView({ triggerOnce: true, threshold: 0.1 });
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

    // Single founder data
    const founder = {
        name: "Mohammad Shawon",
        role: "Founder of Mighty Strikers",
        image: "/founder.jpg",
        bio: "The founder established Mighty Strikers with a clear vision of unity, discipline, and competitive spirit, laying the foundation for the team’s continued growth and success.",
        philosophy: "Cricket is more than just a game—it's a discipline that shapes character, builds resilience, and creates champions in all aspects of life.",
        quote: "A strong team is not just about talent—it’s about trust, effort, and heart"
    };

    // Cricket Ball Animation Component
    const CricketBall = () => (
        <motion.div
            className="absolute w-10 h-10 bg-gradient-to-b from-[#D4AF37] to-[#8B4513] rounded-full flex items-center justify-center shadow-lg z-20"
            animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 180, 360],
            }}
            transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        >
            <div className="w-8 h-8 bg-[#8B4513] rounded-full">
                <div className="w-full h-0.5 bg-[#D4AF37] mt-4"></div>
                <div className="w-0.5 h-full bg-[#D4AF37] mx-auto -mt-2"></div>
            </div>
        </motion.div>
    );

    // Bat Swing Animation
    const CricketBat = () => (
        <motion.div
            className="absolute w-8 h-24 bg-gradient-to-b from-[#8B4513] to-[#5D2906] rounded-lg shadow-lg z-20"
            animate={{
                rotate: [0, -15, 0, 15, 0],
            }}
            transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        >
            <div className="w-12 h-4 bg-[#8B4513] -ml-2 mt-2 rounded-sm"></div>
        </motion.div>
    );

    // Wicket Set Animation
    const WicketSet = () => (
        <motion.div 
            className="absolute flex space-x-3 z-20"
            animate={{
                y: [0, -5, 0],
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        >
            <div className="flex flex-col items-center">
                <div className="w-1 h-10 bg-[#D4AF37]"></div>
                <div className="w-6 h-1 bg-[#D4AF37] -mt-1"></div>
            </div>
            <div className="flex flex-col items-center">
                <div className="w-1 h-12 bg-[#D4AF37]"></div>
                <div className="w-6 h-1 bg-[#D4AF37] -mt-1"></div>
            </div>
            <div className="flex flex-col items-center">
                <div className="w-1 h-10 bg-[#D4AF37]"></div>
                <div className="w-6 h-1 bg-[#D4AF37] -mt-1"></div>
            </div>
        </motion.div>
    );

    return (
        <section className="relative py-20 bg-gradient-to-b from-[#0A0A0A] to-black overflow-hidden">
            <div className='mx-auto w-11/12'>
                {/* Animated background elements */}
                <div className="absolute inset-0 z-0">
                    <motion.div
                        className="absolute top-20 left-10 w-72 h-72 bg-[#D4AF37] rounded-full filter blur-3xl opacity-5"
                        animate={{
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute bottom-10 right-10 w-96 h-96 bg-[#D4AF37] rounded-full filter blur-3xl opacity-5"
                        animate={{
                            scale: [1.1, 1, 1.1],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                        }}
                    />

                    {/* Cricket field outline */}
                    <motion.div 
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 h-3/5 border border-[#D4AF37] opacity-10 rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                    />
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    {/* Section Header */}
                    <motion.div
                        ref={ref}
                        initial="hidden"
                        animate={inView ? "visible" : "hidden"}
                        variants={containerVariants}
                        className="text-center mb-16"
                    >
                        <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-bold mb-6">
                            <span className="text-white">Our </span>
                            <span className="text-[#D4AF37]">Visionary Leader</span>
                        </motion.h2>
                        <motion.div variants={itemVariants} className="w-24 h-1 bg-[#D4AF37] mx-auto mb-8"></motion.div>
                        <motion.p variants={itemVariants} className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Meet the passionate founder behind Mighty Strikers and his journey to creating a cricket legacy.
                        </motion.p>
                    </motion.div>

                    {/* Founder Profile */}
                    <motion.div
                        ref={ref2}
                        initial="hidden"
                        animate={inView2 ? "visible" : "hidden"}
                        variants={containerVariants}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16"
                    >
                        {/* Founder Image with cricket animations */}
                        <motion.div
                            variants={itemVariants}
                            className="relative flex justify-center"
                        >
                            {/* Circular container for image */}
                            <div className="relative w-72 h-72 rounded-full overflow-hidden border-4 border-[#0A0A0A] shadow-2xl z-10">
                                <div className="w-full h-full bg-gradient-to-br from-[#D4AF37] to-[#8B4513] flex items-center justify-center">
                                    <div className="w-[95%] h-[95%] bg-[#1A1A1A] rounded-full overflow-hidden flex items-center justify-center">
                                        <Image
                                            src={founder.image}
                                            alt={founder.name}
                                            width={280}
                                            height={280}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                
                                {/* Floating cricket elements */}
                                <motion.div
                                    className="absolute -top-2 -left-2"
                                    animate={{
                                        y: [0, -10, 0],
                                        rotate: [0, 15, 0],
                                    }}
                                    transition={{
                                        duration: 5,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <CricketBall />
                                </motion.div>
                                
                                <motion.div
                                    className="absolute -bottom-4 -right-4"
                                    animate={{
                                        y: [0, 8, 0],
                                        rotate: [0, -10, 0],
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: 0.5
                                    }}
                                >
                                    <CricketBat />
                                </motion.div>
                                
                                <motion.div
                                    className="absolute -left-6 bottom-8"
                                    animate={{
                                        scale: [1, 1.05, 1],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: 1
                                    }}
                                >
                                    <WicketSet />
                                </motion.div>
                            </div>

                            {/* Background decorative elements */}
                            <motion.div
                                className="absolute top-10 -left-4 w-24 h-24 border-2 border-[#D4AF37] rounded-full opacity-30 z-0"
                                animate={{
                                    rotate: 360,
                                }}
                                transition={{
                                    duration: 25,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            />
                            <motion.div
                                className="absolute bottom-10 -right-4 w-32 h-32 border-2 border-[#D4AF37] rounded-full opacity-30 z-0"
                                animate={{
                                    rotate: -360,
                                }}
                                transition={{
                                    duration: 30,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            />
                            
                            {/* Animated particles */}
                            {isClient && [...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className={`absolute w-3 h-3 bg-[#D4AF37] rounded-full opacity-40 z-0`}
                                    style={{
                                        top: `${10 + i * 15}%`,
                                        left: `${20 + i * 10}%`,
                                    }}
                                    animate={{
                                        y: [0, -15, 0],
                                        scale: [1, 1.5, 1],
                                    }}
                                    transition={{
                                        duration: Math.random() * 3 + 2,
                                        repeat: Infinity,
                                        delay: Math.random() * 2
                                    }}
                                />
                            ))}
                        </motion.div>

                        {/* Founder Details */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] p-8 rounded-2xl border border-[#2A2A2A] shadow-lg"
                        >
                            <motion.h3
                                className="text-2xl md:text-3xl font-bold text-[#D4AF37] mb-2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                {founder.name}
                            </motion.h3>
                            <motion.p
                                className="text-gray-400 mb-6"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                {founder.role}
                            </motion.p>

                            <motion.p
                                className="text-gray-300 mb-6 leading-relaxed"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                            >
                                {founder.bio}
                            </motion.p>

                            <motion.div
                                className="p-4 bg-[#0A0A0A] rounded-xl border-l-4 border-[#D4AF37] mb-6"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 }}
                            >
                                <p className="text-gray-300 italic">"{founder.philosophy}"</p>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Founder's Quote */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.6, duration: 0.7 }}
                        className="text-center"
                    >
                        <div className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] p-8 rounded-2xl border border-[#2A2A2A] shadow-lg relative overflow-hidden">
                            <motion.div 
                                className="absolute -top-4 -left-4 w-20 h-20 bg-[#D4AF37] rounded-full opacity-10"
                                animate={{
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                            <motion.div 
                                className="absolute -bottom-4 -right-4 w-16 h-16 bg-[#D4AF37] rounded-full opacity-10"
                                animate={{
                                    scale: [1, 1.3, 1],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 1
                                }}
                            />
                            
                            <svg className="w-12 h-12 text-[#D4AF37] mx-auto mb-4 relative z-10" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                            </svg>
                            <p className="text-xl text-gray-300 italic mb-4 relative z-10">"{founder.quote}"</p>
                            <p className="text-[#D4AF37] font-semibold relative z-10">— {founder.name}</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default FounderSection;