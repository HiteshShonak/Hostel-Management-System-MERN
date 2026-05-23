import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator, Animated, Vibration, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useEmergencyContacts, useSOS, useActiveAlerts, useAcknowledgeAlert, useResolveAlert } from '@/lib/hooks';
import { useTheme } from '@/lib/contexts/theme';
import { useAuth } from '@/lib/contexts/auth';
import { Emergency } from '@/lib/types';

const HOLD_DURATION = 3000;

// ─────────────────────────────────────────────
// Warden / Admin view — alert management
// ─────────────────────────────────────────────
function AlertManagementView() {
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

    const typeColor = (type: string) => {
        switch (type) {
            case 'Medical': return { bg: isDark ? '#3f1118' : '#fef2f2', text: isDark ? '#fb7185' : '#dc2626', icon: 'medkit' as const };
            case 'Fire': return { bg: isDark ? '#451a03' : '#fef3c7', text: isDark ? '#fbbf24' : '#d97706', icon: 'flame' as const };
            case 'Ragging': return { bg: isDark ? '#2e1065' : '#ede9fe', text: isDark ? '#a78bfa' : '#7c3aed', icon: 'shield' as const };
            default: return { bg: isDark ? '#1c1917' : '#f5f5f4', text: isDark ? '#a3a3a3' : '#737373', icon: 'warning' as const };
        }
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
                    {alerts.map((alert) => {
                        const alertUser = typeof alert.user === 'object' && alert.user ? alert.user : null;
                        const acknowledgedBy = typeof alert.acknowledgedBy === 'object' && alert.acknowledgedBy ? alert.acknowledgedBy : null;
                        const style = typeColor(alert.type);
                        const timeAgo = getTimeAgo(alert.createdAt);

                        return (
                            <View key={alert._id} style={[styles.alertCard, { backgroundColor: colors.card }]}>
                                {/* Type badge + time */}
                                <View style={styles.alertCardHeader}>
                                    <View style={[styles.typeBadge, { backgroundColor: style.bg }]}>
                                        <Ionicons name={style.icon} size={14} color={style.text} />
                                        <Text style={[styles.typeBadgeText, { color: style.text }]}>{alert.type}</Text>
                                    </View>
                                    <Text style={[styles.alertTime, { color: colors.textSecondary }]}>{timeAgo}</Text>
                                </View>

                                {/* Student info */}
                                <View style={styles.alertStudentRow}>
                                    <View style={[styles.avatarCircle, { backgroundColor: style.bg }]}>
                                        <Ionicons name="person" size={20} color={style.text} />
                                    </View>
                                    <View style={{ flex: 1, marginLeft: 10 }}>
                                        <Text style={[styles.studentName, { color: colors.text }]}>
                                            {alertUser?.name || 'Unknown Student'}
                                        </Text>
                                        <Text style={[styles.studentDetails, { color: colors.textSecondary }]}>
                                            Room {alertUser?.room || 'N/A'}  ·  {alertUser?.rollNo || 'N/A'}
                                        </Text>
                                        {alertUser?.phone ? (
                                            <Pressable onPress={() => Linking.openURL(`tel:${alertUser.phone}`)}>
                                                <Text style={[styles.studentPhone, { color: isDark ? '#60a5fa' : '#2563eb' }]}>
                                                    {alertUser.phone}
                                                </Text>
                                            </Pressable>
                                        ) : null}
                                    </View>
                                </View>

                                {/* Message */}
                                {alert.message ? (
                                    <View style={[styles.messageBox, { backgroundColor: isDark ? '#1c1917' : '#f5f5f4' }]}>
                                        <Text style={[styles.messageText, { color: colors.textSecondary }]}>"{alert.message}"</Text>
                                    </View>
                                ) : null}

                                {/* Location */}
                                {alert.location ? (
                                    <View style={styles.locationRow}>
                                        <Ionicons name="location" size={14} color={colors.textSecondary} />
                                        <Text style={[styles.locationText, { color: colors.textSecondary }]}>{alert.location}</Text>
                                    </View>
                                ) : null}

                                {/* Status row */}
                                <View style={styles.statusRow}>
                                    <View style={[styles.statusBadge, {
                                        backgroundColor: alert.status === 'active'
                                            ? (isDark ? '#450a0a' : '#fef2f2')
                                            : (isDark ? '#052e16' : '#f0fdf4')
                                    }]}>
                                        <View style={[styles.statusDot, {
                                            backgroundColor: alert.status === 'active' ? '#dc2626' : '#16a34a'
                                        }]} />
                                        <Text style={[styles.statusText, {
                                            color: alert.status === 'active'
                                                ? (isDark ? '#fca5a5' : '#dc2626')
                                                : (isDark ? '#86efac' : '#16a34a')
                                        }]}>
                                            {alert.status === 'active' ? 'Active' : 'Acknowledged'}
                                        </Text>
                                    </View>
                                    {acknowledgedBy && (
                                        <Text style={[styles.acknowledgedByText, { color: colors.textSecondary }]}>
                                            by {acknowledgedBy.name}
                                        </Text>
                                    )}
                                </View>

                                {/* Action buttons */}
                                <View style={styles.actionRow}>
                                    {alert.status === 'active' && (
                                        <Pressable
                                            style={[styles.actionBtn, styles.acknowledgeBtn, { opacity: acknowledgeMutation.isPending ? 0.6 : 1 }]}
                                            onPress={() => confirmAcknowledge(alert)}
                                            disabled={acknowledgeMutation.isPending || resolveMutation.isPending}
                                        >
                                            <Ionicons name="eye" size={16} color="#1d4ed8" />
                                            <Text style={styles.acknowledgeBtnText}>Acknowledge</Text>
                                        </Pressable>
                                    )}
                                    <Pressable
                                        style={[styles.actionBtn, styles.resolveBtn, { opacity: resolveMutation.isPending ? 0.6 : 1 }]}
                                        onPress={() => confirmResolve(alert)}
                                        disabled={resolveMutation.isPending || acknowledgeMutation.isPending}
                                    >
                                        <Ionicons name="checkmark-circle" size={16} color="white" />
                                        <Text style={styles.resolveBtnText}>Resolve</Text>
                                    </Pressable>
                                </View>
                            </View>
                        );
                    })}
                </View>
            )}
        </View>
    );
}

// Helper to get relative time
function getTimeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

// ─────────────────────────────────────────────
// Student view — SOS button + contacts
// ─────────────────────────────────────────────
function StudentSOSView() {
    const { colors, isDark } = useTheme();
    const { data: contacts, isLoading: loadingContacts } = useEmergencyContacts();
    const sosMutation = useSOS();

    const [isHolding, setIsHolding] = useState(false);
    const [quickHoldType, setQuickHoldType] = useState<string | null>(null);
    const holdTimer = useRef<NodeJS.Timeout | null>(null);
    const progressAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const quickProgressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        return () => {
            if (holdTimer.current) clearTimeout(holdTimer.current);
        };
    }, []);

    const dialPhone = (phone: string) => Linking.openURL(`tel:${phone}`);

    const startHold = () => {
        setIsHolding(true);
        Vibration.vibrate(50);
        Animated.timing(progressAnim, { toValue: 1, duration: HOLD_DURATION, useNativeDriver: false }).start();
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, { toValue: 1.1, duration: 300, useNativeDriver: true }),
                Animated.timing(scaleAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
            ])
        ).start();
        holdTimer.current = setTimeout(() => triggerSOS(), HOLD_DURATION);
    };

    const cancelHold = () => {
        setIsHolding(false);
        if (holdTimer.current) clearTimeout(holdTimer.current);
        progressAnim.setValue(0);
        scaleAnim.setValue(1);
        scaleAnim.stopAnimation();
    };

    const startQuickHold = (type: string, message: string) => {
        setQuickHoldType(type);
        Vibration.vibrate(50);
        Animated.timing(quickProgressAnim, { toValue: 1, duration: HOLD_DURATION, useNativeDriver: false }).start();
        holdTimer.current = setTimeout(() => triggerQuickSOS(type, message), HOLD_DURATION);
    };

    const cancelQuickHold = () => {
        setQuickHoldType(null);
        if (holdTimer.current) clearTimeout(holdTimer.current);
        quickProgressAnim.setValue(0);
    };

    const triggerQuickSOS = (type: string, message: string) => {
        Vibration.vibrate([0, 100, 50, 100, 50, 100]);
        setQuickHoldType(null);
        quickProgressAnim.setValue(0);
        sosMutation.mutate(
            { type: type as 'Medical' | 'Fire' | 'Ragging' | 'Other', message },
            {
                onSuccess: () => {
                    Alert.alert('Alert Sent!', `${type} emergency alert has been sent. Help is on the way.`, [{ text: 'OK' }]);
                },
                onError: () => {
                    Alert.alert('Alert Failed', 'Could not send alert. Please try calling emergency contacts directly.', [{ text: 'OK' }]);
                },
            }
        );
    };

    const triggerSOS = () => {
        Vibration.vibrate([0, 100, 50, 100, 50, 100]);
        setIsHolding(false);
        progressAnim.setValue(0);
        scaleAnim.setValue(1);
        sosMutation.mutate(
            { type: 'Other', message: 'Emergency SOS Alert!' },
            {
                onSuccess: () => {
                    Alert.alert('SOS Sent!', 'Help is on the way. The warden and security have been alerted.', [{ text: 'OK' }]);
                },
                onError: () => {
                    Alert.alert('SOS Failed', 'Could not send SOS. Please call emergency contacts directly.', [{ text: 'OK' }]);
                },
            }
        );
    };

    const progressWidth = progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
    const quickProgressWidth = quickProgressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

    return (
        <View style={styles.content}>
            {/* SOS Button */}
            <View style={styles.sosSection}>
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <Pressable
                        style={styles.sosButton}
                        onPressIn={startHold}
                        onPressOut={cancelHold}
                        disabled={sosMutation.isPending}
                    >
                        <View style={[styles.sosInner, sosMutation.isPending && styles.sosInnerLoading]}>
                            {sosMutation.isPending ? (
                                <ActivityIndicator size="large" color="white" />
                            ) : (
                                <>
                                    <Ionicons name="warning" size={48} color="white" />
                                    <Text style={styles.sosText}>SOS</Text>
                                </>
                            )}
                            {isHolding && (
                                <Animated.View style={[styles.progressOverlay, { width: progressWidth }]} />
                            )}
                        </View>
                    </Pressable>
                </Animated.View>
                <Text style={[styles.sosHelp, { color: '#dc2626' }]}>
                    {isHolding ? '🔴 Keep holding to send SOS...' : 'Hold for 3 seconds to send emergency alert'}
                </Text>
                <Text style={[styles.sosSubtext, { color: colors.textSecondary }]}>
                    This will alert wardens and security immediately
                </Text>
            </View>

            {/* Quick buttons */}
            <View style={styles.quickButtons}>
                {[
                    { type: 'Medical', msg: 'Medical Emergency!', bg: isDark ? '#3f1118' : '#fef2f2', color: isDark ? '#fb7185' : '#dc2626', icon: 'medkit', pbg: isDark ? 'rgba(251,113,133,0.3)' : 'rgba(220,38,38,0.2)' },
                    { type: 'Fire', msg: 'Fire Emergency!', bg: isDark ? '#451a03' : '#fef3c7', color: isDark ? '#fbbf24' : '#d97706', icon: 'flame', pbg: isDark ? 'rgba(251,191,36,0.3)' : 'rgba(217,119,6,0.2)' },
                    { type: 'Ragging', msg: 'Ragging Incident!', bg: isDark ? '#2e1065' : '#ede9fe', color: isDark ? '#a78bfa' : '#7c3aed', icon: 'shield', pbg: isDark ? 'rgba(167,139,250,0.3)' : 'rgba(124,58,237,0.2)' },
                ].map(({ type, msg, bg, color, icon, pbg }) => (
                    <Pressable
                        key={type}
                        style={[styles.quickBtn, { backgroundColor: bg, overflow: 'hidden' }]}
                        onPressIn={() => startQuickHold(type, msg)}
                        onPressOut={cancelQuickHold}
                        disabled={sosMutation.isPending}
                    >
                        {quickHoldType === type && (
                            <Animated.View style={[styles.quickProgress, { width: quickProgressWidth, backgroundColor: pbg }]} />
                        )}
                        <Ionicons name={icon as any} size={28} color={color} />
                        <Text style={[styles.quickBtnText, { color }]}>{type}</Text>
                    </Pressable>
                ))}
            </View>

            {/* Emergency Contacts */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Emergency Contacts</Text>
            <View style={styles.contactsList}>
                {loadingContacts && <ActivityIndicator color={colors.primary} />}
                {contacts && contacts.length > 0 ? (
                    contacts.map((contact, index) => (
                        <Pressable key={index} style={[styles.contactCard, {
                            backgroundColor: isDark ? '#3f1118' : '#fef2f2',
                            borderColor: isDark ? '#5c2228' : '#fee2e2',
                        }]}>
                            <View style={[styles.contactIcon, { backgroundColor: isDark ? 'rgba(251,113,133,0.15)' : 'white' }]}>
                                <Ionicons
                                    name={contact.type === 'medical' ? 'medkit' : contact.type === 'police' ? 'shield' : contact.type === 'security' ? 'lock-closed' : contact.type === 'warden' ? 'person' : 'call'}
                                    size={24}
                                    color={isDark ? '#fb7185' : '#dc2626'}
                                />
                            </View>
                            <View style={styles.contactInfo}>
                                <Text style={[styles.contactRole, { color: isDark ? '#fca5a5' : '#0a0a0a' }]}>{contact.name}</Text>
                                <Text style={[styles.contactPhone, { color: isDark ? '#fb7185' : '#dc2626' }]}>{contact.phone}</Text>
                            </View>
                            <Pressable
                                style={[styles.callBtn, { backgroundColor: isDark ? '#be123c' : '#dc2626' }]}
                                onPress={() => dialPhone(contact.phone)}
                            >
                                <Ionicons name="call" size={20} color="white" />
                            </Pressable>
                        </Pressable>
                    ))
                ) : !loadingContacts ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="call-outline" size={48} color={colors.textTertiary} />
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No contacts available</Text>
                    </View>
                ) : null}
            </View>
        </View>
    );
}

// ─────────────────────────────────────────────
// Root page — picks the right view by role
// ─────────────────────────────────────────────
export default function EmergencyPage() {
    const { colors } = useTheme();
    const { user } = useAuth();

    const isManagementRole = user?.role === 'warden' || user?.role === 'admin';

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title={isManagementRole ? 'SOS Alerts' : 'Emergency'} />
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {isManagementRole ? <AlertManagementView /> : <StudentSOSView />}
            </ScrollView>
            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 100 },
    content: { padding: 16 },
    centeredLoader: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
    loadingText: { marginTop: 12, fontSize: 14 },

    // Alert management styles
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
    alertCard: {
        borderRadius: 18,
        padding: 16,
        gap: 10,
    },
    alertCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    typeBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    typeBadgeText: { fontSize: 13, fontWeight: '600' },
    alertTime: { fontSize: 13 },
    alertStudentRow: { flexDirection: 'row', alignItems: 'center' },
    avatarCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    studentName: { fontSize: 15, fontWeight: '700' },
    studentDetails: { fontSize: 13, marginTop: 2 },
    studentPhone: { fontSize: 13, marginTop: 4, fontWeight: '500' },
    messageBox: { padding: 10, borderRadius: 10 },
    messageText: { fontSize: 14, fontStyle: 'italic' },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    locationText: { fontSize: 13 },
    statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    statusDot: { width: 7, height: 7, borderRadius: 4 },
    statusText: { fontSize: 13, fontWeight: '600' },
    acknowledgedByText: { fontSize: 13 },
    actionRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        gap: 6,
    },
    acknowledgeBtn: { backgroundColor: '#eff6ff', borderWidth: 1, borderColor: '#bfdbfe' },
    acknowledgeBtnText: { color: '#1d4ed8', fontSize: 14, fontWeight: '600' },
    resolveBtn: { backgroundColor: '#16a34a' },
    resolveBtnText: { color: 'white', fontSize: 14, fontWeight: '600' },
    emptyState: { alignItems: 'center', paddingVertical: 60 },
    emptyTitle: { fontSize: 20, fontWeight: '700', marginTop: 16 },
    emptyText: { fontSize: 15, marginTop: 8 },

    // Student SOS styles
    sosSection: { alignItems: 'center', marginBottom: 32 },
    sosButton: {
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: '#fecaca',
        padding: 14,
        shadowColor: '#dc2626',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 15,
    },
    sosInner: {
        flex: 1,
        borderRadius: 80,
        backgroundColor: '#dc2626',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 5,
        borderColor: 'white',
        overflow: 'hidden',
    },
    sosInnerLoading: { backgroundColor: '#ef4444' },
    sosText: { color: 'white', fontSize: 28, fontWeight: '800', marginTop: 4 },
    progressOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    sosHelp: { textAlign: 'center', marginTop: 24, fontSize: 16, fontWeight: '600' },
    sosSubtext: { textAlign: 'center', marginTop: 8, fontSize: 14 },
    quickButtons: { flexDirection: 'row', gap: 12, marginBottom: 32 },
    quickBtn: { flex: 1, alignItems: 'center', paddingVertical: 20, borderRadius: 16 },
    quickProgress: { position: 'absolute', top: 0, left: 0, bottom: 0 },
    quickBtnText: { fontSize: 13, fontWeight: '600', marginTop: 8 },
    sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
    contactsList: { gap: 12 },
    contactCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, borderWidth: 1 },
    contactIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
    contactInfo: { flex: 1, marginLeft: 16 },
    contactRole: { fontSize: 14, fontWeight: '600' },
    contactPhone: { fontSize: 14, marginTop: 2 },
    callBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});
