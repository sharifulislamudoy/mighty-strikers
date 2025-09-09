'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { handleDownload } from '@/utils/downloadImage';
import { useSession } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast';

const GalleryPage = () => {
    const { data: session } = useSession();
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedImage, setSelectedImage] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [loadedImages, setLoadedImages] = useState({});
    const [galleryImages, setGalleryImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [likedImages, setLikedImages] = useState({});
    const [uploadData, setUploadData] = useState({
        category: 'profile',
        title: '',
        images: [],
        previews: []
    });
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedLikes = localStorage.getItem('likedImages');
            if (storedLikes) {
                setLikedImages(JSON.parse(storedLikes));
            }
        }
    }, []);

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

    // Fetch gallery images from API
    useEffect(() => {
        const fetchGalleryImages = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/gallery');
                const data = await response.json();

                if (response.ok) {
                    // Ensure each image has aspect property (you may need to compute this in backend or here)
                    const imagesWithAspect = (data.images || []).map(img => ({
                        ...img,
                        aspect: img.aspect || 'square' // Default to square if not set
                    }));
                    setGalleryImages(imagesWithAspect);
                } else {
                    console.error('Failed to fetch gallery images:', data.message);
                    toast.error('Failed to load gallery images');
                }
            } catch (error) {
                console.error('Error fetching gallery images:', error);
                toast.error('Error loading gallery images');
            } finally {
                setIsLoading(false);
            }
        };

        fetchGalleryImages();
    }, []);

    // Handle like functionality
    const handleLike = async (imageId) => {
        // Check if image has already been liked (using localStorage)
        if (likedImages[imageId]) {
            toast.error('You have already liked this image');
            return;
        }

        try {
            const response = await fetch('/api/gallery/like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ imageId }),
            });

            const data = await response.json();

            if (response.ok) {
                // Update local state
                setGalleryImages(prev => prev.map(img =>
                    img._id === imageId ? { ...img, likes: (img.likes || 0) + 1 } : img
                ));

                // Update liked images in localStorage
                const newLikedImages = { ...likedImages, [imageId]: true };
                setLikedImages(newLikedImages);
                localStorage.setItem('likedImages', JSON.stringify(newLikedImages));

                toast.success('Image liked!');
            } else {
                toast.error(data.message || 'Failed to like image');
            }
        } catch (error) {
            console.error('Error liking image:', error);
            toast.error('Error liking image');
        }
    };

    // Handle image selection for upload
    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const newPreviews = [];
        const newImages = [];

        files.forEach(file => {
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                newPreviews.push(e.target.result);
                if (newPreviews.length === files.length) {
                    setUploadData(prev => ({
                        ...prev,
                        previews: [...prev.previews, ...newPreviews],
                        images: [...prev.images, ...newImages]
                    }));
                }
            };
            reader.readAsDataURL(file);
            newImages.push(file);
        });
    };

    // Remove selected image from upload
    const removeImage = (index) => {
        setUploadData(prev => ({
            ...prev,
            previews: prev.previews.filter((_, i) => i !== index),
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    // Handle upload to Cloudinary and then to backend
    const handleUpload = async () => {
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
                previews: []
            });

            // Refresh gallery
            const response = await fetch('/api/gallery');
            const data = await response.json();
            if (response.ok) {
                // Ensure aspect for new images too
                const imagesWithAspect = (data.images || []).map(img => ({
                    ...img,
                    aspect: img.aspect || 'square'
                }));
                setGalleryImages(imagesWithAspect);
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload images. Please try again.', { id: uploadToast });
        } finally {
            setIsUploading(false);
        }
    };

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

    const handleShare = async (url, title = "Check this out!") => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text: "Have a look at this image",
                    url,
                });
                toast.success('Shared successfully!');
            } catch (err) {
                if (err.name !== 'AbortError') {
                    toast.error('Failed to share');
                }
            }
        } else {
            toast.error('Sharing not supported on this browser');
        }
    };

    // Gallery categories
    const galleryCategories = [
        { id: 'all', name: 'All Photos' },
        { id: 'matches', name: 'Match Moments' },
        { id: 'winning', name: 'Winning Moments' },
        { id: 'team', name: 'Team Photos' },
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

    // Updated getColumnClass to handle spans and aspect ratios properly
    // Now it returns classes for both span and aspect
    const getGridClasses = (aspect) => {
        let spanClass = '';
        let aspectClass = 'aspect-square'; // default

        switch (aspect) {
            case 'portrait':
                spanClass = 'row-span-2'; // 2 rows for portrait
                aspectClass = 'aspect-[2/3]'; // width:height 2:3 for tall images
                break;
            case 'landscape':
                spanClass = 'col-span-2'; // 2 columns for landscape
                aspectClass = 'aspect-[3/2]'; // width:height 3:2 for wide images
                break;
            default:
                spanClass = ''; // square, 1x1
                aspectClass = 'aspect-square';
                break;
        }

        return `${spanClass} ${aspectClass}`;
    };

    return (
        <div className='min-h-screen bg-gradient-to-b from-black to-[#0A0A0A] text-white'>
            {/* Hot Toast Container */}
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
                        <h1 className="text-3xl md:text-4xl font-bold mb-6">
                            <span className="text-white">Team </span>
                            <span className="text-[#D4AF37]">Gallery</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                            Relive the greatest moments, celebrations, and behind-the-scenes action of the Mighty Strikers.
                        </p>

                        {/* Upload Button - Only show if user is logged in */}
                        {session && (
                            <motion.button
                                onClick={() => setShowUploadModal(true)}
                                className="mt-6 bg-[#D4AF37] text-black font-semibold py-2 px-6 rounded-lg flex items-center gap-2 mx-auto"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Upload Photos
                            </motion.button>
                        )}
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
                                        <h2 className="text-2xl font-bold mb-6 text-[#D4AF37] border-b border-[#D4AF37] pb-2 mt-15 lg:mt-0">
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

                                                        window.scrollTo({
                                                            top: 0,
                                                            behavior: "smooth",
                                                        });
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
                                                    {galleryCategories.filter(cat => cat.id !== 'all').map(category => (
                                                        <div key={category.id} className="flex justify-between">
                                                            <span className="text-gray-400">{category.name}</span>
                                                            <span className="font-bold">
                                                                {galleryImages.filter(img => img.category === category.id).length}
                                                            </span>
                                                        </div>
                                                    ))}
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
                            {isLoading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
                                </div>
                            ) : (
                                <>
                                    {/* Updated Grid: Removed auto-rows, now simple cols with spans */}
                                    <motion.div
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                                    >
                                        <AnimatePresence mode="popLayout">
                                            {filteredImages.map((image) => {
                                                const gridClasses = getGridClasses(image.aspect || 'square');
                                                return (
                                                    <motion.div
                                                        key={image._id || image.id}
                                                        layout
                                                        variants={itemVariants}
                                                        className={`relative group cursor-pointer overflow-hidden rounded-xl ${gridClasses}`}
                                                        whileHover={{ scale: 1.02 }}
                                                        onClick={() => setSelectedImage(image)}
                                                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                                    >
                                                        {/* Skeleton loader */}
                                                        {!loadedImages[image._id || image.id] && (
                                                            <div className="absolute inset-0 bg-[#2a2a2a] animate-pulse z-10" />
                                                        )}

                                                        <Image
                                                            src={image.image || '/default-gallery.jpg'}
                                                            alt={image.title || 'Gallery image'}
                                                            fill
                                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                            onLoad={() => handleImageLoad(image._id || image.id)}
                                                        />

                                                        {/* Like button - Always visible */}
                                                        <div className="absolute top-3 right-3 z-20">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleLike(image._id);
                                                                }}
                                                                disabled={likedImages[image._id]}
                                                                className={`flex items-center justify-center w-11 h-11 rounded-full backdrop-blur-sm ${likedImages[image._id]
                                                                    ? 'bg-red-500/20 text-red-500'
                                                                    : 'bg-black/40 text-gray-300 hover:bg-black/60 hover:text-yellow-500'
                                                                    } transition-all duration-300`}
                                                            >
                                                                <svg
                                                                    className="w-4 h-4"
                                                                    fill={likedImages[image._id] ? "currentColor" : "none"}
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth={2}
                                                                >
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                                </svg>
                                                            </button>
                                                        </div>

                                                        {/* Like count - Always visible */}
                                                        <div className="absolute top-3 left-3 z-20">
                                                            <div className="flex items-center gap-1 bg-black/60 text-yellow px-2 py-1 rounded-full text-xs backdrop-blur-sm">
                                                                <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                                </svg>
                                                                <span>{image.likes || 0}</span>
                                                            </div>
                                                        </div>

                                                        {/* Overlay with info - Still appears on hover */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                                            <h3 className="font-bold text-white text-sm md:text-base">{image.title || 'Profile Photo'}</h3>
                                                            <p className="text-gray-300 text-xs md:text-sm truncate">{image.description || ''}</p>
                                                            <p className="text-[#D4AF37] text-xs mt-1">
                                                                {image.date || new Date(image.createdAt).toLocaleDateString()}
                                                            </p>
                                                            {image.name && (
                                                                <p className="text-gray-400 text-xs mt-1">By: {image.name}</p>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
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
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Detail Modal - unchanged */}
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
                                        alt={selectedImage.title || 'Gallery image'}
                                        fill
                                        className="object-contain"
                                    />
                                </div>

                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold">{selectedImage.title || 'Profile'}</h3>
                                            <p className="text-[#D4AF37]">
                                                {selectedImage.date || new Date(selectedImage.createdAt).toLocaleDateString()}
                                            </p>
                                            {selectedImage.name && (
                                                <p className="text-gray-400 text-sm mt-1">Uploaded by: {selectedImage.name}</p>
                                            )}
                                        </div>
                                        <button onClick={() => setSelectedImage(null)} className="text-gray-400 hover:text-white">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <p className="text-gray-300 mb-6">{selectedImage.description || ''}</p>

                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => handleDownload(selectedImage.image, selectedImage.title || 'profile.jpg')}
                                            download
                                            className="flex items-center gap-2 text-gray-400 hover:text-white"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin='round' strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                            </svg>
                                            <span>Download</span>
                                        </button>
                                        <button
                                            onClick={() => handleShare(selectedImage.image, selectedImage.title || 'image')}
                                            className="flex items-center gap-2 text-gray-400 hover:text-white">
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

            {/* Upload Modal - unchanged */}
            <AnimatePresence>
                {showUploadModal && (
                    <>
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
                                        {/* Category Selection */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Category
                                            </label>
                                            <select
                                                value={uploadData.category}
                                                onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                                                className="w-full bg-[#2a2a2a] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#D4AF37] focus:outline-none"
                                                disabled={isUploading}
                                            >
                                                {galleryCategories.filter(cat => cat.id !== 'all').map(category => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Title Input */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Title (for all images)
                                            </label>
                                            <input
                                                type="text"
                                                value={uploadData.title}
                                                onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                                                placeholder="Enter a title for your images"
                                                className="w-full bg-[#2a2a2a] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#D4AF37] focus:outline-none"
                                                disabled={isUploading}
                                            />
                                        </div>

                                        {/* Image Upload */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Select Images
                                            </label>
                                            <div className="flex items-center justify-center w-full">
                                                <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${isUploading ? 'border-gray-600 cursor-not-allowed' : 'border-gray-600 hover:border-[#D4AF37]'} bg-[#2a2a2a]`}>
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <svg className="w-8 h-8 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
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

                                        {/* Image Previews */}
                                        {uploadData.previews.length > 0 && (
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-300 mb-3">Selected Images ({uploadData.previews.length})</h3>
                                                <div className="grid grid-cols-3 gap-3">
                                                    {uploadData.previews.map((preview, index) => (
                                                        <div key={index} className="relative group">
                                                            <img
                                                                src={preview}
                                                                alt={`Preview ${index + 1}`}
                                                                className="w-full h-24 object-cover rounded-lg"
                                                            />
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

                                        {/* Upload Button */}
                                        <button
                                            onClick={handleUpload}
                                            disabled={isUploading || uploadData.images.length === 0}
                                            className={`w-full py-3 px-4 rounded-lg font-semibold ${isUploading || uploadData.images.length === 0 ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#D4AF37] hover:bg-[#c59a2f] text-black'}`}
                                        >
                                            {isUploading ? (
                                                <div className="flex items-center justify-center">
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GalleryPage;