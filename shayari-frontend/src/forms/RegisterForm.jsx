import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const result = await register(username, email, password);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError("An error occurred while registering. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-semibold text-gray-900 mb-3 tracking-tight">
          Create account
        </h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="username" className="text-sm font-medium text-gray-700">
            Username
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full h-12 bg-gray-50/50 border-gray-300 focus:border-red-500 focus:ring-red-500 text-base placeholder:text-gray-400"
            required
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 bg-gray-50/50 border-gray-300 focus:border-red-500 focus:ring-red-500 text-base placeholder:text-gray-400"
            required
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 bg-gray-50/50 border-gray-300 focus:border-red-500 focus:ring-red-500 text-base placeholder:text-gray-400"
            required
          />
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-medium text-base rounded-lg transition-colors"
          disabled={loading}
        >
          {loading ? <LoadingSpinner size="sm" /> : 'Create account'}
        </Button>

        <div className="text-center pt-2">
          <span className="text-base text-gray-600">Already have an account? </span>
          <Link 
            to="/login" 
            className="text-base text-red-500 hover:text-red-600 transition-colors font-medium"
          >
            Sign in
          </Link>
        </div>
      </form>
    </div>
  )
}

export default RegisterForm
