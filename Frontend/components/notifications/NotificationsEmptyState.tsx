import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';

/**
 * Properties for customizing the notifications empty placeholder.
 */
export interface NotificationsEmptyStateProps {
    /** Main heading text displayed beneath the icon (default: 'No Notifications') */
    title?: string;
    /** Secondary description message (default: "You're all caught up!") */
    subtitle?: string;
}

/**
 * Placeholder view displayed when there are no notifications in history
 * or after all items have been cleared.
 */
export function NotificationsEmptyState({
    title = 'No Notifications',
    subtitle = "You're all caught up!",
}: NotificationsEmptyStateProps) {
    const { colors, isDark } = useTheme();

    return (
        <View style={styles.emptyState}>
            <View
                style={[
                    styles.iconCircle,
                    { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)' },
                ]}
            >
                <Ionicons
                    name="notifications-off-outline"
                    size={56}
                    color={colors.textTertiary}
                />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
                {title}
            </Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {subtitle}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 24,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
    },
    emptyText: {
        fontSize: 14,
        marginTop: 6,
        textAlign: 'center',
    },
});
