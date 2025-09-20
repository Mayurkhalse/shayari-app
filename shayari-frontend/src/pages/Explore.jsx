import React, { useState, useEffect } from 'react';
import { Search, Filter, Users, Hash } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ShayariCard } from '../components/ShayariCard';
import { UserAvatar } from '../components/UserAvatar';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [shayaris, setShayaris] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('shayaris');
  const [genreFilter, setGenreFilter] = useState('all');

  const genres = [
    { value: 'all', label: 'All Genres' },
    { value: 'romantic', label: 'Romantic' },
    { value: 'sad', label: 'Sad' },
    { value: 'funny', label: 'Funny' },
    { value: 'motivational', label: 'Motivational' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    if (searchQuery.trim()) {
      const timeoutId = setTimeout(() => {
        performSearch();
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      // Load trending/popular content when no search
      loadTrendingContent();
    }
  }, [searchQuery, genreFilter]);

  const performSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (activeTab === 'shayaris') {
        const res = await api.get('/shayari/public');
        let filteredShayaris = res.data;
        
        // Filter by search query
        if (searchQuery.trim()) {
          filteredShayaris = filteredShayaris.filter(shayari =>
            shayari.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
            shayari.author.username.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        // Filter by genre
        if (genreFilter !== 'all') {
          filteredShayaris = filteredShayaris.filter(shayari => shayari.genre === genreFilter);
        }
        
        setShayaris(filteredShayaris);
      } else {
        // Search users (mock implementation - you'd need a user search endpoint)
        const res = await api.get('/user/search', {
          params: { q: searchQuery }
        });
        setUsers(res.data);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to perform search');
    } finally {
      setLoading(false);
    }
  };

  const loadTrendingContent = async () => {
    try {
      setLoading(true);
      const res = await api.get('/shayari/public');
      setShayaris(res.data);
    } catch (err) {
      console.error('Load trending error:', err);
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleGenreChange = (genre) => {
    setGenreFilter(genre);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Explore</h1>
        <p className="text-gray-600">Discover new shayaris and connect with poets</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search shayaris or users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {activeTab === 'shayaris' && (
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={genreFilter}
                onChange={(e) => handleGenreChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                {genres.map(genre => (
                  <option key={genre.value} value={genre.value}>
                    {genre.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('shayaris')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'shayaris'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Hash className="w-4 h-4" />
              <span>Shayaris</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'users'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Users</span>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={performSearch}>Try Again</Button>
            </div>
          ) : activeTab === 'shayaris' ? (
            <div className="space-y-4">
              {shayaris.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {searchQuery ? 'No shayaris found matching your search' : 'No shayaris available'}
                  </p>
                </div>
              ) : (
                shayaris.map((shayari) => (
                  <ShayariCard
                    key={shayari._id}
                    shayari={{
                      id: shayari._id,
                      content: shayari.text,
                      likes: shayari.likes.length,
                      isLiked: false, // You'd need to check if current user liked it
                      comments: 0,
                      createdAt: shayari.createdAt,
                      author: {
                        name: shayari.author.username,
                        username: shayari.author.username
                      }
                    }}
                  />
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {users.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {searchQuery ? 'No users found matching your search' : 'Search for users to discover'}
                  </p>
                </div>
              ) : (
                users.map((user) => (
                  <div key={user._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <UserAvatar user={user} size="md" />
                      <div>
                        <h3 className="font-medium text-gray-900">@{user.username}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = `/profile/${user.username}`}
                    >
                      View Profile
                    </Button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
