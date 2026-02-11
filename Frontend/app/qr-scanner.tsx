import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Vibration, Animated } from 'react-native';
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
    const validateMutation = useValidateGatePass();
    const markExitMutation = useMarkExit();
    const markEntryMutation = useMarkEntry();

    const pulseAnim = new Animated.Value(1);

    useEffect(() => {
        // Pulse animation for scan frame
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
            ])
        ).start();
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
        Vibration.vibrate(100);

        validateMutation.mutate(data, {
            onSuccess: (result) => {
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
                            ? '⚠️ EXPIRED - Student is still outside and needs to return immediately!'
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
                Vibration.vibrate([0, 500]);
                setScanResult({
                    type: 'invalid',
                    message: error?.response?.data?.error || 'Failed to verify pass',
                });
            },
        });
    };

    const resetScan = () => {
        setScanned(false);
        setScanResult(null);
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
                setScanResult({
                    ...scanResult,
                    message: '✅ Student has been let OUT. Exit recorded successfully!',
                });
            },
        });
    };

    const handleLetIn = () => {
        if (!scanResult?.pass) return;

        markEntryMutation.mutate(scanResult.pass._id, {
            onSuccess: (data) => {
                Vibration.vibrate([0, 100]);

                // Check if student returned late
                const isLate = data?.isLate || false;
                const lateNote = data?.lateNote || '';

                if (isLate) {
                    // Show LATE status
                    setScanResult({
                        type: 'late',
                        message: `⏰ LATE RETURN: ${lateNote} `,
                        pass: scanResult.pass,
                        isLate: true,
                        lateNote: lateNote,
                    });
                } else {
                    setScanResult({
                        ...scanResult,
                        message: '🏠 Student has been let IN. Welcome back!',
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
                </View>
            ) : (
                /* Result View */
                <View style={[styles.resultContainer, { backgroundColor: colors.background }]}>
                    {/* Compact Status Header */}
                    <View style={[styles.statusHeader, { backgroundColor: colors.card, shadowColor: isDark ? 'transparent' : '#000' }]}>
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
                                {scanResult.type === 'success' ? 'APPROVED' :
                                    scanResult.type === 'late' ? 'LATE RETURN' :
                                        scanResult.type === 'expired' ? 'EXPIRED' :
                                            scanResult.type === 'pending' ? 'NOT YET' : 'REJECTED'}
                            </Text>
                            <Text style={[styles.statusMessageCompact, { color: colors.textSecondary }]}>{scanResult.message}</Text>
                        </View>
                    </View>

                    {/* Student Details Card */}
                    {scanResult.pass && (scanResult.type === 'success' || scanResult.type === 'late' || scanResult.type === 'expired') && studentInfo && (
                        <View style={[styles.studentCard, { backgroundColor: colors.card, shadowColor: isDark ? 'transparent' : '#000' }]}>
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

                            <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />

                            <View style={styles.reasonContainer}>
                                <Ionicons name="document-text" size={18} color={colors.textSecondary} />
                                <View style={styles.infoTextContainer}>
                                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Reason</Text>
                                    <Text style={[styles.reasonText, { color: colors.textSecondary }]}>{scanResult.pass.reason}</Text>
                                </View>
                            </View>

                            <View style={[styles.validityContainer, { backgroundColor: isDark ? '#14532d' : '#f0fdf4' }]}>
                                <Ionicons name="calendar" size={16} color={colors.success} />
                                <Text style={[styles.validityText, { color: isDark ? '#4ade80' : colors.success }]}>
                                    Valid: {new Date(scanResult.pass.fromDate).toLocaleDateString()} - {new Date(scanResult.pass.toDate).toLocaleDateString()}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Action Buttons - Compact */}
                    {(scanResult.type === 'success' || scanResult.type === 'late' || (scanResult.type === 'expired' && hasExited)) && (
                        <View style={styles.actionsCompact}>
                            {/* Primary Action: Let Out or Let In - Sleeker */}
                            <Pressable
                                style={[
                                    styles.primaryBtnCompact,
                                    hasExited ? styles.letInBtn : styles.letOutBtn
                                ]}
                                onPress={hasExited ? handleLetIn : handleLetOut}
                                disabled={markExitMutation.isPending || markEntryMutation.isPending}
                            >
                                <Ionicons
                                    name={hasExited ? "enter" : "exit"}
                                    size={22}
                                    color="white"
                                />
                                <Text style={styles.primaryBtnText}>
                                    {hasExited ? "LET IN" : "LET OUT"}
                                </Text>
                            </Pressable>

                            {/* Secondary Action: Scan Another - Icon only */}
                            <Pressable
                                style={[styles.secondaryBtnCompact, { backgroundColor: isDark ? '#1e293b' : '#f8fafc' }]}
                                onPress={resetScan}
                            >
                                <Ionicons name="scan" size={20} color={colors.textSecondary} />
                                <Text style={[styles.secondaryBtnTextCompact, { color: colors.textSecondary }]}>Scan Another</Text>
                            </Pressable>
                        </View>
                    )}

                    {/* For rejected/invalid, just show scan another - BUT NOT if we already showed actions above */}
                    {!(scanResult.type === 'success' || scanResult.type === 'late' || (scanResult.type === 'expired' && hasExited)) && (
                        <Pressable style={[styles.scanAgainBtn, { backgroundColor: colors.primary }]} onPress={resetScan}>
                            <Ionicons name="scan" size={22} color="white" />
                            <Text style={styles.scanAgainText}>Scan Another</Text>
                        </Pressable>
                    )}
                </View>
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
        padding: 24,
        alignItems: 'center',
    },
    statusIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        marginBottom: 20,
    },
    statusSuccess: { backgroundColor: '#16a34a' },
    statusLate: { backgroundColor: '#ea580c' },
    statusExpired: { backgroundColor: '#dc2626' },
    statusPending: { backgroundColor: '#d97706' },
    statusError: { backgroundColor: '#dc2626' },
    statusTitle: {
        fontSize: 32,
        fontWeight: '800',
        letterSpacing: 2,
        marginBottom: 8,
    },
    statusMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
        paddingHorizontal: 20,
        lineHeight: 22,
    },

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

    // Action Buttons
    actionsContainer: {
        width: '100%',
        gap: 12,
    },
    primaryActionBtn: {
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
    },
    letOutBtn: {
        backgroundColor: '#16a34a',
    },
    letInBtn: {
        backgroundColor: '#1d4ed8',
    },
    primaryActionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        gap: 16,
    },
    primaryActionTextContainer: {
        flex: 1,
    },
    primaryActionTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: 'white',
        letterSpacing: 1.5,
        marginBottom: 4,
    },
    primaryActionSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.85)',
        fontWeight: '500',
    },
    secondaryActionBtn: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        borderWidth: 2,
        borderColor: '#1d4ed8',
        borderRadius: 14,
        padding: 16,
    },
    secondaryActionText: {
        fontSize: 16,
        fontWeight: '600',
    },
    scanAgainBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 14,
        marginTop: 16,
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
        fontSize: 13,
        lineHeight: 18,
    },

    // Compact Student Card
    studentCardCompact: {
        width: '100%',
        borderRadius: 14,
        padding: 16,
        marginBottom: 16,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 14,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    studentNameCompact: {
        fontSize: 18,
        fontWeight: '700',
        flex: 1,
    },
    infoRows: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    compactInfoRow: {
        flex: 1,
        backgroundColor: '#f8fafc',
        padding: 10,
        borderRadius: 8,
    },
    compactLabel: {
        fontSize: 11,
        marginBottom: 4,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    compactValue: {
        fontSize: 15,
        fontWeight: '700',
    },
    reasonRowCompact: {
        marginBottom: 10,
    },
    reasonTextCompact: {
        fontSize: 14,
        lineHeight: 20,
        marginTop: 4,
    },
    validityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#f0fdf4',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    validityBadgeText: {
        fontSize: 12,
        fontWeight: '600',
    },

    // Compact Action Buttons
    actionsCompact: {
        width: '100%',
        gap: 10,
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
    secondaryBtnCompact: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 10,
    },
    secondaryBtnTextCompact: {
        fontSize: 14,
        fontWeight: '600',
    },
});
