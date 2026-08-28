import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import type { Emergency } from '@/lib/types';

interface AlertActionButtonsProps {
    alert: Emergency;
    isAcknowledgePending: boolean;
    isResolvePending: boolean;
    onAcknowledge: (alert: Emergency) => void;
    onResolve: (alert: Emergency) => void;
}

/**
 * Status badge and action triggers (Acknowledge / Resolve) for an emergency alert.
 */
export function AlertActionButtons({
    alert,
    isAcknowledgePending,
    isResolvePending,
    onAcknowledge,
    onResolve,
}: AlertActionButtonsProps) {
    const { colors, isDark } = useTheme();
    const acknowledgedBy =
        typeof alert.acknowledgedBy === 'object' && alert.acknowledgedBy
            ? alert.acknowledgedBy
            : null;

    return (
        <>
            <View style={styles.statusRow}>
                <View
                    style={[
                        styles.statusBadge,
                        {
                            backgroundColor:
                                alert.status === 'active'
                                    ? isDark
                                        ? '#450a0a'
                                        : '#fef2f2'
                                    : isDark
                                    ? '#052e16'
                                    : '#f0fdf4',
                        },
                    ]}
                >
                    <View
                        style={[
                            styles.statusDot,
                            {
                                backgroundColor:
                                    alert.status === 'active' ? '#dc2626' : '#16a34a',
                            },
                        ]}
                    />
                    <Text
                        style={[
                            styles.statusText,
                            {
                                color:
                                    alert.status === 'active'
                                        ? isDark
                                            ? '#fca5a5'
                                            : '#dc2626'
                                        : isDark
                                        ? '#86efac'
                                        : '#16a34a',
                            },
                        ]}
                    >
                        {alert.status === 'active' ? 'Active' : 'Acknowledged'}
                    </Text>
                </View>
                {acknowledgedBy && (
                    <Text style={[styles.acknowledgedByText, { color: colors.textSecondary }]}>
                        by {acknowledgedBy.name}
                    </Text>
                )}
            </View>

            <View style={styles.actionRow}>
                {alert.status === 'active' && (
                    <Pressable
                        style={[
                            styles.actionBtn,
                            styles.acknowledgeBtn,
                            { opacity: isAcknowledgePending ? 0.6 : 1 },
                        ]}
                        onPress={() => onAcknowledge(alert)}
                        disabled={isAcknowledgePending || isResolvePending}
                    >
                        <Ionicons name="eye" size={16} color="#1d4ed8" />
                        <Text style={styles.acknowledgeBtnText}>Acknowledge</Text>
                    </Pressable>
                )}
                <Pressable
                    style={[
                        styles.actionBtn,
                        styles.resolveBtn,
                        { opacity: isResolvePending ? 0.6 : 1 },
                    ]}
                    onPress={() => onResolve(alert)}
                    disabled={isResolvePending || isAcknowledgePending}
                >
                    <Ionicons name="checkmark-circle" size={16} color="white" />
                    <Text style={styles.resolveBtnText}>Resolve</Text>
                </Pressable>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
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
});
