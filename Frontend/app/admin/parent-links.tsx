import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useAdminParentLinks, useAdminUnlinkParent } from '@/lib/hooks';
import { useTheme } from '@/lib/theme-context';
import { ParentStudentLink } from '@/lib/services';

export default function AdminParentLinks() {
    const { colors, isDark } = useTheme();
    const { data, isLoading, refetch, isRefetching } = useAdminParentLinks();
    const unlinkMutation = useAdminUnlinkParent();

    React.useEffect(() => {
        if (unlinkMutation.isSuccess) {
            Alert.alert('✅ Success', 'Link has been removed');
        }
    }, [unlinkMutation.isSuccess]);

    React.useEffect(() => {
        if (unlinkMutation.isError) {
            Alert.alert('Error', (unlinkMutation.error as any)?.message || 'Failed to remove link');
        }
    }, [unlinkMutation.isError]);

    const handleUnlink = (link: ParentStudentLink) => {
        Alert.alert(
            'Remove Link',
            `Are you sure you want to unlink ${link.parent.name} from ${link.student.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Remove', style: 'destructive', onPress: () => unlinkMutation.mutate(link._id) },
            ]
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

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
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={['#7c3aed']} tintColor={colors.primary} />}>
                <View style={[styles.statsCard, { backgroundColor: isDark ? '#3b0764' : '#f3e8ff' }]}>
                    <View style={styles.statItem}>
                        <Ionicons name="git-network" size={24} color={isDark ? '#d8b4fe' : '#7c3aed'} />
                        <Text style={[styles.statNumber, { color: isDark ? '#d8b4fe' : '#7c3aed' }]}>{links.length}</Text>
                        <Text style={[styles.statLabel, { color: isDark ? '#d8b4fe' : '#7c3aed' }]}>Active Links</Text>
                    </View>
                </View>
                {links.length > 0 ? (
                    links.map((link: ParentStudentLink) => (
                        <View key={link._id} style={[styles.linkCard, { backgroundColor: colors.card }]}>
                            <View style={styles.personSection}>
                                <View style={[styles.personAvatar, { backgroundColor: isDark ? '#451a03' : '#fef3c7' }]}>
                                    <Ionicons name="people" size={20} color={isDark ? '#fcd34d' : '#b45309'} />
                                </View>
                                <View style={styles.personInfo}>
                                    <Text style={[styles.personRole, { color: colors.textTertiary }]}>PARENT</Text>
                                    <Text style={[styles.personName, { color: colors.text }]}>{link.parent.name}</Text>
                                    <Text style={[styles.personDetails, { color: colors.textSecondary }]}>{link.parent.email}</Text>
                                </View>
                            </View>
                            <View style={styles.connectionLine}>
                                <View style={[styles.line, { backgroundColor: colors.cardBorder }]} />
                                <View style={[styles.relationBadge, { backgroundColor: isDark ? '#3b0764' : '#f3e8ff' }]}>
                                    <Text style={[styles.relationText, { color: isDark ? '#d8b4fe' : '#7c3aed' }]}>{link.relationship}</Text>
                                </View>
                                <View style={[styles.line, { backgroundColor: colors.cardBorder }]} />
                            </View>
                            <View style={styles.personSection}>
                                <View style={[styles.personAvatar, { backgroundColor: isDark ? '#172554' : '#eff6ff' }]}>
                                    <Ionicons name="school" size={20} color={isDark ? '#93c5fd' : '#1d4ed8'} />
                                </View>
                                <View style={styles.personInfo}>
                                    <Text style={[styles.personRole, { color: colors.textTertiary }]}>STUDENT</Text>
                                    <Text style={[styles.personName, { color: colors.text }]}>{link.student.name}</Text>
                                    <Text style={[styles.personDetails, { color: colors.textSecondary }]}>{link.student.rollNo} • Room {link.student.room}</Text>
                                </View>
                            </View>
                            <View style={[styles.cardFooter, { borderTopColor: colors.cardBorder }]}>
                                <View style={styles.linkedInfo}>
                                    <Ionicons name="time-outline" size={14} color={colors.textTertiary} />
                                    <Text style={[styles.linkedText, { color: colors.textTertiary }]}>Linked on {formatDate(link.createdAt)} by {link.linkedBy?.name || 'System'}</Text>
                                </View>
                                <Pressable style={[styles.unlinkBtn, { backgroundColor: isDark ? '#450a0a' : '#fef2f2' }]} onPress={() => handleUnlink(link)} disabled={unlinkMutation.isPending}>
                                    <Ionicons name="unlink" size={16} color={isDark ? '#fca5a5' : '#dc2626'} />
                                    <Text style={[styles.unlinkBtnText, { color: isDark ? '#fca5a5' : '#dc2626' }]}>Remove</Text>
                                </Pressable>
                            </View>
                        </View>
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
    linkCard: { borderRadius: 20, padding: 20, marginBottom: 16 },
    personSection: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    personAvatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
    personInfo: { flex: 1 },
    personRole: { fontSize: 10, fontWeight: '600', letterSpacing: 1 },
    personName: { fontSize: 16, fontWeight: '600', marginTop: 2 },
    personDetails: { fontSize: 13, marginTop: 2 },
    connectionLine: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingLeft: 24 },
    line: { flex: 1, height: 2 },
    relationBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginHorizontal: 8 },
    relationText: { fontSize: 12, fontWeight: '600' },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTopWidth: 1 },
    linkedInfo: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
    linkedText: { fontSize: 11 },
    unlinkBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    unlinkBtnText: { fontSize: 12, fontWeight: '500' },
    emptyState: { alignItems: 'center', paddingVertical: 60 },
    emptyIcon: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
    emptyTitle: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
    emptyText: { fontSize: 14, textAlign: 'center', paddingHorizontal: 32, marginBottom: 24 },
    emptyBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#7c3aed', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, gap: 8 },
    emptyBtnText: { fontSize: 15, fontWeight: '600', color: 'white' },
});
