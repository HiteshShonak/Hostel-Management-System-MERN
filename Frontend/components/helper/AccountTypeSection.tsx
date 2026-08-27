import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import { ALL_ROLES, RoleValue } from './useRegisterUserController';

interface AccountTypeSectionProps {
    role: RoleValue;
    onSelectRole: (role: RoleValue) => void;
}

export function AccountTypeSection({ role, onSelectRole }: AccountTypeSectionProps) {
    const { colors, isDark } = useTheme();

    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Account Type</Text>
            <View style={styles.roleGrid}>
                {ALL_ROLES.map((r) => {
                    const isSelected = role === r.value;
                    return (
                        <Pressable
                            key={r.value}
                            style={[
                                styles.roleChip,
                                { backgroundColor: colors.card, borderColor: colors.border },
                                isSelected && {
                                    borderColor: r.color,
                                    backgroundColor: isDark ? `${r.color}22` : `${r.color}11`,
                                },
                            ]}
                            onPress={() => onSelectRole(r.value)}
                        >
                            <Ionicons
                                name={r.icon as any}
                                size={18}
                                color={isSelected ? r.color : colors.textSecondary}
                            />
                            <Text
                                style={[
                                    styles.roleChipText,
                                    { color: isSelected ? r.color : colors.textSecondary },
                                    isSelected && { fontWeight: '700' },
                                ]}
                            >
                                {r.label}
                            </Text>
                            {isSelected && <View style={[styles.roleChipDot, { backgroundColor: r.color }]} />}
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: { gap: 14 },
    sectionTitle: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 },
    roleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    roleChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, borderWidth: 2, position: 'relative' },
    roleChipText: { fontSize: 13, fontWeight: '600' },
    roleChipDot: { width: 6, height: 6, borderRadius: 3, marginLeft: 2 },
});
