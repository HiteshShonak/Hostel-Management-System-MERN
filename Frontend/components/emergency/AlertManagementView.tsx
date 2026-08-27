import React from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useActiveAlerts, useAcknowledgeAlert, useResolveAlert } from '@/lib/hooks';
import { useTheme } from '@/lib/contexts/theme';
import { AlertCard } from './AlertCard';
import type { Emergency } from '@/lib/types';

export function AlertManagementView() {
    const { colors, isDark } = useTheme();
    const { data: alerts, isLoading, refetch, isRefetching } = useActiveAlerts();
    const acknowledgeMutation = useAcknowledgeAlert();
    const resolveMutation = useResolveAlert();

    const confirmResolve = (alert: Emergency) => {
        const alertUser = typeof alert.user === 'object' && alert.user ? alert.user : null;
        Alert.alert(
            'Resolve Alert',
            `Mark this ${alert.type} emergency from ${alertUser?.name || 'Unknown'} as resolved?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Resolve',
                    style: 'destructive',
                    onPress: () => resolveMutation.mutate(alert._id),
                },
            ]
        );
    };

    const confirmAcknowledge = (alert: Emergency) => {
        const alertUser = typeof alert.user === 'object' && alert.user ? alert.user : null;
        Alert.alert(
            'Acknowledge Alert',
            `Acknowledge this ${alert.type} emergency from ${alertUser?.name || 'Unknown'}? This signals you are responding.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Acknowledge',
                    onPress: () => acknowledgeMutation.mutate(alert._id),
                },
            ]
        );
    };

    if (isLoading) {
        return (
            <View style={styles.centeredLoader}>
                <ActivityIndicator size="large" color="#dc2626" />
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading alerts...</Text>
            </View>
        );
    }

    return (
        <View style={styles.content}>
            {/* Header banner */}
            <View style={[styles.alertBanner, { backgroundColor: isDark ? '#450a0a' : '#fef2f2', borderColor: isDark ? '#7f1d1d' : '#fecaca' }]}>
                <View style={styles.alertBannerLeft}>
                    <Ionicons name="warning" size={28} color="#dc2626" />
                    <View style={{ marginLeft: 12 }}>
                        <Text style={[styles.alertBannerTitle, { color: isDark ? '#fca5a5' : '#991b1b' }]}>Active SOS Alerts</Text>
                        <Text style={[styles.alertBannerSub, { color: isDark ? '#f87171' : '#dc2626' }]}>
                            {alerts?.length || 0} {alerts?.length === 1 ? 'alert requires' : 'alerts require'} attention
                        </Text>
                    </View>
                </View>
                <Pressable
                    style={[styles.refreshBtn, { backgroundColor: isDark ? '#7f1d1d' : '#fee2e2' }]}
                    onPress={() => refetch()}
                    disabled={isRefetching}
                >
                    <Ionicons name="refresh" size={18} color={isDark ? '#fca5a5' : '#dc2626'} />
                </Pressable>
            </View>

            {/* Alert list */}
            {!alerts || alerts.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="checkmark-circle" size={64} color="#16a34a" />
                    <Text style={[styles.emptyTitle, { color: colors.text }]}>All Clear!</Text>
                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No active SOS alerts right now.</Text>
                </View>
            ) : (
                <View style={styles.alertsList}>
                    {alerts.map((alert) => (
                        <AlertCard
                            key={alert._id}
                            alert={alert}
                            isAcknowledgePending={acknowledgeMutation.isPending}
                            isResolvePending={resolveMutation.isPending}
                            onAcknowledge={confirmAcknowledge}
                            onResolve={confirmResolve}
                        />
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    content: { padding: 16 },
    centeredLoader: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
    loadingText: { marginTop: 12, fontSize: 14 },
    alertBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 20,
    },
    alertBannerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    alertBannerTitle: { fontSize: 17, fontWeight: '700' },
    alertBannerSub: { fontSize: 14, marginTop: 2 },
    refreshBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    alertsList: { gap: 12 },
    emptyState: { alignItems: 'center', paddingVertical: 60 },
    emptyTitle: { fontSize: 20, fontWeight: '700', marginTop: 16 },
    emptyText: { fontSize: 15, marginTop: 8 },
});
