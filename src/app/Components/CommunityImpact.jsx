'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';

const CommunityImpact = () => {
    const [activeInitiative, setActiveInitiative] = useState(0);
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [ref2, inView2] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Predefined positions for background elements to avoid hydration mismatch
    const particlePositions = [
        { top: "10%", left: "15%", size: "w-4 h-4" },
        { top: "25%", left: "85%", size: "w-3 h-3" },
        { top: "40%", left: "10%", size: "w-5 h-5" },
        { top: "55%", left: "90%", size: "w-3 h-3" },
        { top: "70%", left: "5%", size: "w-4 h-4" },
        { top: "85%", left: "80%", size: "w-6 h-6" },
        { top: "30%", left: "75%", size: "w-3 h-3" },
        { top: "60%", left: "25%", size: "w-4 h-4" },
        { top: "15%", left: "60%", size: "w-5 h-5" },
        { top: "45%", left: "45%", size: "w-3 h-3" }
    ];

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

    // Community initiatives data
    const initiatives = [
        {
            title: "Youth Coaching Clinics",
            description: "Weekly free coaching sessions for underprivileged children in our community, focusing on cricket fundamentals and life skills.",
            icon: "🏏",
            stats: [
                { value: "200+", label: "Children Trained" },
                { value: "4", label: "Locations" },
                { value: "52", label: "Sessions/Year" }
            ],
            impact: "We've seen improved school attendance and better teamwork skills among participants."
        },
        {
            title: "Equipment Donation Drive",
            description: "Collecting and distributing cricket equipment to schools and communities that lack resources to participate in the sport.",
            icon: "🎁",
            stats: [
                { value: "500+", label: "Items Donated" },
                { label: "15", value: "Schools Supported" },
                { value: "100%", label: "Donations Distributed" }
            ],
            impact: "Enabled 5 schools to start their own cricket programs with proper equipment."
        },
        {
            title: "Community Tournaments",
            description: "Organizing inter-community cricket tournaments to foster unity, friendship, and healthy competition across neighborhoods.",
            icon: "🏆",
            stats: [
                { value: "8", label: "Tournaments Held" },
                { value: "40+", label: "Teams Participated" },
                { value: "2000+", label: "Spectators" }
            ],
            impact: "Brought together diverse communities through the spirit of cricket and sportsmanship."
        }
    ];

    // Impact metrics
    const impactMetrics = [
        { value: "5", label: "Years of Service", suffix: "+" },
        { value: "1500", label: "Lives Impacted", suffix: "+" },
        { value: "50", label: "Volunteers", suffix: "+" },
        { value: "100", label: "Events Organized", suffix: "+" }
    ];

    return (
        <section className="relative py-20 bg-gradient-to-b from-[#0A0A0A] to-black overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 z-0">
                <motion.div 
                    className="absolute top-20 left-10 w-72 h-72 bg-[#D4AF37] rounded-full filter blur-3xl opacity-5"
                    animate={{
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div 
                    className="absolute bottom-10 right-10 w-96 h-96 bg-[#D4AF37] rounded-full filter blur-3xl opacity-5"
                    animate={{
                        scale: [1.1, 1, 1.1],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                />
                
                {/* Animated particles - using predefined positions */}
                {isClient && particlePositions.map((particle, i) => (
                    <motion.div
                        key={i}
                        className={`absolute ${particle.size} bg-[#D4AF37] rounded-full opacity-10`}
                        style={{
                            top: particle.top,
                            left: particle.left,
                        }}
                        animate={{
                            y: [0, -20, 0],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: Math.random() * 4 + 3,
                            repeat: Infinity,
                            delay: Math.random() * 2
                        }}
                    />
                ))}

                {/* Cricket field outline */}
                <motion.div 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 h-3/5 border border-[#D4AF37] opacity-10 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                />
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
                        <span className="text-white">Community </span>
                        <span className="text-[#D4AF37]">Impact</span>
                    </motion.h2>
                    <motion.div variants={itemVariants} className="w-24 h-1 bg-[#D4AF37] mx-auto mb-8"></motion.div>
                    <motion.p variants={itemVariants} className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Beyond the boundary, we're committed to making a positive difference in our community through cricket.
                    </motion.p>
                </motion.div>

                {/* Impact Metrics */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.4, duration: 0.7 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
                >
                    {impactMetrics.map((metric, index) => (
                        <motion.div
                            key={index}
                            className="text-center p-6 bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A] rounded-2xl border border-[#2A2A2A] shadow-lg"
                            whileHover={{ 
                                y: -5,
                                boxShadow: "0 10px 25px rgba(212, 175, 55, 0.15)"
                            }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 + 0.6 }}
                        >
                            <div className="text-3xl md:text-4xl font-bold text-[#D4AF37] mb-2">
                                {metric.value}<span className="text-xl">{metric.suffix}</span>
                            </div>
                            <div className="text-gray-300">{metric.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Initiatives Navigation */}
                <motion.div 
                    className="flex flex-wrap justify-center gap-4 mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    {initiatives.map((initiative, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveInitiative(index)}
                            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center ${activeInitiative === index 
                                ? 'bg-[#D4AF37] text-black shadow-lg' 
                                : 'bg-[#1A1A1A] text-white hover:bg-[#2A2A2A]'}`}
                        >
                            <span className="text-xl mr-2">{initiative.icon}</span>
                            {initiative.title}
                        </button>
                    ))}
                </motion.div>

                {/* Initiative Details */}
                <motion.div
                    ref={ref2}
                    initial="hidden"
                    animate={inView2 ? "visible" : "hidden"}
                    variants={containerVariants}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
                >
                    {/* Initiative Description */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] p-8 rounded-2xl border border-[#2A2A2A] shadow-lg"
                    >
                        <div className="flex items-center mb-6">
                            <span className="text-4xl mr-4">{initiatives[activeInitiative].icon}</span>
                            <h3 className="text-2xl font-bold text-[#D4AF37]">{initiatives[activeInitiative].title}</h3>
                        </div>
                        
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            {initiatives[activeInitiative].description}
                        </p>
                        
                        <div className="p-4 bg-[#0A0A0A] rounded-xl border-l-4 border-[#D4AF37] mb-6">
                            <h4 className="text-white font-semibold mb-2">Impact:</h4>
                            <p className="text-gray-300">{initiatives[activeInitiative].impact}</p>
                        </div>
                        
                        <motion.button
                            whileHover={{ 
                                scale: 1.05, 
                                boxShadow: "0 0 20px rgba(212, 175, 55, 0.5)" 
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-[#D4AF37] text-black font-bold py-3 px-8 rounded-full text-md transition-all duration-300"
                        >
                            Get Involved
                        </motion.button>
                    </motion.div>

                    {/* Initiative Stats */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] p-8 rounded-2xl border border-[#2A2A2A] shadow-lg"
                    >
                        <h3 className="text-xl font-bold text-[#D4AF37] mb-6">Initiative Impact</h3>
                        
                        <div className="space-y-6">
                            {initiatives[activeInitiative].stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    className="flex items-center justify-between p-4 bg-[#0A0A0A] rounded-xl border border-[#2A2A2A]"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 + 0.5 }}
                                >
                                    <span className="text-gray-300">{stat.label}</span>
                                    <span className="text-2xl font-bold text-[#D4AF37]">{stat.value}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Progress bar */}
                        <div className="mt-8">
                            <div className="flex justify-between text-sm text-gray-400 mb-2">
                                <span>Initiative Progress</span>
                                <span>85%</span>
                            </div>
                            <div className="w-full bg-[#1A1A1A] rounded-full h-3">
                                <motion.div 
                                    className="h-3 rounded-full bg-[#D4AF37]"
                                    initial={{ width: 0 }}
                                    animate={{ width: "85%" }}
                                    transition={{ delay: 1, duration: 1.5 }}
                                />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Testimonials */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 1.2, duration: 0.7 }}
                    className="bg-gradient-to-r from-[#0A0A0A] to-[#1A1A1A] p-8 rounded-2xl border border-[#2A2A2A]"
                >
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-12 text-center">Community Voices</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            { 
                                text: "The youth coaching program gave my son confidence not just in cricket, but in all aspects of his life. He's more focused in school and has made new friends.",
                                author: "Parent of participant",
                                role: "Community Member"
                            },
                            { 
                                text: "As a volunteer, I've seen firsthand how cricket brings people together. The Mighty Strikers are truly making a difference in our neighborhood.",
                                author: "James Wilson",
                                role: "Program Volunteer"
                            }
                        ].map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.2 + 1.4, duration: 0.5 }}
                                className="p-6 bg-[#0A0A0A] rounded-xl border border-[#2A2A2A]"
                            >
                                <div className="flex items-start mb-4">
                                    <div className="w-12 h-12 rounded-full bg-[#D4AF37] flex items-center justify-center text-black font-bold mr-4">
                                        {testimonial.author.split(' ').map(name => name[0]).join('')}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold">{testimonial.author}</h4>
                                        <p className="text-gray-400 text-sm">{testimonial.role}</p>
                                    </div>
                                </div>
                                <p className="text-gray-300 italic">"{testimonial.text}"</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CommunityImpact;