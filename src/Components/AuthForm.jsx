'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    photo: null,
    category: '',
    specialties: [],
    battingStyle: '',
    bowlingStyle: '',
    age: '',
    role: ''
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper'];
  const specialtyOptions = [
    'Power Hitting', 'Leadership', 'Fielding', 'Yorkers', 
    'Swing Bowling', 'Death Overs', 'Spin Bowling', 'Fast Bowling',
    'Strategy', 'Wicket-keeping', 'Running between wickets'
  ];
  const battingStyles = ['Right Handed', 'Left Handed'];
  const bowlingStyles = ['Right Arm Fast', 'Right Arm Medium', 'Right Arm Spin', 'Left Arm Fast', 'Left Arm Medium', 'Left Arm Spin'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSpecialtyChange = (specialty) => {
    setFormData(prev => {
      if (prev.specialties.includes(specialty)) {
        return {
          ...prev,
          specialties: prev.specialties.filter(s => s !== specialty)
        };
      } else if (prev.specialties.length < 3) {
        return {
          ...prev,
          specialties: [...prev.specialties, specialty]
        };
      }
      return prev;
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
      
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      // Here you would typically send data to your backend
    }, 2000);
  };

  const toggleFormMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#0A0A0A] text-white flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-[#0F0F0F] overflow-hidden rounded-2xl mt-20 border border-[#2A2A2A] shadow-2xl"
      >
        {/* Form Header */}
        <div className="relative h-32 bg-gradient-to-r from-[#1a1a1a] to-[#0A0A0A] overflow-hidden">
          <div className="absolute inset-0 bg-[url('/texture.png')] opacity-10"></div>
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold">
                <span className="text-white">Mighty</span>
                <span className="text-[#f0c22c]">Strikers</span>
              </h1>
              <p className="text-gray-400 mt-2">
                {isLogin ? 'Welcome back to the team' : 'Join our winning team'}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Toggle between Login and Register */}
            <div className="flex justify-center mb-6">
              <div className="bg-[#1A1A1A] rounded-full p-1 flex">
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${isLogin ? 'bg-[#f0c22c] text-black' : 'text-gray-400 hover:text-white'}`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${!isLogin ? 'bg-[#f0c22c] text-black' : 'text-gray-400 hover:text-white'}`}
                >
                  Register
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {isLogin ? (
                // Login Form
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div>
                    <label htmlFor="login-phone" className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      id="login-phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f0c22c] focus:border-transparent transition-all"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label htmlFor="login-password" className="block text-sm font-medium text-gray-300 mb-2">
                      Password
                    </label>
                    <input
                      id="login-password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f0c22c] focus:border-transparent transition-all"
                      placeholder="Enter your password"
                    />
                  </div>

                  <div className="text-right">
                    <a href="#" className="text-sm text-[#f0c22c] hover:underline">
                      Forgot password?
                    </a>
                  </div>
                </motion.div>
              ) : (
                // Registration Form
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f0c22c] focus:border-transparent transition-all"
                        placeholder="e.g. Alex Johnson"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number *
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f0c22c] focus:border-transparent transition-all"
                        placeholder="e.g. 0123456789"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-2">
                        Age
                      </label>
                      <input
                        id="age"
                        name="age"
                        type="number"
                        required
                        value={formData.age}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f0c22c] focus:border-transparent transition-all"
                        placeholder="e.g. 28"
                        min="16"
                        max="50"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email (Optional)
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f0c22c] focus:border-transparent transition-all"
                        placeholder="Enter your email (optional)"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f0c22c] focus:border-transparent transition-all"
                      placeholder="Create a strong password"
                    />
                  </div>

                  {/* Preferred Role and Category side by side on large screens */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
                        Preferred Role
                      </label>
                      <input
                        id="role"
                        name="role"
                        type="text"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f0c22c] focus:border-transparent transition-all"
                        placeholder="e.g. Captain & Batsman"
                      />
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                        Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f0c22c] focus:border-transparent transition-all"
                      >
                        <option value="">Select category</option>
                        {categories.map((category) => (
                          <option key={category} value={category.toLowerCase()}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Batting Style and Bowling Style side by side on large screens */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="battingStyle" className="block text-sm font-medium text-gray-300 mb-2">
                        Batting Style
                      </label>
                      <select
                        id="battingStyle"
                        name="battingStyle"
                        value={formData.battingStyle}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f0c22c] focus:border-transparent transition-all"
                      >
                        <option value="">Select batting style</option>
                        {battingStyles.map((style) => (
                          <option key={style} value={style}>
                            {style}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="bowlingStyle" className="block text-sm font-medium text-gray-300 mb-2">
                        Bowling Style
                      </label>
                      <select
                        id="bowlingStyle"
                        name="bowlingStyle"
                        value={formData.bowlingStyle}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f0c22c] focus:border-transparent transition-all"
                      >
                        <option value="">Select bowling style</option>
                        {bowlingStyles.map((style) => (
                          <option key={style} value={style}>
                            {style}
                        </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Specialties (Max 3)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {specialtyOptions.map((specialty) => (
                        <motion.div
                          key={specialty}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`cursor-pointer p-2 rounded-lg text-center text-sm border transition-all ${
                            formData.specialties.includes(specialty)
                              ? 'bg-[#f0c22c] bg-opacity-20 border-[#f0c22c] text-[#f0c22c]'
                              : 'bg-[#1A1A1A] border-[#2A2A2A] text-gray-300 hover:border-[#f0c22c]'
                          } ${
                            formData.specialties.length >= 3 && 
                            !formData.specialties.includes(specialty) 
                              ? 'opacity-50 cursor-not-allowed' 
                              : ''
                          }`}
                          onClick={() => handleSpecialtyChange(specialty)}
                        >
                          {specialty}
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Selected: {formData.specialties.join(', ') || 'None'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Profile Photo
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        {previewUrl ? (
                          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#f0c22c]">
                            <Image
                              src={previewUrl}
                              alt="Profile preview"
                              width={64}
                              height={64}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-[#1A1A1A] border-2 border-dashed border-[#2A2A2A] flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <label className="flex-1">
                        <div className="px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-center cursor-pointer hover:bg-[#2A2A2A] transition-colors">
                          Upload Photo
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                isSubmitting 
                  ? 'bg-gray-700 cursor-not-allowed' 
                  : 'bg-[#f0c22c] hover:bg-[#e0b224] text-black'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-black border-t-transparent rounded-full mr-2"
                  />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </div>
              ) : isLogin ? (
                'Sign In'
              ) : (
                'Join Our Team'
              )}
            </motion.button>

            {/* Footer Links */}
            <div className="text-center text-sm text-gray-500">
              {isLogin ? (
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={toggleFormMode}
                    className="text-[#f0c22c] hover:underline font-medium"
                  >
                    Join our team
                  </button>
                </p>
              ) : (
                <p>
                  Already a member?{' '}
                  <button
                    type="button"
                    onClick={toggleFormMode}
                    className="text-[#f0c22c] hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthForm;