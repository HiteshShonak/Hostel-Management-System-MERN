import React from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useTheme } from '@/lib/contexts/theme';
import {
    useAdminUsersController,
    AdminUserFilters,
    AdminUserCard,
    RoleChangeModal,
} from '@/components/admin';

export default function AdminUsers() {
    const { colors, isDark } = useTheme();
    const {
        search,
        setSearch,
        roleFilter,
        setRoleFilter,
        editingUser,
        setEditingUser,
        newRole,
        setNewRole,
        data,
        isLoading,
        refetch,
        isRefetching,
        updateRoleMutation,
        handleUpdateRole,
        confirmRoleChange,
    } = useAdminUsersController();

    const users = data?.users || [];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="👥 User Management" showBack />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={['#7c3aed']} tintColor={colors.primary} />
                }
            >
                {/* Search & Filters */}
                <AdminUserFilters
                    search={search}
                    onChangeSearch={setSearch}
                    roleFilter={roleFilter}
                    onSelectRoleFilter={setRoleFilter}
                />

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
                    users.map((user) => (
                        <AdminUserCard key={user._id} user={user} onChangeRole={handleUpdateRole} />
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="people-outline" size={48} color={colors.textTertiary} />
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No users found</Text>
                    </View>
                )}
            </ScrollView>

            {/* Role Change Modal */}
            {editingUser && (
                <RoleChangeModal
                    editingUser={editingUser}
                    newRole={newRole}
                    onChangeNewRole={setNewRole}
                    onClose={() => setEditingUser(null)}
                    onSave={confirmRoleChange}
                    isPending={updateRoleMutation.isPending}
                />
            )}

            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 100 },
    statsRow: { marginBottom: 16 },
    statCard: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    statNumber: { fontSize: 28, fontWeight: '700' },
    statLabel: { fontSize: 13, marginTop: 4 },
    emptyState: { alignItems: 'center', paddingVertical: 60 },
    emptyText: { fontSize: 16, marginTop: 12 },
});
