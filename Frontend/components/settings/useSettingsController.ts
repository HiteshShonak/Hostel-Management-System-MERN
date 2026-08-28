import { useState } from 'react';
import { Alert } from 'react-native';
import { useChangePassword } from '@/lib/hooks';

/**
 * Controller hook for the Settings screen.
 * Handles change password validation, loading states, and form reset.
 */
export function useSettingsController() {
    const changePasswordMutation = useChangePassword();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const handleChangePassword = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all password fields');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Error', 'New password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New passwords do not match');
            return;
        }

        changePasswordMutation.mutate(
            { currentPassword, newPassword },
            {
                onSuccess: () => {
                    Alert.alert('Success', 'Password changed successfully');
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                },
                onError: (error: any) => {
                    const message =
                        error?.response?.data?.message ||
                        error?.response?.data?.error ||
                        'Failed to change password';
                    Alert.alert('Error', message);
                },
            }
        );
    };

    return {
        currentPassword,
        setCurrentPassword,
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        showCurrentPassword,
        setShowCurrentPassword,
        showNewPassword,
        setShowNewPassword,
        changePasswordMutation,
        handleChangePassword,
    };
}
