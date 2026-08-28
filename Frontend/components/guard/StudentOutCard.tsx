import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import { GatePass, User } from '@/lib/types';

interface StudentOutCardProps {
    pass: GatePass;
    softRed: {
        light: { bg: string; text: string; border: string; icon: string };
        dark: { bg: string; text: string; border: string; icon: string };
    };
    formatTime: (dateStr: string) => string;
    formatDate: (dateStr: string) => string;
}

export function StudentOutCard({ pass, softRed, formatTime, formatDate }: StudentOutCardProps) {
    const { colors, isDark } = useTheme();
    const user = typeof pass.user === 'object' ? (pass.user as User) : null;

    return (
        <View style={[styles.card, { backgroundColor: colors.card, borderLeftColor: isDark ? softRed.dark.icon : softRed.light.icon }]}>
            <View style={styles.cardHeader}>
                <View style={[styles.avatar, { backgroundColor: isDark ? softRed.dark.border : softRed.light.bg }]}>
                    <Text style={[styles.avatarText, { color: isDark ? softRed.dark.text : softRed.light.text }]}>
                        {user?.name?.charAt(0) || '?'}
                    </Text>
                </View>
                <View style={styles.cardInfo}>
                    <Text style={[styles.studentName, { color: colors.text }]}>{user?.name || 'Unknown'}</Text>
                    <Text style={[styles.studentMeta, { color: colors.textSecondary }]}>
                        {user?.rollNo || ''} • Room {user?.room || 'N/A'} • {user?.hostel || ''}
                    </Text>
                    <Text style={[styles.phoneText, { color: isDark ? softRed.dark.icon : softRed.light.icon }]}>
                        {user?.phone || 'N/A'}
                    </Text>
                </View>
            </View>

            <View style={styles.detailsRow}>
                <View style={[styles.detailBox, { backgroundColor: isDark ? colors.background : '#f9fafb' }]}>
                    <Ionicons name="exit-outline" size={16} color={isDark ? '#fb7185' : '#e11d48'} />
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Exit Time</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>
                        {pass.exitTime ? formatTime(pass.exitTime) : 'N/A'}
                    </Text>
                    <Text style={[styles.detailDate, { color: colors.textTertiary }]}>
                        {pass.exitTime ? formatDate(pass.exitTime) : ''}
                    </Text>
                </View>
                <View style={[styles.detailBox, { backgroundColor: isDark ? colors.background : '#f9fafb' }]}>
                    <Ionicons name="calendar-outline" size={16} color={isDark ? '#86efac' : '#16a34a'} />
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Expected Return</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{formatTime(pass.toDate)}</Text>
                    <Text style={[styles.detailDate, { color: colors.textTertiary }]}>{formatDate(pass.toDate)}</Text>
                </View>
            </View>

            <View style={[styles.reasonRow, { borderTopColor: colors.cardBorder }]}>
                <Ionicons name="document-text-outline" size={14} color={colors.textSecondary} />
                <Text style={[styles.reasonText, { color: colors.textSecondary }]} numberOfLines={1}>{pass.reason}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: { borderRadius: 12, padding: 14, marginBottom: 12, borderLeftWidth: 4 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    avatarText: { fontSize: 18, fontWeight: '700' },
    cardInfo: { flex: 1 },
    studentName: { fontSize: 16, fontWeight: '600' },
    studentMeta: { fontSize: 13, marginTop: 2 },
    phoneText: { fontSize: 12, marginTop: 2 },
    detailsRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
    detailBox: { flex: 1, padding: 10, borderRadius: 8 },
    detailLabel: { fontSize: 12, marginBottom: 2 },
    detailValue: { fontSize: 15, fontWeight: '600' },
    detailDate: { fontSize: 11, marginTop: 2 },
    reasonRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingTop: 10, borderTopWidth: 1 },
    reasonText: { fontSize: 13, flex: 1 },
});
