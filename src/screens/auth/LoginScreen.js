import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { Colors } from '../../theme/Colors';
import { ScreenWrapper, PrimaryButton, GlassInput, SafeLinearGradient } from '../../components/ThemeComponents';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useContext(AuthContext);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }
        setIsSubmitting(true);
        try {
            await login(email, password);
        } catch (e) {
            Alert.alert('Login Failed', e.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ScreenWrapper>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <View style={styles.content}>
                        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                            <Ionicons name="chevron-back" size={24} color={Colors.white} />
                        </TouchableOpacity>

                        <View style={styles.headerSection}>
                            <View style={styles.logoContainer}>
                                <SafeLinearGradient
                                    colors={['rgba(99, 102, 241, 0.2)', 'rgba(139, 92, 246, 0.2)']}
                                    style={styles.logoGlow}
                                />
                                <View style={styles.logoCircle}>
                                    <Ionicons name="cart" size={42} color={Colors.primary} />
                                </View>
                            </View>
                            <Text style={styles.title}>Welcome Back</Text>
                            <Text style={styles.subtitle}>Sign in to your account and discover exclusive deals tailored for you.</Text>
                        </View>

                        <View style={styles.form}>
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
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                                rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
                                onRightIconPress={() => setShowPassword(!showPassword)}
                            />

                            <TouchableOpacity style={styles.forgotBtn}>
                                <Text style={styles.forgotText}>Forgot Password?</Text>
                            </TouchableOpacity>

                            <PrimaryButton
                                title="Sign In"
                                icon="arrow-forward"
                                loading={isSubmitting}
                                onPress={handleLogin}
                                style={styles.submitBtn}
                            />
                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.linkText}>New around here? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                <Text style={styles.linkTextBold}>Create Account</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1, padding: 24 },
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
    headerSection: { alignItems: 'center', marginBottom: 48 },
    logoContainer: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    logoGlow: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    logoCircle: {
        width: 88,
        height: 88,
        borderRadius: 30,
        backgroundColor: Colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        elevation: 10,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
    },
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
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    form: { flex: 1 },
    forgotBtn: { alignSelf: 'flex-end', marginBottom: 32 },
    forgotText: { color: Colors.primary, fontWeight: '700', fontSize: 14 },
    submitBtn: { marginTop: 8 },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    linkText: { color: Colors.textMuted, fontSize: 15, fontWeight: '500' },
    linkTextBold: { color: Colors.primary, fontSize: 15, fontWeight: '700' }
});
