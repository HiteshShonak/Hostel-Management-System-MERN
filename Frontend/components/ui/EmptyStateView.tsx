import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';

export interface EmptyStateViewProps {
    /** Icon name to display inside circle */
    icon?: keyof typeof Ionicons.glyphMap;
    /** Heading text */
    title: string;
    /** Subtitle or explanatory text */
    subtitle?: string;
    /** Action button label (e.g. 'Retry', 'Lodge Complaint', 'Go Back') */
    actionLabel?: string;
    /** Callback for action button */
    onAction?: () => void;
    /** Optional custom icon color */
    iconColor?: string;
    /** Optional container style */
    style?: ViewStyle;
}

export function EmptyStateView({
    icon = 'file-tray-outline',
    title,
    subtitle,
    actionLabel,
    onAction,
    iconColor,
    style,
}: EmptyStateViewProps) {
    const { colors, isDark } = useTheme();

    const effectiveIconColor = iconColor || colors.textTertiary;

    return (
        <View style={[styles.container, style]}>
            <View
                style={[
                    styles.iconCircle,
                    { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)' },
                ]}
            >
                <Ionicons name={icon} size={48} color={effectiveIconColor} />
            </View>

            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

            {subtitle ? (
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    {subtitle}
                </Text>
            ) : null}

            {actionLabel && onAction ? (
                <Pressable
                    style={[styles.actionBtn, { backgroundColor: colors.primary }]}
                    onPress={onAction}
                >
                    <Text style={styles.actionBtnText}>{actionLabel}</Text>
                </Pressable>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 50,
        paddingHorizontal: 24,
    },
    iconCircle: {
        width: 96,
        height: 96,
        borderRadius: 48,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        marginTop: 6,
        textAlign: 'center',
        lineHeight: 20,
    },
    actionBtn: {
        marginTop: 20,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    actionBtnText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
});