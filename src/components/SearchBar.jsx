import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, TrendingUp, X, ArrowRight } from 'lucide-react';

const SearchBar = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);
    const suggestionsRef = useRef(null);

    const popularSearches = [
        { text: "iPhone 13", icon: "📱", category: "Smartphones" },
        { text: "Samsung Galaxy", icon: "📱", category: "Smartphones" },
        { text: "Laptop", icon: "💻", category: "Computers" },
        { text: "TV", icon: "📺", category: "Electronics" },
        { text: "Headphones", icon: "🎧", category: "Audio" },
        { text: "Camera", icon: "📷", category: "Photography" },
        { text: "Tablet", icon: "📱", category: "Mobile" },
        { text: "Smartwatch", icon: "⌚", category: "Wearables" },
        { text: "Gaming", icon: "🎮", category: "Gaming" },
        { text: "Speaker", icon: "🔊", category: "Audio" }
    ];

    useEffect(() => {
        if (query.trim()) {
            const filtered = popularSearches.filter(item =>
                item.text.toLowerCase().includes(query.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setSuggestions(popularSearches);
            setShowSuggestions(isFocused);
        }
        setSelectedIndex(-1);
    }, [query, isFocused]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
                setShowSuggestions(false);
                setIsFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => 
                prev < suggestions.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        } else if (e.key === 'Enter') {
    e.preventDefault();
            if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                handleSuggestionClick(suggestions[selectedIndex].text);
            } else {
                handleSearch();
            }
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
            setSelectedIndex(-1);
            setIsFocused(false);
        }
    };

    const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
            setIsFocused(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion);
        onSearch(suggestion);
    setShowSuggestions(false);
        setSelectedIndex(-1);
        setIsFocused(false);
    };

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const clearSearch = () => {
        setQuery('');
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.focus();
    };

  return (
        <div className="relative w-full max-w-4xl mx-auto" ref={suggestionsRef}>
            {/* Main Search Container */}
            <div className="relative group">
                {/* Search Input */}
        <div className="relative">
          <input 
                        ref={inputRef}
            type="text" 
            value={query} 
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => {
                            setIsFocused(true);
                            setShowSuggestions(true);
                        }}
                        placeholder="Search for products, brands, or categories..."
                        className="w-full px-6 py-4 pl-16 pr-20 text-lg bg-white/90 backdrop-blur-xl border-2 border-white/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 shadow-xl transition-all duration-300 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    />
                    
                    {/* Search Icon */}
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <div className="relative">
                            <Search className="h-6 w-6 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-200"></div>
                        </div>
                    </div>

                    {/* Clear Button */}
                    {query && (
                        <button
                            onClick={clearSearch}
                            className="absolute inset-y-0 right-16 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}

                    {/* Search Button */}
          <button 
                        onClick={handleSearch}
                        disabled={isLoading || !query.trim()}
                        className="absolute inset-y-0 right-0 px-6 flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-r-2xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                <span className="font-medium">Searching...</span>
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <span className="font-medium mr-2">Search</span>
                                <ArrowRight className="h-4 w-4" />
                            </div>
                        )}
          </button>
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10"></div>
        </div>
        
        {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-3 bg-white/95 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl max-h-96 overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3 border-b border-white/30 rounded-t-2xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <TrendingUp className="h-4 w-4 text-blue-500 mr-2" />
                                <span className="text-sm font-medium text-gray-700">
                                    {query.trim() ? 'Search Suggestions' : 'Popular Searches'}
                                </span>
                            </div>
                            <Sparkles className="h-4 w-4 text-purple-500" />
                        </div>
                    </div>

                    {/* Suggestions List */}
                    <div className="py-2">
                        {suggestions.map((suggestion, index) => (
              <button
                                key={suggestion.text}
                                onClick={() => handleSuggestionClick(suggestion.text)}
                                className={`w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 focus:bg-gradient-to-r focus:from-blue-50 focus:to-purple-50 focus:outline-none transition-all duration-150 ${
                                    index === selectedIndex ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500' : ''
                                } ${index === 0 ? 'rounded-t-lg' : ''} ${index === suggestions.length - 1 ? 'rounded-b-2xl' : ''}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <span className="text-xl mr-3">{suggestion.icon}</span>
                <div>
                                            <div className="font-medium text-gray-800">{suggestion.text}</div>
                                            <div className="text-sm text-gray-500">{suggestion.category}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full mr-2">
                                            {suggestion.category}
                                        </span>
                                        <ArrowRight className="h-4 w-4 text-gray-400" />
                                    </div>
                </div>
              </button>
            ))}
          </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 bg-gradient-to-r from-gray-50 to-blue-50 px-4 py-2 border-t border-white/30 rounded-b-2xl">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Press Enter to search</span>
                            <span>Use ↑↓ to navigate</span>
        </div>
      </div>
                </div>
            )}

            {/* Quick Tips */}
            {!query && !showSuggestions && (
                <div className="mt-4 text-center">
                    <div className="inline-flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            Try: iPhone 13
                        </span>
                        <span className="flex items-center">
                            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                            Try: Samsung Galaxy
                        </span>
                        <span className="flex items-center">
                            <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                            Try: Laptop
                        </span>
                    </div>
                </div>
            )}
    </div>
  );
};

export default SearchBar;
