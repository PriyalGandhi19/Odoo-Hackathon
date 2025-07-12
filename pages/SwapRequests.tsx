import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Inbox, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Trash2,
  MessageSquare,
  Star,
  Calendar,
  User,
  ArrowRight,
  Filter
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SwapRequest, User as UserType, Skill } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import FloatingCard from '../components/ui/FloatingCard';
import GradientButton from '../components/ui/GradientButton';
import AnimatedIcon from '../components/ui/AnimatedIcon';
import toast from 'react-hot-toast';

const SwapRequests: React.FC = () => {
  const { user } = useAuth();
  const [swapRequests, setSwapRequests] = useLocalStorage<SwapRequest[]>('swapRequests', []);
  const [users] = useLocalStorage<UserType[]>('users', []);
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const receivedRequests = swapRequests.filter(req => req.toUserId === user?.id);
  const sentRequests = swapRequests.filter(req => req.fromUserId === user?.id);

  const filteredRequests = (activeTab === 'received' ? receivedRequests : sentRequests)
    .filter(req => filterStatus === 'all' || req.status === filterStatus)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleAcceptRequest = (requestId: string) => {
    setSwapRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'accepted' as const }
          : req
      )
    );
    toast.success('Swap request accepted! 🎉');
  };

  const handleRejectRequest = (requestId: string) => {
    setSwapRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'rejected' as const }
          : req
      )
    );
    toast.success('Swap request rejected');
  };

  const handleDeleteRequest = (requestId: string) => {
    setSwapRequests(prev => prev.filter(req => req.id !== requestId));
    toast.success('Swap request deleted');
  };

  const getOtherUser = (request: SwapRequest): UserType | undefined => {
    const otherUserId = request.fromUserId === user?.id ? request.toUserId : request.fromUserId;
    return users.find(u => u.id === otherUserId);
  };

  const getSkillById = (skillId: string, userId: string): Skill | undefined => {
    const skillUser = users.find(u => u.id === userId);
    return skillUser?.skillsOffered.find(s => s.id === skillId) || 
           skillUser?.skillsWanted.find(s => s.id === skillId);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    accepted: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    completed: 'bg-blue-100 text-blue-800 border-blue-200',
    cancelled: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const statusIcons = {
    pending: Clock,
    accepted: CheckCircle,
    rejected: XCircle,
    completed: Star,
    cancelled: XCircle
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Swap Requests
            </h1>
            <p className="text-gray-600 text-lg">Manage your skill exchange requests</p>
          </motion.div>

          {/* Tabs and Filters */}
          <motion.div variants={itemVariants}>
            <FloatingCard className="p-6 mb-8 bg-white/60">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                {/* Tabs */}
                <div className="flex space-x-1 bg-gray-100 rounded-2xl p-1">
                  <button
                    onClick={() => setActiveTab('received')}
                    className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center space-x-2 ${
                      activeTab === 'received'
                        ? 'bg-white text-purple-600 shadow-md'
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    <Inbox className="h-4 w-4" />
                    <span>Received ({receivedRequests.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('sent')}
                    className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center space-x-2 ${
                      activeTab === 'sent'
                        ? 'bg-white text-purple-600 shadow-md'
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    <Send className="h-4 w-4" />
                    <span>Sent ({sentRequests.length})</span>
                  </button>
                </div>

                {/* Filter */}
                <div className="flex items-center space-x-3">
                  <Filter className="h-5 w-5 text-gray-500" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </FloatingCard>
          </motion.div>

          {/* Requests List */}
          <motion.div variants={itemVariants}>
            {filteredRequests.length > 0 ? (
              <div className="space-y-6">
                {filteredRequests.map((request, index) => {
                  const otherUser = getOtherUser(request);
                  const offeredSkill = getSkillById(request.offeredSkillId, request.fromUserId);
                  const requestedSkill = getSkillById(request.requestedSkillId, request.toUserId);
                  const StatusIcon = statusIcons[request.status];

                  return (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <FloatingCard className="p-6 bg-white/70 hover:bg-white/80 transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <motion.div 
                                  className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center"
                                  whileHover={{ scale: 1.1 }}
                                >
                                  <User className="h-6 w-6 text-white" />
                                </motion.div>
                                <div>
                                  <h3 className="font-semibold text-gray-900 text-lg">
                                    {activeTab === 'received' ? 'Request from' : 'Request to'} {otherUser?.name}
                                  </h3>
                                  <p className="text-sm text-gray-600 flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {new Date(request.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <motion.div
                                className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[request.status]}`}
                                whileHover={{ scale: 1.05 }}
                              >
                                <div className="flex items-center space-x-1">
                                  <StatusIcon className="h-4 w-4" />
                                  <span>{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span>
                                </div>
                              </motion.div>
                            </div>

                            {/* Skills Exchange */}
                            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <div className="text-center">
                                  <p className="text-sm text-gray-600 mb-2">Offering</p>
                                  <div className="bg-purple-100 text-purple-800 px-3 py-2 rounded-xl font-medium">
                                    {offeredSkill?.name || 'Unknown Skill'}
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">{offeredSkill?.level}</p>
                                </div>
                                <div className="flex justify-center">
                                  <motion.div
                                    animate={{ x: [0, 10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                  >
                                    <ArrowRight className="h-6 w-6 text-gray-400" />
                                  </motion.div>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm text-gray-600 mb-2">Requesting</p>
                                  <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-xl font-medium">
                                    {requestedSkill?.name || 'Unknown Skill'}
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">{requestedSkill?.level}</p>
                                </div>
                              </div>
                            </div>

                            {/* Message */}
                            {request.message && (
                              <div className="bg-blue-50 rounded-xl p-4 mb-4">
                                <div className="flex items-start space-x-2">
                                  <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium text-blue-900 mb-1">Message:</p>
                                    <p className="text-blue-800">{request.message}</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-wrap gap-3">
                              {activeTab === 'received' && request.status === 'pending' && (
                                <>
                                  <GradientButton
                                    onClick={() => handleAcceptRequest(request.id)}
                                    variant="success"
                                    size="sm"
                                    className="flex items-center space-x-2"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                    <span>Accept</span>
                                  </GradientButton>
                                  <GradientButton
                                    onClick={() => handleRejectRequest(request.id)}
                                    variant="danger"
                                    size="sm"
                                    className="flex items-center space-x-2"
                                  >
                                    <XCircle className="h-4 w-4" />
                                    <span>Reject</span>
                                  </GradientButton>
                                </>
                              )}
                              
                              {activeTab === 'sent' && request.status === 'pending' && (
                                <GradientButton
                                  onClick={() => handleDeleteRequest(request.id)}
                                  variant="danger"
                                  size="sm"
                                  className="flex items-center space-x-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span>Cancel Request</span>
                                </GradientButton>
                              )}

                              {request.status === 'accepted' && (
                                <GradientButton
                                  size="sm"
                                  className="flex items-center space-x-2"
                                >
                                  <MessageSquare className="h-4 w-4" />
                                  <span>Start Chat</span>
                                </GradientButton>
                              )}
                            </div>
                          </div>
                        </div>
                      </FloatingCard>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <FloatingCard className="p-12 bg-white/60">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {activeTab === 'received' ? (
                      <Inbox className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    ) : (
                      <Send className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    )}
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No {activeTab} requests
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {activeTab === 'received' 
                      ? "You haven't received any swap requests yet."
                      : "You haven't sent any swap requests yet."
                    }
                  </p>
                  <GradientButton className="flex items-center space-x-2">
                    <span>Browse Skills</span>
                    <ArrowRight className="h-4 w-4" />
                  </GradientButton>
                </FloatingCard>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SwapRequests;