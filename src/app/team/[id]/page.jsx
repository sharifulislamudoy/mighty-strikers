'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

// This would typically come from a database or API
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
        average: 47.8,
        strikeRate: 132.5,
        bestBowling: '3/28',
        age: 28,
        debut: '2018',
        image: '/founder.jpg',
        bio: 'An explosive top-order batsman known for his aggressive stroke play and leadership on the field. Alex has been the cornerstone of our batting lineup for the past 5 seasons.',
        specialties: ['Power Hitting', 'Leadership', 'Fielding'],
        achievements: ['Player of the Tournament 2022', 'Most Runs Award 2021', 'Best Captain 2020'],
        likes: 125 // Added initial like count
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
        average: 22.4,
        economy: 7.2,
        bestBowling: '5/32',
        age: 26,
        debut: '2019',
        image: '/player2.jpg',
        bio: 'A left-arm speedster who consistently clocks 140+ km/h. James is feared for his deadly yorkers and ability to break partnerships in crunch moments.',
        specialties: ['Yorkers', 'Swing Bowling', 'Death Overs'],
        achievements: ['Best Bowler Award 2022', 'Hat-trick vs Titans', 'Emerging Player 2019'],
        likes: 89 // Added initial like count
    },
    // Add the rest of your team members with more detailed data
];

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

const statItemVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 10
        }
    }
};

const PlayerDetailsPage = () => {
    const params = useParams();
    const playerId = parseInt(params.id);
    const player = teamMembers.find(member => member.id === playerId);
    const [isLoading, setIsLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(player?.likes || 0);

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        // Check if user has already liked this player (from localStorage)
        const likedPlayers = JSON.parse(localStorage.getItem('likedPlayers') || '{}');
        if (likedPlayers[playerId]) {
            setLiked(true);
        }

        return () => clearTimeout(timer);
    }, [playerId]);

    const handleLike = () => {
        if (liked) {
            // Unlike the player
            setLikeCount(prev => prev - 1);
            setLiked(false);

            // Update localStorage
            const likedPlayers = JSON.parse(localStorage.getItem('likedPlayers') || '{}');
            delete likedPlayers[playerId];
            localStorage.setItem('likedPlayers', JSON.stringify(likedPlayers));
        } else {
            // Like the player
            setLikeCount(prev => prev + 1);
            setLiked(true);

            // Update localStorage
            const likedPlayers = JSON.parse(localStorage.getItem('likedPlayers') || '{}');
            likedPlayers[playerId] = true;
            localStorage.setItem('likedPlayers', JSON.stringify(likedPlayers));
        }
    };

    if (!player) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black to-[#0A0A0A] text-white flex items-center justify-center">
                <div className="text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold mb-4"
                    >
                        Player Not Found
                    </motion.h1>
                    <Link href="/team" className="text-[#D4AF37] hover:underline">
                        Back to Team
                    </Link>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black to-[#0A0A0A] flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-[#0A0A0A] text-white overflow-hidden">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 z-0 overflow-hidden">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-[#D4AF37]"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.3 + 0.1
                        }}
                        animate={{
                            y: [0, -20, 0],
                            x: [0, (i % 2 === 0 ? 1 : -1) * 10, 0],
                        }}
                        transition={{
                            duration: 4 + Math.random() * 2,
                            repeat: Infinity,
                            delay: i * 0.5
                        }}
                    />
                ))}
            </div>

            <div className="container w-11/12 mx-auto px-4 py-20 relative z-10">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link
                        href="/team"
                        className="inline-flex items-center text-[#D4AF37] mb-8 hover:underline group"
                    >
                        <motion.div
                            whileHover={{ x: -5 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            className="flex items-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Team
                        </motion.div>
                    </Link>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col lg:flex-row gap-10"
                >
                    {/* Player Image */}
                    <motion.div
                        variants={itemVariants}
                        className="lg:w-2/5"
                    >
                        <motion.div
                            className="relative h-96 rounded-2xl overflow-hidden shadow-2xl"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 z-10" />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-transparent opacity-10 z-10" />
                            <Image
                                src={player.image || '/default-player.jpg'}
                                alt={player.name}
                                fill
                                className="object-cover"
                                priority
                            />
                            <motion.div
                                className="absolute bottom-4 left-4 z-20"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <h1 className="text-3xl md:text-4xl font-bold">{player.name}</h1>
                                <p className="text-xl text-[#D4AF37]">{player.role}</p>
                            </motion.div>
                        </motion.div>

                        {/* Specialties */}
                        {player.specialties && (
                            <motion.div
                                variants={itemVariants}
                                className="mt-6"
                            >
                                <h3 className="text-xl font-bold mb-3 text-[#D4AF37]">Specialties</h3>
                                <div className="flex flex-wrap gap-2">
                                    {player.specialties.map((specialty, index) => (
                                        <motion.span
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.7 + index * 0.1 }}
                                            className="px-3 py-1 bg-[#1a1a1a] border border-[#D4AF37] rounded-full text-sm"
                                        >
                                            {specialty}
                                        </motion.span>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                        {/* Like Button Section - Replacing Bio */}
                        <motion.div
                            variants={itemVariants}
                            className="my-8 p-6 bg-gradient-to-r from-[#1a1a1a] to-[#0A0A0A] rounded-2xl border border-[#2a2a2a] flex flex-col items-center"
                        >
                            <motion.button
                                onClick={handleLike}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`p-4 rounded-full mb-4 ${liked ? 'bg-[#D4AF37] text-black' : 'bg-[#2a2a2a] text-white'} transition-colors duration-300`}
                                aria-label={liked ? 'Unlike this player' : 'Like this player'}
                            >
                                <svg
                                    className="w-8 h-8"
                                    fill={liked ? "currentColor" : "none"}
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </motion.button>
                            <p className="text-xl font-semibold">{likeCount} people like this player</p>
                            <p className="text-gray-400 mt-2">Show your support for {player.name}</p>
                        </motion.div>
                    </motion.div>

                    {/* Player Details */}
                    <motion.div
                        variants={itemVariants}
                        className="lg:w-3/5"
                    >

                        {/* Player Stats */}
                        <motion.div
                            variants={containerVariants}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                        >
                            <motion.div
                                variants={statItemVariants}
                                className="bg-gradient-to-b from-[#1a1a1a] to-black p-6 rounded-2xl border border-[#2a2a2a] shadow-lg"
                                whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(212, 175, 55, 0.15)" }}
                            >
                                <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Batting Stats</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                        <span className="text-gray-400">Matches</span>
                                        <span className="font-bold text-lg">{player.matches}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                        <span className="text-gray-400">Runs</span>
                                        <span className="font-bold text-lg">{player.runs}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                        <span className="text-gray-400">Average</span>
                                        <span className="font-bold text-lg">{player.average}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                        <span className="text-gray-400">Strike Rate</span>
                                        <span className="font-bold text-lg">{player.strikeRate}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-400">Style</span>
                                        <span className="font-bold">{player.battingStyle}</span>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                variants={statItemVariants}
                                className="bg-gradient-to-b from-[#1a1a1a] to-black p-6 rounded-2xl border border-[#2a2a2a] shadow-lg"
                                whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(212, 175, 55, 0.15)" }}
                            >
                                <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Bowling Stats</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                        <span className="text-gray-400">Wickets</span>
                                        <span className="font-bold text-lg">{player.wickets}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                        <span className="text-gray-400">Economy</span>
                                        <span className="font-bold text-lg">{player.economy}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                        <span className="text-gray-400">Best Bowling</span>
                                        <span className="font-bold text-lg">{player.bestBowling}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-400">Style</span>
                                        <span className="font-bold">{player.bowlingStyle}</span>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Personal Info Section - Replacing Achievements */}
                        <motion.div
                            variants={statItemVariants}
                            className="bg-gradient-to-b from-[#1a1a1a] mt-14 to-black p-6 rounded-2xl border border-[#2a2a2a] shadow-lg"
                            whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(212, 175, 55, 0.15)" }}
                        >
                            <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Personal Information</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                    <span className="text-gray-400">Age</span>
                                    <span className="font-bold">{player.age} years</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                    <span className="text-gray-400">Debut</span>
                                    <span className="font-bold">{player.debut}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                    <span className="text-gray-400">Role</span>
                                    <span className="font-bold">{player.role}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-400">Category</span>
                                    <span className="font-bold capitalize">{player.category}</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default PlayerDetailsPage;