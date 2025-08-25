'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';

const TeamPage = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Check screen size on mount and resize
    useEffect(() => {
        const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
        // Only run on client side to avoid hydration issues
        if (typeof window !== 'undefined') {
            checkIsMobile();
            window.addEventListener('resize', checkIsMobile);
        }
        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', checkIsMobile);
            }
        };
    }, []);

    // Predefined particle positions to avoid hydration mismatch
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

    // Team data
    const teamCategories = [
        { id: 'all', name: 'All Players' },
        { id: 'batsmen', name: 'Batsmen' },
        { id: 'bowlers', name: 'Bowlers' },
        { id: 'allrounders', name: 'All-Rounders' },
        { id: 'staff', name: 'Support Staff' },
    ];

    const teamMembers = [
        {
            id: 1,
            name: 'Alex Johnson',
            role: 'Captain & Batsman',
            category: 'batsmen',
            battingStyle: 'Right Handed',
            bowlingStyle: 'Right Arm Medium',
            matches: 45,
            runs: 2150,
            wickets: 12,
            image: '/player1.jpg'
        },
        {
            id: 2,
            name: 'James Wilson',
            role: 'Vice Captain & Bowler',
            category: 'bowlers',
            battingStyle: 'Left Handed',
            bowlingStyle: 'Left Arm Fast',
            matches: 42,
            runs: 580,
            wickets: 78,
            image: '/player2.jpg'
        },
        {
            id: 3,
            name: 'Michael Taylor',
            role: 'All-Rounder',
            category: 'allrounders',
            battingStyle: 'Right Handed',
            bowlingStyle: 'Right Arm Off Spin',
            matches: 38,
            runs: 1250,
            wickets: 45,
            image: '/player3.jpg'
        },
        {
            id: 4,
            name: 'David Clark',
            role: 'Batsman',
            category: 'batsmen',
            battingStyle: 'Left Handed',
            bowlingStyle: 'Right Arm Leg Spin',
            matches: 36,
            runs: 1780,
            wickets: 5,
            image: '/player4.jpg'
        },
        {
            id: 5,
            name: 'Robert Martinez',
            role: 'Bowler',
            category: 'bowlers',
            battingStyle: 'Right Handed',
            bowlingStyle: 'Right Arm Fast',
            matches: 40,
            runs: 320,
            wickets: 65,
            image: '/player5.jpg'
        },
        {
            id: 6,
            name: 'William Brown',
            role: 'Wicketkeeper',
            category: 'batsmen',
            battingStyle: 'Right Handed',
            bowlingStyle: '-',
            matches: 32,
            runs: 980,
            wickets: 0,
            image: '/player6.jpg'
        },
        {
            id: 7,
            name: 'Thomas Anderson',
            role: 'Head Coach',
            category: 'staff',
            specialty: 'Batting Coach',
            experience: '15 years',
            achievements: 'Former National Team Player',
            image: '/coach1.jpg'
        },
        {
            id: 8,
            name: 'Christopher Lee',
            role: 'Bowling Coach',
            category: 'staff',
            specialty: 'Fast Bowling',
            experience: '12 years',
            achievements: '100+ International Wickets',
            image: '/coach2.jpg'
        },
    ];

    const filteredMembers = activeCategory === 'all'
        ? teamMembers
        : teamMembers.filter(member => member.category === activeCategory);

    return (
        <div className='min-h-screen bg-gradient-to-b from-black to-[#0A0A0A] text-white'>
            <div className="w-11/12 mx-auto  pt-20 pb-16">
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

                    {/* Floating particles - using predefined positions to avoid hydration issues */}
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
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            <span className="text-white">Meet The </span>
                            <span className="text-[#D4AF37]">Mighty Strikers</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                            A team of passionate cricketers dedicated to excellence, sportsmanship, and the spirit of the game.
                        </p>
                    </motion.div>

                    {/* Mobile Filter Toggle Button */}
                    <div className="md:hidden flex justify-center mb-6">
                        <motion.button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center gap-2 bg-[#D4AF37] text-black font-semibold py-2 px-4 rounded-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span>Filters</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                        </motion.button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Filter Sidebar - Hidden on mobile, shown as hamburger menu */}
                        <AnimatePresence>
                            {(isFilterOpen || !isMobile) && (
                                <motion.div
                                    initial={isMobile ? { x: -300, opacity: 0 } : { opacity: 1 }}
                                    animate={isMobile ? { x: 0, opacity: 1 } : { opacity: 1 }}
                                    exit={isMobile ? { x: -300, opacity: 0 } : { opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className={`md:sticky md:top-28 md:h-fit ${isMobile ? 'fixed inset-y-0 left-0 z-50 w-64 bg-[#0A0A0A] p-6 overflow-y-auto' : 'md:w-1/4'}`}
                                >
                                    {/* Close button for mobile */}
                                    {isMobile && (
                                        <button
                                            onClick={() => setIsFilterOpen(false)}
                                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}

                                    <motion.div
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className={isMobile ? "" : "pr-4"}
                                    >
                                        <h2 className="text-2xl font-bold mb-6 text-[#D4AF37] border-b border-[#D4AF37] pb-2">
                                            Filter Team
                                        </h2>

                                        <div className="space-y-3">
                                            {teamCategories.map((category) => (
                                                <motion.button
                                                    key={category.id}
                                                    variants={itemVariants}
                                                    onClick={() => {
                                                        setActiveCategory(category.id);
                                                        if (isMobile) setIsFilterOpen(false);
                                                    }}
                                                    className={`w-full text-left py-3 px-4 rounded-lg transition-all duration-300 ${activeCategory === category.id
                                                            ? 'bg-[#D4AF37] text-black font-bold'
                                                            : 'bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]'
                                                        }`}
                                                    whileHover={{ x: 5 }}
                                                >
                                                    {category.name}
                                                </motion.button>
                                            ))}
                                        </div>

                                        {/* Team Stats in sidebar for desktop */}
                                        {!isMobile && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.5 }}
                                                className="mt-8 bg-gradient-to-r from-[#0A0A0A] to-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a]"
                                            >
                                                <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Team Stats</h3>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Total Matches</span>
                                                        <span className="font-bold">56</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Matches Won</span>
                                                        <span className="font-bold text-green-400">42</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Tournaments</span>
                                                        <span className="font-bold">8</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Total Runs</span>
                                                        <span className="font-bold">12,580</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Overlay for mobile filter */}
                        {isMobile && isFilterOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black bg-opacity-70 z-40"
                                onClick={() => setIsFilterOpen(false)}
                            />
                        )}

                        {/* Main Content - Player Cards */}
                        <div className="flex-1">
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                            >
                                {filteredMembers.map((member, index) => (
                                    <motion.div
                                        key={member.id}
                                        variants={itemVariants}
                                        className="bg-gradient-to-b from-[#1a1a1a] to-black rounded-2xl overflow-hidden border border-[#2a2a2a] shadow-lg"
                                        whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(212, 175, 55, 0.2)" }}
                                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                    >
                                        {/* Player Image */}
                                        <div className="relative h-64 overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
                                            <Image
                                                src={member.image || '/default-player.jpg'}
                                                alt={member.name}
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute bottom-4 left-4 z-20">
                                                <h3 className="text-xl font-bold">{member.name}</h3>
                                                <p className="text-[#D4AF37]">{member.role}</p>
                                            </div>
                                        </div>

                                        {/* Player Details */}
                                        <div className="p-6">
                                            {member.category !== 'staff' ? (
                                                <>
                                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                                        <div>
                                                            <p className="text-gray-400 text-sm">Matches</p>
                                                            <p className="font-bold text-lg">{member.matches}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-400 text-sm">Runs</p>
                                                            <p className="font-bold text-lg">{member.runs}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-400 text-sm">Wickets</p>
                                                            <p className="font-bold text-lg">{member.wickets}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-400 text-sm">Style</p>
                                                            <p className="font-bold text-sm">{member.battingStyle}</p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-[#0A0A0A] p-3 rounded-lg">
                                                        <p className="text-gray-400 text-sm">Bowling</p>
                                                        <p className="font-medium">{member.bowlingStyle}</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="mb-4">
                                                        <p className="text-gray-400 text-sm">Specialty</p>
                                                        <p className="font-bold">{member.specialty}</p>
                                                    </div>
                                                    <div className="mb-4">
                                                        <p className="text-gray-400 text-sm">Experience</p>
                                                        <p className="font-bold">{member.experience}</p>
                                                    </div>
                                                    <div className="bg-[#0A0A0A] p-3 rounded-lg">
                                                        <p className="text-gray-400 text-sm">Achievements</p>
                                                        <p className="font-medium">{member.achievements}</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Team Stats Section - Full width on all devices */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="mt-12 bg-gradient-to-r from-[#0A0A0A] to-[#1a1a1a] rounded-2xl p-8 border border-[#2a2a2a]"
                            >
                                <h2 className="text-3xl font-bold mb-8 text-center text-[#D4AF37]">Team Statistics</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <motion.div
                                        className="text-center p-6 bg-black rounded-xl"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <div className="text-4xl font-bold text-[#D4AF37]">24</div>
                                        <div className="text-gray-400 mt-2">Matches Won</div>
                                    </motion.div>
                                    <motion.div
                                        className="text-center p-6 bg-black rounded-xl"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <div className="text-4xl font-bold text-[#D4AF37]">5</div>
                                        <div className="text-gray-400 mt-2">Tournaments</div>
                                    </motion.div>
                                    <motion.div
                                        className="text-center p-6 bg-black rounded-xl"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <div className="text-4xl font-bold text-[#D4AF37]">18</div>
                                        <div className="text-gray-400 mt-2">Players</div>
                                    </motion.div>
                                    <motion.div
                                        className="text-center p-6 bg-black rounded-xl"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <div className="text-4xl font-bold text-[#D4AF37]">2150</div>
                                        <div className="text-gray-400 mt-2">Total Runs</div>
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Join Team CTA - Full width on all devices */}
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7 }}
                                viewport={{ once: true }}
                                className="mt-12 text-center"
                            >
                                <h2 className="text-3xl font-bold mb-6">Want to Join Our Team?</h2>
                                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                                    We're always looking for talented players who share our passion for cricket and team spirit.
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(212, 175, 55, 0.5)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-[#D4AF37] text-black font-bold py-3 px-8 rounded-full text-lg transition-all duration-300"
                                >
                                    Apply Now
                                </motion.button>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamPage;