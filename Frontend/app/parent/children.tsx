import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useParentChildren } from '@/lib/hooks';
import { useTheme } from '@/lib/theme-context';
import { ParentChild } from '@/lib/services';

export default function ParentChildren() {
    const { colors, isDark } = useTheme();
    const {
        data: children,
        isLoading,
        isError,
        error,
        refetch,
        isRefetching,
        isFetching,
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
                refreshControl={
                    <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[colors.primary]} tintColor={colors.primary} />
                }
            >
                {children && children.length > 0 ? (
                    children.map((child) => (
                        <View key={child._id} style={[styles.childCard, { backgroundColor: colors.card }]}>
                            <View style={styles.cardHeader}>
                                <View style={styles.avatarContainer}>
                                    <View style={[styles.avatar, { backgroundColor: isDark ? '#451a03' : '#fef3c7', borderColor: isDark ? '#b45309' : '#fcd34d' }]}>
                                        <Text style={styles.avatarText}>
                                            {child.name.charAt(0).toUpperCase()}
                                        </Text>
                                    </View>

                                </View>
                                <View style={styles.nameContainer}>
                                    <Text style={[styles.childName, { color: colors.text }]}>{child.name}</Text>
                                    <Text style={[styles.rollNo, { color: colors.textSecondary }]}>{child.rollNo}</Text>
                                </View>
                            </View>

                            <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />

                            <View style={styles.detailsGrid}>
                                <View style={styles.detailItem}>
                                    <View style={[styles.detailIcon, { backgroundColor: isDark ? '#1e3a5f' : '#eff6ff' }]}>
                                        <Ionicons name="home" size={18} color="#1d4ed8" />
                                    </View>
                                    <View>
                                        <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>Room</Text>
                                        <Text style={[styles.detailValue, { color: colors.text }]}>{child.room}</Text>
                                    </View>
                                </View>

                                <View style={styles.detailItem}>
                                    <View style={[styles.detailIcon, { backgroundColor: isDark ? '#451a03' : '#fef3c7' }]}>
                                        <Ionicons name="business" size={18} color="#b45309" />
                                    </View>
                                    <View>
                                        <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>Hostel</Text>
                                        <Text style={[styles.detailValue, { color: colors.text }]}>{child.hostel}</Text>
                                    </View>
                                </View>

                                <View style={styles.detailItem}>
                                    <View style={[styles.detailIcon, { backgroundColor: isDark ? '#14532d' : '#dcfce7' }]}>
                                        <Ionicons name="call" size={18} color="#16a34a" />
                                    </View>
                                    <View>
                                        <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>Phone</Text>
                                        <Text style={[styles.detailValue, { color: colors.text }]}>{child.phone}</Text>
                                    </View>
                                </View>

                                <View style={styles.detailItem}>
                                    <View style={[styles.detailIcon, { backgroundColor: isDark ? '#3b0764' : '#fae8ff' }]}>
                                        <Ionicons name="mail" size={18} color="#a855f7" />
                                    </View>
                                    <View>
                                        <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>Email</Text>
                                        <Text style={[styles.detailValue, { color: colors.text }]} numberOfLines={1}>{child.email}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={[styles.linkedInfo, { borderTopColor: colors.cardBorder }]}>
                                <Ionicons name="link" size={14} color={colors.textTertiary} />
                                <Text style={[styles.linkedText, { color: colors.textTertiary }]}>
                                    Linked on {new Date(child.linkedAt).toLocaleDateString('en-IN')}
                                </Text>
                            </View>
                        </View>
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
    childCard: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    avatarContainer: { position: 'relative' },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
    },
    avatarText: { fontSize: 28, fontWeight: '700', color: '#b45309' },

    nameContainer: { flex: 1 },
    childName: { fontSize: 20, fontWeight: '700' },
    rollNo: { fontSize: 14, marginTop: 2 },
    divider: {
        height: 1,
        marginVertical: 16,
    },
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    detailItem: {
        width: '45%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    detailIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    detailLabel: { fontSize: 13, textTransform: 'uppercase' },
    detailValue: { fontSize: 14, fontWeight: '500', marginTop: 1 },
    linkedInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 16,
        paddingTop: 12,
        borderTopWidth: 1,
    },
    linkedText: { fontSize: 12 },
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
