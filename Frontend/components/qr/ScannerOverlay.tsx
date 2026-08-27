import React from 'react';
import { View, Text, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { useTheme } from '@/lib/contexts/theme';

interface ScannerOverlayProps {
    pulseAnim: Animated.Value;
    isValidating: boolean;
    validatePulse: Animated.Value;
}

// Viewfinder frame with corners and validating indicator
export function ScannerOverlay({
    pulseAnim,
    isValidating,
    validatePulse,
}: ScannerOverlayProps) {
    const { colors } = useTheme();

    return (
        <>
            <View style={styles.overlay}>
                <View style={styles.overlayTop} />
                <View style={styles.overlayMiddle}>
                    <View style={styles.overlaySide} />
                    <Animated.View
                        style={[
                            styles.scanFrame,
                            { transform: [{ scale: pulseAnim }], borderColor: colors.primary },
                        ]}
                    >
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

            {isValidating && (
                <View style={styles.validatingOverlay}>
                    <Animated.View style={[styles.validatingContent, { opacity: validatePulse }]}>
                        <ActivityIndicator size="large" color="white" />
                        <Text style={styles.validatingText}>Verifying gate pass...</Text>
                    </Animated.View>
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
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
});
