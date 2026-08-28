import React from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import type { AdminUser } from '@/lib/services';
import { ADMIN_ROLES, getRoleColors } from './useAdminUsersController';

interface RoleChangeModalProps {
    editingUser: AdminUser;
    newRole: string;
    onChangeNewRole: (role: string) => void;
    onClose: () => void;
    onSave: () => void;
    isPending: boolean;
}

export function RoleChangeModal({
    editingUser,
    newRole,
    onChangeNewRole,
    onClose,
    onSave,
    isPending,
}: RoleChangeModalProps) {
    const { colors, isDark } = useTheme();
    const ROLE_COLORS = getRoleColors(isDark);

    return (
        <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Change Role</Text>
                <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                    Select new role for {editingUser.name}
                </Text>

                <View style={styles.roleGrid}>
                    {ADMIN_ROLES.map((role) => {
                        const roleStyle = ROLE_COLORS[role];
                        return (
                            <Pressable
                                key={role}
                                style={[
                                    styles.roleOption,
                                    { backgroundColor: colors.backgroundSecondary, borderColor: colors.backgroundSecondary },
                                    newRole === role && { borderColor: '#7c3aed' },
                                ]}
                                onPress={() => onChangeNewRole(role)}
                            >
                                <View style={[styles.roleOptionIcon, { backgroundColor: roleStyle.bg }]}>
                                    <Ionicons name={roleStyle.icon as any} size={20} color={roleStyle.text} />
                                </View>
                                <Text style={[styles.roleOptionText, { color: colors.textSecondary }]}>
                                    {role.replace('_', ' ')}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                <View style={styles.modalActions}>
                    <Pressable
                        style={[styles.cancelBtn, { backgroundColor: colors.backgroundSecondary }]}
                        onPress={onClose}
                    >
                        <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancel</Text>
                    </Pressable>
                    <Pressable
                        style={[
                            styles.saveBtn,
                            (isPending || newRole === editingUser.role) && styles.saveBtnDisabled,
                        ]}
                        onPress={onSave}
                        disabled={isPending || newRole === editingUser.role}
                    >
                        {isPending ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Text style={styles.saveBtnText}>Save</Text>
                        )}
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
    modalContent: { borderRadius: 20, padding: 24 },
    modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
    modalSubtitle: { fontSize: 14, marginBottom: 20 },
    roleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
    roleOption: { width: '30%', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 2 },
    roleOptionIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    roleOptionText: { fontSize: 13, fontWeight: '500', textTransform: 'capitalize' },
    modalActions: { flexDirection: 'row', gap: 12 },
    cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
    cancelBtnText: { fontSize: 15, fontWeight: '600' },
    saveBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#7c3aed', alignItems: 'center' },
    saveBtnDisabled: { backgroundColor: '#d4d4d4' },
    saveBtnText: { fontSize: 15, fontWeight: '600', color: 'white' },
});
