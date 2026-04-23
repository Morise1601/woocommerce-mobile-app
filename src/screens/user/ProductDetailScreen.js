import React, { useState, useContext } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions, useWindowDimensions, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CartContext } from '../../context/CartContext';
import { Colors } from '../../theme/Colors';
import { ScreenWrapper, PrimaryButton, SafeLinearGradient } from '../../components/ThemeComponents';

export default function ProductDetailScreen({ route, navigation }) {
    const { product } = route.params;
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(product.images?.[0]?.src || 'https://via.placeholder.com/400');
    const { addToCart } = useContext(CartContext);
    const { width } = useWindowDimensions();

    const stripHtml = (html) => html ? html.replace(/<[^>]+>/g, '') : '';

    const handleAddToCart = () => {
        addToCart(product, quantity);
        navigation.navigate('Cart');
    };

    const isSale = product.on_sale;

    return (
        <ScreenWrapper>
            <StatusBar barStyle="light-content" />
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                {/* Image Gallery */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: selectedImage }} style={[styles.mainImage, { height: width * 1.2 }]} />
                    
                    <SafeLinearGradient
                        colors={['rgba(2, 6, 23, 0.4)', 'transparent', 'rgba(2, 6, 23, 0.8)']}
                        style={StyleSheet.absoluteFill}
                    />

                    {/* Floating Header */}
                    <SafeAreaView style={styles.floatingHeader}>
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                            <Ionicons name="chevron-back" size={24} color={Colors.white} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.backButton}>
                            <Ionicons name="heart-outline" size={24} color={Colors.white} />
                        </TouchableOpacity>
                    </SafeAreaView>

                    {product.images && product.images.length > 1 && (
                        <View style={styles.thumbnailWrapper}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbnailList}>
                                {product.images.map(img => (
                                    <TouchableOpacity key={img.id} onPress={() => setSelectedImage(img.src)} activeOpacity={0.8}>
                                        <Image
                                            source={{ uri: img.src }}
                                            style={[styles.thumbnail, selectedImage === img.src && styles.activeThumbnail]}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>

                <View style={styles.detailsContainer}>
                    <View style={styles.indicator} />

                    <View style={styles.titleRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.categoryName}>Premium Collection</Text>
                            <Text style={styles.title}>{product.name}</Text>
                        </View>
                        <View style={styles.priceContainer}>
                            <Text style={styles.price}>${Number(product.price).toFixed(2)}</Text>
                        </View>
                    </View>

                    <View style={styles.stockRow}>
                        <View style={[styles.stockBadge, product.stock_status !== 'instock' && styles.outOfStock]}>
                            <Ionicons name={product.stock_status === 'instock' ? "checkmark-circle" : "close-circle"} size={14} color={Colors.white} style={{ marginRight: 4 }} />
                            <Text style={styles.stockText}>
                                {product.stock_status === 'instock' ? 'In Stock' : 'Out of Stock'}
                            </Text>
                        </View>
                        {isSale && (
                            <View style={styles.discountBadge}>
                                <Text style={styles.discountText}>Save ${ (Number(product.regular_price) - Number(product.sale_price)).toFixed(2) }</Text>
                            </View>
                        )}
                    </View>

                    <Text style={styles.sectionLabel}>Description</Text>
                    <Text style={styles.description}>{stripHtml(product.description)}</Text>

                    {product.attributes && product.attributes.length > 0 && (
                        <View style={styles.attributes}>
                            <Text style={styles.sectionLabel}>Specifications</Text>
                            <View style={styles.attrList}>
                                {product.attributes.map(attr => (
                                    <View key={attr.id} style={styles.attrRow}>
                                        <Text style={styles.attrName}>{attr.name}</Text>
                                        <Text style={styles.attrValue}>{attr.options.join(', ')}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    <View style={{ height: 140 }} />
                </View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={styles.footer}>
                <View style={styles.qtyControl}>
                    <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))} style={styles.qtyBtn}>
                        <Ionicons name="remove" size={20} color={Colors.white} />
                    </TouchableOpacity>
                    <Text style={styles.qtyValue}>{quantity}</Text>
                    <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={styles.qtyBtn}>
                        <Ionicons name="add" size={20} color={Colors.white} />
                    </TouchableOpacity>
                </View>
                <PrimaryButton
                    title="Add to Cart"
                    icon="bag-add-outline"
                    onPress={handleAddToCart}
                    loading={false}
                    style={{ flex: 1 }}
                />
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    imageContainer: { position: 'relative', backgroundColor: '#FFF' },
    mainImage: { width: '100%', resizeMode: 'contain' },
    floatingHeader: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
    backButton: { width: 44, height: 44, borderRadius: 16, backgroundColor: 'rgba(2, 6, 23, 0.5)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    thumbnailWrapper: { position: 'absolute', bottom: 30, width: '100%' },
    thumbnailList: { paddingHorizontal: 20 },
    thumbnail: { width: 64, height: 64, marginRight: 12, borderRadius: 16, borderWidth: 2, borderColor: 'transparent', backgroundColor: '#FFF' },
    activeThumbnail: { borderColor: Colors.primary },
    detailsContainer: { backgroundColor: Colors.background, marginTop: -30, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, minHeight: 500, borderWidth: 1, borderColor: Colors.border },
    indicator: { width: 48, height: 6, backgroundColor: Colors.border, borderRadius: 3, alignSelf: 'center', marginBottom: 24 },
    categoryName: { color: Colors.primary, fontSize: 13, fontWeight: '800', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
    title: { fontSize: 28, fontWeight: '800', color: Colors.white, flex: 1, marginRight: 12, letterSpacing: -0.5 },
    priceContainer: { backgroundColor: Colors.surface, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16, borderWidth: 1, borderColor: Colors.border },
    price: { fontSize: 22, fontWeight: '800', color: Colors.white },
    stockRow: { flexDirection: 'row', marginBottom: 32, alignItems: 'center' },
    stockBadge: { backgroundColor: Colors.success, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, marginRight: 12, flexDirection: 'row', alignItems: 'center' },
    outOfStock: { backgroundColor: Colors.error },
    stockText: { color: Colors.white, fontSize: 13, fontWeight: '700' },
    discountBadge: { backgroundColor: 'rgba(99, 102, 241, 0.15)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(99, 102, 241, 0.3)' },
    discountText: { color: Colors.primary, fontSize: 13, fontWeight: '800' },
    sectionLabel: { fontSize: 20, fontWeight: '800', color: Colors.white, marginBottom: 12, marginTop: 12, letterSpacing: -0.5 },
    description: { color: Colors.textMuted, fontSize: 15, lineHeight: 26, marginBottom: 32 },
    attrList: { backgroundColor: Colors.surface, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: Colors.border },
    attrRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
    attrName: { color: Colors.textMuted, fontSize: 14, fontWeight: '600' },
    attrValue: { color: Colors.white, fontSize: 14, fontWeight: '700' },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', padding: 20, paddingBottom: 35, backgroundColor: 'rgba(15, 23, 42, 0.95)', borderTopLeftRadius: 32, borderTopRightRadius: 32, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
    qtyControl: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 18, marginRight: 16, paddingHorizontal: 8, height: 56, borderWidth: 1, borderColor: Colors.border },
    qtyBtn: { padding: 10 },
    qtyValue: { color: Colors.white, fontSize: 18, fontWeight: '800', minWidth: 32, textAlign: 'center' },
});
