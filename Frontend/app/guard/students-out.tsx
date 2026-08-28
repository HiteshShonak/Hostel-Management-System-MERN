import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useTheme } from '@/lib/contexts/theme';
import {
    useStudentsOutController,
    StudentOutCard,
} from '@/components/guard';

export default function StudentsOutScreen() {
    const { colors, isDark } = useTheme();
    const {
        studentsOut,
        isLoading,
        refreshing,
        onRefresh,
        formatTime,
        formatDate,
        softRed,
    } = useStudentsOutController();

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
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
                }
            >
                {studentsOut.length > 0 ? (
                    studentsOut.map((pass) => (
                        <StudentOutCard
                            key={pass._id}
                            pass={pass}
                            softRed={softRed}
                            formatTime={formatTime}
                            formatDate={formatDate}
                        />
                    ))
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
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    summaryText: { fontSize: 14, fontWeight: '600' },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 100 },
    emptyContainer: { alignItems: 'center', paddingVertical: 60 },
    emptyTitle: { fontSize: 18, fontWeight: '600', marginTop: 12 },
    emptyText: { fontSize: 14, marginTop: 4 },
});
