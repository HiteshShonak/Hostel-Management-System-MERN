import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/lib/contexts/theme';
import { useCurrentGatePass } from '@/lib/hooks';

export function ActivePassCard() {
    const { colors, isDark } = useTheme();
    const { data } = useCurrentGatePass();

    // don't show anything if no active pass
    if (!data?.pass) return null;

    const { pass, isCurrentlyOut } = data;

    const toDate = new Date(pass.toDate);
    const returnTime = toDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const returnDate = toDate.toLocaleDateString([], { month: 'short', day: 'numeric' });

    // theme colors matching attendance card pattern
    const themeColor = isCurrentlyOut
        ? (isDark ? '#fb923c' : '#ea580c')
        : (isDark ? '#60a5fa' : '#2563eb');

    const bgColor = isCurrentlyOut
        ? (isDark ? '#431407' : '#fff7ed')
        : (isDark ? '#172554' : '#eff6ff');

    const borderColor = isCurrentlyOut
        ? (isDark ? '#7c2d12' : '#fdba74')
        : (isDark ? '#1e3a8a' : '#93c5fd');

    const iconBg = isCurrentlyOut
        ? (isDark ? '#7c2d12' : '#fed7aa')
        : (isDark ? '#1e40af' : '#bfdbfe');

    return (
        <View style={styles.container}>
            <Pressable
                style={[
                    styles.card,
                    {
                        backgroundColor: bgColor,
                        borderColor: borderColor,
                    },
                ]}
                onPress={() => router.push('/shared/gate-pass')}
            >
                <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
                    <Ionicons
                        name={isCurrentlyOut ? 'walk' : 'document-text'}
                        size={28}
                        color={themeColor}
                    />
                </View>
                <View style={styles.content}>
                    <Text style={[styles.title, { color: themeColor }]}>
                        {isCurrentlyOut ? 'Currently Outside' : 'Active Gate Pass'}
                    </Text>
                    <Text style={[styles.subtitle, { color: isDark ? '#9ca3af' : '#4b5563' }]}>
                        {isCurrentlyOut
                            ? `Return by ${returnTime}, ${returnDate}`
                            : `Valid until ${returnDate}`
                        }
                    </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={themeColor} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 2,
        gap: 16,
    },
    iconContainer: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 4,
        letterSpacing: 0.3,
    },
    subtitle: {
        fontSize: 13,
        fontWeight: '500',
    },
});
