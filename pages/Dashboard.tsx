import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  TrendingUp, 
  Users, 
  Star, 
  Calendar,
  Plus,
  Edit,
  Award,
  Target,
  Clock,
  BookOpen
} from 'lucide-react';
import { SwapRequest, User } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [swapRequests] = useLocalStorage<SwapRequest[]>('swapRequests', []);
  const [users] = useLocalStorage<User[]>('users', []);
  const [stats, setStats] = useState({
    totalSwaps: 0,
    pendingRequests: 0,
    completedSwaps: 0,
    averageRating: 0
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

  const suggstedUsers = users
    .filter(u => u.id !== user?.id && u.isPublic)
    .slice(0, 3);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, {user.name}! 👋
                </h1>
                <p className="text-gray-600 text-lg">
                  Ready to share your skills and learn something new today?
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{user.points}</div>
                  <div className="text-sm text-gray-500">Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{user.badges?.length || 0}</div>
                  <div className="text-sm text-gray-500">Badges</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Swaps</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSwaps}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Swaps</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedSwaps}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Award className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Skills Overview */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Your Skills</h2>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Skill</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-purple-600" />
                  Skills Offered ({user.skillsOffered?.length || 0})
                </h3>
                {user.skillsOffered?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {user.skillsOffered.slice(0, 5).map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                      >
                        {skill.name}
                      </span>
                    ))}
                    {user.skillsOffered.length > 5 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        +{user.skillsOffered.length - 5} more
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No skills offered yet</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Target className="h-4 w-4 mr-2 text-blue-600" />
                  Skills Wanted ({user.skillsWanted?.length || 0})
                </h3>
                {user.skillsWanted?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {user.skillsWanted.slice(0, 5).map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {skill.name}
                      </span>
                    ))}
                    {user.skillsWanted.length > 5 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        +{user.skillsWanted.length - 5} more
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No skills wanted yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            
            {recentSwaps.length > 0 ? (
              <div className="space-y-4">
                {recentSwaps.map((swap) => {
                  const otherUser = users.find(u => 
                    u.id === (swap.fromUserId === user.id ? swap.toUserId : swap.fromUserId)
                  );
                  
                  return (
                    <div key={swap.id} className="p-4 bg-white/50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {swap.fromUserId === user.id ? 'Sent request to' : 'Received request from'} {otherUser?.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(swap.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          swap.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          swap.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No recent activity</p>
                <p className="text-sm text-gray-400">Start browsing skills to make your first swap!</p>
              </div>
            )}
          </div>
        </div>

        {/* Suggested Connections */}
        {suggstedUsers.length > 0 && (
          <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Suggested Connections</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {suggstedUsers.map((suggestedUser) => (
                <div key={suggestedUser.id} className="p-4 bg-white/50 rounded-lg border border-gray-200">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{suggestedUser.name}</h3>
                    {suggestedUser.location && (
                      <p className="text-sm text-gray-600 mb-2">{suggestedUser.location}</p>
                    )}
                    <div className="flex items-center justify-center space-x-1 mb-3">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{suggestedUser.rating.toFixed(1)}</span>
                    </div>
                    <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm">
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;