import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';

const menuItems = [
    { icon: 'settings', label: 'Settings', destructive: false },
    { icon: 'help-circle', label: 'Help & Support', destructive: false },
    { icon: 'log-out', label: 'Logout', destructive: true },
] as const;

interface ProfileMenuSectionProps {
    onPressItem: (label: string) => void;
}

/**
 * Action navigation rows for settings, support, and session logout.
 */
export function ProfileMenuSection({ onPressItem }: ProfileMenuSectionProps) {
    const { colors, isDark } = useTheme();

    return (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            {menuItems.map((item, index) => (
                <Pressable
                    key={item.label}
                    onPress={() => onPressItem(item.label)}
                    style={[
                        styles.itemRow,
                        index !== menuItems.length - 1 && [styles.itemBorder, { borderBottomColor: colors.cardBorder }],
                    ]}
                >
                    <View
                        style={[
                            styles.iconBox,
                            item.destructive && (isDark ? { backgroundColor: '#3a1a1a' } : styles.iconBoxDestructive),
                            !item.destructive && { backgroundColor: isDark ? colors.backgroundSecondary : '#f5f5f5' },
                        ]}
                    >
                        <Ionicons
                            name={item.icon as any}
                            size={20}
                            color={item.destructive ? colors.danger : colors.primary}
                        />
                    </View>
                    <Text style={[styles.menuLabel, { color: item.destructive ? colors.danger : colors.text }]}>
                        {item.label}
                    </Text>
                    <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </Pressable>
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
    iconBoxDestructive: {
        backgroundColor: '#fef2f2',
    },
    menuLabel: {
        flex: 1,
        fontWeight: '500',
    },
});
