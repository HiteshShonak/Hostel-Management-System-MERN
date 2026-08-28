import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/lib/contexts/theme';

export interface DashboardActionItem {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    subtitle?: string;
    route?: string;
    onPress?: () => void;
    color?: string;
    bg?: string;
    cardBg?: string;
    variant?: 'grid-2' | 'grid-3' | 'grid-4' | 'list-card' | 'action-row';
}

interface DashboardActionCardProps extends DashboardActionItem {
    variant?: 'grid-2' | 'grid-3' | 'grid-4' | 'list-card' | 'action-row';
}

export function DashboardActionCard({
    icon,
    label,
    subtitle,
    route,
    onPress,
    color,
    bg,
    cardBg,
    variant = 'grid-2',
}: DashboardActionCardProps) {
    const { colors, isDark } = useTheme();

    const handlePress = () => {
        if (onPress) onPress();
        else if (route) router.push(route as any);
    };

    const effectiveIconColor = color || colors.primary;
    const effectiveBg = bg || (isDark ? '#172554' : '#eff6ff');

    if (variant === 'list-card') {
        return (
            <Pressable
                style={[styles.listCard, { backgroundColor: cardBg || colors.card }]}
                onPress={handlePress}
            >
                <View style={[styles.listIcon, { backgroundColor: effectiveBg }]}>
                    <Ionicons name={icon} size={28} color={effectiveIconColor} />
                </View>
                <View style={styles.listInfo}>
                    <Text style={[styles.listTitle, { color: colors.text }]}>{label}</Text>
                    {subtitle ? <Text style={[styles.listSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text> : null}
                </View>
                <Ionicons name="chevron-forward" size={20} color={effectiveIconColor} />
            </Pressable>
        );
    }

    if (variant === 'action-row') {
        return (
            <Pressable
                style={[styles.actionRowCard, { backgroundColor: cardBg || colors.card, borderColor: color ? `${color}40` : colors.cardBorder }]}
                onPress={handlePress}
            >
                <View style={[styles.actionRowIcon, { backgroundColor: bg || `${effectiveIconColor}22` }]}>
                    <Ionicons name={icon} size={28} color={effectiveIconColor} />
                </View>
                <View style={styles.listInfo}>
                    <Text style={[styles.actionRowTitle, { color: colors.text }]}>{label}</Text>
                    {subtitle ? <Text style={[styles.actionRowSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text> : null}
                </View>
                <View style={[styles.listArrow, { backgroundColor: `${effectiveIconColor}22` }]}>
                    <Ionicons name="chevron-forward" size={16} color={effectiveIconColor} />
                </View>
            </Pressable>
        );
    }

    if (variant === 'grid-4') {
        return (
            <Pressable style={styles.grid4Item} onPress={handlePress}>
                <View style={[styles.grid4IconBox, { backgroundColor: effectiveBg }]}>
                    <Ionicons name={icon} size={28} color={effectiveIconColor} />
                </View>
                <Text style={[styles.grid4Label, { color: colors.text }]}>{label}</Text>
            </Pressable>
        );
    }

    if (variant === 'grid-3') {
        return (
            <Pressable style={[styles.grid3Card, { backgroundColor: cardBg || colors.card }]} onPress={handlePress}>
                <View style={[styles.grid3Icon, { backgroundColor: effectiveBg }]}>
                    <Ionicons name={icon} size={24} color={effectiveIconColor} />
                </View>
                <Text style={[styles.grid3Label, { color: colors.text }]}>{label}</Text>
            </Pressable>
        );
    }

    return (
        <Pressable style={[styles.grid2Card, { backgroundColor: cardBg || colors.card }]} onPress={handlePress}>
            <View style={[styles.grid2Icon, { backgroundColor: effectiveBg }]}>
                <Ionicons name={icon} size={24} color={effectiveIconColor} />
            </View>
            <Text style={[styles.grid2Label, { color: colors.text }]}>{label}</Text>
            {subtitle ? <Text style={[styles.grid2Subtext, { color: colors.textSecondary }]}>{subtitle}</Text> : null}
        </Pressable>
    );
}

interface DashboardActionGridProps {
    actions: DashboardActionItem[];
    variant?: 'grid-2' | 'grid-3' | 'grid-4' | 'list-card' | 'action-row';
}

export function DashboardActionGrid({ actions, variant = 'grid-2' }: DashboardActionGridProps) {
    const containerStyle = (variant === 'list-card' || variant === 'action-row')
        ? styles.listContainer
        : variant === 'grid-4'
            ? styles.grid4Container
            : variant === 'grid-3'
                ? styles.grid3Container
                : styles.grid2Container;

    return (
        <View style={containerStyle}>
            {actions.map((act, idx) => (
                <DashboardActionCard key={act.route || act.label || idx} {...act} variant={variant} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    grid2Container: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
    grid2Card: { width: '47%', padding: 16, borderRadius: 16, alignItems: 'center' },
    grid2Icon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    grid2Label: { fontSize: 14, fontWeight: '500', textAlign: 'center' },
    grid2Subtext: { fontSize: 13, marginTop: 2 },

    grid3Container: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
    grid3Card: { width: '30%', padding: 16, borderRadius: 16, alignItems: 'center' },
    grid3Icon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    grid3Label: { fontSize: 13, fontWeight: '500', textAlign: 'center' },

    grid4Container: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between' },
    grid4Item: { width: '21%', alignItems: 'center', gap: 8, marginBottom: 8 },
    grid4IconBox: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    grid4Label: { fontSize: 12, fontWeight: '500', textAlign: 'center', lineHeight: 16 },

    listContainer: { gap: 12, marginBottom: 16 },
    listCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 4 },
    listIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    listInfo: { flex: 1 },
    listTitle: { fontSize: 16, fontWeight: '600' },
    listSubtitle: { fontSize: 13, marginTop: 2 },

    actionRowCard: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16, borderRadius: 18, borderWidth: 1.5 },
    actionRowIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
    actionRowTitle: { fontSize: 16, fontWeight: '700' },
    actionRowSubtitle: { fontSize: 13, marginTop: 2 },
    listArrow: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});
