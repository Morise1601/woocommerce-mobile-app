import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '../theme/Colors';
import { Ionicons } from '@expo/vector-icons';

// Safe Gradient Wrapper to prevent crashes if native module is not yet linked
export const SafeLinearGradient = ({ colors, style, children, ...props }) => {
    // Check if LinearGradient is correctly exported and has the native component
    // In some environments, it might be an empty object or missing the native component
    const isValid = LinearGradient && typeof LinearGradient !== 'undefined';
    
    if (!isValid) {
        return <View style={[style, { backgroundColor: colors[0] }]} {...props}>{children}</View>;
    }

    return (
        <LinearGradient colors={colors} style={style} {...props}>
            {children}
        </LinearGradient>
    );
};

export const ScreenWrapper = ({ children, style }) => {
    return (
        <SafeLinearGradient
            colors={Gradients.dark}
            style={[{ flex: 1 }, style]}
        >
            {children}
        </SafeLinearGradient>
    );
};

export const PrimaryButton = ({ title, onPress, loading, icon, style }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={loading}
            activeOpacity={0.8}
            style={[styles.buttonContainer, style]}
        >
            <SafeLinearGradient
                colors={Gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
            >
                {loading ? (
                    <ActivityIndicator color={Colors.white} />
                ) : (
                    <View style={styles.buttonContent}>
                        <Text style={styles.buttonText}>{title}</Text>
                        {icon && <Ionicons name={icon} size={20} color={Colors.white} style={styles.buttonIcon} />}
                    </View>
                )}
            </SafeLinearGradient>
        </TouchableOpacity>
    );
};

export const GlassInput = ({ icon, placeholder, secureTextEntry, value, onChangeText, rightIcon, onRightIconPress, ...props }) => {
    return (
        <View style={styles.inputWrapper}>
            <View style={styles.inputContainer}>
                {icon && <Ionicons name={icon} size={20} color={Colors.textMuted} style={styles.inputIcon} />}
                <View style={styles.inputContent}>
                    <Text style={styles.label}>{placeholder}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={placeholder}
                        placeholderTextColor={Colors.textMuted}
                        secureTextEntry={secureTextEntry}
                        value={value}
                        onChangeText={onChangeText}
                        {...props}
                    />
                </View>
                {rightIcon && (
                    <TouchableOpacity onPress={onRightIconPress}>
                        <Ionicons name={rightIcon} size={20} color={Colors.textMuted} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        height: 56,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    buttonIcon: {
        marginLeft: 8,
    },
    inputWrapper: {
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 64,
        borderWidth: 1,
        borderColor: 'rgba(51, 65, 85, 0.5)',
    },
    inputIcon: {
        marginRight: 12,
    },
    inputContent: {
        flex: 1,
    },
    label: {
        color: Colors.primary,
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 2,
    },
    input: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '500',
        paddingVertical: 5,
        paddingHorizontal: 0,
        margin: 0,
    }
});
