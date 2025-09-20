import React, { useState, useEffect } from 'react';
import { UserPlus, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { UserAvatar } from './UserAvatar';
import api from '../utils/api';
import LoadingSpinner from './LoadingSpinner';

export default function FollowRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchRequests();
    }
  }, [isOpen]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await api.get('/user/follow-requests');
      setRequests(res.data);
    } catch (err) {
      console.error('Fetch requests error:', err);
      setError('Failed to load follow requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await api.post(`/user/approve-follow/${userId}`);
      setRequests(prev => prev.filter(req => req._id !== userId));
    } catch (err) {
      console.error('Approve error:', err);
    }
  };

  const handleReject = async (userId) => {
    try {
      await api.post(`/user/reject-follow/${userId}`);
      setRequests(prev => prev.filter(req => req._id !== userId));
    } catch (err) {
      console.error('Reject error:', err);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 relative"
      >
        <UserPlus className="w-4 h-4" />
        <span>Requests</span>
        {requests.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {requests.length}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Follow Requests</h3>
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
                  onClick={fetchRequests}
                  className="mt-2"
                >
                  Try Again
                </Button>
              </div>
            ) : requests.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-gray-500 text-sm">No pending requests</p>
              </div>
            ) : (
              <div className="p-2">
                {requests.map((request) => (
                  <div key={request._id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <UserAvatar user={request} size="sm" />
                      <div>
                        <p className="font-medium text-sm text-gray-900">@{request.username}</p>
                        <p className="text-xs text-gray-500">{request.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApprove(request._id)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(request._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
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
