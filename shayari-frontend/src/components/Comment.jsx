import React, { useState } from 'react';
import { MessageCircle, Edit3, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { UserAvatar } from './UserAvatar';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import LoadingSpinner from './LoadingSpinner';

export default function Comment({ 
  comment, 
  onEdit, 
  onDelete, 
  onReply 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [loading, setLoading] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []);
  const [newReply, setNewReply] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  
  const { user: currentUser } = useAuth();
  const isOwner = currentUser?.id === comment.author._id;

  const handleEdit = async () => {
    if (!editText.trim()) return;
    
    setLoading(true);
    try {
      await api.put(`/comment/${comment._id}`, { text: editText });
      onEdit(comment._id, editText);
      setIsEditing(false);
    } catch (err) {
      console.error('Edit comment error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    setLoading(true);
    try {
      await api.delete(`/comment/${comment._id}`);
      onDelete(comment._id);
    } catch (err) {
      console.error('Delete comment error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!newReply.trim()) return;
    
    setReplyLoading(true);
    try {
      const res = await api.post('/comment', {
        text: newReply,
        shayariId: comment.shayariId,
        parentId: comment._id
      });
      
      setReplies(prev => [...prev, res.data]);
      setNewReply('');
      setShowReplies(true);
    } catch (err) {
      console.error('Reply error:', err);
    } finally {
      setReplyLoading(false);
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInSeconds = Math.floor((now - commentDate) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  return (
    <div className="border-l-2 border-gray-100 pl-4 py-2">
      <div className="flex items-start space-x-3">
        <UserAvatar user={comment.author} size="sm" />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm text-gray-900">
              @{comment.author.username}
            </span>
            <span className="text-xs text-gray-500">
              {formatTimeAgo(comment.createdAt)}
            </span>
          </div>
          
          {isEditing ? (
            <div className="mt-2 space-y-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows={2}
              />
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={handleEdit}
                  disabled={loading}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  {loading ? <LoadingSpinner size="sm" /> : 'Save'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditText(comment.text);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-1">
              <p className="text-sm text-gray-800">{comment.text}</p>
              
              <div className="flex items-center space-x-4 mt-2">
                <button
                  onClick={() => setShowReplies(!showReplies)}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>{replies.length} replies</span>
                </button>
                
                {isOwner && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={loading}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Replies Section */}
      {showReplies && (
        <div className="mt-4 space-y-3">
          {/* Add Reply Form */}
          <div className="flex items-start space-x-3">
            <UserAvatar user={currentUser} size="sm" />
            <div className="flex-1">
              <textarea
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                placeholder="Write a reply..."
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows={2}
              />
              <div className="mt-2">
                <Button
                  size="sm"
                  onClick={handleReply}
                  disabled={replyLoading || !newReply.trim()}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  {replyLoading ? <LoadingSpinner size="sm" /> : 'Reply'}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Replies List */}
          {replies.map((reply) => (
            <Comment
              key={reply._id}
              comment={reply}
              onEdit={onEdit}
              onDelete={onDelete}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}
