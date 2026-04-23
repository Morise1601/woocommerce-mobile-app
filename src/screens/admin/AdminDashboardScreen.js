import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import { fetchWC } from '../../services/woocommerce';

export default function AdminDashboardScreen({ navigation }) {
    const { user, logout } = useContext(AuthContext);
    const [stats, setStats] = useState({ orders: 0, products: 0, customers: 0, recentOrders: [] });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadDashboard();
        const unsubscribe = navigation.addListener('focus', () => {
            loadDashboard();
        });
        return unsubscribe;
    }, [navigation]);

    const loadDashboard = async () => {
        try {
            const [ordersData, productsData, customersData] = await Promise.all([
                fetchWC('orders?per_page=5'),
                fetchWC('products?per_page=1'),
                fetchWC('customers?per_page=1')
            ]);

            setStats({
                orders: 124, // Mock total
                products: 42,
                customers: 80,
                recentOrders: Array.isArray(ordersData) ? ordersData : []
            });
        } catch (e) {
            console.log('Error loading admin dashboard', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadDashboard();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return '#10B981';
            case 'processing': return '#3B82F6';
            case 'cancelled': return '#EF4444';
            default: return '#F59E0B';
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Admin Dashboard</Text>
                <TouchableOpacity onPress={logout}><Text style={styles.logoutText}>Logout</Text></TouchableOpacity>
            </View>

            {loading && !refreshing ? (
                <View style={styles.center}><ActivityIndicator size="large" color="#6366F1" /></View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.content}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366F1" />}
                >
                    <View style={styles.statsGrid}>
                        <View style={styles.statCard}>
                            <Text style={styles.statLabel}>Total Orders</Text>
                            <Text style={styles.statValue}>{stats.orders}</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statLabel}>Products</Text>
                            <Text style={styles.statValue}>{stats.products}</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statLabel}>Customers</Text>
                            <Text style={styles.statValue}>{stats.customers}</Text>
                        </View>
                    </View>

                    <View style={styles.quickNav}>
                        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('AdminOrders')}>
                            <Text style={styles.navBtnText}>Manage Orders</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('AdminProducts')}>
                            <Text style={styles.navBtnText}>Manage Products</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('AdminCustomers')}>
                            <Text style={styles.navBtnText}>Manage Customers</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.sectionTitle}>Recent Orders</Text>
                    {stats.recentOrders.length === 0 ? (
                        <Text style={styles.emptyText}>No recent orders.</Text>
                    ) : (
                        stats.recentOrders.map(order => (
                            <View key={order.id} style={styles.orderItem}>
                                <View style={styles.orderHeader}>
                                    <Text style={styles.orderId}>#{order.id} - {order.billing?.first_name} {order.billing?.last_name}</Text>
                                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                                        <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
                                    </View>
                                </View>
                                <View style={styles.orderFooter}>
                                    <Text style={styles.orderDate}>{new Date(order.date_created).toLocaleDateString()}</Text>
                                    <Text style={styles.orderTotal}>${order.total}</Text>
                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F172A' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#334155' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
    logoutText: { color: '#EF4444', fontWeight: 'bold' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    content: { padding: 16 },
    statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    statCard: { flex: 1, backgroundColor: '#1E293B', padding: 16, borderRadius: 12, marginHorizontal: 4, borderWidth: 1, borderColor: '#334155', alignItems: 'center' },
    statLabel: { color: '#94A3B8', fontSize: 12, marginBottom: 8, textAlign: 'center' },
    statValue: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
    quickNav: { marginBottom: 32 },
    navBtn: { backgroundColor: '#334155', padding: 16, borderRadius: 12, marginBottom: 8, alignItems: 'center' },
    navBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF', marginBottom: 16 },
    emptyText: { color: '#94A3B8', fontSize: 16 },
    orderItem: { backgroundColor: '#1E293B', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
    orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    orderId: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
    statusText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
    orderFooter: { flexDirection: 'row', justifyContent: 'space-between' },
    orderDate: { color: '#94A3B8', fontSize: 14 },
    orderTotal: { color: '#6366F1', fontWeight: 'bold', fontSize: 16 },
});
