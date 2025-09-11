'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import AdminProtected from '@/Components/AdminProtected';
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import NewMatchModal from '@/Components/NewMatchModal';
import PublishResultModal from '@/Components/PublishResultModal';



const AdminDashboard = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [players, setPlayers] = useState([]);
  const [pendingPlayers, setPendingPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [stats, setStats] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState(null);
  const [playerToReject, setPlayerToReject] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [uploadData, setUploadData] = useState({
    category: 'profile',
    title: '',
    images: [],
    previews: [],
  });
  const [showNewMatchModal, setShowNewMatchModal] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [showEditMatchModal, setShowEditMatchModal] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [matchToDelete, setMatchToDelete] = useState(null);
  const [showPublishResultModal, setShowPublishResultModal] = useState(false);
  const [selectedMatchForResult, setSelectedMatchForResult] = useState(null);

  // Animation variants
  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  // Drawer animation variants
  const drawerVariants = {
    hidden: { x: '-100%' },
    visible: {
      x: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 200
      }
    },
    exit: {
      x: '-100%',
      transition: { duration: 0.3 }
    }
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

  // Gallery categories
  const galleryCategories = [
    { id: 'matches', name: 'Match Moments' },
    { id: 'winning', name: 'Winning Moments' },
    { id: 'team', name: 'Team Photos' },
  ];

  // Navigation tabs data
  const navTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'players', label: 'Management', icon: '👥' },
    { id: 'matches', label: 'Matches', icon: '🏏' },
    { id: 'stats', label: 'Player Stats', icon: '📈' },
    { id: 'gallery', label: 'Gallery', icon: '🖼️' },
  ];

  // Fetch player stats from playerDetails collection
  const fetchPlayerStats = async () => {
    if (players.length === 0) return;

    setLoadingStats(true);
    try {
      const statsPromises = players.map(async (player) => {
        try {
          const response = await fetch(`/api/player-details/${player.username}`);
          if (response.ok) {
            const playerDetails = await response.json();
            return {
              playerId: player._id,
              username: player.username,
              name: player.name,
              category: player.category,
              image: player.image,
              matches: playerDetails.matches || 0,
              runs: playerDetails.runs || 0,
              wickets: playerDetails.wickets || 0,
              average: playerDetails.average || 0,
              highest: playerDetails.bestBatting || '0 (0)',
              economy: playerDetails.economy || 0,
              bestBowling: playerDetails.bestBowling || '0/0',
              halfCenturies: playerDetails.halfCenturies || 0,
              centuries: playerDetails.centuries || 0,
              thirties: playerDetails.thirties || 0,
              threeWickets: playerDetails.threeWickets || 0,
              fiveWickets: playerDetails.fiveWickets || 0,
              maidens: playerDetails.maidens || 0,
            };
          } else {
            // Return default stats if API fails
            return {
              playerId: player._id,
              username: player.username,
              name: player.name,
              category: player.category,
              image: player.image,
              matches: 0,
              runs: 0,
              wickets: 0,
              average: 0,
              highest: '0 (0)',
              economy: 0,
              bestBowling: '0/0',
              halfCenturies: 0,
              centuries: 0,
              thirties: 0,
              threeWickets: 0,
              fiveWickets: 0,
              maidens: 0,
            };
          }
        } catch (error) {
          console.error(`Error fetching stats for ${player.username}:`, error);
          // Return default stats on error
          return {
            playerId: player._id,
            username: player.username,
            name: player.name,
            category: player.category,
            image: player.image,
            matches: 0,
            runs: 0,
            wickets: 0,
            average: 0,
            highest: '0 (0)',
            economy: 0,
            bestBowling: '0/0',
            halfCenturies: 0,
            centuries: 0,
            thirties: 0,
            threeWickets: 0,
            fiveWickets: 0,
            maidens: 0,
          };
        }
      });

      const allStats = await Promise.all(statsPromises);
      setStats(allStats);
    } catch (error) {
      console.error('Error fetching player stats:', error);
      toast.error('Failed to load player statistics');
      // Set default stats for all players
      const defaultStats = players.map(player => ({
        playerId: player._id,
        username: player.username,
        name: player.name,
        category: player.category,
        image: player.image,
        matches: 0,
        runs: 0,
        wickets: 0,
        average: 0,
        highest: '0 (0)',
        economy: 0,
        bestBowling: '0/0',
        halfCenturies: 0,
        centuries: 0,
        thirties: 0,
        threeWickets: 0,
        fiveWickets: 0,
        maidens: 0,
      }));
      setStats(defaultStats);
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch gallery images from API
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await fetch('/api/gallery');
        const data = await response.json();

        if (response.ok) {
          setGallery(data.images || []);
        } else {
          console.error('Failed to fetch gallery images:', data.message);
          toast.error('Failed to load gallery images');
        }
      } catch (error) {
        console.error('Error fetching gallery images:', error);
        toast.error('Error loading gallery images');
      }
    };

    fetchGalleryImages();
  }, []);

  // Load matches from API
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch('/api/matches', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch matches');
        }

        const data = await response.json();
        setMatches(data);
      } catch (error) {
        console.error('Error fetching matches:', error);
        setMatches([]);
      }
    };

    fetchMatches();
  }, []);

  // Fetch players from database
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch('/api/players');
        if (response.ok) {
          const playersData = await response.json();
          const approvedPlayers = playersData.filter((player) => player.status === 'approved');
          const pendingPlayersData = playersData.filter((player) => player.status === 'pending');

          setPlayers(approvedPlayers);
          setPendingPlayers(pendingPlayersData);

          // Fetch stats after players are loaded
          if (approvedPlayers.length > 0) {
            fetchPlayerStats();
          }
        }
      } catch (error) {
        console.error('Error fetching players:', error);
        toast.error('Failed to load players');
      }
    };

    fetchPlayers();
  }, []);

  // Refetch stats when players change
  useEffect(() => {
    if (activeTab === 'stats' && players.length > 0) {
      fetchPlayerStats();
    }
  }, [activeTab, players]);

  // Handle image selection for upload
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newPreviews = [];
    const newImages = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target.result);
        if (newPreviews.length === files.length) {
          setUploadData((prev) => ({
            ...prev,
            previews: [...prev.previews, ...newPreviews],
            images: [...prev.images, ...newImages],
          }));
        }
      };
      reader.readAsDataURL(file);
      newImages.push(file);
    });
  };

  // Remove selected image from upload
  const removeImage = (index) => {
    setUploadData((prev) => ({
      ...prev,
      previews: prev.previews.filter((_, i) => i !== index),
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Handle image upload
  const handleUpload = async () => {
    if (!session) {
      toast.error('You must be logged in to upload images');
      return;
    }

    if (uploadData.images.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    setIsUploading(true);
    const uploadToast = toast.loading(`Uploading ${uploadData.images.length} image${uploadData.images.length !== 1 ? 's' : ''}...`);

    try {
      const uploadPromises = uploadData.images.map(async (image) => {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('username', session.user.username);
        formData.append('name', session.user.name);
        formData.append('category', uploadData.category);
        formData.append('title', uploadData.title || '');

        const response = await fetch('/api/gallery/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        return response.json();
      });

      await Promise.all(uploadPromises);

      toast.success('Images uploaded successfully!', { id: uploadToast });
      setShowUploadModal(false);
      setUploadData({
        category: 'profile',
        title: '',
        images: [],
        previews: [],
      });

      const response = await fetch('/api/gallery');
      const data = await response.json();
      if (response.ok) {
        setGallery(data.images || []);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images. Please try again.', { id: uploadToast });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle image deletion
  const handleDeleteImage = async (imageId) => {
    try {
      const response = await fetch('/api/gallery/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageId }),
      });

      if (response.ok) {
        setGallery(gallery.filter((img) => img._id !== imageId));
        toast.success('Image deleted successfully!');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Error deleting image');
    }
  };

  // Handle player approval
  const handleApprovePlayer = async (playerId) => {
    try {
      const response = await fetch('/api/players/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId }),
      });

      if (response.ok) {
        const player = pendingPlayers.find((p) => p._id === playerId);
        setPendingPlayers(pendingPlayers.filter((p) => p._id !== playerId));
        const newApprovedPlayer = { ...player, status: 'approved' };
        setPlayers([...players, newApprovedPlayer]);

        // Fetch stats for the newly approved player
        if (newApprovedPlayer.username) {
          try {
            const statsResponse = await fetch(`/api/player-details/${newApprovedPlayer.username}`);
            if (statsResponse.ok) {
              const playerDetails = await statsResponse.json();
              const newStat = {
                playerId: newApprovedPlayer._id,
                username: newApprovedPlayer.username,
                name: newApprovedPlayer.name,
                category: newApprovedPlayer.category,
                image: newApprovedPlayer.image,
                matches: playerDetails.matches || 0,
                runs: playerDetails.runs || 0,
                wickets: playerDetails.wickets || 0,
                average: playerDetails.average || 0,
                highest: playerDetails.bestBatting || '0 (0)',
                economy: playerDetails.economy || 0,
                bestBowling: playerDetails.bestBowling || '0/0',
                halfCenturies: playerDetails.halfCenturies || 0,
                centuries: playerDetails.centuries || 0,
                thirties: playerDetails.thirties || 0,
                threeWickets: playerDetails.threeWickets || 0,
                fiveWickets: playerDetails.fiveWickets || 0,
                maidens: playerDetails.maidens || 0,
              };
              setStats(prev => [...prev, newStat]);
            }
          } catch (error) {
            console.error('Error fetching stats for approved player:', error);
          }
        }

        toast.success(`${player.name} approved successfully!`);
      } else {
        toast.error('Failed to approve player');
      }
    } catch (error) {
      console.error('Error approving player:', error);
      toast.error('Error approving player');
    }
  };

  // Handle player rejection
  const handleRejectPlayer = async (playerId) => {
    try {
      const response = await fetch('/api/players/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId }),
      });

      if (response.ok) {
        setPendingPlayers(pendingPlayers.filter((p) => p._id !== playerId));
        toast.success('Player rejected successfully');
      } else {
        toast.error('Failed to reject player');
      }
    } catch (error) {
      console.error('Error rejecting player:', error);
      toast.error('Error rejecting player');
    }
  };

  // Handle player deletion
  const handleDeletePlayer = async (playerId) => {
    try {
      const response = await fetch('/api/players/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId }),
      });

      if (response.ok) {
        setPlayers(players.filter((p) => p._id !== playerId));
        setStats(stats.filter((s) => s.playerId !== playerId));
        setPlayerToDelete(null);
        toast.success('Player removed successfully');
      } else {
        toast.error('Failed to remove player');
      }
    } catch (error) {
      console.error('Error deleting player:', error);
      toast.error('Error removing player');
    }
  };

  // Handle adding new match
  const handleAddMatch = (newMatch) => {
    setMatches([...matches, { ...newMatch, id: Date.now(), status: 'scheduled' }]);
    toast.success('Match scheduled successfully!');
  };

  const handleDeleteMatch = async (matchId) => {
    try {
      const response = await fetch(`/api/matches`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ matchId }),
      });

      if (response.ok) {
        setMatches(matches.filter((m) => m._id !== matchId));
        setMatchToDelete(null);
        toast.success('Match deleted successfully!');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete match');
      }
    } catch (error) {
      console.error('Error deleting match:', error);
      toast.error('Error deleting match');
    }
  };

  const handleEditMatch = async (match) => {
    if (match.selectedPlayers && match.selectedPlayers.length > 0) {
      try {
        const response = await fetch('/api/players');
        if (response.ok) {
          const allPlayers = await response.json();
          const approvedPlayers = allPlayers.filter(p => p.status === 'approved');
          const playerIds = match.selectedPlayers
            .map(username => approvedPlayers.find(p => p.username === username)?._id)
            .filter(id => id);
          setEditingMatch({
            ...match,
            selectedPlayers: playerIds
          });
        }
      } catch (error) {
        console.error('Error preparing edit match:', error);
        toast.error('Failed to load players for edit');
        return;
      }
    } else {
      setEditingMatch(match);
    }
    setShowEditMatchModal(true);
  };

  const handleUpdateMatch = (updatedMatch) => {
    setMatches(matches.map((m) => (m._id === updatedMatch._id ? updatedMatch : m)));
    toast.success('Match updated successfully!');
    setShowEditMatchModal(false);
    setEditingMatch(null);
  };

  // Close drawer when tab is clicked
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setIsDrawerOpen(false);
  };

  // Get formatted best batting score
  const formatBestBatting = (bestBatting) => {
    if (typeof bestBatting === 'string' && bestBatting.includes('(')) {
      return bestBatting;
    }
    return bestBatting || '0 (0)';
  };

  // Get formatted best bowling
  const formatBestBowling = (bestBowling) => {
    if (typeof bestBowling === 'string' && bestBowling.includes('/')) {
      return bestBowling;
    }
    return bestBowling || '0/0';
  };

  const handlePublishResult = async (resultData) => {
    try {
      // Send to backend (new endpoint)
      const response = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resultData),
      });
      if (!response.ok) throw new Error('Failed to save result');

      // Update match status to completed
      await fetch('/api/matches', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId: resultData.matchId, status: 'completed' }),
      });

      // Refetch matches
      const matchesRes = await fetch('/api/matches');
      const updatedMatches = await matchesRes.json();
      setMatches(updatedMatches);
    } catch (error) {
      console.error('Error publishing result:', error);
      toast.error('Failed to publish result');
    }
  };

  return (
    <AdminProtected>
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
              iconTheme: {
                primary: '#f0c22c',
                secondary: '#1A1A1A',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#1A1A1A',
              },
            },
            loading: {
              iconTheme: {
                primary: '#f0c22c',
                secondary: '#1A1A1A',
              },
            },
          }}
        />

        <div className="w-11/12 mx-auto pt-20 pb-16">
          <div className="absolute inset-0 z-0 overflow-hidden">
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

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Sidebar for large devices */}
              <div className="hidden lg:block w-full lg:w-1/4">
                <div className="sticky top-4 z-30">
                  <div className="bg-[#1a1a1a] rounded-xl p-4">
                    <h3 className="text-lg font-bold mb-4 text-[#D4AF37]">Navigation</h3>
                    <div className="space-y-2">
                      {navTabs.map((tab) => (
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
              </div>

              {/* Mobile Hamburger Menu Button */}
              <div className="lg:hidden mb-6">
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="bg-[#1a1a1a] p-3 rounded-lg text-[#D4AF37] hover:bg-[#2a2a2a] transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              {/* Mobile Drawer */}
              <AnimatePresence>
                {isDrawerOpen && (
                  <motion.div
                    variants={drawerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="fixed lg:hidden inset-0 z-40 bg-black bg-opacity-50"
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    <motion.div
                      className="w-64 h-full bg-[#1a1a1a] p-6 flex flex-col"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-[#D4AF37]">Navigation</h3>
                        <button
                          onClick={() => setIsDrawerOpen(false)}
                          className="text-gray-400 hover:text-white"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="space-y-2 flex-1">
                        {navTabs.map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab.id)}
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
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Content area */}
              <div className="w-full lg:w-3/4">
                <div className="bg-[#1a1a1a] rounded-xl p-6">
                  <AnimatePresence mode="wait">
                    {/* Dashboard Tab */}
                    {activeTab === 'dashboard' && (
                      <motion.div key="dashboard" variants={tabVariants} initial="hidden" animate="visible" exit="exit">
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
                            <div className="text-3xl font-bold text-[#D4AF37]">{matches.filter((match) => match.status === 'scheduled').length}</div>
                            <div className="text-gray-400">Scheduled Matches</div>
                          </div>
                          <div className="bg-[#0A0A0A] p-4 rounded-lg text-center">
                            <div className="text-3xl font-bold text-[#D4AF37]">
                              {stats.reduce((sum, player) => sum + player.matches, 0)}
                            </div>
                            <div className="text-gray-400">Total Matches</div>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Upcoming Matches</h3>
                            <div className="space-y-3">
                              {matches
                                .filter((match) => match.status === 'scheduled')
                                .slice(0, 3)
                                .map((match) => (
                                  <div key={match.id || match._id} className="bg-[#0A0A0A] p-3 rounded-lg">
                                    <div className="flex justify-between items-center">
                                      <span className="font-bold">Vs {match.team2.name}</span>
                                      <span className="text-sm text-gray-400">{match.date}</span>
                                    </div>
                                    <p className="text-sm text-gray-400">
                                      {match.venue} • {match.time}
                                    </p>
                                  </div>
                                ))}
                              {matches.filter((match) => match.status === 'scheduled').length === 0 && (
                                <div className="text-center py-4 text-gray-400">
                                  No upcoming matches
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Top Performers</h3>
                            <div className="space-y-3">
                              <div className="bg-[#0A0A0A] p-3 rounded-lg">
                                <div className="flex justify-between">
                                  <span className="font-medium">Top Run Scorer</span>
                                  <span className="text-gray-400 text-sm">Season Stats</span>
                                </div>
                                <p className="text-gray-400 text-sm">
                                  {stats.length > 0
                                    ? `${stats.reduce((max, p) => p.runs > max.runs ? p : max, stats[0]).name}: ${stats.reduce((max, p) => p.runs > max ? p.runs : max, 0)} runs`
                                    : 'No data available'
                                  }
                                </p>
                              </div>
                              <div className="bg-[#0A0A0A] p-3 rounded-lg">
                                <div className="flex justify-between">
                                  <span className="font-medium">Top Wicket Taker</span>
                                  <span className="text-gray-400 text-sm">Season Stats</span>
                                </div>
                                <p className="text-gray-400 text-sm">
                                  {stats.length > 0
                                    ? `${stats.reduce((max, p) => p.wickets > max.wickets ? p : max, stats[0]).name}: ${stats.reduce((max, p) => p.wickets > max ? p.wickets : max, 0)} wickets`
                                    : 'No data available'
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Players Management Tab */}
                    {activeTab === 'players' && (
                      <motion.div key="players" variants={tabVariants} initial="hidden" animate="visible" exit="exit">
                        <h2 className="text-2xl font-bold mb-6 text-[#D4AF37]">Player Management</h2>
                        {pendingPlayers.length > 0 && (
                          <div className="mb-8">
                            <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Pending Approvals</h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {pendingPlayers.map((player) => (
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
                                    <p>
                                      <span className="text-gray-400">Age:</span> {player.age}
                                    </p>
                                    <p>
                                      <span className="text-gray-400">Batting:</span> {player.battingStyle}
                                    </p>
                                    <p>
                                      <span className="text-gray-400">Bowling:</span> {player.bowlingStyle}
                                    </p>
                                  </div>
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => handleApprovePlayer(player._id)}
                                      className="flex-1 bg-[#D4AF37] text-black font-semibold py-2 rounded-lg"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => setPlayerToReject(player)}
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
                        <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Current Players</h3>
                        <div className="hidden sm:block overflow-x-auto scrollbar-black">

                          <table className="w-[1000px]">
                            <thead>
                              <tr className="border-b border-[#2a2a2a]">
                                <th className="text-left py-3">Player</th>
                                <th className="text-left py-3">Category</th>
                                <th className="text-left py-3">Batting</th>
                                <th className="text-left py-3">Bowling</th>
                                <th className="text-left py-3">Matches</th>
                                <th className="text-left py-3">Runs</th>
                                <th className="text-left py-3">Wickets</th>
                                <th className="text-left py-3">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {players.map((player) => {
                                const playerStat = stats.find(s => s.playerId === player._id);
                                return (
                                  <tr key={player._id} className="border-b border-[#2a2a2a] hover:bg-[#0A0A0A]">
                                    <td className="py-3 flex items-center space-x-3">
                                      <div className="w-10 h-10 rounded-full overflow-hidden bg-[#2a2a2a] flex items-center justify-center">
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
                                    </td>
                                    <td className="py-3 capitalize">{player.category}</td>
                                    <td className="py-3">{player.battingStyle}</td>
                                    <td className="py-3">{player.bowlingStyle}</td>
                                    <td className="py-3">{playerStat?.matches || 0}</td>
                                    <td className="py-3 font-medium text-[#D4AF37]">{playerStat?.runs || 0}</td>
                                    <td className="py-3 font-medium text-[#D4AF37]">{playerStat?.wickets || 0}</td>
                                    <td className="py-3">
                                      <button
                                        onClick={() => setPlayerToDelete(player)}
                                        className="text-red-500 hover:underline"
                                      >
                                        Remove
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        <div className="sm:hidden space-y-4">
                          {players.map((player) => {
                            const playerStat = stats.find(s => s.playerId === player._id);
                            return (
                              <div key={player._id} className="p-4 border border-[#2a2a2a] rounded-lg hover:bg-[#0A0A0A]">
                                <div className="flex items-center space-x-3 mb-2">
                                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[#2a2a2a] flex items-center justify-center">
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
                                <div className="text-sm mb-1">
                                  <span className="font-semibold">Category:</span> {player.category}
                                </div>
                                <div className="text-sm mb-1">
                                  <span className="font-semibold">Batting:</span> {player.battingStyle}
                                </div>
                                <div className="text-sm mb-1">
                                  <span className="font-semibold">Bowling:</span> {player.bowlingStyle}
                                </div>
                                <div className="flex justify-between text-sm mt-2">
                                  <span>Runs: <span className="font-medium text-[#D4AF37]">{playerStat?.runs || 0}</span></span>
                                  <span>Wickets: <span className="font-medium text-[#D4AF37]">{playerStat?.wickets || 0}</span></span>
                                </div>
                                <button
                                  onClick={() => setPlayerToDelete(player)}
                                  className="text-red-500 hover:underline mt-2"
                                >
                                  Remove
                                </button>
                              </div>
                            );
                          })}
                        </div>

                        {/* Player Delete and Reject Modals */}
                        {playerToDelete && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                          >
                            <motion.div
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.9, opacity: 0 }}
                              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                              className="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-md"
                            >
                              <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Confirm Removal</h3>
                              <p className="mb-6">
                                Are you sure you want to remove {playerToDelete.name} from the team? This action cannot be undone.
                              </p>
                              <div className="flex space-x-4 justify-end">
                                <button
                                  onClick={() => setPlayerToDelete(null)}
                                  className="px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-800"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => {
                                    handleDeletePlayer(playerToDelete._id);
                                    setPlayerToDelete(null);
                                  }}
                                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                                >
                                  Confirm Removal
                                </button>
                              </div>
                            </motion.div>
                          </motion.div>
                        )}
                        {playerToReject && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                          >
                            <motion.div
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.9, opacity: 0 }}
                              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                              className="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-md"
                            >
                              <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Confirm Rejection</h3>
                              <p className="mb-6">
                                Are you sure you want to reject {playerToReject.name}'s application? This action cannot be undone.
                              </p>
                              <div className="flex space-x-4 justify-end">
                                <button
                                  onClick={() => setPlayerToReject(null)}
                                  className="px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-800"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => {
                                    handleRejectPlayer(playerToReject._id);
                                    setPlayerToReject(null);
                                  }}
                                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                                >
                                  Confirm Rejection
                                </button>
                              </div>
                            </motion.div>
                          </motion.div>
                        )}
                      </motion.div>
                    )}

                    {/* Matches Tab */}
                    {activeTab === 'matches' && (
                      <motion.div key="matches" variants={tabVariants} initial="hidden" animate="visible" exit="exit">
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-2xl font-bold text-[#D4AF37]">Matches</h2>
                          <button
                            onClick={() => setShowNewMatchModal(true)}
                            className="bg-[#D4AF37] text-black font-semibold py-2 px-4 rounded-lg"
                          >
                            + New Match
                          </button>
                        </div>

                        {/* Upcoming Matches Section */}
                        <div className="mb-8">
                          <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Upcoming Matches</h3>
                          <div className="grid md:grid-cols-2 gap-6">
                            {matches
                              .filter(match => match.status === 'scheduled')
                              .map((match) => (
                                <div key={match._id || match.id} className="bg-[#0A0A0A] rounded-xl p-5 border border-[#2a2a2a]">
                                  <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                      {match.team1 && match.team1.logo && (
                                        <img src={match.team1.logo} alt={match.team1.name} className="w-8 h-8 rounded-full object-cover" />
                                      )}
                                      <h3 className="text-xl font-bold">Vs {match.team2 ? match.team2.name : 'Unknown Team'}</h3>
                                    </div>
                                    <div className="flex flex-col items-end">
                                      <span
                                        className={`px-2 py-1 rounded-full text-xs ${match.status === 'scheduled'
                                          ? 'bg-yellow-500/20 text-yellow-500'
                                          : match.status === 'completed'
                                            ? 'bg-green-500/20 text-green-500'
                                            : 'bg-red-500/20 text-red-500'
                                          }`}
                                      >
                                        {match.status}
                                      </span>
                                      {match.selectedPlayers && match.selectedPlayers.length > 0 && (
                                        <span className="text-xs text-gray-400 mt-1">
                                          {match.selectedPlayers.length} players
                                        </span>
                                      )}
                                    </div>
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
                                      <div className="w-24 text-gray-400">Overs</div>
                                      <div>{match.overs}</div>
                                    </div>
                                  </div>
                                  {match.selectedPlayers && match.selectedPlayers.length > 0 && (
                                    <div className="mb-4">
                                      <h4 className="text-sm font-semibold text-[#D4AF37] mb-2">Selected Players:</h4>
                                      <div className="flex flex-wrap gap-2">
                                        {match.selectedPlayersData?.slice(0, 3).map((player, index) => (
                                          <span key={index} className="px-2 py-1 bg-[#2a2a2a] text-xs rounded-full">
                                            {player.name}
                                          </span>
                                        ))}
                                        {match.selectedPlayersData && match.selectedPlayersData.length > 3 && (
                                          <span className="px-2 py-1 bg-[#2a2a2a] text-xs rounded-full">
                                            +{match.selectedPlayersData.length - 3} more
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                  <div className="flex space-x-2 pt-3">
                                    <button
                                      onClick={() => handleEditMatch(match)}
                                      className="flex-1 bg-[#2a2a2a] text-white font-semibold py-2 rounded-lg hover:bg-[#D4AF37] hover:text-black transition-colors"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => setMatchToDelete(match)}
                                      className="flex-1 bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              ))}
                            {matches.filter(match => match.status === 'scheduled').length === 0 && (
                              <div className="col-span-full text-center py-16">
                                <svg className="w-16 h-16 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-xl font-bold text-gray-400">No upcoming matches</h3>
                                <p className="text-gray-500 mt-2">Create your first match to get started</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Publish Match Result Section */}
                        <div className="mt-8">
                          <h3 className="text-lg sm:text-xl font-bold mb-4 text-[#D4AF37]">Publish Match Result</h3>
                          <div className="bg-[#0A0A0A] rounded-xl p-4 sm:p-6 border border-[#2a2a2a]">
                            {matches.filter(match => match.status === 'scheduled').length === 0 ? (
                              <div className="text-center py-8 text-gray-400">
                                <svg className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h4 className="text-base sm:text-lg font-medium mb-2">No scheduled matches available</h4>
                                <p className="text-xs sm:text-sm">Publish results for completed matches here. Create or edit matches to update their status.</p>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {matches
                                  .filter(match => match.status === 'scheduled')
                                  .map((match) => (
                                    <div
                                      key={match._id || match.id}
                                      className="bg-[#1a1a1a] p-4 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center"
                                    >
                                      <div className="flex-1 mb-4 sm:mb-0">
                                        <div className="flex items-center space-x-3 mb-1">
                                          {match.team1 && match.team1.logo && (
                                            <img
                                              src={match.team1.logo}
                                              alt={match.team1.name}
                                              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
                                            />
                                          )}
                                          <div>
                                            <h4 className="font-semibold text-[#D4AF37] text-sm sm:text-base">
                                              Vs {match.team2 ? match.team2.name : 'Unknown Team'}
                                            </h4>
                                            <p className="text-xs sm:text-sm text-gray-400">
                                              {match.date} • {match.venue} • {match.time}
                                            </p>
                                          </div>
                                        </div>
                                        {match.selectedPlayers && match.selectedPlayers.length > 0 && (
                                          <p className="text-xs text-gray-500 mt-1">
                                            {match.selectedPlayers.length} players selected
                                          </p>
                                        )}
                                      </div>
                                      <div className="flex items-center space-x-2 sm:space-x-3">
                                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs font-medium rounded-full">
                                          Scheduled
                                        </span>
                                        <button
                                          onClick={() => { setSelectedMatchForResult(match); setShowPublishResultModal(true); }}
                                          className="bg-[#D4AF37] text-black cursor-pointer font-semibold py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg text-xs sm:text-sm hover:bg-[#c59a2f] transition-colors"
                                        >
                                          Publish Result
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Completed Matches Section (Optional - for reference) */}
                        {matches.filter(match => match.status === 'completed').length > 0 && (
                          <div className="mt-8">
                            <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Completed Matches</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                              {matches
                                .filter(match => match.status === 'completed')
                                .map((match) => (
                                  <div key={match._id || match.id} className="bg-[#0A0A0A] rounded-xl p-5 border border-[#2a2a2a]">
                                    <div className="flex justify-between items-start mb-4">
                                      <div className="flex items-center gap-3">
                                        {match.team1 && match.team1.logo && (
                                          <img src={match.team1.logo} alt={match.team1.name} className="w-8 h-8 rounded-full object-cover" />
                                        )}
                                        <h3 className="text-xl font-bold">Vs {match.team2 ? match.team2.name : 'Unknown Team'}</h3>
                                      </div>
                                      <div className="flex flex-col items-end">
                                        <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-500">
                                          Completed
                                        </span>
                                        {match.result && (
                                          <span className="text-xs text-green-400 mt-1 font-medium">
                                            {match.result}
                                          </span>
                                        )}
                                      </div>
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
                                        <div className="w-24 text-gray-400">Overs</div>
                                        <div>{match.overs}</div>
                                      </div>
                                    </div>
                                    {match.selectedPlayers && match.selectedPlayers.length > 0 && (
                                      <div className="mb-4">
                                        <h4 className="text-sm font-semibold text-[#D4AF37] mb-2">Players:</h4>
                                        <div className="flex flex-wrap gap-2">
                                          {match.selectedPlayersData?.slice(0, 3).map((player, index) => (
                                            <span key={index} className="px-2 py-1 bg-[#2a2a2a] text-xs rounded-full">
                                              {player.name}
                                            </span>
                                          ))}
                                          {match.selectedPlayersData && match.selectedPlayersData.length > 3 && (
                                            <span className="px-2 py-1 bg-[#2a2a2a] text-xs rounded-full">
                                              +{match.selectedPlayersData.length - 3} more
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                    <div className="flex space-x-2 pt-3">
                                      <button
                                        onClick={() => handleEditMatch(match)}
                                        className="flex-1 bg-[#2a2a2a] text-white font-semibold py-2 rounded-lg hover:bg-[#D4AF37] hover:text-black transition-colors"
                                      >
                                        View Details
                                      </button>
                                      <button
                                        onClick={() => setMatchToDelete(match)}
                                        className="flex-1 bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition-colors"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Player Stats Tab - Enhanced */}
                    {activeTab === 'stats' && (
                      <motion.div key="stats" variants={tabVariants} initial="hidden" animate="visible" exit="exit">
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-2xl font-bold text-[#D4AF37]">Player Statistics</h2>
                          {loadingStats && (
                            <div className="flex items-center text-sm text-[#D4AF37]">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Loading stats...
                            </div>
                          )}
                        </div>

                        {/* Stats Summary Cards */}
                        {stats.length > 0 && !loadingStats && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-[#0A0A0A] p-4 rounded-lg text-center border border-[#2a2a2a]">
                              <div className="text-2xl font-bold text-[#D4AF37]">{stats.reduce((sum, p) => sum + p.runs, 0)}</div>
                              <div className="text-gray-400">Total Runs</div>
                            </div>
                            <div className="bg-[#0A0A0A] p-4 rounded-lg text-center border border-[#2a2a2a]">
                              <div className="text-2xl font-bold text-[#D4AF37]">{stats.reduce((sum, p) => sum + p.wickets, 0)}</div>
                              <div className="text-gray-400">Total Wickets</div>
                            </div>
                            <div className="bg-[#0A0A0A] p-4 rounded-lg text-center border border-[#2a2a2a]">
                              <div className="text-2xl font-bold text-[#D4AF37]">{stats.reduce((sum, p) => sum + p.matches, 0)}</div>
                              <div className="text-gray-400">Total Matches</div>
                            </div>
                          </div>
                        )}

                        {/* Mobile Stats Cards */}
                        <div className="sm:hidden space-y-4 mb-6">
                          {loadingStats ? (
                            <div className="text-center py-8 text-gray-400">
                              Loading player statistics...
                            </div>
                          ) : stats.length === 0 ? (
                            <div className="text-center py-8">
                              <svg className="w-16 h-16 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                              <h3 className="text-xl font-bold text-gray-400">No statistics available</h3>
                              <p className="text-gray-500 mt-2">Player statistics will appear here once matches are played</p>
                            </div>
                          ) : (
                            stats.map((stat) => (
                              <div key={stat.playerId} className="bg-[#0A0A0A] p-4 rounded-lg border border-[#2a2a2a]">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full  overflow-hidden bg-[#2a2a2a] flex items-center justify-center">
                                      {stat.image ? (
                                        <Image src={stat.image} alt={stat.name} width={40} height={40} className="rounded-full" />
                                      ) : (
                                        <span className="text-sm font-bold">{stat.name.charAt(0)}</span>
                                      )}
                                    </div>
                                    <h3 className="font-bold text-[#D4AF37]">{stat.name}</h3>
                                  </div>
                                  <span className="text-sm text-gray-400">{stat.matches} matches</span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  <div>
                                    <span className="text-gray-400 block">Runs</span>
                                    <span className="font-medium text-[#D4AF37]">{stat.runs}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-400 block">Wickets</span>
                                    <span className="font-medium text-[#D4AF37]">{stat.wickets}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-400 block">Average</span>
                                    <span className="font-medium">{stat.average.toFixed(1)}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-400 block">Economy</span>
                                    <span className="font-medium">{stat.economy.toFixed(1)}</span>
                                  </div>
                                  <div className="col-span-2">
                                    <span className="text-gray-400 block">Best Batting</span>
                                    <span className="font-medium">{formatBestBatting(stat.highest)}</span>
                                  </div>
                                  <div className="col-span-2">
                                    <span className="text-gray-400 block">Best Bowling</span>
                                    <span className="font-medium">{formatBestBowling(stat.bestBowling)}</span>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Desktop Table */}
                        <div className="hidden sm:block overflow-x-auto mb-8">
                          {loadingStats ? (
                            <div className="text-center py-8 text-gray-400">
                              Loading player statistics...
                            </div>
                          ) : stats.length === 0 ? (
                            <div className="text-center py-8">
                              <svg className="w-16 h-16 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                              <h3 className="text-xl font-bold text-gray-400">No statistics available</h3>
                              <p className="text-gray-500 mt-2">Player statistics will appear here once matches are played</p>
                            </div>
                          ) : (
                            <div className="overflow-x-auto scrollbar-black">
                              <table className="w-[1000px]">
                                <thead>
                                  <tr className="border-b border-[#2a2a2a]">
                                    <th className="text-left py-3">Player</th>
                                    <th className="text-left py-3">Category</th>
                                    <th className="text-left py-3">Matches</th>
                                    <th className="text-left py-3">Runs</th>
                                    <th className="text-left py-3">Average</th>
                                    <th className="text-left py-3">Highest</th>
                                    <th className="text-left py-3">Wickets</th>
                                    <th className="text-left py-3">Economy</th>
                                    <th className="text-left py-3">Best Bowling</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {stats.map((stat) => (
                                    <tr key={stat.playerId} className="border-b border-[#2a2a2a] hover:bg-[#0A0A0A]">
                                      <td className="py-3">
                                        <div className="flex items-center space-x-3">
                                          <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center overflow-hidden">
                                            {stat.image ? (
                                              <Image src={stat.image} alt={stat.name} width={32} height={32} className="rounded-full" />
                                            ) : (
                                              <span className="text-xs font-bold">{stat.name.charAt(0)}</span>
                                            )}
                                          </div>
                                          <span className="font-medium">{stat.name}</span>
                                        </div>
                                      </td>
                                      <td className="py-3 capitalize">{stat.category}</td>
                                      <td className="py-3">{stat.matches}</td>
                                      <td className="py-3 font-medium text-[#D4AF37]">{stat.runs}</td>
                                      <td className="py-3">{stat.average.toFixed(1)}</td>
                                      <td className="py-3">{formatBestBatting(stat.highest)}</td>
                                      <td className="py-3 font-medium text-[#D4AF37]">{stat.wickets}</td>
                                      <td className="py-3">{stat.economy.toFixed(1)}</td>
                                      <td className="py-3">{formatBestBowling(stat.bestBowling)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>

                        {/* Top Performers Section */}
                        {!loadingStats && stats.length > 0 && (
                          <div className="mt-8">
                            <h3 className="text-xl font-bold mb-6 text-[#D4AF37] text-center">Top Performers</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                              {/* Top Batsmen */}
                              <div>
                                <h4 className="text-lg font-bold mb-4 text-[#D4AF37]">🏏 Top Batsmen (Most Runs)</h4>
                                <div className="space-y-3">
                                  {[...stats]
                                    .sort((a, b) => b.runs - a.runs)
                                    .slice(0, 5)
                                    .map((stat, index) => (
                                      <motion.div
                                        key={stat.playerId}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-[#0A0A0A] p-4 rounded-lg flex justify-between items-center border border-[#2a2a2a]"
                                      >
                                        <div className="flex items-center space-x-3">
                                          <span className={`text-2xl font-bold ${index === 0 ? 'text-[#D4AF37]' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-[#D4AF37]' : 'text-gray-500'}`}>
                                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                          </span>
                                          <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center overflow-hidden">
                                              {stat.image ? (
                                                <Image src={stat.image} alt={stat.name} width={32} height={32} className="rounded-full" />
                                              ) : (
                                                <span className="text-xs font-bold">{stat.name.charAt(0)}</span>
                                              )}
                                            </div>
                                            <span className="font-medium">{stat.name}</span>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <span className="font-bold block text-lg">{stat.runs} runs</span>
                                          <span className="text-sm text-gray-400">Avg: {stat.average.toFixed(1)}</span>
                                        </div>
                                      </motion.div>
                                    ))}
                                </div>
                              </div>

                              {/* Top Bowlers */}
                              <div>
                                <h4 className="text-lg font-bold mb-4 text-[#D4AF37]">🎯 Top Bowlers (Most Wickets)</h4>
                                <div className="space-y-3">
                                  {[...stats]
                                    .sort((a, b) => b.wickets - a.wickets)
                                    .slice(0, 5)
                                    .map((stat, index) => (
                                      <motion.div
                                        key={stat.playerId}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-[#0A0A0A] p-4 rounded-lg flex justify-between items-center border border-[#2a2a2a]"
                                      >
                                        <div className="flex items-center space-x-3">
                                          <span className={`text-2xl font-bold ${index === 0 ? 'text-[#D4AF37]' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-[#D4AF37]' : 'text-gray-500'}`}>
                                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                          </span>
                                          <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center overflow-hidden">
                                              {stat.image ? (
                                                <Image src={stat.image} alt={stat.name} width={32} height={32} className="rounded-full" />
                                              ) : (
                                                <span className="text-xs font-bold">{stat.name.charAt(0)}</span>
                                              )}
                                            </div>
                                            <span className="font-medium">{stat.name}</span>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <span className="font-bold block text-lg">{stat.wickets} wickets</span>
                                          <span className="text-sm text-gray-400">Econ: {stat.economy.toFixed(1)}</span>
                                        </div>
                                      </motion.div>
                                    ))}
                                </div>
                              </div>
                            </div>

                            {/* Milestones Section */}
                            <div className="mt-8 bg-[#0A0A0A] p-6 rounded-lg border border-[#2a2a2a]">
                              <h4 className="text-lg font-bold mb-4 text-[#D4AF37]">🏆 Team Milestones</h4>
                              <div className="grid md:grid-cols-3 gap-4 text-center">
                                <div>
                                  <div className="text-2xl font-bold text-[#D4AF37]">{stats.filter(p => p.centuries > 0).length}</div>
                                  <div className="text-sm text-gray-400">Centuries</div>
                                </div>
                                <div>
                                  <div className="text-2xl font-bold text-[#D4AF37]">{stats.filter(p => p.halfCenturies > 0).length}</div>
                                  <div className="text-sm text-gray-400">Half Centuries</div>
                                </div>
                                <div>
                                  <div className="text-2xl font-bold text-[#D4AF37]">{stats.filter(p => p.fiveWickets > 0).length}</div>
                                  <div className="text-sm text-gray-400">5-Wicket Hauls</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Gallery Tab */}
                    {activeTab === 'gallery' && (
                      <motion.div key="gallery" variants={tabVariants} initial="hidden" animate="visible" exit="exit">
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-2xl font-bold text-[#D4AF37]">Gallery</h2>
                          <motion.button
                            onClick={() => setShowUploadModal(true)}
                            className="bg-[#D4AF37] text-black font-semibold py-2 px-4 rounded-lg flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Upload
                          </motion.button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {gallery.map((item) => (
                            <div key={item._id} className="relative group">
                              <div className="aspect-square bg-[#0A0A0A] rounded-xl overflow-hidden">
                                <Image
                                  src={item.image || '/default-gallery.jpg'}
                                  alt={item.title || 'Gallery image'}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <div className="text-center p-3">
                                  <p className="font-medium mb-2">{item.title || 'Profile'}</p>
                                  <div className="flex space-x-2 justify-center">
                                    <button
                                      onClick={() => setImageToDelete(item)}
                                      className="text-red-500 hover:underline"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        {gallery.length === 0 && (
                          <div className="text-center py-16">
                            <svg className="w-16 h-16 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <h3 className="text-xl font-bold text-gray-400">No photos found</h3>
                            <p className="text-gray-500 mt-2">Upload some photos to get started</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Upload Modal */}
            <AnimatePresence>
              {showUploadModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
                  onClick={() => !isUploading && setShowUploadModal(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-gradient-to-b from-[#1a1a1a] to-black rounded-2xl overflow-hidden border border-[#2a2a2a] w-full max-w-2xl max-h-[90vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-6 overflow-y-auto">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-[#D4AF37]">Upload Photos</h2>
                        <button
                          onClick={() => !isUploading && setShowUploadModal(false)}
                          className="text-gray-400 hover:text-white"
                          disabled={isUploading}
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                          <select
                            value={uploadData.category}
                            onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                            className="w-full bg-[#2a2a2a] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#D4AF37] focus:outline-none"
                            disabled={isUploading}
                          >
                            {galleryCategories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Title (for all images)</label>
                          <input
                            type="text"
                            value={uploadData.title}
                            onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                            placeholder="Enter a title for your images"
                            className="w-full bg-[#2a2a2a] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#D4AF37] focus:outline-none"
                            disabled={isUploading}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Select Images</label>
                          <div className="flex items-center justify-center w-full">
                            <label
                              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${isUploading ? 'border-gray-600 cursor-not-allowed' : 'border-gray-600 hover:border-[#D4AF37]'
                                } bg-[#2a2a2a]`}
                            >
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                  />
                                </svg>
                                <p className="mb-2 text-sm text-gray-400">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 10MB each)</p>
                              </div>
                              <input
                                type="file"
                                multiple
                                className="hidden"
                                onChange={handleImageSelect}
                                accept="image/*"
                                disabled={isUploading}
                              />
                            </label>
                          </div>
                        </div>
                        {uploadData.previews.length > 0 && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-300 mb-3">Selected Images ({uploadData.previews.length})</h3>
                            <div className="grid grid-cols-3 gap-3">
                              {uploadData.previews.map((preview, index) => (
                                <div key={index} className="relative group">
                                  <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                                  {!isUploading && (
                                    <button
                                      onClick={() => removeImage(index)}
                                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <button
                          onClick={handleUpload}
                          disabled={isUploading || uploadData.images.length === 0}
                          className={`w-full py-3 px-4 rounded-lg font-semibold ${isUploading || uploadData.images.length === 0
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-[#D4AF37] hover:bg-[#c59a2f] text-black'
                            }`}
                        >
                          {isUploading ? (
                            <div className="flex items-center justify-center">
                              <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Uploading...
                            </div>
                          ) : (
                            `Upload ${uploadData.images.length} Image${uploadData.images.length !== 1 ? 's' : ''}`
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Delete Image Confirmation Modal */}
            <AnimatePresence>
              {imageToDelete && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    className="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-md"
                  >
                    <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Confirm Deletion</h3>
                    <p className="mb-6">
                      Are you sure you want to delete the image "{imageToDelete.title || 'Profile'}"? This action cannot be undone.
                    </p>
                    <div className="flex space-x-4 justify-end">
                      <button
                        onClick={() => setImageToDelete(null)}
                        className="px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          handleDeleteImage(imageToDelete._id);
                          setImageToDelete(null);
                        }}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                      >
                        Confirm Deletion
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Match Modals */}
            <NewMatchModal
              isOpen={showNewMatchModal}
              onClose={() => setShowNewMatchModal(false)}
              onAddMatch={handleAddMatch}
            />
            <NewMatchModal
              isOpen={showEditMatchModal}
              onClose={() => {
                setShowEditMatchModal(false);
                setEditingMatch(null);
              }}
              onAddMatch={handleUpdateMatch}
              editing={editingMatch}
              initialData={editingMatch}
            />

            {/* Delete Match Confirmation Modal */}
            <AnimatePresence>
              {matchToDelete && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    className="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-md"
                  >
                    <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Confirm Deletion</h3>
                    <p className="mb-6">
                      Are you sure you want to delete the match against {matchToDelete.opponent}? This action cannot be undone.
                    </p>
                    <div className="flex space-x-4 justify-end">
                      <button
                        onClick={() => setMatchToDelete(null)}
                        className="px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDeleteMatch(matchToDelete._id)}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                      >
                        Confirm Deletion
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            <PublishResultModal
              isOpen={showPublishResultModal}
              onClose={() => { setShowPublishResultModal(false); setSelectedMatchForResult(null); }}
              onPublishResult={handlePublishResult}
              match={selectedMatchForResult}
            />
          </div>
        </div>
      </div>
    </AdminProtected>
  );
};

export default AdminDashboard;