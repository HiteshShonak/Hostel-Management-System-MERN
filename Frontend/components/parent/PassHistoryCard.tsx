import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';

interface PassHistoryCardProps {
    pass: any;
    statusStyle: { bg: string; text: string; icon: string };
}

export function PassHistoryCard({ pass, statusStyle }: PassHistoryCardProps) {
    const { colors, isDark } = useTheme();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <View style={[styles.passCard, { backgroundColor: colors.card }]}>
            <View style={styles.passHeader}>
                <View style={styles.studentInfo}>
                    <View style={[styles.studentAvatar, { backgroundColor: isDark ? '#422006' : '#fef3c7' }]}>
                        <Text style={[styles.avatarText, { color: isDark ? '#fbbf24' : '#b45309' }]}>
                            {pass.student.name.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                    <View>
                        <Text style={[styles.studentName, { color: colors.text }]}>{pass.student.name}</Text>
                        <Text style={[styles.studentDetails, { color: colors.textSecondary }]}>
                            {pass.student.rollNo} • Room {pass.student.room}
                        </Text>
                    </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    <Ionicons name={statusStyle.icon as any} size={14} color={statusStyle.text} />
                    <Text style={[styles.statusText, { color: statusStyle.text }]}>
                        {pass.status.replace('_', ' ')}
                    </Text>
                </View>
            </View>

            <View style={styles.passDetails}>
                <View style={styles.detailRow}>
                    <Ionicons name="document-text" size={16} color={colors.textSecondary} />
                    <Text style={[styles.detailText, { color: colors.textSecondary }]} numberOfLines={2}>
                        {pass.reason}
                    </Text>
                </View>
                <View style={styles.detailRow}>
                    <Ionicons name="calendar" size={16} color={colors.textSecondary} />
                    <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                        {formatDate(pass.fromDate)} → {formatDate(pass.toDate)}
                    </Text>
                </View>
            </View>

            <View style={[styles.passFooter, { borderTopColor: colors.border }]}>
                <Text style={[styles.footerText, { color: colors.textTertiary }]}>
                    Applied: {formatDate(pass.createdAt)} at {formatTime(pass.createdAt)}
                </Text>
                {pass.parentApprovedAt && (
                    <Text style={[styles.footerText, { color: colors.textTertiary }]}>
                        • Approved by you: {formatDate(pass.parentApprovedAt)}
                    </Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    passCard: { borderRadius: 16, padding: 16, marginBottom: 12 },
    passHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    studentInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
    studentAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontSize: 18, fontWeight: '700' },
    studentName: { fontSize: 15, fontWeight: '600' },
    studentDetails: { fontSize: 13, marginTop: 2 },
    statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 4 },
    statusText: { fontSize: 13, fontWeight: '600', textTransform: 'capitalize' },
    passDetails: { gap: 8, marginBottom: 12 },
    detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
    detailText: { fontSize: 14, flex: 1 },
    passFooter: { paddingTop: 12, borderTopWidth: 1, flexDirection: 'row', flexWrap: 'wrap' },
    footerText: { fontSize: 13 },
});
