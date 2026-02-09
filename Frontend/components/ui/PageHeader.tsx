import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { notificationService } from '@/lib/services';
import { useTheme } from '@/lib/theme-context';

interface PageHeaderProps {
    title: string;
    showBack?: boolean;
    showNotifications?: boolean;
}

export function PageHeader({ title, showBack = true, showNotifications = true }: PageHeaderProps) {
    const router = useRouter();
    const { isDark } = useTheme();

    // Header colors: Blue for light mode, elegant dark slate for dark mode
    const headerBg = isDark ? '#1e293b' : '#1d4ed8';
    const iconColor = isDark ? '#e2e8f0' : 'white';

    // Only fetch unread count when notifications are enabled
    // Using retry:false and throwOnError:false to prevent crashes
    const { data: unreadCount } = useQuery({
        queryKey: ['notifications', 'unread-count'],
        queryFn: async () => {
            try {
                return await notificationService.getUnreadCount();
            } catch {
                return 0; // Return 0 on error silently
            }
        },
        enabled: showNotifications,
        refetchInterval: showNotifications ? 30000 : false,
        retry: false,
    });

    return (
        <View style={[styles.container, { backgroundColor: headerBg }]}>
            {showBack ? (
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={iconColor} />
                </Pressable>
            ) : (
                <View style={styles.placeholder} />
            )}
            <Text style={[styles.title, { color: iconColor }]}>{title}</Text>
            {showNotifications ? (
                <Pressable onPress={() => router.push('/notifications')} style={styles.bellButton}>
                    <Ionicons name="notifications-outline" size={24} color={iconColor} />
                    {typeof unreadCount === 'number' && unreadCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                                {unreadCount > 9 ? '9+' : String(unreadCount)}
                            </Text>
                        </View>
                    )}
                </Pressable>
            ) : (
                <View style={styles.placeholder} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 12,
    },
    backButton: {
        padding: 4,
    },
    bellButton: {
        padding: 4,
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -2,
        right: -2,
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
    title: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
    },
    placeholder: {
        width: 32,
    },
});
