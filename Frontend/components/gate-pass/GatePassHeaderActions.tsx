import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/lib/contexts/theme';
import type { User } from '@/lib/types';

interface GatePassHeaderActionsProps {
    user: User | null;
    isWarden: boolean;
    onApplyPress: () => void;
}

export function GatePassHeaderActions({
    user,
    isWarden,
    onApplyPress,
}: GatePassHeaderActionsProps) {
    const { colors, isDark } = useTheme();

    return (
        <View style={styles.container}>
            {/* Student: Apply Button (NOT for parents or warden) */}
            {!isWarden && user?.role !== 'parent' && (
                <Pressable
                    style={[styles.applyBtn, { backgroundColor: colors.primary }]}
                    onPress={onApplyPress}
                >
                    <Ionicons name="add-circle" size={20} color="white" />
                    <Text style={styles.applyBtnText}>Apply New Pass</Text>
                </Pressable>
            )}

            {/* Warden: Scan QR Button */}
            {isWarden && (
                <Pressable
                    style={[
                        styles.scanBtn,
                        {
                            backgroundColor: isDark ? '#14532d' : '#dcfce7',
                            borderColor: colors.success,
                        },
                    ]}
                    onPress={() => router.push('/shared/qr-scanner')}
                >
                    <View style={[styles.scanBtnIcon, { backgroundColor: colors.card }]}>
                        <Ionicons name="scan" size={28} color={colors.success} />
                    </View>
                    <View style={styles.scanBtnContent}>
                        <Text style={[styles.scanBtnTitle, { color: colors.success }]}>Scan QR Code</Text>
                        <Text style={[styles.scanBtnSubtitle, { color: isDark ? '#4ade80' : '#15803d' }]}>
                            Verify student gate passes
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color={colors.success} />
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginBottom: 16 },
    applyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 16,
        borderRadius: 12,
    },
    applyBtnText: { color: 'white', fontWeight: '600', fontSize: 16 },
    scanBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        padding: 16,
        borderRadius: 16,
        borderWidth: 2,
    },
    scanBtnIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
    scanBtnContent: { flex: 1 },
    scanBtnTitle: { fontSize: 18, fontWeight: '700' },
    scanBtnSubtitle: { fontSize: 14, marginTop: 2 },
});
