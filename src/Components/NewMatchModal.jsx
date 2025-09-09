'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';

const NewMatchModal = ({ isOpen, onClose, onAddMatch, editing = false, initialData = null }) => {
    const { data: session } = useSession();
    const [formData, setFormData] = useState({
        opponent: '',
        opponentLogo: null,
        logoPreview: null,
        overs: '',
        venue: '',
        date: '',
        time: '',
        status: 'scheduled',
        type: 'T20',
        selectedPlayers: []
    });
    const [availablePlayers, setAvailablePlayers] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [initialFormData, setInitialFormData] = useState(null);

    // Initialize form data for editing
    useEffect(() => {
        if (isOpen && editing && initialData) {
            setFormData({
                opponent: initialData.opponent || '',
                opponentLogo: null, // Will keep existing URL
                logoPreview: initialData.opponentLogo ? initialData.opponentLogo : null,
                overs: initialData.overs || '',
                venue: initialData.venue || '',
                date: initialData.date || '',
                time: initialData.time || '',
                status: initialData.status || 'scheduled',
                type: initialData.type || 'T20',
                selectedPlayers: initialData.selectedPlayers || [] // Already _ids from handleEditMatch
            });
        } else if (isOpen && !editing) {
            // Reset for new match
            setFormData({
                opponent: '',
                opponentLogo: null,
                logoPreview: null,
                overs: '',
                venue: '',
                date: '',
                time: '',
                status: 'scheduled',
                type: 'T20',
                selectedPlayers: []
            });
            setInitialFormData(formData);
            setSearchTerm('');
        }
    }, [isOpen, editing, initialData]);

    // Fetch approved players
    useEffect(() => {
        if (isOpen && session) {
            const fetchPlayers = async () => {
                try {
                    const response = await fetch('/api/players');
                    if (response.ok) {
                        const playersData = await response.json();
                        const approvedPlayers = playersData.filter(player => player.status === 'approved');
                        setAvailablePlayers(approvedPlayers);
                    }
                } catch (error) {
                    console.error('Error fetching players:', error);
                }
            };
            fetchPlayers();
        }
    }, [isOpen, session]);

    const filteredPlayers = availablePlayers.filter(player =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePlayerToggle = (playerId) => {
        setFormData(prev => ({
            ...prev,
            selectedPlayers: prev.selectedPlayers.includes(playerId)
                ? prev.selectedPlayers.filter(id => id !== playerId)
                : [...prev.selectedPlayers, playerId]
        }));
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData(prev => ({
                    ...prev,
                    opponentLogo: file,
                    logoPreview: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            let logoUrl = '';
            if (editing && initialData.opponentLogo && !(formData.opponentLogo instanceof File)) {
                // Keep existing logo if no new file uploaded during edit
                logoUrl = initialData.opponentLogo;
            } else if (formData.opponentLogo) {
                // Upload new logo
                const logoFormData = new FormData();
                logoFormData.append('file', formData.opponentLogo);
                logoFormData.append('upload_preset', 'react_unsigned');

                const uploadResponse = await fetch(
                    `https://api.cloudinary.com/v1_1/dohhfubsa/image/upload`,
                    {
                        method: 'POST',
                        body: logoFormData
                    }
                );

                if (!uploadResponse.ok) {
                    throw new Error('Failed to upload logo to Cloudinary');
                }

                const uploadData = await uploadResponse.json();
                logoUrl = uploadData.secure_url;
            }

            // Get selected players data (usernames)
            let selectedPlayersUsernames = [];
            if (formData.selectedPlayers && formData.selectedPlayers.length > 0) {
                // Get usernames from the selected player IDs
                selectedPlayersUsernames = formData.selectedPlayers.map(playerId => {
                    const player = availablePlayers.find(p => p._id === playerId);
                    return player ? player.username : null;
                }).filter(Boolean);
            }

            // Prepare match data
            const matchData = {
                opponent: formData.opponent,
                opponentLogo: logoUrl || (editing && initialData.opponentLogo) || '',
                overs: parseInt(formData.overs),
                venue: formData.venue,
                date: formData.date,
                time: formData.time,
                status: formData.status,
                type: formData.type,
                selectedPlayers: selectedPlayersUsernames,
                selectedPlayersData: formData.selectedPlayers.map(playerId => {
                    const player = availablePlayers.find(p => p._id === playerId);
                    return player ? { name: player.name, username: player.username } : null;
                }).filter(Boolean)
            };

            // For edit, add matchId
            if (editing && initialData._id) {
                matchData.matchId = initialData._id;
            }

            // Save/Update to backend
            const method = editing ? 'PUT' : 'POST';
            const response = await fetch('/api/matches', {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...matchData, matchId: editing ? initialData._id : undefined }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || (editing ? 'Failed to update match' : 'Failed to create match'));
            }

            const savedMatch = await response.json();
            onAddMatch(savedMatch); // Reuse for both add and update
            onClose();

            // Reset form for new match
            if (!editing) {
                setFormData({
                    opponent: '',
                    opponentLogo: null,
                    logoPreview: null,
                    overs: '',
                    venue: '',
                    date: '',
                    time: '',
                    status: 'scheduled',
                    type: 'T20',
                    selectedPlayers: []
                });
                setSearchTerm('');
            }

        } catch (error) {
            console.error(`Error ${editing ? 'updating' : 'creating'} match:`, error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    if (!isOpen) return null;

    const modalTitle = editing ? 'Edit Match' : 'Schedule New Match';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gradient-to-b from-[#1a1a1a] to-black rounded-2xl overflow-hidden border border-[#2a2a2a] w-full max-w-4xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 overflow-y-auto flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-[#D4AF37]">{modalTitle}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white"
                            disabled={isUploading}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Opponent Team Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.opponent}
                                    onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
                                    className="w-full bg-[#2a2a2a] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#D4AF37] focus:outline-none"
                                    placeholder="Enter opponent team name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Opponent Team Logo</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="w-full bg-[#2a2a2a] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#D4AF37] focus:outline-none"
                                />

                                {/* Show only one preview at a time */}
                                {formData.logoPreview ? (
                                    <div className="mt-2">
                                        <img src={formData.logoPreview} alt="Logo preview" className="w-16 h-16 object-contain rounded" />
                                        <p className="text-xs text-gray-400 mt-1">New logo</p>
                                    </div>
                                ) : editing && initialData.opponentLogo ? (
                                    <div className="mt-2">
                                        <img src={initialData.opponentLogo} alt="Current logo" className="w-16 h-16 object-contain rounded" />
                                        <p className="text-xs text-gray-400 mt-1">Current logo</p>
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Overs</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.overs}
                                    onChange={(e) => setFormData({ ...formData, overs: e.target.value })}
                                    className="w-full bg-[#2a2a2a] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#D4AF37] focus:outline-none"
                                    placeholder="e.g., 20"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Match Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full bg-[#2a2a2a] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#D4AF37] focus:outline-none"
                                >
                                    <option value="T20">T20</option>
                                    <option value="ODI">One Day</option>
                                    <option value="Test">Test</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Venue</label>
                            <input
                                type="text"
                                required
                                value={formData.venue}
                                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                                className="w-full bg-[#2a2a2a] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#D4AF37] focus:outline-none"
                                placeholder="Enter venue"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full bg-[#2a2a2a] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#D4AF37] focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
                                <input
                                    type="time"
                                    required
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    className="w-full bg-[#2a2a2a] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#D4AF37] focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Player Selection Section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Select Players for Match</label>
                            <div className="space-y-3">
                                {/* Search Input */}
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search players by name or category..."
                                    className="w-full bg-[#2a2a2a] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#D4AF37] focus:outline-none"
                                />

                                {/* Players List */}
                                <div className="max-h-48 overflow-y-auto space-y-2">
                                    {filteredPlayers.map((player) => (
                                        <div key={player._id} className="flex items-center justify-between p-3 bg-[#0A0A0A] rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                                                    {player.image ? (
                                                        <img src={player.image} alt={player.name} className="w-8 h-8 rounded-full object-cover" />
                                                    ) : (
                                                        <span className="text-sm font-bold">{player.name.charAt(0)}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{player.name}</div>
                                                    <div className="text-xs text-gray-400">{player.category} • {player.username}</div>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.selectedPlayers.includes(player._id)}
                                                    onChange={() => handlePlayerToggle(player._id)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                {/* Selected Players Count */}
                                {formData.selectedPlayers.length > 0 && (
                                    <div className="text-sm text-[#D4AF37] font-medium">
                                        {formData.selectedPlayers.length} player{formData.selectedPlayers.length !== 1 ? 's' : ''} selected
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full bg-[#2a2a2a] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#D4AF37] focus:outline-none"
                            >
                                <option value="scheduled">Scheduled</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div className="flex space-x-4 justify-end pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 rounded-lg border border-gray-600 hover:bg-gray-800"
                                disabled={isUploading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isUploading || formData.selectedPlayers.length === 0 ||
                                    (editing && JSON.stringify(formData) === JSON.stringify(initialFormData))}
                                className="px-6 py-2 rounded-lg bg-[#D4AF37] text-black font-semibold hover:bg-[#c59a2f] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isUploading ? (editing ? 'Updating Match...' : 'Creating Match...') : (editing ? 'Update Match' : 'Create Match')}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default NewMatchModal;