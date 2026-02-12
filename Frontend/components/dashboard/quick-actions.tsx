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
        // {
        //     icon: 'notifications',
        //     label: 'Notices',
        //     route: '/notices',
        //     color: 'white',
        //     bg: '#6366f1', // Indigo
        // },
        // {
        //     icon: 'shirt',
        //     label: 'Laundry',
        //     route: '/laundry',
        //     color: 'white',
        //     bg: '#06b6d4', // Cyan
        // },
        // {
        //     icon: 'people',
        //     label: 'Visitors',
        //     route: '/visitors',
        //     color: 'white',
        //     bg: '#14b8a6', // Teal
        // },
        // {
        //     icon: 'card',
        //     label: 'Payments',
        //     route: '/payments',
        //     color: 'white',
        //     bg: '#10b981', // Emerald
        // },
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
        gap: 16, // Spacing between items
        justifyContent: 'space-between',
    },
    itemContainer: {
        width: '21%', // Fits 4 items with gap (100% / 4 = 25% -> minus gap -> ~21-22%)
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    iconBox: {
        width: 64, // Large square like image
        height: 64,
        borderRadius: 20, // Squircle
        alignItems: 'center',
        justifyContent: 'center',
        // Subtle shadow matching image feel
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    label: {
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center',
        lineHeight: 16,
    },
});
