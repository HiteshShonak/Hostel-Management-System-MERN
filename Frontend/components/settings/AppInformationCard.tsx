import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';

/**
 * Readonly app metadata card displaying version and maintainers.
 */
export function AppInformationCard() {
    const { colors, isDark } = useTheme();

    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <View style={[styles.sectionIconBox, { backgroundColor: isDark ? '#172554' : '#eff6ff' }]}>
                    <Ionicons name="information-circle" size={20} color={colors.primary} />
                </View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>App Information</Text>
            </View>

            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Version</Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>1.0.0</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Build</Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>Release (Expo SDK 54)</Text>
                </View>
                <View style={[styles.infoRow, styles.lastRow, { borderBottomColor: colors.cardBorder }]}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Developer</Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>HMS Team</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: { gap: 12 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    sectionIconBox: { padding: 8, borderRadius: 8 },
    sectionTitle: { fontSize: 18, fontWeight: '600' },
    card: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        gap: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    lastRow: { borderBottomWidth: 0 },
    infoLabel: { fontSize: 14 },
    infoValue: { fontSize: 14, fontWeight: '500' },
});
