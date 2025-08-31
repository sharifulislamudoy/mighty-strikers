'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const TeamPage = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPlayers, setTotalPlayers] = useState(0); // New state for total players count

    // Fetch team members from API
    useEffect(() => {
        const fetchTeamMembers = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/players');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch players');
                }
                
                const players = await response.json();
                setTeamMembers(players);
                setTotalPlayers(players.length); // Set the total players count
            } catch (err) {
                console.error('Error fetching players:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTeamMembers();
    }, []);

    // Check screen size on mount and resize
    useEffect(() => {
        const checkIsMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            setItemsPerPage(mobile ? 3 : 6);
        };
        
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

    // Team categories
    const teamCategories = [
        { id: 'all', name: 'All Players' },
        { id: 'Batsman', name: 'Batsmen' },
        { id: 'Bowlers', name: 'Bowlers' },
        { id: 'All-Rounder', name: 'All-Rounder' },
    ];

    const filteredMembers = activeCategory === 'all'
        ? teamMembers
        : teamMembers.filter(member => member.category === activeCategory);

    // Pagination logic
    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage);

    // Reset to first page when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory]);

    // Pagination controls component
    const PaginationControls = () => {
        if (totalPages <= 1) return null;

        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-md bg-[#1a1a1a] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    
                    {pageNumbers.map(number => (
                        <button
                            key={number}
                            onClick={() => setCurrentPage(number)}
                            className={`w-8 h-8 rounded-md ${currentPage === number 
                                ? 'bg-[#D4AF37] text-black font-bold' 
                                : 'bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]'
                            }`}
                        >
                            {number}
                        </button>
                    ))}
                    
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-md bg-[#1a1a1a] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black to-[#0A0A0A] flex items-center justify-center">
                <div className="text-white text-xl">Loading players...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black to-[#0A0A0A] flex items-center justify-center">
                <div className="text-red-500 text-xl">Error: {error}</div>
            </div>
        );
    }

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
                        <h1 className=" text-3xl md:text-4xl font-bold mb-6">
                            <span className="text-white">Meet The </span>
                            <span className="text-[#D4AF37]">Mighty Strikers</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 w-full mx-auto">
                            A team of passionate cricketers dedicated to excellence, sportsmanship, and the spirit of the game.
                        </p>
                        
                        {/* Display total players count */}
                        <div className="mt-6 inline-block bg-[#1a1a1a] px-4 py-2 rounded-lg">
                            <span className="text-[#D4AF37] font-bold">{totalPlayers}</span>
                            <span className="text-gray-300 ml-2">Total Players</span>
                        </div>
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

                                    <motion.div
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className={isMobile ? "" : "pr-4"}
                                    >
                                        <h2 className="text-2xl font-bold mb-6 text-[#D4AF37] border-b border-[#D4AF37] pb-2 mt-15 lg:mt-0">
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
                            {/* Category and count header */}
                            <div className="mb-6 flex justify-between items-center">
                                <h2 className="text-xl md:text-2xl font-bold text-[#D4AF37]">
                                    {teamCategories.find(cat => cat.id === activeCategory)?.name}
                                </h2>
                                <span className="text-gray-400">
                                    Showing {filteredMembers.length} of {totalPlayers} players
                                </span>
                            </div>

                            {filteredMembers.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-xl text-gray-400">No players found in this category.</p>
                                </div>
                            ) : (
                                <>
                                    <motion.div
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                                    >
                                        {paginatedMembers.map((member) => (
                                            <motion.div
                                                key={member._id}
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
                                                        <p className="text-[#D4AF37] capitalize">{member.category}</p>
                                                    </div>
                                                </div>

                                                {/* Player Details */}
                                                <div className="p-6">
                                                    <>
                                                        <div className="mb-4">
                                                            <p className="text-gray-400 text-sm">Batting Style</p>
                                                            <p className="font-medium">{member.battingStyle || 'Not specified'}</p>
                                                        </div>
                                                        <div className="mb-4">
                                                            <p className="text-gray-400 text-sm">Bowling Style</p>
                                                            <p className="font-medium">{member.bowlingStyle || 'Not specified'}</p>
                                                        </div>
                                                    </>

                                                    {/* View Details Button */}
                                                    <Link href={`/player/${member.username}`} passHref>
                                                        <motion.button
                                                            className="w-full bg-[#D4AF37] text-black font-semibold py-2 px-4 rounded-lg"
                                                            whileHover={{ scale: 1.03, boxShadow: "0 0 15px rgba(212, 175, 55, 0.4)" }}
                                                            whileTap={{ scale: 0.98 }}
                                                        >
                                                            View Details
                                                        </motion.button>
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>

                                    {/* Pagination Controls */}
                                    <PaginationControls />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamPage;