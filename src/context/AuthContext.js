import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtLogin, fetchWC } from '../services/woocommerce';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('jwtToken');
            const storedUser = await AsyncStorage.getItem('user');
            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch (e) {
            console.log('Failed to load user form AsyncStorage', e);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const jwtData = await jwtLogin(email, password);
        const mToken = jwtData.token;
        const userEmail = jwtData.user_email;

        // Fetch complete WooCommerce customer object
        const customers = await fetchWC(`customers?email=${encodeURIComponent(userEmail)}`);
        let customerData = null;

        if (customers && customers.length > 0) {
            customerData = customers[0];
        } else {
            customerData = { email: userEmail, first_name: jwtData.user_display_name, isFallback: true };
        }

        if (customerData && customerData.role === 'administrator') {
            customerData.isAdmin = true;
        }

        await AsyncStorage.setItem('jwtToken', mToken);
        await AsyncStorage.setItem('user', JSON.stringify(customerData));
        setToken(mToken);
        setUser(customerData);
        return customerData;
    };

    const register = async (firstName, lastName, email, password) => {
        const customer = await fetchWC('customers', {
            method: 'POST',
            body: JSON.stringify({
                email,
                first_name: firstName,
                last_name: lastName,
                password
            })
        });
        // Optional: Log in automatically after registration
        return await login(email, password);
    };

    const logout = async () => {
        await AsyncStorage.removeItem('jwtToken');
        await AsyncStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
