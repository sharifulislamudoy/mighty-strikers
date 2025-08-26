'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const AboutSection = () => {
    // Animation for section header
    const headerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    // Animation for content cards
    const cardVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    // Animation for values list
    const listItemVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.2,
                duration: 0.5,
                ease: "easeOut"
            }
        })
    };

    // Use intersection observer for scroll animations
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const [ref2, inView2] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <section className="relative py-20 bg-gradient-to-b from-[#0A0A0A] to-black overflow-hidden">
            <div className='w-11/12 mx-auto'>
                {/* Background decorative elements */}
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-[#D4AF37] rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#D4AF37] rounded-full filter blur-3xl opacity-5 animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    {/* Section Header */}
                    <motion.div
                        ref={ref}
                        initial="hidden"
                        animate={inView ? "visible" : "hidden"}
                        variants={headerVariants}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            <span className="text-white">About </span>
                            <span className="text-[#D4AF37]">Mighty Strikers</span>
                        </h2>
                        <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-8"></div>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Founded on passion, built on discipline, and driven by excellence. We are more than just a cricket team - we are a family.
                        </p>
                    </motion.div>

                    {/* Content Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Column - Our Story */}
                        <motion.div
                            ref={ref2}
                            initial="hidden"
                            animate={inView2 ? "visible" : "hidden"}
                            variants={cardVariants}
                            className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] p-8 rounded-2xl border border-[#2A2A2A] shadow-lg"
                        >
                            <h3 className="text-2xl font-bold text-[#D4AF37] mb-6">Our Story</h3>
                            <p className="text-gray-300 mb-6">
                                Established in 2015, Mighty Strikers began as a group of passionate cricket enthusiasts playing in local tournaments.
                                Through dedication and relentless effort, we've grown into a competitive force in regional cricket.
                            </p>
                            <p className="text-gray-300 mb-6">
                                Our journey has been marked by memorable victories, hard-fought matches, and the unwavering support of our community.
                                Each season brings new challenges that we face together as a united team.
                            </p>
                            <p className="text-gray-300">
                                Beyond the cricket field, we're committed to nurturing young talent and promoting sportsmanship in our community through
                                coaching clinics and friendly matches with emerging teams.
                            </p>

                            {/* Animated decorative element */}
                            <motion.div
                                className="mt-8 flex space-x-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                            >
                                {[2015, 2018, 2021, 2023].map((year, index) => (
                                    <motion.div
                                        key={index}
                                        className="text-center"
                                        whileHover={{ scale: 1.1, y: -5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <div className="w-16 h-16 rounded-full bg-[#0A0A0A] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-bold">
                                            {year}
                                        </div>
                                        <span className="text-white text-sm mt-2 block">Est.</span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* Right Column - Our Values */}
                        <motion.div
                            initial="hidden"
                            animate={inView2 ? "visible" : "hidden"}
                            variants={cardVariants}
                            transition={{ delay: 0.2 }}
                            className="space-y-8"
                        >
                            <div className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] p-8 rounded-2xl border border-[#2A2A2A] shadow-lg">
                                <h3 className="text-2xl font-bold text-[#D4AF37] mb-6">Our Values</h3>
                                <ul className="space-y-4">
                                    {[
                                        { title: "Excellence", desc: "Striving for the highest standards in every aspect of the game" },
                                        { title: "Teamwork", desc: "Unity is our strength; we win and learn together" },
                                        { title: "Discipline", desc: "Commitment to training, strategy, and sportsmanship" },
                                        { title: "Passion", desc: "Love for cricket that drives us to give our best always" },
                                        { title: "Community", desc: "Giving back and growing the sport we love" }
                                    ].map((value, i) => (
                                        <motion.li
                                            key={i}
                                            custom={i}
                                            initial="hidden"
                                            animate={inView2 ? "visible" : "hidden"}
                                            variants={listItemVariants}
                                            className="flex items-start"
                                        >
                                            <span className="text-[#D4AF37] text-xl mr-3">•</span>
                                            <div>
                                                <h4 className="text-white font-semibold">{value.title}</h4>
                                                <p className="text-gray-400">{value.desc}</p>
                                            </div>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>

                            {/* Join Us CTA */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={inView2 ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 1, duration: 0.5 }}
                                className="bg-gradient-to-r from-[#0A0A0A] to-[#1A1A1A] p-6 rounded-2xl border border-[#D4AF37] shadow-lg text-center"
                            >
                                <h3 className="text-xl font-bold text-[#D4AF37] mb-4">Interested in Joining Us?</h3>
                                <p className="text-gray-300 mb-6">
                                    We're always looking for passionate players who share our values and love for cricket.
                                </p>
                                <motion.button
                                    whileHover={{
                                        scale: 1.05,
                                        boxShadow: "0 0 20px rgba(212, 175, 55, 0.5)"
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-[#D4AF37] text-black font-bold py-3 px-8 rounded-full text-md transition-all duration-300"
                                >
                                    Contact Us
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;