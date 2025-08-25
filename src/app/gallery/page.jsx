'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';

const GalleryPage = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedImage, setSelectedImage] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [loadedImages, setLoadedImages] = useState({});

    // Check screen size
    useEffect(() => {
        const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
        if (typeof window !== 'undefined') {
            checkIsMobile();
            window.addEventListener('resize', checkIsMobile);
        }
        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', checkIsMobile);
            }
        };
    }, []);

    // Predefined particle positions
    const particlePositions = useMemo(() => [
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
    ], []);

    // Handle image load
    const handleImageLoad = (id) => {
        setLoadedImages(prev => ({ ...prev, [id]: true }));
    };

    // Gallery categories
    const galleryCategories = [
        { id: 'all', name: 'All Photos' },
        { id: 'matches', name: 'Match Moments' },
        { id: 'training', name: 'Training Sessions' },
        { id: 'team', name: 'Team Photos' },
        { id: 'fans', name: 'Fan Moments' },
        { id: 'awards', name: 'Trophies & Awards' },
    ];

    // Gallery images data with different aspect ratios
    const galleryImages = [
        {
            id: 1,
            category: 'matches',
            title: 'Championship Victory',
            description: 'Celebrating our tournament win against Royal Challengers',
            date: 'October 15, 2023',
            aspect: 'square',
            image: '/gallery/match1.jpg'
        },
        {
            id: 2,
            category: 'training',
            title: 'Net Practice',
            description: 'Alex Johnson perfecting his cover drive',
            date: 'September 5, 2023',
            aspect: 'portrait',
            image: '/gallery/training1.jpg'
        },
        {
            id: 3,
            category: 'team',
            title: 'Team Photo 2023',
            description: 'Official team photo for the 2023 season',
            date: 'August 20, 2023',
            aspect: 'landscape',
            image: '/gallery/team1.jpg'
        },
        {
            id: 4,
            category: 'matches',
            title: 'Final Over Thriller',
            description: 'The tense final over against Thunder Bolts',
            date: 'October 12, 2023',
            aspect: 'landscape',
            image: '/gallery/match2.jpg'
        },
        {
            id: 5,
            category: 'fans',
            title: 'Fan Support',
            description: 'Our amazing fans cheering us on at the stadium',
            date: 'October 10, 2023',
            aspect: 'portrait',
            image: '/gallery/fans1.jpg'
        },
        {
            id: 6,
            category: 'awards',
            title: 'Player of the Tournament',
            description: 'Alex Johnson receiving the Player of the Tournament award',
            date: 'October 16, 2023',
            aspect: 'square',
            image: '/gallery/awards1.jpg'
        },
        {
            id: 7,
            category: 'training',
            title: 'Bowling Drill',
            description: 'James Wilson working on his yorkers',
            date: 'September 12, 2023',
            aspect: 'landscape',
            image: '/gallery/training2.jpg'
        },
        {
            id: 8,
            category: 'matches',
            title: 'Victory Celebration',
            description: 'Team celebrating after qualifying for finals',
            date: 'October 5, 2023',
            aspect: 'portrait',
            image: '/gallery/match3.jpg'
        },
        {
            id: 9,
            category: 'team',
            title: 'Team Bonding',
            description: 'Team dinner after an important victory',
            date: 'September 28, 2023',
            aspect: 'landscape',
            image: '/gallery/team2.jpg'
        },
        {
            id: 10,
            category: 'awards',
            title: 'Man of the Match',
            description: 'David Clark receiving Man of the Match award',
            date: 'October 8, 2023',
            aspect: 'square',
            image: '/gallery/awards2.jpg'
        },
        {
            id: 11,
            category: 'fans',
            title: 'Junior Fans',
            description: 'Inspiring the next generation of cricketers',
            date: 'October 3, 2023',
            aspect: 'portrait',
            image: '/gallery/fans2.jpg'
        },
        {
            id: 12,
            category: 'training',
            title: 'Fielding Practice',
            description: 'Team working on fielding drills',
            date: 'September 18, 2023',
            aspect: 'landscape',
            image: '/gallery/training3.jpg'
        }
    ];

    const filteredImages = activeCategory === 'all' 
        ? galleryImages 
        : galleryImages.filter(image => image.category === activeCategory);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.1
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

    // Get column class based on aspect ratio
    const getColumnClass = (aspect) => {
        switch (aspect) {
            case 'portrait':
                return 'md:row-span-2';
            case 'landscape':
                return 'md:col-span-2';
            default:
                return '';
        }
    };

    return (
        <div className='min-h-screen bg-gradient-to-b from-black to-[#0A0A0A] text-white'>
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
                    <motion.div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37] opacity-10"
                        initial={{ width: 0, height: 0 }}
                        animate={{ width: 400, height: 400 }}
                        transition={{ duration: 2, delay: 0.3 }}
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
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            <span className="text-white">Team </span>
                            <span className="text-[#D4AF37]">Gallery</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                            Relive the greatest moments, celebrations, and behind-the-scenes action of the Mighty Strikers.
                        </p>
                    </motion.div>

                    {/* Mobile Filter Toggle Button */}
                    <div className="md:hidden flex justify-center mb-6">
                        <motion.button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center gap-2 bg-[#D4AF37] text-black font-semibold py-2 px-4 rounded-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span>Filter Photos</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                        </motion.button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Filter Sidebar */}
                        <AnimatePresence>
                            {(isFilterOpen || !isMobile) && (
                                <motion.div
                                    initial={isMobile ? { x: -300, opacity: 0 } : { opacity: 1 }}
                                    animate={isMobile ? { x: 0, opacity: 1 } : { opacity: 1 }}
                                    exit={isMobile ? { x: -300, opacity: 0 } : { opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className={`md:sticky md:top-28 md:h-fit ${isMobile ? 'fixed inset-y-0 left-0 z-50 w-64 bg-[#0A0A0A] p-6 overflow-y-auto' : 'md:w-1/4'}`}
                                >
                                    {/* Close button for mobile */}
                                    {isMobile && (
                                        <button
                                            onClick={() => setIsFilterOpen(false)}
                                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}

                                    <motion.div
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className={isMobile ? "" : "pr-4"}
                                    >
                                        <h2 className="text-2xl font-bold mb-6 text-[#D4AF37] border-b border-[#D4AF37] pb-2">
                                            Filter Gallery
                                        </h2>

                                        <div className="space-y-3">
                                            {galleryCategories.map((category) => (
                                                <motion.button
                                                    key={category.id}
                                                    variants={itemVariants}
                                                    onClick={() => {
                                                        setActiveCategory(category.id);
                                                        if (isMobile) setIsFilterOpen(false);
                                                    }}
                                                    className={`w-full text-left py-3 px-4 rounded-lg transition-all duration-300 ${activeCategory === category.id
                                                            ? 'bg-[#D4AF37] text-black font-bold'
                                                            : 'bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]'
                                                        }`}
                                                    whileHover={{ x: 5 }}
                                                >
                                                    {category.name}
                                                </motion.button>
                                            ))}
                                        </div>

                                        {/* Gallery Stats in sidebar for desktop */}
                                        {!isMobile && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.5 }}
                                                className="mt-8 bg-gradient-to-r from-[#0A0A0A] to-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a]"
                                            >
                                                <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Gallery Stats</h3>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Total Photos</span>
                                                        <span className="font-bold">{galleryImages.length}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Match Moments</span>
                                                        <span className="font-bold">{galleryImages.filter(img => img.category === 'matches').length}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Training Sessions</span>
                                                        <span className="font-bold">{galleryImages.filter(img => img.category === 'training').length}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Team Photos</span>
                                                        <span className="font-bold">{galleryImages.filter(img => img.category === 'team').length}</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Overlay for mobile filter */}
                        {isMobile && isFilterOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black bg-opacity-70 z-40"
                                onClick={() => setIsFilterOpen(false)}
                            />
                        )}

                        {/* Main Content - Gallery Grid */}
                        <div className="flex-1">
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[minmax(200px,auto)]"
                            >
                                <AnimatePresence mode="popLayout">
                                    {filteredImages.map((image) => (
                                        <motion.div
                                            key={image.id}
                                            layout
                                            variants={itemVariants}
                                            className={`relative group cursor-pointer overflow-hidden rounded-xl ${getColumnClass(image.aspect)}`}
                                            whileHover={{ scale: 1.02 }}
                                            onClick={() => setSelectedImage(image)}
                                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                        >
                                            {/* Skeleton loader */}
                                            {!loadedImages[image.id] && (
                                                <div className="absolute inset-0 bg-[#2a2a2a] animate-pulse z-10" />
                                            )}

                                            <Image
                                                src={image.image || '/default-gallery.jpg'}
                                                alt={image.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                onLoad={() => handleImageLoad(image.id)}
                                            />
                                            
                                            {/* Overlay with info */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                                <h3 className="font-bold text-white text-sm md:text-base">{image.title}</h3>
                                                <p className="text-gray-300 text-xs md:text-sm truncate">{image.description}</p>
                                                <p className="text-[#D4AF37] text-xs mt-1">{image.date}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>

                            {/* Empty state */}
                            {filteredImages.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-16"
                                >
                                    <svg className="w-16 h-16 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <h3 className="text-xl font-bold text-gray-400">No photos found</h3>
                                    <p className="text-gray-500 mt-2">Try selecting a different category</p>
                                </motion.div>
                            )}

                            {/* Upload Section */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="mt-12 bg-gradient-to-r from-[#0A0A0A] to-[#1a1a1a] rounded-2xl p-8 border border-[#2a2a2a]"
                            >
                                <h2 className="text-3xl font-bold mb-4 text-center text-[#D4AF37]">Share Your Photos</h2>
                                <p className="text-xl text-gray-300 mb-8 text-center max-w-2xl mx-auto">
                                    Have photos from our matches or events? Share them with the Mighty Strikers community.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <motion.label
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-[#D4AF37] text-black font-bold py-3 px-8 rounded-full text-lg text-center cursor-pointer"
                                    >
                                        Upload Photos
                                        <input type="file" multiple className="hidden" />
                                    </motion.label>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="border border-[#D4AF37] text-[#D4AF37] font-bold py-3 px-8 rounded-full text-lg"
                                    >
                                        View Guidelines
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Detail Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
                            onClick={() => setSelectedImage(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-gradient-to-b from-[#1a1a1a] to-black rounded-2xl overflow-hidden border border-[#2a2a2a] w-full max-w-4xl max-h-[90vh] flex flex-col"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="relative h-96 md:h-[500px]">
                                    <Image
                                        src={selectedImage.image || '/default-gallery.jpg'}
                                        alt={selectedImage.title}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold">{selectedImage.title}</h3>
                                            <p className="text-[#D4AF37]">{selectedImage.date}</p>
                                        </div>
                                        <button onClick={() => setSelectedImage(null)} className="text-gray-400 hover:text-white">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    
                                    <p className="text-gray-300 mb-6">{selectedImage.description}</p>
                                    
                                    <div className="flex items-center gap-4">
                                        <button className="flex items-center gap-2 text-gray-400 hover:text-white">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                            </svg>
                                            <span>Download</span>
                                        </button>
                                        <button className="flex items-center gap-2 text-gray-400 hover:text-white">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                            </svg>
                                            <span>Share</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GalleryPage;