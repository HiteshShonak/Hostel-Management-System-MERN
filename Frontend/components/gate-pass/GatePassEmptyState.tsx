import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';

interface GatePassEmptyStateProps {
    isWarden: boolean;
}

export function GatePassEmptyState({ isWarden }: GatePassEmptyStateProps) {
    const { colors } = useTheme();

    return (
        <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color={colors.textTertiary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
                {isWarden ? 'No Pending Requests' : 'No Gate Passes'}
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                {isWarden
                    ? 'All gate pass requests have been processed'
                    : 'Apply for a pass when you plan to leave'}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    emptyState: { alignItems: 'center', paddingVertical: 60 },
    emptyTitle: { fontSize: 20, fontWeight: '600', marginTop: 16 },
    emptySubtext: { fontSize: 14, marginTop: 8, textAlign: 'center', paddingHorizontal: 32 },
});
