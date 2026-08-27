import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';

interface ComplaintEmptyStateProps {
    isWarden: boolean;
}

export function ComplaintEmptyState({ isWarden }: ComplaintEmptyStateProps) {
    const { colors } = useTheme();

    return (
        <View style={styles.emptyState}>
            <Ionicons name="chatbox-ellipses-outline" size={64} color={colors.textTertiary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Complaints</Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                {isWarden ? 'No complaints to review' : 'Lodge a complaint if you face any issues'}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    emptyState: { alignItems: 'center', paddingVertical: 60 },
    emptyTitle: { fontSize: 20, fontWeight: '600', marginTop: 16 },
    emptySubtext: { fontSize: 14, marginTop: 8, textAlign: 'center' },
});
