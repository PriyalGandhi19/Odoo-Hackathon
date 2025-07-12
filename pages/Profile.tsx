import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  MapPin, 
  Calendar, 
  Star, 
  Edit, 
  Plus, 
  X,
  Save,
  Award,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';
import { Skill } from '../types';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [skillType, setSkillType] = useState<'offered' | 'wanted'>('offered');

  if (!user || !editedUser) return null;

  const handleSave = () => {
    updateUser(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const toggleVisibility = () => {
    const newVisibility = !editedUser.isPublic;
    setEditedUser({ ...editedUser, isPublic: newVisibility });
    updateUser({ isPublic: newVisibility });
  };

  const AddSkillModal: React.FC = () => {
    const [newSkill, setNewSkill] = useState({
      name: '',
      category: 'Technology',
      level: 'Beginner' as 'Beginner' | 'Intermediate' | 'Expert',
      description: ''
    });

    const categories = [
      'Technology', 'Design', 'Business', 'Language', 'Arts', 
      'Music', 'Sports', 'Cooking', 'Other'
    ];

    const handleAddSkill = () => {
      if (!newSkill.name) return;

      const skill: Skill = {
        id: Date.now().toString(),
        ...newSkill
      };

      const updatedUser = {
        ...editedUser,
        [skillType === 'offered' ? 'skillsOffered' : 'skillsWanted']: [
          ...(skillType === 'offered' ? editedUser.skillsOffered : editedUser.skillsWanted),
          skill
        ]
      };

      setEditedUser(updatedUser);
      setShowAddSkillModal(false);
      setNewSkill({ name: '', category: 'Technology', level: 'Beginner', description: '' });
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Add {skillType === 'offered' ? 'Offered' : 'Wanted'} Skill
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill Name
              </label>
              <input
                type="text"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., React Development"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={newSkill.category}
                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level
              </label>
              <select
                value={newSkill.level}
                onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value as any })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={newSkill.description}
                onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Describe your experience or what you want to learn..."
              />
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={() => setShowAddSkillModal(false)}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddSkill}
              disabled={!newSkill.name}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Skill
            </button>
          </div>
        </div>
      </div>
    );
  };

  const removeSkill = (skillId: string, type: 'offered' | 'wanted') => {
    const updatedUser = {
      ...editedUser,
      [type === 'offered' ? 'skillsOffered' : 'skillsWanted']: 
        (type === 'offered' ? editedUser.skillsOffered : editedUser.skillsWanted)
          .filter(skill => skill.id !== skillId)
    };
    setEditedUser(updatedUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-12 text-white relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="h-12 w-12 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  {user.location && (
                    <p className="text-white/80 flex items-center mt-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {user.location}
                    </p>
                  )}
                  <p className="text-white/80 flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    Joined {new Date(user.joinDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{user.rating.toFixed(1)}</div>
                    <div className="text-white/80 text-sm flex items-center">
                      <Star className="h-4 w-4 mr-1 fill-current" />
                      Rating
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{user.totalSwaps}</div>
                    <div className="text-white/80 text-sm">Swaps</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{user.points}</div>
                    <div className="text-white/80 text-sm">Points</div>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8 space-y-8">
            {/* Profile Visibility */}
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {user.isPublic ? <Eye className="h-5 w-5 text-blue-600" /> : <EyeOff className="h-5 w-5 text-gray-600" />}
                <div>
                  <h3 className="font-semibold text-gray-900">Profile Visibility</h3>
                  <p className="text-sm text-gray-600">
                    Your profile is {user.isPublic ? 'public' : 'private'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleVisibility}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  user.isPublic 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                Make {user.isPublic ? 'Private' : 'Public'}
              </button>
            </div>

            {/* Bio Section */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">About Me</h2>
              {isEditing ? (
                <textarea
                  value={editedUser.bio || ''}
                  onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Tell others about yourself, your interests, and your learning goals..."
                />
              ) : (
                <p className="text-gray-600">
                  {user.bio || 'No bio provided yet. Add one to tell others about yourself!'}
                </p>
              )}
            </div>

            {/* Skills Offered */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Skills I Offer</h2>
                <button
                  onClick={() => {
                    setSkillType('offered');
                    setShowAddSkillModal(true);
                  }}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Skill</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {editedUser.skillsOffered.map((skill) => (
                  <div key={skill.id} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{skill.name}</h3>
                        <p className="text-sm text-purple-600 mb-1">{skill.category} • {skill.level}</p>
                        {skill.description && (
                          <p className="text-sm text-gray-600">{skill.description}</p>
                        )}
                      </div>
                      {isEditing && (
                        <button
                          onClick={() => removeSkill(skill.id, 'offered')}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {editedUser.skillsOffered.length === 0 && (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    No skills offered yet. Add some skills to share with others!
                  </div>
                )}
              </div>
            </div>

            {/* Skills Wanted */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Skills I Want to Learn</h2>
                <button
                  onClick={() => {
                    setSkillType('wanted');
                    setShowAddSkillModal(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Skill</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {editedUser.skillsWanted.map((skill) => (
                  <div key={skill.id} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{skill.name}</h3>
                        <p className="text-sm text-blue-600 mb-1">{skill.category} • {skill.level}</p>
                        {skill.description && (
                          <p className="text-sm text-gray-600">{skill.description}</p>
                        )}
                      </div>
                      {isEditing && (
                        <button
                          onClick={() => removeSkill(skill.id, 'wanted')}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {editedUser.skillsWanted.length === 0 && (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    No skills wanted yet. Add some skills you'd like to learn!
                  </div>
                )}
              </div>
            </div>

            {/* Availability */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Availability</h2>
              {isEditing ? (
                <div className="space-y-2">
                  {['Weekday Mornings', 'Weekday Afternoons', 'Weekday Evenings', 'Weekend Mornings', 'Weekend Afternoons', 'Weekend Evenings'].map((time) => (
                    <label key={time} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editedUser.availability.includes(time)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEditedUser({
                              ...editedUser,
                              availability: [...editedUser.availability, time]
                            });
                          } else {
                            setEditedUser({
                              ...editedUser,
                              availability: editedUser.availability.filter(t => t !== time)
                            });
                          }
                        }}
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-gray-700">{time}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user.availability.map((time, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {time}
                    </span>
                  ))}
                  {user.availability.length === 0 && (
                    <span className="text-gray-500">No availability set</span>
                  )}
                </div>
              )}
            </div>

            {/* Edit Actions */}
            {isEditing && (
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {showAddSkillModal && <AddSkillModal />}
      </div>
    </div>
  );
};

export default Profile;