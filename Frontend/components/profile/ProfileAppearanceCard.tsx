import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';

interface ProfileAppearanceCardProps {
    mode: 'light' | 'dark' | 'system';
    onSelectMode: (mode: 'light' | 'dark' | 'system') => void;
}

/**
 * Quick theme switcher card (Light / Dark / System).
 */
export function ProfileAppearanceCard({ mode, onSelectMode }: ProfileAppearanceCardProps) {
    const { colors, isDark } = useTheme();

    return (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.themeRow}>
                <View style={styles.themeHeader}>
                    <Ionicons name="color-palette" size={20} color={colors.textSecondary} />
                    <Text style={[styles.themeTitle, { color: colors.text }]}>Appearance</Text>
                </View>
                <View style={styles.themeToggleGroup}>
                    <Pressable
                        onPress={() => onSelectMode('light')}
                        style={[
                            styles.themeToggle,
                            { backgroundColor: colors.backgroundSecondary, borderColor: colors.cardBorder },
                            mode === 'light' && { borderColor: colors.primary, backgroundColor: isDark ? colors.primaryLight : '#eff6ff' },
                        ]}
                    >
                        <Ionicons name="sunny" size={20} color={mode === 'light' ? colors.primary : colors.textSecondary} />
                    </Pressable>
                    <Pressable
                        onPress={() => onSelectMode('dark')}
                        style={[
                            styles.themeToggle,
                            { backgroundColor: colors.backgroundSecondary, borderColor: colors.cardBorder },
                            mode === 'dark' && { borderColor: colors.primary, backgroundColor: isDark ? colors.primaryLight : '#eff6ff' },
                        ]}
                    >
                        <Ionicons name="moon" size={20} color={mode === 'dark' ? colors.primary : colors.textSecondary} />
                    </Pressable>
                    <Pressable
                        onPress={() => onSelectMode('system')}
                        style={[
                            styles.themeToggle,
                            { backgroundColor: colors.backgroundSecondary, borderColor: colors.cardBorder },
                            mode === 'system' && { borderColor: colors.primary, backgroundColor: isDark ? colors.primaryLight : '#eff6ff' },
                        ]}
                    >
                        <Ionicons name="phone-portrait" size={20} color={mode === 'system' ? colors.primary : colors.textSecondary} />
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    themeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    themeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    themeTitle: {
        fontSize: 14,
        fontWeight: '600',
    },
    themeToggleGroup: {
        flexDirection: 'row',
        gap: 8,
    },
    themeToggle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    },
});
