import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useParentChildren } from '@/lib/hooks';
import { ParentChild } from '@/lib/services';

export default function ParentChildren() {
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
            <View style={styles.container}>
                <PageHeader title="My Children" showBack />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#b45309" />
                    <Text style={styles.loadingText}>Loading children...</Text>
                </View>
                <BottomNav />
            </View>
        );
    }

    // Error state
    if (isError) {
        return (
            <View style={styles.container}>
                <PageHeader title="My Children" showBack />
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={64} color="#dc2626" />
                    <Text style={styles.errorTitle}>Failed to load</Text>
                    <Text style={styles.errorText}>{(error as any)?.message || 'Something went wrong'}</Text>
                    <Pressable style={styles.retryBtn} onPress={() => refetch()}>
                        <Text style={styles.retryBtnText}>Try Again</Text>
                    </Pressable>
                </View>
                <BottomNav />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <PageHeader title="👨‍👩‍👧 My Children" showBack />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={['#b45309']} tintColor="#b45309" />
                }
            >
                {children && children.length > 0 ? (
                    children.map((child) => (
                        <View key={child._id} style={styles.childCard}>
                            <View style={styles.cardHeader}>
                                <View style={styles.avatarContainer}>
                                    <View style={styles.avatar}>
                                        <Text style={styles.avatarText}>
                                            {child.name.charAt(0).toUpperCase()}
                                        </Text>
                                    </View>
                                    <View style={styles.relationBadge}>
                                        <Text style={styles.relationText}>{child.relationship}</Text>
                                    </View>
                                </View>
                                <View style={styles.nameContainer}>
                                    <Text style={styles.childName}>{child.name}</Text>
                                    <Text style={styles.rollNo}>{child.rollNo}</Text>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.detailsGrid}>
                                <View style={styles.detailItem}>
                                    <View style={[styles.detailIcon, { backgroundColor: '#eff6ff' }]}>
                                        <Ionicons name="home" size={18} color="#1d4ed8" />
                                    </View>
                                    <View>
                                        <Text style={styles.detailLabel}>Room</Text>
                                        <Text style={styles.detailValue}>{child.room}</Text>
                                    </View>
                                </View>

                                <View style={styles.detailItem}>
                                    <View style={[styles.detailIcon, { backgroundColor: '#fef3c7' }]}>
                                        <Ionicons name="business" size={18} color="#b45309" />
                                    </View>
                                    <View>
                                        <Text style={styles.detailLabel}>Hostel</Text>
                                        <Text style={styles.detailValue}>{child.hostel}</Text>
                                    </View>
                                </View>

                                <View style={styles.detailItem}>
                                    <View style={[styles.detailIcon, { backgroundColor: '#dcfce7' }]}>
                                        <Ionicons name="call" size={18} color="#16a34a" />
                                    </View>
                                    <View>
                                        <Text style={styles.detailLabel}>Phone</Text>
                                        <Text style={styles.detailValue}>{child.phone}</Text>
                                    </View>
                                </View>

                                <View style={styles.detailItem}>
                                    <View style={[styles.detailIcon, { backgroundColor: '#fae8ff' }]}>
                                        <Ionicons name="mail" size={18} color="#a855f7" />
                                    </View>
                                    <View>
                                        <Text style={styles.detailLabel}>Email</Text>
                                        <Text style={styles.detailValue} numberOfLines={1}>{child.email}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.linkedInfo}>
                                <Ionicons name="link" size={14} color="#a3a3a3" />
                                <Text style={styles.linkedText}>
                                    Linked on {new Date(child.linkedAt).toLocaleDateString('en-IN')}
                                </Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIcon}>
                            <Ionicons name="people-outline" size={64} color="#b45309" />
                        </View>
                        <Text style={styles.emptyTitle}>No Children Linked</Text>
                        <Text style={styles.emptyText}>
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
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12, color: '#737373' },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 100 },
    childCard: {
        backgroundColor: 'white',
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
        backgroundColor: '#fef3c7',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#fcd34d',
    },
    avatarText: { fontSize: 28, fontWeight: '700', color: '#b45309' },
    relationBadge: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        backgroundColor: '#b45309',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    relationText: { fontSize: 10, fontWeight: '600', color: 'white' },
    nameContainer: { flex: 1 },
    childName: { fontSize: 20, fontWeight: '700', color: '#0a0a0a' },
    rollNo: { fontSize: 14, color: '#737373', marginTop: 2 },
    divider: {
        height: 1,
        backgroundColor: '#e5e5e5',
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
    detailLabel: { fontSize: 11, color: '#a3a3a3', textTransform: 'uppercase' },
    detailValue: { fontSize: 14, fontWeight: '500', color: '#0a0a0a', marginTop: 1 },
    linkedInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f5f5f5',
    },
    linkedText: { fontSize: 12, color: '#a3a3a3' },
    emptyState: { alignItems: 'center', paddingVertical: 60 },
    emptyIcon: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#fef3c7',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    emptyTitle: { fontSize: 22, fontWeight: '700', color: '#0a0a0a', marginBottom: 8 },
    emptyText: { fontSize: 14, color: '#737373', textAlign: 'center', paddingHorizontal: 32 },
    // Error state styles
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
    errorTitle: { fontSize: 20, fontWeight: '700', color: '#dc2626', marginTop: 16 },
    errorText: { fontSize: 14, color: '#737373', textAlign: 'center', marginTop: 8 },
    retryBtn: { marginTop: 20, backgroundColor: '#b45309', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
    retryBtnText: { fontSize: 15, fontWeight: '600', color: 'white' },
});
