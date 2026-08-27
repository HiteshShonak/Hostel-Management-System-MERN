import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useStudentDetail } from '@/lib/hooks';
import { useTheme } from '@/lib/contexts/theme';

export default function StudentDetailScreen() {
    const { colors, isDark } = useTheme();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data, isLoading } = useStudentDetail(id || '');

    if (isLoading || !data) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <PageHeader title="Student Details" showBack />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
                <BottomNav />
            </View>
        );
    }

    const { student, passes } = data;

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="Student Details" showBack />

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Profile Card */}
                <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
                    <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                        <Text style={styles.avatarText}>
                            {student.name.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                    <Text style={[styles.studentName, { color: colors.text }]}>{student.name}</Text>
                    <Text style={[styles.studentEmail, { color: colors.textSecondary }]}>{student.email}</Text>

                    {/* Status Badges */}
                    <View style={styles.badgeRow}>
                        {passes.isCurrentlyOut ? (
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

                {/* Info Grid */}
                <View style={styles.infoGrid}>
                    <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                        <Ionicons name="id-card" size={20} color={colors.primary} />
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Roll No</Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>{student.rollNo}</Text>
                    </View>
                    <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                        <Ionicons name="school" size={20} color={colors.primary} />
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Year</Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>
                            {student.year
                                ? `${student.year}${student.year === 1 ? 'st' : student.year === 2 ? 'nd' : student.year === 3 ? 'rd' : 'th'} Year`
                                : 'N/A'}
                        </Text>
                    </View>
                    <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                        <Ionicons name="bed" size={20} color={colors.primary} />
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Room</Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>{student.room}</Text>
                    </View>
                    <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                        <Ionicons name="business" size={20} color={colors.primary} />
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Hostel</Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>{student.hostel}</Text>
                    </View>
                    <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                        <Ionicons name="call" size={20} color={colors.primary} />
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Phone</Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>{student.phone}</Text>
                    </View>
                </View>

                {/* Gate Pass Section */}
                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Gate Passes</Text>

                    {passes.activePass && (
                        <View style={[styles.activePass, {
                            backgroundColor: isDark ? '#052e16' : '#f0fdf4',
                            borderColor: isDark ? '#14532d' : '#86efac'
                        }]}>
                            <View style={styles.activePassHeader}>
                                <Ionicons name="shield-checkmark" size={20} color={isDark ? '#86efac' : '#16a34a'} />
                                <Text style={[styles.activePassTitle, { color: isDark ? '#86efac' : '#16a34a' }]}>Active Pass</Text>
                            </View>
                            <Text style={[styles.passReason, { color: colors.text }]}>{passes.activePass.reason}</Text>
                            <Text style={[styles.passDate, { color: isDark ? '#86efac' : '#16a34a' }]}>
                                {formatDate(passes.activePass.fromDate)} - {formatDate(passes.activePass.toDate)}
                            </Text>
                        </View>
                    )}

                    {passes.recent.length > 0 ? (
                        passes.recent.slice(0, 5).map((pass) => (
                            <View key={pass._id} style={[styles.passCard, { borderBottomColor: colors.cardBorder }]}>
                                <View style={styles.passInfo}>
                                    <Text style={[styles.passReason, { color: colors.text }]} numberOfLines={1}>
                                        {pass.reason}
                                    </Text>
                                    <Text style={[styles.passDate, { color: colors.textSecondary }]}>
                                        {formatDate(pass.fromDate)} - {formatDate(pass.toDate)}
                                    </Text>
                                </View>
                                <View style={[
                                    styles.statusBadge,
                                    pass.status === 'APPROVED' ? { backgroundColor: isDark ? '#052e16' : '#f0fdf4' } :
                                        pass.status === 'REJECTED' ? { backgroundColor: isDark ? '#451a03' : '#fef2f2' } : { backgroundColor: isDark ? '#422006' : '#fef3c7' }
                                ]}>
                                    <Text style={[
                                        styles.statusText,
                                        pass.status === 'APPROVED' ? { color: isDark ? '#86efac' : '#16a34a' } :
                                            pass.status === 'REJECTED' ? { color: isDark ? '#fca5a5' : '#dc2626' } : { color: isDark ? '#fcd34d' : '#f59e0b' }
                                    ]}>
                                        {pass.status.replace('_', ' ')}
                                    </Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No gate passes found</Text>
                    )}
                </View>
            </ScrollView>

            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 100 },

    // Profile Card
    profileCard: {
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    avatarText: { fontSize: 32, fontWeight: '700', color: 'white' },
    studentName: { fontSize: 22, fontWeight: '700' },
    studentEmail: { fontSize: 14, marginTop: 4 },
    badgeRow: { flexDirection: 'row', marginTop: 12, gap: 8 },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    outBadgeText: { fontSize: 13, fontWeight: '600' },
    inBadgeText: { fontSize: 13, fontWeight: '600' },

    // Info Grid
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 16,
    },
    infoCard: {
        width: '48%',
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
    },
    infoLabel: { fontSize: 13, marginTop: 6 },
    infoValue: { fontSize: 15, fontWeight: '600', marginTop: 2 },

    // Section
    section: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },

    // Passes
    activePass: {
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
    },
    activePassHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6,
    },
    activePassTitle: { fontSize: 14, fontWeight: '600' },
    passCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    passInfo: { flex: 1, marginRight: 12 },
    passReason: { fontSize: 14, fontWeight: '500' },
    passDate: { fontSize: 13, marginTop: 2 },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    statusText: { fontSize: 13, fontWeight: '600' },
    emptyText: { fontSize: 14, textAlign: 'center', paddingVertical: 16 },
});
