import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';

export type StatusType =
    | 'APPROVED'
    | 'REJECTED'
    | 'PENDING'
    | 'PENDING_PARENT'
    | 'PENDING_WARDEN'
    | 'Resolved'
    | 'In Progress'
    | 'Open'
    | 'ACTIVE'
    | 'RESOLVED'
    | 'OUT'
    | 'IN'
    | 'EXIT'
    | 'ENTRY'
    | 'INSIDE'
    | 'EXPIRED'
    | 'CRITICAL'
    | 'LOW'
    | 'MEDIUM'
    | 'HIGH'
    | string;

export interface StatusPillBadgeProps {
    status: StatusType;
    label?: string;
    icon?: keyof typeof Ionicons.glyphMap;
    dot?: boolean;
    bg?: string;
    color?: string;
    size?: 'sm' | 'md' | 'lg';
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export function StatusPillBadge({
    status,
    label,
    icon,
    dot = false,
    bg,
    color,
    size = 'md',
    style,
    textStyle,
}: StatusPillBadgeProps) {
    const { isDark } = useTheme();

    const getStatusConfig = (rawStatus: string) => {
        const s = (rawStatus || '').toUpperCase();
        if (['APPROVED', 'RESOLVED', 'IN', 'ENTRY', 'INSIDE', 'SUCCESS'].includes(s)) {
            return {
                bgLight: '#dcfce7', bgDark: '#052e16', textLight: '#16a34a', textDark: '#4ade80',
                defaultLabel: s === 'IN' || s === 'ENTRY' ? '→ IN' : rawStatus.replace('_', ' '),
                defaultIcon: 'checkmark-circle' as keyof typeof Ionicons.glyphMap,
            };
        }
        if (['REJECTED', 'CRITICAL', 'FAILED', 'HIGH', 'DESTRUCTIVE'].includes(s)) {
            return {
                bgLight: '#fef2f2', bgDark: '#450a0a', textLight: '#dc2626', textDark: '#fca5a5',
                defaultLabel: rawStatus.replace('_', ' '),
                defaultIcon: 'close-circle' as keyof typeof Ionicons.glyphMap,
            };
        }
        if (['PENDING', 'PENDING_PARENT', 'PENDING_WARDEN', 'IN PROGRESS', 'OUT', 'EXIT', 'WARNING', 'MEDIUM'].includes(s)) {
            return {
                bgLight: '#fef3c7', bgDark: '#451a03', textLight: '#d97706', textDark: '#fbbf24',
                defaultLabel: s === 'OUT' || s === 'EXIT' ? '← OUT' : s === 'PENDING_PARENT' ? 'Pending Parent' : s === 'PENDING_WARDEN' ? 'Pending Warden' : rawStatus.replace('_', ' '),
                defaultIcon: 'time' as keyof typeof Ionicons.glyphMap,
            };
        }
        return {
            bgLight: '#f3f4f6', bgDark: '#1f2937', textLight: '#4b5563', textDark: '#9ca3af',
            defaultLabel: (rawStatus || '').replace('_', ' '),
            defaultIcon: 'information-circle' as keyof typeof Ionicons.glyphMap,
        };
    };

    const config = getStatusConfig(status);
    const badgeBg = bg || (isDark ? config.bgDark : config.bgLight);
    const badgeColor = color || (isDark ? config.textDark : config.textLight);
    const displayLabel = label || config.defaultLabel;
    const displayIcon = icon;

    const sizeStyle = size === 'sm' ? styles.badgeSm : size === 'lg' ? styles.badgeLg : styles.badgeMd;
    const textSizeStyle = size === 'sm' ? styles.textSm : size === 'lg' ? styles.textLg : styles.textMd;
    const iconSize = size === 'sm' ? 12 : size === 'lg' ? 16 : 14;

    return (
        <View style={[styles.badgeBase, sizeStyle, { backgroundColor: badgeBg }, style]}>
            {dot && <View style={[styles.dot, { backgroundColor: badgeColor }]} />}
            {displayIcon && <Ionicons name={displayIcon} size={iconSize} color={badgeColor} style={styles.icon} />}
            <Text style={[styles.textBase, textSizeStyle, { color: badgeColor }, textStyle]}>
                {displayLabel}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badgeBase: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start', borderRadius: 9999 },
    badgeSm: { paddingHorizontal: 8, paddingVertical: 2, gap: 4 },
    badgeMd: { paddingHorizontal: 10, paddingVertical: 4, gap: 6 },
    badgeLg: { paddingHorizontal: 14, paddingVertical: 6, gap: 8 },
    dot: { width: 6, height: 6, borderRadius: 3 },
    icon: { marginRight: 2 },
    textBase: { fontWeight: '600', textTransform: 'capitalize' },
    textSm: { fontSize: 11 },
    textMd: { fontSize: 12 },
    textLg: { fontSize: 14 },
});