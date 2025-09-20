import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function EditShayari() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [text, setText] = useState('');
  const [genre, setGenre] = useState('other');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchShayari();
  }, [id]);

  const fetchShayari = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await api.get(`/shayari/${id}`);
      const shayari = res.data;
      
      // Check if user owns this shayari
      if (shayari.author._id !== user.id) {
        navigate('/my-shayaris');
        return;
      }
      
      setText(shayari.text);
      setGenre(shayari.genre);
      setIsPublic(shayari.isPublic);
    } catch (err) {
      console.error('Fetch shayari error:', err);
      setError('Failed to load shayari');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      await api.put(`/shayari/edit/${id}`, {
        text,
        genre,
        isPublic
      });
      
      navigate('/my-shayaris');
    } catch (err) {
      console.error('Update shayari error:', err);
      setError(err.response?.data?.message || 'Failed to update shayari');
    } finally {
      setSaving(false);
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
        <Button onClick={() => navigate('/my-shayaris')}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Edit Shayari</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Shayari
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="Write your shayari..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Genre
          </label>
          <select 
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
          >
            <option value="romantic">Romantic</option>
            <option value="sad">Sad</option>
            <option value="funny">Funny</option>
            <option value="motivational">Motivational</option>
            <option value="other">Other</option>
          </select>
        </div>
       
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
          />
          <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
            Make Public
          </label>
        </div>
        
        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/my-shayaris')}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="flex-1 bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner size="sm" />
                <span className="ml-2">Saving...</span>
              </div>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
