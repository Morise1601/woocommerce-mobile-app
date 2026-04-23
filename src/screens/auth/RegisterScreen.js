import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { Colors } from '../../theme/Colors';
import { ScreenWrapper, PrimaryButton, GlassInput } from '../../components/ThemeComponents';

export default function RegisterScreen({ navigation }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register } = useContext(AuthContext);

    const handleRegister = async () => {
        if (!firstName || !lastName || !email || !password) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }
        setIsSubmitting(true);
        try {
            await register(firstName, lastName, email, password);
        } catch (e) {
            Alert.alert('Registration Failed', e.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ScreenWrapper>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                            <Ionicons name="chevron-back" size={24} color={Colors.white} />
                        </TouchableOpacity>

                        <View style={styles.headerSection}>
                            <Text style={styles.title}>Create Account</Text>
                            <Text style={styles.subtitle}>Join our community and experience the best shopping experience.</Text>
                        </View>

                        <View style={styles.form}>
                            <View style={styles.row}>
                                <View style={{ flex: 1, marginRight: 10 }}>
                                    <GlassInput
                                        placeholder="First Name"
                                        value={firstName}
                                        onChangeText={setFirstName}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <GlassInput
                                        placeholder="Last Name"
                                        value={lastName}
                                        onChangeText={setLastName}
                                    />
                                </View>
                            </View>

                            <GlassInput
                                icon="mail-outline"
                                placeholder="Email Address"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                value={email}
                                onChangeText={setEmail}
                            />

                            <GlassInput
                                icon="lock-closed-outline"
                                placeholder="Password"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />

                            <PrimaryButton
                                title="Create Account"
                                icon="person-add-outline"
                                loading={isSubmitting}
                                onPress={handleRegister}
                                style={styles.submitBtn}
                            />
                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.linkText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Text style={styles.linkTextBold}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 24, paddingBottom: 40 },
    backBtn: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    headerSection: { marginBottom: 40 },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: Colors.white,
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textMuted,
        lineHeight: 24,
    },
    form: { marginBottom: 32 },
    row: { flexDirection: 'row' },
    submitBtn: { marginTop: 16 },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    linkText: { color: Colors.textMuted, fontSize: 15, fontWeight: '500' },
    linkTextBold: { color: Colors.primary, fontSize: 15, fontWeight: '700' }
});
