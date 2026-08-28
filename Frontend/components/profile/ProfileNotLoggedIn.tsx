import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/lib/contexts/theme';

/**
 * Placeholder empty state shown when accessed without an active session.
 */
export function ProfileNotLoggedIn() {
    const { colors } = useTheme();

    return (
        <View style={styles.notLoggedIn}>
            <Ionicons name="person-circle-outline" size={80} color={colors.textTertiary} />
            <Text style={[styles.notLoggedInTitle, { color: colors.text }]}>Not Logged In</Text>
            <Text style={[styles.notLoggedInText, { color: colors.textSecondary }]}>
                Sign in to access your profile
            </Text>
            <Pressable
                style={[styles.loginButton, { backgroundColor: colors.primary }]}
                onPress={() => router.push('/login')}
            >
                <Text style={styles.loginButtonText}>Sign In</Text>
            </Pressable>
            <Pressable style={styles.registerButton} onPress={() => router.push('/register')}>
                <Text style={[styles.registerButtonText, { color: colors.primary }]}>Create Account</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    notLoggedIn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    notLoggedInTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 16,
    },
    notLoggedInText: {
        fontSize: 14,
        marginTop: 4,
    },
    loginButton: {
        paddingVertical: 14,
        paddingHorizontal: 48,
        borderRadius: 12,
        marginTop: 24,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    registerButton: {
        paddingVertical: 14,
        paddingHorizontal: 48,
        marginTop: 12,
    },
    registerButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
