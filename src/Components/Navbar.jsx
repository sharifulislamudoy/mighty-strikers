'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut, useSession } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast'; // Import react-hot-toast

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    category: 'profile',
    title: '',
    images: [],
    previews: []
  });
  const [isUploading, setIsUploading] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Team', path: '/team' },
    { name: 'Matches', path: '/matches' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Performance', path: '/performance' },
  ];

  const isAuthForm = pathname === '/auth-form';

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    setUserMenuOpen(false);
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    try {
      await signOut({ redirect: false });
      setShowLogoutConfirm(false);
      toast.success('Successfully signed out!', {
        duration: 4000,
        style: {
          background: '#1A1A1A',
          color: '#fff',
          border: '1px solid #2A2A2A',
        },
        iconTheme: {
          primary: '#f0c22c',
          secondary: '#1A1A1A',
        },
      }); // Show toast on successful sign-out
    } catch (error) {
      toast.error('Failed to sign out. Please try again.', {
        duration: 4000,
        style: {
          background: '#1A1A1A',
          color: '#fff',
          border: '1px solid #2A2A2A',
        },
        iconTheme: {
          primary: '#ef4444',
          secondary: '#1A1A1A',
        },
      });
    }
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newPreviews = [];
    const newImages = [];

    files.forEach(file => {
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

  const removeImage = (index) => {
    setUploadData(prev => ({
      ...prev,
      previews: prev.previews.filter((_, i) => i !== index),
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleUpload = async () => {
    if (uploadData.images.length === 0) {
      toast.error('Please select at least one image', {
        duration: 4000,
        style: {
          background: '#1A1A1A',
          color: '#fff',
          border: '1px solid #2A2A2A',
        },
        iconTheme: {
          primary: '#ef4444',
          secondary: '#1A1A1A',
        },
      });
      return;
    }

    setIsUploading(true);

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
      toast.success('Images uploaded successfully!', {
        duration: 4000,
        style: {
          background: '#1A1A1A',
          color: '#fff',
          border: '1px solid #2A2A2A',
        },
        iconTheme: {
          primary: '#f0c22c',
          secondary: '#1A1A1A',
        },
      });
      setShowUploadModal(false);
      setUploadData({
        category: 'profile',
        title: '',
        images: [],
        previews: []
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images. Please try again.', {
        duration: 4000,
        style: {
          background: '#1A1A1A',
          color: '#fff',
          border: '1px solid #2A2A2A',
        },
        iconTheme: {
          primary: '#ef4444',
          secondary: '#1A1A1A',
        },
      });
    } finally {
      setIsUploading(false);
    }
  };

  const username = session?.user?.username || session?.user?.name?.toLowerCase().replace(/\s+/g, '-');
  const isAdmin = session?.user?.role === 'admin';

  return (
    <>
      <Toaster /> {/* Add Toaster component for toast notifications */}
      <motion.nav 
        className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black py-2 shadow-lg' : 'bg-transparent py-4'}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto w-11/12 px-4 md:px-6 flex justify-between items-center">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="flex items-center">
              <div className="text-2xl font-bold bg-black p-2 rounded-lg">
                <span className="text-white">Mighty</span>
                <span className="text-[#f0c22c]">Strikers</span>
              </div>
            </Link>
          </motion.div>

          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  href={item.path}
                  className={`relative text-sm font-medium px-3 py-2 transition-colors duration-300 ${
                    pathname === item.path 
                      ? 'text-[#f0c22c]' 
                      : 'text-white hover:text-[#F1E5AC]'
                  }`}
                >
                  {item.name}
                  {pathname === item.path && (
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-[#f0c22c]"
                      layoutId="navbar-indicator"
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="hidden lg:block">
            {isMounted && status === 'authenticated' ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleUserMenu}
                  className="w-10 h-10 rounded-full bg-[#f0c22c] flex items-center justify-center text-black font-bold"
                  aria-label="User menu"
                >
                  {session.user?.name?.charAt(0) || session.user?.username?.charAt(0) || 'U'}
                </motion.button>
                
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-12 mt-2 w-48 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-xl py-1 z-50"
                    >
                      <div className="px-4 py-2 border-b border-[#2A2A2A]">
                        <p className="text-white font-medium text-sm">
                          {session.user?.name || session.user?.username}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {session.user?.role}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          setShowUploadModal(true);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#2A2A2A] transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Upload Image
                      </button>
                      
                      {isAdmin && (
                        <Link
                          href="/player/dashboard/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-white hover:bg-[#2A2A2A] transition-colors"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      
                      <Link
                        href={`/player/dashboard/${username}`}
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-white hover:bg-[#2A2A2A] transition-colors"
                      >
                        Dashboard
                      </Link>
                      
                      <button
                        onClick={handleLogoutClick}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#2A2A2A] transition-colors"
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : isMounted && !isAuthForm ? (
              <motion.a
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: "#f0c22c",
                  color: "#000"
                }}
                href='/auth-form'
                whileTap={{ scale: 0.95 }}
                className="bg-[#f0c22c] text-black font-bold py-2 px-6 rounded-full text-sm transition-all duration-300 border border-[#D4AF37] shadow-lg"
              >
                Join Our Team
              </motion.a>
            ) : (
              <div className="w-32 h-10"></div>
            )}
          </div>

          <div className="lg:hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleMenu}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 flex flex-col justify-between items-center">
                <motion.span
                  animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                  className="w-full h-0.5 bg-[#f0c22c] block"
                ></motion.span>
                <motion.span
                  animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="w-full h-0.5 bg-[#f0c22c] block"
                ></motion.span>
                <motion.span
                  animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                  className="w-full h-0.5 bg-[#f0c22c] block"
                ></motion.span>
              </div>
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-black border-t border-[#f0c22c] overflow-hidden"
            >
              <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col space-y-4">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Link
                        href={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`block py-3 text-lg font-medium ${
                          pathname === item.path
                            ? 'text-[#f0c22c]'
                            : 'text-white hover:text-[#f0c22c]'
                        }`}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                  
                  {status === 'authenticated' ? (
                    <>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: navItems.length * 0.1 }}
                      >
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            setShowUploadModal(true);
                          }}
                          className="w-full text-left py-3 text-lg font-medium text-white hover:text-[#f0c22c] flex items-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Upload Image
                        </button>
                      </motion.div>
                      
                      {isAdmin && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: (navItems.length + 1) * 0.1 }}
                        >
                          <Link
                            href="/player/dashboard/admin"
                            onClick={() => setIsOpen(false)}
                            className="block py-3 text-lg font-medium text-white hover:text-[#f0c22c]"
                          >
                            Admin Dashboard
                          </Link>
                        </motion.div>
                      )}
                      
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: (navItems.length + (isAdmin ? 2 : 1)) * 0.1 }}
                      >
                        <Link
                          href={`/player/dashboard/${username}`}
                          onClick={() => setIsOpen(false)}
                          className="block py-3 text-lg font-medium text-white hover:text-[#f0c22c]"
                        >
                          Dashboard
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: (navItems.length + (isAdmin ? 3 : 2)) * 0.1 }}
                      >
                        <button
                          onClick={handleLogoutClick}
                          className="block w-full text-left py-3 text-lg font-medium text-white hover:text-[#f0c22c]"
                        >
                          Sign Out
                        </button>
                      </motion.div>
                    </>
                  ) : isMounted && !isAuthForm ? (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: navItems.length * 0.1 }}
                      className="pt-4"
                    >
                      <a
                        href='/auth-form'
                        className="w-full bg-[#f0c22c] text-black font-bold py-3 px-6 rounded-full text-lg"
                      >
                        Join Our Team
                      </a>
                    </motion.div>
                  ) : (
                    <div className="h-16"></div> 
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {userMenuOpen && (
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setUserMenuOpen(false)}
          />
        )}
      </motion.nav>

      <AnimatePresence>
        {showLogoutConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
              onClick={cancelLogout}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-[#1A1A1A] rounded-lg p-6 w-full max-w-md border border-[#2A2A2A]"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-white mb-4">Confirm Sign Out</h3>
                <p className="text-gray-300 mb-6">Are you sure you want to sign out?</p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={cancelLogout}
                    className="px-4 py-2 rounded text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmLogout}
                    className="px-4 py-2 rounded text-sm font-medium text-black bg-[#f0c22c] hover:bg-[#e0b224] transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
                        <option value="profile">Profile Photos</option>
                        <option value="matches">Match Moments</option>
                        <option value="winning">Winning Moments</option>
                        <option value="team">Team Photos</option>
                      </select>
                    </div>

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
    </>
  );
};

export default Navbar;