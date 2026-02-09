import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, RefreshControl, ActivityIndicator, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useAdminUsers, useAdminUpdateRole } from '@/lib/hooks';
import { useTheme } from '@/lib/theme-context';
import { AdminUser } from '@/lib/services';

const ROLES = ['student', 'parent', 'warden', 'mess_staff', 'guard', 'admin'];

const getRoleColors = (isDark: boolean): Record<string, { bg: string; text: string; icon: string }> => ({
    student: { bg: isDark ? '#172554' : '#eff6ff', text: isDark ? '#93c5fd' : '#1d4ed8', icon: 'school' },
    parent: { bg: isDark ? '#451a03' : '#fef3c7', text: isDark ? '#fcd34d' : '#b45309', icon: 'people' },
    warden: { bg: isDark ? '#052e16' : '#dcfce7', text: isDark ? '#86efac' : '#16a34a', icon: 'shield-checkmark' },
    mess_staff: { bg: isDark ? '#052e16' : '#f0fdf4', text: isDark ? '#86efac' : '#166534', icon: 'restaurant' },
    guard: { bg: isDark ? '#0c4a6e' : '#e0f2fe', text: isDark ? '#7dd3fc' : '#0284c7', icon: 'eye' },
    admin: { bg: isDark ? '#3b0764' : '#f3e8ff', text: isDark ? '#d8b4fe' : '#7c3aed', icon: 'settings' },
});

export default function AdminUsers() {
    const { colors, isDark } = useTheme();
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<string | null>(null);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [newRole, setNewRole] = useState<string>('');

    const ROLE_COLORS = getRoleColors(isDark);

    const { data, isLoading, refetch, isRefetching } = useAdminUsers({
        search: search || undefined,
        role: roleFilter || undefined,
    });

    const updateRoleMutation = useAdminUpdateRole();

    React.useEffect(() => {
        if (updateRoleMutation.isSuccess) {
            setEditingUser(null);
            setNewRole('');
            Alert.alert('✅ Success', 'User role updated successfully');
        }
    }, [updateRoleMutation.isSuccess]);

    React.useEffect(() => {
        if (updateRoleMutation.isError) {
            Alert.alert('Error', (updateRoleMutation.error as any)?.message || 'Failed to update role');
        }
    }, [updateRoleMutation.isError]);

    const handleUpdateRole = (user: AdminUser) => {
        setEditingUser(user);
        setNewRole(user.role);
    };

    const confirmRoleChange = () => {
        if (editingUser && newRole && newRole !== editingUser.role) {
            Alert.alert(
                'Confirm Role Change',
                `Change ${editingUser.name}'s role from '${editingUser.role}' to '${newRole}'?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Confirm',
                        onPress: () => updateRoleMutation.mutate({ userId: editingUser._id, role: newRole })
                    },
                ]
            );
        }
    };

    const users = data?.users || [];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="👥 User Management" showBack />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={['#7c3aed']} tintColor={colors.primary} />
                }
            >
                {/* Search */}
                <View style={[styles.searchBox, { backgroundColor: colors.card }]}>
                    <Ionicons name="search" size={20} color={colors.textTertiary} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.text }]}
                        placeholder="Search users..."
                        placeholderTextColor={colors.textTertiary}
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>

                {/* Role Filters */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filterScroll}
                    contentContainerStyle={styles.filterContainer}
                >
                    <Pressable
                        style={[styles.filterChip, { backgroundColor: colors.card }, !roleFilter && styles.filterChipActive]}
                        onPress={() => setRoleFilter(null)}
                    >
                        <Text style={[styles.filterText, { color: colors.textSecondary }, !roleFilter && styles.filterTextActive]}>All</Text>
                    </Pressable>
                    {ROLES.map((role) => (
                        <Pressable
                            key={role}
                            style={[
                                styles.filterChip,
                                { backgroundColor: colors.card },
                                roleFilter === role && styles.filterChipActive
                            ]}
                            onPress={() => setRoleFilter(roleFilter === role ? null : role)}
                        >
                            <Text style={[
                                styles.filterText,
                                { color: colors.textSecondary },
                                roleFilter === role && styles.filterTextActive
                            ]}>
                                {role.replace('_', ' ')}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>

                {/* Stats */}
                {data?.stats && (
                    <View style={styles.statsRow}>
                        <View style={[styles.statCard, { backgroundColor: isDark ? '#3b0764' : '#f3e8ff' }]}>
                            <Text style={[styles.statNumber, { color: isDark ? '#d8b4fe' : '#7c3aed' }]}>{data.stats.total || 0}</Text>
                            <Text style={[styles.statLabel, { color: isDark ? '#d8b4fe' : '#7c3aed' }]}>Total Users</Text>
                        </View>
                    </View>
                )}

                {/* User List */}
                {isLoading ? (
                    <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
                ) : users.length > 0 ? (
                    users.map((user: AdminUser) => {
                        const roleStyle = ROLE_COLORS[user.role] || ROLE_COLORS.student;
                        return (
                            <View key={user._id} style={[styles.userCard, { backgroundColor: colors.card }]}>
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
                                    onPress={() => handleUpdateRole(user)}
                                >
                                    <Ionicons name="swap-horizontal" size={16} color={isDark ? '#d8b4fe' : '#7c3aed'} />
                                    <Text style={[styles.changeRoleBtnText, { color: isDark ? '#d8b4fe' : '#7c3aed' }]}>Change Role</Text>
                                </Pressable>
                            </View>
                        );
                    })
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="people-outline" size={48} color={colors.textTertiary} />
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No users found</Text>
                    </View>
                )}
            </ScrollView>

            {/* Role Change Modal */}
            {editingUser && (
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Change Role</Text>
                        <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                            Select new role for {editingUser.name}
                        </Text>

                        <View style={styles.roleGrid}>
                            {ROLES.map((role) => {
                                const roleStyle = ROLE_COLORS[role];
                                return (
                                    <Pressable
                                        key={role}
                                        style={[
                                            styles.roleOption,
                                            { backgroundColor: colors.backgroundSecondary, borderColor: colors.backgroundSecondary },
                                            newRole === role && { borderColor: '#7c3aed' }
                                        ]}
                                        onPress={() => setNewRole(role)}
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
                                onPress={() => setEditingUser(null)}
                            >
                                <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={[
                                    styles.saveBtn,
                                    (updateRoleMutation.isPending || newRole === editingUser.role) && styles.saveBtnDisabled
                                ]}
                                onPress={confirmRoleChange}
                                disabled={updateRoleMutation.isPending || newRole === editingUser.role}
                            >
                                {updateRoleMutation.isPending ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <Text style={styles.saveBtnText}>Save</Text>
                                )}
                            </Pressable>
                        </View>
                    </View>
                </View>
            )}

            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 100 },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 12,
        gap: 12,
    },
    searchInput: { flex: 1, paddingVertical: 14, fontSize: 15 },
    filterScroll: { marginBottom: 16 },
    filterContainer: { gap: 8 },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    filterChipActive: { backgroundColor: '#7c3aed' },
    filterText: { fontSize: 13, fontWeight: '500', textTransform: 'capitalize' },
    filterTextActive: { color: 'white' },
    statsRow: { marginBottom: 16 },
    statCard: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    statNumber: { fontSize: 28, fontWeight: '700' },
    statLabel: { fontSize: 12, marginTop: 4 },
    userCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    userHeader: { flexDirection: 'row', alignItems: 'center' },
    userAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    userInfo: { flex: 1 },
    userName: { fontSize: 15, fontWeight: '600' },
    userEmail: { fontSize: 12, marginTop: 2 },
    roleBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    roleText: { fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
    userDetails: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
    },
    detailItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    detailText: { fontSize: 12 },
    changeRoleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 12,
        paddingVertical: 10,
        borderRadius: 8,
    },
    changeRoleBtnText: { fontSize: 13, fontWeight: '500' },
    emptyState: { alignItems: 'center', paddingVertical: 60 },
    emptyText: { fontSize: 16, marginTop: 12 },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 24,
    },
    modalContent: {
        borderRadius: 20,
        padding: 24,
    },
    modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
    modalSubtitle: { fontSize: 14, marginBottom: 20 },
    roleGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
    },
    roleOption: {
        width: '30%',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        borderWidth: 2,
    },
    roleOptionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    roleOptionText: { fontSize: 11, fontWeight: '500', textTransform: 'capitalize' },
    modalActions: { flexDirection: 'row', gap: 12 },
    cancelBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelBtnText: { fontSize: 15, fontWeight: '600' },
    saveBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#7c3aed',
        alignItems: 'center',
    },
    saveBtnDisabled: { backgroundColor: '#d4d4d4' },
    saveBtnText: { fontSize: 15, fontWeight: '600', color: 'white' },
});
