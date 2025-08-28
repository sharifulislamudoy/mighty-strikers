'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';

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

const PlayerDashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    // Player data
    const player = {
        id: 1,
        name: 'Alex Johnson',
        category: 'Captain & Batsman',
        battingStyle: 'Right Handed',
        bowlingStyle: 'Right Arm Medium',
        matches: 45,
        runs: 2150,
        wickets: 12,
        average: 47.8,
        strikeRate: 132.5,
        bestBatting: '128* (32)',
        economy: 7.2,
        bestBowling: '3/28',
        age: 28,
        debut: '2018',
        image: '/founder.jpg',
        specialties: ['Power Hitting', 'Leadership', 'Fielding'],
        likes: 125,
        recentPerformance: [
            { match: 'vs Titans', runs: 68, balls: 42, wickets: 0, result: 'Won' },
            { match: 'vs Warriors', runs: 42, balls: 28, wickets: 1, result: 'Lost' },
            { match: 'vs Strikers', runs: 105, balls: 58, wickets: 0, result: 'Won' },
            { match: 'vs Chargers', runs: 35, balls: 22, wickets: 2, result: 'Won' },
            { match: 'vs Royals', runs: 81, balls: 47, wickets: 0, result: 'Won' },
        ]
    };

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

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
            <div className='w-11/12 mx-auto mt-20'>
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

                <div className="container mx-auto px-4 py-8 relative z-10">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col md:flex-row justify-between items-center mb-8"
                    >
                        <div>
                            <h1 className="text-3xl font-bold">Player Dashboard</h1>
                            <p className="text-gray-400">Performance analytics and statistics</p>
                        </div>
                        <div className="flex items-center mt-4 md:mt-0">
                            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                            <span>Active</span>
                        </div>
                    </motion.div>

                    {/* Player Summary Card */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
                    >
                        {/* Player Profile Card */}
                        <motion.div
                            variants={itemVariants}
                            className="lg:col-span-1 bg-gradient-to-b from-[#1a1a1a] to-black rounded-2xl border border-[#2a2a2a] shadow-lg overflow-hidden"
                        >
                            <div className="relative h-48">
                                <Image
                                    src={player.image || '/default-player.jpg'}
                                    alt={player.name}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70" />
                                <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-transparent opacity-10" />
                                <div className="absolute bottom-4 left-4">
                                    <h2 className="text-2xl font-bold">{player.name}</h2>
                                    <p className="text-[#D4AF37]">{player.category}</p>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <p className="text-gray-400">Age</p>
                                        <p className="font-bold">{player.age} years</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-400">Debut</p>
                                        <p className="font-bold">{player.debut}</p>
                                    </div>
                                </div>
                                <p className="text-gray-300 mb-4">{player.bio}</p>

                                <div className="mb-4">
                                    <h3 className="text-[#D4AF37] font-bold mb-2">Specialties</h3>
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
                                </div>

                                <div>
                                    <h3 className="text-[#D4AF37] font-bold mb-2">Playing Style</h3>
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-gray-400">Batting</p>
                                            <p>{player.battingStyle}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400">Bowling</p>
                                            <p>{player.bowlingStyle}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Stats Overview */}
                        <div className="lg:col-span-2">
                            {/* Tabs Navigation */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex border-b border-[#2a2a2a] mb-6"
                            >
                                <button
                                    className={`px-4 py-3 font-medium ${activeTab === 'overview' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-gray-400'}`}
                                    onClick={() => setActiveTab('overview')}
                                >
                                    Overview
                                </button>
                                <button
                                    className={`px-4 py-3 font-medium ${activeTab === 'performance' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-gray-400'}`}
                                    onClick={() => setActiveTab('performance')}
                                >
                                    Performance
                                </button>
                            </motion.div>
                            
                            {/* Tab Content - Solution 2: Keep content mounted but hidden */}
                            <div className="w-full relative">
                                {/* Overview Tab */}
                                <motion.div
                                    className={activeTab !== 'overview' ? 'hidden' : ''}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={activeTab === 'overview' ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Batting Stats */}
                                        <motion.div
                                            variants={statItemVariants}
                                            className="bg-gradient-to-b from-[#1a1a1a] to-black p-6 rounded-2xl border border-[#2a2a2a] shadow-lg"
                                            whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(212, 175, 55, 0.15)" }}
                                        >
                                            <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Batting Statistics</h3>
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
                                                    <span className="text-gray-400">Best Batting</span>
                                                    <span className="font-bold">{player.bestBatting}</span>
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* Bowling Stats */}
                                        <motion.div
                                            variants={statItemVariants}
                                            className="bg-gradient-to-b from-[#1a1a1a] to-black p-6 rounded-2xl border border-[#2a2a2a] shadow-lg"
                                            whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(212, 175, 55, 0.15)" }}
                                        >
                                            <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Bowling Statistics</h3>
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
                                    </div>
                                </motion.div>

                                {/* Performance Tab */}
                                <motion.div
                                    className={activeTab !== 'performance' ? 'hidden' : ''}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={activeTab === 'performance' ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="bg-gradient-to-b from-[#1a1a1a] to-black p-6 rounded-2xl border border-[#2a2a2a] shadow-lg">
                                        <h3 className="text-xl font-bold mb-6 text-[#D4AF37]">Recent Performance</h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b border-[#2a2a2a]">
                                                        <th className="py-3 text-left">Match</th>
                                                        <th className="py-3 text-right">Runs</th>
                                                        <th className="py-3 text-right">Balls</th>
                                                        <th className="py-3 text-right">Wickets</th>
                                                        <th className="py-3 text-right">Result</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {player.recentPerformance.map((match, index) => (
                                                        <motion.tr
                                                            key={index}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: index * 0.1 }}
                                                            className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a] transition-colors"
                                                        >
                                                            <td className="py-3">{match.match}</td>
                                                            <td className="py-3 text-right font-bold">{match.runs}</td>
                                                            <td className="py-3 text-right">{match.balls}</td>
                                                            <td className="py-3 text-right">{match.wickets}</td>
                                                            <td className="py-3 text-right">
                                                                <span className={`px-2 py-1 rounded-full text-xs ${match.result === 'Won' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                                                    {match.result}
                                                                </span>
                                                            </td>
                                                        </motion.tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default PlayerDashboard;