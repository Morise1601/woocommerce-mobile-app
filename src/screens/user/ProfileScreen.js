import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { Colors } from '../../theme/Colors';
import { ScreenWrapper, SafeLinearGradient } from '../../components/ThemeComponents';

export default function ProfileScreen({ navigation }) {
    const { user, logout } = useContext(AuthContext);

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: logout }
        ]);
    };

    const MenuItem = ({ icon, title, subtitle, onPress, color = Colors.primary }) => (
        <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
                <Ionicons name={icon} size={22} color={color} />
            </View>
            <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{title}</Text>
                {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
        </TouchableOpacity>
    );

    return (
        <ScreenWrapper>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                            <Ionicons name="chevron-back" size={24} color={Colors.white} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Profile</Text>
                        <TouchableOpacity style={styles.settingsBtn}>
                            <Ionicons name="settings-outline" size={24} color={Colors.white} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.profileCard}>
                        <View style={styles.avatarContainer}>
                            <SafeLinearGradient
                                colors={[Colors.primary, Colors.secondary]}
                                style={styles.avatarGradient}
                            />
                            <Image
                                source={{ uri: 'https://ui-avatars.com/api/?name=' + (user?.first_name || 'User') + '&background=020617&color=fff&size=128' }}
                                style={styles.avatar}
                            />
                            <TouchableOpacity style={styles.editAvatarBtn}>
                                <Ionicons name="camera" size={16} color={Colors.white} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.userName}>{user?.first_name} {user?.last_name}</Text>
                        <Text style={styles.userEmail}>{user?.email || 'customer@example.com'}</Text>

                        <TouchableOpacity style={styles.editProfileBtn}>
                            <Text style={styles.editProfileText}>Edit Account</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>My Activity</Text>
                        <View style={styles.menuList}>
                            <MenuItem
                                icon="receipt-outline"
                                title="My Orders"
                                subtitle="Check status of your purchases"
                                onPress={() => navigation.navigate('Orders')}
                            />
                            <MenuItem
                                icon="heart-outline"
                                title="Wishlist"
                                subtitle="Your favorite items saved"
                                onPress={() => {}}
                            />
                            <MenuItem
                                icon="location-outline"
                                title="Shipping Address"
                                subtitle="Manage your delivery locations"
                                onPress={() => {}}
                            />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Settings & Privacy</Text>
                        <View style={styles.menuList}>
                            <MenuItem
                                icon="notifications-outline"
                                title="Notifications"
                                onPress={() => {}}
                            />
                            <MenuItem
                                icon="shield-checkmark-outline"
                                title="Privacy & Security"
                                onPress={() => {}}
                            />
                            <MenuItem
                                icon="log-out-outline"
                                title="Logout"
                                color={Colors.error}
                                onPress={handleLogout}
                            />
                        </View>
                    </View>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </SafeAreaView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 10 },
    headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.white, letterSpacing: -0.5 },
    backBtn: { width: 44, height: 44, borderRadius: 16, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
    settingsBtn: { width: 44, height: 44, borderRadius: 16, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
    profileCard: { alignItems: 'center', padding: 24, marginBottom: 8 },
    avatarContainer: { position: 'relative', marginBottom: 20, width: 110, height: 110, justifyContent: 'center', alignItems: 'center' },
    avatarGradient: { position: 'absolute', width: 110, height: 110, borderRadius: 45, transform: [{ rotate: '45deg' }] },
    avatar: { width: 100, height: 100, borderRadius: 40, borderWidth: 3, borderColor: Colors.background },
    editAvatarBtn: { position: 'absolute', bottom: 5, right: 5, width: 34, height: 34, borderRadius: 12, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: Colors.background },
    userName: { fontSize: 26, fontWeight: '800', color: Colors.white, marginBottom: 6, letterSpacing: -0.5 },
    userEmail: { fontSize: 14, color: Colors.textMuted, marginBottom: 20, fontWeight: '500' },
    editProfileBtn: { paddingHorizontal: 32, paddingVertical: 12, borderRadius: 16, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
    editProfileText: { color: Colors.white, fontSize: 14, fontWeight: '700' },
    section: { paddingHorizontal: 24, marginTop: 24 },
    sectionLabel: { fontSize: 13, fontWeight: '800', color: Colors.primary, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1.5 },
    menuList: { backgroundColor: Colors.surface, borderRadius: 28, overflow: 'hidden', paddingVertical: 8, borderWidth: 1, borderColor: Colors.border },
    menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
    iconContainer: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    menuContent: { flex: 1 },
    menuTitle: { fontSize: 16, fontWeight: '700', color: Colors.white },
    menuSubtitle: { fontSize: 13, color: Colors.textMuted, marginTop: 3, fontWeight: '500' },
});
