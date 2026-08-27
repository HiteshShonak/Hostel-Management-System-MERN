import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';

export type ScanResultType = 'success' | 'error' | 'invalid' | 'pending' | 'late' | 'expired';

export interface ScanResult {
    type: ScanResultType;
    message: string;
    pass?: any;
    status?: string;
    isLate?: boolean;
    lateNote?: string;
}

interface ScanResultStatusHeaderProps {
    scanResult: ScanResult;
    translateY: Animated.Value;
}

// Result status header banner with icon and status tag
export function ScanResultStatusHeader({
    scanResult,
    translateY,
}: ScanResultStatusHeaderProps) {
    const { colors } = useTheme();

    const getIconName = () => {
        switch (scanResult.type) {
            case 'success':
                return 'checkmark-circle';
            case 'late':
                return 'time';
            case 'expired':
                return 'warning';
            case 'pending':
                return 'hourglass';
            default:
                return 'close-circle';
        }
    };

    const getStatusTitle = () => {
        switch (scanResult.type) {
            case 'success':
                return 'VALID';
            case 'late':
                return 'LATE RETURN';
            case 'expired':
                return 'EXPIRED';
            case 'pending':
                return 'NOT YET';
            default:
                return 'REJECTED';
        }
    };

    const getStatusColor = () => {
        switch (scanResult.type) {
            case 'success':
                return '#16a34a';
            case 'late':
                return '#ea580c';
            case 'expired':
                return '#dc2626';
            case 'pending':
                return '#d97706';
            default:
                return '#dc2626';
        }
    };

    return (
        <Animated.View
            style={[
                styles.statusHeader,
                { backgroundColor: colors.card, transform: [{ translateY }] },
            ]}
        >
            <View
                style={[
                    styles.statusIconCompact,
                    scanResult.type === 'success' && styles.statusSuccess,
                    scanResult.type === 'late' && styles.statusLate,
                    scanResult.type === 'expired' && styles.statusExpired,
                    scanResult.type === 'pending' && styles.statusPending,
                    (scanResult.type === 'error' || scanResult.type === 'invalid') && styles.statusError,
                ]}
            >
                <Ionicons name={getIconName()} size={32} color="white" />
            </View>
            <View style={styles.statusTextContainer}>
                <Text style={[styles.statusTitleCompact, { color: getStatusColor() }]}>
                    {getStatusTitle()}
                </Text>
                <Text style={[styles.statusMessageCompact, { color: colors.textSecondary }]}>
                    {scanResult.message}
                </Text>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
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
    statusSuccess: { backgroundColor: '#16a34a' },
    statusLate: { backgroundColor: '#ea580c' },
    statusExpired: { backgroundColor: '#dc2626' },
    statusPending: { backgroundColor: '#d97706' },
    statusError: { backgroundColor: '#dc2626' },
});
