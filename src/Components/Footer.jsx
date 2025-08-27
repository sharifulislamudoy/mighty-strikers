'use client';

import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import Image from 'next/image';

const Footer = () => {
    const [email, setEmail] = useState('');

    // Predefined particle positions to avoid hydration mismatch
    const particlePositions = useMemo(() => [
        { top: "45.76%", left: "72.30%", opacity: 0.57 },
        { top: "67.92%", left: "37.75%", opacity: 0.57 },
        { top: "16.41%", left: "89.32%", opacity: 0.33 },
        { top: "93.04%", left: "64.99%", opacity: 0.49 },
        { top: "61.63%", left: "96.83%", opacity: 0.49 },
        { top: "76.36%", left: "20.61%", opacity: 0.15 },
        { top: "86.54%", left: "87.46%", opacity: 0.49 },
        { top: "37.52%", left: "2.69%", opacity: 0.57 },
        { top: "68.74%", left: "93.09%", opacity: 0.46 },
        { top: "12.85%", left: "52.30%", opacity: 0.53 }
    ], []);

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

    const floatingAnimation = {
        y: [0, -8, 0],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
        }
    };

    const socialLinks = [
        { name: 'Facebook', icon: '🇫', url: '#' },
        { name: 'Instagram', icon: '📸', url: '#' },
    ];

    const quickLinks = [
        { name: 'Home', url: '#' },
        { name: 'Team', url: '#' },
        { name: 'Matches', url: '#' },
        { name: 'Gallery', url: '#' },
    ];

    return (
        <footer className="relative bg-gradient-to-b from-[#0A0A0A] to-black text-white overflow-hidden pt-16 pb-8">
            <div className='w-11/12 mx-auto'>
                {/* Animated background elements */}
                <div className="absolute inset-0 z-0">
                    {/* Field lines */}
                    <motion.div
                        className="absolute top-10 left-0 w-full h-0.5 bg-[#D4AF37] opacity-20"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 1.5 }}
                        viewport={{ once: true }}
                    />

                    {/* Floating particles - using predefined positions to avoid hydration issues */}
                    {particlePositions.map((pos, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1.5 h-1.5 rounded-full bg-[#D4AF37]"
                            style={{
                                top: pos.top,
                                left: pos.left,
                                opacity: pos.opacity
                            }}
                            animate={{
                                y: [0, -15, 0],
                                x: [0, (i % 2 === 0 ? 1 : -1) * 8, 0],
                            }}
                            transition={{
                                duration: Math.random() * 4 + 3,
                                repeat: Infinity,
                                delay: Math.random() * 2
                            }}
                        />
                    ))}

                    {/* Stumps at bottom */}
                    <motion.div
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-4 opacity-50"
                        initial={{ y: 100, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 0.5 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        viewport={{ once: true }}
                    >
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-3 h-16 bg-gradient-to-b from-[#D4AF37] to-[#8B4513] rounded-lg"></div>
                        ))}
                    </motion.div>
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
                    >
                        {/* Brand column - now spans 2 columns on large screens */}
                        <motion.div variants={itemVariants} className="lg:col-span-1 flex flex-col items-center md:items-start">
                            <motion.div
                                className="mb-6"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                <Image
                                    src="/logo.png"
                                    alt="Mighty Strikers Logo"
                                    width={120}
                                    height={120}
                                    className="rounded-full border-4 border-[#D4AF37] shadow-lg"
                                />
                            </motion.div>
                            <h3 className="text-2xl font-bold mb-4 text-[#D4AF37]">Mighty Strikers</h3>
                            <p className="text-gray-400 mb-6 text-center md:text-left">
                                The most formidable cricket team that strikes with power, precision and passion
                            </p>

                            {/* Social links */}
                            <div className="flex space-x-4">
                                {socialLinks.map((social, index) => (
                                    <motion.a
                                        key={index}
                                        href={social.url}
                                        className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center text-lg border border-[#D4AF37]"
                                        whileHover={{
                                            scale: 1.1,
                                            backgroundColor: "#D4AF37",
                                            color: "#000"
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    >
                                        {social.icon}
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>

                        {/* Quick Links */}
                        <motion.div variants={itemVariants} className="flex flex-col">
                            <h3 className="text-xl font-bold mb-6 text-[#D4AF37] border-b border-[#D4AF37] pb-2 w-1/3">Quick Links</h3>
                            <ul className="space-y-3">
                                {quickLinks.map((link, index) => (
                                    <motion.li
                                        key={index}
                                        whileHover={{ x: 5 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    >
                                        <a href={link.url} className="text-gray-300 hover:text-[#D4AF37] transition-colors duration-300 block">
                                            {link.name}
                                        </a>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Newsletter */}
                        <motion.div variants={itemVariants} className="flex flex-col items-center md:items-start">
                            <h3 className="text-xl font-bold mb-6 text-[#D4AF37] border-b border-[#D4AF37] pb-2">Stay Updated</h3>
                            <p className="text-gray-400 mb-4 text-center md:text-left">Get the latest news and match updates</p>

                            <form className="w-full">
                                <div className="relative mb-4">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Your email address"
                                        className="w-full bg-[#1a1a1a] border border-[#D4AF37] rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] pr-12"
                                        required
                                    />
                                    <motion.button
                                        type="submit"
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#D4AF37] text-black rounded-lg px-3 py-1 text-sm font-semibold"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Subscribe
                                    </motion.button>
                                </div>
                            </form>

                            <div className="mt-6 text-center md:text-left">
                                <p className="text-gray-400 mb-2">Contact Us</p>
                                <p className="text-[#D4AF37]">info@mightystrikers.com</p>
                                <p className="text-[#D4AF37]">+1 (555) 123-4567</p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Bottom section */}
                    <motion.div
                        className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-gray-400 text-sm mb-4 md:mb-0">
                            © {new Date().getFullYear()} Mighty Strikers Cricket Club. All rights reserved.
                        </p>

                        <div className="flex space-x-6">
                            <motion.a
                                href="#"
                                className="text-gray-400 hover:text-[#D4AF37] text-sm"
                                whileHover={{ scale: 1.05 }}
                            >
                                Privacy Policy
                            </motion.a>
                            <motion.a
                                href="#"
                                className="text-gray-400 hover:text-[#D4AF37] text-sm"
                                whileHover={{ scale: 1.05 }}
                            >
                                Terms of Service
                            </motion.a>
                            <motion.a
                                href="#"
                                className="text-gray-400 hover:text-[#D4AF37] text-sm"
                                whileHover={{ scale: 1.05 }}
                            >
                                Cookie Policy
                            </motion.a>
                        </div>
                    </motion.div>
                </div>

                {/* Animated cricket ball */}
                <motion.div
                    className="absolute bottom-20 right-10 w-8 h-8 bg-[#D4AF37] rounded-full z-0 opacity-30"
                    animate={{
                        y: [0, -100, 0],
                        x: [0, -50, 0],
                        rotate: [0, 180, 360]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <div className="w-full h-full relative">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#8B4513]"></div>
                        <div className="absolute top-0 left-1/2 h-full w-0.5 bg-[#8B4513]"></div>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;