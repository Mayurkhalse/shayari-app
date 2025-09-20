import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, LogOut } from "lucide-react";
import { useAuth } from '../contexts/AuthContext';
import FollowRequests from './FollowRequests';
import NotificationBell from './NotificationBell';

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddShayari = () => {
    navigate('/addShayari');
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white shadow-sm">
      <div className="text-xl font-semibold text-red-600 mx-5">
        <Link to="/">Shayari</Link>
      </div>
      
      <ul className="hidden md:flex space-x-8 text-sm text-gray-600">
        <li>
          <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
        </li>
        <li>
          <Link to="/explore" className="hover:text-gray-900 transition-colors">Explore</Link>
        </li>
        <li>
          <Link to="/my-shayaris" className="hover:text-gray-900 transition-colors">My Shayaris</Link>
        </li>
      </ul>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Search">
          <Search className="w-5 h-5 text-gray-600" />
        </button>
        <NotificationBell />
        
        {isAuthenticated && (
          <FollowRequests />
        )}
        
        {isAuthenticated ? (
          <>
            <button 
              onClick={handleAddShayari}
              className="ml-4 rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors"
            >
              + Add Shayari
            </button>
            
            <div className="flex items-center space-x-2">
              <Link 
                to={`/profile/${user?.username}`}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{user?.username}</span>
              </Link>
              
              <button 
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </>
        ) : (
          <Link 
            to="/login" 
            className="ml-4 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar
