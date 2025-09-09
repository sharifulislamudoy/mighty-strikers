'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const NewMatchModal = ({ isOpen, onClose, onAddMatch }) => {
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

    const [isUploading, setIsUploading] = useState(false);

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
            // First upload logo to Cloudinary if exists
            let logoUrl = '';
            if (formData.opponentLogo) {
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

            // Prepare match data
            const matchData = {
                opponent: formData.opponent,
                opponentLogo: logoUrl,
                overs: parseInt(formData.overs),
                venue: formData.venue,
                date: formData.date,
                time: formData.time,
                status: formData.status,
                type: formData.type,
                selectedPlayers: formData.selectedPlayers
            };

            // Save to backend
            const response = await fetch('/api/matches', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(matchData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create match');
            }

            const newMatch = await response.json();
            onAddMatch(newMatch);
            onClose();

            // Reset form
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

        } catch (error) {
            console.error('Error creating match:', error);
            // You might want to add toast notification here
            alert(`Error: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gradient-to-b from-[#1a1a1a] to-black rounded-2xl overflow-hidden border border-[#2a2a2a] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-[#D4AF37]">Schedule New Match</h2>
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
                                {formData.logoPreview && (
                                    <div className="mt-2">
                                        <img src={formData.logoPreview} alt="Logo preview" className="w-16 h-16 object-contain rounded" />
                                    </div>
                                )}
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
                                disabled={isUploading}
                                className="px-6 py-2 rounded-lg bg-[#D4AF37] text-black font-semibold hover:bg-[#c59a2f] disabled:opacity-50"
                            >
                                {isUploading ? 'Creating Match...' : 'Create Match'}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default NewMatchModal;