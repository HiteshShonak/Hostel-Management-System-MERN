import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/lib/contexts/auth';
import { useTheme } from '@/lib/contexts/theme';
import { authService } from '@/lib/services';
import { useQueryClient } from '@tanstack/react-query';

export interface ProfileItem {
    icon: string;
    label: string;
    value: string;
}

/**
 * Controller hook for User Profile screen.
 * Handles profile item compilation by role, theme switching,
 * and user session termination / query cache clearing.
 */
export function useProfileController() {
    const { user, isLoading, signOut } = useAuth();
    const { mode, setMode, colors, isDark } = useTheme();
    const queryClient = useQueryClient();

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await authService.logout();
                        signOut();
                        queryClient.clear();
                        router.replace('/login');
                    },
                },
            ]
        );
    };

    const handleMenuPress = (label: string) => {
        if (label === 'Logout') {
            handleLogout();
        } else if (label === 'Settings') {
            router.push('/shared/settings');
        }
    };

    const formatYear = (y?: number) => {
        if (!y) return 'N/A';
        const suffix = y === 1 ? 'st' : y === 2 ? 'nd' : y === 3 ? 'rd' : 'th';
        return `${y}${suffix} Year`;
    };

    const profileItems: ProfileItem[] = [];
    if (user) {
        const isStudent = user.role === 'student';
        const isStaff = ['warden', 'admin', 'guard', 'mess_staff', 'helper'].includes(user.role);

        if (isStudent) {
            profileItems.push({ icon: 'keypad', label: 'Roll Number', value: user.rollNo || 'N/A' });
            profileItems.push({ icon: 'school', label: 'Academic Year', value: formatYear(user.year) });
            profileItems.push({ icon: 'bed', label: 'Room Number', value: user.room || 'N/A' });
            profileItems.push({ icon: 'business', label: 'Hostel', value: user.hostel || 'N/A' });
        } else if (isStaff) {
            profileItems.push({ icon: 'id-card', label: 'Employee ID', value: user.rollNo || 'N/A' });
        }

        profileItems.push({ icon: 'mail', label: 'Email', value: user.email });
        profileItems.push({ icon: 'call', label: 'Phone', value: user.phone || 'N/A' });
    }

    return {
        user,
        isLoading,
        mode,
        setMode,
        colors,
        isDark,
        profileItems,
        handleMenuPress,
    };
}
