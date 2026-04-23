import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, SafeAreaView, StatusBar } from 'react-native';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';

export default function CartScreen({ navigation }) {
    const { cartItems, removeFromCart, updateQuantity, getSubtotal } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    const renderItem = ({ item }) => (
        <View style={styles.cartItem}>
            <Image 
                source={{ uri: item.product.images && item.product.images.length > 0 ? item.product.images[0].src : 'https://via.placeholder.com/100' }} 
                style={styles.itemImage} 
            />
            <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>{item.product.name}</Text>
                <Text style={styles.itemPrice}>${parseFloat(item.product.price).toFixed(2)}</Text>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity 
                        onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
                        style={styles.quantityBtn}
                    >
                        <Text style={styles.quantityBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <TouchableOpacity 
                        onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
                        style={styles.quantityBtn}
                    >
                        <Text style={styles.quantityBtnText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity 
                onPress={() => removeFromCart(item.product.id)}
                style={styles.removeBtn}
            >
                <Text style={styles.removeBtnText}>✕</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backBtnText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Cart</Text>
                <View style={{ width: 40 }} />
            </View>

            {cartItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>🛒</Text>
                    <Text style={styles.emptyText}>Your cart is empty</Text>
                    <TouchableOpacity 
                        style={styles.shopBtn}
                        onPress={() => navigation.navigate('Home')}
                    >
                        <Text style={styles.shopBtnText}>Start Shopping</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <FlatList
                        data={cartItems}
                        keyExtractor={item => item.product.id.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                    />
                    <View style={styles.footer}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>${getSubtotal().toFixed(2)}</Text>
                        </View>
                        <TouchableOpacity 
                            style={styles.checkoutBtn}
                            onPress={() => user ? navigation.navigate('Checkout') : navigation.navigate('Login')}
                        >
                            <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F172A' },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingHorizontal: 16, 
        paddingVertical: 20 
    },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    backBtnText: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
    headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
    listContent: { padding: 16 },
    cartItem: { 
        flexDirection: 'row', 
        backgroundColor: '#1E293B', 
        borderRadius: 16, 
        padding: 12, 
        marginBottom: 16, 
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#334155'
    },
    itemImage: { width: 80, height: 80, borderRadius: 12, backgroundColor: '#334155' },
    itemInfo: { flex: 1, marginLeft: 16 },
    itemName: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
    itemPrice: { color: '#6366F1', fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
    quantityContainer: { flexDirection: 'row', alignItems: 'center' },
    quantityBtn: { 
        width: 28, 
        height: 28, 
        backgroundColor: '#334155', 
        borderRadius: 8, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    quantityBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    quantity: { color: '#FFF', marginHorizontal: 12, fontSize: 16, fontWeight: 'bold' },
    removeBtn: { padding: 8 },
    removeBtnText: { color: '#64748B', fontSize: 18 },
    footer: { 
        backgroundColor: '#1E293B', 
        padding: 24, 
        borderTopLeftRadius: 32, 
        borderTopRightRadius: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10
    },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    totalLabel: { color: '#94A3B8', fontSize: 16 },
    totalValue: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
    checkoutBtn: { 
        backgroundColor: '#6366F1', 
        paddingVertical: 16, 
        borderRadius: 16, 
        alignItems: 'center' 
    },
    checkoutBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
    emptyIcon: { fontSize: 64, marginBottom: 16 },
    emptyText: { color: '#94A3B8', fontSize: 18, marginBottom: 24 },
    shopBtn: { 
        backgroundColor: '#6366F1', 
        paddingHorizontal: 32, 
        paddingVertical: 12, 
        borderRadius: 12 
    },
    shopBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});
