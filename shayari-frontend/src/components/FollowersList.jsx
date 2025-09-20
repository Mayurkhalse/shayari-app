import React, { useState, useEffect } from 'react';
import { Users, UserPlus, UserMinus } from 'lucide-react';
import { Button } from './ui/button';
import { UserAvatar } from './UserAvatar';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import LoadingSpinner from './LoadingSpinner';

export default function FollowersList({ userId, username, type = 'followers' }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen, userId, type]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = type === 'followers' ? '/user/followers' : '/user/following';
      const res = await api.get(endpoint);
      setUsers(res.data);
    } catch (err) {
      console.error('Fetch users error:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async (targetUserId, isCurrentlyFollowing) => {
    try {
      if (isCurrentlyFollowing) {
        await api.post(`/user/unfollow/${targetUserId}`);
      } else {
        await api.post(`/user/follow/${targetUserId}`);
      }
      
      // Refresh the list
      fetchUsers();
    } catch (err) {
      console.error('Follow toggle error:', err);
    }
  };

  const getTitle = () => {
    return type === 'followers' ? 'Followers' : 'Following';
  };

  const getIcon = () => {
    return type === 'followers' ? <Users className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />;
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
      >
        {getIcon()}
        <span>{getTitle()}</span>
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">{getTitle()}</h3>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <LoadingSpinner size="lg" />
              </div>
            ) : error ? (
              <div className="p-4 text-center">
                <p className="text-red-600 text-sm">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchUsers}
                  className="mt-2"
                >
                  Try Again
                </Button>
              </div>
            ) : users.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-gray-500 text-sm">
                  {type === 'followers' ? 'No followers yet' : 'Not following anyone'}
                </p>
              </div>
            ) : (
              <div className="p-2">
                {users.map((user) => (
                  <div key={user._id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <UserAvatar user={user} size="sm" />
                      <div>
                        <p className="font-medium text-sm text-gray-900">@{user.username}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    
                    {user._id !== currentUser?.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFollowToggle(user._id, user.isFollowing)}
                        className="text-xs"
                      >
                        {user.isFollowing ? 'Unfollow' : 'Follow'}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
