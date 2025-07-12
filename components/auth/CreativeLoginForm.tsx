import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Users, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ParticleBackground from '../ui/ParticleBackground';
import FloatingCard from '../ui/FloatingCard';
import GradientButton from '../ui/GradientButton';
import AnimatedIcon from '../ui/AnimatedIcon';
import toast, { Toaster } from 'react-hot-toast';

const CreativeLoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Welcome back! 🎉');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        toast.error('Invalid credentials. Please try again.');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
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

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <ParticleBackground />
        
        {/* Floating Orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-20 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, -150, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -80, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-1/3 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl"
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
                className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.8 }}
              >
                <AnimatedIcon icon={Users} size={32} className="text-white" />
              </motion.div>
              
              <motion.h1 
                className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-3"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Welcome Back
              </motion.h1>
              
              <motion.p 
                className="text-white/80 text-lg"
                variants={itemVariants}
              >
                Continue your skill journey
              </motion.p>
              
              <motion.div
                className="flex items-center justify-center mt-4 space-x-2"
                variants={itemVariants}
              >
                <Sparkles className="h-4 w-4 text-yellow-400" />
                <span className="text-white/60 text-sm">Join thousands of learners</span>
                <Sparkles className="h-4 w-4 text-yellow-400" />
              </motion.div>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-white/90 text-sm font-medium mb-3">
                  Email Address
                </label>
                <div className="relative group">
                  <motion.div
                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                    whileHover={{ scale: 1.2 }}
                  >
                    <Mail className="h-5 w-5 text-white/50 group-focus-within:text-purple-400 transition-colors" />
                  </motion.div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all backdrop-blur-sm"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-white/90 text-sm font-medium mb-3">
                  Password
                </label>
                <div className="relative group">
                  <motion.div
                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                    whileHover={{ scale: 1.2 }}
                  >
                    <Lock className="h-5 w-5 text-white/50 group-focus-within:text-purple-400 transition-colors" />
                  </motion.div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-14 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all backdrop-blur-sm"
                    placeholder="Enter your password"
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

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <GradientButton
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 text-lg font-bold"
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
                      <span>Sign In</span>
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  )}
                </GradientButton>
              </motion.div>
            </form>

            {/* Footer */}
            <motion.div variants={itemVariants} className="mt-8 text-center space-y-4">
              <p className="text-white/80">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-white font-semibold hover:text-purple-300 transition-colors underline decoration-purple-400"
                >
                  Sign up
                </Link>
              </p>
              
              <motion.div 
                className="p-4 bg-white/5 rounded-xl border border-white/10"
                whileHover={{ scale: 1.02 }}
              >
                <p className="text-white/60 text-sm mb-2">Demo Accounts:</p>
                <p className="text-white/80 text-xs">
                  <strong>Admin:</strong> admin@skillswap.com / password
                  <br />
                  <strong>User:</strong> sarah@example.com / password
                </p>
              </motion.div>
            </motion.div>
          </FloatingCard>
        </motion.div>
      </div>
    </div>
  );
};

export default CreativeLoginForm;