'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';

const PerformanceAnalytics = () => {
    const [activeMetric, setActiveMetric] = useState('batting');
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [ref2, inView2] = useInView({ triggerOnce: true, threshold: 0.1 });

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

    // Performance data
    const performanceData = {
        batting: {
            title: "Batting Performance",
            stats: [
                { label: "Total Runs", value: "2,847", change: "+12%", isPositive: true },
                { label: "Average", value: "38.6", change: "+5%", isPositive: true },
                { label: "Strike Rate", value: "132.4", change: "+3%", isPositive: true },
                { label: "Highest Score", value: "167", change: null, isPositive: null }
            ],
            topPerformers: [
                { name: "R. Sharma", runs: 647, matches: 12 },
                { name: "V. Kohli", runs: 592, matches: 12 },
                { name: "S. Dhawan", runs: 534, matches: 11 }
            ]
        },
        bowling: {
            title: "Bowling Performance",
            stats: [
                { label: "Wickets Taken", value: "124", change: "+8%", isPositive: true },
                { label: "Economy Rate", value: "6.8", change: "-4%", isPositive: true },
                { label: "Best Figures", value: "5/22", change: null, isPositive: null },
                { label: "Dot Ball %", value: "42%", change: "+5%", isPositive: true }
            ],
            topPerformers: [
                { name: "J. Bumrah", wickets: 24, economy: 6.2 },
                { name: "R. Ashwin", wickets: 19, economy: 7.1 },
                { name: "M. Shami", wickets: 17, economy: 6.8 }
            ]
        },
        fielding: {
            title: "Fielding Performance",
            stats: [
                { label: "Catches Taken", value: "68", change: "+15%", isPositive: true },
                { label: "Run Outs", value: "14", change: "+22%", isPositive: true },
                { label: "Stumping", value: "8", change: "+6%", isPositive: true },
                { label: "Catch Success", value: "87%", change: "+4%", isPositive: true }
            ],
            topPerformers: [
                { name: "R. Pant", catches: 18, runouts: 3 },
                { name: "V. Kohli", catches: 12, runouts: 2 },
                { name: "R. Jadeja", catches: 11, runouts: 4 }
            ]
        }
    };

    return (
        <section className="relative py-20 bg-gradient-to-b from-black to-[#0A0A0A] overflow-hidden">
            <div className='w-11/12 mx-auto'>
                {/* Animated background elements */}
                <div className="absolute inset-0 z-0">
                    <motion.div
                        className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#D4AF37] rounded-full filter blur-3xl opacity-5"
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.05, 0.08, 0.05]
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D4AF37] rounded-full filter blur-3xl opacity-5"
                        animate={{
                            scale: [1.1, 1, 1.1],
                            opacity: [0.05, 0.08, 0.05]
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                        }}
                    />

                    {/* Animated graph grid lines */}
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute left-0 right-0 h-px bg-[#2A2A2A]"
                            style={{ top: `${20 + i * 15}%` }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.3 }}
                            transition={{ delay: i * 0.1 + 0.5 }}
                        />
                    ))}
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    {/* Section Header */}
                    <motion.div
                        ref={ref}
                        initial="hidden"
                        animate={inView ? "visible" : "hidden"}
                        variants={containerVariants}
                        className="text-center mb-16"
                    >
                        <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-bold mb-6">
                            <span className="text-white">Performance </span>
                            <span className="text-[#D4AF37]">Analytics</span>
                        </motion.h2>
                        <motion.div variants={itemVariants} className="w-24 h-1 bg-[#D4AF37] mx-auto mb-8"></motion.div>
                        <motion.p variants={itemVariants} className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Data-driven insights into our team's performance metrics and key statistics from the current season.
                        </motion.p>
                    </motion.div>

                    {/* Metrics Navigation */}
                    <motion.div
                        className="flex flex-wrap justify-center gap-4 mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        {Object.keys(performanceData).map((metric) => (
                            <button
                                key={metric}
                                onClick={() => setActiveMetric(metric)}
                                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center ${activeMetric === metric
                                    ? 'bg-[#D4AF37] text-black shadow-lg'
                                    : 'bg-[#1A1A1A] text-white hover:bg-[#2A2A2A]'}`}
                            >
                                {metric === 'batting' && (
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                    </svg>
                                )}
                                {metric === 'bowling' && (
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M5.636 5.636l3.536 3.536m0 5.656l-3.536 3.536"></path>
                                    </svg>
                                )}
                                {metric === 'fielding' && (
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
                                    </svg>
                                )}
                                {performanceData[metric].title}
                            </button>
                        ))}
                    </motion.div>

                    {/* Main Analytics Dashboard */}
                    <motion.div
                        ref={ref2}
                        initial="hidden"
                        animate={inView2 ? "visible" : "hidden"}
                        variants={containerVariants}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
                    >
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {performanceData[activeMetric].stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] p-6 rounded-2xl border border-[#2A2A2A] shadow-lg"
                                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                >
                                    <h3 className="text-gray-400 text-sm font-medium mb-2">{stat.label}</h3>
                                    <div className="flex items-end justify-between">
                                        <span className="text-2xl md:text-3xl font-bold text-white">{stat.value}</span>
                                        {stat.change && (
                                            <span className={`text-sm font-semibold px-2 py-1 rounded-full ${stat.isPositive ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                                                {stat.change}
                                            </span>
                                        )}
                                    </div>

                                    {/* Animated progress bar for some stats */}
                                    {stat.label !== 'Highest Score' && stat.label !== 'Best Figures' && (
                                        <div className="mt-4">
                                            <div className="w-full bg-[#1A1A1A] rounded-full h-2">
                                                <motion.div
                                                    className="h-2 rounded-full bg-[#D4AF37]"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min(100, parseInt(stat.value) / 10)}%` }}
                                                    transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Top Performers */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] p-6 rounded-2xl border border-[#2A2A2A] shadow-lg"
                        >
                            <h3 className="text-xl font-bold text-[#D4AF37] mb-6">Top Performers</h3>
                            <div className="space-y-6">
                                {performanceData[activeMetric].topPerformers.map((player, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex items-center"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 + 0.7 }}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-black font-bold mr-4">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-white font-semibold">{player.name}</h4>
                                            <div className="text-gray-400 text-sm">
                                                {activeMetric === 'batting' && `${player.runs} runs in ${player.matches} matches`}
                                                {activeMetric === 'bowling' && `${player.wickets} wickets • Economy: ${player.economy}`}
                                                {activeMetric === 'fielding' && `${player.catches} catches • ${player.runouts} runouts`}
                                            </div>
                                        </div>
                                        <motion.div
                                            className="text-[#D4AF37] font-bold"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: index * 0.1 + 1, type: "spring" }}
                                        >
                                            {activeMetric === 'batting' && (player.runs / player.matches).toFixed(1)}
                                            {activeMetric === 'bowling' && player.wickets}
                                            {activeMetric === 'fielding' && player.catches + player.runouts}
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default PerformanceAnalytics;