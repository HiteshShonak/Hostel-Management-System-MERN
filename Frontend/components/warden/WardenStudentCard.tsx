import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/lib/contexts/theme';
import { WardenStudentItem } from './useWardenStudentsController';

interface WardenStudentCardProps {
    student: WardenStudentItem;
}

export function WardenStudentCard({ student }: WardenStudentCardProps) {
    const { colors, isDark } = useTheme();

    const formatYear = (year?: number) => {
        if (!year) return '';
        const suffix = year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th';
        return ` • ${year}${suffix} Yr`;
    };

    return (
        <Pressable
            style={[styles.studentCard, { backgroundColor: colors.card }]}
            onPress={() => router.push(`/warden/student-detail?id=${student._id}`)}
        >
            {/* Avatar & Info */}
            <View style={styles.studentInfo}>
                <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                    <Text style={styles.avatarText}>
                        {student.name.charAt(0).toUpperCase()}
                    </Text>
                </View>
                <View style={styles.studentDetails}>
                    <Text style={[styles.studentName, { color: colors.text }]}>{student.name}</Text>
                    <Text style={[styles.studentMeta, { color: colors.textSecondary }]}>
                        {student.rollNo} • Room {student.room}{formatYear(student.year)}
                    </Text>
                </View>
            </View>

            {/* Status Badges */}
            <View style={styles.statusContainer}>
                {student.isOut ? (
                    <View style={[styles.badge, { backgroundColor: isDark ? '#451a03' : '#fff7ed' }]}>
                        <Ionicons name="walk" size={12} color="#f59e0b" />
                        <Text style={[styles.outBadgeText, { color: '#f59e0b' }]}>Out</Text>
                    </View>
                ) : (
                    <View style={[styles.badge, { backgroundColor: isDark ? '#052e16' : '#f0fdf4' }]}>
                        <Ionicons name="home" size={12} color={isDark ? '#86efac' : '#16a34a'} />
                        <Text style={[styles.presentBadgeText, { color: isDark ? '#86efac' : '#16a34a' }]}>Inside</Text>
                    </View>
                )}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    studentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
    },
    studentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    studentDetails: { flex: 1 },
    studentName: { fontSize: 16, fontWeight: '600' },
    studentMeta: { fontSize: 13, marginTop: 2 },
    statusContainer: { marginLeft: 8 },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    outBadgeText: { fontSize: 12, fontWeight: '600' },
    presentBadgeText: { fontSize: 12, fontWeight: '600' },
});
