import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useParentChildren } from '@/lib/hooks';
import { useTheme } from '@/lib/contexts/theme';
import { ParentChildCard } from '@/components/parent';

export default function ParentChildren() {
    const { colors, isDark } = useTheme();
    const {
        data: children,
        isLoading,
        isError,
        error,
        refetch,
        isRefetching,
    } = useParentChildren();

    // Loading state - first load
    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <PageHeader title="My Children" showBack />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading children...</Text>
                </View>
                <BottomNav />
            </View>
        );
    }

    // Error state
    if (isError) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <PageHeader title="My Children" showBack />
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={64} color="#dc2626" />
                    <Text style={[styles.errorTitle, { color: '#dc2626' }]}>Failed to load</Text>
                    <Text style={[styles.errorText, { color: colors.textSecondary }]}>{(error as any)?.message || 'Something went wrong'}</Text>
                    <Pressable style={[styles.retryBtn, { backgroundColor: colors.primary }]} onPress={() => refetch()}>
                        <Text style={styles.retryBtnText}>Try Again</Text>
                    </Pressable>
                </View>
                <BottomNav />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="My Children" showBack />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[colors.primary]} tintColor={colors.primary} />
                }
            >
                {children && children.length > 0 ? (
                    children.map((child) => (
                        <ParentChildCard key={child._id} child={child} />
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <View style={[styles.emptyIcon, { backgroundColor: isDark ? '#451a03' : '#fef3c7' }]}>
                            <Ionicons name="people-outline" size={64} color={colors.primary} />
                        </View>
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>No Children Linked</Text>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                            Contact the hostel admin to link your child's account to yours
                        </Text>
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
    loadingText: { marginTop: 12, fontSize: 14 },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 100 },
    emptyState: { alignItems: 'center', paddingVertical: 60 },
    emptyIcon: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    emptyTitle: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
    emptyText: { fontSize: 14, textAlign: 'center', paddingHorizontal: 32 },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
    errorTitle: { fontSize: 20, fontWeight: '700', marginTop: 16 },
    errorText: { fontSize: 14, textAlign: 'center', marginTop: 8 },
    retryBtn: { marginTop: 20, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
    retryBtnText: { fontSize: 15, fontWeight: '600', color: 'white' },
});
