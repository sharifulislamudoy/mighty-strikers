'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';

// Add toast variants for animation
const toastVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 }
};

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

const PlayerDashboard = ({ player, playerDetails, onSaveDetails }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditing, setIsEditing] = useState(false);
    const [showSaveConfirm, setShowSaveConfirm] = useState(false);
    const [showImageUpload, setShowImageUpload] = useState(false);
    const [tempAge, setTempAge] = useState('');
    const [currentPlayer, setCurrentPlayer] = useState(player);
    const [currentPlayerDetails, setCurrentPlayerDetails] = useState(playerDetails);
    const [isSaving, setIsSaving] = useState(false);
    const [imageError, setImageError] = useState('');
    const [ageError, setAgeError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [isUpdatingAge, setIsUpdatingAge] = useState(false);
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        setCurrentPlayer(player);
    }, [player]);

    useEffect(() => {
        setCurrentPlayerDetails(playerDetails);
    }, [playerDetails]);

    const addToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            removeToast(id);
        }, 3000);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const handleInputChange = (field, value, isBatting = true) => {
        if (!isEditing) return;

        setCurrentPlayerDetails(prev => {
            const updatedDetails = { ...prev };

            if (isBatting) {
                switch (field) {
                    case 'matches':
                        updatedDetails.matches = parseInt(value) || 0;
                        break;
                    case 'innings':
                        updatedDetails.innings = parseInt(value) || 0;
                        updatedDetails.average = updatedDetails.innings > 0
                            ? parseFloat((updatedDetails.runs / updatedDetails.innings).toFixed(2))
                            : 0;
                        break;
                    case 'runs':
                        updatedDetails.runs = parseInt(value) || 0;
                        updatedDetails.average = updatedDetails.innings > 0
                            ? parseFloat((updatedDetails.runs / updatedDetails.innings).toFixed(2))
                            : 0;
                        break;
                    case 'strikeRate':
                        updatedDetails.strikeRate = parseFloat(value) || 0;
                        break;
                    case 'bestBatting':
                        updatedDetails.bestBatting = value;
                        break;
                    case 'halfCenturies':
                        updatedDetails.halfCenturies = parseInt(value) || 0;
                        break;
                    case 'centuries':
                        updatedDetails.centuries = parseInt(value) || 0;
                        break;
                    case 'thirties':
                        updatedDetails.thirties = parseInt(value) || 0;
                        break;
                    default:
                        break;
                }
            } else {
                switch (field) {
                    case 'bowlingInnings':
                        updatedDetails.bowlingInnings = parseInt(value) || 0;
                        break;
                    case 'wickets':
                        updatedDetails.wickets = parseInt(value) || 0;
                        break;
                    case 'economy':
                        updatedDetails.economy = parseFloat(value) || 0;
                        break;
                    case 'bestBowling':
                        updatedDetails.bestBowling = value;
                        break;
                    case 'threeWickets':
                        updatedDetails.threeWickets = parseInt(value) || 0;
                        break;
                    case 'fiveWickets':
                        updatedDetails.fiveWickets = parseInt(value) || 0;
                        break;
                    case 'maidens':
                        updatedDetails.maidens = parseInt(value) || 0;
                        break;
                    default:
                        break;
                }
            }

            return updatedDetails;
        });
    };

    const handleSave = async () => {
        setShowSaveConfirm(true);
    };

    const confirmSave = async (confirm) => {
        if (confirm) {
            setIsSaving(true);
            const success = await onSaveDetails(currentPlayerDetails);
            if (success) {
                setIsEditing(false);
                addToast('Stats saved successfully!', 'success');
            } else {
                addToast('Failed to save changes. Please try again.', 'error');
            }
            setIsSaving(false);
        }
        setShowSaveConfirm(false);
    };

    const cancelEdit = () => {
        setCurrentPlayerDetails(playerDetails);
        setIsEditing(false);
    };

    const handleImageChange = () => {
        setShowImageUpload(true);
        setImageError('');
        setSelectedFile(null);
        setFilePreview(null);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setImageError('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setImageError('File size must be less than 5MB');
            return;
        }

        setSelectedFile(file);
        setImageError('');

        const reader = new FileReader();
        reader.onload = (e) => {
            setFilePreview(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const uploadImageToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "react_unsigned");
        formData.append("cloud_name", "dohhfubsa");

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/dohhfubsa/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error("Image upload error:", error);
            throw error;
        }
    };

    const updatePlayerImage = async (imageUrl) => {
        try {
            const response = await fetch('/api/players/update-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: currentPlayer.username,
                    image: imageUrl
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update player image');
            }

            return await response.json();
        } catch (error) {
            console.error("Player image update error:", error);
            throw error;
        }
    };

    const addToGallery = async (imageUrl) => {
        try {
            const response = await fetch('/api/gallery/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: currentPlayer.username,
                    name: currentPlayer.name,
                    image: imageUrl
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add image to gallery');
            }

            return await response.json();
        } catch (error) {
            console.error("Gallery addition error:", error);
            throw error;
        }
    };

    const confirmImageChange = async () => {
        if (!selectedFile) {
            setImageError('Please select an image file');
            return;
        }

        setIsUploading(true);
        setImageError('');

        try {
            const imageUrl = await uploadImageToCloudinary(selectedFile);
            await updatePlayerImage(imageUrl);
            await addToGallery(imageUrl);
            setCurrentPlayer(prev => ({ ...prev, image: imageUrl }));
            setShowImageUpload(false);
            setSelectedFile(null);
            setFilePreview(null);
            addToast('Image updated successfully!', 'success');
        } catch (error) {
            console.error("Image change error:", error);
            setImageError('Failed to upload image. Please try again.');
            addToast('Failed to upload image. Please try again.', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const updatePlayerAgeInDatabase = async (age) => {
        try {
            const response = await fetch('/api/players/update-age', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: currentPlayer.username,
                    age: age
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update player age');
            }

            return await response.json();
        } catch (error) {
            console.error("Player age update error:", error);
            throw error;
        }
    };

    const handleAgeChange = () => {
        setTempAge(currentPlayer.age.toString());
        setAgeError('');
    };

    const confirmAgeChange = async () => {
        const ageNum = parseInt(tempAge);
        if (isNaN(ageNum) || ageNum < 15 || ageNum > 50) {
            setAgeError('Please enter a valid age (15-50)');
            return;
        }

        setIsUpdatingAge(true);
        setAgeError('');

        try {
            await updatePlayerAgeInDatabase(ageNum);
            setCurrentPlayer(prev => ({ ...prev, age: ageNum }));
            setTempAge('');
            addToast('Age updated successfully!', 'success');
        } catch (error) {
            console.error("Age change error:", error);
            setAgeError('Failed to update age. Please try again.');
            addToast('Failed to update age. Please try again.', 'error');
        } finally {
            setIsUpdatingAge(false);
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

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-[#0A0A0A] text-white overflow-hidden">
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {toasts.map(toast => (
                    <motion.div
                        key={toast.id}
                        variants={toastVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={`px-4 py-3 rounded-lg shadow-lg flex items-center ${toast.type === 'success'
                            ? 'bg-green-800 text-green-100'
                            : 'bg-red-800 text-red-100'
                            }`}
                    >
                        <span className="mr-2">
                            {toast.type === 'success' ? '✓' : '⚠'}
                        </span>
                        <span>{toast.message}</span>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="ml-4 text-lg font-bold"
                        >
                            ×
                        </button>
                    </motion.div>
                ))}
            </div>
            <div className='w-11/12 mx-auto mt-15 md:px-4'>
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
                                    disabled={isSaving}
                                    className="px-4 py-2 bg-green-600 font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </>
                        )}
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
                    >
                        <motion.div
                            variants={itemVariants}
                            className="lg:col-span-1 bg-gradient-to-b from-[#1a1a1a] to-black rounded-2xl border border-[#2a2a2a] shadow-lg overflow-hidden"
                        >
                            <div className="relative h-65">
                                <Image
                                    src={currentPlayer.image || '/Mighty Strikers_ Golden Power.png'}
                                    alt={currentPlayer.name}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70" />
                                <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-transparent opacity-10" />
                                <div className="absolute bottom-4 left-4">
                                    <h2 className="text-2xl font-bold">{currentPlayer.name}</h2>
                                    <p className="text-[#D4AF37]">{currentPlayer.category}</p>
                                </div>
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
                                            <p className="font-bold">{currentPlayer.age} years</p>
                                            <button
                                                onClick={handleAgeChange}
                                                className="w-5 h-5 bg-[#D4AF37] text-black rounded-full flex items-center justify-center text-xs font-bold hover:bg-yellow-500 transition-colors"
                                            >
                                                ✎
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center mt-4 p-3 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                                        <div className="flex items-center">
                                            <svg
                                                className="w-6 h-6 text-[#D4AF37] mr-2"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                            </svg>
                                            <span className="text-xl font-bold">{currentPlayer.likes || 0}</span>
                                            <span className="ml-2 text-gray-400">Likes</span>
                                        </div>
                                    </div>
                                </div>

                                {currentPlayer.profileUrl && (
                                    <div className="mb-4">
                                        <h3 className="text-[#D4AF37] font-bold mb-2">CrickHeroes Profile</h3>
                                        <a
                                            href={currentPlayer.profileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-3 py-1 bg-[#1a1a1a] border border-[#D4AF37] rounded-lg text-sm text-white hover:bg-[#D4AF37] hover:text-black transition-colors"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                            View on CrickHeroes
                                        </a>
                                    </div>
                                )}

                                <div className="mb-4">
                                    <h3 className="text-[#D4AF37] font-bold mb-2">Specialties</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {currentPlayer.specialties && currentPlayer.specialties.map((specialty, index) => (
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
                                            <p>{currentPlayer.battingStyle || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400">Bowling</p>
                                            <p>{currentPlayer.bowlingStyle || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <div className="lg:col-span-2">
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
                            </motion.div>

                            <motion.div
                                className={activeTab !== 'overview' ? 'hidden' : ''}
                                initial={{ opacity: 0, y: 20 }}
                                animate={activeTab === 'overview' ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                                                    {isEditing ? (
                                                        <input
                                                            type="number"
                                                            value={currentPlayerDetails.matches || 0}
                                                            onChange={(e) => handleInputChange('matches', e.target.value)}
                                                            className="w-20 bg-[#2a2a2a] border border-[#D4AF37] rounded-md px-2 py-1 text-white text-right"
                                                            min="0"
                                                        />
                                                    ) : (
                                                        <span className="font-bold text-lg">{currentPlayerDetails.matches || 0}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                                <span className="text-gray-400">Innings</span>
                                                <div className="flex items-center gap-2">
                                                    {isEditing ? (
                                                        <input
                                                            type="number"
                                                            value={currentPlayerDetails.innings || 0}
                                                            onChange={(e) => handleInputChange('innings', e.target.value)}
                                                            className="w-20 bg-[#2a2a2a] border border-[#D4AF37] rounded-md px-2 py-1 text-white text-right"
                                                            min="0"
                                                        />
                                                    ) : (
                                                        <span className="font-bold text-lg">{currentPlayerDetails.innings || 0}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                                <span className="text-gray-400">Runs</span>
                                                <div className="flex items-center gap-2">
                                                    {isEditing ? (
                                                        <input
                                                            type="number"
                                                            value={currentPlayerDetails.runs || 0}
                                                            onChange={(e) => handleInputChange('runs', e.target.value)}
                                                            className="w-20 bg-[#2a2a2a] border border-[#D4AF37] rounded-md px-2 py-1 text-white text-right"
                                                            min="0"
                                                        />
                                                    ) : (
                                                        <span className="font-bold text-lg">{currentPlayerDetails.runs || 0}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                                <span className="text-gray-400">Average</span>
                                                <span className="font-bold text-lg">{currentPlayerDetails.average || 0}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                                <span className="text-gray-400">Strike Rate</span>
                                                <div className="flex items-center gap-2">
                                                    {isEditing ? (
                                                        <input
                                                            type="number"
                                                            value={currentPlayerDetails.strikeRate || 0}
                                                            onChange={(e) => handleInputChange('strikeRate', e.target.value)}
                                                            className="w-20 bg-[#2a2a2a] border border-[#D4AF37] rounded-md px-2 py-1 text-white text-right"
                                                            step="0.1"
                                                            min="0"
                                                        />
                                                    ) : (
                                                        <span className="font-bold text-lg">{currentPlayerDetails.strikeRate || 0}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                                <span className="text-gray-400">Best Batting</span>
                                                <div className="flex items-center gap-2">
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            value={currentPlayerDetails.bestBatting || '0 (0)'}
                                                            onChange={(e) => handleInputChange('bestBatting', e.target.value)}
                                                            className="w-32 bg-[#2a2a2a] border border-[#D4AF37] rounded-md px-2 py-1 text-white text-right"
                                                        />
                                                    ) : (
                                                        <span className="font-bold">{currentPlayerDetails.bestBatting || '0 (0)'}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                                <span className="text-gray-400">50s</span>
                                                <div className="flex items-center gap-2">
                                                    {isEditing ? (
                                                        <input
                                                            type="number"
                                                            value={currentPlayerDetails.halfCenturies || 0}
                                                            onChange={(e) => handleInputChange('halfCenturies', e.target.value)}
                                                            className="w-20 bg-[#2a2a2a] border border-[#D4AF37] rounded-md px-2 py-1 text-white text-right"
                                                            min="0"
                                                        />
                                                    ) : (
                                                        <span className="font-bold text-lg">{currentPlayerDetails.halfCenturies || 0}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                                <span className="text-gray-400">100s</span>
                                                <div className="flex items-center gap-2">
                                                    {isEditing ? (
                                                        <input
                                                            type="number"
                                                            value={currentPlayerDetails.centuries || 0}
                                                            onChange={(e) => handleInputChange('centuries', e.target.value)}
                                                            className="w-20 bg-[#2a2a2a] border border-[#D4AF37] rounded-md px-2 py-1 text-white text-right"
                                                            min="0"
                                                        />
                                                    ) : (
                                                        <span className="font-bold text-lg">{currentPlayerDetails.centuries || 0}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center py-2">
                                                <span className="text-gray-400">30s</span>
                                                <div className="flex items-center gap-2">
                                                    {isEditing ? (
                                                        <input
                                                            type="number"
                                                            value={currentPlayerDetails.thirties || 0}
                                                            onChange={(e) => handleInputChange('thirties', e.target.value)}
                                                            className="w-20 bg-[#2a2a2a] border border-[#D4AF37] rounded-md px-2 py-1 text-white text-right"
                                                            min="0"
                                                        />
                                                    ) : (
                                                        <span className="font-bold text-lg">{currentPlayerDetails.thirties || 0}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        variants={statItemVariants}
                                        className="bg-gradient-to-b from-[#1a1a1a] to-black p-6 rounded-2xl border border-[#2a2a2a] shadow-lg"
                                        whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(212, 175, 55, 0.15)" }}
                                    >
                                        <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Bowling Statistics</h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                                <span className="text-gray-400">Innings</span>
                                                <div className="flex items-center gap-2">
                                                    {isEditing ? (
                                                        <input
                                                            type="number"
                                                            value={currentPlayerDetails.bowlingInnings || 0}
                                                            onChange={(e) => handleInputChange('bowlingInnings', e.target.value, false)}
                                                            className="w-20 bg-[#2a2a2a] border border-[#D4AF37] rounded-md px-2 py-1 text-white text-right"
                                                            min="0"
                                                        />
                                                    ) : (
                                                        <span className="font-bold text-lg">{currentPlayerDetails.bowlingInnings || 0}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                                <span className="text-gray-400">Wickets</span>
                                                <div className="flex items-center gap-2">
                                                    {isEditing ? (
                                                        <input
                                                            type="number"
                                                            value={currentPlayerDetails.wickets || 0}
                                                            onChange={(e) => handleInputChange('wickets', e.target.value, false)}
                                                            className="w-20 bg-[#2a2a2a] border border-[#D4AF37] rounded-md px-2 py-1 text-white text-right"
                                                            min="0"
                                                        />
                                                    ) : (
                                                        <span className="font-bold text-lg">{currentPlayerDetails.wickets || 0}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                                <span className="text-gray-400">Economy</span>
                                                <div className="flex items-center gap-2">
                                                    {isEditing ? (
                                                        <input
                                                            type="number"
                                                            value={currentPlayerDetails.economy || 0}
                                                            onChange={(e) => handleInputChange('economy', e.target.value, false)}
                                                            className="w-20 bg-[#2a2a2a] border border-[#D4AF37] rounded-md px-2 py-1 text-white text-right"
                                                            step="0.1"
                                                            min="0"
                                                        />
                                                    ) : (
                                                        <span className="font-bold text-lg">{currentPlayerDetails.economy || 0}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                                <span className="text-gray-400">Best Bowling</span>
                                                <div className="flex items-center gap-2">
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            value={currentPlayerDetails.bestBowling || '0/0'}
                                                            onChange={(e) => handleInputChange('bestBowling', e.target.value, false)}
                                                            className="w-24 bg-[#2a2a2a] border border-[#D4AF37] rounded-md px-2 py-1 text-white text-right"
                                                        />
                                                    ) : (
                                                        <span className="font-bold text-lg">{currentPlayerDetails.bestBowling || '0/0'}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                                <span className="text-gray-400">3 Wickets</span>
                                                <div className="flex items-center gap-2">
                                                    {isEditing ? (
                                                        <input
                                                            type="number"
                                                            value={currentPlayerDetails.threeWickets || 0}
                                                            onChange={(e) => handleInputChange('threeWickets', e.target.value, false)}
                                                            className="w-20 bg-[#2a2a2a] border border-[#D4AF37] rounded-md px-2 py-1 text-white text-right"
                                                            min="0"
                                                        />
                                                    ) : (
                                                        <span className="font-bold text-lg">{currentPlayerDetails.threeWickets || 0}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-[#2a2a2a]">
                                                <span className="text-gray-400">5 Wickets</span>
                                                <div className="flex items-center gap-2">
                                                    {isEditing ? (
                                                        <input
                                                            type="number"
                                                            value={currentPlayerDetails.fiveWickets || 0}
                                                            onChange={(e) => handleInputChange('fiveWickets', e.target.value, false)}
                                                            className="w-20 bg-[#2a2a2a] border border-[#D4AF37] rounded-md px-2 py-1 text-white text-right"
                                                            min="0"
                                                        />
                                                    ) : (
                                                        <span className="font-bold text-lg">{currentPlayerDetails.fiveWickets || 0}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center py-2">
                                                <span className="text-gray-400">Maidens</span>
                                                <div className="flex items-center gap-2">
                                                    {isEditing ? (
                                                        <input
                                                            type="number"
                                                            value={currentPlayerDetails.maidens || 0}
                                                            onChange={(e) => handleInputChange('maidens', e.target.value, false)}
                                                            className="w-20 bg-[#2a2a2a] border border-[#D4AF37] rounded-md px-2 py-1 text-white text-right"
                                                            min="0"
                                                        />
                                                    ) : (
                                                        <span className="font-bold text-lg">{currentPlayerDetails.maidens || 0}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>

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
                                disabled={isSaving}
                                className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                {isSaving ? 'Saving...' : 'Yes, Save'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {showImageUpload && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#1A1A1A] p-6 rounded-2xl border border-[#D4AF37] w-full max-w-md"
                    >
                        <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Change Profile Image</h3>
                        {filePreview ? (
                            <div className="mb-4 flex justify-center">
                                <img
                                    src={filePreview}
                                    alt="Preview"
                                    className="w-70 h-55 object-cover rounded-lg border-2 border-[#D4AF37]"
                                />
                            </div>
                        ) : (
                            <div className="mb-4 flex justify-center">
                                <div className="w-48 h-36 rounded-lg bg-[#2A2A2A] flex items-center justify-center border-2 border-dashed border-[#D4AF37]">
                                    <svg
                                        className="w-12 h-12 text-gray-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        />
                                    </svg>
                                </div>
                            </div>
                        )}
                        <label className="block mb-4">
                            <div className="px-4 py-2 bg-[#2A2A2A] border border-[#D4AF37] rounded-lg text-center cursor-pointer hover:bg-[#3A3A3A] transition-colors text-[#D4AF37]">
                                Select Image
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </label>
                        {imageError && (
                            <div className="text-red-400 text-sm mb-4">{imageError}</div>
                        )}
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowImageUpload(false);
                                    setImageError('');
                                    setSelectedFile(null);
                                    setFilePreview(null);
                                }}
                                className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                                disabled={isUploading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmImageChange}
                                className="px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-yellow-500 transition-colors flex items-center justify-center min-w-[120px]"
                                disabled={isUploading || !selectedFile}
                            >
                                {isUploading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Uploading...
                                    </>
                                ) : 'Upload Image'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

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
                                min="15"
                                max="50"
                            />
                            {ageError && <p className="text-red-400 text-sm mt-2">{ageError}</p>}
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setTempAge('')}
                                className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                                disabled={isUpdatingAge}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmAgeChange}
                                className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center min-w-[100px]"
                                disabled={isUpdatingAge}
                            >
                                {isUpdatingAge ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </>
                                ) : 'Change Age'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default PlayerDashboard;