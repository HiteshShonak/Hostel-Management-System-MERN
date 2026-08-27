import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from '@/lib/contexts/theme';

interface GatePassQRSectionProps {
    qrValue: string;
    fromDate: string;
    toDate: string;
}

export function GatePassQRSection({ qrValue, fromDate, toDate }: GatePassQRSectionProps) {
    const { colors, isDark } = useTheme();

    return (
        <View style={[styles.qrSection, { borderTopColor: colors.cardBorder }]}>
            <View style={[styles.qrContainer, { backgroundColor: isDark ? colors.card : 'white' }]}>
                <QRCode
                    value={qrValue}
                    size={180}
                    color={colors.primary}
                    backgroundColor={isDark ? colors.card : 'white'}
                />
            </View>
            <Text style={[styles.qrCode, { color: colors.primary }]}>{qrValue}</Text>
            <Text style={[styles.qrHint, { color: colors.textSecondary }]}>Show this QR at the gate for verification</Text>
            <View style={[styles.validityInfo, { backgroundColor: isDark ? '#14532d' : '#dcfce7' }]}>
                <Ionicons name="calendar" size={14} color={colors.success} />
                <Text style={[styles.validityText, { color: isDark ? '#4ade80' : colors.success }]}>
                    Valid: {new Date(fromDate).toLocaleDateString()} - {new Date(toDate).toLocaleDateString()}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    qrSection: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, alignItems: 'center' },
    qrContainer: { padding: 20, borderRadius: 16, marginBottom: 12 },
    qrCode: { fontSize: 14, fontWeight: '700', letterSpacing: 2, marginTop: 8 },
    qrHint: { fontSize: 12, marginTop: 4 },
    validityInfo: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
    validityText: { fontSize: 12, fontWeight: '500' },
});
