import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { UserAvatar } from './UserAvatar';
import CommentsSection from './CommentsSection';
import { useState } from 'react';
import api from '../utils/api';

export const ShayariCard = ({ shayari, onComment, onShare }) => {
  const [likes, setLikes] = useState(shayari.likes || 0);
  const [liked, setLiked] = useState(shayari.isLiked || false);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const res = await api.put(`/shayari/like/${shayari.id}`);
      setLikes(res.data.likesCount);
      setLiked(res.data.message === "Liked successfully");
    } catch (err) {
      console.error('Like error:', err);
    } finally {
      setLoading(false);
    }
  };
  const formatTimeAgo = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((now - postDate) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <UserAvatar user={shayari.author} size="md" />
          <div>
            <h4 className="text-sm font-semibold text-gray-900">{shayari.author.name}</h4>
            <p className="text-xs text-gray-500">@{shayari.author.username} • {formatTimeAgo(shayari.createdAt)}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="mb-4">
        {shayari.backgroundImage && (
          <div 
            className="w-full h-48 rounded-xl mb-4 bg-cover bg-center flex items-center justify-center p-6"
            style={{ backgroundImage: `url(${shayari.backgroundImage})` }}
          >
            <p className="poetry-text text-white text-center font-medium drop-shadow-lg">
              "{shayari.content}"
            </p>
          </div>
        )}
        {!shayari.backgroundImage && (
          <p className="poetry-text text-gray-800 leading-relaxed">
            "{shayari.content}"
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <div className="flex items-center space-x-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={loading}
            className={`p-0 h-auto font-normal hover:text-red-500 transition-colors ${
              liked ? 'text-red-500' : 'text-gray-500'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Heart className={`w-4 h-4 mr-2 ${liked ? 'fill-current' : ''}`} />
            <span className="text-sm">{likes}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onComment?.(shayari.id)}
            className="p-0 h-auto font-normal text-gray-500 hover:text-blue-500 transition-colors"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            <span className="text-sm">{shayari.comments || 0}</span>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onShare?.(shayari.id)}
          className="p-0 h-auto font-normal text-gray-500 hover:text-green-500 transition-colors"
        >
          <Share2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Comments Section */}
      <CommentsSection shayariId={shayari.id} />
    </div>
  );
};