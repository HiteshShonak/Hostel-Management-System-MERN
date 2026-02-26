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
        refetchInterval: 30000,
        retry: false,
    });

    const getGreeting = () => {
        const hour = getCurrentISTHour();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: headerBg }]}>
                <ActivityIndicator color={textColor} />
            </View>
        );
    }

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
                    <Text style={[styles.greetingName, { color: textColor }]} numberOfLines={1}>
                        {getGreeting()}, {user?.name?.split(' ')[0] || 'Guest'}
                    </Text>
                </View>
            </View>

            {/* Notification Bell */}
            <Pressable
                style={styles.notificationBtn}
                onPress={() => router.push('/notifications')}
            >
                <Ionicons name="notifications-outline" size={24} color={textColor} />
                {typeof unreadCount === 'number' && unreadCount > 0 && (
                    <View style={styles.notificationBadge}>
                        <Text style={styles.badgeText}>
                            {unreadCount > 9 ? '9+' : String(unreadCount)}
                        </Text>
                    </View>
                )}
            </Pressable>
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
        gap: 10,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1.5,
    },
    fallback: {},
    initials: {
        fontWeight: '600',
    },
    greetingName: {
        fontSize: 17,
        fontWeight: '600',
    },
    notificationBtn: {
        position: 'relative',
        padding: 4,
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
        fontSize: 12,
        fontWeight: '700',
    },
});
