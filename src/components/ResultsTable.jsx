import React from 'react';
import { ShoppingCart, Star, Zap, Clock, ExternalLink, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ResultsTable = ({ results, bestDeal }) => {
  const { addToCart } = useCart();
  
  if (!results.length) {
    return (
      <div className="text-center py-20 px-6 glass-effect rounded-2xl">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
          <Search className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">No Results Found</h3>
        <p className="text-gray-500 max-w-md mx-auto">Try searching for different products or check our popular suggestions above.</p>
      </div>
    );
  }

  // Group results by product name for better organization
  const groupedResults = results.reduce((acc, item) => {
    const key = item.name || item.platform;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {/* Results Summary */}
      <div className="glass-effect rounded-2xl p-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Found {results.length} products from {Object.keys(groupedResults).length} different items
            </h2>
            <p className="text-gray-600">Compare prices and find the best deals across multiple stores</p>
          </div>
          {bestDeal && (
            <div className="flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-xl text-sm font-semibold shadow-lg">
              <Zap size={18} className="mr-2" />
              Best Deal: ₹{bestDeal.price.toLocaleString('en-IN')}
            </div>
          )}
        </div>
      </div>

      {/* Product Cards */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(groupedResults).map(([productName, items]) => (
          <div key={productName} className="glass-effect rounded-2xl overflow-hidden card-hover">
            {/* Product Header */}
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center mb-4">
                {items[0].image && (
                  <img 
                    src={items[0].image} 
                    alt={productName}
                    className="w-20 h-20 object-cover rounded-xl mr-4 shadow-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-xl mb-1">{productName}</h3>
                  <p className="text-sm text-gray-500 font-medium">{items.length} options available</p>
                </div>
              </div>
            </div>

            {/* Store Options */}
            <div className="divide-y divide-white/10">
              {items.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`p-6 transition-all duration-300 ${
                    bestDeal && item.id === bestDeal.id ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-3xl mr-4">{item.logo}</span>
                      <div>
                        <div className="font-semibold text-gray-800 text-lg">{item.platform}</div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Star size={16} className="mr-1 text-yellow-500" fill="currentColor" />
                          {item.rating} • {item.delivery} {item.delivery > 1 ? 'Days' : 'Day'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">₹{item.price.toLocaleString('en-IN')}</div>
                      {bestDeal && item.id === bestDeal.id && (
                        <div className="text-xs text-green-600 font-semibold bg-green-100 px-2 py-1 rounded-full">Best Price</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex-1 inline-flex items-center justify-center px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <ExternalLink size={16} className="mr-2" />
                      Buy Now
                    </a>
                    <button 
                      onClick={() => addToCart(item)} 
                      className="px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsTable;

