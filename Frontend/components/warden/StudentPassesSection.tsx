import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import { GatePass } from '@/lib/types';

interface StudentPassesSectionProps {
    activePass?: GatePass | null;
    recentPasses: GatePass[];
    formatDate: (dateStr: string) => string;
}

export function StudentPassesSection({ activePass, recentPasses, formatDate }: StudentPassesSectionProps) {
    const { colors, isDark } = useTheme();

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return { bg: isDark ? '#052e16' : '#f0fdf4', text: isDark ? '#86efac' : '#16a34a' };
            case 'REJECTED':
                return { bg: isDark ? '#451a03' : '#fef2f2', text: isDark ? '#fca5a5' : '#dc2626' };
            default:
                return { bg: isDark ? '#422006' : '#fef3c7', text: isDark ? '#fcd34d' : '#f59e0b' };
        }
    };

    return (
        <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Gate Passes</Text>

            {/* Active Pass Banner */}
            {activePass && (
                <View style={[styles.activePass, {
                    backgroundColor: isDark ? '#052e16' : '#f0fdf4',
                    borderColor: isDark ? '#14532d' : '#86efac'
                }]}>
                    <View style={styles.activePassHeader}>
                        <Ionicons name="shield-checkmark" size={20} color={isDark ? '#86efac' : '#16a34a'} />
                        <Text style={[styles.activePassTitle, { color: isDark ? '#86efac' : '#16a34a' }]}>Active Pass</Text>
                    </View>
                    <Text style={[styles.passReason, { color: colors.text }]}>{activePass.reason}</Text>
                    <Text style={[styles.passDate, { color: isDark ? '#86efac' : '#16a34a' }]}>
                        {formatDate(activePass.fromDate)} - {formatDate(activePass.toDate)}
                    </Text>
                </View>
            )}

            {/* Passes List or Empty State */}
            {recentPasses.length > 0 ? (
                recentPasses.slice(0, 5).map((pass) => {
                    const statusStyle = getStatusStyle(pass.status);
                    return (
                        <View key={pass._id} style={[styles.passCard, { borderBottomColor: colors.cardBorder }]}>
                            <View style={styles.passInfo}>
                                <Text style={[styles.passReason, { color: colors.text }]} numberOfLines={1}>
                                    {pass.reason}
                                </Text>
                                <Text style={[styles.passDate, { color: colors.textSecondary }]}>
                                    {formatDate(pass.fromDate)} - {formatDate(pass.toDate)}
                                </Text>
                            </View>
                            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                                <Text style={[styles.statusText, { color: statusStyle.text }]}>
                                    {pass.status.replace('_', ' ')}
                                </Text>
                            </View>
                        </View>
                    );
                })
            ) : (
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No gate passes found</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
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
