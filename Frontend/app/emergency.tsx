import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator, Animated, Vibration, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useEmergencyContacts, useSOS } from '@/lib/hooks';
import { useTheme } from '@/lib/theme-context';

const HOLD_DURATION = 3000; // 3 seconds

export default function EmergencyPage() {
    const { colors, isDark } = useTheme();
    const { data: contacts, isLoading: loadingContacts } = useEmergencyContacts();
    const sosMutation = useSOS();

    const [isHolding, setIsHolding] = useState(false);
    const [holdProgress, setHoldProgress] = useState(0);
    const [quickHoldType, setQuickHoldType] = useState<string | null>(null);
    const holdTimer = useRef<NodeJS.Timeout | null>(null);
    const progressAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const quickProgressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        return () => {
            if (holdTimer.current) {
                clearTimeout(holdTimer.current);
            }
        };
    }, []);

    const dialPhone = (phone: string) => {
        Linking.openURL(`tel:${phone}`);
    };

    const startHold = () => {
        setIsHolding(true);
        Vibration.vibrate(50);

        // Start progress animation
        Animated.timing(progressAnim, {
            toValue: 1,
            duration: HOLD_DURATION,
            useNativeDriver: false,
        }).start();

        // Pulse animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Set timer
        holdTimer.current = setTimeout(() => {
            triggerSOS();
        }, HOLD_DURATION);
    };

    const cancelHold = () => {
        setIsHolding(false);
        if (holdTimer.current) {
            clearTimeout(holdTimer.current);
        }
        progressAnim.setValue(0);
        scaleAnim.setValue(1);
        scaleAnim.stopAnimation();
    };

    const startQuickHold = (type: string, message: string) => {
        setQuickHoldType(type);
        Vibration.vibrate(50);

        Animated.timing(quickProgressAnim, {
            toValue: 1,
            duration: HOLD_DURATION,
            useNativeDriver: false,
        }).start();

        holdTimer.current = setTimeout(() => {
            triggerQuickSOS(type, message);
        }, HOLD_DURATION);
    };

    const cancelQuickHold = () => {
        setQuickHoldType(null);
        if (holdTimer.current) {
            clearTimeout(holdTimer.current);
        }
        quickProgressAnim.setValue(0);
    };

    const triggerQuickSOS = (type: string, message: string) => {
        Vibration.vibrate([0, 100, 50, 100, 50, 100]);
        setQuickHoldType(null);
        quickProgressAnim.setValue(0);

        sosMutation.mutate(
            { type: type as 'Medical' | 'Fire' | 'Ragging' | 'Other', message },
            {
                onSuccess: (data) => {
                    Alert.alert(
                        '🚨 Alert Sent!',
                        `${type} emergency alert has been sent.\n\nAlerted: ${data?.alertedContacts?.map((c: any) => c.name).join(', ') || 'Security'}`,
                        [{ text: 'OK' }]
                    );
                },
                onError: () => {
                    Alert.alert('Alert Failed', 'Could not send alert. Please try again.', [{ text: 'OK' }]);
                }
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
                onSuccess: (data) => {
                    Alert.alert(
                        '🚨 SOS Sent!',
                        `Help is on the way. The warden and security have been alerted.\n\nAlerted: ${data?.alertedContacts?.map((c: any) => c.name).join(', ') || 'Security'}`,
                        [{ text: 'OK' }]
                    );
                },
                onError: () => {
                    Alert.alert(
                        'SOS Failed',
                        'Could not send SOS. Please try calling emergency contacts directly.',
                        [{ text: 'OK' }]
                    );
                }
            }
        );
    };

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    const quickProgressWidth = quickProgressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="Emergency" />
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    {/* SOS Button with Hold Animation */}
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

                                    {/* Progress overlay */}
                                    {isHolding && (
                                        <Animated.View
                                            style={[
                                                styles.progressOverlay,
                                                { width: progressWidth }
                                            ]}
                                        />
                                    )}
                                </View>
                            </Pressable>
                        </Animated.View>

                        <Text style={[styles.sosHelp, { color: '#dc2626' }]}>
                            {isHolding
                                ? '🔴 Keep holding to send SOS...'
                                : 'Hold for 3 seconds to send emergency alert'}
                        </Text>
                        <Text style={[styles.sosSubtext, { color: colors.textSecondary }]}>
                            This will alert wardens and security immediately
                        </Text>
                    </View>

                    {/* Quick Emergency Buttons - Now require 3 second hold */}
                    <View style={styles.quickButtons}>
                        <Pressable
                            style={[styles.quickBtn, { backgroundColor: isDark ? '#3f1118' : '#fef2f2', overflow: 'hidden' }]}
                            onPressIn={() => startQuickHold('Medical', 'Medical Emergency!')}
                            onPressOut={cancelQuickHold}
                            disabled={sosMutation.isPending}
                        >
                            {quickHoldType === 'Medical' && (
                                <Animated.View style={[styles.quickProgress, { width: quickProgressWidth, backgroundColor: isDark ? 'rgba(251,113,133,0.3)' : 'rgba(220,38,38,0.2)' }]} />
                            )}
                            <Ionicons name="medkit" size={28} color={isDark ? '#fb7185' : '#dc2626'} />
                            <Text style={[styles.quickBtnText, { color: isDark ? '#fb7185' : '#dc2626' }]}>Medical</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.quickBtn, { backgroundColor: isDark ? '#451a03' : '#fef3c7', overflow: 'hidden' }]}
                            onPressIn={() => startQuickHold('Fire', 'Fire Emergency!')}
                            onPressOut={cancelQuickHold}
                            disabled={sosMutation.isPending}
                        >
                            {quickHoldType === 'Fire' && (
                                <Animated.View style={[styles.quickProgress, { width: quickProgressWidth, backgroundColor: isDark ? 'rgba(251,191,36,0.3)' : 'rgba(217,119,6,0.2)' }]} />
                            )}
                            <Ionicons name="flame" size={28} color={isDark ? '#fbbf24' : '#d97706'} />
                            <Text style={[styles.quickBtnText, { color: isDark ? '#fbbf24' : '#d97706' }]}>Fire</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.quickBtn, { backgroundColor: isDark ? '#2e1065' : '#ede9fe', overflow: 'hidden' }]}
                            onPressIn={() => startQuickHold('Ragging', 'Ragging Incident!')}
                            onPressOut={cancelQuickHold}
                            disabled={sosMutation.isPending}
                        >
                            {quickHoldType === 'Ragging' && (
                                <Animated.View style={[styles.quickProgress, { width: quickProgressWidth, backgroundColor: isDark ? 'rgba(167,139,250,0.3)' : 'rgba(124,58,237,0.2)' }]} />
                            )}
                            <Ionicons name="shield" size={28} color={isDark ? '#a78bfa' : '#7c3aed'} />
                            <Text style={[styles.quickBtnText, { color: isDark ? '#a78bfa' : '#7c3aed' }]}>Ragging</Text>
                        </Pressable>
                    </View>

                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Emergency Contacts</Text>
                    <View style={styles.contactsList}>
                        {loadingContacts && <ActivityIndicator color={colors.primary} />}

                        {contacts && contacts.length > 0 ? (
                            contacts.map((contact, index) => (
                                <Pressable key={index} style={[styles.contactCard, {
                                    backgroundColor: isDark ? '#3f1118' : '#fef2f2',
                                    borderColor: isDark ? '#5c2228' : '#fee2e2'
                                }]}>
                                    <View style={[styles.contactIcon, { backgroundColor: isDark ? 'rgba(251,113,133,0.15)' : 'white' }]}>
                                        <Ionicons
                                            name={contact.role === 'Medical' ? 'medkit' : contact.role === 'Fire' ? 'flame' : 'shield'}
                                            size={24}
                                            color={isDark ? '#fb7185' : '#dc2626'}
                                        />
                                    </View>
                                    <View style={styles.contactInfo}>
                                        <Text style={[styles.contactRole, { color: isDark ? '#fca5a5' : '#0a0a0a' }]}>{contact.name}</Text>
                                        <Text style={[styles.contactPhone, { color: isDark ? '#fb7185' : '#dc2626' }]}>{contact.phone}</Text>
                                    </View>
                                    <Pressable style={[styles.callBtn, { backgroundColor: isDark ? '#be123c' : '#dc2626' }]} onPress={() => dialPhone(contact.phone)}>
                                        <Ionicons name="call" size={20} color="white" />
                                    </Pressable>
                                </Pressable>
                            ))
                        ) : !loadingContacts && (
                            <View style={styles.emptyState}>
                                <Ionicons name="call-outline" size={48} color={colors.textTertiary} />
                                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No contacts available</Text>
                            </View>
                        )}
                    </View>
                </View>
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
        elevation: 15
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
    quickBtnText: { fontSize: 12, fontWeight: '600', marginTop: 8 },
    sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
    contactsList: { gap: 12 },
    contactCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, borderWidth: 1 },
    contactIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
    contactInfo: { flex: 1, marginLeft: 16 },
    contactRole: { fontSize: 14, fontWeight: '600' },
    contactPhone: { fontSize: 14, marginTop: 2 },
    callBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#dc2626', alignItems: 'center', justifyContent: 'center' },
    emptyState: { alignItems: 'center', paddingVertical: 32 },
    emptyText: { fontSize: 16, marginTop: 12 },
});
