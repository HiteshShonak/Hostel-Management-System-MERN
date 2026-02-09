import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useStudentsOut } from '@/lib/hooks';
import { PRIMARY_COLOR } from '@/lib/constants';
import { GatePass, User } from '@/lib/types';
import { useTheme } from '@/lib/theme-context';

export default function StudentsOutScreen() {
    const { colors, isDark } = useTheme();
    const [refreshing, setRefreshing] = useState(false);
    const { data, isLoading, refetch } = useStudentsOut();

    const studentsOut = data || [];

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    // Soft Red Color Palette
    const softRed = {
        light: { bg: '#fff1f2', text: '#be123c', border: '#fecdd3', icon: '#fb7185' },
        dark: { bg: '#2a0a0a', text: '#fca5a5', border: '#4c0519', icon: '#f43f5e' }
    };

    if (isLoading && !refreshing) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <PageHeader title="Students Outside" showBack />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
                <BottomNav />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="Students Outside" showBack />

            {/* Summary */}
            <View style={[styles.summaryBar, {
                backgroundColor: isDark ? softRed.dark.bg : softRed.light.bg,
                borderBottomColor: isDark ? softRed.dark.border : softRed.light.border
            }]}>
                <View style={[styles.summaryIcon, { backgroundColor: isDark ? softRed.dark.border : 'white' }]}>
                    <Ionicons name="walk" size={20} color={isDark ? softRed.dark.icon : softRed.light.icon} />
                </View>
                <Text style={[styles.summaryText, { color: isDark ? softRed.dark.text : softRed.light.text }]}>
                    {studentsOut.length} students currently outside
                </Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
                }
            >
                {studentsOut.length > 0 ? (
                    studentsOut.map((pass: GatePass) => {
                        const user = typeof pass.user === 'object' ? pass.user as User : null;
                        return (
                            <View key={pass._id} style={[
                                styles.card,
                                {
                                    backgroundColor: colors.card,
                                    borderLeftColor: isDark ? softRed.dark.icon : softRed.light.icon
                                }
                            ]}>
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
                                        <Text style={[styles.phoneText, { color: isDark ? softRed.dark.icon : softRed.light.icon }]}>📞 {user?.phone || 'N/A'}</Text>
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
                    })
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="home" size={64} color={colors.textTertiary} />
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>All Inside</Text>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No students are currently outside</Text>
                    </View>
                )}
            </ScrollView>

            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    summaryBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    summaryIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    summaryText: { fontSize: 15, fontWeight: '600' },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 100 },
    card: {
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatarText: { fontSize: 18, fontWeight: '600' },
    cardInfo: { flex: 1 },
    studentName: { fontSize: 16, fontWeight: '600' },
    studentMeta: { fontSize: 13, marginTop: 2 },
    phoneText: { fontSize: 12, marginTop: 4 },
    detailsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
    detailBox: {
        flex: 1,
        borderRadius: 10,
        padding: 12,
        alignItems: 'center',
    },
    detailLabel: { fontSize: 11, marginTop: 4 },
    detailValue: { fontSize: 16, fontWeight: '700', marginTop: 2 },
    detailDate: { fontSize: 11 },
    reasonRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingTop: 12, borderTopWidth: 1 },
    reasonText: { flex: 1, fontSize: 13 },
    emptyContainer: { alignItems: 'center', paddingVertical: 60 },
    emptyTitle: { fontSize: 18, fontWeight: '600', marginTop: 12 },
    emptyText: { fontSize: 14, marginTop: 4 },
});
