import React from 'react';
import { X, Trash2, ShoppingBag, CreditCard } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const CartModal = ({ isOpen, onClose }) => {
    const { cartItems, removeFromCart } = useCart();
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
            {/* Background with image and overlay */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"></div>
            </div>
            
            {/* Modal Content */}
            <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col border border-white/20">
                {/* Header */}
                <header className="flex justify-between items-center p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-3xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                            <ShoppingBag className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Your Shopping Cart</h3>
                            <p className="text-sm text-gray-600">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 rounded-full hover:bg-gray-200/50 transition-colors duration-200"
                    >
                        <X size={24} className="text-gray-600" />
                    </button>
                </header>

                {/* Cart Items */}
                <div className="p-6 overflow-y-auto flex-grow">
                    {cartItems.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <ShoppingBag className="text-gray-400" size={32} />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-700 mb-2">Your cart is empty</h4>
                            <p className="text-gray-500">Start shopping to add items to your cart</p>
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {cartItems.map(item => (
                                <li key={item.id} className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-lg">{item.logo}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-800">{item.name}</p>
                                                    <p className="text-sm text-gray-600">from {item.platform}</p>
                                                    <p className="text-sm font-medium text-blue-600">
                                                        ₹{item.price.toLocaleString('en-IN')} x {item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => removeFromCart(item.id)} 
                                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors duration-200"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer with Total and Checkout */}
                {cartItems.length > 0 && (
                    <footer className="p-6 border-t border-gray-200/50 bg-gradient-to-r from-green-50 to-emerald-50 rounded-b-3xl">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-bold text-gray-800">Total Amount:</span>
                            <span className="text-2xl font-bold text-green-600">₹{totalPrice.toLocaleString('en-IN')}</span>
                        </div>
                        <button className="w-full py-4 text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                            <CreditCard size={20} />
                            Proceed to Checkout
                        </button>
                        <p className="text-xs text-gray-500 text-center mt-3">
                            Secure checkout powered by Stripe
                        </p>
                    </footer>
                )}
            </div>
        </div>
    );
};

export default CartModal;
