import React, { useState } from 'react';
import { User, Mail, Calendar, Settings, LogOut, ShoppingBag, Heart, Star, Shield, Edit3, Save, X, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../contexts/CartContext';

const ProfilePage = ({ onBack }) => {
  const { user, logout } = useAuth();
  const { cartItems, cartTotal } = useCart();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || 'user@example.com',
    fullName: user?.fullName || 'User Name',
    phone: user?.phone || '+91 98765 43210',
    address: user?.address || 'Mumbai, Maharashtra, India'
  });

  const handleLogout = () => {
    logout();
  };

  const handleSave = () => {
    // Here you would typically save to backend
    console.log('Saving profile data:', profileData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setProfileData({
      username: user?.username || '',
      email: user?.email || 'user@example.com',
      fullName: user?.fullName || 'User Name',
      phone: user?.phone || '+91 98765 43210',
      address: user?.address || 'Mumbai, Maharashtra, India'
    });
    setIsEditing(false);
  };

  const stats = [
    { icon: ShoppingBag, label: 'Orders', value: '12', color: 'text-blue-600' },
    { icon: Heart, label: 'Wishlist', value: '8', color: 'text-red-600' },
    { icon: Star, label: 'Reviews', value: '15', color: 'text-yellow-600' },
    { icon: Shield, label: 'Points', value: '1,250', color: 'text-green-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back to Home</span>
              </button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DealFinder
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-xl hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="w-10 h-10" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{profileData.fullName}</h2>
                      <p className="text-blue-100">@{profileData.username}</p>
                      <p className="text-blue-100 text-sm">Member since {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-colors duration-200"
                  >
                    {isEditing ? <X className="w-6 h-6" /> : <Edit3 className="w-6 h-6" />}
                  </button>
                </div>
              </div>

              {/* Profile Form */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Username */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={profileData.username}
                        onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                        disabled={!isEditing}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 disabled:bg-gray-100"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        disabled={!isEditing}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 disabled:bg-gray-100"
                      />
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                      disabled={!isEditing}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 disabled:bg-gray-100"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!isEditing}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 disabled:bg-gray-100"
                    />
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <textarea
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      disabled={!isEditing}
                      rows="3"
                      className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 disabled:bg-gray-100 resize-none"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex justify-end space-x-4 mt-8">
                    <button
                      onClick={handleCancel}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Save className="w-5 h-5 inline mr-2" />
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-xl">
                    <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cart Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items in cart:</span>
                  <span className="font-semibold">{cartItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-bold text-blue-600">₹{cartTotal.toLocaleString()}</span>
                </div>
                <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  View Cart
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-xl transition-colors duration-200">
                  <span className="text-gray-700">Order History</span>
                  <ShoppingBag className="w-5 h-5 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-xl transition-colors duration-200">
                  <span className="text-gray-700">Wishlist</span>
                  <Heart className="w-5 h-5 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-xl transition-colors duration-200">
                  <span className="text-gray-700">Settings</span>
                  <Settings className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
