'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut, useSession } from 'next-auth/react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
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
  ];

  const isAuthForm = pathname === '/auth-form';

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
    setUserMenuOpen(false);
  };

  const confirmLogout = async () => {
    await signOut({ redirect: false });
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <motion.nav 
        className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black py-2 shadow-lg' : 'bg-transparent py-4'}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto w-11/12 px-4 md:px-6 flex justify-between items-center">
          {/* Logo - Left Side */}
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

          {/* Navigation Items - Middle (Desktop) */}
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

          {/* Right Side - User Icon or Join Button */}
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
                
                {/* User Menu Drawer */}
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
                      
                      <Link
                        href="/dashboard/playerdashboard"
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

          {/* Mobile Menu Button */}
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

        {/* Mobile Menu */}
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
                  
                  {/* Mobile User Menu or Join Button */}
                  {status === 'authenticated' ? (
                    <>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: navItems.length * 0.1 }}
                      >
                        <Link
                          href="/dashboard/playerdashboard"
                          onClick={() => setIsOpen(false)}
                          className="block py-3 text-lg font-medium text-white hover:text-[#f0c22c]"
                        >
                          Dashboard
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: (navItems.length + 1) * 0.1 }}
                      >
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            handleLogoutClick();
                          }}
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

        {/* Overlay for user menu */}
        {userMenuOpen && (
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setUserMenuOpen(false)}
          />
        )}
      </motion.nav>

      {/* Logout Confirmation Modal */}
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
    </>
  );
};

export default Navbar;