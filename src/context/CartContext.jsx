import React, { useState, createContext, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const addToCart = (product) => {
        setCartItems(prev => {
            const itemExists = prev.find(item => item.id === product.id);
            if (itemExists) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };
    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(item => item.id !== productId));
    };
    return <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);