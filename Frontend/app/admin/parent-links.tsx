import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useTheme } from '@/lib/contexts/theme';
import {
    useParentLinksController,
    ParentLinkCard,
} from '@/components/admin';

export default function AdminParentLinks() {
    const { colors, isDark } = useTheme();
    const {
        data,
        isLoading,
        refetch,
        isRefetching,
        unlinkMutation,
        handleUnlink,
    } = useParentLinksController();

    const links = data?.links || [];

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <PageHeader title="Parent-Student Links" showBack />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading links...</Text>
                </View>
                <BottomNav />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="🔗 Parent-Student Links" showBack />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={['#7c3aed']} tintColor={colors.primary} />}
            >
                <View style={[styles.statsCard, { backgroundColor: isDark ? '#3b0764' : '#f3e8ff' }]}>
                    <View style={styles.statItem}>
                        <Ionicons name="git-network" size={24} color={isDark ? '#d8b4fe' : '#7c3aed'} />
                        <Text style={[styles.statNumber, { color: isDark ? '#d8b4fe' : '#7c3aed' }]}>{links.length}</Text>
                        <Text style={[styles.statLabel, { color: isDark ? '#d8b4fe' : '#7c3aed' }]}>Active Links</Text>
                    </View>
                </View>

                {links.length > 0 ? (
                    links.map((link) => (
                        <ParentLinkCard
                            key={link._id}
                            link={link}
                            onUnlink={handleUnlink}
                            isPending={unlinkMutation.isPending}
                        />
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <View style={[styles.emptyIcon, { backgroundColor: isDark ? '#3b0764' : '#f3e8ff' }]}>
                            <Ionicons name="git-network-outline" size={64} color={isDark ? '#d8b4fe' : '#7c3aed'} />
                        </View>
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>No Links Yet</Text>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Use "Link Parents" to connect parents with their children</Text>
                        <Pressable style={styles.emptyBtn} onPress={() => router.push('/admin/link-parent')}>
                            <Ionicons name="add" size={20} color="white" />
                            <Text style={styles.emptyBtnText}>Create First Link</Text>
                        </Pressable>
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
    loadingText: { marginTop: 12 },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 100 },
    statsCard: { borderRadius: 16, padding: 20, marginBottom: 20 },
    statItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    statNumber: { fontSize: 28, fontWeight: '700' },
    statLabel: { fontSize: 14 },
    emptyState: { alignItems: 'center', paddingVertical: 60 },
    emptyIcon: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
    emptyTitle: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
    emptyText: { fontSize: 14, textAlign: 'center', paddingHorizontal: 32, marginBottom: 24 },
    emptyBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#7c3aed', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, gap: 8 },
    emptyBtnText: { fontSize: 15, fontWeight: '600', color: 'white' },
});
