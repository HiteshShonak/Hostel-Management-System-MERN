import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import { ProfileItem } from './useProfileController';

interface ProfileDetailsSectionProps {
    items: ProfileItem[];
}

/**
 * List card displaying role-specific student/staff attributes.
 */
export function ProfileDetailsSection({ items }: ProfileDetailsSectionProps) {
    const { colors, isDark } = useTheme();

    return (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            {items.map((item, index) => (
                <View
                    key={item.label}
                    style={[
                        styles.itemRow,
                        index !== items.length - 1 && [styles.itemBorder, { borderBottomColor: colors.cardBorder }],
                    ]}
                >
                    <View style={[styles.iconBox, { backgroundColor: isDark ? colors.backgroundSecondary : '#f5f5f5' }]}>
                        <Ionicons name={item.icon as any} size={20} color={colors.primary} />
                    </View>
                    <View style={styles.itemContent}>
                        <Text style={[styles.itemLabel, { color: colors.textSecondary }]}>{item.label}</Text>
                        <Text style={[styles.itemValue, { color: colors.text }]}>{item.value}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
    },
    itemBorder: {
        borderBottomWidth: 1,
    },
    iconBox: {
        padding: 8,
        borderRadius: 8,
    },
    itemContent: {
        flex: 1,
    },
    itemLabel: {
        fontSize: 13,
    },
    itemValue: {
        fontWeight: '500',
    },
});
