import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, MapPin, Users, Send } from 'lucide-react';
import { User, Skill } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAuth } from '../contexts/AuthContext';

const BrowseSkills: React.FC = () => {
  const { user } = useAuth();
  const [users] = useLocalStorage<User[]>('users', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const categories = [
    'All Categories',
    'Technology',
    'Design',
    'Business',
    'Language',
    'Arts',
    'Music',
    'Sports',
    'Cooking',
    'Other'
  ];

  const levels = ['All Levels', 'Beginner', 'Intermediate', 'Expert'];

  useEffect(() => {
    let filtered = users.filter(u => u.id !== user?.id && u.isPublic && u.skillsOffered.length > 0);

    if (searchTerm) {
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.skillsOffered.some(skill =>
          skill.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        (u.location && u.location.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory && selectedCategory !== 'All Categories') {
      filtered = filtered.filter(u =>
        u.skillsOffered.some(skill => skill.category === selectedCategory)
      );
    }

    if (selectedLevel && selectedLevel !== 'All Levels') {
      filtered = filtered.filter(u =>
        u.skillsOffered.some(skill => skill.level === selectedLevel)
      );
    }

    setFilteredUsers(filtered);
  }, [users, user, searchTerm, selectedCategory, selectedLevel]);

  const handleSendRequest = (targetUser: User) => {
    setSelectedUser(targetUser);
    setShowRequestModal(true);
  };

  const RequestModal: React.FC = () => {
    const [message, setMessage] = useState('');
    const [selectedOfferedSkill, setSelectedOfferedSkill] = useState('');
    const [selectedRequestedSkill, setSelectedRequestedSkill] = useState('');
    const [swapRequests, setSwapRequests] = useLocalStorage('swapRequests', []);

    const handleSubmitRequest = () => {
      if (!selectedUser || !selectedOfferedSkill || !selectedRequestedSkill) return;

      const newRequest = {
        id: Date.now().toString(),
        fromUserId: user?.id || '',
        toUserId: selectedUser.id,
        offeredSkillId: selectedOfferedSkill,
        requestedSkillId: selectedRequestedSkill,
        message,
        status: 'pending' as const,
        createdAt: new Date().toISOString()
      };

      setSwapRequests([...swapRequests, newRequest]);
      setShowRequestModal(false);
      setSelectedUser(null);
      setMessage('');
      setSelectedOfferedSkill('');
      setSelectedRequestedSkill('');
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Send Swap Request to {selectedUser?.name}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Skill to Offer
              </label>
              <select
                value={selectedOfferedSkill}
                onChange={(e) => setSelectedOfferedSkill(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select a skill you offer</option>
                {user?.skillsOffered.map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.name} ({skill.level})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill You Want to Learn
              </label>
              <select
                value={selectedRequestedSkill}
                onChange={(e) => setSelectedRequestedSkill(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select a skill to learn</option>
                {selectedUser?.skillsOffered.map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.name} ({skill.level})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Introduce yourself and explain your learning goals..."
              />
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={() => setShowRequestModal(false)}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitRequest}
              disabled={!selectedOfferedSkill || !selectedRequestedSkill}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send Request
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Skills</h1>
          <p className="text-gray-600">Discover talented people and their skills</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search skills, names, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category === 'All Categories' ? '' : category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {levels.map((level) => (
                  <option key={level} value={level === 'All Levels' ? '' : level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((userProfile) => (
            <div
              key={userProfile.id}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{userProfile.name}</h3>
                {userProfile.location && (
                  <p className="text-gray-600 flex items-center justify-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{userProfile.location}</span>
                  </p>
                )}
                <div className="flex items-center justify-center space-x-1 mt-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">
                    {userProfile.rating.toFixed(1)} ({userProfile.totalSwaps} swaps)
                  </span>
                </div>
              </div>

              {userProfile.bio && (
                <p className="text-gray-600 text-sm mb-4 text-center">{userProfile.bio}</p>
              )}

              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Skills Offered:</h4>
                <div className="flex flex-wrap gap-2">
                  {userProfile.skillsOffered.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium"
                    >
                      {skill.name}
                    </span>
                  ))}
                  {userProfile.skillsOffered.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      +{userProfile.skillsOffered.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {userProfile.availability && userProfile.availability.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Available:</h4>
                  <div className="flex flex-wrap gap-1">
                    {userProfile.availability.map((time, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                      >
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => handleSendRequest(userProfile)}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Send Swap Request</span>
              </button>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}

        {showRequestModal && <RequestModal />}
      </div>
    </div>
  );
};

export default BrowseSkills;