import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OrderConfirmationScreen({ route, navigation }) {
    const { order } = route.params;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.icon}>✅</Text>
                <Text style={styles.title}>Order Confirmed!</Text>
                <Text style={styles.subtitle}>Thank you for your purchase.</Text>

                <View style={styles.detailsBox}>
                    <Text style={styles.detailText}>Order ID: <Text style={styles.detailValue}>#{order.id}</Text></Text>
                    <Text style={styles.detailText}>Total: <Text style={styles.detailValue}>${order.total}</Text></Text>
                    <Text style={styles.detailText}>Status: <Text style={styles.detailValue}>{order.status}</Text></Text>
                    <Text style={styles.detailText}>Payment Method: <Text style={styles.detailValue}>{order.payment_method_title}</Text></Text>
                </View>

                <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('Orders')}>
                    <Text style={styles.primaryBtnText}>View My Orders</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.secondaryBtnText}>Continue Shopping</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F172A' },
    content: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
    icon: { fontSize: 64, marginBottom: 16 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#FFF', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#94A3B8', marginBottom: 32 },
    detailsBox: { backgroundColor: '#1E293B', padding: 24, borderRadius: 12, width: '100%', marginBottom: 32, borderWidth: 1, borderColor: '#334155' },
    detailText: { color: '#94A3B8', fontSize: 16, marginBottom: 12 },
    detailValue: { color: '#FFF', fontWeight: 'bold' },
    primaryBtn: { backgroundColor: '#6366F1', padding: 16, borderRadius: 12, width: '100%', alignItems: 'center', marginBottom: 16 },
    primaryBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    secondaryBtn: { backgroundColor: 'transparent', padding: 16, borderRadius: 12, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#6366F1' },
    secondaryBtnText: { color: '#6366F1', fontSize: 16, fontWeight: 'bold' },
});
