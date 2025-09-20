import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Settings, Edit3, Trash2, Heart, Users, UserPlus, UserMinus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { UserAvatar } from '../components/UserAvatar';
import { ShayariCard } from '../components/ShayariCard';
import FollowButton from '../components/FollowButton';
import FollowersList from '../components/FollowersList';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [profileUser, setProfileUser] = useState(null);
  const [shayaris, setShayaris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('shayaris');

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    if (username) {
      fetchProfileData();
    }
  }, [username]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch user profile and shayaris
      const [profileRes, shayarisRes] = await Promise.all([
        api.get(`/user/profile/${username}`),
        api.get(`/shayari/user/${username}`)
      ]);
      
      setProfileUser(profileRes.data);
      setShayaris(shayarisRes.data);
      
      // Check if current user is following this profile
      if (!isOwnProfile && currentUser) {
        const isFollowingRes = await api.get(`/user/following`);
        const following = isFollowingRes.data;
        setIsFollowing(following.some(u => u.username === username));
      }
      
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };


  const handleEditShayari = (shayariId) => {
    navigate(`/edit-shayari/${shayariId}`);
  };

  const handleDeleteShayari = async (shayariId) => {
    if (!window.confirm('Are you sure you want to delete this shayari?')) return;
    
    try {
      await api.delete(`/shayari/delete/${shayariId}`);
      setShayaris(prev => prev.filter(s => s._id !== shayariId));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handlePrivacyToggle = async () => {
    try {
      const res = await api.put('/user/toggle-visibility');
      setProfileUser(prev => ({
        ...prev,
        isPublic: res.data.isPublic
      }));
    } catch (err) {
      console.error('Privacy toggle error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">User not found</p>
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <UserAvatar user={profileUser} size="xl" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">@{profileUser.username}</h1>
              <p className="text-gray-600">{profileUser.email}</p>
              <div className="flex items-center space-x-4 mt-2">
                <FollowersList 
                  userId={profileUser._id}
                  username={profileUser.username}
                  type="followers"
                />
                <FollowersList 
                  userId={profileUser._id}
                  username={profileUser.username}
                  type="following"
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isOwnProfile ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrivacyToggle}
                  className="flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>{profileUser.isPublic ? 'Public' : 'Private'}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/settings')}
                >
                  Edit Profile
                </Button>
              </>
            ) : (
              <FollowButton
                userId={profileUser._id}
                username={profileUser.username}
                isFollowing={isFollowing}
                onFollowChange={(newFollowState) => {
                  setIsFollowing(newFollowState);
                  setProfileUser(prev => ({
                    ...prev,
                    followers: newFollowState ? prev.followers + 1 : prev.followers - 1
                  }));
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('shayaris')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'shayaris'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Shayaris ({shayaris.length})
            </button>
            <button
              onClick={() => setActiveTab('liked')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'liked'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Liked
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'shayaris' && (
            <div className="space-y-4">
              {shayaris.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No shayaris yet</p>
                  {isOwnProfile && (
                    <Button
                      onClick={() => navigate('/addShayari')}
                      className="mt-4"
                    >
                      Write your first shayari
                    </Button>
                  )}
                </div>
              ) : (
                shayaris.map((shayari) => (
                  <div key={shayari._id} className="relative">
                    <ShayariCard
                      shayari={{
                        id: shayari._id,
                        content: shayari.text,
                        likes: shayari.likes.length,
                        isLiked: shayari.likes.includes(currentUser?.id),
                        comments: 0,
                        createdAt: shayari.createdAt,
                        author: {
                          name: profileUser.username,
                          username: profileUser.username
                        }
                      }}
                    />
                    
                    {isOwnProfile && (
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditShayari(shayari._id)}
                          className="p-2"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteShayari(shayari._id)}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
          
          {activeTab === 'liked' && (
            <div className="text-center py-8">
              <p className="text-gray-500">Liked shayaris will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}