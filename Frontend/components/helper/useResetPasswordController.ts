import { useState } from 'react';
import { Alert } from 'react-native';
import { useHelperResetPassword, useHelperSearchUsers } from '@/lib/hooks';
import type { HelperUserSearchResult } from '@/lib/services';

export const ROLE_COLORS: Record<string, string> = {
    student: '#6366f1',
    parent: '#f59e0b',
    warden: '#10b981',
    guard: '#3b82f6',
    mess_staff: '#ef4444',
    helper: '#8b5cf6',
    admin: '#64748b',
};

export function useResetPasswordController() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<HelperUserSearchResult | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [searchActive, setSearchActive] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const searchResult = useHelperSearchUsers(
        searchActive && searchQuery.trim().length >= 2 ? { search: searchQuery } : undefined
    );
    const resetMutation = useHelperResetPassword();

    const handleSearch = () => {
        if (searchQuery.trim().length < 2) {
            Alert.alert('Too Short', 'Please enter at least 2 characters to search.');
            return;
        }
        setSearchActive(true);
        setSelectedUser(null);
        setSuccessMessage('');
    };

    const handleSelect = (user: HelperUserSearchResult) => {
        setSelectedUser(user);
        setSearchActive(false);
        setNewPassword('');
        setConfirmPassword('');
        setSuccessMessage('');
    };

    const handleReset = () => {
        if (!selectedUser) return;
        if (!newPassword.trim() || newPassword.length < 8) {
            Alert.alert('Invalid Password', 'Password must be at least 8 characters.');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Mismatch', 'Passwords do not match.');
            return;
        }

        Alert.alert(
            'Confirm Reset',
            `Reset password for ${selectedUser.name} (${selectedUser.email})?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset Password',
                    style: 'destructive',
                    onPress: () => {
                        resetMutation.mutate(
                            { userId: selectedUser._id, newPassword },
                            {
                                onSuccess: () => {
                                    setSuccessMessage(`Password reset successfully for ${selectedUser.name}.`);
                                    setNewPassword('');
                                    setConfirmPassword('');
                                },
                                onError: (error: any) => {
                                    const msg = error?.response?.data?.message || error?.message || 'Reset failed.';
                                    Alert.alert('Error', msg);
                                },
                            }
                        );
                    },
                },
            ]
        );
    };

    const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
    const passwordStrong =
        newPassword.length >= 8 &&
        /[A-Z]/.test(newPassword) &&
        /[a-z]/.test(newPassword) &&
        /[0-9]/.test(newPassword);

    return {
        searchQuery,
        setSearchQuery,
        selectedUser,
        setSelectedUser,
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        showPassword,
        setShowPassword,
        showConfirm,
        setShowConfirm,
        searchActive,
        successMessage,
        searchResult,
        resetMutation,
        handleSearch,
        handleSelect,
        handleReset,
        passwordsMatch,
        passwordStrong,
    };
}
