import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchWC } from '../../services/woocommerce';

export default function AdminCustomersScreen({ navigation }) {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        loadCustomers(1);
    }, []);

    const loadCustomers = async (pageNumber = 1) => {
        setLoading(true);
        try {
            const data = await fetchWC(`customers?per_page=15&page=${pageNumber}`);

            if (!Array.isArray(data) || data.length < 15) setHasMore(false);
            else setHasMore(true);

            const newCustomers = Array.isArray(data) ? data : [];

            if (pageNumber === 1) setCustomers(newCustomers);
            else setCustomers(prev => [...prev, ...newCustomers]);

            setPage(pageNumber);
        } catch (e) {
            console.log('Error loading admin customers', e);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        if (!loading && hasMore) loadCustomers(page + 1);
    };

    const renderItem = ({ item }) => (
        <View style={styles.customerCard}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.first_name ? item.first_name.charAt(0) : item.email.charAt(0)}</Text>
            </View>
            <View style={styles.details}>
                <Text style={styles.name}>{item.first_name} {item.last_name}</Text>
                <Text style={styles.email}>{item.email}</Text>
            </View>
            <View style={styles.stats}>
                <Text style={styles.statLine}>Orders: <Text style={styles.statValue}>{item.orders_count || 0}</Text></Text>
                <Text style={styles.statLine}>Spent: <Text style={styles.statValue}>${item.total_spent || '0.00'}</Text></Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Manage Customers</Text>
                <View style={{ width: 50 }} />
            </View>

            {loading && page === 1 ? (
                <View style={styles.center}><ActivityIndicator size="large" color="#6366F1" /></View>
            ) : (
                <FlatList
                    data={customers}
                    keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListEmptyComponent={<View style={styles.center}><Text style={styles.emptyText}>No customers found.</Text></View>}
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
    customerCard: { flexDirection: 'row', backgroundColor: '#1E293B', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#334155', alignItems: 'center' },
    avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    avatarText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
    details: { flex: 1 },
    name: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
    email: { color: '#94A3B8', fontSize: 14 },
    stats: { alignItems: 'flex-end' },
    statLine: { color: '#94A3B8', fontSize: 12, marginBottom: 4 },
    statValue: { color: '#FFF', fontWeight: 'bold' },
});
