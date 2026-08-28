import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useAdminUsers, useAdminUpdateRole } from '@/lib/hooks';
import type { AdminUser } from '@/lib/services';

export const ADMIN_ROLES = ['student', 'parent', 'warden', 'mess_staff', 'guard', 'admin', 'helper'] as const;

export const getRoleColors = (isDark: boolean): Record<string, { bg: string; text: string; icon: string }> => ({
    student: { bg: isDark ? '#172554' : '#eff6ff', text: isDark ? '#93c5fd' : '#1d4ed8', icon: 'school' },
    parent: { bg: isDark ? '#451a03' : '#fef3c7', text: isDark ? '#fcd34d' : '#b45309', icon: 'people' },
    warden: { bg: isDark ? '#052e16' : '#dcfce7', text: isDark ? '#86efac' : '#16a34a', icon: 'shield-checkmark' },
    mess_staff: { bg: isDark ? '#052e16' : '#f0fdf4', text: isDark ? '#86efac' : '#166534', icon: 'restaurant' },
    guard: { bg: isDark ? '#0c4a6e' : '#e0f2fe', text: isDark ? '#7dd3fc' : '#0284c7', icon: 'eye' },
    admin: { bg: isDark ? '#3b0764' : '#f3e8ff', text: isDark ? '#d8b4fe' : '#7c3aed', icon: 'settings' },
    helper: { bg: isDark ? '#1e1b4b' : '#eef2ff', text: isDark ? '#a5b4fc' : '#4338ca', icon: 'person-add' },
});

export function useAdminUsersController() {
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<string | null>(null);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [newRole, setNewRole] = useState<string>('');

    const { data, isLoading, refetch, isRefetching } = useAdminUsers({
        search: search || undefined,
        role: roleFilter || undefined,
    });

    const updateRoleMutation = useAdminUpdateRole();

    useEffect(() => {
        if (updateRoleMutation.isSuccess) {
            setEditingUser(null);
            setNewRole('');
            Alert.alert('Success', 'User role updated successfully');
        }
    }, [updateRoleMutation.isSuccess]);

    useEffect(() => {
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
                        onPress: () => updateRoleMutation.mutate({ userId: editingUser._id, role: newRole }),
                    },
                ]
            );
        }
    };

    return {
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
    };
}
