import React, { useState, useEffect } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { Button } from './ui/button';
import { UserAvatar } from './UserAvatar';
import Comment from './Comment';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import LoadingSpinner from './LoadingSpinner';

export default function CommentsSection({ shayariId, initialComments = [] }) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, shayariId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/comment/shayari/${shayariId}`);
      setComments(res.data);
    } catch (err) {
      console.error('Fetch comments error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    setLoading(true);
    try {
      const res = await api.post('/comment', {
        text: newComment,
        shayariId: shayariId
      });
      
      setComments(prev => [res.data, ...prev]);
      setNewComment('');
    } catch (err) {
      console.error('Add comment error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditComment = (commentId, newText) => {
    setComments(prev => prev.map(comment => 
      comment._id === commentId ? { ...comment, text: newText } : comment
    ));
  };

  const handleDeleteComment = (commentId) => {
    setComments(prev => prev.filter(comment => comment._id !== commentId));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  return (
    <div className="border-t border-gray-100 pt-4">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <MessageCircle className="w-4 h-4" />
        <span>{comments.length} comments</span>
      </button>

      {isOpen && (
        <div className="space-y-4">
          {/* Add Comment Form */}
          <div className="flex items-start space-x-3">
            <UserAvatar user={currentUser} size="sm" />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Write a comment..."
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows={3}
              />
              <div className="mt-2 flex justify-end">
                <Button
                  size="sm"
                  onClick={handleAddComment}
                  disabled={loading || !newComment.trim()}
                  className="bg-red-500 hover:bg-red-600 text-white flex items-center space-x-2"
                >
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Comment</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          {loading && comments.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <LoadingSpinner size="lg" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  onEdit={handleEditComment}
                  onDelete={handleDeleteComment}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
