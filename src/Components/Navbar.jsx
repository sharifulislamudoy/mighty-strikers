'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

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
    { name: 'News', path: '/news' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Shop', path: '/shop' },
    { name: 'Contact', path: '/contact' },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
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

        {/* CTA Button - Right Side (Desktop) */}
        <div className="hidden lg:block">
          <motion.button
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "#f0c22c",
              color: "#000"
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#f0c22c] text-black font-bold py-2 px-6 rounded-full text-sm transition-all duration-300 border border-[#D4AF37] shadow-lg"
          >
            Join The Club
          </motion.button>
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
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: navItems.length * 0.1 }}
                  className="pt-4"
                >
                  <button className="w-full bg-[#f0c22c] text-black font-bold py-3 px-6 rounded-full text-lg">
                    Join The Club
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;