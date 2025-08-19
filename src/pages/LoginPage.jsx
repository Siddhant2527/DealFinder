// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tag, Eye, EyeOff, Loader2, Shield, User, Lock, Database, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { mockAuth } from '../utils/api.js';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginView, setIsLoginView] = useState(true);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [databaseStatus, setDatabaseStatus] = useState('checking'); // 'checking', 'connected', 'disconnected'
  const { login } = useAuth();

  // Check database status on component mount
  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  // Clear error when switching views
  useEffect(() => {
    setError('');
  }, [isLoginView]);

  const checkDatabaseStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/health');
      const data = await response.json();
      setDatabaseStatus(data.mongodb === 'connected' ? 'connected' : 'disconnected');
    } catch (error) {
      setDatabaseStatus('disconnected');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!username.trim() || !password.trim()) {
      setError('Username and password are required.');
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsSubmitting(false);
      return;
    }

    const endpoint = isLoginView ? 'login' : 'register';

    try {
      // Try backend first (database storage)
      try {
        const res = await axios.post(
          `http://localhost:5000/api/auth/${endpoint}`,
          { username, password }
        );
        
        // Successfully stored/authenticated in database
        login(res.data.username, res.data.token);
        console.log(`✅ User ${isLoginView ? 'logged in' : 'registered'} in database:`, res.data.username);
        
      } catch (backendErr) {
        // Check if it's a backend authentication error
        if (backendErr.response && backendErr.response.data && backendErr.response.data.msg) {
          // Backend returned an error message (like "Invalid credentials" or "User already exists")
          setError(backendErr.response.data.msg);
          setIsSubmitting(false);
          return;
        }
        
        // Backend not available, use mock authentication
        console.log('⚠️ Database not available, using mock authentication');
        const mockRes = await mockAuth(username, password, isLoginView);
        login(mockRes.username, mockRes.token);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setUsername('');
    setPassword('');
    setError('');
  };

  const getDatabaseStatusText = () => {
    switch (databaseStatus) {
      case 'connected':
        return 'Database Connected - User data will be stored securely';
      case 'disconnected':
        return 'Database Disconnected - Using demo mode';
      default:
        return 'Checking database connection...';
    }
  };

  const getDatabaseStatusIcon = () => {
    switch (databaseStatus) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'disconnected':
        return <Database className="h-5 w-5 text-yellow-400" />;
      default:
        return <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />;
    }
  };

  const getDatabaseStatusColor = () => {
    switch (databaseStatus) {
      case 'connected':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'disconnected':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-indigo-400 to-pink-400 rounded-full opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-10 animate-bounce delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Glass Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
              <Tag className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {isLoginView ? 'Welcome Back' : 'Join DealFinder'}
              </h2>
              <p className="mt-2 text-gray-600 text-sm">
                {isLoginView ? 'Sign in to continue your shopping journey' : 'Create your account to start finding deals'}
              </p>
            </div>
          </div>

          {/* Database Status */}
          <div className={`border rounded-xl p-4 ${getDatabaseStatusColor()}`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {getDatabaseStatusIcon()}
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium">
                  {databaseStatus === 'connected' ? 'Database Storage Active' : 'Demo Mode'}
                </h3>
                <p className="text-sm mt-1">
                  {getDatabaseStatusText()}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Shield className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  {isLoginView ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  {isLoginView ? 'Sign In' : 'Create Account'}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </>
              )}
            </button>
          </form>

          {/* Toggle View */}
          <div className="text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/80 backdrop-blur-sm text-gray-500">
                  {isLoginView ? "Don't have an account?" : "Already have an account?"}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleView}
              disabled={isSubmitting}
              className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline transition-colors duration-200 disabled:opacity-50"
            >
              {isLoginView ? 'Create new account' : 'Sign in to existing account'}
            </button>
          </div>

          {/* Demo Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Secure Authentication</h3>
                <p className="text-sm text-blue-700 mt-1">
                  {databaseStatus === 'connected' 
                    ? 'Your account data is stored securely in the database with encrypted passwords.'
                    : 'Demo mode: No data is stored permanently. Use any username/password to test.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
