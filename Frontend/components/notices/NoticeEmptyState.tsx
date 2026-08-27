import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';

interface NoticeEmptyStateProps {
    isWarden: boolean;
}

export function NoticeEmptyState({ isWarden }: NoticeEmptyStateProps) {
    const { colors } = useTheme();

    return (
        <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color={colors.textTertiary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Notices</Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                {isWarden
                    ? 'Issue a new notice to inform students'
                    : 'There are no notices at the moment'}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    emptyState: { alignItems: 'center', paddingVertical: 60 },
    emptyTitle: { fontSize: 20, fontWeight: '600', marginTop: 16 },
    emptySubtext: { fontSize: 14, marginTop: 8, textAlign: 'center', paddingHorizontal: 32 },
});
