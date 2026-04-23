import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import { fetchWC } from '../../services/woocommerce';

export default function OrdersScreen({ navigation }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        loadOrders();
        const unsubscribe = navigation.addListener('focus', () => {
            loadOrders();
        });
        return unsubscribe;
    }, [navigation]);

    const loadOrders = async () => {
        if (!user?.id) { setLoading(false); return; }
        try {
            const data = await fetchWC(`orders?customer=${user.id}`);
            setOrders(Array.isArray(data) ? data : []);
        } catch (e) {
            console.log('Error loading orders', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadOrders();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return '#10B981';
            case 'processing': return '#3B82F6';
            case 'cancelled': return '#EF4444';
            case 'pending': return '#F59E0B';
            default: return '#94A3B8';
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.orderCard}>
            <View style={styles.cardHeader}>
                <Text style={styles.orderId}>Order #{item.id}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                </View>
            </View>
            <Text style={styles.orderDate}>{new Date(item.date_created).toLocaleDateString()}</Text>
            <Text style={styles.orderTotal}>Total: <Text style={styles.orderTotalValue}>${item.total}</Text></Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.backText}>← Shop</Text>
                </TouchableOpacity>
                <Text style={styles.title}>My Orders</Text>
                <View style={{ width: 50 }} />
            </View>

            {loading && !refreshing ? (
                <View style={styles.center}><ActivityIndicator size="large" color="#6366F1" /></View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366F1" />}
                    ListEmptyComponent={<View style={styles.center}><Text style={styles.emptyText}>No orders found.</Text></View>}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F172A' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#334155' },
    backText: { color: '#6366F1', fontSize: 16, fontWeight: 'bold' },
    title: { flex: 1, textAlign: 'center', color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { color: '#94A3B8', fontSize: 16 },
    list: { padding: 16 },
    orderCard: { backgroundColor: '#1E293B', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    orderId: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
    statusText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
    orderDate: { color: '#94A3B8', fontSize: 14, marginBottom: 8 },
    orderTotal: { color: '#94A3B8', fontSize: 14 },
    orderTotalValue: { color: '#6366F1', fontWeight: 'bold', fontSize: 16 },
});
