'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

// Animation variants
const tabVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

// Predefined particle positions
const particlePositions = [
  { top: '4.06%', left: '80.49%', opacity: 0.16 },
  { top: '32.83%', left: '34.72%', opacity: 0.16 },
  { top: '89.70%', left: '66.91%', opacity: 0.17 },
  { top: '76.67%', left: '0.09%', opacity: 0.18 },
  { top: '85.65%', left: '50.75%', opacity: 0.42 },
  { top: '39.62%', left: '23.81%', opacity: 0.18 },
  { top: '72.39%', left: '2.42%', opacity: 0.14 },
  { top: '35.22%', left: '70.55%', opacity: 0.24 },
  { top: '53.36%', left: '88.30%', opacity: 0.24 },
  { top: '5.74%', left: '40.06%', opacity: 0.54 },
];

const PerformancePage = () => {
  const [activeTab, setActiveTab] = useState('batting');
  const [playerStats, setPlayerStats] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch player stats from /api/player-details
  useEffect(() => {
    const fetchPlayerStats = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/player-details');
        if (response.ok) {
          const data = await response.json();
          // Enrich data with player details from /api/players if needed
          const playersResponse = await fetch('/api/players');
          if (playersResponse.ok) {
            const playersData = await playersResponse.json();
            const enrichedStats = data.map(stat => {
              const player = playersData.find(p => p.username === stat.username) || {};
              return {
                ...stat,
                name: player.name || stat.username,
                image: player.image || null,
                category: player.category || 'Unknown',
              };
            });
            setPlayerStats(enrichedStats);
          } else {
            throw new Error('Failed to fetch player details');
          }
        } else {
          throw new Error('Failed to fetch player stats');
        }
      } catch (error) {
        console.error('Error fetching player stats:', error);
        toast.error('Failed to load player statistics');
        setPlayerStats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerStats();
  }, []);

  // Format best batting score
  const formatBestBatting = (bestBatting) => {
    return bestBatting || '0 (0)';
  };

  // Format best bowling
  const formatBestBowling = (bestBowling) => {
    return bestBowling || '0/0';
  };

  // Navigation tabs
  const navTabs = [
    { id: 'batting', label: 'Batting', icon: '🏏' },
    { id: 'bowling', label: 'Bowling', icon: '🎯' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#0A0A0A] text-white">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1A1A1A',
            color: '#fff',
            border: '1px solid #2A2A2A',
          },
          success: {
            iconTheme: { primary: '#f0c22c', secondary: '#1A1A1A' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#1A1A1A' },
          },
          loading: {
            iconTheme: { primary: '#f0c22c', secondary: '#1A1A1A' },
          },
        }}
      />

      <div className="w-11/12 mx-auto pt-20 pb-16">
        <div className="absolute inset-0 z-0 overflow-hidden">
          {particlePositions.map((pos, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-[#D4AF37]"
              style={{ top: pos.top, left: pos.left, opacity: pos.opacity }}
              animate={{ y: [0, -20, 0], x: [(i % 2 === 0 ? 1 : -1) * 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="text-white">Player </span>
              <span className="text-[#D4AF37]">Performance Rankings</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 w-full mx-auto">
              Explore top batting and bowling performances of your cricket team.
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar for large devices */}
            <div className="hidden lg:block w-full lg:w-1/4">
              <div className="sticky top-4 z-30">
                <div className="bg-[#1a1a1a] rounded-xl p-4">
                  <h3 className="text-lg font-bold mb-4 text-[#D4AF37]">Performance Categories</h3>
                  <div className="space-y-2">
                    {navTabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-3 ${
                          activeTab === tab.id
                            ? 'bg-[#D4AF37] text-black font-bold'
                            : 'text-white hover:bg-[#2a2a2a]'
                        }`}
                      >
                        <span className="text-xl">{tab.icon}</span>
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Tab Navigation */}
            <div className="lg:hidden mb-6 flex space-x-2">
              {navTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-[#D4AF37] text-black font-bold'
                      : 'bg-[#2a2a2a] text-white'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="text-sm">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="w-full lg:w-3/4">
              <div className="bg-[#1a1a1a] rounded-xl p-6">
                <AnimatePresence mode="wait">
                  {/* Batting Rankings Tab */}
                  {activeTab === 'batting' && (
                    <motion.div key="batting" variants={tabVariants} initial="hidden" animate="visible" exit="exit">
                      <h2 className="text-2xl font-bold mb-6 text-[#D4AF37]">Batting Rankings</h2>
                      {loading ? (
                        <div className="text-center py-8 text-gray-400">
                          <svg
                            className="animate-spin h-8 w-8 mx-auto text-[#D4AF37]"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          <p className="mt-4">Loading batting rankings...</p>
                        </div>
                      ) : playerStats.length === 0 ? (
                        <div className="text-center py-8">
                          <svg
                            className="w-16 h-16 mx-auto text-gray-500 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                          <h3 className="text-xl font-bold text-gray-400">No batting statistics available</h3>
                          <p className="text-gray-500 mt-2">Player batting statistics will appear here once matches are played</p>
                        </div>
                      ) : (
                        <>
                          {/* Desktop Table */}
                          <div className="hidden sm:block overflow-x-auto mb-8 scrollbar-black">
                            <table className="w-[1200px]">
                              <thead>
                                <tr className="border-b border-[#2a2a2a]">
                                  <th className="text-left py-3">Rank</th>
                                  <th className="text-left py-3">Player</th>
                                  <th className="text-left py-3">Category</th>
                                  <th className="text-left py-3">Innings</th>
                                  <th className="text-left py-3">Runs</th>
                                  <th className="text-left py-3">Average</th>
                                  <th className="text-left py-3">Highest</th>
                                  <th className="text-left py-3">Strike Rate</th>
                                  <th className="text-left py-3">Centuries</th>
                                  <th className="text-left py-3">Half-Centuries</th>
                                </tr>
                              </thead>
                              <tbody>
                                {playerStats
                                  .sort((a, b) => b.runs - a.runs)
                                  .map((stat, index) => (
                                    <tr
                                      key={stat.username}
                                      className="border-b border-[#2a2a2a] hover:bg-[#0A0A0A]"
                                    >
                                      <td className="py-3">
                                        <span
                                          className={`text-lg font-bold ${
                                            index === 0
                                              ? 'text-[#D4AF37]'
                                              : index === 1
                                              ? 'text-gray-400'
                                              : index === 2
                                              ? 'text-[#D4AF37]'
                                              : 'text-gray-500'
                                          }`}
                                        >
                                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                        </span>
                                      </td>
                                      <td className="py-3">
                                        <Link href={`/player/${stat.username}`} className="flex items-center space-x-3 hover:underline">
                                          <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center overflow-hidden">
                                            {stat.image ? (
                                              <Image
                                                src={stat.image}
                                                alt={stat.name}
                                                width={32}
                                                height={32}
                                                className="rounded-full"
                                              />
                                            ) : (
                                              <span className="text-xs font-bold">{stat.name.charAt(0)}</span>
                                            )}
                                          </div>
                                          <span className="font-medium">{stat.name}</span>
                                        </Link>
                                      </td>
                                      <td className="py-3 capitalize">{stat.category}</td>
                                      <td className="py-3">{stat.innings}</td>
                                      <td className="py-3 font-medium text-[#D4AF37]">{stat.runs}</td>
                                      <td className="py-3">{stat.average.toFixed(1)}</td>
                                      <td className="py-3">{formatBestBatting(stat.bestBatting)}</td>
                                      <td className="py-3">{stat.strikeRate.toFixed(1)}</td>
                                      <td className="py-3">{stat.centuries}</td>
                                      <td className="py-3">{stat.halfCenturies}</td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Mobile Cards */}
                          <div className="sm:hidden space-y-4">
                            {playerStats
                              .sort((a, b) => b.runs - a.runs)
                              .map((stat, index) => (
                                <motion.div
                                  key={stat.username}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="bg-[#0A0A0A] p-4 rounded-lg border border-[#2a2a2a]"
                                >
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                      <span
                                        className={`text-2xl font-bold ${
                                          index === 0
                                            ? 'text-[#D4AF37]'
                                            : index === 1
                                            ? 'text-gray-400'
                                            : index === 2
                                            ? 'text-[#D4AF37]'
                                            : 'text-gray-500'
                                        }`}
                                      >
                                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                      </span>
                                      <Link href={`/player/${stat.username}`} className="flex items-center space-x-2 hover:underline">
                                        <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center overflow-hidden">
                                          {stat.image ? (
                                            <Image
                                              src={stat.image}
                                              alt={stat.name}
                                              width={40}
                                              height={40}
                                              className="rounded-full"
                                            />
                                          ) : (
                                            <span className="text-sm font-bold">{stat.name.charAt(0)}</span>
                                          )}
                                        </div>
                                        <h3 className="font-bold text-[#D4AF37]">{stat.name}</h3>
                                      </Link>
                                    </div>
                                    <span className="text-sm text-gray-400">{stat.innings} innings</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                      <span className="text-gray-400 block">Runs</span>
                                      <span className="font-medium text-[#D4AF37]">{stat.runs}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-400 block">Average</span>
                                      <span className="font-medium">{stat.average.toFixed(1)}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-400 block">Highest</span>
                                      <span className="font-medium">{formatBestBatting(stat.bestBatting)}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-400 block">Strike Rate</span>
                                      <span className="font-medium">{stat.strikeRate.toFixed(1)}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-400 block">Centuries</span>
                                      <span className="font-medium">{stat.centuries}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-400 block">Half-Centuries</span>
                                      <span className="font-medium">{stat.halfCenturies}</span>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}

                  {/* Bowling Rankings Tab */}
                  {activeTab === 'bowling' && (
                    <motion.div key="bowling" variants={tabVariants} initial="hidden" animate="visible" exit="exit">
                      <h2 className="text-2xl font-bold mb-6 text-[#D4AF37]">Bowling Rankings</h2>
                      {loading ? (
                        <div className="text-center py-8 text-gray-400">
                          <svg
                            className="animate-spin h-8 w-8 mx-auto text-[#D4AF37]"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          <p className="mt-4">Loading bowling rankings...</p>
                        </div>
                      ) : playerStats.length === 0 ? (
                        <div className="text-center py-8">
                          <svg
                            className="w-16 h-16 mx-auto text-gray-500 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                          <h3 className="text-xl font-bold text-gray-400">No bowling statistics available</h3>
                          <p className="text-gray-500 mt-2">Player bowling statistics will appear here once matches are played</p>
                        </div>
                      ) : (
                        <>
                          {/* Desktop Table */}
                          <div className="hidden sm:block overflow-x-auto mb-8 scrollbar-black">
                            <table className="w-[1200px]">
                              <thead>
                                <tr className="border-b border-[#2a2a2a]">
                                  <th className="text-left py-3">Rank</th>
                                  <th className="text-left py-3">Player</th>
                                  <th className="text-left py-3">Category</th>
                                  <th className="text-left py-3">Innings</th>
                                  <th className="text-left py-3">Wickets</th>
                                  <th className="text-left py-3">Economy</th>
                                  <th className="text-left py-3">Best Bowling</th>
                                  <th className="text-left py-3">Maidens</th>
                                  <th className="text-left py-3">3-Wicket Hauls</th>
                                  <th className="text-left py-3">5-Wicket Hauls</th>
                                </tr>
                              </thead>
                              <tbody>
                                {playerStats
                                  .sort((a, b) => b.wickets - a.wickets)
                                  .map((stat, index) => (
                                    <tr
                                      key={stat.username}
                                      className="border-b border-[#2a2a2a] hover:bg-[#0A0A0A]"
                                    >
                                      <td className="py-3">
                                        <span
                                          className={`text-lg font-bold ${
                                            index === 0
                                              ? 'text-[#D4AF37]'
                                              : index === 1
                                              ? 'text-gray-400'
                                              : index === 2
                                              ? 'text-[#D4AF37]'
                                              : 'text-gray-500'
                                          }`}
                                        >
                                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                        </span>
                                      </td>
                                      <td className="py-3">
                                        <Link href={`/player/${stat.username}`} className="flex items-center space-x-3 hover:underline">
                                          <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center overflow-hidden">
                                            {stat.image ? (
                                              <Image
                                                src={stat.image}
                                                alt={stat.name}
                                                width={32}
                                                height={32}
                                                className="rounded-full"
                                              />
                                            ) : (
                                              <span className="text-xs font-bold">{stat.name.charAt(0)}</span>
                                            )}
                                          </div>
                                          <span className="font-medium">{stat.name}</span>
                                        </Link>
                                      </td>
                                      <td className="py-3 capitalize">{stat.category}</td>
                                      <td className="py-3">{stat.bowlingInnings}</td>
                                      <td className="py-3 font-medium text-[#D4AF37]">{stat.wickets}</td>
                                      <td className="py-3">{stat.economy.toFixed(1)}</td>
                                      <td className="py-3">{formatBestBowling(stat.bestBowling)}</td>
                                      <td className="py-3">{stat.maidens}</td>
                                      <td className="py-3">{stat.threeWickets}</td>
                                      <td className="py-3">{stat.fiveWickets}</td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Mobile Cards */}
                          <div className="sm:hidden space-y-4">
                            {playerStats
                              .sort((a, b) => b.wickets - a.wickets)
                              .map((stat, index) => (
                                <motion.div
                                  key={stat.username}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="bg-[#0A0A0A] p-4 rounded-lg border border-[#2a2a2a]"
                                >
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                      <span
                                        className={`text-2xl font-bold ${
                                          index === 0
                                            ? 'text-[#D4AF37]'
                                            : index === 1
                                            ? 'text-gray-400'
                                            : index === 2
                                            ? 'text-[#D4AF37]'
                                            : 'text-gray-500'
                                        }`}
                                      >
                                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                      </span>
                                      <Link href={`/player/${stat.username}`} className="flex items-center space-x-2 hover:underline">
                                        <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center overflow-hidden">
                                          {stat.image ? (
                                            <Image
                                              src={stat.image}
                                              alt={stat.name}
                                              width={40}
                                              height={40}
                                              className="rounded-full"
                                            />
                                          ) : (
                                            <span className="text-sm font-bold">{stat.name.charAt(0)}</span>
                                          )}
                                        </div>
                                        <h3 className="font-bold text-[#D4AF37]">{stat.name}</h3>
                                      </Link>
                                    </div>
                                    <span className="text-sm text-gray-400">{stat.bowlingInnings} Innings</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                      <span className="text-gray-400 block">Wickets</span>
                                      <span className="font-medium text-[#D4AF37]">{stat.wickets}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-400 block">Economy</span>
                                      <span className="font-medium">{stat.economy.toFixed(1)}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-400 block">Best Bowling</span>
                                      <span className="font-medium">{formatBestBowling(stat.bestBowling)}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-400 block">Maidens</span>
                                      <span className="font-medium">{stat.maidens}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-400 block">3-Wicket Hauls</span>
                                      <span className="font-medium">{stat.threeWickets}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-400 block">5-Wicket Hauls</span>
                                      <span className="font-medium">{stat.fiveWickets}</span>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformancePage;