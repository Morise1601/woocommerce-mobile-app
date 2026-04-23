import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { fetchWC } from '../../services/woocommerce';

export default function CheckoutScreen({ navigation }) {
    const { cartItems, getSubtotal, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Billing Address Form
    const [firstName, setFirstName] = useState(user?.first_name || '');
    const [lastName, setLastName] = useState(user?.last_name || '');
    const [address1, setAddress1] = useState('');
    const [city, setCity] = useState('');
    const [postcode, setPostcode] = useState('');
    const [country, setCountry] = useState('US');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState('');

    // Payment method
    const [paymentMethod, setPaymentMethod] = useState('cod');

    const handleNextStep = () => {
        if (step === 1) {
            if (!firstName || !lastName || !address1 || !city || !email) {
                Alert.alert('Error', 'Please fill all required billing fields');
                return;
            }
            setStep(2);
        } else if (step === 2) {
            setStep(3);
        }
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            const lineItems = cartItems.map(item => ({
                product_id: item.product.id,
                quantity: item.quantity
            }));

            const orderData = {
                payment_method: paymentMethod,
                payment_method_title: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card',
                set_paid: paymentMethod === 'ccp',
                customer_id: user?.id || 0,
                billing: {
                    first_name: firstName,
                    last_name: lastName,
                    address_1: address1,
                    city: city,
                    postcode: postcode,
                    country: country,
                    email: email,
                    phone: phone
                },
                shipping: {
                    first_name: firstName,
                    last_name: lastName,
                    address_1: address1,
                    city: city,
                    postcode: postcode,
                    country: country,
                },
                line_items: lineItems
            };

            const resp = await fetchWC('orders', {
                method: 'POST',
                body: JSON.stringify(orderData)
            });

            clearCart();
            navigation.navigate('OrderConfirmation', { order: resp });
        } catch (e) {
            Alert.alert('Error placing order', e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : navigation.goBack()}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Checkout (Step {step}/3)</Text>
                <View style={{ width: 50 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {step === 1 && (
                    <View>
                        <Text style={styles.title}>Billing Details</Text>
                        <TextInput style={styles.input} placeholder="First Name" placeholderTextColor="#64748B" value={firstName} onChangeText={setFirstName} />
                        <TextInput style={styles.input} placeholder="Last Name" placeholderTextColor="#64748B" value={lastName} onChangeText={setLastName} />
                        <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor="#64748B" keyboardType="email-address" value={email} onChangeText={setEmail} />
                        <TextInput style={styles.input} placeholder="Address Line 1" placeholderTextColor="#64748B" value={address1} onChangeText={setAddress1} />
                        <TextInput style={styles.input} placeholder="City/Town" placeholderTextColor="#64748B" value={city} onChangeText={setCity} />
                        <TextInput style={styles.input} placeholder="Postcode" placeholderTextColor="#64748B" value={postcode} onChangeText={setPostcode} />
                        <TextInput style={styles.input} placeholder="Phone" placeholderTextColor="#64748B" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
                        <TouchableOpacity style={styles.btn} onPress={handleNextStep}>
                            <Text style={styles.btnText}>Continue to Payment</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {step === 2 && (
                    <View>
                        <Text style={styles.title}>Payment Method</Text>
                        <TouchableOpacity style={[styles.paymentMethod, paymentMethod === 'cod' && styles.paymentMethodActive]} onPress={() => setPaymentMethod('cod')}>
                            <Text style={[styles.paymentMethodText, paymentMethod === 'cod' && styles.paymentMethodTextActive]}>Cash on Delivery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.paymentMethod, paymentMethod === 'ccp' && styles.paymentMethodActive]} onPress={() => setPaymentMethod('ccp')}>
                            <Text style={[styles.paymentMethodText, paymentMethod === 'ccp' && styles.paymentMethodTextActive]}>Credit Card</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn} onPress={handleNextStep}>
                            <Text style={styles.btnText}>Review Order</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {step === 3 && (
                    <View>
                        <Text style={styles.title}>Order Review</Text>
                        <View style={styles.reviewBox}>
                            <Text style={styles.reviewLabel}>Items: <Text style={styles.reviewValue}>{cartItems.length}</Text></Text>
                            <Text style={styles.reviewLabel}>Total: <Text style={styles.reviewValue}>${getSubtotal().toFixed(2)}</Text></Text>
                            <Text style={styles.reviewLabel}>Method: <Text style={styles.reviewValue}>{paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card'}</Text></Text>
                        </View>
                        <TouchableOpacity style={styles.btn} onPress={handlePlaceOrder} disabled={loading}>
                            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Place Order</Text>}
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F172A' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#334155' },
    backText: { color: '#6366F1', fontSize: 16, fontWeight: 'bold' },
    headerTitle: { flex: 1, textAlign: 'center', color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    content: { padding: 16 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginBottom: 24 },
    input: { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155', borderRadius: 12, padding: 16, color: '#FFF', marginBottom: 16, fontSize: 16 },
    btn: { backgroundColor: '#6366F1', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
    btnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    paymentMethod: { padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#334155', backgroundColor: '#1E293B', marginBottom: 16 },
    paymentMethodActive: { borderColor: '#6366F1', backgroundColor: '#312E81' },
    paymentMethodText: { color: '#94A3B8', fontSize: 16, fontWeight: 'bold' },
    paymentMethodTextActive: { color: '#FFF' },
    reviewBox: { backgroundColor: '#1E293B', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#334155' },
    reviewLabel: { color: '#94A3B8', fontSize: 16, marginBottom: 8 },
    reviewValue: { color: '#FFF', fontWeight: 'bold' },
});
