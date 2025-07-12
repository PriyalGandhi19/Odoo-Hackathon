import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useAuth } from '../contexts/AuthContext';
import { 
  TrendingUp, 
  Users, 
  Star, 
  Calendar,
  Plus,
  Award,
  Target,
  Clock,
  BookOpen,
  Zap,
  Trophy,
  Sparkles,
  ArrowRight,
  Activity
} from 'lucide-react';
import { SwapRequest, User } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import FloatingCard from '../components/ui/FloatingCard';
import GradientButton from '../components/ui/GradientButton';
import AnimatedIcon from '../components/ui/AnimatedIcon';
import ParticleBackground from '../components/ui/ParticleBackground';

const CreativeDashboard: React.FC = () => {
  const { user } = useAuth();
  const [swapRequests] = useLocalStorage<SwapRequest[]>('swapRequests', []);
  const [users] = useLocalStorage<User[]>('users', []);
  const [stats, setStats] = useState({
    totalSwaps: 0,
    pendingRequests: 0,
    completedSwaps: 0,
    averageRating: 0
  });

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    if (user) {
      const userSwaps = swapRequests.filter(
        req => req.fromUserId === user.id || req.toUserId === user.id
      );
      
      setStats({
        totalSwaps: userSwaps.length,
        pendingRequests: userSwaps.filter(req => req.status === 'pending').length,
        completedSwaps: userSwaps.filter(req => req.status === 'completed').length,
        averageRating: user.rating || 0
      });
    }
  }, [user, swapRequests]);

  const recentSwaps = swapRequests
    .filter(req => req.fromUserId === user?.id || req.toUserId === user?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const suggestedUsers = users
    .filter(u => u.id !== user?.id && u.isPublic)
    .slice(0, 3);

  if (!user) return null;

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
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const statsCards = [
    {
      title: 'Total Swaps',
      value: stats.totalSwaps,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    {
      title: 'Pending Requests',
      value: stats.pendingRequests,
      icon: Clock,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      title: 'Completed Swaps',
      value: stats.completedSwaps,
      icon: Award,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      title: 'Rating',
      value: stats.averageRating.toFixed(1),
      icon: Star,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <ParticleBackground />
        
        {/* Floating Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 right-20 w-20 h-20 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-20 blur-xl"
        />
        <motion.div
          animate={{
            y: [0, 15, 0],
            rotate: [0, -3, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-32 left-32 w-16 h-16 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-20 blur-xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Welcome Section */}
          <motion.div variants={itemVariants} className="mb-12">
            <FloatingCard className="p-8 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-indigo-600/10">
              <div className="flex items-center justify-between">
                <div>
                  <motion.h1 
                    className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    Welcome back, {user.name}! 
                    <motion.span
                      animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      className="inline-block ml-2"
                    >
                      👋
                    </motion.span>
                  </motion.h1>
                  <p className="text-gray-600 text-xl mb-4">
                    Ready to share your skills and learn something new today?
                  </p>
                  <motion.div 
                    className="flex items-center space-x-4"
                    variants={itemVariants}
                  >
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-5 w-5 text-yellow-500" />
                      <span className="text-gray-600">Level up your skills</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-purple-500" />
                      <span className="text-gray-600">Connect with learners</span>
                    </div>
                  </motion.div>
                </div>
                <div className="hidden md:flex items-center space-x-6">
                  <motion.div 
                    className="text-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="text-3xl font-bold text-purple-600">{user.points}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Trophy className="h-4 w-4 mr-1" />
                      Points
                    </div>
                  </motion.div>
                  <motion.div 
                    className="text-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="text-3xl font-bold text-blue-600">{user.badges?.length || 0}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Award className="h-4 w-4 mr-1" />
                      Badges
                    </div>
                  </motion.div>
                </div>
              </div>
            </FloatingCard>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            ref={ref}
          >
            {statsCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <FloatingCard className="p-6 bg-white/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <motion.p 
                        className="text-3xl font-bold text-gray-900"
                        initial={{ scale: 0 }}
                        animate={inView ? { scale: 1 } : {}}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                      >
                        {stat.value}
                      </motion.p>
                    </div>
                    <motion.div 
                      className={`p-4 ${stat.bgColor} rounded-2xl`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <AnimatedIcon icon={stat.icon} className={stat.textColor} size={24} />
                    </motion.div>
                  </div>
                  <motion.div
                    className={`mt-4 h-2 bg-gradient-to-r ${stat.color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={inView ? { width: '100%' } : {}}
                    transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                  />
                </FloatingCard>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Skills Overview */}
            <motion.div variants={itemVariants}>
              <FloatingCard className="p-8 bg-white/60 h-full">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <BookOpen className="h-6 w-6 mr-3 text-purple-600" />
                    Your Skills
                  </h2>
                  <GradientButton size="sm" className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Add Skill</span>
                  </GradientButton>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Target className="h-5 w-5 mr-2 text-purple-600" />
                      </motion.div>
                      Skills Offered ({user.skillsOffered?.length || 0})
                    </h3>
                    {user.skillsOffered?.length ? (
                      <div className="flex flex-wrap gap-3">
                        {user.skillsOffered.slice(0, 5).map((skill, index) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 rounded-full text-sm font-medium shadow-md"
                          >
                            {skill.name}
                          </motion.span>
                        ))}
                        {user.skillsOffered.length > 5 && (
                          <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm">
                            +{user.skillsOffered.length - 5} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <motion.div 
                        className="text-center py-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No skills offered yet</p>
                      </motion.div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Target className="h-5 w-5 mr-2 text-blue-600" />
                      </motion.div>
                      Skills Wanted ({user.skillsWanted?.length || 0})
                    </h3>
                    {user.skillsWanted?.length ? (
                      <div className="flex flex-wrap gap-3">
                        {user.skillsWanted.slice(0, 5).map((skill, index) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full text-sm font-medium shadow-md"
                          >
                            {skill.name}
                          </motion.span>
                        ))}
                        {user.skillsWanted.length > 5 && (
                          <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm">
                            +{user.skillsWanted.length - 5} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <motion.div 
                        className="text-center py-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Target className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No skills wanted yet</p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </FloatingCard>
            </motion.div>

            {/* Recent Activity */}
            <motion.div variants={itemVariants}>
              <FloatingCard className="p-8 bg-white/60 h-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                  <Activity className="h-6 w-6 mr-3 text-blue-600" />
                  Recent Activity
                </h2>
                
                {recentSwaps.length > 0 ? (
                  <div className="space-y-4">
                    {recentSwaps.map((swap, index) => {
                      const otherUser = users.find(u => 
                        u.id === (swap.fromUserId === user.id ? swap.toUserId : swap.fromUserId)
                      );
                      
                      return (
                        <motion.div 
                          key={swap.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="p-4 bg-white/70 rounded-2xl border border-gray-200 hover:shadow-lg transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">
                                {swap.fromUserId === user.id ? 'Sent request to' : 'Received request from'} {otherUser?.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {new Date(swap.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <motion.span 
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                swap.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                swap.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}
                              whileHover={{ scale: 1.05 }}
                            >
                              {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
                            </motion.span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <motion.div 
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-2">No recent activity</p>
                    <p className="text-sm text-gray-400 mb-6">Start browsing skills to make your first swap!</p>
                    <GradientButton className="flex items-center space-x-2">
                      <span>Browse Skills</span>
                      <ArrowRight className="h-4 w-4" />
                    </GradientButton>
                  </motion.div>
                )}
              </FloatingCard>
            </motion.div>
          </div>

          {/* Suggested Connections */}
          {suggestedUsers.length > 0 && (
            <motion.div variants={itemVariants}>
              <FloatingCard className="p-8 bg-white/60">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                  <Users className="h-6 w-6 mr-3 text-indigo-600" />
                  Suggested Connections
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {suggestedUsers.map((suggestedUser, index) => (
                    <motion.div 
                      key={suggestedUser.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="p-6 bg-white/70 rounded-2xl border border-gray-200 text-center hover:shadow-xl transition-all"
                    >
                      <motion.div 
                        className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Users className="h-8 w-8 text-white" />
                      </motion.div>
                      <h3 className="font-semibold text-gray-900 mb-1">{suggestedUser.name}</h3>
                      {suggestedUser.location && (
                        <p className="text-sm text-gray-600 mb-3">{suggestedUser.location}</p>
                      )}
                      <div className="flex items-center justify-center space-x-1 mb-4">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{suggestedUser.rating.toFixed(1)}</span>
                      </div>
                      <GradientButton size="sm" className="w-full">
                        View Profile
                      </GradientButton>
                    </motion.div>
                  ))}
                </div>
              </FloatingCard>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CreativeDashboard;