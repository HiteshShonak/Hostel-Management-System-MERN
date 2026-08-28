import React from 'react';
import { View, Text, StyleSheet, Pressable, Animated, ScrollView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAuth } from '@/lib/contexts/auth';
import { useTheme } from '@/lib/contexts/theme';
import {
    ScannerOverlay,
    ScanResultStatusHeader,
    StudentPassCard,
    ScanActionButtons,
    CameraPermissionView,
    NoAccessView,
    useScannerAnimation,
    useQRScanner,
} from '@/components/qr';

export default function QRScannerPage() {
    const { user } = useAuth();
    const { colors } = useTheme();
    const [permission, requestPermission] = useCameraPermissions();

    const {
        scanned,
        scanResult,
        actionCompleted,
        isValidating,
        handleBarCodeScanned,
        handleLetOut,
        handleLetIn,
        resetScanState,
        studentInfo,
        hasExited,
        isPassExpired,
        isPending,
    } = useQRScanner();

    const {
        pulseAnim,
        validatePulse,
        resultOpacity,
        statusSlide,
        cardSlide,
        cardOpacity,
        actionsSlide,
        actionsOpacity,
        confirmOpacity,
        confirmSlide,
        resetScan,
    } = useScannerAnimation(isValidating, scanResult, actionCompleted, resetScanState);

    // Check if user has permission to scan (guard/warden/admin)
    const canScan = user?.role === 'warden' || user?.role === 'admin' || user?.role === 'guard';

    if (!canScan) {
        return <NoAccessView />;
    }

    if (!permission || !permission.granted) {
        return (
            <CameraPermissionView
                hasPermissionObject={!!permission}
                onRequestPermission={requestPermission}
            />
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Universal standard PageHeader across both camera and result states */}
            <PageHeader title="Scan Gate Pass" showNotifications={false} />

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
                    <ScannerOverlay
                        pulseAnim={pulseAnim}
                        isValidating={isValidating}
                        validatePulse={validatePulse}
                    />
                </View>
            ) : (
                /* Result View */
                <Animated.View style={[styles.resultContainer, { backgroundColor: colors.background, opacity: resultOpacity }]}>
                    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.resultScrollContent} showsVerticalScrollIndicator={false}>
                        {/* Compact Status Header */}
                        <ScanResultStatusHeader
                            scanResult={scanResult}
                            translateY={statusSlide}
                        />

                        {/* Student Details Card */}
                        {scanResult.pass && (scanResult.type === 'success' || scanResult.type === 'late' || scanResult.type === 'expired') && studentInfo && (
                            <StudentPassCard
                                pass={scanResult.pass}
                                opacity={cardOpacity}
                                translateY={cardSlide}
                                isPassExpired={isPassExpired}
                                hasExited={hasExited}
                            />
                        )}

                        {/* Action Buttons */}
                        <ScanActionButtons
                            hasExited={hasExited}
                            actionCompleted={actionCompleted}
                            isPending={isPending}
                            onPrimaryAction={hasExited ? handleLetIn : handleLetOut}
                            onScanAgain={resetScan}
                            confirmationMessage={scanResult.message}
                            opacity={actionsOpacity}
                            translateY={actionsSlide}
                            confirmOpacity={confirmOpacity}
                            confirmSlide={confirmSlide}
                            isInvalidOrRejected={!(scanResult.type === 'success' || scanResult.type === 'late' || (scanResult.type === 'expired' && hasExited))}
                        />

                        {/* Back to Dashboard */}
                        <Pressable
                            style={styles.backToDashboard}
                            onPress={() => router.canGoBack() ? router.back() : router.replace('/')}
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
    container: { flex: 1 },
    camera: { flex: 1 },
    resultContainer: {
        flex: 1,
        padding: 16,
    },
    resultScrollContent: {
        paddingBottom: 20,
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
