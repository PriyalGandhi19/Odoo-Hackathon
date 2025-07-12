import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, MapPin, Users, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ParticleBackground from '../ui/ParticleBackground';
import FloatingCard from '../ui/FloatingCard';
import GradientButton from '../ui/GradientButton';
import AnimatedIcon from '../ui/AnimatedIcon';
import toast, { Toaster } from 'react-hot-toast';

const CreativeRegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    bio: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.email) {
        toast.error('Please fill in all required fields');
        return;
      }
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const success = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        location: formData.location || undefined,
        bio: formData.bio || undefined,
        availability: [],
        skillsOffered: [],
        skillsWanted: []
      });

      if (success) {
        toast.success('Account created successfully! 🎉');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        toast.error('Email already exists');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    }
    
    setLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <ParticleBackground />
        
        {/* Floating Orbs */}
        <motion.div
          animate={{
            x: [0, 120, 0],
            y: [0, -80, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-32 left-32 w-36 h-36 bg-indigo-500/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 120, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-32 right-32 w-44 h-44 bg-pink-500/20 rounded-full blur-xl"
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-md w-full"
        >
          <FloatingCard className="p-8">
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center mb-8">
              <motion.div 
                className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.8 }}
              >
                <AnimatedIcon icon={Users} size={32} className="text-white" />
              </motion.div>
              
              <motion.h1 
                className="text-4xl font-bold bg-gradient-to-r from-white via-indigo-200 to-pink-200 bg-clip-text text-transparent mb-3"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Join SkillSwap
              </motion.h1>
              
              <motion.p 
                className="text-white/80 text-lg"
                variants={itemVariants}
              >
                Start your learning journey today
              </motion.p>

              {/* Progress Indicator */}
              <motion.div 
                className="flex items-center justify-center mt-6 space-x-4"
                variants={itemVariants}
              >
                <div className={`w-3 h-3 rounded-full transition-all ${step >= 1 ? 'bg-indigo-400' : 'bg-white/20'}`} />
                <div className={`w-8 h-1 rounded-full transition-all ${step >= 2 ? 'bg-indigo-400' : 'bg-white/20'}`} />
                <div className={`w-3 h-3 rounded-full transition-all ${step >= 2 ? 'bg-indigo-400' : 'bg-white/20'}`} />
              </motion.div>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <motion.div
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  {/* Name Field */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-white/90 text-sm font-medium mb-3">
                      Full Name *
                    </label>
                    <div className="relative group">
                      <motion.div
                        className="absolute left-4 top-1/2 transform -translate-y-1/2"
                        whileHover={{ scale: 1.2 }}
                      >
                        <User className="h-5 w-5 text-white/50 group-focus-within:text-indigo-400 transition-colors" />
                      </motion.div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all backdrop-blur-sm"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </motion.div>

                  {/* Email Field */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-white/90 text-sm font-medium mb-3">
                      Email Address *
                    </label>
                    <div className="relative group">
                      <motion.div
                        className="absolute left-4 top-1/2 transform -translate-y-1/2"
                        whileHover={{ scale: 1.2 }}
                      >
                        <Mail className="h-5 w-5 text-white/50 group-focus-within:text-indigo-400 transition-colors" />
                      </motion.div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all backdrop-blur-sm"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </motion.div>

                  {/* Location Field */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-white/90 text-sm font-medium mb-3">
                      Location (Optional)
                    </label>
                    <div className="relative group">
                      <motion.div
                        className="absolute left-4 top-1/2 transform -translate-y-1/2"
                        whileHover={{ scale: 1.2 }}
                      >
                        <MapPin className="h-5 w-5 text-white/50 group-focus-within:text-indigo-400 transition-colors" />
                      </motion.div>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all backdrop-blur-sm"
                        placeholder="City, Country"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <GradientButton
                      type="button"
                      onClick={handleNextStep}
                      className="w-full py-4 text-lg font-bold"
                      size="lg"
                      variant="primary"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <span>Continue</span>
                        <ArrowRight className="h-5 w-5" />
                      </span>
                    </GradientButton>
                  </motion.div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  {/* Password Field */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-white/90 text-sm font-medium mb-3">
                      Password *
                    </label>
                    <div className="relative group">
                      <motion.div
                        className="absolute left-4 top-1/2 transform -translate-y-1/2"
                        whileHover={{ scale: 1.2 }}
                      >
                        <Lock className="h-5 w-5 text-white/50 group-focus-within:text-indigo-400 transition-colors" />
                      </motion.div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-12 pr-14 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all backdrop-blur-sm"
                        placeholder="Create a password"
                        required
                      />
                      <motion.button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Confirm Password Field */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-white/90 text-sm font-medium mb-3">
                      Confirm Password *
                    </label>
                    <div className="relative group">
                      <motion.div
                        className="absolute left-4 top-1/2 transform -translate-y-1/2"
                        whileHover={{ scale: 1.2 }}
                      >
                        <CheckCircle className="h-5 w-5 text-white/50 group-focus-within:text-indigo-400 transition-colors" />
                      </motion.div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full pl-12 pr-14 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all backdrop-blur-sm"
                        placeholder="Confirm your password"
                        required
                      />
                      <motion.button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Bio Field */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-white/90 text-sm font-medium mb-3">
                      Bio (Optional)
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={3}
                      className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all backdrop-blur-sm resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </motion.div>

                  <div className="flex space-x-3">
                    <GradientButton
                      type="button"
                      onClick={() => setStep(1)}
                      variant="secondary"
                      className="flex-1 py-4"
                    >
                      Back
                    </GradientButton>
                    <GradientButton
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-4 text-lg font-bold"
                      size="lg"
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full mx-auto"
                        />
                      ) : (
                        <span className="flex items-center justify-center space-x-2">
                          <span>Create Account</span>
                          <Sparkles className="h-5 w-5" />
                        </span>
                      )}
                    </GradientButton>
                  </div>
                </motion.div>
              )}
            </form>

            {/* Footer */}
            <motion.div variants={itemVariants} className="mt-8 text-center">
              <p className="text-white/80">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-white font-semibold hover:text-indigo-300 transition-colors underline decoration-indigo-400"
                >
                  Sign in
                </Link>
              </p>
            </motion.div>
          </FloatingCard>
        </motion.div>
      </div>
    </div>
  );
};

export default CreativeRegisterForm;