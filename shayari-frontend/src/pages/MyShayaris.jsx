import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit3, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ShayariCard } from '../components/ShayariCard';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function MyShayaris() {
  const [shayaris, setShayaris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, public, private
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyShayaris();
  }, []);

  const fetchMyShayaris = async () => {
    const token = localStorage.getItem('token');
      console.log("Token:", token);
    try {
      setLoading(true);
      setError(null);
      
      const res = await api.get('/shayari/my-shayaris');
      setShayaris(res.data);
    } catch (err) {
      console.error('Fetch my shayaris error:', err);
      setError('Failed to load your shayaris');
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
      alert('Failed to delete shayari');
    }
  };

  const handleTogglePrivacy = async (shayariId, currentPrivacy) => {
    try {
      await api.put(`/shayari/edit/${shayariId}`, {
        isPublic: !currentPrivacy
      });
      
      setShayaris(prev => prev.map(s => 
        s._id === shayariId ? { ...s, isPublic: !currentPrivacy } : s
      ));
    } catch (err) {
      console.error('Privacy toggle error:', err);
      alert('Failed to update privacy');
    }
  };

  const filteredShayaris = shayaris.filter(shayari => {
    if (filter === 'all') return true;
    if (filter === 'public') return shayari.isPublic;
    if (filter === 'private') return !shayari.isPublic;
    return true;
  });

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
        <Button onClick={fetchMyShayaris}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Shayaris</h1>
          <p className="text-gray-600">Manage your poetry collection</p>
        </div>
        <Button
          onClick={() => navigate('/addShayari')}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Shayari</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setFilter('all')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                filter === 'all'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              All ({shayaris.length})
            </button>
            <button
              onClick={() => setFilter('public')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                filter === 'public'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Public ({shayaris.filter(s => s.isPublic).length})
            </button>
            <button
              onClick={() => setFilter('private')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                filter === 'private'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Private ({shayaris.filter(s => !s.isPublic).length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {filteredShayaris.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                {filter === 'all' 
                  ? "You haven't written any shayaris yet"
                  : `No ${filter} shayaris found`
                }
              </p>
              {filter === 'all' && (
                <Button
                  onClick={() => navigate('/addShayari')}
                  className="flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Write your first shayari</span>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredShayaris.map((shayari) => (
                <div key={shayari._id} className="relative">
                  <ShayariCard
                    shayari={{
                      id: shayari._id,
                      content: shayari.text,
                      likes: shayari.likes.length,
                      isLiked: shayari.likes.includes(user?.id),
                      comments: 0,
                      createdAt: shayari.createdAt,
                      author: {
                        name: user.username,
                        username: user.username
                      }
                    }}
                  />
                  
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTogglePrivacy(shayari._id, shayari.isPublic)}
                      className="p-2"
                      title={shayari.isPublic ? 'Make Private' : 'Make Public'}
                    >
                      {shayari.isPublic ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditShayari(shayari._id)}
                      className="p-2"
                      title="Edit Shayari"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteShayari(shayari._id)}
                      className="p-2 text-red-500 hover:text-red-700"
                      title="Delete Shayari"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}