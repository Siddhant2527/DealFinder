import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import CartModal from '../components/CartModal';
import AIChat from '../components/AIChat';
import ProfilePage from './ProfilePage';
import { ShoppingCart, MessageCircle, User } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const HomePage = () => {
    const { cartItems, isCartOpen, openCart, closeCart, cartCount, addToCart } = useCart();
    const [isAIChatOpen, setIsAIChatOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [dataSource, setDataSource] = useState('');
    const [addedToCart, setAddedToCart] = useState({});
    const [showCartNotification, setShowCartNotification] = useState(false);

    // Helper function to check if product is new (added within 24 hours)
    const isNewProduct = (product) => {
        if (!product.createdAt) return false;
        const createdDate = new Date(product.createdAt);
        const now = new Date();
        const hoursDiff = (now - createdDate) / (1000 * 60 * 60);
        return hoursDiff <= 24;
    };

    // Helper function to get platform-specific styling
    const getPlatformStyle = (platform) => {
        const styles = {
            'Amazon': { bg: 'from-orange-400 to-orange-600', icon: '🛒' },
            'Flipkart': { bg: 'from-blue-400 to-blue-600', icon: '🛍️' },
            'Apple Store': { bg: 'from-gray-700 to-gray-900', icon: '🍎' },
            'Samsung Store': { bg: 'from-blue-600 to-blue-800', icon: '📱' },
            'Sony Store': { bg: 'from-black to-gray-700', icon: '🎮' },
            'Canon Store': { bg: 'from-red-600 to-red-800', icon: '📷' },
            'Dell Store': { bg: 'from-blue-700 to-blue-900', icon: '💻' },
            'HP': { bg: 'from-blue-500 to-blue-700', icon: '🖨️' },
            'Croma': { bg: 'from-red-500 to-red-700', icon: '🔌' },
            'Reliance Digital': { bg: 'from-purple-600 to-purple-800', icon: '🏪' },
            'Microsoft Store': { bg: 'from-green-600 to-green-800', icon: '🪟' },
            'default': { bg: 'from-purple-500 to-purple-700', icon: '🛍️' }
        };
        return styles[platform] || styles.default;
    };

    const cartItemCount = cartCount;

    const handleAddToCart = (product) => {
        addToCart(product);
        setAddedToCart(prev => ({ ...prev, [product.id]: true }));
        setShowCartNotification(true);
        setTimeout(() => {
            setAddedToCart(prev => ({ ...prev, [product.id]: false }));
            setShowCartNotification(false);
        }, 2000);
    };

    const handleSearch = async (query) => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/products/scrape?query=${encodeURIComponent(query)}`);
            if (response.ok) {
                const results = await response.json();
                // Handle both old and new response formats
                const products = results.results || results.products || results;
                setSearchResults(products);
                
                // Set data source and last updated time
                if (results.source) {
                    setDataSource(results.source);
                    setLastUpdated(new Date().toLocaleTimeString());
                    console.log(`Data source: ${results.source} (${results.source === 'database' ? 'Recent cached data' : 'Freshly scraped'})`);
                }
                
                // Show best deal if available
                if (results.bestDeal) {
                    console.log(`Best deal: ${results.bestDeal.name} at ₹${results.bestDeal.price}`);
                }
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
            <header className="bg-white/95 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                                DealFinder
                            </h1>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            {/* Profile Button */}
                            <button
                                onClick={() => setIsProfileOpen(true)}
                                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <User className="w-5 h-5" />
                                <span className="hidden sm:inline">Profile</span>
                            </button>

                            {/* AI Chat Button */}
                            <button
                                onClick={() => setIsAIChatOpen(true)}
                                className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 rounded-xl hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <MessageCircle className="w-5 h-5" />
                                <span className="hidden sm:inline">AI Assistant</span>
                            </button>

                            {/* Cart Button */}
                            <button
                                onClick={openCart}
                                className="relative flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                <span className="hidden sm:inline">Cart</span>
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-semibold">
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
                    <h2 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
                        Find the Best
                        <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent"> Deals</span>
                    </h2>
                    <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                        Compare prices across multiple platforms and get AI-powered recommendations
                    </p>
                    
                    <SearchBar onSearch={handleSearch} isLoading={isLoading} />
                    
                    <div className="mt-6 text-sm text-slate-500">
                        Search any product to see <span className="text-blue-600 font-medium">ALL available deals</span> with price comparison
                    </div>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                    <div className="mt-12">
                        {/* Header Section */}
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-bold text-slate-800 mb-2">
                                🎯 All Available Products
                            </h3>
                            <p className="text-lg text-slate-600">
                                Found <span className="font-bold text-blue-600">{searchResults.length}</span> amazing deals across multiple platforms
                            </p>
                            {/* Data Source Indicator */}
                            <div className="mt-4 flex justify-center">
                                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full text-sm font-medium text-blue-700 border border-blue-200">
                                    <span className={`w-2 h-2 rounded-full mr-2 ${dataSource === 'database' ? 'bg-blue-500' : 'bg-emerald-500 animate-pulse'}`}></span>
                                    {dataSource === 'database' ? '🗄️ Cached data (24h)' : '⚡ Freshly scraped'}
                                    {lastUpdated && ` • Updated ${lastUpdated}`}
                                </div>
                            </div>
                        </div>
                        
                        {/* Best Deal Banner */}
                        {searchResults.length > 1 && (
                            <div className="mb-8 p-6 bg-gradient-to-r from-emerald-100 via-green-100 to-teal-100 rounded-2xl shadow-xl text-emerald-800 border-2 border-emerald-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="text-5xl animate-bounce">🏆</div>
                                        <div>
                                            <h4 className="text-2xl font-bold mb-1 text-emerald-800">🎯 BEST DEAL OF THE DAY!</h4>
                                            <p className="text-emerald-700 font-medium">Lowest price across all platforms</p>
                                        </div>
                                    </div>
                                    <a 
                                        href={searchResults.reduce((best, current) => current.price < best.price ? current : best).link}
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-right bg-white/80 backdrop-blur-sm rounded-xl p-4 hover:bg-white/90 transition-all duration-200 cursor-pointer group border border-emerald-200"
                                    >
                                        {(() => {
                                            const bestDeal = searchResults.reduce((best, current) => 
                                                current.price < best.price ? current : best
                                            );
                                            const savings = Math.max(...searchResults.map(p => p.price)) - bestDeal.price;
                                            return (
                                                <>
                                                    <p className="text-4xl font-bold mb-1 text-emerald-800">₹{bestDeal.price.toLocaleString()}</p>
                                                    <p className="text-lg font-semibold text-emerald-700 mb-1">{bestDeal.name}</p>
                                                    <p className="text-sm bg-emerald-200/80 px-2 py-1 rounded-full inline-block text-emerald-800">
                                                        💰 Save ₹{savings.toLocaleString()} vs highest price
                                                    </p>
                                                    <div className="mt-2 text-sm font-medium text-white bg-emerald-600 rounded-full px-3 py-1 inline-block group-hover:bg-emerald-700 transition-colors duration-200">
                                                        🛒 Click to View Deal →
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </a>
                                </div>
                                <div className="mt-4 flex items-center justify-center">
                                    <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-emerald-700 border border-emerald-200">
                                        ⭐ Verified best deal across {searchResults.length} platforms
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Category Filter */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-700 mb-4">🛍️ Popular Categories</h3>
                            <div className="flex flex-wrap gap-3">
                                {['iPhone', 'Samsung', 'laptop', 'TV', 'headphones', 'camera', 'tablet', 'smartwatch', 'gaming'].map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setSearchQuery(category)}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 font-semibold rounded-xl hover:from-blue-200 hover:to-purple-200 transition-all duration-200 shadow-md transform hover:-translate-y-1 capitalize border border-blue-200"
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        {/* Products Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {searchResults
                                .sort((a, b) => a.price - b.price) // Sort by price (lowest first)
                                .map((product, index) => (
                                <div key={product.id} className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 ${
                                    index === 0 ? 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50' : 'border-gray-100 hover:border-blue-200'
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
                                            <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-200 to-yellow-300 text-amber-800 px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse">
                                                🏆 BEST PRICE
                                            </div>
                                        )}

                                        {/* New Product Badge */}
                                        {isNewProduct(product) && (
                                            <div className="absolute top-3 left-3 bg-gradient-to-r from-emerald-200 to-green-300 text-emerald-800 px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-bounce">
                                                🆕 NEW
                                            </div>
                                        )}
                                        
                                        {/* Platform Badge */}
                                        <div className={`absolute top-3 right-3 bg-gradient-to-r ${getPlatformStyle(product.platform).bg} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg border border-white/20 flex items-center gap-1`}>
                                            <span>{getPlatformStyle(product.platform).icon}</span>
                                            <span>{product.platform}</span>
                                        </div>
                                        
                                        {/* Rating Badge */}
                                        <div className="absolute bottom-3 left-3 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium shadow-lg">
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
                                                <p className="text-3xl font-bold text-emerald-700">
                                                    ₹{product.price.toLocaleString()}
                                                </p>
                                                <p className="text-sm text-emerald-600 font-medium">
                                                    💰 Save ₹{Math.floor(product.price * 0.1).toLocaleString()} (10% off)
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className={`flex items-center text-sm mb-1 ${typeof product.delivery === 'string' && product.delivery?.toLowerCase().includes('free') ? 'text-emerald-700 font-medium' : 'text-gray-600'}`}>
                                                    <span className="mr-1">🚚</span>
                                                    {typeof product.delivery === 'number' ? `${product.delivery} days` : product.delivery}
                                                </div>
                                                <div className="flex items-center text-sm text-yellow-700 font-medium">
                                                    <span className="mr-1">⭐</span>
                                                    {product.rating}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Product Description */}
                                        {product.description && (
                                            <div className="mb-3">
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {product.description}
                                                </p>
                                            </div>
                                        )}
                                        
                                        {/* Action Buttons */}
                                        <div className="flex space-x-2">
                                            <a 
                                                href={product.link} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 text-center font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                            >
                                                View Deal
                                            </a>
                                            <button 
                                                className={`px-4 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-semibold ${
                                                    addedToCart[product.id] 
                                                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' 
                                                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
                                                }`}
                                                onClick={() => handleAddToCart(product)}
                                                title={addedToCart[product.id] ? 'Added!' : 'Add to Cart'}
                                            >
                                                {addedToCart[product.id] ? '✅' : '🛒'}
                                            </button>
                                            <button 
                                                className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
                                                onClick={() => {
                                                    alert('Added to wishlist!');
                                                }}
                                                title="Add to Wishlist"
                                            >
                                                ❤️
                                            </button>
                                            <button 
                                                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-semibold border border-gray-300"
                                                onClick={() => {
                                                    alert('Simple button clicked!');
                                                }}
                                                title="Simple Action"
                                            >
                                                ⋯
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

            {/* Cart Notification */}
            {showCartNotification && (
                <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-lg animate-bounce">
                    <div className="flex items-center space-x-2">
                        <span>✅</span>
                        <span>Product added to cart!</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;