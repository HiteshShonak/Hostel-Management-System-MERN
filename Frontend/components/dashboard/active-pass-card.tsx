import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/lib/theme-context';
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

    return (
        <Pressable
            style={[
                styles.card,
                {
                    backgroundColor: isCurrentlyOut
                        ? (isDark ? '#431407' : '#fff7ed')
                        : (isDark ? '#172554' : '#eff6ff'),
                    borderColor: isCurrentlyOut
                        ? (isDark ? '#f97316' : '#fdba74')
                        : (isDark ? '#3b82f6' : '#93c5fd'),
                },
            ]}
            onPress={() => router.push('/gate-pass')}
        >
            <View style={[
                styles.iconContainer,
                {
                    backgroundColor: isCurrentlyOut
                        ? (isDark ? '#7c2d12' : '#fed7aa')
                        : (isDark ? '#1e3a5f' : '#bfdbfe'),
                },
            ]}>
                <Ionicons
                    name={isCurrentlyOut ? 'walk' : 'document-text'}
                    size={24}
                    color={isCurrentlyOut
                        ? (isDark ? '#fb923c' : '#ea580c')
                        : (isDark ? '#60a5fa' : '#2563eb')
                    }
                />
            </View>
            <View style={styles.info}>
                <Text style={[styles.status, {
                    color: isCurrentlyOut
                        ? (isDark ? '#fb923c' : '#ea580c')
                        : (isDark ? '#60a5fa' : '#2563eb'),
                }]}>
                    {isCurrentlyOut ? 'Currently Outside' : 'Active Pass'}
                </Text>
                <Text style={[styles.detail, { color: colors.textSecondary }]}>
                    {isCurrentlyOut
                        ? `Return by ${returnTime}, ${returnDate}`
                        : `Valid until ${returnDate}`
                    }
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 14,
        marginHorizontal: 16,
        marginBottom: 12,
        borderWidth: 1,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    info: {
        flex: 1,
    },
    status: {
        fontSize: 15,
        fontWeight: '700',
    },
    detail: {
        fontSize: 13,
        marginTop: 2,
    },
});
