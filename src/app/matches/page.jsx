'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';

const MatchPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [matches, setMatches] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch matches and results from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch matches
        const matchesResponse = await fetch('/api/matches');
        if (!matchesResponse.ok) {
          throw new Error('Failed to fetch matches');
        }
        const matchesData = await matchesResponse.json();
        setMatches(matchesData);

        // Fetch results
        const resultsResponse = await fetch('/api/results');
        if (!resultsResponse.ok) {
          throw new Error('Failed to fetch results');
        }
        const resultsData = await resultsResponse.json();
        setResults(resultsData);

        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  // Filter matches based on status
  const upcomingMatches = useMemo(
    () => matches.filter((match) => match.status === 'scheduled'),
    [matches]
  );

  const completedMatches = useMemo(() => {
    return results.map((result) => {
      const match = matches.find((m) => m._id === result.matchId);
      return match
        ? {
          ...match,
          team1: { ...match.team1, ...result.team1 },
          team2: { ...match.team2, ...result.team2 },
          result: result.result,
        }
        : null;
    }).filter((match) => match !== null);
  }, [matches, results]);

  // Predefined particle positions
  const particlePositions = useMemo(
    () => [
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
    ],
    []
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  // Get border color based on match result
  const getBorderColor = (match) => {
    if (match.status === 'scheduled') return 'border-[#D4AF37]';
    if (match.team1.name === 'Mighty Strikers') {
      if (match.team1.result === 'won') return 'border-green-500';
      if (match.team1.result === 'lost') return 'border-red-500';
      if (match.team1.result === 'tie') return 'border-yellow-500';
    } else {
      if (match.team2.result === 'won') return 'border-green-500';
      if (match.team2.result === 'lost') return 'border-red-500';
      if (match.team2.result === 'tie') return 'border-yellow-500';
    }
    return 'border-[#D4AF37]'; // Fallback
  };

  // Get result text for completed matches
  const getResultText = (match) => {
    if (match.status === 'scheduled') return null;

    if (match.team1.name === 'Mighty Strikers') {
      if (match.team1.result === 'won') {
        return match.team1.score && match.team2.score
          ? `Won by ${match.team1.runs - match.team2.runs} runs`
          : 'Won';
      } else if (match.team1.result === 'lost') {
        return match.team1.score && match.team2.score
          ? `Lost by ${10 - parseInt(match.team2.score.split('/')[1])} wickets`
          : 'Lost';
      } else if (match.team1.result === 'tie') {
        return 'Match tied';
      }
    } else {
      if (match.team2.result === 'won') {
        return match.team1.score && match.team2.score
          ? `Won by ${10 - parseInt(match.team1.score.split('/')[1])} wickets`
          : 'Won';
      } else if (match.team2.result === 'lost') {
        return match.team1.score && match.team2.score
          ? `Lost by ${match.team2.runs - match.team1.runs} runs`
          : 'Lost';
      } else if (match.team2.result === 'tie') {
        return 'Match tied';
      }
    }
    return match.result || 'Result not available';
  };

  // Render team logo or fallback initials
  const renderTeamLogo = (team) => {
    const initials = team.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 3);

    return team.logo ? (
      <Image
        src={team.logo}
        alt={`${team.name} logo`}
        width={56}
        height={56}
        className="rounded-full object-contain"
        unoptimized
      />
    ) : (
      <span className="font-bold text-sm">{initials}</span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-[#0A0A0A] text-white flex items-center justify-center">
        <p>Loading matches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-[#0A0A0A] text-white flex items-center justify-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#0A0A0A] text-white">
      <div className="w-11/12 mx-auto pt-20 pb-16">
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37] opacity-10"
            initial={{ width: 0, height: 0 }}
            animate={{ width: 600, height: 600 }}
            transition={{ duration: 2 }}
            variants={containerVariants}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37] opacity-10"
            initial={{ width: 0, height: 0 }}
            animate={{ width: 400, height: 400 }}
            transition={{ duration: 2, delay: 0.3 }}
            variants={containerVariants}
          />
          {particlePositions.map((pos, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-[#D4AF37]"
              style={{
                top: pos.top,
                left: pos.left,
                opacity: pos.opacity,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, (i % 2 === 0 ? 1 : -1) * 10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.5,
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
            className="text-center mb-8"
            variants={containerVariants}
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="text-white">Match </span>
              <span className="text-[#D4AF37]">Schedule & Results</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Follow the Mighty Strikers through their cricket journey - past victories and upcoming challenges.
            </p>
          </motion.div>

          {/* Play Friendly Match Button */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            variants={containerVariants}
          >
            <a
              href="https://m.me/mightystrikers1"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-bold py-3 px-8 rounded-full flex items-center gap-2 hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clipRule="evenodd"
                />
              </svg>
              Play Friendly Match With Us
            </a>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            variants={containerVariants}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex border-b border-[#2a2a2a] mb-8 justify-center"
          >
            {['upcoming', 'completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium capitalize text-lg ${activeTab === tab
                    ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]'
                    : 'text-gray-400 hover:text-white'
                  }`}
              >
                {tab === 'upcoming' ? 'Upcoming' : 'Results'}
              </button>
            ))}
          </motion.div>

          {/* Tab Content */}
          <div className="mb-12">
            <AnimatePresence mode="wait">
              {/* Upcoming Matches Tab */}
              {activeTab === 'upcoming' && (
                <motion.div
                  key="upcoming"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {upcomingMatches.length === 0 && (
                    <p className="text-center col-span-full text-gray-400">
                      No upcoming matches scheduled.
                    </p>
                  )}
                  {upcomingMatches.map((match, index) => (
                    <motion.div
                      key={match._id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      className={`bg-gradient-to-b from-[#1a1a1a] to-black rounded-2xl overflow-hidden border-2 ${getBorderColor(
                        match
                      )} p-6 shadow-lg`}
                      whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(212, 175, 55, 0.2)' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15, delay: index * 0.1 }}
                      onClick={() => setSelectedMatch(match)}
                    >
                      <div className="text-center mb-6">
                        <div className="text-sm text-[#D4AF37] font-semibold">{match.type}</div>
                      </div>

                      <div className="flex items-center justify-between mb-6">
                        <div className="flex flex-col items-center w-1/3">
                          <div className="w-14 h-14 bg-[#2a2a2a] rounded-full flex items-center justify-center mb-2">
                            {renderTeamLogo(match.team1)}
                          </div>
                          <div className="text-xs text-center font-medium">{match.team1.name}</div>
                        </div>

                        <div className="text-center w-1/3">
                          <div className="text-xl font-bold text-[#D4AF37]">VS</div>
                          <div className="text-xs text-gray-400 mt-1">{match.time}</div>
                        </div>

                        <div className="flex flex-col items-center w-1/3">
                          <div className="w-14 h-14 bg-[#2a2a2a] rounded-full overflow-hidden flex items-center justify-center mb-2">
                            {renderTeamLogo(match.team2)}
                          </div>
                          <div className="text-xs text-center font-medium">{match.team2.name}</div>
                        </div>
                      </div>

                      <div className="text-center border-t border-[#2a2a2a] pt-4">
                        <div className="text-sm text-gray-400">{match.date}</div>
                        <div className="text-xs text-gray-500 mt-1">{match.venue}</div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Completed Matches Tab */}
              {activeTab === 'completed' && (
                <motion.div
                  key="completed"
                  variants={containerVariants}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 gap-6"
                >
                  {completedMatches.length === 0 && (
                    <p className="text-center col-span-full text-gray-400">
                      No completed matches found.
                    </p>
                  )}
                  {completedMatches.map((match, index) => (
                    <motion.div
                      key={match._id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      className={`bg-gradient-to-b from-[#1a1a1a] to-black rounded-2xl overflow-hidden border-2 ${getBorderColor(
                        match
                      )} p-6 shadow-lg`}
                      whileHover={{ y: -5 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15, delay: index * 0.1 }}
                      onClick={() => setSelectedMatch(match)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-[#D4AF37] font-semibold">{match.type}</div>
                      </div>

                      <div className="flex items-center justify-between mb-6">
                        <div className="flex flex-col items-center w-2/5">
                          <div className="w-14 h-14 bg-[#2a2a2a] rounded-full flex items-center justify-center mb-2">
                            {renderTeamLogo(match.team1)}
                          </div>
                          <div className="text-xs text-center font-medium">{match.team1.name}</div>
                          {match.team1.score && (
                            <>
                              <div className="text-lg font-bold mt-2">{match.team1.score}</div>
                              <div className="text-xs text-gray-400">({match.team1.overs} Ov)</div>
                            </>
                          )}
                        </div>

                        <div className="text-center w-1/5">
                          <div className="text-xl font-bold text-[#D4AF37]">VS</div>
                          <div className="text-xs text-gray-400 mt-1">{match.time}</div>
                        </div>

                        <div className="flex flex-col items-center w-2/5">
                          <div className="w-14 h-14 bg-[#2a2a2a] rounded-full flex items-center justify-center mb-2">
                            {renderTeamLogo(match.team2)}
                          </div>
                          <div className="text-xs text-center font-medium">{match.team2.name}</div>
                          {match.team2.score && (
                            <>
                              <div className="text-lg font-bold mt-2">{match.team2.score}</div>
                              <div className="text-xs text-gray-400">({match.team2.overs} Ov)</div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="text-center border-t border-[#2a2a2a] pt-4">
                        <div>
                          {match.result}
                        </div>
                        <div className="text-xs text-gray-400 mt-2">
                          {match.date} | {match.venue}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Statistics Section */}
          <motion.div
            initial={{ opacity: 0 }}
            variants={containerVariants}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#0A0A0A] to-[#1a1a1a] rounded-2xl p-8 border border-[#2a2a2a] mb-12"
          >
            <h2 className="text-3xl font-bold mb-8 text-center text-[#D4AF37]">
              Season Statistics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <motion.div
                className="text-center p-6 bg-black rounded-xl"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="text-4xl font-bold text-[#D4AF37]">
                  {completedMatches.length}
                </div>
                <div className="text-gray-400 mt-2">Matches Played</div>
              </motion.div>
              <motion.div
                className="text-center p-6 bg-black rounded-xl"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="text-4xl font-bold text-green-500">
                  {
                    completedMatches.filter(
                      (match) =>
                        (match.team1.name === 'Mighty Strikers' && match.team1.result === 'won') ||
                        (match.team2.name === 'Mighty Strikers' && match.team2.result === 'won')
                    ).length
                  }
                </div>
                <div className="text-gray-400 mt-2">Matches Won</div>
              </motion.div>
              <motion.div
                className="text-center p-6 bg-black rounded-xl"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="text-4xl font-bold text-red-500">
                  {
                    completedMatches.filter(
                      (match) =>
                        (match.team1.name === 'Mighty Strikers' && match.team1.result === 'lost') ||
                        (match.team2.name === 'Mighty Strikers' && match.team2.result === 'lost')
                    ).length
                  }
                </div>
                <div className="text-gray-400 mt-2">Matches Lost</div>
              </motion.div>
              <motion.div
                className="text-center p-6 bg-black rounded-xl"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="text-4xl font-bold text-[#D4AF37]">
                  {completedMatches.length > 0
                    ? Math.round(
                      (completedMatches.filter(
                        (match) =>
                          (match.team1.name === 'Mighty Strikers' && match.team1.result === 'won') ||
                          (match.team2.name === 'Mighty Strikers' && match.team2.result === 'won')
                      ).length /
                        completedMatches.length) *
                      100
                    ) + '%'
                    : '0%'}
                </div>
                <div className="text-gray-400 mt-2">Win Percentage</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Match Detail Modal */}
      <AnimatePresence>
        {selectedMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMatch(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-b from-[#1a1a1a] to-black rounded-2xl overflow-hidden border border-[#2a2a2a] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold">{selectedMatch.type}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedMatch(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center justify-between mb-8">
                  <div className="flex flex-col items-center w-2/5">
                    <div className="w-16 h-16 bg-[#2a2a2a] rounded-full flex items-center justify-center mb-2">
                      {renderTeamLogo(selectedMatch.team1)}
                    </div>
                    <div className="text-center font-medium">{selectedMatch.team1.name}</div>
                    {selectedMatch.status === 'completed' && selectedMatch.team1.score && (
                      <>
                        <div className="text-xl font-bold mt-2">{selectedMatch.team1.score}</div>
                        <div className="text-xs text-gray-400">
                          ({selectedMatch.team1.overs} Ov)
                        </div>
                      </>
                    )}
                  </div>

                  <div className="text-center w-1/5">
                    <div className="text-2xl font-bold text-[#D4AF37]">VS</div>
                    <div className="text-sm text-gray-400 mt-1">{selectedMatch.time}</div>
                  </div>

                  <div className="flex flex-col items-center w-2/5">
                    <div className="w-16 h-16 bg-[#2a2a2a] rounded-full flex items-center justify-center mb-2">
                      {renderTeamLogo(selectedMatch.team2)}
                    </div>
                    <div className="text-center font-medium">{selectedMatch.team2.name}</div>
                    {selectedMatch.status === 'completed' && selectedMatch.team2.score && (
                      <>
                        <div className="text-xl font-bold mt-2">{selectedMatch.team2.score}</div>
                        <div className="text-xs text-gray-400">
                          ({selectedMatch.team2.overs} Ov)
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-center border-t border-b border-[#2a2a2a] py-4 mb-6">
                  <div className="text-sm text-gray-400">{selectedMatch.date}</div>
                  <div className="text-xs text-gray-500 mt-1">{selectedMatch.venue}</div>
                </div>

                {selectedMatch.status === 'completed' && (
                  <div
                    className={`text-center text-lg font-semibold mb-6 ${getBorderColor(
                      selectedMatch
                    ).replace('border-', 'text-')}`}
                  >
                    {selectedMatch.result}
                  </div>
                )}

                {selectedMatch.status === 'scheduled' && (
                  <div className="text-center">
                    <div className="text-lg font-semibold text-[#D4AF37] mb-4">
                      Upcoming Match
                    </div>
                    <button className="bg-[#D4AF37] text-black font-bold py-2 px-6 rounded-full">
                      Set Reminder
                    </button>
                  </div>
                )}

                {/* Display selected players if available */}
                {selectedMatch.selectedPlayersData && selectedMatch.selectedPlayersData.length > 0 && (
                  <div className="bg-[#0A0A0A] p-4 rounded-lg mt-6">
                    <p className="text-gray-400 text-sm mb-2">Selected Players</p>
                    <ul className="list-disc list-inside text-sm">
                      {selectedMatch.selectedPlayersData.map((player, index) => (
                        <li key={index}>
                          {player.name} (
                          <a
                            href={`/player/${player.username}`}
                            className="text-[#D4AF37] hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            @{player.username}
                          </a>
                          )
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MatchPage;