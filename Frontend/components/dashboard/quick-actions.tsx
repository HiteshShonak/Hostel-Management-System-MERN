import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/theme-context';

export function QuickActions() {
    const router = useRouter();
    const { colors } = useTheme();

    const actions = [
        {
            icon: 'qr-code',
            label: 'Gate Pass',
            route: '/gate-pass',
            color: 'white',
            bg: '#3b82f6', // Blue
        },
        {
            icon: 'restaurant',
            label: 'Mess Menu',
            route: '/mess-menu',
            color: 'white',
            bg: '#f97316', // Orange
        },
        {
            icon: 'warning',
            label: 'Complaints',
            route: '/complaints',
            color: 'white',
            bg: '#f59e0b', // Amber
        },
        {
            icon: 'alert-circle',
            label: 'Emergency',
            route: '/emergency',
            color: 'white',
            bg: '#ef4444', // Red
        }
    ];

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: colors.text }]}>Quick Actions</Text>
            <View style={styles.grid}>
                {actions.map((action, index) => (
                    <Pressable
                        key={index}
                        style={styles.itemContainer}
                        onPress={() => router.push(action.route as any)}
                    >
                        <View style={[styles.iconBox, { backgroundColor: action.bg }]}>
                            <Ionicons name={action.icon as any} size={28} color={action.color} />
                        </View>
                        <Text style={[styles.label, { color: colors.text }]}>{action.label}</Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'space-between',
    },
    itemContainer: {
        width: '21%',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    iconBox: {
        width: 64,
        height: 64,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center',
        lineHeight: 16,
    },
});
