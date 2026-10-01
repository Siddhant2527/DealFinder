import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Search, TrendingUp, X } from 'lucide-react';

const popularSearches = [
    { text: 'iPhone 13', icon: '📱', category: 'Phones' },
    { text: 'Samsung Galaxy S24', icon: '📱', category: 'Phones' },
    { text: 'MacBook Air', icon: '💻', category: 'Laptops' },
    { text: 'Sony headphones', icon: '🎧', category: 'Audio' },
    { text: 'iPad', icon: '▰', category: 'Tablets' },
    { text: 'PlayStation 5', icon: '🎮', category: 'Gaming' },
];

const SearchBar = ({ onSearch, isLoading }) => {
    const [query, setQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    const suggestions = query.trim()
        ? popularSearches.filter(item => item.text.toLowerCase().includes(query.toLowerCase()))
        : popularSearches;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const submitSearch = (value = query) => {
        const cleanQuery = value.trim();
        if (!cleanQuery || isLoading) return;
        setQuery(cleanQuery);
        setShowSuggestions(false);
        onSearch(cleanQuery);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowDown' && showSuggestions && suggestions.length) {
            event.preventDefault();
            setSelectedIndex(index => Math.min(index + 1, suggestions.length - 1));
        } else if (event.key === 'ArrowUp' && showSuggestions && suggestions.length) {
            event.preventDefault();
            setSelectedIndex(index => Math.max(index - 1, -1));
        } else if (event.key === 'Enter') {
            event.preventDefault();
            submitSearch(selectedIndex >= 0 ? suggestions[selectedIndex]?.text : query);
        } else if (event.key === 'Escape') {
            setShowSuggestions(false);
            setSelectedIndex(-1);
        }
    };

    const clearSearch = () => {
        setQuery('');
        setSelectedIndex(-1);
        inputRef.current?.focus();
    };

    return (
        <div ref={containerRef} className="relative mx-auto w-full">
            <div className="flex min-h-[60px] items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 transition focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-100 sm:min-h-[68px] sm:px-5">
                <Search size={22} className="shrink-0 text-slate-400" />
                <input
                    ref={inputRef}
                    type="search"
                    value={query}
                    onChange={event => {
                        setQuery(event.target.value);
                        setSelectedIndex(-1);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search a product, brand or model..."
                    aria-label="Search electronics"
                    aria-expanded={showSuggestions && suggestions.length > 0}
                    autoComplete="off"
                    disabled={isLoading}
                    className="min-w-0 flex-1 bg-transparent py-3 text-sm font-medium text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400 disabled:opacity-60 sm:text-base"
                />
                {query && (
                    <button onClick={clearSearch} type="button" className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Clear search">
                        <X size={17} />
                    </button>
                )}
                <button
                    onClick={() => submitSearch()}
                    type="button"
                    disabled={isLoading || !query.trim()}
                    className="flex h-11 shrink-0 items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:px-5"
                >
                    <span className="hidden sm:inline">{isLoading ? 'Searching' : 'Compare prices'}</span>
                    {isLoading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : <ArrowRight size={17} />}
                </button>
            </div>

            {showSuggestions && suggestions.length > 0 && !isLoading && (
                <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-[0_22px_60px_rgba(15,23,42,.2)]">
                    <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 text-[11px] font-bold uppercase tracking-[.14em] text-slate-400">
                        <TrendingUp size={15} className="text-indigo-500" />
                        {query.trim() ? 'Popular matches' : 'Popular electronics searches'}
                    </div>
                    <div className="grid gap-1 p-2 sm:grid-cols-2">
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={suggestion.text}
                                onMouseEnter={() => setSelectedIndex(index)}
                                onClick={() => submitSearch(suggestion.text)}
                                type="button"
                                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left transition ${index === selectedIndex ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}
                            >
                                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-lg">{suggestion.icon}</span>
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate text-sm font-bold text-slate-800">{suggestion.text}</span>
                                    <span className="mt-0.5 block text-xs text-slate-400">{suggestion.category}</span>
                                </span>
                                <ArrowRight size={15} className="text-slate-300" />
                            </button>
                        ))}
                    </div>
                    <div className="border-t border-slate-100 px-4 py-2 text-[11px] text-slate-400">Search by exact model for the most relevant matches · Enter to search</div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
