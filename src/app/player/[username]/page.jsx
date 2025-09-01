'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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

// Tab animation variants
const tabContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
};

// TabButton component
const TabButton = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-6 py-3 text-lg font-medium transition-all duration-300 ${active
            ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]'
            : 'text-gray-400 hover:text-white'
            }`}
    >
        {children}
    </button>
);

const PlayerDetailsPage = () => {
    const params = useParams();
    const username = params.username;
    const [player, setPlayer] = useState(null);
    const [playerDetails, setPlayerDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchPlayerData = async () => {
            try {
                setIsLoading(true);

                // Fetch player basic info
                const playerResponse = await fetch(`/api/players/${username}`);
                if (!playerResponse.ok) {
                    throw new Error('Player not found');
                }
                const playerData = await playerResponse.json();
                setPlayer(playerData);
                setLikeCount(playerData.likes || 0);

                // Fetch player details/stats
                const detailsResponse = await fetch(`/api/player-details/${username}`);
                if (detailsResponse.ok) {
                    const detailsData = await detailsResponse.json();
                    setPlayerDetails(detailsData);
                } else {
                    console.warn('Player details not found');
                }

                // Check if user has already liked this player
                const likedPlayers = JSON.parse(localStorage.getItem('likedPlayers') || '{}');
                if (likedPlayers[username]) {
                    setLiked(true);
                }

            } catch (err) {
                console.error('Error fetching player data:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (username) {
            fetchPlayerData();
        }
    }, [username]);

    const handleLike = async () => {
        if (!player) return;

        try {
            console.log('Player username:', player.username);
            console.log('Making API call to:', `/api/players/${player.username}/like`);


            // Optimistically update UI
            setLiked(!liked);
            setLikeCount(prev => !liked ? prev + 1 : prev - 1);

            // Update localStorage
            const likedPlayers = JSON.parse(localStorage.getItem('likedPlayers') || '{}');
            if (!liked) {
                likedPlayers[player.username] = true;
            } else {
                delete likedPlayers[player.username];
            }
            localStorage.setItem('likedPlayers', JSON.stringify(likedPlayers));

            // Make API call
            const response = await fetch(`/api/players/${player.username}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ liked: !liked }),
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                throw new Error(errorData.message || 'Failed to update like');
            }

            const data = await response.json();
            console.log('API Success:', data);

            // Update with server response to ensure consistency
            setLikeCount(data.likes);

        } catch (err) {
            console.error('Error updating like:', err);

            // Revert UI on error
            setLiked(liked);
            setLikeCount(likeCount);

            // Show specific error message
            alert(`Error: ${err.message}`);
        }
    };

    // Render content based on active tab
    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewTab player={player} playerDetails={playerDetails} />;
            case 'stats':
                return <StatsTab playerDetails={playerDetails} />;
            case 'performance':
                return <PerformanceTab playerDetails={playerDetails} />;
            default:
                return <OverviewTab player={player} playerDetails={playerDetails} />;
        }
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

    if (error || !player) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black to-[#0A0A0A] text-white flex items-center justify-center">
                <div className="text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold mb-4"
                    >
                        {error || 'Player Not Found'}
                    </motion.h1>
                    <Link href="/team" className="text-[#D4AF37] hover:underline">
                        Back to Team
                    </Link>
                </div>
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
                    {/* Player Image & Basic Info */}
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
                                src={player.image || '/Mighty Strikers_ Golden Power.png'}
                                alt={player.name}
                                fill
                                className="object-cover"
                                priority
                            />

                            {/* Like Button as Overlay */}
                            <motion.div
                                className="absolute top-4 right-4 z-30"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <motion.button
                                    onClick={handleLike}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={`p-3 rounded-full ${liked ? 'bg-[#D4AF37] text-black' : 'bg-black/70 text-white'} transition-colors duration-300 backdrop-blur-sm`}
                                    aria-label={liked ? 'Unlike this player' : 'Like this player'}
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill={liked ? "currentColor" : "none"}
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </motion.button>
                            </motion.div>

                            <motion.div
                                className="absolute bottom-4 left-4 z-20"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <h1 className="text-3xl md:text-4xl font-bold">{player.name}</h1>
                                <p className="text-xl text-[#D4AF37] capitalize">{player.category}</p>
                                <div className="flex items-center mt-2 text-sm">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                    </svg>
                                    <span>{likeCount} likes</span>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Specialties */}
                        {player.specialties && player.specialties.length > 0 && (
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

                        {/* CrickHeroes Profile Link - Added below specialties */}
                        {player.profileUrl && (
                            <motion.div
                                variants={itemVariants}
                                className="mt-6"
                            >
                                <h3 className="text-xl font-bold mb-3 text-[#D4AF37]">CrickHeroes Profile</h3>
                                <a
                                    href={player.profileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 bg-[#1a1a1a] border border-[#D4AF37] rounded-lg text-white hover:bg-[#D4AF37] hover:text-black transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    View on CrickHeroes
                                </a>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Player Details with Tabs */}
                    <motion.div
                        variants={itemVariants}
                        className="lg:w-3/5"
                    >

                        {/* Tab Navigation */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex border-b border-[#2a2a2a] mb-6"
                        >
                            <TabButton
                                active={activeTab === 'overview'}
                                onClick={() => setActiveTab('overview')}
                            >
                                Overview
                            </TabButton>
                            <TabButton
                                active={activeTab === 'stats'}
                                onClick={() => setActiveTab('stats')}
                            >
                                Stats
                            </TabButton>
                            <TabButton
                                active={activeTab === 'performance'}
                                onClick={() => setActiveTab('performance')}
                            >
                                Performance
                            </TabButton>
                        </motion.div>

                        {/* Tab Content with Animation */}
                        <div className="bg-gradient-to-b from-[#1a1a1a] to-black rounded-2xl border border-[#2a2a2a] p-6 min-h-96">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    variants={tabContentVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    transition={{ duration: 0.3 }}
                                >
                                    {renderTabContent()}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

// Tab Components - Updated OverviewTab
const OverviewTab = ({ player, playerDetails }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-[#D4AF37]">Player Overview</h2>

            <div className="grid grid-cols-1 gap-6">
                {/* Player Information */}
                <div className="bg-[#0A0A0A] p-6 rounded-lg border border-[#2a2a2a]">
                    <h3 className="text-lg font-semibold mb-4 text-[#D4AF37]">Player Information</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                            <span className="text-gray-400">Age</span>
                            <span className="font-bold">{player.age || 'N/A'} years</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                            <span className="text-gray-400">Batting Style</span>
                            <span className="font-bold">{player.battingStyle || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                            <span className="text-gray-400">Bowling Style</span>
                            <span className="font-bold">{player.bowlingStyle || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                            <span className="text-gray-400">Playing Role</span>
                            <span className="font-bold capitalize">{player.category || 'Not specified'}</span>
                        </div>
                        {player.nationality && (
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-400">Nationality</span>
                                <span className="font-bold">{player.nationality}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Key Stats Preview */}
                <div className="bg-[#0A0A0A] p-6 rounded-lg border border-[#2a2a2a]">
                    <h3 className="text-lg font-semibold mb-4 text-[#D4AF37]">Key Statistics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-[#1a1a1a] rounded-lg">
                            <div className="text-2xl font-bold text-[#D4AF37]">
                                {playerDetails?.matches || 0}
                            </div>
                            <div className="text-sm text-gray-400">Matches</div>
                        </div>
                        <div className="text-center p-4 bg-[#1a1a1a] rounded-lg">
                            <div className="text-2xl font-bold text-[#D4AF37]">
                                {playerDetails?.runs || 0}
                            </div>
                            <div className="text-sm text-gray-400">Runs</div>
                        </div>
                        <div className="text-center p-4 bg-[#1a1a1a] rounded-lg">
                            <div className="text-2xl font-bold text-[#D4AF37]">
                                {playerDetails?.wickets || 0}
                            </div>
                            <div className="text-sm text-gray-400">Wickets</div>
                        </div>
                        <div className="text-center p-4 bg-[#1a1a1a] rounded-lg">
                            <div className="text-2xl font-bold text-[#D4AF37]">
                                {playerDetails?.centuries || 0}
                            </div>
                            <div className="text-sm text-gray-400">Centuries</div>
                        </div>
                    </div>
                </div>

                {/* Additional Information if available */}
                {player.bio && (
                    <div className="md:col-span-2 bg-[#0A0A0A] p-6 rounded-lg border border-[#2a2a2a]">
                        <h3 className="text-lg font-semibold mb-3 text-[#D4AF37]">About</h3>
                        <p className="text-gray-300">
                            {player.bio}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

// StatsTab and PerformanceTab remain the same as before
const StatsTab = ({ playerDetails }) => {
    const hasBattingStats = playerDetails && (
        playerDetails.runs !== undefined ||
        playerDetails.average !== undefined ||
        playerDetails.strikeRate !== undefined
    );

    const hasBowlingStats = playerDetails && (
        playerDetails.wickets !== undefined ||
        playerDetails.economy !== undefined ||
        playerDetails.bestBowling !== undefined
    );

    if (!hasBattingStats && !hasBowlingStats) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-gray-400 text-lg">No statistics available for this player</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-[#D4AF37]">Player Statistics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Batting Stats */}
                {hasBattingStats && (
                    <motion.div
                        variants={statItemVariants}
                        className="bg-[#0A0A0A] p-6 rounded-lg border border-[#2a2a2a]"
                    >
                        <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Batting Stats</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                <span className="text-gray-400">Matches</span>
                                <span className="font-bold text-lg">{playerDetails.matches || 0}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                <span className="text-gray-400">Runs</span>
                                <span className="font-bold text-lg">{playerDetails.runs || 0}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                <span className="text-gray-400">Average</span>
                                <span className="font-bold text-lg">{playerDetails.average || 0}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                <span className="text-gray-400">Strike Rate</span>
                                <span className="font-bold text-lg">{playerDetails.strikeRate || 0}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                <span className="text-gray-400">Best Batting</span>
                                <span className="font-bold">{playerDetails.bestBatting || '0 (0)'}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-400">50s/100s</span>
                                <span className="font-bold">{playerDetails.halfCenturies || 0}/{playerDetails.centuries || 0}</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Bowling Stats */}
                {hasBowlingStats && (
                    <motion.div
                        variants={statItemVariants}
                        className="bg-[#0A0A0A] p-6 rounded-lg border border-[#2a2a2a]"
                    >
                        <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Bowling Stats</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                <span className="text-gray-400">Wickets</span>
                                <span className="font-bold text-lg">{playerDetails.wickets || 0}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                <span className="text-gray-400">Economy</span>
                                <span className="font-bold text-lg">{playerDetails.economy || 0}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                <span className="text-gray-400">Best Bowling</span>
                                <span className="font-bold text-lg">{playerDetails.bestBowling || '0/0'}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                <span className="text-gray-400">3 Wickets</span>
                                <span className="font-bold text-lg">{playerDetails.threeWickets || 0}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-400">5 Wickets</span>
                                <span className="font-bold text-lg">{playerDetails.fiveWickets || 0}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

const PerformanceTab = ({ playerDetails }) => {
    const hasPerformanceData = playerDetails?.recentPerformance?.length > 0;

    if (!hasPerformanceData) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-gray-400 text-lg">No performance data available for this player</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-[#D4AF37]">Recent Performance</h2>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[#2a2a2a]">
                            <th className="text-left py-2 text-gray-400">Match</th>
                            <th className="text-left py-2 text-gray-400">Runs</th>
                            <th className="text-left py-2 text-gray-400">Wickets</th>
                            <th className="text-left py-2 text-gray-400">Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        {playerDetails.recentPerformance.map((match, index) => (
                            <tr key={index} className="border-b border-[#2a2a2a] last:border-0">
                                <td className="py-3">{match.opponent}</td>
                                <td className="py-3">{match.runs || '-'}</td>
                                <td className="py-3">{match.wickets || '-'}</td>
                                <td className="py-3">
                                    <span className={`px-2 py-1 rounded text-xs ${match.result === 'win' ? 'bg-green-900 text-green-300' :
                                        match.result === 'loss' ? 'bg-red-900 text-red-300' :
                                            'bg-gray-800 text-gray-300'
                                        }`}>
                                        {match.result || 'draw'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Performance Summary */}
            {playerDetails.performanceSummary && (
                <div className="mt-6 bg-[#0A0A0A] p-4 rounded-lg border border-[#2a2a2a]">
                    <h3 className="text-lg font-semibold mb-3 text-[#D4AF37]">Performance Summary</h3>
                    <p className="text-gray-300">{playerDetails.performanceSummary}</p>
                </div>
            )}
        </div>
    );
};

export default PlayerDetailsPage;