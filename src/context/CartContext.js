import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        loadCart();
    }, [user]);

    const loadCart = async () => {
        try {
            const storedCart = await AsyncStorage.getItem(`cart_${user?.id || 'guest'}`);
            if (storedCart) {
                setCartItems(JSON.parse(storedCart));
            } else {
                setCartItems([]);
            }
        } catch (e) {
            console.log('Error loading cart', e);
        }
    };

    const saveCart = async (items) => {
        setCartItems(items);
        try {
            await AsyncStorage.setItem(`cart_${user?.id || 'guest'}`, JSON.stringify(items));
        } catch (e) {
            console.log('Error saving cart', e);
        }
    };

    const addToCart = (product, quantity = 1) => {
        const existing = cartItems.find(item => item.product.id === product.id);
        if (existing) {
            saveCart(cartItems.map(item =>
                item.product.id === product.id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            ));
        } else {
            saveCart([...cartItems, { product, quantity }]);
        }
    };

    const removeFromCart = (productId) => {
        saveCart(cartItems.filter(item => item.product.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        saveCart(cartItems.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
        ));
    };

    const clearCart = () => {
        saveCart([]);
    };

    const getSubtotal = () => {
        return cartItems.reduce((sum, item) => sum + (parseFloat(item.product.price || 0) * item.quantity), 0);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getSubtotal }}>
            {children}
        </CartContext.Provider>
    );
};
