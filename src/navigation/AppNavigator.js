import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';

// Auth
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// User
import HomeScreen from '../screens/user/HomeScreen';
import ProductDetailScreen from '../screens/user/ProductDetailScreen';
import CartScreen from '../screens/user/CartScreen';
import CheckoutScreen from '../screens/user/CheckoutScreen';
import OrderConfirmationScreen from '../screens/user/OrderConfirmationScreen';
import OrdersScreen from '../screens/user/OrdersScreen';
import ProfileScreen from '../screens/user/ProfileScreen';

// Admin
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminOrdersScreen from '../screens/admin/AdminOrdersScreen';
import AdminProductsScreen from '../screens/admin/AdminProductsScreen';
import AdminCustomersScreen from '../screens/admin/AdminCustomersScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { user, token, loading } = useContext(AuthContext);

    if (loading) {
        return null; // A custom splash screen could be placed here
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                    contentStyle: { backgroundColor: '#020617' }
                }}
            >
                {/* Public Shop Screens */}
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
                <Stack.Screen name="Cart" component={CartScreen} />

                {token && user ? (
                    user.isAdmin ? (
                        // Admin Stack
                        <>
                            <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
                            <Stack.Screen name="AdminOrders" component={AdminOrdersScreen} />
                            <Stack.Screen name="AdminProducts" component={AdminProductsScreen} />
                            <Stack.Screen name="AdminCustomers" component={AdminCustomersScreen} />
                        </>
                    ) : (
                        // Authenticated User Stack
                        <>
                            <Stack.Screen name="Checkout" component={CheckoutScreen} />
                            <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
                            <Stack.Screen name="Orders" component={OrdersScreen} />
                            <Stack.Screen name="Profile" component={ProfileScreen} />
                        </>
                    )
                ) : (
                    // Guest / Auth Stack
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
