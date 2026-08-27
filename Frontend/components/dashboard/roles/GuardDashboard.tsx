import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/lib/contexts/theme';
import { RecentNotices } from '@/components/dashboard/recent-notices';

// Guard dashboard component
export function GuardDashboard() {
    const { colors, isDark } = useTheme();
    return (
        <View style={styles.guardContent}>
            {/* Primary QR verification button */}
            <Pressable style={[styles.scanQRButton, {
                backgroundColor: isDark ? '#052e16' : '#dcfce7',
                borderColor: isDark ? '#14532d' : '#bbf7d0'
            }]} onPress={() => router.push('/shared/qr-scanner')}>
                <View style={[styles.scanQRIcon, { backgroundColor: colors.card }]}>
                    <Ionicons name="scan" size={48} color={isDark ? '#22c55e' : '#16a34a'} />
                </View>
                <View style={styles.scanQRTextContainer}>
                    <Text style={[styles.scanQRTitle, { color: isDark ? '#4ade80' : '#166534' }]}>Scan Gate Pass</Text>
                    <Text style={[styles.scanQRSubtitle, { color: isDark ? '#22c55e' : '#15803d' }]}>Verify student entry/exit</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={isDark ? '#4ade80' : '#16a34a'} />
            </Pressable>

            {/* Quick Actions */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
            <View style={styles.quickGrid}>
                <Pressable style={[styles.quickCard, { backgroundColor: colors.card }]} onPress={() => router.push('/guard/students-out')}>
                    <View style={[styles.quickIcon, { backgroundColor: isDark ? '#431407' : '#fff7ed' }]}>
                        <Ionicons name="walk" size={24} color="#f59e0b" />
                    </View>
                    <Text style={[styles.quickLabel, { color: colors.text }]}>Outside</Text>
                </Pressable>
                <Pressable style={[styles.quickCard, { backgroundColor: colors.card }]} onPress={() => router.push('/guard/recent-entries')}>
                    <View style={[styles.quickIcon, { backgroundColor: isDark ? '#052e16' : '#f0fdf4' }]}>
                        <Ionicons name="enter" size={24} color="#16a34a" />
                    </View>
                    <Text style={[styles.quickLabel, { color: colors.text }]}>Entries</Text>
                </Pressable>
                <Pressable style={[styles.quickCard, { backgroundColor: colors.card }]} onPress={() => router.push('/guard/activity-logs')}>
                    <View style={[styles.quickIcon, { backgroundColor: isDark ? '#1e1b4b' : '#e0e7ff' }]}>
                        <Ionicons name="footsteps" size={24} color="#4f46e5" />
                    </View>
                    <Text style={[styles.quickLabel, { color: colors.text }]}>Logs</Text>
                </Pressable>
                <Pressable style={[styles.quickCard, { backgroundColor: colors.card }]} onPress={() => router.push('/mess/mess-menu')}>
                    <View style={[styles.quickIcon, { backgroundColor: isDark ? '#052e16' : '#f0fdf4' }]}>
                        <Ionicons name="restaurant" size={24} color="#16a34a" />
                    </View>
                    <Text style={[styles.quickLabel, { color: colors.text }]}>Mess Menu</Text>
                </Pressable>
            </View>

            <RecentNotices />
        </View>
    );
}

const styles = StyleSheet.create({
    guardContent: { padding: 16 },
    scanQRButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 20,
        borderWidth: 2,
        marginBottom: 24,
    },
    scanQRIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    scanQRTextContainer: { flex: 1 },
    scanQRTitle: { fontSize: 20, fontWeight: '700' },
    scanQRSubtitle: { fontSize: 14, marginTop: 4 },
    sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
    quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
    quickCard: { width: '47%', padding: 16, borderRadius: 16, alignItems: 'center' },
    quickIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    quickLabel: { fontSize: 14, fontWeight: '500', textAlign: 'center' },
});
