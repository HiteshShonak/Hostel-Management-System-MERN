import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';

interface StudentProfileCardProps {
    name: string;
    email: string;
    isCurrentlyOut: boolean;
}

export function StudentProfileCard({ name, email, isCurrentlyOut }: StudentProfileCardProps) {
    const { colors, isDark } = useTheme();

    return (
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                <Text style={styles.avatarText}>
                    {name.charAt(0).toUpperCase()}
                </Text>
            </View>
            <Text style={[styles.studentName, { color: colors.text }]}>{name}</Text>
            <Text style={[styles.studentEmail, { color: colors.textSecondary }]}>{email}</Text>

            {/* Status Badges */}
            <View style={styles.badgeRow}>
                {isCurrentlyOut ? (
                    <View style={[styles.badge, { backgroundColor: isDark ? '#451a03' : '#fff7ed' }]}>
                        <Ionicons name="walk" size={14} color="#f59e0b" />
                        <Text style={[styles.outBadgeText, { color: '#f59e0b' }]}>Currently Outside</Text>
                    </View>
                ) : (
                    <View style={[styles.badge, { backgroundColor: isDark ? '#052e16' : '#f0fdf4' }]}>
                        <Ionicons name="home" size={14} color={isDark ? '#86efac' : '#16a34a'} />
                        <Text style={[styles.inBadgeText, { color: isDark ? '#86efac' : '#16a34a' }]}>Inside Hostel</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    profileCard: {
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    avatarText: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
    },
    studentName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    studentEmail: {
        fontSize: 14,
        marginBottom: 12,
    },
    badgeRow: {
        flexDirection: 'row',
        gap: 8,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    outBadgeText: { fontSize: 13, fontWeight: '600' },
    inBadgeText: { fontSize: 13, fontWeight: '600' },
});
