'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';

// Animation variants (same as before)
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
    const [isEditing, setIsEditing] = useState(false);
    const [showSaveConfirm, setShowSaveConfirm] = useState(false);
    const [showImageUpload, setShowImageUpload] = useState(false);
    const [tempImage, setTempImage] = useState('');
    const [tempAge, setTempAge] = useState('');

    // Player data with additional stats
    const initialPlayerData = {
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
        ],
        // New stats
        halfCenturies: 15,
        centuries: 3,
        thirties: 22,
        threeWickets: 2,
        fiveWickets: 0,
        maidens: 5
    };

    const [player, setPlayer] = useState(initialPlayerData);

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const handleIncrement = (stat, isBatting = true) => {
        if (!isEditing) return;

        setPlayer(prev => {
            let updatedPlayer = { ...prev };

            if (isBatting) {
                switch (stat) {
                    case 'matches':
                        updatedPlayer.matches += 1;
                        // Auto-calculate average
                        updatedPlayer.average = parseFloat((updatedPlayer.runs / updatedPlayer.matches).toFixed(2));
                        break;
                    case 'runs':
                        updatedPlayer.runs += 1;
                        // Auto-calculate average
                        updatedPlayer.average = parseFloat((updatedPlayer.runs / updatedPlayer.matches).toFixed(2));
                        break;
                    case 'halfCenturies':
                        updatedPlayer.halfCenturies += 1;
                        break;
                    case 'centuries':
                        updatedPlayer.centuries += 1;
                        break;
                    case 'thirties':
                        updatedPlayer.thirties += 1;
                        break;
                    default:
                        break;
                }
            } else {
                switch (stat) {
                    case 'wickets':
                        updatedPlayer.wickets += 1;
                        break;
                    case 'threeWickets':
                        updatedPlayer.threeWickets += 1;
                        break;
                    case 'fiveWickets':
                        updatedPlayer.fiveWickets += 1;
                        break;
                    case 'maidens':
                        updatedPlayer.maidens += 1;
                        break;
                    default:
                        break;
                }
            }

            return updatedPlayer;
        });
    };

    const handleInputChange = (field, value, isBatting = true) => {
        if (!isEditing) return;

        setPlayer(prev => {
            const updatedPlayer = { ...prev };

            if (isBatting) {
                switch (field) {
                    case 'strikeRate':
                        updatedPlayer.strikeRate = parseFloat(value) || 0;
                        break;
                    case 'bestBatting':
                        updatedPlayer.bestBatting = value;
                        break;
                    default:
                        break;
                }
            } else {
                switch (field) {
                    case 'economy':
                        updatedPlayer.economy = parseFloat(value) || 0;
                        break;
                    case 'bestBowling':
                        updatedPlayer.bestBowling = value;
                        break;
                    default:
                        break;
                }
            }

            return updatedPlayer;
        });
    };

    const handleSave = () => {
        setShowSaveConfirm(true);
    };

    const confirmSave = (confirm) => {
        if (confirm) {
            // Here you would typically send the updated data to an API
            console.log("Data saved:", player);
            setIsEditing(false);
        }
        setShowSaveConfirm(false);
    };

    const cancelEdit = () => {
        setPlayer(initialPlayerData);
        setIsEditing(false);
    };

    const handleImageChange = () => {
        setShowImageUpload(true);
    };

    const confirmImageChange = () => {
        if (tempImage) {
            setPlayer(prev => ({ ...prev, image: tempImage }));
        }
        setShowImageUpload(false);
        setTempImage('');
    };

    const handleAgeChange = () => {
        setTempAge(player.age.toString());
    };

    const confirmAgeChange = () => {
        if (tempAge && !isNaN(tempAge)) {
            setPlayer(prev => ({ ...prev, age: parseInt(tempAge) }));
        }
        setTempAge('');
    };

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
            <div className='w-11/12 mx-auto mt-15 px-4'>
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

                    {/* Edit/Save buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex justify-end mb-4 gap-2"
                    >
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-[#D4AF37] text-black font-medium rounded-lg hover:bg-yellow-500 transition-colors"
                            >
                                Edit Stats
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={cancelEdit}
                                    className="px-4 py-2 bg-gray-600 font-medium rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-green-600 font-medium rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Save Changes
                                </button>
                            </>
                        )}
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
                                {/* Image Change Button */}
                                <div className="absolute top-4 right-4">
                                    <button
                                        onClick={handleImageChange}
                                        className="px-3 py-1 bg-[#D4AF37] text-black text-sm font-medium rounded-lg hover:bg-yellow-500 transition-colors"
                                    >
                                        Change Image
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <p className="text-gray-400">Age</p>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold">{player.age} years</p>
                                            <button
                                                onClick={handleAgeChange}
                                                className="w-5 h-5 bg-[#D4AF37] text-black rounded-full flex items-center justify-center text-xs font-bold"
                                            >
                                                ✎
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-400">Debut</p>
                                        <p className="font-bold">{player.debut}</p>
                                    </div>
                                </div>

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

                                {/* Moved Playing Style to bottom */}
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


                                {/* Moved Likes Display to bottom */}
                                <div className="flex items-center justify-center mt-4 p-3 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                                    <div className="flex items-center">
                                        <svg
                                            className="w-6 h-6 text-[#D4AF37] mr-2"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                        </svg>
                                        <span className="text-xl font-bold">{player.likes}</span>
                                        <span className="ml-2 text-gray-400">Likes</span>
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

                            {/* Tab Content */}
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
                                            className="bg-gradient-to-b from-[#1a1a1a] to-black p-6 rounded-2xl border border-[#2a2a2a] shadow-lg relative"
                                            whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(212, 175, 55, 0.15)" }}
                                        >
                                            <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Batting Statistics</h3>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                                    <span className="text-gray-400">Matches</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-lg">{player.matches}</span>
                                                        {isEditing && (
                                                            <button
                                                                onClick={() => handleIncrement('matches')}
                                                                className="w-6 h-6 bg-[#D4AF37] text-black rounded-full flex items-center justify-center text-sm font-bold"
                                                            >
                                                                +
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                                    <span className="text-gray-400">Runs</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-lg">{player.runs}</span>
                                                        {isEditing && (
                                                            <button
                                                                onClick={() => handleIncrement('runs')}
                                                                className="w-6 h-6 bg-[#D4AF37] text-black rounded-full flex items-center justify-center text-sm font-bold"
                                                            >
                                                                +
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                                    <span className="text-gray-400">Average</span>
                                                    <span className="font-bold text-lg">{player.average}</span>
                                                </div>
                                                <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                                    <span className="text-gray-400">Strike Rate</span>
                                                    <div className="flex items-center gap-2">
                                                        {isEditing ? (
                                                            <input
                                                                type="number"
                                                                value={player.strikeRate}
                                                                onChange={(e) => handleInputChange('strikeRate', e.target.value)}
                                                                className="w-20 bg-[#2a2a2a] border border-[#D4AF37] rounded-md px-2 py-1 text-white text-right"
                                                                step="0.1"
                                                            />
                                                        ) : (
                                                            <span className="font-bold text-lg">{player.strikeRate}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                                    <span className="text-gray-400">Best Batting</span>
                                                    <div className="flex items-center gap-2">
                                                        {isEditing ? (
                                                            <input
                                                                type="text"
                                                                value={player.bestBatting}
                                                                onChange={(e) => handleInputChange('bestBatting', e.target.value)}
                                                                className="w-32 bg-[#2a2a2a] border border-[#D4AF37] rounded-md px-2 py-1 text-white text-right"
                                                            />
                                                        ) : (
                                                            <span className="font-bold">{player.bestBatting}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                {/* New batting stats */}
                                                <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                                    <span className="text-gray-400">50s</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-lg">{player.halfCenturies}</span>
                                                        {isEditing && (
                                                            <button
                                                                onClick={() => handleIncrement('halfCenturies')}
                                                                className="w-6 h-6 bg-[#D4AF37] text-black rounded-full flex items-center justify-center text-sm font-bold"
                                                            >
                                                                +
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                                    <span className="text-gray-400">100s</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-lg">{player.centuries}</span>
                                                        {isEditing && (
                                                            <button
                                                                onClick={() => handleIncrement('centuries')}
                                                                className="w-6 h-6 bg-[#D4AF37] text-black rounded-full flex items-center justify-center text-sm font-bold"
                                                            >
                                                                +
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center py-2">
                                                    <span className="text-gray-400">30s</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-lg">{player.thirties}</span>
                                                        {isEditing && (
                                                            <button
                                                                onClick={() => handleIncrement('thirties')}
                                                                className="w-6 h-6 bg-[#D4AF37] text-black rounded-full flex items-center justify-center text-sm font-bold"
                                                            >
                                                                +
                                                            </button>
                                                        )}
                                                    </div>
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
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-lg">{player.wickets}</span>
                                                        {isEditing && (
                                                            <button
                                                                onClick={() => handleIncrement('wickets', false)}
                                                                className="w-6 h-6 bg-[#D4AF37] text-black rounded-full flex items-center justify-center text-sm font-bold"
                                                            >
                                                                +
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                                    <span className="text-gray-400">Economy</span>
                                                    <div className="flex items-center gap-2">
                                                        {isEditing ? (
                                                            <input
                                                                type="number"
                                                                value={player.economy}
                                                                onChange={(e) => handleInputChange('economy', e.target.value, false)}
                                                                className="w-20 bg-[#2a2a2a] border border-[#D4AF37] rounded-md px-2 py-1 text-white text-right"
                                                                step="0.1"
                                                            />
                                                        ) : (
                                                            <span className="font-bold text-lg">{player.economy}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                                    <span className="text-gray-400">Best Bowling</span>
                                                    <div className="flex items-center gap-2">
                                                        {isEditing ? (
                                                            <input
                                                                type="text"
                                                                value={player.bestBowling}
                                                                onChange={(e) => handleInputChange('bestBowling', e.target.value, false)}
                                                                className="w-24 bg-[#2a2a2a] border border-[#D4AF37] rounded-md px-2 py-1 text-white text-right"
                                                            />
                                                        ) : (
                                                            <span className="font-bold text-lg">{player.bestBowling}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                {/* New bowling stats */}
                                                <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                                    <span className="text-gray-400">3 Wickets</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-lg">{player.threeWickets}</span>
                                                        {isEditing && (
                                                            <button
                                                                onClick={() => handleIncrement('threeWickets', false)}
                                                                className="w-6 h-6 bg-[#D4AF37] text-black rounded-full flex items-center justify-center text-sm font-bold"
                                                            >
                                                                +
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                                    <span className="text-gray-400">5 Wickets</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-lg">{player.fiveWickets}</span>
                                                        {isEditing && (
                                                            <button
                                                                onClick={() => handleIncrement('fiveWickets', false)}
                                                                className="w-6 h-6 bg-[#D4AF37] text-black rounded-full flex items-center justify-center text-sm font-bold"
                                                            >
                                                                +
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center py-2">
                                                    <span className="text-gray-400">Maidens</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-lg">{player.maidens}</span>
                                                        {isEditing && (
                                                            <button
                                                                onClick={() => handleIncrement('maidens', false)}
                                                                className="w-6 h-6 bg-[#D4AF37] text-black rounded-full flex items-center justify-center text-sm font-bold"
                                                            >
                                                                +
                                                            </button>
                                                        )}
                                                    </div>
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

            {/* Save Confirmation Modal */}
            {showSaveConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#D4AF37] max-w-md w-full mx-4"
                    >
                        <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Confirm Save</h3>
                        <p className="mb-6">Are you sure you want to save these changes?</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => confirmSave(false)}
                                className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => confirmSave(true)}
                                className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Yes, Save
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Image Change Modal */}
            {showImageUpload && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#D4AF37] max-w-md w-full mx-4"
                    >
                        <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Change Player Image</h3>
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-2">Image URL</label>
                            <input
                                type="text"
                                value={tempImage}
                                onChange={(e) => setTempImage(e.target.value)}
                                placeholder="Enter image URL"
                                className="w-full bg-[#2a2a2a] border border-[#D4AF37] rounded-md px-3 py-2 text-white"
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowImageUpload(false)}
                                className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmImageChange}
                                className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Change Image
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Age Change Modal */}
            {tempAge && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#D4AF37] max-w-md w-full mx-4"
                    >
                        <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Change Age</h3>
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-2">New Age</label>
                            <input
                                type="number"
                                value={tempAge}
                                onChange={(e) => setTempAge(e.target.value)}
                                className="w-full bg-[#2a2a2a] border border-[#D4AF37] rounded-md px-3 py-2 text-white"
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setTempAge('')}
                                className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmAgeChange}
                                className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Change Age
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default PlayerDashboard;