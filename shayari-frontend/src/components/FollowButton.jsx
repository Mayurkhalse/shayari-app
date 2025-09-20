import React, { useState } from 'react';
import { UserPlus, UserMinus, Check } from 'lucide-react';
import { Button } from './ui/button';
import api from '../utils/api';
import LoadingSpinner from './LoadingSpinner';

export default function FollowButton({ 
  userId, 
  username, 
  isFollowing: initialIsFollowing, 
  onFollowChange,
  size = 'default',
  variant = 'default'
}) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);
  const [justFollowed, setJustFollowed] = useState(false);

  const handleFollow = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      if (isFollowing) {
        await api.post(`/user/unfollow/${userId}`);
        setIsFollowing(false);
        setJustFollowed(false);
      } else {
        await api.post(`/user/follow/${userId}`);
        setIsFollowing(true);
        setJustFollowed(true);
        
        // Reset the "just followed" state after 2 seconds
        setTimeout(() => setJustFollowed(false), 2000);
      }
      
      // Notify parent component of the change
      if (onFollowChange) {
        onFollowChange(!isFollowing);
      }
    } catch (err) {
      console.error('Follow error:', err);
      // You might want to show a toast notification here
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (loading) return '';
    if (justFollowed) return 'Following';
    if (isFollowing) return 'Unfollow';
    return 'Follow';
  };

  const getButtonIcon = () => {
    if (loading) return <LoadingSpinner size="sm" />;
    if (justFollowed) return <Check className="w-4 h-4" />;
    if (isFollowing) return <UserMinus className="w-4 h-4" />;
    return <UserPlus className="w-4 h-4" />;
  };

  const getButtonClass = () => {
    const baseClass = 'flex items-center space-x-2 transition-all duration-200';
    
    if (justFollowed) {
      return `${baseClass} bg-green-500 hover:bg-green-600 text-white`;
    }
    
    if (isFollowing) {
      return `${baseClass} bg-gray-500 hover:bg-gray-600 text-white`;
    }
    
    return `${baseClass} bg-red-500 hover:bg-red-600 text-white`;
  };

  return (
    <Button
      onClick={handleFollow}
      disabled={loading}
      size={size}
      variant={variant}
      className={getButtonClass()}
    >
      {getButtonIcon()}
      <span>{getButtonText()}</span>
    </Button>
  );
}
