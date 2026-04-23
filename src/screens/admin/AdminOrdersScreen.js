import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchWC } from '../../services/woocommerce';

export default function AdminOrdersScreen({ navigation }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        loadOrders();
    }, [statusFilter]);

    const loadOrders = async () => {
        setLoading(true);
        try {
            let endpoint = 'orders?per_page=20';
            if (statusFilter !== 'all') {
                endpoint += `&status=${statusFilter}`;
            }
            const data = await fetchWC(endpoint);
            setOrders(Array.isArray(data) ? data : []);
        } catch (e) {
            Alert.alert('Error', e.message);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (status) => {
        if (!selectedOrder) return;
        setModalVisible(false);
        setLoading(true);
        try {
            await fetchWC(`orders/${selectedOrder.id}`, {
                method: 'PUT',
                body: JSON.stringify({ status })
            });
            loadOrders();
        } catch (e) {
            Alert.alert('Error', 'Failed to update order status');
            setLoading(false);
        }
    };

    const openStatusModal = (order) => {
        setSelectedOrder(order);
        setModalVisible(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return '#10B981';
            case 'processing': return '#3B82F6';
            case 'cancelled': return '#EF4444';
            default: return '#F59E0B';
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.orderCard} onPress={() => openStatusModal(item)}>
            <View style={styles.cardHeader}>
                <Text style={styles.orderId}>#{item.id} - {item.billing?.first_name} {item.billing?.last_name}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                </View>
            </View>
            <Text style={styles.detailText}>Date: {new Date(item.date_created).toLocaleDateString()}</Text>
            <Text style={styles.detailText}>Method: {item.payment_method_title}</Text>
            <Text style={styles.orderTotal}>Total: ${item.total}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>All Orders</Text>
                <View style={{ width: 50 }} />
            </View>

            <View style={styles.filterContainer}>
                {['all', 'pending', 'processing', 'completed', 'cancelled'].map(status => (
                    <TouchableOpacity
                        key={status}
                        style={[styles.filterChip, statusFilter === status && styles.filterChipActive]}
                        onPress={() => setStatusFilter(status)}
                    >
                        <Text style={[styles.filterText, statusFilter === status && styles.filterTextActive]}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {loading ? (
                <View style={styles.center}><ActivityIndicator size="large" color="#6366F1" /></View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<View style={styles.center}><Text style={styles.emptyText}>No orders found.</Text></View>}
                />
            )}

            {/* Status Update Modal */}
            <Modal transparent={true} visible={modalVisible} animationType="fade">
                <View style={styles.modalBg}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Update Order #{selectedOrder?.id}</Text>
                        <Text style={styles.modalSub}>Select new status:</Text>

                        {['pending', 'processing', 'completed', 'cancelled'].map(status => (
                            <TouchableOpacity key={status} style={styles.modalOption} onPress={() => updateOrderStatus(status)}>
                                <View style={[styles.dot, { backgroundColor: getStatusColor(status) }]} />
                                <Text style={styles.modalOptionText}>{status.toUpperCase()}</Text>
                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F172A' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#334155' },
    backText: { color: '#6366F1', fontSize: 16, fontWeight: 'bold' },
    title: { flex: 1, textAlign: 'center', color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    filterContainer: { flexDirection: 'row', padding: 16, flexWrap: 'wrap' },
    filterChip: { backgroundColor: '#1E293B', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8, marginBottom: 8, borderWidth: 1, borderColor: '#334155' },
    filterChipActive: { backgroundColor: '#6366F1', borderColor: '#6366F1' },
    filterText: { color: '#94A3B8', fontSize: 12, fontWeight: 'bold' },
    filterTextActive: { color: '#FFF' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { color: '#94A3B8', fontSize: 16 },
    list: { paddingHorizontal: 16, paddingBottom: 16 },
    orderCard: { backgroundColor: '#1E293B', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    orderId: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
    statusText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
    detailText: { color: '#94A3B8', fontSize: 14, marginBottom: 4 },
    orderTotal: { color: '#6366F1', fontWeight: 'bold', fontSize: 16, marginTop: 8 },

    modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 24 },
    modalContent: { backgroundColor: '#1E293B', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: '#334155' },
    modalTitle: { fontSize: 20, color: '#FFF', fontWeight: 'bold', marginBottom: 8 },
    modalSub: { color: '#94A3B8', marginBottom: 24 },
    modalOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#334155' },
    dot: { width: 12, height: 12, borderRadius: 6, marginRight: 12 },
    modalOptionText: { color: '#FFF', fontSize: 16 },
    cancelBtn: { marginTop: 24, paddingVertical: 12, alignItems: 'center' },
    cancelBtnText: { color: '#EF4444', fontSize: 16, fontWeight: 'bold' },
});
