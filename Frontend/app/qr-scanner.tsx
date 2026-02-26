import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Vibration, Animated, ScrollView, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useValidateGatePass, useMarkExit, useMarkEntry } from '@/lib/hooks';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { GatePass, User } from '@/lib/types';

type ScanResult = {
    type: 'success' | 'error' | 'invalid' | 'pending' | 'late' | 'expired';
    message: string;
    pass?: GatePass;
    status?: string;
    isLate?: boolean;
    lateNote?: string;
};

export default function QRScannerPage() {
    const { user } = useAuth();
    const { colors, isDark } = useTheme();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);
    const [actionCompleted, setActionCompleted] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const validateMutation = useValidateGatePass();
    const markExitMutation = useMarkExit();
    const markEntryMutation = useMarkEntry();

    // animation values
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const validatePulse = useRef(new Animated.Value(0.4)).current;
    const resultOpacity = useRef(new Animated.Value(0)).current;
    const statusSlide = useRef(new Animated.Value(30)).current;
    const cardSlide = useRef(new Animated.Value(30)).current;
    const cardOpacity = useRef(new Animated.Value(0)).current;
    const actionsSlide = useRef(new Animated.Value(30)).current;
    const actionsOpacity = useRef(new Animated.Value(0)).current;
    const confirmOpacity = useRef(new Animated.Value(0)).current;
    const confirmSlide = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        // Pulse animation for scan frame
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    // validating pulse loop
    useEffect(() => {
        if (isValidating) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(validatePulse, { toValue: 1, duration: 800, useNativeDriver: true }),
                    Animated.timing(validatePulse, { toValue: 0.4, duration: 800, useNativeDriver: true }),
                ])
            ).start();
        }
    }, [isValidating]);

    // staggered result entry animation
    useEffect(() => {
        if (scanResult && !isValidating) {
            // reset values
            resultOpacity.setValue(0);
            statusSlide.setValue(30);
            cardOpacity.setValue(0);
            cardSlide.setValue(30);
            actionsOpacity.setValue(0);
            actionsSlide.setValue(30);

            // stagger: status header → student card → actions
            Animated.stagger(120, [
                Animated.parallel([
                    Animated.timing(resultOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
                    Animated.spring(statusSlide, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
                ]),
                Animated.parallel([
                    Animated.timing(cardOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
                    Animated.spring(cardSlide, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
                ]),
                Animated.parallel([
                    Animated.timing(actionsOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
                    Animated.spring(actionsSlide, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
                ]),
            ]).start();
        }
    }, [scanResult, isValidating]);

    // action completion crossfade
    useEffect(() => {
        if (actionCompleted) {
            confirmOpacity.setValue(0);
            confirmSlide.setValue(20);
            Animated.parallel([
                Animated.timing(confirmOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.spring(confirmSlide, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
            ]).start();
        }
    }, [actionCompleted]);

    const resetScan = useCallback(() => {
        // fade out then reset
        Animated.timing(resultOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
            setScanned(false);
            setScanResult(null);
            setActionCompleted(false);
            setIsValidating(false);
            // reset all animation values for next scan
            resultOpacity.setValue(0);
            statusSlide.setValue(30);
            cardOpacity.setValue(0);
            cardSlide.setValue(30);
            actionsOpacity.setValue(0);
            actionsSlide.setValue(30);
            confirmOpacity.setValue(0);
            confirmSlide.setValue(20);
        });
    }, []);

    // Check if user has permission to scan (guard/warden/admin)
    const canScan = user?.role === 'warden' || user?.role === 'admin' || user?.role === 'guard';

    if (!canScan) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={[styles.noAccess, { backgroundColor: colors.card }]}>
                    <Ionicons name="lock-closed" size={64} color="#dc2626" />
                    <Text style={[styles.noAccessTitle, { color: colors.text }]}>Access Denied</Text>
                    <Text style={[styles.noAccessText, { color: colors.textSecondary }]}>Only staff members can verify gate passes</Text>
                    <Pressable style={[styles.backBtn, { backgroundColor: colors.background }]} onPress={() => router.back()}>
                        <Text style={[styles.backBtnText, { color: colors.text }]}>Go Back</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    if (!permission) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={[styles.permissionContainer, { backgroundColor: colors.card }]}>
                    <Ionicons name="camera-outline" size={64} color={colors.textSecondary} />
                    <Text style={[styles.permissionText, { color: colors.textSecondary }]}>Camera permission is required</Text>
                </View>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={[styles.permissionContainer, { backgroundColor: colors.card }]}>
                    <Ionicons name="camera-outline" size={64} color={colors.primary} />
                    <Text style={[styles.permissionTitle, { color: colors.text }]}>Camera Access Required</Text>
                    <Text style={[styles.permissionText, { color: colors.textSecondary }]}>We need camera access to scan QR codes on gate passes</Text>
                    <Pressable style={[styles.grantBtn, { backgroundColor: colors.primary }]} onPress={requestPermission}>
                        <Text style={styles.grantBtnText}>Grant Permission</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        if (scanned) return;

        setScanned(true);
        setIsValidating(true);
        Vibration.vibrate(100);

        validateMutation.mutate(data, {
            onSuccess: (result) => {
                setIsValidating(false);
                if (result.valid) {
                    Vibration.vibrate([0, 100, 50, 100]);
                    setScanResult({
                        type: 'success',
                        message: 'Gate Pass Verified! Student may exit.',
                        pass: result.pass,
                        status: result.status,
                    });
                } else if (result.status === 'EXPIRED') {
                    // Pass has expired - show EXPIRED state
                    Vibration.vibrate([0, 300, 100, 300]);
                    const isOutside = result.isStudentOutside;
                    setScanResult({
                        type: 'expired',
                        message: isOutside
                            ? 'EXPIRED - Student is still outside and needs to return immediately!'
                            : 'Pass has expired',
                        pass: result.pass,
                        status: 'EXPIRED',
                    });
                } else if (result.status === 'NOT_STARTED') {
                    // Pass not yet started - show pending
                    Vibration.vibrate([0, 200]);
                    setScanResult({
                        type: 'pending',
                        message: result.error || 'Pass not valid yet',
                        pass: result.pass,
                        status: 'NOT_STARTED',
                    });
                } else if (result.status === 'PENDING') {
                    Vibration.vibrate([0, 300]);
                    setScanResult({
                        type: 'pending',
                        message: 'Gate pass is awaiting approval from Warden.',
                        pass: result.pass,
                        status: 'PENDING',
                    });
                } else {
                    Vibration.vibrate([0, 200, 100, 200]);
                    setScanResult({
                        type: 'error',
                        message: result.error || 'Gate pass is not valid for exit',
                        pass: result.pass,
                        status: result.status,
                    });
                }
            },
            onError: (error: any) => {
                setIsValidating(false);
                Vibration.vibrate([0, 500]);
                setScanResult({
                    type: 'invalid',
                    message: error?.response?.data?.error || 'Failed to verify pass',
                });
            },
        });
    };



    const getUserInfo = (passUser: string | User | undefined) => {
        if (typeof passUser === 'object' && passUser) {
            return passUser;
        }
        return null;
    };

    const handleLetOut = () => {
        if (!scanResult?.pass) return;

        markExitMutation.mutate(scanResult.pass._id, {
            onSuccess: () => {
                Vibration.vibrate([0, 100]);
                const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                setActionCompleted(true);
                setScanResult({
                    ...scanResult,
                    message: `Exit recorded at ${now}`,
                });
            },
        });
    };

    const handleLetIn = () => {
        if (!scanResult?.pass) return;

        markEntryMutation.mutate(scanResult.pass._id, {
            onSuccess: (data) => {
                Vibration.vibrate([0, 100]);
                const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                // Check if student returned late
                const isLate = data?.isLate || false;
                const lateNote = data?.lateNote || '';

                setActionCompleted(true);
                if (isLate) {
                    setScanResult({
                        type: 'late',
                        message: `Late return at ${now} — ${lateNote}`,
                        pass: scanResult.pass,
                        isLate: true,
                        lateNote: lateNote,
                    });
                } else {
                    setScanResult({
                        ...scanResult,
                        message: `Entry recorded at ${now}. Welcome back!`,
                    });
                }
            },
        });
    };

    const studentInfo = scanResult?.pass ? getUserInfo(scanResult.pass.user) : null;
    const hasExited = scanResult?.pass?.exitTime && !scanResult?.pass?.entryTime;

    // Check if pass is expired (student outside and past toDate)
    const isPassExpired = scanResult?.pass && hasExited && new Date() > new Date(scanResult.pass.toDate);

    return (
        <View style={[styles.container, { backgroundColor: '#000' }]}>
            {/* Header - Always Black background for camera view */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.headerBack}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </Pressable>
                <Text style={styles.headerTitle}>Scan Gate Pass</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Camera View */}
            {!scanResult ? (
                <View style={{ flex: 1 }}>
                    <CameraView
                        style={styles.camera}
                        facing="back"
                        barcodeScannerSettings={{
                            barcodeTypes: ['qr'],
                        }}
                        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                    />
                    {/* Overlay with absolute positioning */}
                    <View style={styles.overlay}>
                        <View style={styles.overlayTop} />
                        <View style={styles.overlayMiddle}>
                            <View style={styles.overlaySide} />
                            <Animated.View style={[styles.scanFrame, { transform: [{ scale: pulseAnim }], borderColor: colors.primary }]}>
                                <View style={[styles.corner, styles.cornerTL, { borderColor: colors.primary }]} />
                                <View style={[styles.corner, styles.cornerTR, { borderColor: colors.primary }]} />
                                <View style={[styles.corner, styles.cornerBL, { borderColor: colors.primary }]} />
                                <View style={[styles.corner, styles.cornerBR, { borderColor: colors.primary }]} />
                            </Animated.View>
                            <View style={styles.overlaySide} />
                        </View>
                        <View style={styles.overlayBottom}>
                            <Text style={styles.scanHint}>Point camera at QR code on gate pass</Text>
                        </View>
                    </View>

                    {/* Validating overlay */}
                    {isValidating && (
                        <View style={styles.validatingOverlay}>
                            <Animated.View style={[styles.validatingContent, { opacity: validatePulse }]}>
                                <ActivityIndicator size="large" color="white" />
                                <Text style={styles.validatingText}>Verifying gate pass...</Text>
                            </Animated.View>
                        </View>
                    )}
                </View>
            ) : (
                /* Result View */
                <Animated.View style={[styles.resultContainer, { backgroundColor: colors.background, opacity: resultOpacity }]}>
                    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.resultScrollContent} showsVerticalScrollIndicator={false}>
                        {/* Compact Status Header */}
                        <Animated.View style={[styles.statusHeader, { backgroundColor: colors.card, transform: [{ translateY: statusSlide }] }]}>
                            <View style={[
                                styles.statusIconCompact,
                                scanResult.type === 'success' && styles.statusSuccess,
                                scanResult.type === 'late' && styles.statusLate,
                                scanResult.type === 'expired' && styles.statusExpired,
                                scanResult.type === 'pending' && styles.statusPending,
                                (scanResult.type === 'error' || scanResult.type === 'invalid') && styles.statusError,
                            ]}>
                                <Ionicons
                                    name={
                                        scanResult.type === 'success' ? 'checkmark-circle' :
                                            scanResult.type === 'late' ? 'time' :
                                                scanResult.type === 'expired' ? 'warning' :
                                                    scanResult.type === 'pending' ? 'hourglass' : 'close-circle'
                                    }
                                    size={32}
                                    color="white"
                                />
                            </View>
                            <View style={styles.statusTextContainer}>
                                <Text style={[
                                    styles.statusTitleCompact,
                                    {
                                        color: scanResult.type === 'success' ? '#16a34a' :
                                            scanResult.type === 'late' ? '#ea580c' :
                                                scanResult.type === 'expired' ? '#dc2626' :
                                                    scanResult.type === 'pending' ? '#d97706' : '#dc2626'
                                    }
                                ]}>
                                    {scanResult.type === 'success' ? 'VALID' :
                                        scanResult.type === 'late' ? 'LATE RETURN' :
                                            scanResult.type === 'expired' ? 'EXPIRED' :
                                                scanResult.type === 'pending' ? 'NOT YET' : 'REJECTED'}
                                </Text>
                                <Text style={[styles.statusMessageCompact, { color: colors.textSecondary }]}>{scanResult.message}</Text>
                            </View>
                        </Animated.View>

                        {/* Student Details Card */}
                        {scanResult.pass && (scanResult.type === 'success' || scanResult.type === 'late' || scanResult.type === 'expired') && studentInfo && (
                            <Animated.View style={[styles.studentCard, { backgroundColor: colors.card, opacity: cardOpacity, transform: [{ translateY: cardSlide }] }]}>
                                <View style={styles.studentHeader}>
                                    <Ionicons name="person-circle" size={24} color={colors.primary} />
                                    <Text style={[styles.studentName, { color: colors.text }]}>{studentInfo.name}</Text>
                                </View>

                                <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />

                                <View style={styles.infoGrid}>
                                    <View style={styles.infoItem}>
                                        <Ionicons name="school" size={18} color={colors.textSecondary} />
                                        <View style={styles.infoTextContainer}>
                                            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Roll Number</Text>
                                            <Text style={[styles.infoValue, { color: colors.text }]}>{studentInfo.rollNo}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.infoItem}>
                                        <Ionicons name="home" size={18} color={colors.textSecondary} />
                                        <View style={styles.infoTextContainer}>
                                            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Room</Text>
                                            <Text style={[styles.infoValue, { color: colors.text }]}>{studentInfo.room}</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.infoGrid}>
                                    <View style={styles.infoItem}>
                                        <Ionicons name="business" size={18} color={colors.textSecondary} />
                                        <View style={styles.infoTextContainer}>
                                            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Hostel</Text>
                                            <Text style={[styles.infoValue, { color: colors.text }]}>{studentInfo.hostel || 'N/A'}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.infoItem}>
                                        <Ionicons name="call" size={18} color={colors.textSecondary} />
                                        <View style={styles.infoTextContainer}>
                                            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Phone</Text>
                                            <Text style={[styles.infoValue, { color: colors.text }]}>{studentInfo.phone || 'N/A'}</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />

                                <View style={styles.reasonContainer}>
                                    <Ionicons name="document-text" size={18} color={colors.textSecondary} />
                                    <View style={styles.infoTextContainer}>
                                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Reason</Text>
                                        <Text style={[styles.reasonText, { color: colors.textSecondary }]}>{scanResult.pass.reason}</Text>
                                    </View>
                                </View>

                                <View style={[styles.validityContainer, { backgroundColor: isDark ? '#14532d' : '#f0fdf4' }]}>
                                    <Ionicons name="calendar" size={16} color={isDark ? '#4ade80' : colors.success} />
                                    <Text style={[styles.validityText, { color: isDark ? '#4ade80' : colors.success }]}>
                                        Valid: {new Date(scanResult.pass.fromDate).toLocaleDateString()} - {new Date(scanResult.pass.toDate).toLocaleDateString()}
                                    </Text>
                                </View>

                                {isPassExpired && hasExited && (
                                    <View style={[styles.validityContainer, { backgroundColor: isDark ? '#450a0a' : '#fef2f2', marginTop: 8 }]}>
                                        <Ionicons name="warning" size={16} color={isDark ? '#fca5a5' : '#dc2626'} />
                                        <Text style={[styles.validityText, { color: isDark ? '#fca5a5' : '#dc2626' }]}>
                                            Student is still outside — pass expired
                                        </Text>
                                    </View>
                                )}
                            </Animated.View>
                        )}

                        {/* Action Buttons - Compact */}
                        {(scanResult.type === 'success' || scanResult.type === 'late' || (scanResult.type === 'expired' && hasExited)) && !actionCompleted && (
                            <Animated.View style={[styles.actionsCompact, { opacity: actionsOpacity, transform: [{ translateY: actionsSlide }] }]}>
                                {/* Primary Action: Let Out or Let In */}
                                <Pressable
                                    style={[
                                        styles.primaryBtnCompact,
                                        hasExited ? styles.letInBtn : styles.letOutBtn
                                    ]}
                                    onPress={hasExited ? handleLetIn : handleLetOut}
                                    disabled={markExitMutation.isPending || markEntryMutation.isPending}
                                >
                                    {(markExitMutation.isPending || markEntryMutation.isPending) ? (
                                        <ActivityIndicator size="small" color="white" />
                                    ) : (
                                        <Ionicons
                                            name={hasExited ? "enter" : "exit"}
                                            size={22}
                                            color="white"
                                        />
                                    )}
                                    <Text style={styles.primaryBtnText}>
                                        {(markExitMutation.isPending || markEntryMutation.isPending) ? 'PROCESSING...' : hasExited ? "LET IN" : "LET OUT"}
                                    </Text>
                                </Pressable>

                                {/* Secondary Action: Scan Another */}
                                <Pressable
                                    style={[styles.scanAgainBtn, { backgroundColor: colors.primary }]}
                                    onPress={resetScan}
                                >
                                    <Ionicons name="scan" size={22} color="white" />
                                    <Text style={styles.scanAgainText}>Scan Another</Text>
                                </Pressable>
                            </Animated.View>
                        )}

                        {/* Success confirmation after action completed */}
                        {actionCompleted && (
                            <Animated.View style={[styles.actionsCompact, { opacity: confirmOpacity, transform: [{ translateY: confirmSlide }] }]}>
                                <View style={[styles.actionConfirmation, { backgroundColor: isDark ? '#052e16' : '#f0fdf4' }]}>
                                    <Ionicons name="checkmark-circle" size={24} color={isDark ? '#4ade80' : '#16a34a'} />
                                    <Text style={[styles.actionConfirmationText, { color: isDark ? '#4ade80' : '#16a34a' }]}>
                                        {scanResult.message}
                                    </Text>
                                </View>
                                <Pressable
                                    style={[styles.scanAgainBtn, { backgroundColor: colors.primary }]}
                                    onPress={resetScan}
                                >
                                    <Ionicons name="scan" size={22} color="white" />
                                    <Text style={styles.scanAgainText}>Scan Another</Text>
                                </Pressable>
                            </Animated.View>
                        )}

                        {/* For rejected/invalid, just show scan another */}
                        {!(scanResult.type === 'success' || scanResult.type === 'late' || (scanResult.type === 'expired' && hasExited)) && (
                            <Animated.View style={{ opacity: actionsOpacity, transform: [{ translateY: actionsSlide }] }}>
                                <Pressable style={[styles.scanAgainBtn, { backgroundColor: colors.primary }]} onPress={resetScan}>
                                    <Ionicons name="scan" size={22} color="white" />
                                    <Text style={styles.scanAgainText}>Scan Another</Text>
                                </Pressable>
                            </Animated.View>
                        )}

                        {/* Back to Dashboard */}
                        <Pressable
                            style={styles.backToDashboard}
                            onPress={() => router.back()}
                        >
                            <Ionicons name="arrow-back" size={18} color={colors.textSecondary} />
                            <Text style={[styles.backToDashboardText, { color: colors.textSecondary }]}>Back to Dashboard</Text>
                        </Pressable>
                    </ScrollView>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: '#000'
    },
    headerBack: { padding: 8 },
    headerTitle: { color: 'white', fontSize: 18, fontWeight: '600' },
    camera: { flex: 1 },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    overlayTop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
    overlayMiddle: { flexDirection: 'row' },
    overlaySide: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
    scanFrame: { width: 250, height: 250, borderRadius: 20, borderWidth: 2 },
    corner: { position: 'absolute', width: 40, height: 40, borderWidth: 4 },
    cornerTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 20 },
    cornerTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 20 },
    cornerBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 20 },
    cornerBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 20 },
    overlayBottom: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', paddingTop: 32 },
    scanHint: { color: 'white', fontSize: 16, opacity: 0.8 },
    permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
    permissionTitle: { fontSize: 20, fontWeight: '600', marginTop: 16 },
    permissionText: { fontSize: 14, textAlign: 'center', marginTop: 8 },
    grantBtn: { marginTop: 24, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
    grantBtnText: { color: 'white', fontWeight: '600', fontSize: 16 },
    noAccess: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
    noAccessTitle: { fontSize: 24, fontWeight: '700', marginTop: 16 },
    noAccessText: { fontSize: 14, marginTop: 8, textAlign: 'center' },
    backBtn: { marginTop: 24, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
    backBtnText: { fontWeight: '600' },

    // New Enhanced Result Styles
    resultContainer: {
        flex: 1,
        padding: 16,
    },
    resultScrollContent: {
        paddingBottom: 20,
    },
    validatingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.75)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    validatingContent: {
        alignItems: 'center',
        gap: 16,
    },
    validatingText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginTop: 8,
    },
    statusSuccess: { backgroundColor: '#16a34a' },
    statusLate: { backgroundColor: '#ea580c' },
    statusExpired: { backgroundColor: '#dc2626' },
    statusPending: { backgroundColor: '#d97706' },
    statusError: { backgroundColor: '#dc2626' },

    // Student Card Styles
    studentCard: {
        width: '100%',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
    },
    studentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    studentName: {
        fontSize: 20,
        fontWeight: '700',
        flex: 1,
    },
    divider: {
        height: 1,
        marginVertical: 16,
    },
    infoGrid: {
        flexDirection: 'row',
        gap: 16,
    },
    infoItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    infoTextContainer: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    reasonContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    reasonText: {
        fontSize: 15,
        lineHeight: 22,
    },
    validityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 12,
        borderRadius: 10,
        marginTop: 12,
    },
    validityText: {
        fontSize: 13,
        fontWeight: '500',
    },

    letOutBtn: {
        backgroundColor: '#16a34a',
    },
    letInBtn: {
        backgroundColor: '#1d4ed8',
    },
    scanAgainBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 10,
    },
    scanAgainText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
        letterSpacing: 0.5,
    },

    // Compact Status Styles
    statusHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        width: '100%',
    },
    statusIconCompact: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    statusTextContainer: {
        flex: 1,
    },
    statusTitleCompact: {
        fontSize: 20,
        fontWeight: '800',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    statusMessageCompact: {
        fontSize: 14,
        lineHeight: 20,
    },



    // Compact Action Buttons
    actionsCompact: {
        width: '100%',
        gap: 10,
    },
    actionConfirmation: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    actionConfirmationText: {
        fontSize: 15,
        fontWeight: '600',
        flex: 1,
    },
    primaryBtnCompact: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 16,
        borderRadius: 12,
    },
    primaryBtnText: {
        fontSize: 18,
        fontWeight: '800',
        color: 'white',
        letterSpacing: 1.2,
    },

    backToDashboard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 14,
        marginTop: 8,
    },
    backToDashboardText: {
        fontSize: 14,
        fontWeight: '500',
    },
});
