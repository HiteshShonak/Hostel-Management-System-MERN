import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserRole } from '@/lib/types';
import { useTheme } from '@/lib/contexts/theme';

export interface RoleOption {
    value: UserRole;
    label: string;
    icon: string;
}

export const DEFAULT_ROLES: RoleOption[] = [
    { value: 'student', label: 'Student', icon: 'school' },
    { value: 'parent', label: 'Parent', icon: 'people' },
    { value: 'guard', label: 'Guard', icon: 'shield-checkmark' },
    { value: 'warden', label: 'Warden', icon: 'shield' },
    { value: 'mess_staff', label: 'Mess Staff', icon: 'restaurant' },
    { value: 'helper', label: 'Helper', icon: 'person-add' },
];

interface RoleSelectGridProps {
    selectedRole: UserRole;
    onSelectRole: (role: UserRole) => void;
    roles?: RoleOption[];
    label?: string;
}

// Reusable role selection grid with icons and active highlights
export function RoleSelectGrid({
    selectedRole,
    onSelectRole,
    roles = DEFAULT_ROLES,
    label = 'Role (For Testing)',
}: RoleSelectGridProps) {
    const { colors, isDark } = useTheme();

    return (
        <View style={styles.container}>
            {label ? <Text style={[styles.label, { color: colors.text }]}>{label}</Text> : null}
            <View style={styles.grid}>
                {roles.map((r) => {
                    const isSelected = selectedRole === r.value;
                    return (
                        <Pressable
                            key={r.value}
                            style={[
                                styles.roleButton,
                                { backgroundColor: colors.card, borderColor: colors.border },
                                isSelected && {
                                    borderColor: colors.primary,
                                    backgroundColor: isDark ? 'rgba(29, 78, 216, 0.2)' : '#eff6ff',
                                },
                            ]}
                            onPress={() => onSelectRole(r.value)}
                        >
                            <Ionicons
                                name={r.icon as any}
                                size={20}
                                color={isSelected ? colors.primary : colors.textSecondary}
                            />
                            <Text
                                style={[
                                    styles.roleText,
                                    { color: colors.textSecondary },
                                    isSelected && { color: colors.primary },
                                ]}
                            >
                                {r.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 6,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    roleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderWidth: 2,
        minWidth: '30%',
    },
    roleText: {
        fontSize: 13,
        fontWeight: '600',
    },
});
