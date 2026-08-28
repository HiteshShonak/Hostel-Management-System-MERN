import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import { User } from '@/lib/types';
import { RecentEntryItem } from './useRecentEntriesController';

interface RecentEntryCardProps {
    pass: RecentEntryItem;
    formatTime: (dateStr: string) => string;
    formatDate: (dateStr: string) => string;
    getTimeDiff: (entryTime: string, exitTime: string) => string;
}

export function RecentEntryCard({ pass, formatTime, formatDate, getTimeDiff }: RecentEntryCardProps) {
    const { colors, isDark } = useTheme();
    const user = typeof pass.user === 'object' ? (pass.user as User) : null;

    return (
        <View style={[styles.card, { backgroundColor: colors.card, borderLeftColor: colors.success }]}>
            <View style={styles.cardHeader}>
                <View style={[styles.avatar, { backgroundColor: colors.success }]}>
                    <Text style={styles.avatarText}>{user?.name?.charAt(0) || '?'}</Text>
                </View>
                <View style={styles.cardInfo}>
                    <Text style={[styles.studentName, { color: colors.text }]}>{user?.name || 'Unknown'}</Text>
                    <Text style={[styles.studentMeta, { color: colors.textSecondary }]}>
                        {user?.rollNo || ''} • Room {user?.room || 'N/A'} • {user?.hostel || ''}
                    </Text>
                    <Text style={styles.phoneText}>{user?.phone || 'N/A'}</Text>
                </View>

                {/* Duration or Late Badge */}
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                    <View style={[styles.durationBadge, { backgroundColor: isDark ? '#14532d' : '#f0fdf4' }]}>
                        <Text style={[styles.durationText, { color: isDark ? '#4ade80' : colors.success }]}>
                            {pass.exitTime && pass.entryTime ? getTimeDiff(pass.entryTime, pass.exitTime) : '-'}
                        </Text>
                    </View>

                    {pass.isLate && (
                        <View style={[styles.durationBadge, { backgroundColor: isDark ? '#431407' : '#fff7ed' }]}>
                            <Text style={[styles.durationText, { color: '#ea580c' }]}>LATE</Text>
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.detailsRow}>
                <View style={[styles.detailBox, { backgroundColor: isDark ? '#451a03' : '#fff7ed' }]}>
                    <Ionicons name="exit-outline" size={16} color="#f59e0b" />
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Exit</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>
                        {pass.exitTime ? formatTime(pass.exitTime) : 'N/A'}
                    </Text>
                </View>
                <View style={[styles.detailBox, { backgroundColor: isDark ? '#14532d' : '#f0fdf4' }]}>
                    <Ionicons name="enter-outline" size={16} color={colors.success} />
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Entry</Text>
                    <Text style={[styles.detailValue, { color: colors.success }]}>
                        {pass.entryTime ? formatTime(pass.entryTime) : 'N/A'}
                    </Text>
                </View>
            </View>

            <View style={[styles.reasonRow, { borderTopColor: colors.cardBorder }]}>
                {pass.isLate ? (
                    <>
                        <Ionicons name="warning" size={14} color="#ea580c" />
                        <Text style={[styles.reasonText, { color: '#ea580c' }]} numberOfLines={1}>
                            Returned {pass.lateDuration || 'late'}
                        </Text>
                    </>
                ) : (
                    <>
                        <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                        <Text style={[styles.reasonText, { color: colors.success }]} numberOfLines={1}>
                            Returned on time
                        </Text>
                    </>
                )}
                <Text style={[styles.dateText, { color: colors.textTertiary }]}>{pass.entryTime ? formatDate(pass.entryTime) : ''}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: { borderRadius: 12, padding: 14, marginBottom: 12, borderLeftWidth: 4 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    avatarText: { color: 'white', fontSize: 18, fontWeight: '700' },
    cardInfo: { flex: 1 },
    studentName: { fontSize: 16, fontWeight: '600' },
    studentMeta: { fontSize: 13, marginTop: 2 },
    phoneText: { fontSize: 12, color: '#1d4ed8', marginTop: 2 },
    durationBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    durationText: { fontSize: 12, fontWeight: '700' },
    detailsRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
    detailBox: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, padding: 8, borderRadius: 8 },
    detailLabel: { fontSize: 12 },
    detailValue: { fontSize: 13, fontWeight: '600' },
    reasonRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1 },
    reasonText: { flex: 1, fontSize: 13, marginLeft: 6 },
    dateText: { fontSize: 12 },
});
