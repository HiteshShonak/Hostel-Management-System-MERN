import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/lib/contexts/theme';

export interface DashboardStatItem {
    icon: keyof typeof Ionicons.glyphMap;
    value: number | string;
    label: string;
    color: string;
    bgLight?: string;
    bgDark?: string;
    route?: string;
    onPress?: () => void;
    width?: '48%' | '31%' | '23%' | '100%';
}

/**
 * Universal Stat / Metric tile for dashboards (Admin, Warden, Complaints, Activity Logs).
 */
export function DashboardStatCard({
    icon,
    value,
    label,
    color,
    bgLight = '#f0fdf4',
    bgDark = '#052e16',
    route,
    onPress,
    width = '48%',
}: DashboardStatItem) {
    const { colors, isDark } = useTheme();

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else if (route) {
            router.push(route as any);
        }
    };

    const ContainerComponent = onPress || route ? Pressable : View;

    return (
        <ContainerComponent
            style={[
                styles.statCard,
                {
                    width,
                    backgroundColor: isDark ? bgDark : bgLight,
                },
            ]}
            onPress={onPress || route ? handlePress : undefined}
        >
            <View style={[styles.statIcon, { backgroundColor: isDark ? bgDark : 'white' }]}>
                <Ionicons name={icon} size={22} color={color} />
            </View>
            <Text style={[styles.statNumber, { color: colors.text }]}>{value}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
        </ContainerComponent>
    );
}

interface DashboardStatGridProps {
    items: DashboardStatItem[];
    gap?: number;
}

/**
 * Grid container for multiple DashboardStatCards.
 */
export function DashboardStatGrid({ items, gap = 10 }: DashboardStatGridProps) {
    return (
        <View style={[styles.statsGrid, { gap }]}>
            {items.map((item, idx) => (
                <DashboardStatCard key={item.label || idx} {...item} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    statCard: {
        padding: 16,
        borderRadius: 14,
        alignItems: 'center',
    },
    statIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '700',
    },
    statLabel: {
        fontSize: 13,
        marginTop: 2,
    },
});
