import React from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { notificationService } from '@/lib/services';
import { getCurrentISTHour } from '@/lib/utils/date';

export function DashboardHeader() {
    const { user, isLoading } = useAuth();
    const { isDark } = useTheme();
    const router = useRouter();

    // Header colors: Blue for light mode, elegant dark slate for dark mode
    const headerBg = isDark ? '#1e293b' : '#1d4ed8';
    const textColor = isDark ? '#e2e8f0' : 'white';
    const textSecondary = isDark ? 'rgba(226, 232, 240, 0.7)' : 'rgba(255, 255, 255, 0.8)';
    const badgeBg = isDark ? 'rgba(226, 232, 240, 0.1)' : 'rgba(255, 255, 255, 0.1)';
    const avatarBorder = isDark ? 'rgba(226, 232, 240, 0.3)' : 'rgba(255, 255, 255, 0.3)';
    const fallbackBg = isDark ? '#e2e8f0' : 'white';
    const fallbackText = isDark ? '#1e293b' : '#1d4ed8';

    // Fetch unread notification count
    const { data: unreadCount } = useQuery({
        queryKey: ['notifications', 'unread-count'],
        queryFn: async () => {
            try {
                return await notificationService.getUnreadCount();
            } catch {
                return 0;
            }
        },
        refetchInterval: 30000, // Refresh every 30 seconds
        retry: false,
    });

    const getGreeting = () => {
        const hour = getCurrentISTHour();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const getRoleLabel = () => {
        switch (user?.role) {
            case 'parent': return 'Parent';
            case 'warden': return 'Warden';
            case 'admin': return 'Admin';
            case 'guard': return 'Guard';
            case 'mess_staff': return 'Mess Staff';
            default: return null; // Students show room instead
        }
    };

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: headerBg }]}>
                <ActivityIndicator color={textColor} />
            </View>
        );
    }

    const roleLabel = getRoleLabel();

    return (
        <View style={[styles.container, { backgroundColor: headerBg }]}>
            <View style={styles.leftSection}>
                <Avatar style={[styles.avatar, { borderColor: avatarBorder }]}>
                    <AvatarImage src={user?.avatar || ''} alt={user?.name || 'User'} />
                    <AvatarFallback style={[styles.fallback, { backgroundColor: fallbackBg }]}>
                        <Text style={[styles.initials, { color: fallbackText }]}>
                            {user?.name?.split(' ').map((n) => n[0]).join('') || 'U'}
                        </Text>
                    </AvatarFallback>
                </Avatar>
                <View>
                    <Text style={[styles.greeting, { color: textSecondary }]}>{getGreeting()},</Text>
                    <Text style={[styles.name, { color: textColor }]}>{user?.name?.split(' ')[0] || 'Guest'}</Text>
                </View>
            </View>
            <View style={styles.rightSection}>
                {/* Show role badge for non-students, room badge for students */}
                <View style={[styles.roomBadge, { backgroundColor: badgeBg }]}>
                    <Ionicons name={roleLabel ? 'person' : 'location'} size={14} color={textColor} />
                    <Text style={[styles.roomText, { color: textColor }]}>
                        {roleLabel || `Room ${user?.room || '--'}`}
                    </Text>
                </View>

                {/* Notification Bell - Works for ALL users */}
                <Pressable
                    style={styles.notificationBtn}
                    onPress={() => router.push('/notifications')}
                >
                    <Ionicons name="notifications" size={20} color={textColor} />
                    {typeof unreadCount === 'number' && unreadCount > 0 && (
                        <View style={styles.notificationBadge}>
                            <Text style={styles.badgeText}>
                                {unreadCount > 9 ? '9+' : String(unreadCount)}
                            </Text>
                        </View>
                    )}
                </Pressable>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 2,
    },
    fallback: {},
    initials: {
        fontWeight: '600',
    },
    greeting: {
        fontSize: 14,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    roomBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 9999,
    },
    roomText: {
        fontSize: 14,
    },
    notificationBtn: {
        position: 'relative',
        padding: 8,
        borderRadius: 9999,
    },
    notificationBadge: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: '#ef4444',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '700',
    },
});

