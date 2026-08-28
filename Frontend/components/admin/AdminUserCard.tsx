import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import type { AdminUser } from '@/lib/services';
import { getRoleColors } from './useAdminUsersController';

interface AdminUserCardProps {
    user: AdminUser;
    onChangeRole: (user: AdminUser) => void;
}

export function AdminUserCard({ user, onChangeRole }: AdminUserCardProps) {
    const { colors, isDark } = useTheme();
    const ROLE_COLORS = getRoleColors(isDark);
    const roleStyle = ROLE_COLORS[user.role] || ROLE_COLORS.student;

    return (
        <View style={[styles.userCard, { backgroundColor: colors.card }]}>
            <View style={styles.userHeader}>
                <View style={[styles.userAvatar, { backgroundColor: roleStyle.bg }]}>
                    <Ionicons name={roleStyle.icon as any} size={20} color={roleStyle.text} />
                </View>
                <View style={styles.userInfo}>
                    <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
                    <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user.email}</Text>
                </View>
                <View style={[styles.roleBadge, { backgroundColor: roleStyle.bg }]}>
                    <Text style={[styles.roleText, { color: roleStyle.text }]}>
                        {user.role.replace('_', ' ')}
                    </Text>
                </View>
            </View>

            <View style={[styles.userDetails, { borderTopColor: colors.cardBorder }]}>
                <View style={styles.detailItem}>
                    <Ionicons name="id-card" size={14} color={colors.textTertiary} />
                    <Text style={[styles.detailText, { color: colors.textSecondary }]}>{user.rollNo}</Text>
                </View>
                {user.role === 'student' && user.year && (
                    <View style={styles.detailItem}>
                        <Ionicons name="school" size={14} color={colors.textTertiary} />
                        <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                            {user.year === 1 ? '1st' : user.year === 2 ? '2nd' : user.year === 3 ? '3rd' : '4th'} Year
                        </Text>
                    </View>
                )}
                <View style={styles.detailItem}>
                    <Ionicons name="home" size={14} color={colors.textTertiary} />
                    <Text style={[styles.detailText, { color: colors.textSecondary }]}>Room {user.room}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Ionicons name="business" size={14} color={colors.textTertiary} />
                    <Text style={[styles.detailText, { color: colors.textSecondary }]}>{user.hostel}</Text>
                </View>
            </View>

            <Pressable
                style={[styles.changeRoleBtn, { backgroundColor: isDark ? '#3b0764' : '#f3e8ff' }]}
                onPress={() => onChangeRole(user)}
            >
                <Ionicons name="swap-horizontal" size={16} color={isDark ? '#d8b4fe' : '#7c3aed'} />
                <Text style={[styles.changeRoleBtnText, { color: isDark ? '#d8b4fe' : '#7c3aed' }]}>
                    Change Role
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    userCard: { borderRadius: 16, padding: 16, marginBottom: 12 },
    userHeader: { flexDirection: 'row', alignItems: 'center' },
    userAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    userInfo: { flex: 1 },
    userName: { fontSize: 15, fontWeight: '600' },
    userEmail: { fontSize: 13, marginTop: 2 },
    roleBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    roleText: { fontSize: 13, fontWeight: '600', textTransform: 'capitalize' },
    userDetails: { flexDirection: 'row', gap: 16, marginTop: 12, paddingTop: 12, borderTopWidth: 1 },
    detailItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    detailText: { fontSize: 13 },
    changeRoleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12, paddingVertical: 10, borderRadius: 8 },
    changeRoleBtnText: { fontSize: 13, fontWeight: '500' },
});
