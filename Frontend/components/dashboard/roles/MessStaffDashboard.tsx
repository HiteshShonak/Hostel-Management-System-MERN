import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/lib/contexts/theme';
import { RecentNotices } from '@/components/dashboard/recent-notices';

// Mess staff dashboard component
export function MessStaffDashboard() {
    const { colors, isDark } = useTheme();
    return (
        <View style={styles.staffContent}>
            {/* Quick Actions */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
            <View style={styles.quickGrid}>
                <Pressable style={[styles.quickCard, { backgroundColor: colors.card }]} onPress={() => router.push('/mess/mess-menu')}>
                    <View style={[styles.quickIcon, { backgroundColor: isDark ? '#052e16' : '#f0fdf4' }]}>
                        <Ionicons name="restaurant" size={24} color="#16a34a" />
                    </View>
                    <Text style={[styles.quickLabel, { color: colors.text }]}>Edit Menu</Text>
                </Pressable>
                <Pressable style={[styles.quickCard, { backgroundColor: colors.card }]} onPress={() => router.push('/shared/food-ratings')}>
                    <View style={[styles.quickIcon, { backgroundColor: isDark ? '#451a03' : '#fef3c7' }]}>
                        <Ionicons name="star" size={24} color="#d97706" />
                    </View>
                    <Text style={[styles.quickLabel, { color: colors.text }]}>View Ratings</Text>
                </Pressable>
            </View>

            <RecentNotices />
        </View>
    );
}

const styles = StyleSheet.create({
    staffContent: { padding: 16 },
    sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
    quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
    quickCard: { width: '47%', padding: 16, borderRadius: 16, alignItems: 'center' },
    quickIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    quickLabel: { fontSize: 14, fontWeight: '500', textAlign: 'center' },
});
