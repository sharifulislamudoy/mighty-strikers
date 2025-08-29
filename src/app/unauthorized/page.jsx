'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import Link from 'next/link';

const UnauthorizedPage = () => {
    // Predefined particle positions to match the team page design
    const particlePositions = useMemo(() => [
        { top: "4.06%", left: "80.49%", opacity: 0.16 },
        { top: "32.83%", left: "34.72%", opacity: 0.16 },
        { top: "89.70%", left: "66.91%", opacity: 0.17 },
        { top: "76.67%", left: "0.09%", opacity: 0.18 },
        { top: "85.65%", left: "50.75%", opacity: 0.42 },
        { top: "39.62%", left: "23.81%", opacity: 0.18 },
        { top: "72.39%", left: "2.42%", opacity: 0.14 },
        { top: "35.22%", left: "70.55%", opacity: 0.24 },
        { top: "53.36%", left: "88.30%", opacity: 0.24 },
        { top: "5.74%", left: "40.06%", opacity: 0.54 },
        { top: "0.66%", left: "48.86%", opacity: 0.32 },
        { top: "23.16%", left: "34.57%", opacity: 0.36 },
        { top: "36.94%", left: "9.42%", opacity: 0.39 },
        { top: "27.70%", left: "33.49%", opacity: 0.32 },
        { top: "87.13%", left: "51.17%", opacity: 0.16 }
    ], []);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.1
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

    return (
        <div className='min-h-screen bg-gradient-to-b from-black to-[#0A0A0A] text-white'>
            <div className="w-11/12 mx-auto pt-30 pb-16">
                {/* Animated background elements */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    {/* Cricket field circles */}
                    <motion.div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37] opacity-10"
                        initial={{ width: 0, height: 0 }}
                        animate={{ width: 600, height: 600 }}
                        transition={{ duration: 2 }}
                    />
                    <motion.div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37] opacity-10"
                        initial={{ width: 0, height: 0 }}
                        animate={{ width: 400, height: 400 }}
                        transition={{ duration: 2, delay: 0.3 }}
                    />

                    {/* Floating particles - using predefined positions */}
                    {particlePositions.map((pos, i) => (
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
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                delay: i * 0.5
                            }}
                        />
                    ))}
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-center mb-10"
                    >
                        <motion.h1 
                            className="text-4xl md:text-6xl font-bold mb-6"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <span className="text-white">Access </span>
                            <span className="text-[#D4AF37]">Denied</span>
                        </motion.h1>
                        <motion.p 
                            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                        >
                            You need proper authorization to view this content.
                        </motion.p>
                    </motion.div>

                    {/* Main Content */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col items-center justify-center"
                    >


                        {/* Message */}
                        <motion.div
                            variants={itemVariants}
                            className="text-center mb-10"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#D4AF37]">
                                Unauthorized Access
                            </h2>
                            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                                It seems you don't have permission to access this page. Please sign in or contact the administrator if you believe this is an error.
                            </p>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col md:flex-row gap-4 justify-center items-center"
                        >
                            <Link href="/auth-form" passHref>
                                <motion.button
                                    className="bg-[#D4AF37] text-black font-semibold py-3 px-8 rounded-lg"
                                    whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(212, 175, 55, 0.4)" }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Join Our Team
                                </motion.button>
                            </Link>
                            
                            <Link href="/" passHref>
                                <motion.button
                                    className="bg-[#1a1a1a] text-white font-semibold py-3 px-8 rounded-lg border border-[#2a2a2a]"
                                    whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(212, 175, 55, 0.2)" }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Return Home
                                </motion.button>
                            </Link>
                        </motion.div>

                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default UnauthorizedPage;