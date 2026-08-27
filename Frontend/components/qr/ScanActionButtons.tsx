import React from 'react';
import { View, Text, Pressable, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';

interface ScanActionButtonsProps {
    hasExited: boolean;
    actionCompleted: boolean;
    isPending: boolean;
    onPrimaryAction: () => void;
    onScanAgain: () => void;
    confirmationMessage?: string;
    opacity: Animated.Value;
    translateY: Animated.Value;
    confirmOpacity: Animated.Value;
    confirmSlide: Animated.Value;
    isInvalidOrRejected?: boolean;
}

// Action controls for entry/exit approval and scan resetting
export function ScanActionButtons({
    hasExited,
    actionCompleted,
    isPending,
    onPrimaryAction,
    onScanAgain,
    confirmationMessage,
    opacity,
    translateY,
    confirmOpacity,
    confirmSlide,
    isInvalidOrRejected = false,
}: ScanActionButtonsProps) {
    const { colors, isDark } = useTheme();

    if (isInvalidOrRejected) {
        return (
            <Animated.View style={{ opacity, transform: [{ translateY }] }}>
                <Pressable style={[styles.scanAgainBtn, { backgroundColor: colors.primary }]} onPress={onScanAgain}>
                    <Ionicons name="scan" size={22} color="white" />
                    <Text style={styles.scanAgainText}>Scan Another</Text>
                </Pressable>
            </Animated.View>
        );
    }

    if (actionCompleted) {
        return (
            <Animated.View style={[styles.actionsCompact, { opacity: confirmOpacity, transform: [{ translateY: confirmSlide }] }]}>
                <View style={[styles.actionConfirmation, { backgroundColor: isDark ? '#052e16' : '#f0fdf4' }]}>
                    <Ionicons name="checkmark-circle" size={24} color={isDark ? '#4ade80' : '#16a34a'} />
                    <Text style={[styles.actionConfirmationText, { color: isDark ? '#4ade80' : '#16a34a' }]}>
                        {confirmationMessage}
                    </Text>
                </View>
                <Pressable style={[styles.scanAgainBtn, { backgroundColor: colors.primary }]} onPress={onScanAgain}>
                    <Ionicons name="scan" size={22} color="white" />
                    <Text style={styles.scanAgainText}>Scan Another</Text>
                </Pressable>
            </Animated.View>
        );
    }

    return (
        <Animated.View style={[styles.actionsCompact, { opacity, transform: [{ translateY }] }]}>
            <Pressable
                style={[
                    styles.primaryBtnCompact,
                    hasExited ? styles.letInBtn : styles.letOutBtn,
                ]}
                onPress={onPrimaryAction}
                disabled={isPending}
            >
                {isPending ? (
                    <ActivityIndicator size="small" color="white" />
                ) : (
                    <Ionicons
                        name={hasExited ? 'enter' : 'exit'}
                        size={22}
                        color="white"
                    />
                )}
                <Text style={styles.primaryBtnText}>
                    {isPending ? 'PROCESSING...' : hasExited ? 'LET IN' : 'LET OUT'}
                </Text>
            </Pressable>

            <Pressable style={[styles.scanAgainBtn, { backgroundColor: colors.primary }]} onPress={onScanAgain}>
                <Ionicons name="scan" size={22} color="white" />
                <Text style={styles.scanAgainText}>Scan Another</Text>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
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
});
