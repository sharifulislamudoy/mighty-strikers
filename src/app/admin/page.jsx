'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [players, setPlayers] = useState([]);
  const [pendingPlayers, setPendingPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [stats, setStats] = useState([]);
  const [adminData, setAdminData] = useState({
    name: "Admin User",
    email: "admin@cricketclub.com",
    phone: "+1 234-567-8900",
    role: "Administrator",
    joinDate: "2023-01-15"
  });

  // Animation variants
  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  // Predefined particle positions
  const particlePositions = [
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
  ];

  // Load mock data
  useEffect(() => {
    // Mock players data
    setPlayers([
      {
        _id: "1",
        name: "Mohona Akter Mukta",
        username: "mohona-akter-mukta-",
        phone: "01995322080",
        email: "surifroton305651@gmail.com",
        image: "https://res.cloudinary.com/dohhfubsa/image/upload/v1756730697/IMG20250",
        category: "Batsman",
        specialties: ["Right Handed Batting", "Agile Runner"],
        battingStyle: "Right Handed",
        bowlingStyle: "Left Arm Medium",
        age: 24,
        profileUrl: "https://hi.com",
        role: "player",
        likes: 1,
        status: "approved",
        createdAt: "2025-09-01T12:45:00.404+00:00"
      },
      {
        _id: "2",
        name: "John Smith",
        username: "john-smith",
        phone: "0123456789",
        email: "john@example.com",
        image: "/default-player.jpg",
        category: "Bowler",
        specialties: ["Fast Bowling", "Yorker Specialist"],
        battingStyle: "Right Handed",
        bowlingStyle: "Right Arm Fast",
        age: 28,
        profileUrl: "https://example.com",
        role: "player",
        likes: 5,
        status: "approved",
        createdAt: "2025-08-15T10:30:00.404+00:00"
      }
    ]);

    // Mock pending players
    setPendingPlayers([
      {
        _id: "3",
        name: "New Player",
        username: "new-player",
        phone: "0123456789",
        email: "new@example.com",
        image: "/default-player.jpg",
        category: "All-Rounder",
        specialties: ["Batting", "Bowling"],
        battingStyle: "Left Handed",
        bowlingStyle: "Right Arm Offbreak",
        age: 22,
        profileUrl: "https://example.com",
        role: "player",
        likes: 0,
        status: "pending",
        createdAt: "2025-09-03T08:15:00.404+00:00"
      }
    ]);

    // Mock matches
    setMatches([
      {
        id: 1,
        opponent: "Thunder Bolts",
        date: "2025-09-15",
        time: "14:00",
        venue: "City Cricket Ground",
        status: "scheduled",
        type: "T20",
        team: "First XI"
      },
      {
        id: 2,
        opponent: "Royal Strikers",
        date: "2025-09-22",
        time: "15:30",
        venue: "National Stadium",
        status: "scheduled",
        type: "One Day",
        team: "First XI"
      }
    ]);

    // Mock gallery images
    setGallery([
      { id: 1, url: "/gallery1.jpg", caption: "Team Celebration" },
      { id: 2, url: "/gallery2.jpg", caption: "Match Action" },
      { id: 3, url: "/gallery3.jpg", caption: "Training Session" }
    ]);

    // Mock player stats
    setStats([
      {
        playerId: "1",
        name: "Mohona Akter Mukta",
        matches: 15,
        runs: 450,
        highest: 87,
        average: 32.14,
        wickets: 3,
        economy: 5.2
      },
      {
        playerId: "2",
        name: "John Smith",
        matches: 12,
        runs: 120,
        highest: 35,
        average: 12.0,
        wickets: 18,
        economy: 4.8
      }
    ]);
  }, []);

  // Handle player approval
  const handleApprovePlayer = (playerId) => {
    const player = pendingPlayers.find(p => p._id === playerId);
    if (player) {
      setPendingPlayers(pendingPlayers.filter(p => p._id !== playerId));
      setPlayers([...players, { ...player, status: "approved" }]);
    }
  };

  // Handle player rejection
  const handleRejectPlayer = (playerId) => {
    setPendingPlayers(pendingPlayers.filter(p => p._id !== playerId));
  };

  // Handle adding new match
  const handleAddMatch = (newMatch) => {
    setMatches([...matches, { ...newMatch, id: Date.now(), status: "scheduled" }]);
  };

  // Handle adding gallery image
  const handleAddImage = (file, caption) => {
    const newImage = {
      id: Date.now(),
      url: URL.createObjectURL(file),
      caption
    };
    setGallery([...gallery, newImage]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#0A0A0A] text-white">
      <div className="w-11/12 mx-auto pt-20 pb-16">
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Cricket field circles */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37] opacity-10"
            initial={{ width: 0, height: 0 }}
            animate={{ width: 600, height: 600 }}
            transition={{ duration: 2 }}
          />
          
          {/* Floating particles */}
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
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="text-white">Cricket Team </span>
              <span className="text-[#D4AF37]">Admin Dashboard</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 w-full mx-auto">
              Manage players, matches, and all aspects of your cricket team.
            </p>
          </motion.div>

          {/* Main content with sidebar layout on large screens */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar tabs for large devices */}
            <div className="hidden lg:block w-full lg:w-1/4">
              <div className="bg-[#1a1a1a] rounded-xl p-4">
                <h3 className="text-lg font-bold mb-4 text-[#D4AF37]">Navigation</h3>
                <div className="space-y-2">
                  {[
                    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                    { id: 'profile', label: 'Admin Profile', icon: '👤' },
                    { id: 'players', label: 'Player Management', icon: '👥' },
                    { id: 'matches', label: 'Match Schedule', icon: '🏏' },
                    { id: 'stats', label: 'Player Stats', icon: '📈' },
                    { id: 'gallery', label: 'Gallery', icon: '🖼️' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-3 ${activeTab === tab.id
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

            {/* Content area - 3/4 width on large screens, full width on small */}
            <div className="w-full lg:w-3/4">
              {/* Mobile tabs - shown only on small/medium devices */}
              <div className="lg:hidden bg-[#1a1a1a] rounded-xl p-2 mb-6 flex flex-wrap gap-2">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                  { id: 'profile', label: 'Profile', icon: '👤' },
                  { id: 'players', label: 'Players', icon: '👥' },
                  { id: 'matches', label: 'Matches', icon: '🏏' },
                  { id: 'stats', label: 'Stats', icon: '📈' },
                  { id: 'gallery', label: 'Gallery', icon: '🖼️' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${activeTab === tab.id
                      ? 'bg-[#D4AF37] text-black font-bold'
                      : 'text-white hover:bg-[#2a2a2a]'
                      }`}
                  >
                    <span>{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="bg-[#1a1a1a] rounded-xl p-6">
                <AnimatePresence mode="wait">
                  {/* Dashboard Tab */}
                  {activeTab === 'dashboard' && (
                    <motion.div
                      key="dashboard"
                      variants={tabVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <h2 className="text-2xl font-bold mb-6 text-[#D4AF37]">Team Overview</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-[#0A0A0A] p-4 rounded-lg text-center">
                          <div className="text-3xl font-bold text-[#D4AF37]">{players.length}</div>
                          <div className="text-gray-400">Total Players</div>
                        </div>
                        <div className="bg-[#0A0A0A] p-4 rounded-lg text-center">
                          <div className="text-3xl font-bold text-[#D4AF37]">{pendingPlayers.length}</div>
                          <div className="text-gray-400">Pending Approvals</div>
                        </div>
                        <div className="bg-[#0A0A0A] p-4 rounded-lg text-center">
                          <div className="text-3xl font-bold text-[#D4AF37]">{matches.length}</div>
                          <div className="text-gray-400">Scheduled Matches</div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Upcoming Matches */}
                        <div>
                          <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Upcoming Matches</h3>
                          <div className="space-y-3">
                            {matches.slice(0, 3).map(match => (
                              <div key={match.id} className="bg-[#0A0A0A] p-3 rounded-lg">
                                <div className="flex justify-between items-center">
                                  <span className="font-bold">Vs {match.opponent}</span>
                                  <span className="text-sm text-gray-400">{match.date}</span>
                                </div>
                                <p className="text-sm text-gray-400">{match.venue} • {match.time}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Recent Activity */}
                        <div>
                          <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Recent Activity</h3>
                          <div className="space-y-3">
                            <div className="bg-[#0A0A0A] p-3 rounded-lg">
                              <div className="flex justify-between">
                                <span className="font-medium">Player approved</span>
                                <span className="text-gray-400 text-sm">2 hours ago</span>
                              </div>
                              <p className="text-gray-400 text-sm">Mohona Akter Mukta was added to the team</p>
                            </div>
                            <div className="bg-[#0A0A0A] p-3 rounded-lg">
                              <div className="flex justify-between">
                                <span className="font-medium">Match scheduled</span>
                                <span className="text-gray-400 text-sm">1 day ago</span>
                              </div>
                              <p className="text-gray-400 text-sm">New match against Thunder Bolts added</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Profile Tab */}
                  {activeTab === 'profile' && (
                    <motion.div
                      key="profile"
                      variants={tabVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="grid md:grid-cols-2 gap-6"
                    >
                      <div>
                        <h2 className="text-2xl font-bold mb-6 text-[#D4AF37]">Admin Profile</h2>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4 mb-6">
                            <div className="w-24 h-24 rounded-full bg-[#D4AF37] flex items-center justify-center text-3xl font-bold text-black">
                              {adminData.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold">{adminData.name}</h3>
                              <p className="text-gray-400">{adminData.role}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="block text-gray-400 mb-1">Full Name</label>
                              <input 
                                type="text" 
                                value={adminData.name}
                                onChange={(e) => setAdminData({...adminData, name: e.target.value})}
                                className="w-full bg-[#0A0A0A] rounded-lg px-4 py-2 border border-[#2a2a2a] focus:border-[#D4AF37] focus:outline-none"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-gray-400 mb-1">Email Address</label>
                              <input 
                                type="email" 
                                value={adminData.email}
                                onChange={(e) => setAdminData({...adminData, email: e.target.value})}
                                className="w-full bg-[#0A0A0A] rounded-lg px-4 py-2 border border-[#2a2a2a] focus:border-[#D4AF37] focus:outline-none"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-gray-400 mb-1">Phone Number</label>
                              <input 
                                type="tel" 
                                value={adminData.phone}
                                onChange={(e) => setAdminData({...adminData, phone: e.target.value})}
                                className="w-full bg-[#0A0A0A] rounded-lg px-4 py-2 border border-[#2a2a2a] focus:border-[#D4AF37] focus:outline-none"
                              />
                            </div>
                            
                            <div className="pt-4">
                              <button className="bg-[#D4AF37] text-black font-semibold py-2 px-6 rounded-lg">
                                Update Profile
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Admin Statistics</h3>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-[#0A0A0A] p-4 rounded-lg text-center">
                            <div className="text-3xl font-bold text-[#D4AF37]">12</div>
                            <div className="text-gray-400">Players Added</div>
                          </div>
                          <div className="bg-[#0A0A0A] p-4 rounded-lg text-center">
                            <div className="text-3xl font-bold text-[#D4AF37]">8</div>
                            <div className="text-gray-400">Matches Scheduled</div>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">System Information</h3>
                        <div className="bg-[#0A0A0A] p-4 rounded-lg">
                          <div className="flex justify-between py-2 border-b border-[#2a2a2a]">
                            <span className="text-gray-400">Last Login</span>
                            <span>Today, 09:42 AM</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-[#2a2a2a]">
                            <span className="text-gray-400">Account Created</span>
                            <span>{adminData.joinDate}</span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span className="text-gray-400">Role</span>
                            <span className="text-[#D4AF37]">{adminData.role}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Players Management Tab */}
                  {activeTab === 'players' && (
                    <motion.div
                      key="players"
                      variants={tabVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <h2 className="text-2xl font-bold mb-6 text-[#D4AF37]">Player Management</h2>
                      
                      {/* Pending Approvals */}
                      {pendingPlayers.length > 0 && (
                        <div className="mb-8">
                          <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Pending Approvals</h3>
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {pendingPlayers.map(player => (
                              <div key={player._id} className="bg-[#0A0A0A] rounded-xl p-4 border border-[#D4AF37]">
                                <div className="flex items-center space-x-3 mb-3">
                                  <div className="w-12 h-12 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                                    {player.image ? (
                                      <Image src={player.image} alt={player.name} width={48} height={48} className="rounded-full" />
                                    ) : (
                                      <span className="text-lg font-bold">{player.name.charAt(0)}</span>
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-bold">{player.name}</h4>
                                    <p className="text-sm text-gray-400 capitalize">{player.category}</p>
                                  </div>
                                </div>
                                <div className="text-sm space-y-1 mb-4">
                                  <p><span className="text-gray-400">Age:</span> {player.age}</p>
                                  <p><span className="text-gray-400">Batting:</span> {player.battingStyle}</p>
                                  <p><span className="text-gray-400">Bowling:</span> {player.bowlingStyle}</p>
                                </div>
                                <div className="flex space-x-2">
                                  <button 
                                    onClick={() => handleApprovePlayer(player._id)}
                                    className="flex-1 bg-[#D4AF37] text-black font-semibold py-2 rounded-lg"
                                  >
                                    Approve
                                  </button>
                                  <button 
                                    onClick={() => handleRejectPlayer(player._id)}
                                    className="flex-1 bg-red-600 text-white font-semibold py-2 rounded-lg"
                                  >
                                    Reject
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Current Players */}
                      <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Current Players</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-[#2a2a2a]">
                              <th className="text-left py-3">Player</th>
                              <th className="text-left py-3">Category</th>
                              <th className="text-left py-3">Batting</th>
                              <th className="text-left py-3">Bowling</th>
                              <th className="text-left py-3">Age</th>
                              <th className="text-left py-3">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {players.map(player => (
                              <tr key={player._id} className="border-b border-[#2a2a2a] hover:bg-[#0A0A0A]">
                                <td className="py-3">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                                      {player.image ? (
                                        <Image src={player.image} alt={player.name} width={40} height={40} className="rounded-full" />
                                      ) : (
                                        <span className="text-sm font-bold">{player.name.charAt(0)}</span>
                                      )}
                                    </div>
                                    <div>
                                      <div className="font-medium">{player.name}</div>
                                      <div className="text-sm text-gray-400">{player.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 capitalize">{player.category}</td>
                                <td className="py-3">{player.battingStyle}</td>
                                <td className="py-3">{player.bowlingStyle}</td>
                                <td className="py-3">{player.age}</td>
                                <td className="py-3">
                                  <div className="flex space-x-2">
                                    <button className="text-[#D4AF37] hover:underline">Edit</button>
                                    <button className="text-red-500 hover:underline">Remove</button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-6">
                        <button className="bg-[#D4AF37] text-black font-semibold py-2 px-4 rounded-lg flex items-center gap-2">
                          <span>+</span>
                          <span>Add New Player</span>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Matches Tab */}
                  {activeTab === 'matches' && (
                    <motion.div
                      key="matches"
                      variants={tabVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-[#D4AF37]">Match Schedule</h2>
                        <button className="bg-[#D4AF37] text-black font-semibold py-2 px-4 rounded-lg">
                          + New Match
                        </button>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        {matches.map(match => (
                          <div key={match.id} className="bg-[#0A0A0A] rounded-xl p-5 border border-[#2a2a2a]">
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="text-xl font-bold">Vs {match.opponent}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs ${match.status === 'scheduled' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>
                                {match.status}
                              </span>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                              <div className="flex">
                                <div className="w-24 text-gray-400">Date</div>
                                <div>{match.date}</div>
                              </div>
                              <div className="flex">
                                <div className="w-24 text-gray-400">Time</div>
                                <div>{match.time}</div>
                              </div>
                              <div className="flex">
                                <div className="w-24 text-gray-400">Venue</div>
                                <div>{match.venue}</div>
                              </div>
                              <div className="flex">
                                <div className="w-24 text-gray-400">Format</div>
                                <div>{match.type}</div>
                              </div>
                              <div className="flex">
                                <div className="w-24 text-gray-400">Team</div>
                                <div>{match.team}</div>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2 pt-3">
                              <button className="flex-1 bg-[#2a2a2a] text-white font-semibold py-2 rounded-lg">
                                Edit
                              </button>
                              <button className="flex-1 bg-red-600 text-white font-semibold py-2 rounded-lg">
                                Cancel
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Player Stats Tab */}
                  {activeTab === 'stats' && (
                    <motion.div
                      key="stats"
                      variants={tabVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <h2 className="text-2xl font-bold mb-6 text-[#D4AF37]">Player Statistics</h2>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-[#2a2a2a]">
                              <th className="text-left py-3">Player</th>
                              <th className="text-left py-3">Matches</th>
                              <th className="text-left py-3">Runs</th>
                              <th className="text-left py-3">Highest</th>
                              <th className="text-left py-3">Average</th>
                              <th className="text-left py-3">Wickets</th>
                              <th className="text-left py-3">Economy</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stats.map(stat => (
                              <tr key={stat.playerId} className="border-b border-[#2a2a2a] hover:bg-[#0A0A0A]">
                                <td className="py-3 font-medium">{stat.name}</td>
                                <td className="py-3">{stat.matches}</td>
                                <td className="py-3">{stat.runs}</td>
                                <td className="py-3">{stat.highest}</td>
                                <td className="py-3">{stat.average}</td>
                                <td className="py-3">{stat.wickets}</td>
                                <td className="py-3">{stat.economy}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-8 grid md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Top Batsmen</h3>
                          <div className="space-y-3">
                            {stats.sort((a, b) => b.runs - a.runs).slice(0, 3).map((stat, index) => (
                              <div key={stat.playerId} className="bg-[#0A0A0A] p-3 rounded-lg flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                  <span className="text-[#D4AF37] font-bold">#{index + 1}</span>
                                  <span>{stat.name}</span>
                                </div>
                                <span className="font-bold">{stat.runs} runs</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Top Bowlers</h3>
                          <div className="space-y-3">
                            {stats.sort((a, b) => b.wickets - a.wickets).slice(0, 3).map((stat, index) => (
                              <div key={stat.playerId} className="bg-[#0A0A0A] p-3 rounded-lg flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                  <span className="text-[#D4AF37] font-bold">#{index + 1}</span>
                                  <span>{stat.name}</span>
                                </div>
                                <span className="font-bold">{stat.wickets} wickets</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Gallery Tab */}
                  {activeTab === 'gallery' && (
                    <motion.div
                      key="gallery"
                      variants={tabVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-[#D4AF37]">Gallery Management</h2>
                        <button className="bg-[#D4AF37] text-black font-semibold py-2 px-4 rounded-lg">
                          + Add Image
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {gallery.map(item => (
                          <div key={item.id} className="relative group">
                            <div className="aspect-square bg-[#0A0A0A] rounded-xl overflow-hidden">
                              <div className="w-full h-full bg-gradient-to-br from-[#2a2a2a] to-[#0A0A0A] flex items-center justify-center">
                                <span className="text-4xl">🏏</span>
                              </div>
                            </div>
                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <div className="text-center p-3">
                                <p className="font-medium mb-2">{item.caption}</p>
                                <div className="flex space-x-2 justify-center">
                                  <button className="text-[#D4AF37] hover:underline">Edit</button>
                                  <button className="text-red-500 hover:underline">Delete</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
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

export default AdminDashboard;