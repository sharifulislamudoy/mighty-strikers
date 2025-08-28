'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

const AuthForm = () => {
  const router = useRouter();
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
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
    setError('');
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      let imageUrl = null;

      // Upload image to Cloudinary if it exists
      if (formData.photo) {
        const data = new FormData();
        data.append("file", formData.photo);
        data.append("upload_preset", "react_unsigned");
        data.append("cloud_name", "dohhfubsa");

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/dohhfubsa/image/upload`,
          {
            method: "POST",
            body: data,
          }
        );

        const uploaded = await res.json();
        imageUrl = uploaded.secure_url;
      }

      const finalData = {
        ...formData,
        photo: imageUrl,
        age: parseInt(formData.age)
      };

      // Determine API endpoint based on form mode
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

      // Send data to backend
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong');
      }

      // Handle successful response
      if (isLogin) {
        // Show success toast for login
        toast.success('Login successful! Redirecting...');

        // Store user data
        localStorage.setItem('user', JSON.stringify(result.user));

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        // Show success toast for registration
        toast.success(`Registration successful! Your username is: ${result.username}. You can now login.`);

        // Reset form and switch to login
        setFormData({
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
        });
        setPreviewUrl(null);

        // Switch to login form after a short delay
        setTimeout(() => {
          setIsLogin(true);
        }, 1500);
      }
    } catch (err) {
      setError(err.message);
      // Show error toast
      toast.error(err.message || 'An error occurred. Please try again.');
      console.error("Submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#0A0A0A] text-white flex items-center justify-center p-4">
      {/* Toast Container */}
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
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-[#0F0F0F] overflow-hidden rounded-2xl mt-20 border border-[#2A2A2A] shadow-2xl"
      >
        {/* Form Header */}
        <div className="relative h-32 bg-gradient-to-r from-[#1a1a1a] to-[#0A0A0A] overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold">
                <span className="text-white">Hello</span>
                <span className="text-[#f0c22c]">Warrior</span>
              </h1>
              <p className="text-gray-400 mt-2">
                {isLogin ? 'Welcome back to the team' : 'Join our winning team'}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 md:p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-900 bg-opacity-30 border border-red-700 rounded-lg text-red-200">
              {error}
            </div>
          )}

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

                  <div className="relative">
                    <label htmlFor="login-password" className="block text-sm font-medium text-gray-300 mb-2">
                      Password
                    </label>
                    <input
                      id="login-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f0c22c] focus:border-transparent transition-all pr-10"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-10 text-gray-400 hover:text-white focus:outline-none"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      )}
                    </button>
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

                    <div className="relative">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                        Password
                      </label>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f0c22c] focus:border-transparent transition-all pr-10"
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-10 text-gray-400 hover:text-white focus:outline-none"
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        )}
                      </button>
                    </div>

                  </div>

                  {/* Preferred Role and Category side by side on large screens */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
                        Preferred Role
                      </label>
                      <input
                        id="category" // change from role
                        name="category" // change from role
                        type="text"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f0c22c] focus:border-transparent transition-all"
                        placeholder="e.g. Captain & Batsman"
                      />
                    </div>


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
                          className={`cursor-pointer p-2 rounded-lg text-center text-sm border transition-all ${formData.specialties.includes(specialty)
                            ? 'bg-[#f0c22c] bg-opacity-20 border-[#f0c22c] text-[#f0c22c]'
                            : 'bg-[#1A1A1A] border-[#2A2A2A] text-gray-300 hover:border-[#f0c22c]'
                            } ${formData.specialties.length >= 3 &&
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
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${isSubmitting
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
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthForm;