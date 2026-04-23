import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image, TextInput, RefreshControl, Dimensions, ImageBackground, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { fetchWC } from '../../services/woocommerce';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { Colors } from '../../theme/Colors';
import { ScreenWrapper, SafeLinearGradient } from '../../components/ThemeComponents';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const { cartItems } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        loadCategories();
        loadProducts(1, true);
    }, []);

    const loadCategories = async () => {
        try {
            const data = await fetchWC('products/categories?hide_empty=true');
            if (Array.isArray(data)) setCategories(data);
        } catch (e) {
            console.log('Error loading categories', e);
        }
    };

    const loadProducts = async (pageNumber = 1, forceRefresh = false) => {
        if (!forceRefresh) setLoading(true);
        try {
            let endpoint = `products?per_page=10&page=${pageNumber}&status=publish`;
            if (selectedCategory) endpoint += `&category=${selectedCategory}`;
            if (searchQuery) endpoint += `&search=${encodeURIComponent(searchQuery)}`;

            const data = await fetchWC(endpoint);

            const isArray = Array.isArray(data);
            if (!isArray || data.length < 10) setHasMore(false);
            else setHasMore(true);

            const newProducts = isArray ? data : [];

            if (pageNumber === 1 || forceRefresh) {
                setProducts(newProducts);
            } else {
                setProducts(prev => [...prev, ...newProducts]);
            }
            setPage(pageNumber);
        } catch (e) {
            console.log('Error loading products', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        setPage(1);
        setHasMore(true);
        loadProducts(1, true);
    };

    const loadMore = () => {
        if (!loading && hasMore) {
            loadProducts(page + 1);
        }
    };

    const handleSearch = () => {
        setPage(1);
        setHasMore(true);
        loadProducts(1, true);
    };

    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
        setPage(1);
        setHasMore(true);
        setTimeout(() => loadProducts(1, true), 50);
    };

    const renderHeader = () => (
        <View style={styles.headerContent}>
            <View style={styles.headerTop}>
                <View>
                    <Text style={styles.welcomeText}>Welcome back,</Text>
                    <Text style={styles.headerTitle}>{user?.first_name || 'Guest Explorer'}</Text>
                </View>
                <View style={styles.headerIcons}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => user ? navigation.navigate('Profile') : navigation.navigate('Login')}
                    >
                        <Ionicons name="person-outline" size={22} color={Colors.white} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={[styles.iconButton, { marginLeft: 12 }]}>
                        <Ionicons name="bag-handle-outline" size={24} color={Colors.white} />
                        {cartItems.length > 0 && (
                            <View style={styles.cartBadge}>
                                <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color={Colors.textMuted} style={{ marginRight: 12 }} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search your favorite items..."
                        placeholderTextColor={Colors.textMuted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => { setSearchQuery(''); loadProducts(1, true); }}>
                            <Ionicons name="close-circle" size={20} color={Colors.textMuted} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Promotional Banner */}
            <View style={styles.bannerContainer}>
                <ImageBackground
                    source={{ uri: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop' }}
                    style={styles.bannerImage}
                    imageStyle={{ borderRadius: 24 }}
                >
                    <SafeLinearGradient
                        colors={['rgba(2, 6, 23, 0.7)', 'transparent']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.bannerOverlay}
                    >
                        <View style={styles.bannerTagContainer}>
                            <Text style={styles.bannerTag}>Limited Offer</Text>
                        </View>
                        <Text style={styles.bannerTitle}>Summer Sale{'\n'}Up to 50% Off</Text>
                        <TouchableOpacity style={styles.bannerBtn}>
                            <Text style={styles.bannerBtnText}>Shop Now</Text>
                        </TouchableOpacity>
                    </SafeLinearGradient>
                </ImageBackground>
            </View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Categories</Text>
            </View>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={categories}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.categoriesList}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.chip, selectedCategory === item.id && styles.chipActive]}
                        onPress={() => handleCategorySelect(item.id)}
                    >
                        <Text style={[styles.chipText, selectedCategory === item.id && styles.chipTextActive]}>
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                )}
            />

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{selectedCategory ? 'Products' : 'Trending Now'}</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderProduct = ({ item }) => {
        const isSale = item.on_sale;
        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('ProductDetail', { product: item })}
            >
                <View style={styles.cardImageContainer}>
                    <Image
                        source={{ uri: item.images && item.images.length > 0 ? item.images[0].src : 'https://via.placeholder.com/150' }}
                        style={styles.cardImage}
                    />
                    {isSale && (
                        <View style={styles.saleBadge}>
                            <Text style={styles.saleText}>-{Math.round(((item.regular_price - item.sale_price) / item.regular_price) * 100)}%</Text>
                        </View>
                    )}
                    <TouchableOpacity style={styles.wishlistBtn}>
                        <Ionicons name="heart-outline" size={18} color={Colors.primary} />
                    </TouchableOpacity>
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                    <View style={styles.priceRow}>
                        <Text style={styles.price}>
                            ${Number(item.price).toFixed(2)}
                        </Text>
                        {isSale && (
                            <Text style={styles.originalPrice}>
                                ${Number(item.regular_price).toFixed(2)}
                            </Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <ScreenWrapper>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.container} edges={['top']}>
                <FlatList
                    ListHeaderComponent={renderHeader}
                    data={products}
                    keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                    numColumns={2}
                    contentContainerStyle={styles.productList}
                    renderItem={renderProduct}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
                    }
                    ListFooterComponent={() =>
                        loading && page > 1 ? <ActivityIndicator size="small" color={Colors.primary} style={{ margin: 20 }} /> : null
                    }
                    ListEmptyComponent={() => !loading && (
                        <View style={styles.center}>
                            <Ionicons name="search-outline" size={48} color={Colors.textMuted} />
                            <Text style={styles.emptyText}>No products found.</Text>
                        </View>
                    )}
                />
            </SafeAreaView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerContent: { paddingTop: 10 },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 24 },
    welcomeText: { color: Colors.textMuted, fontSize: 14, fontWeight: '500' },
    headerTitle: { fontSize: 24, fontWeight: '800', color: Colors.white, letterSpacing: -0.5 },
    headerIcons: { flexDirection: 'row', alignItems: 'center' },
    iconButton: { width: 48, height: 48, borderRadius: 16, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
    cartBadge: { position: 'absolute', top: -5, right: -5, backgroundColor: Colors.primary, borderRadius: 10, minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: Colors.background },
    cartBadgeText: { color: Colors.white, fontSize: 10, fontWeight: '800' },
    searchContainer: { paddingHorizontal: 20, marginBottom: 24 },
    searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 18, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: Colors.border },
    searchInput: { flex: 1, color: Colors.white, fontSize: 16, fontWeight: '500' },
    bannerContainer: { paddingHorizontal: 20, marginBottom: 32 },
    bannerImage: { width: '100%', height: 180, overflow: 'hidden', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20 },
    bannerOverlay: { flex: 1, padding: 24, justifyContent: 'center' },
    bannerTagContainer: { backgroundColor: Colors.primary, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 8 },
    bannerTag: { color: Colors.white, fontWeight: '800', fontSize: 10, textTransform: 'uppercase' },
    bannerTitle: { color: Colors.white, fontSize: 26, fontWeight: '900', marginBottom: 16, lineHeight: 32, letterSpacing: -0.5 },
    bannerBtn: { backgroundColor: Colors.white, alignSelf: 'flex-start', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
    bannerBtnText: { color: Colors.background, fontWeight: '800', fontSize: 14 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
    sectionTitle: { fontSize: 20, fontWeight: '800', color: Colors.white, letterSpacing: -0.5 },
    seeAll: { color: Colors.primary, fontSize: 14, fontWeight: '700' },
    categoriesList: { paddingLeft: 20, paddingBottom: 24 },
    chip: { backgroundColor: Colors.surface, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 16, marginRight: 12, borderWidth: 1, borderColor: Colors.border },
    chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    chipText: { color: Colors.textMuted, fontWeight: '700', fontSize: 14 },
    chipTextActive: { color: Colors.white },
    productList: { paddingHorizontal: 10, paddingBottom: 40 },
    card: { width: (width - 40) / 2, margin: 5, backgroundColor: Colors.surface, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
    cardImageContainer: { width: '100%', height: 180, backgroundColor: '#FFF' },
    cardImage: { width: '100%', height: '100%', resizeMode: 'contain' },
    wishlistBtn: { position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.8)', justifyContent: 'center', alignItems: 'center' },
    saleBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: Colors.accent, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
    saleText: { color: Colors.white, fontSize: 11, fontWeight: '800' },
    cardContent: { padding: 16 },
    productName: { color: Colors.white, fontSize: 15, fontWeight: '700', marginBottom: 8 },
    priceRow: { flexDirection: 'row', alignItems: 'center' },
    price: { color: Colors.white, fontSize: 18, fontWeight: '800' },
    originalPrice: { color: Colors.textMuted, textDecorationLine: 'line-through', fontSize: 13, marginLeft: 8 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 80 },
    emptyText: { color: Colors.textMuted, fontSize: 16, marginTop: 12, fontWeight: '500' }
});
