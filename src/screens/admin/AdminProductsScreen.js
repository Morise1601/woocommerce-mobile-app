import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchWC } from '../../services/woocommerce';

export default function AdminProductsScreen({ navigation }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        loadProducts(1, true);
    }, []);

    const loadProducts = async (pageNumber = 1, forceRefresh = false) => {
        if (!forceRefresh) setLoading(true);
        try {
            let endpoint = `products?per_page=15&page=${pageNumber}`;
            if (searchQuery) endpoint += `&search=${encodeURIComponent(searchQuery)}`;

            const data = await fetchWC(endpoint);

            if (!Array.isArray(data) || data.length < 15) setHasMore(false);
            else setHasMore(true);

            const newProds = Array.isArray(data) ? data : [];

            if (pageNumber === 1 || forceRefresh) setProducts(newProds);
            else setProducts(prev => [...prev, ...newProds]);

            setPage(pageNumber);
        } catch (e) {
            console.log('Error loading admin products', e);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        loadProducts(1, true);
    };

    const loadMore = () => {
        if (!loading && hasMore) loadProducts(page + 1);
    };

    const renderItem = ({ item }) => (
        <View style={styles.productCard}>
            <Image source={{ uri: item.images?.[0]?.src || 'https://via.placeholder.com/60' }} style={styles.image} />
            <View style={styles.details}>
                <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.sku}>SKU: {item.sku || 'N/A'}</Text>
                <Text style={styles.price}>${item.price || '0.00'}</Text>
            </View>
            <View style={[styles.stockBadge, item.stock_status === 'instock' ? styles.inStock : styles.outOfStock]}>
                <Text style={styles.stockText}>{item.stock_status === 'instock' ? 'In Stock' : 'Out'}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Manage Products</Text>
                <View style={{ width: 50 }} />
            </View>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search products..."
                    placeholderTextColor="#64748B"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                />
            </View>

            {loading && page === 1 ? (
                <View style={styles.center}><ActivityIndicator size="large" color="#6366F1" /></View>
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListEmptyComponent={<View style={styles.center}><Text style={styles.emptyText}>No products found.</Text></View>}
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
    searchContainer: { padding: 16 },
    searchInput: { backgroundColor: '#1E293B', borderRadius: 8, padding: 12, color: '#FFF', borderWidth: 1, borderColor: '#334155' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { color: '#94A3B8', fontSize: 16 },
    list: { paddingHorizontal: 16 },
    productCard: { flexDirection: 'row', backgroundColor: '#1E293B', padding: 12, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#334155', alignItems: 'center' },
    image: { width: 60, height: 60, borderRadius: 8, backgroundColor: '#FFF' },
    details: { flex: 1, marginLeft: 12, justifyContent: 'center' },
    name: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
    sku: { color: '#94A3B8', fontSize: 12, marginBottom: 4 },
    price: { color: '#6366F1', fontSize: 16, fontWeight: 'bold' },
    stockBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    inStock: { backgroundColor: '#10B981' },
    outOfStock: { backgroundColor: '#EF4444' },
    stockText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
});
