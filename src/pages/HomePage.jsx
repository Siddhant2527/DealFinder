import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import CartModal from '../components/CartModal';
import AIChat from '../components/AIChat';
import ProfilePage from './ProfilePage';
import { ShoppingCart, MessageCircle, User } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const HomePage = () => {
    const { cartItems, isCartOpen, openCart, closeCart } = useCart();
    const [isAIChatOpen, setIsAIChatOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const cartItemCount = cartItems.length;

    const handleSearch = async (query) => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/products/search?query=${encodeURIComponent(query)}`);
            if (response.ok) {
                const results = await response.json();
                setSearchResults(results);
            } else {
                console.error('Search failed');
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Search error:', error);
        setSearchResults([]);
        } finally {
        setIsLoading(false);
        }
    };

    // If profile is open, show profile page
    if (isProfileOpen) {
        return <ProfilePage onBack={() => setIsProfileOpen(false)} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                DealFinder
                            </h1>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            {/* Profile Button */}
                            <button
                                onClick={() => setIsProfileOpen(true)}
                                className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <User className="w-5 h-5" />
                                <span className="hidden sm:inline">Profile</span>
                            </button>

                            {/* AI Chat Button */}
                            <button
                                onClick={() => setIsAIChatOpen(true)}
                                className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <MessageCircle className="w-5 h-5" />
                                <span className="hidden sm:inline">AI Assistant</span>
                            </button>

                            {/* Cart Button */}
                            <button
                                onClick={openCart}
                                className="relative flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                <span className="hidden sm:inline">Cart</span>
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-semibold">
                                        {cartItemCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        Find the Best
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Deals</span>
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Compare prices across multiple platforms and get AI-powered recommendations
                    </p>
                    
                    <SearchBar onSearch={handleSearch} isLoading={isLoading} />
                    
                    <div className="mt-6 text-sm text-gray-500">
                        Search any product to see <span className="text-blue-600 font-medium">ALL available deals</span> with price comparison
                    </div>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                    <div className="mt-12">
                        {/* Header Section */}
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-bold text-gray-900 mb-2">
                                🎯 All Available Products
                            </h3>
                            <p className="text-lg text-gray-600">
                                Found <span className="font-bold text-blue-600">{searchResults.length}</span> amazing deals across multiple platforms
                            </p>
                        </div>
                        
                        {/* Best Deal Banner */}
                        {searchResults.length > 1 && (
                            <div className="mb-8 p-6 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 rounded-2xl shadow-xl text-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="text-4xl">🏆</div>
                                        <div>
                                            <h4 className="text-xl font-bold">Best Deal of the Day!</h4>
                                            <p className="text-green-100">Lowest price guaranteed</p>
                                        </div>
                </div>
                                    <div className="text-right">
                                        {(() => {
                                            const bestDeal = searchResults.reduce((best, current) => 
                                                current.price < best.price ? current : best
                                            );
                                            return (
                                                <>
                                                    <p className="text-3xl font-bold">₹{bestDeal.price.toLocaleString()}</p>
                                                    <p className="text-green-100">{bestDeal.name}</p>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Category Filter */}
                        <div className="mb-8">
                            <div className="bg-white rounded-xl p-4 shadow-lg">
                                <h4 className="text-lg font-semibold text-gray-800 mb-3">Filter by Category</h4>
                                <div className="flex flex-wrap gap-3">
                                    {['All', 'iPhone', 'Samsung', 'Laptop', 'TV', 'Headphones', 'Camera', 'Tablet', 'Smartwatch', 'Gaming', 'Speaker', 'Accessories', 'Fitness'].map((category) => (
                                        <button
                                            key={category}
                                            className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        {/* Products Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {searchResults
                                .sort((a, b) => a.price - b.price) // Sort by price (lowest first)
                                .map((product, index) => (
                                <div key={product.id} className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 ${
                                    index === 0 ? 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50' : 'border-gray-100 hover:border-blue-200'
                                }`}>
                                    
                                    {/* Product Image */}
                                    <div className="relative h-48 overflow-hidden">
                                        <img 
                                            src={product.image} 
                                            alt={product.name} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                                        />
                                        
                                        {/* Best Price Badge */}
                                        {index === 0 && (
                                            <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse">
                                                🏆 BEST PRICE
                                            </div>
                                        )}
                                        
                                        {/* Platform Badge */}
                                        <div className="absolute top-3 right-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
                                            {product.platform}
                                        </div>
                                        
                                        {/* Rating Badge */}
                                        <div className="absolute bottom-3 left-3 bg-yellow-400 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
                                            ⭐ {product.rating}
                                        </div>
                                    </div>
                                    
                                    {/* Product Info */}
                                    <div className="p-6">
                                        <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                                            {product.name}
                                        </h4>
                                        
                                        {/* Price Section */}
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <p className="text-3xl font-bold text-blue-600">
                                                    ₹{product.price.toLocaleString()}
                                                </p>
                                                <p className="text-sm text-green-600 font-medium">
                                                    Save ₹{Math.floor(product.price * 0.1).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600">🚚 {product.delivery} days</p>
                                            </div>
                                        </div>
                                        
                                        {/* Action Buttons */}
                                        <div className="flex space-x-2">
                                            <a 
                                                href={product.link} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-center font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                            >
                                                View Deal
                                            </a>
                                            <button 
                                                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg"
                                                onClick={() => {
                                                    alert('Added to cart!');
                                                }}
                                                title="Add to Cart"
                                            >
                                                🛒
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Hover Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none"></div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Price Comparison Summary */}
                        {searchResults.length > 1 && (
                            <div className="mt-12 p-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl shadow-xl">
                                <h4 className="text-2xl font-bold text-gray-900 mb-6 text-center">📊 Price Comparison Summary</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="text-center p-4 bg-white rounded-xl shadow-md">
                                        <div className="text-3xl mb-2">💰</div>
                                        <p className="text-2xl font-bold text-green-600">
                                            ₹{Math.min(...searchResults.map(p => p.price)).toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-600 font-medium">Lowest Price</p>
                                    </div>
                                    <div className="text-center p-4 bg-white rounded-xl shadow-md">
                                        <div className="text-3xl mb-2">💸</div>
                                        <p className="text-2xl font-bold text-red-600">
                                            ₹{Math.max(...searchResults.map(p => p.price)).toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-600 font-medium">Highest Price</p>
                                    </div>
                                    <div className="text-center p-4 bg-white rounded-xl shadow-md">
                                        <div className="text-3xl mb-2">📈</div>
                                        <p className="text-2xl font-bold text-blue-600">
                                            ₹{Math.floor(searchResults.reduce((sum, p) => sum + p.price, 0) / searchResults.length).toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-600 font-medium">Average Price</p>
                                    </div>
                                    <div className="text-center p-4 bg-white rounded-xl shadow-md">
                                        <div className="text-3xl mb-2">💡</div>
                                        <p className="text-2xl font-bold text-purple-600">
                                            ₹{(Math.max(...searchResults.map(p => p.price)) - Math.min(...searchResults.map(p => p.price))).toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-600 font-medium">Price Difference</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    )}
                </main>

            {/* Cart Modal */}
            <CartModal isOpen={isCartOpen} onClose={closeCart} />

            {/* AI Chat Modal */}
            <AIChat isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
        </div>
    );
};

export default HomePage;