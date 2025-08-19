
import React from 'react';
import { ShoppingCart, Tag, User, LogOut, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const Header = ({ onCartClick }) => {
    const { cartItems } = useCart();
    const { user, logout } = useAuth();
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header className="glass-effect rounded-2xl p-6 mb-8">
            <div className="flex justify-between items-center">
                <div className="inline-flex items-center">
                    <div className="relative">
                        <Tag className="text-gradient h-12 w-12" />
                        <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500" />
                    </div>
                    <div className="ml-4">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gradient">DealFinder</h1>
                        <p className="text-sm text-gray-600 font-medium">Find the Best Deals</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <button 
                            onClick={onCartClick} 
                            className="p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            <ShoppingCart className="text-indigo-600 h-6 w-6" />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-xs text-white font-bold shadow-lg">
                                    {totalItems}
                                </span>
                            )}
                        </button>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
                        <User className="text-indigo-600 h-5 w-5" />
                        <span className="font-semibold text-gray-700 hidden sm:inline">{user.username}</span>
                    </div>
                    <button 
                        onClick={logout} 
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;